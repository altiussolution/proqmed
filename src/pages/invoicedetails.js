import React, { useState, useEffect } from "react";
import Layout from '../components/layout';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "gatsby";


const Invoice = ({location}) => {

    const [orders, setOrders] = useState([]);
    const [jwt, setJwt] = useState("")
    const [loader, setLoader] = useState(false);
    const [attach_data, setattachment] = useState(null);


    useEffect(() => {
        setJwt(localStorage.userToken);
        invoiceDetails()
    }, [])

    const invoiceDetails = () => {
        setLoader(true);

        try {
            axios({
                method: "get",
                // url: ` ${process.env.GATSBY_CART_URL}admin/invoice/128`,
                url: ` ${process.env.GATSBY_CART_URL_STARCARE}admin/invoice/${location.state.order_id}`,

            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {                   
                    setOrders(res.data);
                    setLoader(false);
                }

            }).catch((err) => {
                console.error(err);
                setLoader(false);

            })
        }
        catch (err) {
            console.error(err)
            setLoader(false);

        }
    }

    const handleClick = (entity_id) =>{
        const res = axios.get(
        `${process.env.GATSBY_CART_URL_STARCARE}admin/pdfinvoice/${entity_id}`
        // `${process.env.GATSBY_CART_URL}admin/pdfinvoice/${entity_id}`

        ).then((data)=>{
          let response_data = data.data
          setattachment(response_data)
      })   
    }

    const InvoiceDetails = () => {
        if (orders) {
        return <div>
            
                {
                    orders.map((list, index) => ( index == 1 ?
                        <div key={`${index}_table`} className="order_product">
                        
        
            <div class= "col-lg-3 col-md-6 col-sm-12">

            <h5 class=" order_txt ">Order I'd: {list.order_id} </h5>

            </div> 
             </div>:<div>
        
            <div class= "col-lg-3 col-md-6 col-sm-12">

            <h5 class=" order_txt ">Date: {list.Created_at} </h5>

            </div>

        </div>
                             
                        ))  
                      }
                      </div>
           
      
                 }
                }
     const Invoicetable = () => { 
                    return  <div>
            {

              <div  className="order_product"> 
              <ul class="nav nav-tabs">
          <li class="active"><a class="tabs_heading" data-toggle="tab"><Link to = "/orderstatus">order Status</Link></a></li>
    {/* <li><a class="tabs_heading1" data-toggle="tab" href="#menu1"><Link to = "/invoicedetails">Invoice details</Link></a></li> */}
<        li><a class="tabs_heading1" data-toggle="tab" href="#menu2">Order Shipments</a></li>

      </ul>  
                    <button onClick={handleClick}>
                                Pdf Download
                            </button>
                            <div> 
                            {  attach_data?  
                                <a href={attach_data[0].invoice_pdf} download>{attach_data[0].invoice_pdf}</a>:<span></span>
                            }
                                </div>
                <h3 class="heading2"> InvoiceDetails</h3>
           <div>
     <div class="container-fluid">
    <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="content_rght">
            <div class="container1">
               <div class="tab-content">
                <div id="home" class="tab-pane active">
                    <div className="fo-scroll main">
                 <table>
            
                    <thead>
                        <tr class="heading_row">
                        <th class="col name">Product Image</th>
                            <th class="col name">Product Name</th>
                            <th class="col sku">SKU</th>
                            <th class="col qty">Qty</th>
                            <th class="col price">Price</th>
                        </tr>
                    </thead>
            
                    <tbody >
                    {
                  orders.map((list, index) => { 
                   return <tr key={`${index}_table`}>
                        <td class="col name" > <img class="banner_img" src={list.image} /> </td>
                            <td class="col name" > {list.peoduct_name} </td>
                            <td class="col sku">{list.sku}</td>
                            <td class="col qty text-center"> {list.qty}</td>

                        </tr>           
            })   
            }
            </tbody>
                   
                        
                    </table>
                    </div>
                </div>
            
            
                               </div>
                            </div>
                             </div>
                         </div>
                     </div>
                 </div>
                 </div>
                 </div>
                
            }
            </div>
             
        }
        const InvoiceTotal= () => {
            return  <div className="col-lg-12 col-md-12 col-xs-12">
                {   
                                 orders.map((list,ind) =>{ 
                                        return (ind == 0 ?
                                        <div className="product_status" key={`${ind}_table`}>
                                             <tfoot>

                                       <tr class="subtotal">
                                 <th colspan="4" class="mark" scope="row"> Subtotal</th>
                                       <td class="amount" data-th="Subtotal">
                                  <span class="price">{list.Subtotal}</span>
                                       </td>
                                </tr>
                                <tr class="subtotal">
                                 <th colspan="4" class="mark" scope="row"> TaxAmount</th>
                                       <td class="amount" data-th="Subtotal">
                                  <span class="price">{list.Tax_Amount}</span>
                                       </td>
                                </tr>
            
               <tr class="shipping"> 
               <th colspan="4" class="mark" scope="row">Shipping &amp; Handling</th>
                  <td class="amount" data-th="Shipping &amp; Handling">
                    <span class="price">${list.Shipping_Amount}</span>                    
                 </td>
               </tr>
    
             <tr class="grand_total">
             <th colspan="4" class="mark" scope="row">
            <strong>Grand Total</strong>
              </th>
            <td class="amount">
            <strong><span class="price">${list.Grand_Total}</span></strong>
             </td>
           </tr>
           </tfoot>
                 </div> :<div></div>
                                                                                                             )                                                                            })
                }
            </div>
        }

          

return (
    <Layout>                          
        <div>
       { InvoiceDetails()}
      </div>
        <div>
       { Invoicetable()}
      </div>
      <div>
      {InvoiceTotal()}
      </div>
    </Layout >
)
}
export default Invoice;