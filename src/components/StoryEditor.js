"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { saveStory } from "@/app/utils/StoryManager";

export default function StoryEditor({ story, setStory })
{
    const [showSettings, setShowSettings] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    const autosaveTimeout = useRef(null);
    const isSaving = useRef(false);
    const isDirty = useRef(false);
    const [saveStatus, setSaveStatus] = useState("saved");

    function updateTitle(title)
    {
        let newTitle = title.trim();

        if(newTitle === "")
        {
            newTitle = "Untitled"
        }

        setStory(prev => ({ ...prev, title: newTitle }));
        saveStory({ ...story, title: newTitle});

        return newTitle;
    }

    function updateContent(content)
    {
        if(!isDirty.current)
        {
            isDirty.current = true;
            setSaveStatus("saving...");
        }

        const updatedStory = {...story, content: content, updatedAt: new Date().toISOString()};
        setStory(updatedStory);

        clearTimeout(autosaveTimeout.current);

        autosaveTimeout.current = setTimeout(() => {
            save(updatedStory);
        }, 1500);
    }

    function save(story)
    {
        if(isSaving.current)
        {
            return;
        }

        isSaving.current = true;
        
        saveStory(story);

        isDirty.current = false;
        setSaveStatus("saved");
        isSaving.current = false;
    }

    if(!story) 
    {
        return null;
    }

    return (
        <div className="writing-workspace">
            <div className="workspace-header">
                <Link href={"/"} className="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
	                    <path fill="currentColor" d="M16.62 2.99a1.25 1.25 0 0 0-1.77 0L6.54 11.3a.996.996 0 0 0 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76" />
                    </svg>
                </Link>

                <input className="story-title" defaultValue={story.title} onBlur={(e) => e.target.value = updateTitle(e.target.value)} onKeyDown={(e) => {
                    if(e.key === "Enter")
                    {
                        e.target.blur();   
                    }

                    if(e.key === "Escape")
                    {
                        e.target.value = story.title;
                        e.target.blur();
                    }
                }}></input>

                <button className="settings-toggle" onClick={() => setShowSettings(!showSettings)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
	                    <path d="M0 0h24v24H0z" fill="none" />
	                    <path fill="currentColor" d="m19.44 12.99l-.01.02c.04-.33.08-.67.08-1.01s-.03-.66-.07-.99l.01.02l2.44-1.92l-2.43-4.22l-2.87 1.16l.01.01c-.52-.4-1.09-.74-1.71-1h.01L14.44 2H9.57l-.44 3.07h.01c-.62.26-1.19.6-1.71 1l.01-.01l-2.88-1.17l-2.44 4.22l2.44 1.92l.01-.02c-.04.33-.07.65-.07.99s.03.68.08 1.01l-.01-.02l-2.1 1.65l-.33.26l2.43 4.2l2.88-1.15l-.02-.04c.53.41 1.1.75 1.73 1.01h-.03L9.58 22h4.85s.03-.18.06-.42l.38-2.65h-.01c.62-.26 1.2-.6 1.73-1.01l-.02.04l2.88 1.15l2.43-4.2s-.14-.12-.33-.26zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5" />
                    </svg>
                </button>

                <div className={showSettings ? "story-settings open" : "story-settings"}>
                    <div className="story-settings-item">
                        <label>Genre</label>
                        <select className="genre">
                            <option value="">None</option>
                        </select>
                    </div>

                    <div className="story-settings-item">
                        <label>Mode</label>
                        <div className="story-type-toggle">
                            <button className="story-type active">Solo</button>
                            <button className="story-type">Collaborative</button>
                        </div>
                    </div>

                    <div className="story-settings-item">
                        <label>Prompt</label>
                        <div className="prompt-type-toggle">
                            <button className="prompt-type active" data-type="none">None</button>
                            <button className="prompt-type" data-type="template">Template</button>
                            <button className="prompt-type" data-type="challenge">Challenge</button>
                            <button className="prompt-type" data-type="community">Community</button>
                        </div>
                    </div>
                </div>
            </div>

            {story.promptType !== "none" && (
                <div className="workspace-prompt" hidden>
                    <h3>{story.prompt}</h3>
                    <button type="button" title="Prompt is locked once you begin writing.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
	                        <path d="M0 0h24v24H0z" fill="none" />
	                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
		                        <path d="M20.5 8c-1.392-3.179-4.823-5-8.522-5C7.299 3 3.453 6.552 3 11.1" />
		                        <path d="M16.489 8.4h3.97A.54.54 0 0 0 21 7.86V3.9M3.5 16c1.392 3.179 4.823 5 8.522 5c4.679 0 8.525-3.552 8.978-8.1" />
		                        <path d="M7.511 15.6h-3.97a.54.54 0 0 0-.541.54v3.96" />
	                        </g>
                        </svg>
                    </button>
                </div>
            )}

            <div className="workspace-editor">
                <textarea className="story-content" value={story.content} onChange={(e) => updateContent(e.target.value)} placeholder="You may begin writing..."></textarea>
            </div>

            <div className="workspace-footer">
                <div className="actions">
                    <button className={"save-story"} onClick={() => {save(story); clearTimeout(autosaveTimeout.current);}}>Save</button>
                    <div className="save-status">
                        {saveStatus === "saving..." && (
                            <span className="save-icon saving">
                                <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                                    <path d="M12 3a9 9 0 0 1 9 9" />
                                </svg>
                            </span>
                        )}

                        {saveStatus === "saved" && (
                            <span className="save-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="9"/>
                                    <path d="M8 12.5l2.5 2.5L16 9.5"/>
                                </svg>
                            </span>
                        )}
                        
                        {saveStatus === "failed" && (
                            <span className="save-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="9"/>
                                    <path d="M9 9l6 6"/>
                                    <path d="M15 9l-6 6"/>
                                </svg>
                            </span>
                        )}
                        <span className={saveStatus === "saved" ? "save-text hidden" : "save-text"}>{saveStatus}</span>
                    </div>
            
                    <div className="download-container">
                        <button className="download-button" onClick={() => setShowDownloadMenu(!showDownloadMenu)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                        </button>

                        <div className={showDownloadMenu ? "download-menu open" : "download-menu"}>
                            <button className="txt-download">TXT</button>
                            <button className="pdf-download">PDF</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}