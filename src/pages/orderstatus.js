import React, { useState, useEffect,useRef } from "react";
import Layout from '../components/layout';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "gatsby";
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import Orders from './orders'
import { useReactToPrint } from "react-to-print";

const Invoice = ({ location }) => {

    const [orders, setOrders] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [jwt, setJwt] = useState("")
    const [loader, setLoader] = useState(false);
    const [attach_data, setattachment] = useState([]);
    const [p,per] = useState(false);
    const [nop,noper] = useState(false);
    const [permits,setPermit] = useState([]);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
      });
    useEffect(() => {
        setPermit(localStorage.permissions);
        setJwt(localStorage.userToken);
        OrderStatus()
        invoiceDetails()
        handleClick()
    }, [])
  
    const OrderStatus = () => {
        setLoader(true);

        try {
            axios({
                method: "get",
                url: ` ${process.env.GATSBY_CART_URL_STARCARE}admin/orderstatus/${location.state.order_id}`
            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {
                    console.log(res.data)
                    setOrders(res.data);
                    if(permits.length!=0){
                        let viewwis=permits.includes("Can View Invoice")
                        per(viewwis)
                    }
                    else if(permits.length==0){
                        noper(true)
                    }
                    setLoader(false);
                }

            }).catch((err) => {
                setLoader(false);

            })
        }
        catch (err) {
            setLoader(false);

        }
    }
    const print = () =>{
        window.print();
    }
    const invoiceDetails = () => {
        setLoader(true);

        try {
            axios({
                method: "get",
                url: ` ${process.env.GATSBY_CART_URL_STARCARE}admin/invoice/${location.state.order_id}`,
            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {
                    console.log(res.data)
                    setInvoices(res.data);
                    setLoader(false);
                }

            }).catch((err) => {
                console.log(err);
                setLoader(false);

            })
        }
        catch (err) {
            console.log(err)
            setLoader(false);

        }
    }

    const handleClick = (invoice_id) => {
        const res = axios.get(
            `${process.env.GATSBY_CART_URL_STARCARE}admin/pdfinvoice/${location.state.order_id}`,
        ).then((data) => {
            let response_data = data.data
            if(response_data.length != 0){
            let dwnUrl = `${response_data[0]['invoice_pdf']}+&customer_id=${localStorage.customer_id}`;
            console.log(dwnUrl)
            setattachment(dwnUrl)
            }
        })
    }

    const orderProductDetails = () => {
        if (orders ) {
            return <div>
                {
                    orders.map((items, index) => (
                        <div key={index} className="card orderstatus">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product Image</th>
                                            <th>Product Name</th>
                                            <th>SKU</th>
                                            <th>Qty</th>
                                            <th>Price</th>

                                        </tr>
                                    </thead>
                                    {
                                        items.product_details.map((list, ind) => {
                                            return <tbody key={`${ind}_table`}>
                                                <tr>
                                                    <td><img src={list.image} /></td>
                                                    <td>{list.name}</td>
                                                    <td>{list.sku}</td>
                                                    <td>{Math.round(list.quantity)}</td>
                                                    <td>${parseFloat(list.price).toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        })
                                    }
                                </table>
                                <div >
                                    <p className="fo-align lft">Total : <span> {Math.round(items.order_total)} </span></p>
                                </div>
                            
                        </div>

                    ))
                }

            </div>
        }
        
    }

    const orderShipDetails = () => {
        if (orders ) {
            return <div>
                {
                    orders.map((items, index) => (
                        <div key={index} className="card orderstatus">                            
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product Image</th>
                                            <th>Product Name</th>
                                            <th>SKU</th>
                                            <th>Qty</th>
                                            <th>Price</th>

                                        </tr>
                                    </thead>
                                    {
                                        items.product_details.map((list, ind) => {
                                            return <tbody key={`${ind}_table`}>
                                                <tr>
                                                    <td><img src={list.image} /></td>
                                                    <td>{list.name}</td>
                                                    <td>{list.sku}</td>
                                                    <td>{Math.round(list.quantity)}</td>
                                                    <td>${parseFloat(list.price).toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        })
                                    }
                                </table>
                                <div >
        {/* <ReactToPrint
     trigger={() => { return <p>Print Shipment</p> ; }}     
      content={() => componentRef.current}
      />
      <Orders  ref={componentRef} /> */}

              {/* <button onClick={() => window.print({})}>PRINT</button> */}
              {/* <div>
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      />
      <orderShipDetails ref={componentRef} />
    </div> */}
                                    <p>Print Shipment</p>
                                   <Link to="/tracking"><p>Track this Shipment</p></Link> 

                                </div>
                            
                        </div>

                    ))
                }

            </div>
        }
        
    }

    const orderStatusDetails = () => {
        // return <div className="col-lg-12 col-md-12 col-xs-12"> 
        //       {
        //         orders.map((items, index) => {
        //             return (index == 0 ?
        //                 <div key={index} className="order_product">
        //                     <div className="product_status"  key={`${index}_table`} >
        //                         <table cellSpacing="2" cellPadding="4">
        //                             <thead>
        //                                 <tr>
        //                                     <th>Ordered Placed</th>
        //                                     <th>Status</th>
        //                                     <th>Total Amount</th>

        //                                 </tr>
        //                             </thead>
        //                             <tbody>
        //                                 <tr>
        //                                     <td>{items.order_date}</td>
        //                                     <td>{items.status}</td>
        //                                     <td>${Math.round(items.order_total)}</td>

        //                                 </tr>
        //                             </tbody>
        //                         </table>
        //                         <div className="order_note" >
        //                             <p>order name : <span> {items.Firstname} </span></p>
        //                             <p>Payment Method : <span> {items.payment_method} </span></p>
        //                         </div>
        //                     </div>
        //                 </div> : <span></span>)
        //         })
        //     }

        // </div>
    }
 const orderInformation = () => {
     return (
         <div>
             <h3>Order Information</h3>
             {
                orders.map((items, index) => {
                    return (index == 0 ?
             <><div className="fo-btm">
                            <h6>Shipping Address</h6>


                            <span>{items.Customer_address[0].firstname}</span><br></br>
                            <span>{items.Customer_address[0].street},{items.Customer_address[0].city},{items.Customer_address[0].region}</span>


                        </div>
                        <div className="fo-btm">
                                <h6>Shipping Method</h6>
                                <span>{items.shipping_method}</span>
                            </div>
                            <div className="fo-btm">
                                <h6>Billing Address</h6>
                                <span>{items.Customer_address[0].firstname}</span><br></br>
                            <span>{items.Customer_address[0].street},{items.Customer_address[0].city},{items.Customer_address[0].region}</span>
                            </div>
                            <div className="fo-btm">
                                <h6>Payment Method</h6>
                                <span>{items.payment_method}</span>
                            </div></>
                 : <span></span>)
                })
            }   
         </div>
     )
 }

    const Invoicetable = () => {
        if(p==true || nop==true){
            if (invoices.length != 0 ) {
                return <div className="order_product">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product Image</th>
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Qty</th>
                                    <th>Price</th>
    
                                </tr>
                            </thead>
                            {
                                invoices.map((list, index) => {
                                    return (index >= 1 ?
                                        <tbody key={`${index}_table`} >
                                            <tr>
                                                <td className="product_image"> <img src={list.image} /> </td>
                                                <td className="product_name">{list.peoduct_name} </td>
                                                <td>{list.sku}</td>
                                                <td>{Math.round(list.qty)}</td>
                                                <td>$ {parseFloat(list.price).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                        : <span></span>)
                                })
                            }
                        </table>
                    
                </div>
            }
        }else {
            return <div className="container padd">
            <span className="fo-AD">Access Denied</span>
        </div>
        }
       
    }
    const InvoiceTotal = () => {
        return <div>
            <table className="table table-striped summary">
                <div class="table_below">
                {
                    invoices.map((item, index) => {
                        return (index == 0 ?
                            <div>
                                <tr key={index}>
                                    <th>Subtotal</th> <td>{Math.round(item.Subtotal)}</td>
                                </tr>
                                <tr>
                                    <th>TaxAmount</th><td>{Math.round(item.Tax_Amount)}</td>
                                </tr>
                                <tr>
                                    <th>Shipping &amp; Handling</th><td>${Math.round(item.Shipping_Amount)}</td>
                                </tr>
                                <tr>
                                    <th>Grand Total</th><td>${Math.round(item.Grand_Total)}</td>
                                </tr>
                            </div> : <span></span>)
                    })
                }
                </div>
            </table>
        </div>
    }



    return (
        <Layout>

<div className="container-fluid grey">
<div className="container padd OS">          
                                           
                        <div className="row">
                        
                            <div className="col-lg-9 col-md-12 col-sm-12">

                            <div className="bg OS">
                            <div className="page_title_sec">
                            <h3 className="text-capitalize">Order</h3>
                            <div className="inner_breadcrums">
                    <Link to="/" className="breadcrum_anchor">Home</Link>
                    <p className="breadcrum_text">Order Status</p>
                </div>
                        </div>
                            <table className="table compareList_table">
                                <tbody>
                                    {orderStatusDetails()}
                                </tbody>
                            </table>
                            <Tabs defaultActiveKey="desc" id="uncontrolled-tab-example">
                                <Tab eventKey="desc" title="Ordered Items">
                                    {orderProductDetails()}
                                </Tab>
                                <Tab eventKey="spec" title="Invoice Details"><br></br>
                                    <div className="order_note">
                                        {attach_data.length !=0 ?
                                            <a href={attach_data} download>Pdf Download</a> : <span>This order Invoice not Available now </span>
                                        }
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-9 col-md-12 col-xs-12 compare_section cart_page table_responsive p-0">
                                            {Invoicetable()}
                                        </div>
                                        <div className="col-lg-3 col-md-6 col-xs-12 p-0">
                                            <div className="side_sec">
                                                {InvoiceTotal()}
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="ship" title="Order Shipment">
                                    {orderShipDetails()}
                                </Tab>
                            </Tabs>
                            </div>

                            </div>

                            <div className="col-lg-3 col-md-12 col-sm-12">
                            <div className="bg OS">
                            {orderInformation()}
                            </div>
                            </div>
                        </div>       
            </div>
            </div>


        </Layout >
    )
}
export default Invoice;






