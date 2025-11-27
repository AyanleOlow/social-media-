"use client";

import { useState } from "react";
import supabase from "@/app/utils/supabaseClient";
import Giphy from "../../components/giphy/page"; 
import "./page.css";

export default function Post() {
  const [showGifBox, setShowGifBox] = useState(false);
  const [selectedGif, setSelectedGif] = useState("");

  async function handlePost() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return alert("You must be logged in");

    const user = session.user;
    const content = document.querySelector("textarea")?.value || "";

    // 🔥 GET PROFILE from Supabase (so feed shows Name)
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, display_name")
      .eq("id", user.id)
      .single();

    // 🔥 Insert tweet with profile values
    const { error } = await supabase.from("tweets").insert({
      user_id: user.id,
      content,
      gif: selectedGif || null,
      username: profile?.username,
      display_name: profile?.display_name,
    });

    if (error) console.log(error);
    else window.location.href = "/feed";
  }

  return (
    <section className="screen">
      <section className="post">

        <section className="postText">
          <textarea className="postText" placeholder="whats happening" />

          <div className="img_gifs">
            {/* GIF PICKER */}
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
              <label htmlFor="img" className="upload-label"><i className="fi fi-sr-picture"></i></label>
              <input type="file" id="img" accept="image/*" className="hidden-input" />
            </div>
          </div>

          <button onClick={handlePost}>Post</button>
        </section>
      </section>
    </section>
  );
}
