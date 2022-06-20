
import React, { useState, useEffect } from "react";
import StarRatings from 'react-star-ratings';
import { getProductURL } from './../utils/url';
import Slider from "react-slick";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {getWLCount, wishListCount,viewCartItems,getCartCount } from '../utils/apiServices'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { navigate } from "gatsby";
import { Link } from "gatsby";
const banner_slide = {
  autoplay: false,
  speed: 1000,
  slidesToShow:2,
  slidesToScroll: 2,
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
  const [qty, setQty] = useState(1);
  const [quote_id, setQuoteId] = useState("");
  const [jwt, setJwt] = useState("");
  const [cartCnt, setCartCnt] = useState(getCartCount())
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [pcar,percart] = useState(false);
    const [outpcar,outpercart] = useState(false);
    const [permits,setPermit] = useState([]);
    const [currency,setCurrency]=useState();
  useEffect(() => {
    setPermit(localStorage.permissions)
    const jwt = localStorage.getItem('userToken')
    if(jwt){
      try
      {    
        axios({
          method : 'post',
          url: `${process.env.GATSBY_CART_URL_STARCARE}carts/mine`,
          headers : {
              'Authorization' : `Bearer ${jwt}`
          }
        })
        .then((response) => {
          if(response.statusText === "OK" && response.status == 200)
          {
            console.log(response.data)
              localStorage.setItem('cartId',response.data);
              setQuoteId(localStorage.cartId)

              //viewCartItems()
            //  localStorage.removeItem('cartData', []);
          }
        }) 
        .catch((error) => {
          console.error(error,'error')
        })
      }catch(err){
        console.error(err);
        toast.error('something went wrong')
      }
    }else{
        
    }
  if(!localStorage.permissions){
    outpercart(true)
  }else {
    let hi = JSON.parse(localStorage.permissions)
    let addcar=hi.includes("Can Add To Cart")
    percart(addcar)
  }
    const fetchTrending = async () => {
      const res = await fetch(
        `${process.env.GATSBY_CART_URL_STARCARE}admin/trendingproducts/${localStorage.customer_id}` 
      );
      const json = await res.json();
      await setTrendingProducts(json);
      const curr = await fetch(
        `${process.env.GATSBY_CART_URL_STARCARE}getcurrentcurrency`
    );
    const jsonp = await curr.json(); 
    await setCurrency(jsonp);
    };
    fetchTrending();
  }, []);

  const addtoCartItems = (sku, id) => {
    if (localStorage.userToken) {
        const cartItem = {
            "cartItem": {
                "sku": sku,
                "qty": qty,
                "quote_id": quote_id
            }
        }
        
        const jwt = localStorage.userToken
        if (cartItem) {
            try {
                axios({
                    method: 'post',
                    url: `${process.env.GATSBY_API_BASE_URL_STARCARE}carts/mine/items`,
                    data: cartItem,
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    }
                }).then((res) => {
                    if (res.statusText === "OK" && res.status == 200) {
                        viewCartItems();
                        // removeProduct(id, 'cart')
                        toast.success('Succesfully added to cart');
                        setTimeout(() => {
                            setCartCnt(getCartCount())
                        }, 3000);
                      
                    }
                }).catch((err) => {
                    console.error(err);
                    toast.error(err.response.data.message)
                })
            } catch (err) {
                console.error(err)
            }
        }
    }
    else {
        localStorage.clear()
        navigate("/signin")
    }
}
  const renderProducts = () => {
    if (trendingProducts) {
      return   <Slider {...banner_slide}> 

{/* <div className="col-4 single_trending"> */}
        { 
          trendingProducts.map((data, index) => (
            <div key={`${data.name}_${index}`}>
              {/* <div className="" > */}
              <div onClick={() => getProductURL(data)}>

                <div className="card">

                  <div className="image_wrapper">
                  <Link to={getProductURL(data)} ><img src={data.image} /></Link>
                  </div>
                  
                  
                  <div className="img_content">
                  <Link to={getProductURL(data)} className="prod-title"> {data.name}</Link>
                    

                    
                  

                  <div className="price_holder">
                                <div className="price_left">                                  
                                    <div className="product_amt">
                                    {data.strike_price != null  &&  <span className="new_price">{currency}{Math.round(data.strike_price)}</span>}
                                    {/* { data.strike_price == null &&  <span className="price">${Math.round(data.original_price)}</span>} */}
                                     <span className="price">{currency}{Math.round(data.final_price)}</span>

                                        
                                    </div>
                                    <div className="rating_front">
                                    <StarRatings
                                        rating={Math.round(data.rating)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="0px"
                                        starRatedColor="rgb(255 123 168)"
                                        svgIconViewBox="0 0 32 32"
                                        svgIconPath="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"
                                    />
                                    
                                    </div>
                                </div>
                                   {pcar && <div className="price_right"> 
                                   
                                  <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span className="cart_svg"></span></button>
                                  </div>}
                                  {outpcar && <div className="price_right"> 
                                   
                                   <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span className="cart_svg"></span></button>
                                   </div>}
                                </div>
                                </div>
                </div>
                </div>

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
          <div className="col-lg-12 col ">
      <h2 className="section_title if_has_nav">
              <span>Trending Products</span>
              <span><Link to="/trendingProducts">+ View all Products</Link></span>
            </h2>
            </div>
            </div>
           
            <div className="row">
            
            <div className="col-lg-12 col slider_row" >
            {trendingProducts.length > 0 ?  renderProducts():(<div className="fo-center">No Trending Products</div>)}

              {/* {renderProducts()} */}
              
             
            </div>
           
            </div>
           
      </div>
    </section>
   
  )

}

export default TrendingProducts