import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import groupArray  from "group-array"
import { ToastContainer, toast } from 'react-toastify';
import {  navigate } from "gatsby";
import 'react-toastify/dist/ReactToastify.css';   
import { Link } from "gatsby";


const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [jwt,setJwt] = useState("")

    useEffect(() => {
        setJwt(localStorage.userToken);
        setOrderDetails()
    }, [])

    const setOrderDetails = () => {
        try{
            axios({
                method : "get",
                url: `${process.env.GATSBY_CART_URL_STARCARE}orderlistcustomer/${localStorage.email}`,
            }).then((res) => {
                if(res.statusText === "OK" && res.status == 200){
                    let orderArray = [];
                    for(let x of res.data){
                        if(x['increment_id']){
                            orderArray.push(groupArray(res.data, 'order_id')[x['order_id']])
                        }
                    }
                    setOrders(orderArray);
                }
                
            }).catch((err) => {  
                console.error(err);
            })
        }
        catch(err){
            console.error(err)
        }    
    }

    const cancelOrder = (order_id) => {
        try{  
            axios({
                method : "post",
                url: `${process.env.GATSBY_CART_URL_STARCARE}ordercancel/${order_id}`,
                headers : {
                    'Authorization' : `Bearer ${jwt}`
                },
            }).then((res) => {
                if(res.statusText === "OK" && res.status == 200){
                    toast.success(res.data);
                   setOrderDetails();    
                }
                
            }).catch((err) => {  
                console.error(err);
            })
        }
        catch(err){
            console.error(err)
        }
    }

    const reorder = (id) => {
        try {
            axios({
                method: "post",
                url: `${process.env.GATSBY_CART_URL_STARCARE}admin/reorder/${id}`,
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {
                    toast.success('Reorder Created');
                    setOrderDetails();
                }

            }).catch((err) => {
                console.error(err);
            })
        }
        catch (err) {
            console.error(err)
        }
    }

    const orderstatus = () => {
        navigate('/orderstatus');
    }

    const orderDetails = () => {
        return  <div className="col-lg-12 col-md-12 col-xs-12">
             
            {orders.length == 0 ? 
            (<div className="col-lg-9 col-md-9 col-xs-12 no_data">
            <h1>No Item found</h1></div>) :
                orders.map((items,index) => (
                    <div key={index} className="order_product">
                            {
                                items.map((orders,ind) =>{
                                    return (ind == 0 ? 
                                    <div className="product_status" key={`${ind}_table`}>
                                        <table cellSpacing="2" cellPadding="4">
                                            <thead>   
                                                <tr>
                                                    <th>Ordered Placed</th>
                                                    <th>Status</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{new Date(orders.created_at).toLocaleString()}</td>
                                                    <td>{orders.status}</td>
                                                    <td>${orders.grand_total}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="order_note">
                                            <p>Order Des : <span> {orders.shipping_description} </span></p>
                                            <p>Payment Method : <span> {orders.payment_method} </span></p>
                                            
                                            <div className="button_sec">
                                            {orders.status !== 'canceled' && <button className="btn btn_gray" type="button" onClick={()=> cancelOrder(orders.order_id)}>Cancel Order</button>}
                                                <button className="btn btn_gray mt-1" type="button" onClick={() => reorder(orders.order_id)}>ReOrder</button>
                                            
                                       <Link className="btn btn_gray" to="/orderstatus" state={{ order_id: orders.order_id }} >OrderStatus</Link>
                                     </div>
                                         </div>
                                    </div> 
                                    : <div key={`${ind}_product`}  className="product_item"> 
                                            <div className="product_img">
                                                <img src={orders.image} />
                                            </div>
                                            <div className="product_desc">
                                                <h3>{orders.peoduct_name}</h3>
                                                <ul>
                                                    <li>
                                                        <p>SKU <span>{orders.sku}</span></p>
                                                    </li>
                                                    <li>
                                                        <p>Qty <span>{orders.qty} </span></p>
                                                    </li>
                                                    <li>
                                                        <p>Product Id <span>{orders.product_id}</span></p>
                                                    </li>
                                                </ul>  
                                               
                                            </div>
                                    </div>)
                                })
                            }
                    </div>
                ))
            }
        </div>
    }

    return (
        <>
            <Layout>
                <main className="order_page">
                    <div className="App">
                        <div className="content_wrapper">
                            <div className="container">
                                <div className="main_title">
                                    <h1>My <span>Orders</span></h1>
                                </div>
                                <div className="row">
                                    {orderDetails()}
                                </div>
                            </div>
                        </div>
                    </div>
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
                </main>


            </Layout>
        </>
    )

}

export default Orders;