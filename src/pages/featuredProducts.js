import React, { useState, useEffect } from "react";
import StarRatings from 'react-star-ratings';
import { Link } from "gatsby"
import {getProductURL} from './../utils/url';
import Layout from "../components/layout";
import { FaRegHeart } from 'react-icons/fa';
import { BiShoppingBag } from "react-icons/bi";
import { IoIosGitCompare } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {getWLCount, wishListCount } from '../utils/apiServices'


const Featuredproducts = () => {
    const [featureProducts, setFeatureProducts] = useState(null);
    const [customerId, setCustomerId] = useState("");
    const [jwt, setJwt] = useState("");

    useEffect(() => {
        setCustomerId(localStorage.customer_id)
        setJwt(localStorage.userToken)
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
              wishListCount()
              setTimeout(()=>{
                getWLCount()
              },2000)
            }
          }).catch((err) => {
            toast.error(err)
          })
        } catch (err) {
          toast.error(err)
        }
    
      }

    const renderProducts = () => {    
        if (featureProducts) { 
            return <div className="row products_fp">   
                {       
                    featureProducts.map((data,index) => (
                        <div className="item product_item sample" key={`${data.name}_${index}`}>
                            <div className="card">    
                            <div className="wishComp">
                                    <ul>
                                      <li><a onClick={() => addToList(2,data.id)}><FaRegHeart /></a></li>
                                    </ul>
                                </div>
                                <div className="image_wrapper">
                                {/* <div className="actn_btn_holder">                                  
                                    <ul>
                                      <li className="icn"><BiShoppingBag/></li>
                                      <li>{ <Link className="btn" to={getProductURL(data)}
                                    state={data}>View Detail</Link> }</li>
                                      <li className="icn"><a onClick={() => addToList(1,data.id)}><IoIosGitCompare/></a></li>
                                    </ul>                                
                                </div> */}
                                    <img src={data.image} />

                                </div>                                
                                <p className="product_title">{data.name}</p>
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
                                  <div className="price_right">                                   
                                  <button className="addtocart"><span class="cart_svg"></span></button>
                                  </div>
                                </div>
                            </div>

                        </div>
                    ))
                }
            </div>
        }
    }
    
    return (
        <Layout>
          <div className="content_wrapper">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                <h1 className="page-title">
                    <div>
                    <span>Featured Products</span>
                  <div className="breadcrumbs_sec" >
                    adasd
                  </div>
                  </div>
                  </h1>
                  <div className="category_container">
                    
                      <div className="cat_scroll">
                        <div className="container">
                          
                  {renderProducts()}
                  
                  </div>
                  </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </Layout>
    )
}  

export default Featuredproducts;