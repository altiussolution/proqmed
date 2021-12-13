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
import { navigate } from "gatsby";
import {getWLCount, wishListCount,viewCartItems,getCartCount } from '../utils/apiServices'


const Dealproducts = () => {
 const [dealProducts, setDealProducts] = useState(null);
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
             `${process.env.GATSBY_CART_URL_STARCARE}category/dealsofthedays/38`
         );
         const json = await res.json();
         await setDealProducts(json);
          
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
 if (dealProducts) { 
     return <div>   
         {       
             dealProducts.map((data,index) => (
                 <div className="item" key={`${data.sub_category}_${index}`}>
                     <div className="card"> 
                     {data.sub_category.sub_category_sub.map((value,index)=>(  
                      <><div className="wishComp">
                       <ul>
                        <li><a onClick={() => addToList(2, value.id)}><FaRegHeart /></a></li>
                       </ul>
                      </div><div className="image_wrapper">
                        <div className="actn_btn_holder">
                         <ul>
                          <li className="icn"><a onClick={() => addtoCartItems(value.sku, value.id)}><BiShoppingBag /></a></li>
                          <li>{<Link className="btn" to={getProductURL(value)}
                           state={value}>View Detail</Link>}</li>
                          <li className="icn"><a onClick={() => addToList(1, value.id)}><IoIosGitCompare /></a></li>
                         </ul>
                        </div>
                        <img src={value.image} />

                       </div>
                       <p className="product_title">{value.name}</p>
                       </>   
                      ))} 
                     
                                                     
                         
                         {/* <div>
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

                         </div> */}
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
export default Dealproducts;



