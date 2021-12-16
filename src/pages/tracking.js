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
                                    <h1>Track <span>Order</span></h1>
                                </div>
                                <div className="row">
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
                                     </div>
                                </div>
                                </div>
                                </div>
                                </main>
  </Layout>
)

export default tracking