import React, { useState, useEffect } from "react";
import StarRatings from 'react-star-ratings';
import { Link } from "gatsby"
import { getCategoryURL } from "../utils/url";
import ImageNotFound from "./../assets/allimg.jpg"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Steth from "./../assets/steth.png"
import Doc from "./../assets/hot_deals.png"
import Glove from "./../assets/glove.png"
import {getProductURL} from './../utils/url';


const feature_slide = {
  autoplay: false,
  speed: 1000,
  slidesToShow:5,
  slidesToScroll: 1,
  infinite: true,
  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },

  ]
}


const Deals = () => {
  const [dealProducts, setDealsofday] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [jwt, setJwt] = useState("");
  const [quote_id, setQuoteId] = useState("");

  useEffect(() => {
    setCustomerId(localStorage.customer_id)
    setJwt(localStorage.userToken)
    setQuoteId(localStorage.cartId)

    const fetchFeature = async () => {
        const res = await fetch(
            `${process.env.GATSBY_CART_URL_STARCARE}category/dealsofthedays/38`
        );
        const json = await res.json();
        await setDealsofday(json);
         
    };
    fetchFeature();
  
}, []);


const renderDeals = ()=>{
  if (dealProducts) { 
    return  <>
{
    dealProducts.map((data,index)=>(
<div key={`${data.sub_category}_${index}`}>
  
    <div>
      
    </div>
  ))
<div className="card">
<div className="image_wrapper">
<Link to={getProductURL(data)}><img src={data.image}/></Link>
</div>
</div>
</div>
    ))

  }
    </>
}
}

    return ( <div className="hotoffer_banner">
    <div className="container">
<div className="row">
  <div className="col-lg-4 text-center">
  <h2 className="section_title">
                    <span>Hot Deals</span>
                   
                    </h2>

  <img className="HF_BImg" src={Doc} alt={"banner"}/> 
  </div>
  <div className="col-lg-8 padding_se">
  <h2 className="section_title"><span>Deal of the Day</span></h2>
  sadasdasd
  </div>
</div>
</div>
  </div>



    )

}

export default Deals     



