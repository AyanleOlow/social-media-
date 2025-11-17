import Image from "next/image";
import './page.css'


export default function Post() {
  return (
    <section className="screen">

    
   

    <section className="post">

     <section className="postText">

      <input className="postText" type="text" placeholder="whats happening" />

     </section>
     <section className="box"> 
     <div className="postBox">
     <div className="gif"><i className="fi fi-sr-gif-square"></i></div>
     <div className="poll"><i className="fi fi-sr-poll-h"></i></div>
     <div className="img-upload"> <label htmlFor="img" className="upload-label"> <i className="fi fi-sr-picture"></i> </label> <input type="file" id="img" name="img" accept="image/*" className="hidden-input" /> </div>      </div>
     <div className="postBtn"><button>post</button></div>
     </section>


    </section>
     
  

    

    </section>
  );
}
