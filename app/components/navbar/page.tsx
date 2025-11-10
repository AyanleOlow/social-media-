import Image from "next/image";
import './page.css'


export default function Navbar() {
  return (
    <section>
      <section className="navbar">
        <a href="" className="logo"><i className="fi fi-sr-crow"></i></a>
        <a href="" ><b><h1 className="home" >home <i className="fi fi-sr-house-chimney"></i> </h1></b></a>
        <a href="" ><b><h1 className="notification" >notification <i className="fi fi-ss-bell-notification-social-media"></i> </h1></b></a>
        <a href="" ><b><h1 className="messages" >messages <i className="fi fi-ss-comment-dots"></i> </h1></b></a>
        <a href="" ><b><h1 className="favoritt" >favoritt <i className="fi fi-sr-bookmark"></i> </h1></b></a>
        <a href=""><b><h1>profile</h1></b></a>
        <a href=""><b><h1></h1></b></a>

      </section>
    </section>
  );
}
