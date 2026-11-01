"use client";

import { getStories, createStory, deleteStory } from "@/app/utils/story-manager";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StoryList()
{
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const data = getStories();
        setStories(data ? data.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)) : []);
    }, []);

    const [writerId, setWriterId] = useState(null);

    useEffect(() => {
        if(localStorage.getItem("writerId"))
        {
            setWriterId(localStorage.getItem("writerId"));
            return;
        }

        const id = "writer_" + crypto.randomUUID();
        
        localStorage.setItem("writerId", id);
        setWriterId(id);
    }, [])

    const router = useRouter();

    function generateExcerpt(content) 
    {
        const excerpt = content.replace(/\s+/g, " ").trim();

        if(excerpt.length <= 180) 
        {
            return excerpt;
        }

        return excerpt.slice(0, 180).trim() + "…";
    }

    function generateLastUpdatedTimestamp(updatedAt) 
    {
        const timestamp = new Date(updatedAt).getTime();
        const now = Date.now();

        const diffMs = now - timestamp;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        if(diffMin < 1)
        {
            return "Last edited just now";
        }

        else if(diffMin < 60) 
        {
            return `Last edited ${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
        }

        else if(diffHr < 24)
        {
            return `Last edited ${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
        }

        else if(diffDay < 7)
        {
            return `Last edited ${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
        }

        const datetime = new Date(timestamp).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).replace(",", " ·");

        return `Last edited ${datetime}`;
    }

    return (
        <div className="stories">
            <div className="new-story" onClick={() => {
                const story = createStory(writerId);
                router.push(`/story/${story.id}`);
            }}>+</div>

            <h2 className="story-list-label">Stories</h2>
            <div className="story-list">
                {stories.map((story) => (
                    <Link key={story.id} href={`/story/${story.id}`} className="story-card">
                        <div className="story-header">
                            <h2 className="story-title">{story.title}</h2>
                            <div className="story-delete-container">
                                <button className="story-delete-button" onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    deleteStory(story.id);
                                    setStories((prev) => prev.filter(s => s.id !== story.id)); 
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                        <path d="M0 0h24v24H0z" fill="none" />
	                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16l-1.58 14.22A2 2 0 0 1 16.432 22H7.568a2 2 0 0 1-1.988-1.78zm3.345-2.853A2 2 0 0 1 9.154 2h5.692a2 2 0 0 1 1.81 1.147L18 6H6zM2 6h20m-12 5v5m4-5v5" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <p className="story-info">
                            {story.genre && (
                                `${story.genre} · `
                            )}

                            {story.type === "solo" ? "Solo" : "Collaborative"}
                        </p>

                        <p className="story-excerpt">{generateExcerpt(story.content) || "Start writing..."}</p>

                        <p className="story-last-update">{generateLastUpdatedTimestamp(story.updatedAt || story.createdAt)}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}