import React, { useState, useEffect } from "react";
import StarRatings from 'react-star-ratings';
import { Link } from "gatsby"
import {getProductURL} from './../utils/url';
import Layout from "../components/layout";
import { FaRegHeart } from 'react-icons/fa';
import { IoGridOutline } from "react-icons/io5";
import { IoList } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageLoader from "../components/loaders/pageLoader";
import axios from "axios";
import {getWLCount, wishListCount,viewCartItems,getCartCount } from '../utils/apiServices'
import { navigate } from "gatsby";


const Featuredproducts = () => {
    const [featureProducts, setFeatureProducts] = useState(null);
    const [customerId, setCustomerId] = useState("");
    const [loading, setLoading] = useState(true);  
    const [jwt, setJwt] = useState("");
    const [viewClass, setViewClass] = useState('grid_view');
    const [p,per] = useState(false);
    const [outp,outper] = useState(false);
    const [pcar,percart] = useState(false);
    const [permits,setPermit] = useState([]);
    const [outpcar,outpercart] = useState(false);
    const [qty, setQty] = useState(1);
    const [quote_id, setQuoteId] = useState("");
    const [cartCount, setcartCount] = useState(getCartCount());
    const [isButton, setButton] = useState(false);
    const [currency,setCurrency]=useState();


    useEffect(() => {
        setCustomerId(localStorage.customer_id)
        setJwt(localStorage.userToken)
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
        const jwt = localStorage.getItem('userToken')
        if(jwt){
          setLoading(true)
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
                setLoading(false)
                  localStorage.setItem('cartId',response.data);
                  setQuoteId(localStorage.cartId)
              }
            }) 
            .catch((error) => {
              console.error(error,'error')
              setLoading(false)

            })
          }catch(err){
            console.error(err);
            setLoading(false)
            toast.error('something went wrong')
          }
        }else{
          setLoading(false)
        }
        const fetchFeature = async () => {
            const res = await fetch(
                `${process.env.GATSBY_CART_URL_STARCARE}featureproducts/${localStorage.customer_id}`
            );
            const json = await res.json();
            console.log(json)
            await setFeatureProducts(json);
            const curr = await fetch(
              `${process.env.GATSBY_CART_URL_STARCARE}getcurrentcurrency`
          );
          const jsonp = await curr.json(); 
          await setCurrency(jsonp);
        };
        fetchFeature();
    }, []);
    const cartValue = () => {
      setTimeout(() => {
        setcartCount(getCartCount());
        window.location.reload(false);
      }, 3000);
    }
    const addtoCartItems = (sku, id) => {
      setLoading(true)
      if (localStorage.userToken) {
          const data = {
              "data": {
                  "sku": sku,
                  "qty": qty,
                  "quote_id": quote_id,
                  "product_id": id
              }
            }
          const jwt = localStorage.userToken
          if (data) {
              try {
                  axios({
                      method: 'post',
                      url: `${process.env.GATSBY_CART_URL_STARCARE}addtocart/add_cart`,
                      data: data,
                      headers: {
                          'Authorization': `Bearer ${jwt}`
                      }
                  }).then((res) => {
                      if (res.statusText === "OK" && res.status == 200) {
                          viewCartItems();
                          // setcartCount(getCartCount());
                          cartValue();
                          toast.success('Succesfully added to cart');
                          setLoading(false)
                      }
                  }).catch((err) => {
                      console.error(err);
                      toast.error(err.response.data.message)
                      setLoading(false)

                  })
              } catch (err) {
                  console.error(err)
                  setLoading(false)

              }
          }
      }
      else {
          localStorage.clear()
          navigate("/signin")
      }
  }
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
      } else {
        localStorage.clear()
        navigate("/signin")
    }
      }
      const shortBySelected = (event) => {
        // setLoading(true);
        const selecturl = event.target.value;
        if(event.target.value == ""){
          event.target.value="featurepronameasc"
        }
        const selectRes =[];
        try {
          axios({
              method: 'get',
              url: `${process.env.GATSBY_CART_URL_STARCARE}${selecturl}/${localStorage.customer_id}`,
          }).then((res) => {
            console.log(res.data)
              if (res.statusText === "OK" && res.status == 200) {
              setFeatureProducts(res.data);
              // setLoading(false);
              }
           
          }).catch((err) => {
            // setLoading(false);
              console.error(err);
          })
        } catch (err) {
          // setLoading(false);
          console.error(err)
        }
      }
    const renderProducts = () => {    
        if (featureProducts) { 
            return <div className="row products_fp OFP">   
                {       
                    featureProducts.map((data,index) => (
                        <div  className={`item product_item ${viewClass}`} key={`${data.name}_${index}`}>
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
                            <div className="card">    
                            
                              
                                <div className="image_wrapper fp">
                                {/* <div className="actn_btn_holder">                                  
                                    <ul>
                                      <li className="icn"><BiShoppingBag/></li>
                                      <li>{ <Link className="btn" to={getProductURL(data)}
                                    state={data}>View Detail</Link> }</li>
                                      <li className="icn"><a onClick={() => addToList(1,data.id)}><IoIosGitCompare/></a></li>
                                    </ul>                                
                                </div> */}
                                {data.offer_percentage != 0 && <div className="price_off">{Math.round(data.offer_percentage)}% off</div>}
                                 <Link to={getProductURL(data)}>
                                 <img src={data.image} />
                                 </Link>
                                    

                                </div>                                
                              
                                <div className="price_holder">
                                <Link to={getProductURL(data)}>  <p className="product_title">{data.name}</p></Link>
                                <div className="price_left">                                  
                                    <div className="product_amt">
                                    {data.strike_price != null  && <span className="new_price">{currency}{Math.round(data.strike_price)}</span>}
                                    {/* { data.strike_price == null &&  <span className="price">${Math.round(data.original_price)}</span>} */}
                                      <span className="price">{currency}{Math.round(data.final_price)}</span>
                                        
                                    </div>
                                    <div className="rating_front">
                                    <StarRatings
                                        rating={Math.round(data.ratings_summary)}
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
                                  { <Link  to={getProductURL(data)} state={data} className="btn outline-1">View Detail</Link> }
                                  </div>}
                                  {outpcar && <div className="price_right">                                   
                                  <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span className="cart_svg"></span></button>
                                  { <Link  to={getProductURL(data)} state={data} className="btn outline-1">View Detail</Link> }
                                  </div>}
                                </div>
                            </div>

                        </div>
                    ))
                }
            </div>
        }
    }
    
    return (
        <Layout cartCount={cartCount}>
            <section className="page_content inner_page">
                <div className="content_wrapper">
                    <div className="container">
                        <div className="row main_title">
                            <h1>Our <span>Featured Products</span></h1>
                            <div className="tools_items">
                          <div className="tools">
                            <span>
                              Sort by:
                    </span>
                    <div className="option">
                              <select className="form-control" id="sort_option1" onChange={shortBySelected} >
                                <option value = "featurepronameasc">Name Asc</option>
                                <option value = "featurepronamedesc">Name Desc</option>
                                <option value = "featurepropriceasc">Price Asc</option>
                                <option value = "featurepropricedesc">Price Desc</option>
                                <option value = "featureprocreatedasc">Created Date Asc</option>
                                <option value = "featureprocreateddesc">Created Date Desc</option>
                              </select>
                            </div>
                          </div>
                          <div className="tools">
                            <div className="title_view">
                            <button  className={"view-btn list-view"+(viewClass === 'list_view' ? ' active_btn':'')} id="list" data-toggle="tooltip" data-placement="top" title="List" onClick={() => setViewClass('list_view')}><IoList /></button>
                              <button  className={"view-btn grid-view"+(viewClass === 'grid_view' ? ' active_btn':'')} id="grid" data-toggle="tooltip" data-placement="top" title="Grid" onClick={() => setViewClass('grid_view')}><IoGridOutline /></button>
                            </div>
                          </div>
                        </div>
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
            </section>
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
            {loading ? (<div>
                <PageLoader />
            </div>) : <span></span>}
        </Layout>
    )
}  

export default Featuredproducts;