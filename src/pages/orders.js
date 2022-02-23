import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import groupArray  from "group-array"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';   
import { Link } from "gatsby";
import { TablePagination } from '@mui/material';
import { navigate } from "gatsby"

const Orders = () => {
    const [page, setPage] = React.useState(0); 
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [orders, setOrders] = useState([]);
    const [jwt,setJwt] = useState("")
    const [p,per] = useState(false);
    const [re,reodr]= useState(false);
    const [outp,outper] = useState(false);
    const [outre,outreodr]= useState(false);
    const [attach_data, setattachment] = useState(null);
    const array=[]
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
                if(res.statusText === "OK" && res.status === 200){
                    let orderArray = [];
                    for(let x of res.data){
                        if(x['increment_id']){
                            orderArray.push(groupArray(res.data, 'order_id')[x['order_id']])
                        }
                    }
                    console.log(orderArray)
                    setOrders(orderArray);
                    if(!localStorage.permissions){
                        outper(true)
                        outreodr(true)
                      }else {
                        let hi = JSON.parse(localStorage.permissions)
                        let orderhis=hi.includes("Can View Order History")
                        let reorder = hi.includes("Can View Individual Orders Or Reorder")
                        if(orderhis == false){
                            navigate('/')
                            setTimeout(() => {
                                toast.error("Access Denied,Please Contact Admin")
                              }, 500)
                            
                            }
                        per(orderhis)
                        reodr(reorder)
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
        if (window.confirm("Do you want to cancel order?")) {
        try{  
            axios({
                method : "post",
                url: `${process.env.GATSBY_CART_URL_STARCARE}ordercancel/${order_id}`,
                headers : {
                    'Authorization' : `Bearer ${jwt}`
                },
            }).then((res) => {
                if(res.statusText === "OK" && res.status === 200){
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
                if (res.statusText === "OK" && res.status === 200) {
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
const filtercall = (data) =>{
    try {
        axios({
            method: 'post',
            url: `${process.env.GATSBY_CART_URL_STARCARE}customer/ordersfilter`,
            data: data,
        })
            .then(function (response) {
                console.log(response.data)
                let orderArray = [];
                for(let x of response.data){
                    if(x['increment_id']){
                        orderArray.push(groupArray(response.data, 'order_id')[x['order_id']])
                    }
                }
                console.log(orderArray)
                setOrders(orderArray);
            })
            .catch(function (response) {
                
            });

    } catch (err) {
        console.error(`An error occured ${err}`)
    }   
}

    const filterData =(e,datas)=> {
        console.log(e.target.checked,datas)
        console.log(e.target.value)
        if(e.target.checked){
            array.push(datas)
            let data = {
                "data":{
                        "order_status":array,
                        "email":localStorage.email
                    }
                }
               filtercall(data);
            }else if(!e.target.checked) {
                var carIndex = array.indexOf(datas);
                array.splice(carIndex, 1);
                let data = {
                    "data":{
                            "order_status":array,
                            "email":localStorage.email
                        }
                    }
            if(array.length>0){
                filtercall(data);
            }else {
                setOrderDetails();
            }
            }
    }


    const filterDataa =(e,datas)=> {
        console.log(e.target.checked,datas)
        console.log(e.target.value)
        if(e.target.checked){
            array.push(e.target.value)
            let data = {
                "data":{
                        "order_status":[e.target.value],
                        "email":localStorage.email
                    }
                }
               filtercall(data);
            }else if(!e.target.checked) {
                var carIndex = array.indexOf(datas);
                array.splice(carIndex, 1);
                let data = {
                    "data":{
                            "order_status":array,
                            "email":localStorage.email
                        }
                    }
            if(array.length>0){
                filtercall(data);
            }else {
                setOrderDetails();
            }
            }
    }
const filterData1 = (val,datas)=>{
if(val.target.checked){
array.push(datas)
let data = {
    "data":{
            "order_status":array,
            "email":localStorage.email
        }
    }
   filtercall(data);
}else if(!val.target.checked) {
    var carIndex = array.indexOf(datas);
    array.splice(carIndex, 1);
    let data = {
        "data":{
                "order_status":array,
                "email":localStorage.email
            }
        }
if(array.length>0){
    filtercall(data);
}else {
    setOrderDetails();
}
}
    }


    const filterData2 = (val,datas)=>{
        if(val.target.checked){
            array.push(datas)
            let data = {
                "data":{
                        "order_status":array,
                        "email":localStorage.email
                    }
                }
               filtercall(data);
            }else if(!val.target.checked) {
                var carIndex = array.indexOf(datas);
                array.splice(carIndex, 1);
                let data = {
                    "data":{
                            "order_status":array,
                            "email":localStorage.email
                        }
                    }
            if(array.length>0){
                filtercall(data);
            }else {
                setOrderDetails();
            }
            }
    }

    const handleClick = (id) =>{
        const res = axios.get(
        `${process.env.GATSBY_CART_URL_STARCARE}admin/pdfinvoice/${id}`
        // `${process.env.GATSBY_CART_URL}admin/pdfinvoice/${entity_id}`

        ).then((data)=>{
            console.log(res)
          let response_data = data.data
          setattachment(response_data)
      })   
    }
    const searchOrder = async (val) => {
        if(val.target.value.length>=2){
            let data = {
                
                    "data":{
                        "search_keyword":val.target.value,
                        "email":localStorage.email
                    }
                
            }
            try {
                axios({
                    method: 'post',
                    url: `${process.env.GATSBY_CART_URL_STARCARE}customer/orderslistsearch`,
                    data: data,
                })
                    .then(function (response) {
                        let orderArray = [];
                        for(let x of response.data){
                            if(x['increment_id']){
                                orderArray.push(groupArray(response.data, 'order_id')[x['order_id']])
                            }
                        }
                        console.log(orderArray)
                        setOrders(orderArray);
                    })
                    .catch(function (response) {
                        
                    });
        
            } catch (err) {
                console.error(`An error occured ${err}`)
            }
        }else if(val.target.value.length ===0 || val.target.value.length ===1){
          setOrderDetails();
        }
        }
        const orderDetails1 = () => {
return ( 
    <div className="container padd">
                     <span className="fo-AD">Access Denied</span>
                 </div>
)
        }
    const orderDetails = () => {
        if(p===true || outp===true){
            return ( 
            <>
            <div className="col-lg-9 col-md-9 col-xs-12 ">

                <div className="fo-bg-white po">
                 <div className="grid-right">
                 <div className="top">
                                    <div className="header">
                                        <h2 className="heading">My Orders <span>({orders.length})</span></h2>

                                    </div>
                         <div className="search orders">
                        <input type="text" placeholder="Search" onChange={e => { searchOrder(e) }}/>
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </div>
                                </div>
                
                </div>
                {orders.length == 0 ?   (<h1>No Item found</h1>):
              <><div className="fo-bg-white or">
                             

                                <div>
                                    {orders.slice(0).reverse().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((items, index) => (
                                        <div className="order-details" key={index}>
                                           

                                                <div className="row same">
                                                    <div className="col-lg-3 col-md-12 col-sm-12">
                                                        <div className="or-left bold">
                                                            <p>Order ID</p>
                                                            <p>Customer Name</p>
                                                            <p>Price</p>
                                                            <p>Status</p>
                                                            <p>Payment method</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                                        <div className="or-left">
                                                            <p>: {items[0].increment_id}</p>
                                                            <p>: {items[0].customer_firstname}</p>
                                                            <p>: $ {parseFloat(items[0].grand_total).toFixed(2)}</p>
                                                            <p>: {items[0].status}</p>
                                                            <p>: {items[0].payment_method}</p>
                                                            {/* <span className="functions"><p><i className="fa fa-calendar-o" aria-hidden="true"></i>{new Date(orders.created_at).toLocaleDateString()}</p><p><i className="fa fa-clock-o" aria-hidden="true"></i>{new Date(orders.created_at).toLocaleTimeString('en-US')}</p></span> */}
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-12 col-sm-12">
                                                        <div className="buttons-or">
                                                            {re && <button type="button" className="btn btn-danger square" onClick={() => reorder(items[0].order_id)}>Reorder</button>}
                                                            {outre && <button className="btn btn-danger" onClick={() => reorder(items[0].order_id)}>Reorder</button>}
                                                            <Link to="/orderstatus" state={{ order_id: items[0].order_id,increment_id:items[0].increment_id }}><button className="btn btn-primary">View Order</button></Link>
                                                            {items[0].status !== 'canceled' && items[0].status !== 'complete' && <button className="btn btn outline" type="button" onClick={() => cancelOrder(items[0].order_id)}>Cancel Order</button>}
                                                            {attach_data && <a><i className="fa fa-sticky-note" aria-hidden="true" onClick={handleClick}></i>Invoice
                                                                <div>
                                                                    {attach_data ?
                                                                        <a href={attach_data[0].invoice_pdf} download>{attach_data[0].invoice_pdf}</a> : <span></span>}
                                                                </div></a>}
                                                        </div>
                                                    </div>
                                                </div>
                                              
                                         
                                        </div>
                                    ))}</div>



                            </div><div className="bottom-paginatino">
                                    <TablePagination
                                        component="div"
                                        rowsPerPageOptions={[5, 10, 25]}
                                        page={page}
                                        count={orders.length}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        onRowsPerPageChange={handleChangeRowsPerPage} />
                                </div></>
                    
                    }

</div>
             </div>
         
        </>
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
 <div className="container-fluid grey">
<div className="container padd">
    <div className="row"><div className="col-lg-3 col-md-12 col-sm-12">
        
        <div className="cart-details-sec">
            <div className="top">
            <div className="header">
                <h2 className="heading">Filters </h2>
            </div>
        </div>
        <div className="filters">
            <h6>Order Status</h6>

            <ul>
                <li><a > <div className="form-check">
                    <input type="checkbox" className="form-check-input fo-right" id="check1" name="option1" value="pending"  onClick={e => { filterData(e,'pending') }}/>
                    
                  </div> <span className="way">On the way</span> </a></li>
                <li><a ><span><div className="form-check">
                    <input type="checkbox" className="form-check-input" id="check1" name="option1" value="complete"  onClick={e => { filterData1(e,'complete') }}/>
                    
                  </div></span> <span className="way">Delivered</span></a></li>
                <li><a> <span><div className="form-check">
                    <input type="checkbox" className="form-check-input" id="check1" name="option1" value="canceled"  onClick={e => { filterData2(e,'canceled') }}/>
                    
                  </div></span><span className="way">Canceled</span></a></li>
                
            </ul>
        </div>
            
        </div>
      
       
        
     
        
    </div>
   {orderDetails()}  
        
    

        
</div>
  
</div>
</div>


            </Layout>
        </>
    )
}

export default Orders;