"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import "./page.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: userTweets } = await supabase
        .from("tweets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setProfile(profileData);
      setTweets(userTweets || []);
      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profilePage">
      <div className="banner"></div>
      <div className="profileInfo">
        <img
          src={profile?.avatar_url || "/default-avatar.png"}
          alt="Avatar"
          className="avatar"
        />
        <h2>{profile?.display_name}</h2>
        <p className="username">@{profile?.username}</p>
        <p className="bio">{profile?.bio || "No bio yet."}</p>
        <p className="joined">
          Joined {new Date(profile?.created_at).toLocaleDateString()}
        </p>
        <div className="buttons">
          <button onClick={() => router.push("/edit-profile")}>Edit Profile</button>
          <button onClick={handleLogout} className="logout">
            Log out
          </button>
        </div>
      </div>

      <div className="tweetsSection">
        <h3>Tweets</h3>
        {tweets.length === 0 ? (
          <p>No tweets yet.</p>
        ) : (
          tweets.map((t) => (
            <div key={t.id} className="tweetCard">
              <p>{t.content}</p>
              <span>{new Date(t.created_at).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
