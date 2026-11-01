"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from 'react';
import { getStory } from "@/app/utils/story-manager";
import StoryEditor from "@/components/StoryEditor";
import "@/app/css/story.css";

export default function Story()
{
    const params = useParams();
    const id = params.id;

    const [story, setStory] = useState(null);

    useEffect(() => {
        if(id)
        {
            const data = getStory(id);
            setStory(data ? data : null);
        }
    }, [id])

    return (
        <StoryEditor story={story} setStory={setStory}/>
    )
}