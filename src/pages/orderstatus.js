import React, { useState, useEffect } from "react";
import Layout from '../components/layout';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "gatsby";
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'


const Invoice = ({ location }) => {

    const [orders, setOrders] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [jwt, setJwt] = useState("")
    const [loader, setLoader] = useState(false);
    const [attach_data, setattachment] = useState([]);


    useEffect(() => {
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
                        <div key={index} className="order_product">

                            <div className="product_status table-responsive" >
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
                                                    <td>{list.quantity}</td>
                                                    <td>${parseFloat(list.price).toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        })
                                    }
                                </table>
                                <div >
                                    <p>Total : <span> {items.order_total} </span></p>
                                </div>
                            </div>
                        </div>

                    ))
                }

            </div>
        }
        
    }

    const orderStatusDetails = () => {
        return <div className="col-lg-12 col-md-12 col-xs-12"> 
              {
                orders.map((items, index) => {
                    return (index == 0 ?
                        <div key={index} className="order_product">
                            <div className="product_status"  key={`${index}_table`} >
                                <table cellSpacing="2" cellPadding="4">
                                    <thead>
                                        <tr>
                                            <th>Ordered Placed</th>
                                            <th>Status</th>
                                            <th>Total Amount</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{items.order_date}</td>
                                            <td>{items.status}</td>
                                            <td>${items.order_total}</td>

                                        </tr>
                                    </tbody>
                                </table>
                                <div className="order_note" >
                                    <p>order name : <span> {items.Firstname} </span></p>
                                    <p>Payment Method : <span> {items.payment_method} </span></p>
                                </div>
                            </div>
                        </div> : <span></span>)
                })
            }

        </div>
    }


    const Invoicetable = () => {
        if (invoices.length != 0 ) {
            return <div className="order_product">
                <div className="product_status table-responsive"   >
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
                                            <td>{list.qty}</td>
                                            <td>$ {parseFloat(list.price).toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                    : <span></span>)
                            })
                        }
                    </table>
                </div>
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
                                    <th>Subtotal</th> <td>{item.Subtotal}</td>
                                </tr>
                                <tr>
                                    <th>TaxAmount</th><td>{item.Tax_Amount}</td>
                                </tr>
                                <tr>
                                    <th>Shipping &amp; Handling</th><td>${item.Shipping_Amount}</td>
                                </tr>
                                <tr>
                                    <th>Grand Total</th><td>${item.Grand_Total}</td>
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
            <section className="inner_banner_section">
                <h3>Orders</h3>
                <div className="inner_breadcrums">
                    <Link to="/" className="breadcrum_anchor">Home</Link>
                    <p className="breadcrum_text">Order Status</p>
                </div>
            </section>
            <section className="page_content inner_page">
                <div className="container boxed-content">
                    {/* <div className="inner_banner_img">
                        <img src={innerbanner} alt="inner_banner1" />
                    </div> */}
                    <div className="sec_block">
                        <div className="row page_title_sec">
                            <h3 className="text-capitalize">Order Details</h3>
                        </div>
                        <div className="row compare_section cart_page table-responsive">

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
                                    </div><br></br>
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
                            </Tabs>
                        </div>
                    </div>
                </div>
            </section>


        </Layout >
    )
}
export default Invoice;






