import Image from "next/image";
import './page.css'
import Navbar from './components/navbar/page'
import Trends from './components/trends/page'

export default function Home() {
  return (
    <section className="screen">

    
     <Navbar />


     <Trends />

    

    </section>
  );
}
