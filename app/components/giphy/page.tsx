"use client";

import { useState } from "react";
import "./page.css";

export default function GifPicker({ onSelect }: { onSelect: (url: string) => void }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const searchGIFs = async () => {
    if (!search) return;

    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${process.env.NEXT_PUBLIC_GIPHY_KEY}&q=${search}&limit=20`
    );

    const data = await res.json();
    setResults(data.data);
  };

  return (
    <div className="gif-box">
      <div className="gif-header">
        <input
          className="gif-search"
          placeholder="Search GIFs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={searchGIFs} className="gif-search-btn">Search</button>
      </div>

      <div className="gif-grid">
        {results.map((gif) => (
          <img
            key={gif.id}
            src={gif.images.fixed_width_small.url}
            className="gif-item"
            onClick={() => onSelect(gif.images.original.url)}
          />
        ))}
      </div>
    </div>
  );
}
