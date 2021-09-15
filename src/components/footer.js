import { Link } from "gatsby"
import React, { useState,useEffect } from "react"

// images
import google from './../assets/google.png';
import pintrest from './../assets/pintrest.png';
import facebook from './../assets/facebook.png';
import instagram from './../assets/instagram.png';
import Linkedin from './../assets/linkedin.png';
import twitter from './../assets/twitter.png';
import payment from './../assets/payment.png';
import logo from './../assets/logo-bottom.png';
import delivery from './../assets/delivery.png';
import safety from './../assets/safety.png';
import secure from './../assets/secure.png';
import axios from "axios";
import {ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Footer = () => {
    const [email,setemail] = useState("");
    const [isLoged, setIsLoged] = useState(false);

    useEffect(() =>{

        if(localStorage.userToken){
          setIsLoged(true);
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
              url: `${process.env.GATSBY_API_BASE_URL}newsletters/${email}`
            }).then((res) => {
              if (res.statusText === "OK" && res.status == 200) {
                toast.success(res.data)
              }
            }).catch((err) => {
              console.error(err)
            })
          }
          catch (err) {
            console.error(err)
          }
        }
    }

    return (
    <div>
        <div className="benefits"> 
                <div className="container">
                    <div className="row"> 
                        <div className="col-md-3">
                            <div className="banefit_content">
                                <img className="w-100" src={delivery} alt={"banner"}/>  
                                <div className="info-block-content"><div className="info-block-title">Free Shipping</div><div className="info-block-text">Free delivery over $100</div></div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="banefit_content">
                                <img className="w-100" src={safety} alt={"bannerthree"}/>
                                <div className="info-block-content"><div className="info-block-title">Free Returns</div><div className="info-block-text">Hassle free returns</div></div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="banefit_content">
                                <img className="w-100" src={secure} alt={"banner"}/>
                                <div className="info-block-content"><div className="info-block-title">Secure Shopping</div><div className="info-block-text">Best security features</div></div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="banefit_content">
                                <img className="w-100" src={secure} alt={"banner"}/>
                                <div className="info-block-content"><div className="info-block-title">Unlimited Blocks</div><div className="info-block-text">Any content, any page</div></div>
                            </div>
                        </div>
                    </div>
                </div> 
                </div>
        <section className="main-footer">
            <div className="container">

                <div className="row">
                    <div className="col-md-2 about-unifi">
                        <img src={logo} alt="brand" />
                        <h2>10,234,777</h2>
                        <span>Total product sold</span>
                    </div>
                    <div className="col-md-2">
                        <ul>
                            <li>
                                <b>Support</b>
                            </li>
                            
                            <li>
                                <Link to="/aboutUs">About Unifi-i</Link>
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
                    <div className="col-md-2">
                        <ul>
                            <li>
                                <b>My Account</b>
                            </li>
                            <li>
                                <Link to="/cart">My Cart</Link>
                            </li>
                            {isLoged && <li>
                                <Link to="/orders">My Orders</Link>
                            </li>}
                            <li>
                                <Link to="/wishlist">My Wishlist</Link>
                            </li>
                            {isLoged &&<li>
                                <Link to="/compareList">Compare List</Link>
                            </li>}
                            <li>
                                <Link to="/sourceproductlist">Find Product Store</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <ul className="newsletter">
                            <li>
                                <b>Newsletter</b>
                                
                            </li>
                            <li>
                                Register now to get updates on promotions and coupons
                               </li>
                            <li>
                                <form className="w-100 newsletter">
                                <input type="text" className="form-control search" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2"onChange={e => { handleChange(e)}}></input>
                                <span className="btn btn-success btn-newl" onClick={() => { sendNewsLetter()}}>Submit</span>
                                    <div className="input-group">
                                    </div>
                                </form>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                    
                    
                        <ul className="newsletter">
                            <li>
                                <b>Shop with Confidence</b>
                                <img src={payment} />
                            </li>
                            
                        </ul>
                        
                    </div>
                </div>
                <div className="bottom_footer row">
                    <div className="col-md-6">
                        
                        <p>© 2019 Unifi-i. Trademarks and brands are the property of their respective owners.</p>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex justify-content-end">
                        <ul className="d-flex ml-5 smedia">
                                    <li>

                                    <img src={google} alt="google plus" />

                                </li>
                                <li>
                                    <img src={facebook} alt="google plus" />
                                </li>
                                <li>
                                    <img src={Linkedin} alt="google plus" />
                                </li>
                                <li>
                                    <img src={instagram} alt="google plus" />
                                </li>
                                <li>
                                    <img src={twitter} alt="google plus" />
                                </li>
                                <li>
                                    <img src={pintrest} alt="google plus" />
                                </li>
                            </ul>
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
    </div>

)      
}


export default Footer