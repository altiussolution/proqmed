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
import { navigate } from "gatsby";

const banner_slide = {
  autoplay: false,
  speed: 1000,
  slidesToShow: 6,
  slidesToScroll: 1,
  infinite: true
}

const FeatureProduct = () => {
    const [featureProducts, setFeatureProducts] = useState(null);
    const [customerId, setCustomerId] = useState("");
    const [jwt, setJwt] = useState("");
    const [quote_id, setQuoteId] = useState("");
    const [qty, setQty] = useState(1);
    const [isButton, setButton] = useState(false);
    const [cartCnt, setCartCnt] = useState(getCartCount())

    useEffect(() => {
        setCustomerId(localStorage.customer_id)
        setJwt(localStorage.userToken)
        setQuoteId(localStorage.cartId)

        const fetchFeature = async () => {
            const res = await fetch(
                `${process.env.GATSBY_API_BASE_URL}featureproducts/2`
            );
            const json = await res.json();
            await setFeatureProducts(json);
             
        };
        fetchFeature();
    }, []);
    
         
    const addToList = (type,id) => {
        // type 1 = wishlist
        // type 2 = comparelist
        let url = (type == 1 ? `${process.env.GATSBY_CART_URL}admin/addtocompare/2` : `${process.env.GATSBY_CART_URL}wishlist/addwishlist_product/`)
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
                    url: `${process.env.GATSBY_CART_URL}carts/mine/items`,
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
                      url: `${process.env.GATSBY_API_BASE_URL}carts/mine/items`,
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

            return  <div className="row">  
            
                {       
                    featureProducts.slice(0, 4).map((data,index) => (
                        <div className="col-lg-3 col-md-3 col-xs-12 col" key={`${data.name}_${index}`}>
                            <div className="card">    
                            <div className="wishComp">
                                    <ul>
                                      <li><a onClick={() => addToList(2,data.id)}><FaRegHeart /></a></li>
                                    </ul>
                                </div>
                                <div className="image_wrapper">
                                    <Link to={getProductURL(data)}><img src={data.image} /></Link>
                                </div>                                
                                <Link to={getProductURL(data)}><p className="product_title">{data.name}</p></Link>
                                <div>
                                    <StarRatings
                                        rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="0px"
                                        starRatedColor="rgb(242 187 22)"
                                    />
                                </div>
                                <div>
                                    <div className="product_amt">
                                        <span className="price">${Math.round(data.price)}</span>
                                        <span className="new_price">$000</span>
                                    </div>
                                  <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}>Add to Cart</button>
                                </div>
                            </div>

                        </div>
                    ))
                }
            
            </div>
            // </Slider>
        }
    }
    return (
      
        <section className="feature_section">
            <div className="container">
            
            <div className="row">
            <h2 className="section_title">
                    <span>Featured Products</span>
                    <span><Link to="/featuredProducts">+ View all Products</Link></span>
                    </h2>
              
                <h2 className="section_title">
                    </h2>
                {renderProducts()}
                
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