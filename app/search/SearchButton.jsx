'use client'
import { useState } from "react";

export default function SearchButton({searchQuery, setSearchQuery}) {
    return (
        <input
            className={`py-2 pr-4 pl-8 w-[100%] mx-auto my-2 bg-white morphx`}
            type="text"
            defaultValue={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
        />
    )
}
