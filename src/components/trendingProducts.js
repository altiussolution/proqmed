
import React, { useState, useEffect } from "react";
import StarRatings from 'react-star-ratings';
import { getProductURL } from './../utils/url';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "gatsby";
const banner_slide = {
  autoplay: false,
  speed: 1000,
  slidesToShow:3,
  slidesToScroll: 3,
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
const TrendingProducts = () => {

    const [trendingProducts, setTrendingProducts] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      const res = await fetch(
        `${process.env.GATSBY_CART_URL_STARCARE}admin/trendingproducts` 
      );
      const json = await res.json();
      await setTrendingProducts(json);
    };
    fetchTrending();
  }, []);

  const renderProducts = () => {
    if (trendingProducts) {
      return   <Slider {...banner_slide}> 
      
{/* <div className="col-4 single_trending"> */}
        {
          trendingProducts.map((data, index) => (
            <div key={`${data.name}_${index}`} className="">
              {/* <div className="" > */}
              <Link to={getProductURL(data)}>
                <div className="card">

                  <div className="image_wrapper">
                    <img src={data.image} />

                  </div>

                  <h5 className="prod-title">{data.name}</h5>
                  <div className="img_content">
                    

                    <StarRatings
                      rating={Math.round(data.rating)}
                      numberOfStars={5}
                      name='rating'
                      starDimension="15px"
                      starSpacing="0px"
                      starRatedColor="rgb(242 187 22)"
                    />

                    <div>
                      <span className="price">$ {Math.round(data.price)}</span>
                      <span className="off_txt_lft">$000</span>
                    </div>
                  </div>

                </div>
                </Link>
              {/* </div> */}
            </div>
          ))
        }
        {/* </div> */}
        {/* <div className="col-8">
          <div className="row">
        {
          trendingProducts.slice(1 ,7).map((data, index) => (
            <div key={`${data.name}_${index}`} className="col-4 col">
              <div className="" >
              <Link to={getProductURL(data)}>
                <div className="card">

                  <div className="image_wrapper">
                    <img src={data.image} />
                  </div>
                  <div className="img_content">
                    <h5 className="prod-title">{data.name.slice(0,55)}...</h5>
                  </div>
                </div>
                </Link>
              </div>
            </div>
          ))
        }
        </div>
        </div> */}
        
    
     </Slider> 
    }
  }


  return (
    
    <section className="popular_section trending_products">
      <div className="container">
        <div className="row">
      <h2 className="section_title">
              <span>Trending Products</span>
              <span><Link to="/trendingProducts">+ View all Products</Link></span>
            </h2>
            </div>
           
            <div className="row">
            
            <div className="col-lg-12 col" >
           
              {renderProducts()}
              
             
            </div>
           
            </div>
           
      </div>
    </section>
   
  )

}

export default TrendingProducts