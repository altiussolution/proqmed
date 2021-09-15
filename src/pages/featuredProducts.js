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
            return <div>   
                {       
                    featureProducts.map((data,index) => (
                        <div className="item" key={`${data.name}_${index}`}>
                            <div className="card">    
                            <div className="wishComp">
                                    <ul>
                                      <li><a onClick={() => addToList(2,data.id)}><FaRegHeart /></a></li>
                                    </ul>
                                </div>
                                <div className="image_wrapper">
                                <div className="actn_btn_holder">                                  
                                    <ul>
                                      <li className="icn"><BiShoppingBag/></li>
                                      <li>{ <Link className="btn" to={getProductURL(data)}
                                    state={data}>View Detail</Link> }</li>
                                      <li className="icn"><a onClick={() => addToList(1,data.id)}><IoIosGitCompare/></a></li>
                                    </ul>                                
                                </div>
                                    <img src={data.image} />

                                </div>                                
                                <p className="product_title">{data.name}</p>
                                <div>
                                    <StarRatings
                                        rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="15px"
                                        starSpacing="0px"
                                        starRatedColor="rgb(242 187 22)"
                                    />
                                </div>
                                <div>
                                    <div className="product_amt">
                                        <span className="price">$ {Math.round(data.price)}</span>
                                        <span className="new_price">$000</span>
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
            <div>{renderProducts()}</div>
        </Layout>
    )
}  

export default Featuredproducts;