import Image from "next/image";
import './page.css'
import Navbar from './components/navbar/page'

export default function Home() {
  return (
    <section className="screen">

    
     <Navbar />

    <section className="rightSide">
    <input className="search" type="search" />
    </section>

    </section>
  );
}
