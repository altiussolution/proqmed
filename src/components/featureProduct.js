import React, { useState, useEffect } from "react";
import StarRatings from 'react-star-ratings';
import { Link } from "gatsby"
import {getProductURL} from './../utils/url';
import { FaRegHeart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {getWLCount, wishListCount,viewCartItems,getCartCount } from '../utils/apiServices'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { navigate } from "gatsby";
import Glov from "./../assets/glov.png"
import cart from './../assets/ic_cart_top.png';

const feature_slide = {
  autoplay: false,
  speed: 1000,
  slidesToShow:5,
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

const FeatureProduct = () => {
    const [featureProducts, setFeatureProducts] = useState(null);
    const [customerId, setCustomerId] = useState("");
    const [jwt, setJwt] = useState("");
    const [quote_id, setQuoteId] = useState("");
    const [qty, setQty] = useState(1);
    const [isButton, setButton] = useState(false);
    const [cartCnt, setCartCnt] = useState(getCartCount())
    const [p,per] = useState(false);
    const [pcar,percart] = useState(false);
    const [outp,outper] = useState(false);
    const [outpcar,outpercart] = useState(false);
    useEffect(() => {
        setCustomerId(localStorage.customer_id)
        setJwt(localStorage.userToken)
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
            navigate("/signin")
        }
       // setQuoteId(localStorage.cartId)
        if(localStorage.permissions){
          let addwis=localStorage.permissions.includes("Can Add To Wishlist")
          let addcar=localStorage.permissions.includes("Can Add To Cart")
          per(addwis)
          percart(addcar)
      }else if(!localStorage.permissions){
        outper(true)
        outpercart(true)
      }
        const fetchFeature = async () => {
            const res = await fetch(
                `${process.env.GATSBY_CART_URL_STARCARE}featureproducts/2`
            );
            const json = await res.json();
            await setFeatureProducts(json);
             
        };
        fetchFeature();
    }, []);
    
         
    const addToList = (type,id) => {
        // type 1 = wishlist
        // type 2 = comparelist
        let url = (type == 1 ? `${process.env.GATSBY_CART_URL_STARCARE}admin/addtocompare/2` : `${process.env.GATSBY_CART_URL_STARCARE}wishlist/addwishlist_product/`)
        let message = (type == 1 ? 'Sucessfully added to  compare list' : 'Sucessfully added to wish list')
        let errormessage = (type == 1 ? 'SignIn to add compare list' : 'SignIn to add wish list')

        let productData = {
          "data": {
            "customer_id": customerId,
            "product_id": id
          }
        }
    
        try {
          axios({
            method: 'post',
            url: url,
            data: productData,
            headers: {
              'Authorization': `Bearer ${jwt}`
            }
          }).then((res) => {
            if (res.statusText === "OK" && res.status == 200) {
              toast.success(message)
              setTimeout(()=>{
                wishListCount()
              },2000)
            }
          }).catch((err) => {
            toast.error(errormessage)
          })
        } catch (err) {
          toast.error(err)
        }
    
      }

      const addtoCartItem = (data) => {
            const cartItem = {
                "cartItem": {
                  "sku": data.sku,
                  "qty": qty,
                  "quote_id": quote_id
                }
              }
              setButton(true);
              const jwt = localStorage.getItem('userToken')
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
                         setTimeout(() => {
                         setCartCnt(getCartCount())
                        }, 3000);
                      toast.success('Succesfully added to cart');
                      setButton(false);
                    }
                  }).catch((err) => {
                    toast.error('SignIn to add cart')
                  })
                } catch (err) {
                  console.error(err)
                }
              }
    }

    const addtoCartItems = (sku, id) => {
      if (localStorage.userToken) {
          const cartItem = {
              "cartItem": {
                  "sku": sku,
                  "qty": qty,
                  "quote_id": quote_id
              }
          }
          setButton(true);
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
                          setButton(false);
                      }
                  }).catch((err) => {
                      console.error(err);
                      toast.error('Failed to add cart')
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
        if (featureProducts) { 

            return  <Slider {...feature_slide}>  
            
                {       
                    featureProducts.map((data,index) => (
                        <div key={`${data.name}_${index}`}>
                            <div className="card">    
                            {p && <div className="wishComp">
                                    <ul>
                                      <li><a onClick={() => addToList(2,data.id)}><FaRegHeart /></a></li>
                                    </ul>
                                </div>}
                                {outp && <div className="wishComp">
                                    <ul>
                                      <li><a onClick={() => addToList(2,data.id)}><FaRegHeart /></a></li>
                                    </ul>
                                </div>}
                                <div className="image_wrapper">
                                    <Link to={getProductURL(data)}><img src={data.image} /></Link>
                                </div>
                                <div className="description_list">                               
                                <Link to={getProductURL(data)}>{data.name}</Link>
                                </div> 
                                
                                <div className="price_holder">
                                <div className="price_left">                                  
                                    <div className="product_amt">
                                    <span className="new_price">$000</span>
                                        <span className="price">${Math.round(data.price)}</span>
                                        
                                    </div>
                                    <div className="rating_front">
                                    <StarRatings
                                        rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="0px"
                                        starRatedColor="rgb(242 187 22)"
                                        svgIconViewBox="0 0 32 32"
                                        svgIconPath="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"
                                    />
                                    
                                    </div>
                                </div>
                                  {pcar && <div className="price_right">                                   
                                  <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span class="cart_svg"></span></button>
                                  </div>}
                                  {outpcar && <div className="price_right">                                   
                                  <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span class="cart_svg"></span></button>
                                  </div>}
                                </div>
                            </div>

                        </div>
                    ))
                }
            
            
            </Slider>
        }
    }
    return (
      
        <section className="feature_section">
            <div className="container">
            
            <div className="row">
            <div className="col-lg-12 col" >
            <h2 className="section_title if_has_nav">
                    <span>Featured Products</span>
                    <span><Link to="/featuredProducts">+ View all Products</Link></span>
                    </h2>
                    </div>
                    </div>

                    <div className="row">            
                    <div className="col-lg-12 col" >               
                      {renderProducts()}
                    </div>
                    </div>
                
                
            
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </section>

    )
}

export default FeatureProduct