import React from "react"

import Layout from "../components/layout"
import "../components/layout.css"

const tracking = () => (
<Layout>
    <main>
                    <div className="App">
                        <div className="content_wrapper">
                            <div className="container">
                                <div className="main_title">
                                    <h1>Track Order</h1>
                                </div>
                                {/* <div className="row">
                                    <div className="col-lg-12 col-md-12 col-xs-12">
                                    <form className="Changepwd_form" autoComplete="off">
                                            <div className="inline_form">
                                            <div className="form-group">
                                                <label>Order Id</label>
                                                <input  className="form-control"      
                                                   /> 
                                            </div>
                                            </div>
                                            <div className="form_btn">
                                            <button className="btn btn_gray">Track Order</button>
                                            </div>
                                            </form>
                                     </div>
                                     </div> */}

<div className="row">
              <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="track-order">                      
                      <h4> <span><i className="fa fa-truck" aria-hidden="true"></i></span> Track Order</h4>
                      
                      <div className="track">
                        
                        <input type="text" placeholder="Enter Order Id"></input>
                        
                      </div>
                      <button type="button" className="btn btn-danger">Track Order</button>
                  </div>
      
                  
              </div>
      
              <div className="col-lg-9 col-md-12 col-sm-12 ">
                  <div className="fo-bg-white ng">
                    <div className="tr-header">
                      <div className="id">
                        <h4>Order ID: <span>CB567BAC</span></h4>
                      </div>

                      <div className="customer-name">
                        <h4>Customer Name: <span>Robin</span></h4>
                      </div>
                    </div>

                    <div className="tr-body">
                      <div className="tr-img">
                        <img className="images/fp4.png" alt=""></img>
                      </div>

                      <div className="info">
                        <p>Ionizer to neutralizer electrotatic change</p>
                        <p className="price">$100</p>
                      </div>
                      
                      <div className="info-type">
                        <p>seller</p>
                        <h6>ABC Goods</h6>
                      
                      </div>

                      <a href="#"><span><i className="fa fa-question-circle" aria-hidden="true"></i></span> Need Help?</a>
                    </div>

                    <div className="tr-bottom">
                      <ul className="progressbar">
                        <li className="active">Ordered <span>Fri, 22nd Dec</span></li>
                        <li >Out For Delivery <span>Mon, 24nd Dec</span></li>
                        <li>Delivered<span>Mon, 24nd Dec</span></li>
                      </ul>
                    </div>
                      
                </div>    
                
          </div>
      </div>
                                </div>
                                </div>
                                </div>
                                </main>
  </Layout>
)

export default tracking