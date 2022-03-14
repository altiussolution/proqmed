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
import { data } from "jquery";
import { getCategoryURL } from "./../utils/url";


const Dealproducts = () => {
 const [dealProducts, setDealProducts] = useState(null);
 const [customerId, setCustomerId] = useState("");
 const [jwt, setJwt] = useState("");
 const [quote_id, setQuoteId] = useState("");
 const [qty, setQty] = useState(1);
 const [isButton, setButton] = useState(false);
 const [cartCnt, setCartCnt] = useState(getCartCount())
 const [sub,setsubproducts] = useState(null);
 const [p,per] = useState(false);
    const [pcar,percart] = useState(false);
    const [outp,outper] = useState(false);
    const [outpcar,outpercart] = useState(false);
    const [permits,setPermit] = useState([]);
 useEffect(() => {
   setPermit(localStorage.permissions)
     setCustomerId(localStorage.customer_id)
     setJwt(localStorage.userToken)
     setQuoteId(localStorage.cartId)
     if(!localStorage.permissions){
      outper(true)
      outpercart(true)
    }else {
      let hi = JSON.parse(localStorage.permissions)
      let addwis=hi.includes("Can Add To Wishlist")
      let addcar=hi.includes("Can Add To Cart")
      per(addwis)
      percart(addcar)
    }
     const fetchFeature = async () => {
         const res = await fetch(
             `${process.env.GATSBY_CART_URL_STARCARE}category/dealsofthedays/13`//38
         );
         const json = await res.json();
         let arr=[]
         console.log(json)
         {json.map((data,index)=>(
          // arr.push(data.sub_category.sub_category_sub)
          data.sub_category.sub_category_sub.map((value,index)=>(
            arr.push(value)
          ))
          ))}
          console.log(arr)
        await setsubproducts(arr)
     };
     fetchFeature();
    
     console.log(sub)
 }, []);
 
 const addToList = (type,id) => {
  if (localStorage.userToken) {

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
  }else {
    localStorage.clear()
    navigate("/signin")
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
 if (sub) { 
     return <div className="row products_fp">   
         {       
             sub.map((data,index) => (
                 <div className="item product_item sample">
                      
                     {/* {data.sub_category.sub_category_sub.map((value,index)=>(   */}
                      <>  

                      <div className="card">
                   {/*   {p && <div className="wishComp">
                       <ul>
                        <li><a onClick={() => addToList(2, data.id)}><FaRegHeart /></a></li>
                       </ul>
                      </div>}
                      {outp && <div className="wishComp">
                       <ul>
                        <li><a onClick={() => addToList(2, data.id)}><FaRegHeart /></a></li>
                       </ul>
                     </div>}*/}
                      <div className="image_wrapper" key={`${data}_${index}`}>
                        {/* <div className="actn_btn_holder">
                         <ul>
                          <li className="icn"><a onClick={() => addtoCartItems(value.sku, value.id)}><BiShoppingBag /></a></li>
                          <li>{<Link className="btn" to={getProductURL(value)}
                           state={value}>View Detail</Link>}</li>
                          <li className="icn"><a onClick={() => addToList(1, value.id)}><IoIosGitCompare /></a></li>
                         </ul>
                        </div> */}
                      
                         <Link to={getCategoryURL(data)}><img src={data.image} /></Link>
                        

                       </div>
                       <Link to={getCategoryURL(data)}> <div className="product_title">{data.name}</div></Link>
                      {/* <div className="price_holder">
                                <div className="price_left">                                  
                                    <div className="product_amt">
                                    <span className="new_price">{data.strike_price}</span>
                                        <span className="price">{data.orginal_price}</span>
                                        
                                    </div>
                                    <div className="rating_front">
                                     <StarRatings
                                        rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="0px"
                                        starRatedColor="rgb(242 187 22)"
                                    /> 
                                    
                                    </div>
                                </div>
                                  {pcar && <div className="price_right">                                   
                                  <button className="addtocart"><span class="cart_svg"></span></button>
                                  </div>}
                                  {outpcar && <div className="price_right">                                   
                                  <button className="addtocart"><span class="cart_svg"></span></button>
                                  </div>}
                                </div>*/}
                                </div>  
                       </>   
                       {/* ))}  */}
                     
                                                     
                         
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
                
                    <div className="main_title left">
                    <h1 className="heading">Deal of the Day</h1>
                
                  </div>
                  
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
export default Dealproducts;



