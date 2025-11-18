 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import './page.css'




export default function Profile() {

  // Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
    const [username, setUsername] = useState("");


  return (
    <section className="screen">

    
    <h1>welcome {username}</h1>

    

    </section>
  );
}
