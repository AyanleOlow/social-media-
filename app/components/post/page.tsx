"use client";

import { useState } from "react";
import Image from "next/image";
import Giphy from "../../components/giphy/page"; // import GIF picker
import "./page.css";

export default function Post() {
  const [showGifBox, setShowGifBox] = useState(false);
  const [selectedGif, setSelectedGif] = useState("");

  return (
    <section className="screen">
      <section className="post">

        <section className="postText">
          <input className="postText" type="text" placeholder="whats happening" />

           {/* GIF BOX */}
          {showGifBox && (
            <Giphy 
              onSelect={(gifUrl) => {
                setSelectedGif(gifUrl);
                setShowGifBox(false);
              }}
            />
          )}

        </section>

        {selectedGif && (
          <div className="gif-preview">
            <img src={selectedGif} alt="GIF" />
          </div>
        )}

        <section className="box"> 
          <div className="postBox">

            <div 
              className="gif" 
              onClick={() => setShowGifBox(!showGifBox)}
            >
              <i className="fi fi-sr-gif-square"></i>
            </div>

            <div className="poll">
              <i className="fi fi-sr-poll-h"></i>
            </div>

          
            <div className="img-upload"> 
              <label htmlFor="img" className="upload-label">
                <i className="fi fi-sr-picture"></i>
              </label>
              <input type="file" id="img" accept="image/*" className="hidden-input" />
            </div>

          </div>

          <div className="postBtn">
            <button>post</button>
          </div>

         
        </section>

      </section>
    </section>
  );
}
