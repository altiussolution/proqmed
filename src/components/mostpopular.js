import React, { useState, useEffect } from "react";
import StarRatings from 'react-star-ratings';
import { getProductURL } from './../utils/url';
import { Link } from "gatsby";
import Glov from "./../assets/glov.png"
import { navigate } from "gatsby"
import { ToastContainer, toast } from 'react-toastify';
import {getWLCount, wishListCount,viewCartItems,getCartCount } from '../utils/apiServices'
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const Mostpopular = () => {

  const [popularProducts, setPopularProducts] = useState(null);
  const [customerId, setCustomerId] = useState("");
    const [jwt, setJwt] = useState("");
    const [quote_id, setQuoteId] = useState("");
    const [qty, setQty] = useState(1);
    const [isButton, setButton] = useState(false);
    const [cartCnt, setCartCnt] = useState(getCartCount())

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

    const fetchPopular = async () => {
      const res = await fetch(
        `${process.env.GATSBY_CART_URL_STARCARE}admin/mostpopular/15`
      );
      const json = await res.json();
      await setPopularProducts(json);
    };
    fetchPopular();
  }, []);

  const renderProducts = () => {
    if (popularProducts) {
      return <div className="row">
        {
          popularProducts.slice(popularProducts.length-6, popularProducts.length).map((data, index) => (
            
            <div key={`${data.name}_${index}`} className="col-lg-3 border">
              {console.log("datass", data)}
              {console.log("sku", data.sku)}
              {/* <div className="" > */}
              <Link to={getProductURL(data)}>
                
                  {/* <div className="w-100"> */}
                    <img className="w-100" src={data.image} />
                  {/* </div> */}
                  {/* <div className="img_content"> */}
                    {/* <h5 className="prod-title">{data.name.slice(0,55)}...</h5> */}
                    <StarRatings
                      rating={Math.round(data.rating)}
                      numberOfStars={5}
                      name='rating'
                      starDimension="15px"
                      starSpacing="0px"
                      starRatedColor="rgb(255 123 168)"
                    />
                    <h3>{data.name.slice(0,55)}...</h3>
                    <div>
                      <span className="pricegreen">$ {Math.round(data.price)}</span>
                      <span className="off_txt_lft">$000</span>
                    </div>
                    </Link>
                    <div className="button_sec">
                    <Link to={getProductURL(data)}>
                                    <button type="button" className="btn btn-success">Buy Now</button>
                                    </Link>
                                    <button type="button" className="btn btn-default" onClick={() => addtoCartItems(data.sku, data.id)}>Add to cart</button>
                                    </div>
                  {/* </div> */}
                
                {/* </Link> */}
              {/* </div> */}
            </div>
          ))
        }
      </div>
      
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



  return (
    <div class="container image_wrappertab">
      <h2 className="section_title text-center">
<span>Best Selling Products</span>
<p>Contrary to popular belief, Lorem Ipsum is not simply random text</p>
</h2>
    {/* <section className="popular_section">
      <div className="container">
        <div className="row">
      {/* <h2 className="section_title">
              <span>Most Popular</span>
              <span><Link to="/mostpopular">+ View all Products</Link></span>
            </h2> */}
            {/* <h2 className="section_title text-center">
<span>Best Selling</span>

</h2> */} 
            
              {renderProducts()}

              {/* <div className="row"> */}
                {/* <div className="col-lg-4 border flx">
                  
                  <img className="w-100" src={Glov} alt={"banner"}/> 

                  <div className="banner_sep">
                  <StarRatings
                                        // rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Stethescope </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    
                                    </div>
                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                
                
                
               
                
                
              </div>
              </div>
      
    </section> */}
    </div>
  )

}

export default Mostpopular