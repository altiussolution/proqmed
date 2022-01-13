import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import groupArray  from "group-array"
import { ToastContainer, toast } from 'react-toastify';
import {  navigate } from "gatsby";
import 'react-toastify/dist/ReactToastify.css';   
import { Link } from "gatsby";
import { TablePagination } from '@mui/material';

const Orders = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [orders, setOrders] = useState([]);
    const [jwt,setJwt] = useState("")
    const [permit,perMission] = useState([]);
    const [p,per] = useState(false);
    const [re,reodr]= useState(false);
    const [outp,outper] = useState(false);
    const [outre,outreodr]= useState(false);
    useEffect(() => {
        setJwt(localStorage.userToken);
        if(localStorage.permissions){
            perMission(localStorage.permissions);
        }
        
        console.log(permit)
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
                    if(localStorage.permissions){
                        let orderhis=localStorage.permissions.includes("Can View Order History")
                        let reorder = localStorage.permissions.includes("Can View Individual Orders Or Reorder")
                        per(orderhis)
                        reodr(reorder)
                    }else if(!localStorage.permissions){
                        outper(true)
                        outreodr(true)
                    }
                   
                }
                
            }).catch((err) => {  
                console.error(err);
            })
        }
        catch(err){
            console.error(err)
        }    
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
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
        if(p==true || outp==true){
            return ( 
            <div >
            
             
            {orders.length == 0 ? 
            (<div className="col-lg-9 col-md-9 col-xs-12 no_data ">
                
            <h1>No Item found</h1>
            
            </div>) :
            
         
            <div class="col-lg-9 col-md-12 col-sm-12 ">
            <div class="fo-bg-white">
                <div class="top">
                    <div class="header">
                    <h2 class="heading">My Orders <span>({orders.length})</span></h2>
                    
                </div>
                <div class="grid-right">
                    <div class="search">
                        <input type="text" placeholder="search"/>
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </div>
                </div>
                </div>
                <div>
                {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((items,index) => (
                <div class="order-details" key={index}>
                      {
                                items.map((orders,ind) =>{
                                    return (ind == 0 ? 
                    <div class="row" key={`${ind}_table`}>
                        <div class="col-lg-3 col-md-12 col-sm-12">
                            <div class="or-left">
                                <p>Order ID</p>
                                <p>Customer Name</p>
                                <p>Price</p>
                                <p>Status</p>
                                <p>Payment method</p>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-12 col-sm-12">
                            <div class="or-left">
                                <p>: {orders.orders_id}</p>
                                <p>: {orders.shipping_description}</p>
                                <p>:${orders.grand_total}</p>
                                <p>: {orders.status}</p>
                                <p>: {orders.payment_method}</p>
                                <span class="functions"><p><i class="fa fa-calendar-o" aria-hidden="true"></i>{new Date(orders.created_at).toLocaleString()}</p><p><i class="fa fa-clock-o" aria-hidden="true"></i> 12.30 PM</p></span>
                            </div>
                        </div>

                        <div class="col-lg-3 col-md-12 col-sm-12">
                            <div class="buttons-or">
                        {re && <button type="button" class="btn btn-danger" onClick={() => reorder(orders.order_id)}>ReOrder</button>}
                                            {outre && <button type="button" class="btn btn-danger" onClick={() => reorder(orders.order_id)}>ReOrder</button>}
                                            <Link className="btn btn_gray" to="/orderstatus" state={{ order_id: orders.order_id }} ><button type="button" class="btn btn-primary "> View Order</button></Link>
                                            {orders.status !== 'canceled' && <button className="btn btn outline" type="button" onClick={()=> cancelOrder(orders.order_id)}>Cancel Order</button>}
                        <a href="#"><i class="fa fa-sticky-note" aria-hidden="true"></i>Invoice</a>
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
                    
            </div>
                    ) 
                })
            }
                </div>
  ))
}</div>
                

                  
          </div>      
         
          <div class="bottom-paginatino">
          <TablePagination
  component="div"
  rowsPerPageOptions={[5, 10, 25]}
  page={page}
  count={orders.length}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
          </div>
    </div> }
        </div>
            )
        
    }

            };


            
    return (
        <>
            <Layout>
                {/* <main className="order_page">
                    <div className="App">
                        <div className="content_wrapper">
                            <div className="container">
                                <div className="main_title">
                                    <h1>My Orders <span>({orders.length})</span></h1>
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
                    <TablePagination
  component="div"
  rowsPerPageOptions={[5, 10, 25]}
  page={page}
  count={orders.length}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
                </main> */}
 <div class="container-fluid grey">
<div class="container">
    <div class="row"><div class="col-lg-3 col-md-12 col-sm-12">
        <div class="cart-details-sec">
            <div class="top">
            <div class="header">
                <h2 class="heading">Filters </h2>
            </div>
        </div>
        <div class="filters">
            <h6>Order Status</h6>

            <ul>
                <li><a href="#"> <span><div class="form-check">
                    <input type="checkbox" class="form-check-input" id="check1" name="option1" value="something"  />
                    
                  </div></span> On the way</a></li>
                <li><a href="#"><span><div class="form-check">
                    <input type="checkbox" class="form-check-input" id="check1" name="option1" value="something"  />
                    
                  </div></span> Delivered</a></li>
                <li><a href="#"> <span><div class="form-check">
                    <input type="checkbox" class="form-check-input" id="check1" name="option1" value="something"  />
                    
                  </div></span>Cancelled</a></li>
                
            </ul>
        </div>
            
        </div>
      
       
        
     
        
    </div>

       
    

        
</div>
{orderDetails()}   
</div>
</div>


            </Layout>
        </>
    )
}

export default Orders;