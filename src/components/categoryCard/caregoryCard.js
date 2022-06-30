import { Link } from "gatsby"
import React, { useState, useEffect } from "react";
import "./../../templates/categorylist.css";
import { getProductURL } from "./../../utils/url";
import StarRatings from 'react-star-ratings';  
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageNotFound } from "../../assets/not-found.png"
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from "react-icons/io";
import {getWLCount, wishListCount ,viewCartItems,getCartCount} from './../../utils/apiServices'
import { navigate } from "gatsby";

export default function CategoryCard({ data: product, dataClass}) {
  
  const [customerId, setCustomerId] = useState("");
  const [jwt, setJwt] = useState("");
  const [isButton,setButton] = useState(false);
  const [quote_id, setQuoteId] = useState("");
  const [qty, setQty] = useState(1);
  const [cartCnt, setCartCnt] = useState(getCartCount());
  const [p,per] = useState(false);
  const [pcar,percart] = useState(false);
  const [outp,outper] = useState(false);
  const [outpcar,outpercart] = useState(false);
  const [permits,setPermits] = useState([]);
  const [groupId,grpI] = useState(localStorage.group);
  const [currency,setCurrency]=useState();
  useEffect(() => {
    console.log(product)
    setCustomerId(localStorage.customer_id)
    setPermits(localStorage.permissions)
    setJwt(localStorage.userToken)
   // setQuoteId(localStorage.cartId)
    const jwt = localStorage.getItem('userToken')
    const fetchFeature = async () => {
    const curr = await fetch(
      `${process.env.GATSBY_CART_URL_STARCARE}getcurrentcurrency`
  );
  const jsonp = await curr.json(); 
  await setCurrency(jsonp);
    }
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
  fetchFeature();
  },[cartCnt])

  const addToList = (type) => {
    if (localStorage.userToken) {
    let url = (type == 1 ? `${process.env.GATSBY_CART_URL_STARCARE}admin/addtocompare/2` : `${process.env.GATSBY_CART_URL_STARCARE}wishlist/addwishlist_product/`)
    let message = (type == 1 ? 'Sucessfully added to  compare list' : 'Sucessfully added to wish list')
    let productData = {
      "data": {
        "customer_id": customerId,
        "product_id": product['values'].items.id
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
  }  else {
    localStorage.clear()
    navigate("/signin")
}
  }

  const addItemToCart = (sku,product) =>{
    if (localStorage.userToken) {
    const cartItem = {
      "cartItem": {
        "sku": sku,
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
                    window.location.reload(false);
                }, 3000);
                  setButton(false);
                }
              }).catch((err) => {
                console.log(err.response.data.message);
                toast.error(err.response.data.message)
              })
          }catch(err){
            console.error(err)
          }
        }
      }else {
        localStorage.clear()
        navigate("/signin")
    }
  }


  return (
    <div className={`item product_item ${dataClass}`}> 
            {product['values'].items.length == 0?<sapn>You don't have Authorization for this category</sapn>:  
     <div className="thumbnail">
         {p &&  <div className="wishComp">
        <ul>
         <li data-toggle="tooltip" title="Wishlist"><a onClick={() => addToList(2)}><FaRegHeart /></a></li> 
         

          </ul> 
         
        </div> }
        {outp &&   <div className="wishComp"> <ul>
          <li data-toggle="tooltip" title="Wishlist"><a onClick={() => addToList(2)}><FaRegHeart /></a></li> 
        

          </ul> </div>  }
        <div className="product_img">

        {product['values'].items.prices[localStorage.group ? groupId :0]['offer_percentage'] != 0 && <div className="price_off">{Math.round(product['values'].items.prices[localStorage.group ? groupId :0]['offer_percentage'])}% off</div>}

        {/* <div className="price_off">Upto 50% off</div> */}
                               
          <Link to={getProductURL(product['values'].items)} state={product}><img src={product['values'].items.image} /></Link>
        </div>
        <div className="desc_holder">
        <div className="caption">
          <p className="product_text">
         {<Link to={getProductURL(product['values'].items)} state={product}> {product['values'].items.name.slice(0,45)}... </Link>}
          </p>
        </div>
        <div className="price_holder">
        <div className="CC_prod_disc">
        {product['values'].items.rating ?
        <div className="rating_front">
        <StarRatings
            rating={product['values'].items.rating}
            numberOfStars={5}
            name='rating'
            starDimension="20px"
            starSpacing="0px"
            starRatedColor="rgb(255 123 168)"
            svgIconViewBox="0 0 32 32"
            svgIconPath="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"
        /> 
        
        </div> : 'No Reviews yet'}
          {/* // <StarRatings
          //   rating={product['values'].items.rating}
          //   starRatedColor="rgb(255 123 168)"
          //   numberOfStars={5}
          //   name='rating'
          //   starDimension="20px"
          //   starSpacing="0px"
          // /> : 'No Reviews yet' */}
        
         <div className="product_amt">
         {/* {product['values'].items.strike_price == null  && <span className="price">${Math.round(product['values'].items.original_price)}</span> } */}
                    <span className="price">{currency}{Math.round(product['values'].items.prices[localStorage.group ? groupId :0]['final_price'])}</span>

                    {product['values'].items.prices[localStorage.group ? groupId :0]['strike_price'] != null  &&  <span className="new_price">{currency}{Math.round(product['values'].items.prices[localStorage.group ? groupId :0]['strike_price'])}</span>}

                </div>
                </div>
                <div className="price_right"> 
                                   
                                  {pcar && <button className="addtocart" onClick={() => addItemToCart(product['values'].items.sku, product['values'].id)}><span className="cart_svg"></span></button>
}
                                  {outpcar && <button className="addtocart" onClick={() => addItemToCart(product['values'].items.sku, product['values'].id)}><span className="cart_svg"></span></button>}
                                  { <Link  to={getProductURL(product['values'].items)} state={product} className="btn outline-1">View Detail</Link> }
                                  </div>
                </div>
                </div>
                {/* <div className="cart-btns">
                <a className="other" onClick={() => addToList(2)}><FaRegHeart /> </a>
                  <a className="other" onClick={() => addToList(1)}><IoIosGitCompare/> </a>
                
                  
                  
                </div> */}

      </div>
}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
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