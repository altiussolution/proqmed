import { Link } from "gatsby"
import React, { useState,useEffect } from "react"
import { getProductURL, getCategoryURL } from "./../utils/url";
import { navigate, useStaticQuery } from "gatsby";
// images
import google from './../assets/google.png';
import pintrest from './../assets/pintrest.png';
import facebook from './../assets/facebook.png';
import instagram from './../assets/instagram.png';
import Linkedin from './../assets/linkedin.png';
import twitter from './../assets/twitter.png';
import payment from './../assets/payment.png';
import logo from './../assets/logo_white.png';
import paypal from './../assets/paypal.png';
import delivery from './../assets/delivery.png';
import safety from './../assets/safety.png';
import secure from './../assets/secure.png';
import axios from "axios";
import {ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Footer = () => {
    const [email,setemail] = useState();
    const [isLoged, setIsLoged] = useState(false);
    const [jwt, setJwt] = useState("")
    const [categories,setCats] = useState([]);
    const data = useStaticQuery(graphql`
    {
      allCategory {
        edges {
          node {
            id
            name
            grand_child {
              id
              is_active
              name
            }
          }
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
    `)
    useEffect(() =>{
      axios.get( 
        `http://15.207.190.73/proqmed/rest/V1/altius/categories?rootCategoryId=13`
      ).then(async (response) => {
        
        setCats(response.data.children_data)
        
      })
        setJwt(localStorage.userToken);

        if(localStorage.userToken){
          setIsLoged(true);
        }else{
            setIsLoged(false);
        }
    
      }, []) 

    const handleChange = (event) => {
        setemail(event.target.value)
    }
    

    const sendNewsLetter = () => {
        if(email != ""){
        try {
            axios({
              method: 'post',
              url: `${process.env.GATSBY_CART_URL_STARCARE}newsletters/${email}`
            }).then((res) => {
              if (res.statusText === "OK" && res.status == 200) {
                toast.success(res.data)
              }
            }).catch((err) => {
              toast.error(err.response.data.message)
            })
          }
          catch (err) {
            console.error(err)
          }
        }
    }
    const rendercategory = () =>{
     
        let allCategory = categories;
        const elements_in_each_row = Math.round(allCategory.length / 3);
        const list = [];
        const topSelected = [];
    let result = allCategory;
    if(jwt){
      let catFromLocal = localStorage.category_permissions 
      if(catFromLocal){
        var allowedCat = catFromLocal.split(',').map(function(item) {
          return parseInt(item, 10);
        });
        result = allCategory.filter((o) => allowedCat.includes(+o.id));
      }
    }
    for (let i = 0; i < result.length; i += elements_in_each_row) {
      list.push(result.slice(i, i + elements_in_each_row));
    }

    for (let i = 0; i < 6; i++) {
      topSelected.push([result[i]]);
    }
        // for (let i = 0; i < allCategory.length; i += elements_in_each_row) {
        //   list.push(allCategory.slice(i, i + elements_in_each_row));
        // }
        
          return <div>
             <li>
                                <b>Categories</b>
                            </li>
          {     
            list.map((el, index) => (    
              el.map(item => (       
                <li key={item.id}>   
                 {item.product_count != 0 && item.node_data == true && <Link to={getCategoryURL(item)}>{item.name}</Link>} 
                  
                </li>  
              ))
            ))
          }
      </div>  
        
      
    
      }
    return (

        
    <div>
        <div className="benefits"> 
                <div className="container">
                    <div className="row"> 
                        {/* <div className="col-md-3">
                            <div className="banefit_content">
                                <span className="ic_benefits">
                                    <i className="free_shipping"></i>
                                </span>
                                <div className="info-block-content"><div className="info-block-title">Free Shipping</div>
                                <div className="info-block-text">On all orders over $49.00</div></div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="banefit_content">
                            <span className="ic_benefits">
                                    <i className="free_returns"></i>
                                </span>
                                <div className="info-block-content"><div className="info-block-title">15 days returns</div>
                                <div className="info-block-text">Moneyback guarantee</div></div>
                            </div>
                        </div> */}
                        
                          <div className="col-md-4">
                            <div className="banefit_content">
                                <span className="ic_benefits">
                                    <i className="free_shipping"></i>
                                </span>
                                <div className="info-block-content"><div className="info-block-title">Approved Suppliers</div>
                                <div className="info-block-text">Trusted Sellers</div></div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="banefit_content">
                            <span className="ic_benefits">
                                    <i className="secure_payment"></i>
                                </span>
                                <div className="info-block-content"><div className="info-block-title">Secure payment</div>
                                <div className="info-block-text">Protected by Paypal</div></div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="banefit_content">
                            <span className="ic_benefits">
                                    <i className="support"></i>
                                </span>
                                <div className="info-block-content"><div className="info-block-title">24/7 Support</div>
                                <div className="info-block-text">Live Support</div></div>
                            </div>
                        </div>
                    </div>
                </div> 
                </div>
        <section className="main-footer">
            <div className="container">
                <div className="row newsletter_holder">
                <div className="col-lg-6  col-md-12 col-sm-12">
                <h2>Get Our Updates Always Fast</h2>
                <p>10% off your next order when you sign up + be the first to know about new products and special offers.</p>

                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <ul className="newsletter">
                            <li>
                                <form className="w-100 newsletter">
                                <input type="text" className="form-control search" placeholder="Enter Your Email" aria-label="Recipient's username" aria-describedby="basic-addon2"onChange={e => { handleChange(e)}}></input>
                                <span className="btn btn-success newsletter_btn" onClick={() => { sendNewsLetter()}}>Subscribe Now</span>
                                    <div className="input-group">
                                    </div>
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="row ">
                    <div className="col-lg-5 col-md-12 col-sm-12 about_ftr">
                        <img src={logo} alt="brand" />
                        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut</p>
                        
                        <ul className="social_media">
                            <li href="#"><i className="ic_fb"></i><span></span></li>
                            <li href="#"><i className="ic_twitter"></i><span></span></li>
                            <li href="#"><i className="ic_insta"></i><span></span></li>
                        </ul>
                        {/* onClick={() => {window.open("https://www.facebook.com/narendramodi/", "_blank");}} */}
                        <h2><i className="phone_footer"></i>(+91)1234-5670</h2>
                    </div>
                    <div className="col-lg-2 col-md-12 col-sm-12">
                        <ul>
                            <li>
                                <b>Quick links</b>
                            </li>
                            <li>
                                <Link to="/aboutUs">About</Link>
                            </li>
                            <li>
                                <Link to="/contact">Contact Us</Link>
                            </li>
                            <li>
                                <Link to="/privacyPolicy">Privacy Policy </Link>
                            </li>
                            <li>
                                <Link to="/termsConditions">Terms & Conditions</Link>
                            </li>
                            
                            {/* <li>
                                   <Link to="/">Returns</Link>
                               </li>
                               <li>
                                   <Link to="/">Site Map</Link>
                               </li> */}
                        </ul>
                    </div>
                    <div className="col-lg-2 col-md-12 col-sm-12">
                        <ul>
                           
                            {rendercategory()}
                        </ul>
                    </div>
                    <div className="col-lg-2 col-md-12 col-sm-12">
                        <ul>
                            <li>
                                <b>My Account</b>
                            </li>
                            <li>
                                {!isLoged && <Link to="/signin">My Account</Link> }
                                {isLoged &&<Link to="/profile">My Account</Link>}
                            </li>
                            <li>
                            {!isLoged &&  <Link to="/signin">Shipping Info</Link> }
                                {isLoged && <Link to="/orders">Shipping Info</Link>}
                               
                            </li>
                            {/* <li>
                                <Link to="/compareList">Compare List</Link>
                            </li> */}
                            <li>
                            {!isLoged &&  <Link to="/signin">Wishlist</Link> }
                                {isLoged && <Link to="/wishlist">Wishlist</Link>}
                                
                            </li>
                            <li>
                                <Link to="/tracking/">Track Orders</Link>
                            {/* {!isLoged &&  <Link to="/signin">Track Orders</Link> }
                                {isLoged && <Link to="/tracking">Track Orders</Link>} */}
                                
                            </li>
                        </ul>
                    </div>
                    
                    
                </div>
                
            </div>
        </section>
        <section className="bottom_footer">
            <div className="container">
        <div className="bottom_footer_inner">
                    <div>
                        
                        <p>© 2021 Proqmed. Trademarks and brands are the property of their respective owners.</p>
                    </div>
                    <div>
                        <img src={paypal}></img>
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
    </div>

)      
}


export default Footer