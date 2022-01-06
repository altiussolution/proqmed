import React , { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/layout"
import "../components/layout.css"
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

const Tracking =  () => {
    const [jwt, setjwt] = useState("");
    const [track, settrack] = useState([]);
    const [order, setorder] = useState([]);
    const {register, handleSubmit, errors } = useForm();
    const [aftimg,afterseller]= useState(false);
    const [status,setstatus]= useState(false);

    useEffect(() => {
      setjwt(localStorage.userToken);
  },[])
  const onSubmit =(event) => {
    try {
        axios({
          method: 'get',
          url: `${process.env.GATSBY_CART_URL_STARCARE}trackorder/order_id/${order}`,
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        }).then((res) => {
          if (res.statusText === "OK" && res.status == 200) {
              settrack(res.data[0]);
              setstatus(res.data[0].order_status);
              console.log(res.data[0])
              if (res.data[0].seller != null) {
                afterseller(true);
              }else{
                afterseller(false);
              }   
          }
        }).catch((err) => {
          console.error(err);
        })
      } catch (err) {
        console.error(err)
      }    
  }

  const MyIComponent = () => {
//    console.log(track.order_status)

    if (track.order_status == "complete") {
          return( <ul className="progressbar"> <li className="active">Ordered <span>{track.order_created_date}</span></li>
          <li className="active">Out For Delivery <span>{track.order_updated_date}</span></li>
          <li className="active">Delivered<span>{track.order_shipped_date}</span></li></ul>)
      } else if (track.order_status == "pending") {
        return( <ul className="progressbar"> <li className="active">Ordered <span>{track.order_created_date}</span></li>
       <li className="active">Pending<span>{track.order_updated_date}</span></li></ul>)
      }  
      return( <ul className="progressbar"> <li className="active">Ordered <span>{track.order_created_date}</span></li>
</ul>  ) 
 }
      return (
        
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
                                    <form onSubmit={handleSubmit(onSubmit)} className="Changepwd_form" autoComplete="off">
                                            <div className="inline_form">
                                            <div className="form-group">
                                                <label>Order Id</label>
                                                <input  className="form-control"      
                                                   id="orderid" name="orderid" onChange={(event) => setorder(event.target.value)} ref={register({    
                                                    required: true,
                                                   })}/> 
                                                {errors.orderid && errors.orderid.type === 'required' && <span>Please Enter OrderID</span>}
                                            </div>
                                            </div>
                                            <div className="form_btn">
                                            <button className="btn btn_gray"  type="submit">Track Order</button>
                                            </div>
                                            </form>
                                     </div>
                                     </div>
        <a href="#"><span><i className="fa fa-question-circle" aria-hidden="true"></i></span> Need Help?</a>
 */}

<div className="row">
              <div className="col-lg-3 col-md-12 col-sm-12">
              <form onSubmit={handleSubmit(onSubmit)} className="Changepwd_form" autoComplete="off">
                  <div className="track-order">                      
                      {/* <h4> <span><i className="fa fa-truck" aria-hidden="true"></i></span> Track Order</h4> */}
                      <div className="track">                      
                        <input className="form-control" id="orderid" name="orderid" type="text" 
                        placeholder="Enter Order Id" maxLength="9" onChange={(event) => setorder(event.target.value)} 
                        ref={register({    
                                          required: true,
                               })}/> 
                      {errors.orderid && errors.orderid.type === 'required' && <span>Please Enter Order Id</span>}                        
                      </div>
                      <button type="submit" className="btn_gray btn">Track Order</button>                    
                  </div>   
                  </form>
              </div>      
              <div className="col-lg-9 col-md-12 col-sm-12 ">
                  <div className="fo-bg-white ng">
                    <div className="tr-header">
                      <div className="id">
                        <h4>Order ID: <span>{order}</span></h4>
                      </div>

                      <div className="customer-name">
                        <h4>Customer Name: <span>{track.customer_name}</span></h4>
                      </div>
                    </div>

                    <div className="tr-body">
                      <div className="tr-img">
                        <img className="images/fp4.png" alt=""></img>
                      </div>

                      <div className="info">
                        <p>{track.product_name}</p>
                        <p className="price">{track.order_total}</p>
                      </div>
                      
                     { aftimg && <div className="info-type">
                        <p>seller</p>
                        <h6>{track.seller}</h6>              
                      </div>}
                    </div>
                    <div className="tr-bottom">
                        {MyIComponent()}
                      
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
    }

export default Tracking;
//Fri, 22nd Dec