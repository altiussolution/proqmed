import { Link } from "gatsby"
import React, { useState, useEffect } from "react";
import "./../../templates/categorylist.css";
import { getProductURL } from "./../../utils/url";
import StarRatings from 'react-star-ratings';  
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from "react-icons/io";
import {getWLCount, wishListCount ,viewCartItems,getCartCount} from './../../utils/apiServices'

export default function CategoryCard({ data: product, dataClass }) {

  const [customerId, setCustomerId] = useState("");
  const [jwt, setJwt] = useState("");
  const [isButton,setButton] = useState(false);
  const [quote_id, setQuoteId] = useState("");
  const [qty, setQty] = useState(1);
  const [cartCnt, setCartCnt] = useState(getCartCount())
  const [p,per] = useState(false);
  const [pcar,percart] = useState(false);
  const [outp,outper] = useState(false);
  const [outpcar,outpercart] = useState(false);
  const [permits,setPermits] = useState([]);
  useEffect(() => {
    setCustomerId(localStorage.customer_id)
    setPermits(localStorage.permissions)
    setJwt(localStorage.userToken)
   // setQuoteId(localStorage.cartId)
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
    if(permits.length!=0){
      let addwis=permits.includes("Can Add To Wishlist")
      let addcar=permits.includes("Can Add To Cart")
      per(addwis)
      percart(addcar)
  }else if(permits.length==0){
    outper(true)
    outpercart(true)
  }
  },[])

  const addToList = (type) => {
    let url = (type == 1 ? `${process.env.GATSBY_CART_URL_STARCARE}admin/addtocompare/2` : `${process.env.GATSBY_CART_URL_STARCARE}wishlist/addwishlist_product/`)
    let message = (type == 1 ? 'Sucessfully added to  compare list' : 'Sucessfully added to wish list')
    let productData = {
      "data": {
        "customer_id": customerId,
        "product_id": product.items.id
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

  const addItemToCart = (product) =>{
    const cartItem = {
      "cartItem": {
        "sku": product.items.sku,
        "qty": qty,
        "quote_id": quote_id
      }
    }
      setButton(true);
      const jwt = localStorage.getItem('userToken')
        if(cartItem) {
          try
          {
              axios({
                method: 'post',
                url: `${process.env.GATSBY_API_BASE_URL_STARCARE}carts/mine/items`,
                data: cartItem,
                headers : {
                  'Authorization' : `Bearer ${jwt}`
                }
              }).then((res) => {
                if(res.statusText === "OK" && res.status == 200){
                  viewCartItems();
                  toast.success('succesfully added to cart');
                  setTimeout(() => {
                    setCartCnt(getCartCount())
                }, 3000);
                  setButton(false);
                }
              }).catch((err) => {
                console.error(err);
                toast.error('Failed to add cart')
              })
          }catch(err){
            console.error(err)
          }
        }
  }


  return (
    <div className={`item product_item ${dataClass}`}> 
            {product.items.length == 0?<sapn>You don't have Authorization for this category</sapn>:  
     <div className="thumbnail">
        <div className="wishComp">
          <ul>
              <li data-toggle="tooltip" title="Wishlist"><a onClick={() => addToList(2)}><FaRegHeart /></a></li>
          </ul>
        </div>
        <div className="product_img">
        <div className="price_off">Upto 50% off</div>
                               
         { <Link to={getProductURL(product.items)} state={product}><img className="w-100" src={`${product.items.image}`} alt={product.items.image} /></Link>}
        </div>
        <div className="desc_holder">
        <div className="caption">
          <p className="product_text">
         {<Link to={getProductURL(product.items)} state={product}> {product.items.name.slice(0,45)}... </Link>}
          </p>
        </div>
        <div className="price_holder">
        <div className="CC_prod_disc">
        {product.items.rating ?
          <StarRatings
            rating={product.items.rating}
            starRatedColor="blue"
            numberOfStars={5}
            name='rating'
            starDimension="20px"
            starSpacing="0px"
            starRatedColor="rgb(242 187 22)"
          /> : 'No Reviews yet'
        }
         <div className="product_amt">
                    <span className="price">${Math.round(product.items.price)}</span>
                </div>
                </div>
                <div className="price_right"> 
                                   
                                  {pcar && <button className="addtocart" ><span class="cart_svg"></span></button>}
                                  {outpcar && <button className="addtocart" ><span class="cart_svg"></span></button>}
                                  { <Link  to={getProductURL(product.items)} state={product} className="btn outline-1">View Detail</Link> }
                                  </div>
                </div>
                </div>
                <div className="cart-btns">
                <a className="other" onClick={() => addToList(2)}><FaRegHeart /> </a>
                  <a className="other" onClick={() => addToList(1)}><IoIosGitCompare/> </a>
                
                  
                  
                </div>

      </div>
}

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
    </div>

  )

}