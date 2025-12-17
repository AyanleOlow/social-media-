"use client";

import { useEffect, useState } from "react";
import "./page.css";

export default function Feed() {
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 async function loadTweets() {
  const res = await fetch("/api/tweets/new", {
    credentials: "include", 
  });

  const data = await res.json();
  setTweets(data);
  setLoading(false);
}


  useEffect(() => {
    loadTweets();
  }, []);


  return (
    <section className="screen">
      <section className="feedContainer">
        {tweets.length === 0 && <p className="empty">No posts yet.</p>}

        {tweets.map((tweet) => (
          <div key={tweet.id} className="tweetCard">
            <div className="tweetHeader">
              <h3>{tweet.display_name}</h3>
              <p className="username">@{tweet.username}</p>
            </div>

            <p className="tweetText">{tweet.content}</p>

            {tweet.gif && <img src={tweet.gif} className="tweetGIF" />}

            <p className="timestamp">
              {new Date(tweet.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </section>
    </section>
  );
}
   