"use client";
import { useParams } from "next/navigation";

export default function EventPage () {
    const { id } = useParams<{ id: string }>();
    
    return (
      <div className="container max-w-4xl py-8 min-h-screen">
        Event: {id}
      </div>
    );
  };