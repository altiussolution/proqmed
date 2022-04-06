import React from "react"
import bannerMid from './../assets/banner_mid.jpg';
import { ImageNotFound } from "./../assets/not-found.png"


const BannerMid = () => ( <section className = "add-banner upper-space" >
    <div className="container">
        <img src={bannerMid} onError={e => (e.target.src = ImageNotFound)}></img>
        </div> 
     </section>
)

export default BannerMid