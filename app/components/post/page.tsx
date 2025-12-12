"use client";

import { useState } from "react";
import Giphy from "../../components/giphy/page";
import "./page.css";

export default function Post() {
  const [showGifBox, setShowGifBox] = useState(false);
  const [selectedGif, setSelectedGif] = useState("");
  const [content, setContent] = useState("");

  async function handlePost() {
    if (!content.trim()) return alert("Write something first!");

    const res = await fetch("/api/tweets/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        gif: selectedGif || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to post");
      return;
    }

    window.location.href = "/feed";
  }

  return (
    <section className="screen">
      <section className="post">

        <section className="postText">
          <textarea
            className="postText"
            placeholder="whats happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="img_gifs">
           
            {showGifBox && (
              <Giphy
                onSelect={(gifUrl: string) => {
                  setSelectedGif(gifUrl);
                  setShowGifBox(false);
                }}
              />
            )}

            {selectedGif && (
              <div className="gif-preview">
                <img src={selectedGif} className="img" />
              </div>
            )}
          </div>
        </section>

        <section className="box">
          <div className="postBox">
            <div className="gif" onClick={() => setShowGifBox(!showGifBox)}>
              <i className="fi fi-sr-gif-square"></i>
            </div>

            <div className="poll"><i className="fi fi-sr-poll-h"></i></div>

            <div className="img-upload">
              <label htmlFor="img" className="upload-label">
                <i className="fi fi-sr-picture"></i>
              </label>
              <input type="file" id="img" accept="image/*" className="hidden-input" />
            </div>
          </div>

          <button onClick={handlePost}>Post</button>
        </section>

      </section>
    </section>
  );
}
