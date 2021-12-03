import { Link } from "gatsby"
import React from "react"
import { getCategoryURL } from "../utils/url";
import ImageNotFound from "./../assets/allimg.jpg"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Steth from "./../assets/steth.png"
import Doc from "./../assets/hot_deals.png"
import Glove from "./../assets/glove.png"
import StarRatings from 'react-star-ratings';


const Deals = () => {
    

    return ( <div className="hotoffer_banner">
    <div className="container">
<div className="row">
  <div className="col-lg-4 text-center">
  <h2 className="section_title">
                    <span>Featured Products</span>
                   
                    </h2>

  <img className="HF_BImg" src={Doc} alt={"banner"}/> 
  </div>
  <div className="col-lg-8 padding_se">
    <h6> Todays Hot Offer</h6>
    <h2>Buy all your medicines @ 50% Offer</h2>

    <p>Get extra cashback with great deals & discount</p>

    <div className="timer">
      <div className="bg_white">
        <h1>93</h1>
        <p className="sep">Days</p>
      </div>
      <div className="bg_white">
        <h1>06</h1>
        <p className="sep">Hrs</p>
      </div>
      <div className="bg_white">
        <h1>54</h1>
        <p className="sep">Mins</p>
      </div>
      <div className="bg_white">
        <h1>00</h1>
        <p className="sep">Secs</p>
      </div>
    </div>

    <div className="button_sec">
    <button type="button" class="btn btn-primary">Shop Now</button>
    <a href="#">Deal of the day</a>
    </div>
  </div>
</div>
</div>
  </div>



    )

}

export default Deals     



