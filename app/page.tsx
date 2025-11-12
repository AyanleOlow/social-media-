import Image from "next/image";
import './page.css'
import Navbar from './components/navbar/page'
import Trends from './components/trends/page'
import Post from './components/post/page'
import Feed from './components/feed/page'


export default function Home() {
  return (
    <section className="screen">

    
     <Navbar />

     <div className="post_feed">
    
    <Post />

    <Feed />
    
     </div>

     <Trends />

    

    </section>
  );
}
