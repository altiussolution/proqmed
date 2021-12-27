import React, { useState, useEffect } from "react";
import StarRatings from 'react-star-ratings';
import { Link } from "gatsby"
import ImageNotFound from "./../assets/allimg.jpg"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Steth from "./../assets/steth.png"
import Doc from "./../assets/hot_deals.png"
import maskgirl from "./../assets/mask_girl.png"
import Glove from "./../assets/glove.png"
import { getProductURL, getCategoryURL } from "./../utils/url";
import { Slide } from 'react-slideshow-image';
import Slider from "react-slick";

const dealofday = {
  autoplay: false,
  speed: 1000,
  slidesToShow:2,
  slidesToScroll: 1,
  infinite: true,
  responsive: [
    {
      breakpoint: 600

    },

  ]
}




const Deals = () => {
  const [dealProducts, setDealsofday] = useState([]);
  const [hotProducts, setHotsofday] = useState([]);
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
         console.log(json)
    };
    const fetchHot = async () => {
      const res = await fetch(
          `${process.env.GATSBY_CART_URL_STARCARE}category/hotdeals`
      );
      const json = await res.json();
      await setHotsofday(json);
       console.log(json)
  };
    fetchFeature();
    fetchHot();
}, []);


const renderHots =()=>{
  if(hotProducts.length ==0){
    return (
<div className="col-lg-4 text-center">
  <h2 className="section_title">
                    <span>Hot Deals</span>
                    </h2>
                    {
    hotProducts.map((data,index)=>(
      <Link to="/hotDeals">
  <img className="HF_BImg" src={data.category_image} alt={"banner"}/></Link> )) }
  </div>
    )

  }else {
    return (
      <div className="col-lg-4 text-center">
        <h2 className="section_title">
                          <span>Hot Deals</span>
                          </h2>
          <div>No Products found</div>
        </div>
          )
  }
}

const renderDeals = ()=>{
  if (dealProducts) { 
    return  <Slider {...dealofday}> 
{
    dealProducts.map((data,index)=>(
  <div className="card" key={`${data.sub_category}_${index}`}>
      <h5 className="title_link"><Link to={getCategoryURL(data.sub_category)}>{data.sub_category.name}</Link></h5>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      <ul>
      {data.sub_category.sub_category_sub.slice(0,4).map((value,index)=>(
        
 <><li>
 <div className="image_wrapper">
          <Link to={getProductURL(value)}><img src={value.image} /></Link>
        </div><div className="description_list">
            <Link to={getProductURL(value)}>{value.name}</Link>
          </div>
          </li>
          </> 
))}
 </ul>

</div>

    ))

  }
    </Slider>
}
}

    return ( 
    <div className="hotoffer_banner">
      <div className="container">
        <div className="row">
          {/* {renderHots()} */}
          <div className="col-lg-4">
            <h2 className="section_title"><span>Hot Deals</span></h2>
            <div className="hotdeals">
              <span className="badge_onsale">On Sale</span>
              <div className="hot_title">
                <div>
              <h1>Mask & Gloves</h1>
              <h2>during pandemic</h2>
              </div>
              <button type="button" class="btn_proceed"></button>
              </div>
              <div className="img-gradient">
              <img src={maskgirl}></img>
              </div>
            </div>
          </div>
  <div className="col-lg-8 padding_se">
  <h2 className="section_title if_has_nav"><span>Deal of the Day</span>
  <span><Link to="/dealProducts">+ View all Products</Link></span>
  </h2>
  <div className="dod_inner">
  {renderDeals()}
  </div>
  </div>
</div>

<div className="af-tr-banner">
        <h1>Buying Medical Devices 
Online Should Be Easy</h1>
<button className="btn btn update" type="button">Read More </button>
      </div>
</div>


  </div>



    )

    

}

export default Deals     



