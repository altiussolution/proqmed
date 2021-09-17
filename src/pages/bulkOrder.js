import React, { useEffect, useState } from 'react';
import Layout from "../components/layout";
import axios from "axios";
import { getCartCount , viewCartItems} from "./../utils/apiServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BulkOrder = () => {

    const [quoteId, setQuoteId] = useState("");
    const [bulkOrder, setBulkOrder] = useState([{ "sku": "", "qty": "" }])
    const [jwt, setJwt] = useState("")
    const [cartCnt, setCartCnt] = useState(getCartCount())
    const [placeBtn,SetPlaceBtn] = useState(false);

    useEffect(() => {
        setQuoteId(localStorage.cartId);
        setJwt(localStorage.userToken);
    }, [])

    const handleChange = (event, i) => {
        const { name, value } = event.target;
        let orders = [...bulkOrder];
        orders[i] = { ...orders[i], [name]: value };
        setBulkOrder(orders);
    }

    const addMoreItems = () => {
        let orders = [...bulkOrder];
        let itLength = (orders.length == 1 ? 0 : orders.length-1)
        if(orders[itLength]["sku"] === ""){
            toast.error("Enter valid SKU")
            SetPlaceBtn(true)
        }else{
            axios.get( 
                `${process.env.GATSBY_CART_URL}admin/minmaxqtybulk/${orders[itLength]['sku']}`
              ).then(async (data) => {
                if(data.status == 200){
                  let min = Math.round(data.data[0].min_sale_qty);
                  let max = Math.round(data.data[0].max_sale_qty)
                  if(orders[itLength]['qty'] > max)
                  {toast.error(`Maximum Qty is ${max}`);SetPlaceBtn(true)}
                  else if(orders[itLength]['qty'] < min)
                  {toast.error(`Minimum Qty is ${min}`);SetPlaceBtn(true)}
                  else{
                    SetPlaceBtn(false)
                    orders.push({ "sku": "", "qty": "" })
                    setBulkOrder(orders);
                  }
                }
              })
        }
    }

    const validateBulkOrder = () => {
        let checkIsEmpty = false;
        for (var i = 0; i < bulkOrder.length; i++){
          if (bulkOrder[i].sku == '' || bulkOrder[i].qty == ''){
            checkIsEmpty = true;
          }
        }
        if(!checkIsEmpty){
            placeOrder();
        }else{
          toast.error('Item number missed to entered')
        }
      } 

    const placeOrder = () => {    
      
        let skuStr = bulkOrder.map((val, index) => {
            return val.sku;
        }).filter(Boolean).join(',');
        let qtyStr = bulkOrder.map((val, index) => {
            return val.qty;
        }).filter(Boolean).join(',');
        let bulkData = {   
            "data": {
                "sku": skuStr,
                "qty": qtyStr,
                "quote_id": quoteId,  
                "token": jwt
            }
        }

        
        if(bulkData.data.sku === "" || bulkData.data.qty === "")
        {
            toast.success('Required field missing')
        }else{
            try {
                axios({
                    method: 'post',
                    url: `${process.env.GATSBY_CART_URL_STARCARE}bulkorder/`,
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    },
                    data: bulkData
                }).then(async (res) => {
                    if (res.statusText === "OK" && res.status == 200) {
                        viewCartItems()
                        toast.success('Items added sucessfully')
                        setTimeout(() =>{
                            setCartCnt(getCartCount())
                        },3000)
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
        <Layout cartCount={cartCnt}>
            <main className="bulkOrder_page">
                <div className="App">
                    <div className="content_wrapper">
                        <div className="container">
                            <div className="main_title">
                                <h1>Bulk <span>Order</span></h1>
                                <p>To save time and order faster, enter your preselected Grainger item numbers and quantities using one or both of the entry methods below.</p>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-xs-12">
                                    <div className="bulk_order_form">
                                        <div className="bulk_box_bg mr-16 mx-auto">
                                            <h3>Line By Line</h3>
                                            <p>Enter individual item numbers and quantities.</p>
                                            {
                                                bulkOrder.map((val, index) => (
                                                    <div key={index} className="item_entry">
                                                        <div className="form-group">
                                                            <input placeholder="SKU" name="sku" value={val.sku || ''} onChange={e => { handleChange(e, index) }} />
                                                        </div>
                                                        <div className="form-group">
                                                            <input placeholder="qty" name="qty" value={val.qty || ''} onChange={e => { handleChange(e, index) }} />
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            <button className="btn add_btn btn_gray" onClick={() => addMoreItems()}>Add New Field</button>
                                        </div>
                                    </div>  
                                    <div className="bottom_sec">
                                    <button onClick={() => placeOrder()} className="btn add_btn text-right btn_gray" disabled={placeBtn}>Place order</button>
                                    </div>
                                </div>

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
               
        </Layout >
    )
}

export default BulkOrder;