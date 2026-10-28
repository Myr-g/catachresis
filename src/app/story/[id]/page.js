"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';

export default function StoryEditor()
{
    const params = useParams();
    const id = params.id;
    
    return (
        <h1>Routing works</h1>
    )
}