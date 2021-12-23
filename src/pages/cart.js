import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import { checkLogin } from "./../services/headerServices";
import { navigate } from "gatsby";
import { deleteCart, viewCartItems } from "./../utils/apiServices";
import PageLoader from "../components/loaders/pageLoader";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiTwotoneDelete } from "react-icons/ai";
import { AiTwotoneHeart } from "react-icons/ai";


const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const [loader, setLoader] = useState(false);
    const [checkOut, setCheckout] = useState([]);
    const [updCart, setupdCart] = useState("");
    const [jwt, setjwt] = useState();

    useEffect(() => {
        setjwt(localStorage.userToken)
        // if (checkLogin()) {
            if (!checkLogin()) {
                navigate('/signin')
              } else {
                  if(localStorage.getItem('cartData')){
                    let parseCart = JSON.parse(localStorage.getItem('cartData'));
                    if (parseCart) {
                        setCartItems(JSON.parse(localStorage.getItem('cartData')));
                        if(localStorage.getItem('userToken')){
                            fetchCheckTotal();
                        }
                       
                    }
                  }
        }
    }, [])

    const fetchCheckTotal = async () => {
        const jwt = localStorage.getItem('userToken')
        try {
            axios({
                method: 'get',
                url: `${process.env.GATSBY_API_BASE_URL_STARCARE}carts/mine/totals`,
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {
                    setCheckout(res.data.total_segments)
                }
            }).catch((err) => {
                console.error(err);
            })

            setLoader(false);
        } catch (err) {
            if (err) {
                setLoader(false);
            }
        }
    };

    const resetCart = (item_id) => {
        if (window.confirm("Delete the item?")) {
            deleteCart(item_id);
            setLoader(true);
            setCartItems(cartItems.filter(item => item.item_id !== item_id)) // splice may not work so using filter
            setTimeout(() => {
                setLoader(false);
                fetchCheckTotal();
                toast.success('Item deleted successfully')
            }, 3000)
        }
    }

    const handleChange = (event) => {
        if (event.target.value <= 0) {
            event.target.value = 1;
            setupdCart(event.target.value);
        } else {
            setupdCart(event.target.value)
        }

    }

    const updateCart = (item) => {
        let updateItem;
        if (updCart === '') {
            updateItem = {
                "cartItem": {
                    "item_id": item.item_id,
                    "qty": item.qty,
                    "quote_id": item.quote_id
                }
            }
        } else {
            updateItem = {
                "cartItem": {
                    "item_id": item.item_id,
                    "qty": parseInt(updCart),
                    "quote_id": item.quote_id
                }
            }
        }


        try {
            axios({
                method: "put",
                url: `${process.env.GATSBY_CART_URL_STARCARE}carts/mine/items/${item.item_id}`,
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
                data: updateItem
            }).then((response) => {
                if (response.statusText === "OK" && response.status == 200) {
                    fetchCheckTotal()
                    viewCartItems()
                    toast.success("Updated sucessfully")
                }
            }).catch((err) => {
                console.error(err)
                toast.error('Failed to update')
            })
        }
        catch (err) {
            console.error(err)
        }
    }


    const showCartItems = () => {
        return <div>
            {
                cartItems.map((cart, index) => (
                    <div className="product_item cart" key={cart.product_id}>
                        <div className="product_img">
                            <img src={cart.image} />
                        </div>
                        <div className="product_desc">
                            <h3>{cart.product_name}</h3>
                            <ul>
                                <li>
                                    <p>SKU <span>{cart.sku}</span></p>
                                </li>
                                <li>
                                    <p>Manufacturer <span>{cart.product_type} </span></p>
                                </li>
                                <li>
                                    <p>Mf.Part No <span>-</span></p>
                                </li>
                            </ul>
                            <div className="qty_price">
                                <p>Qty:<input type="number" name="qty" defaultValue={cart.qty} onChange={e => { handleChange(e, cart) }} /></p>
                                <h6>${parseFloat(cart.price).toFixed(2)}</h6>
                            </div>

                            

                        </div>

                        <div className="casualities">
                                <a href="#"> <AiTwotoneDelete /></a>
                                <button className="btn btn heart" type="button"><AiTwotoneHeart /></button>
                            </div>
                        {/* <div className="user_actions">
                            <button className="btn btn_gray" type="button" onClick={() => { updateCart(cart) }}>Update</button>
                            <button className="btn btn_remove" type="button" onClick={() => { resetCart(cart.item_id) }}>Remove</button>
                        </div> */}
                    </div>
                    
                    
                ))
            }
        </div>
        

    }

    const checkoutDetails = () => {
        return <div>
            
            <table className="table table-striped summary">
            <tbody>
                {
                    checkOut.map((item, index) => ( 
                        <tr key={index}>
                            <th>{item.title}</th>
                             <td>{item.value}</td>
                        </tr>
                         ))
                }
            </tbody>
            </table>
        </div>

    }


    return (
        <>
            <Layout cartCount={cartItems?.length}>
                {loader ?
                    (<div className="mx-auto">
                        <PageLoader />
                    </div>) :
                    (<main className="mycard_page">
                        <div className="App">
                            <div className="content_wrapper">
                                <div className="container">
                                   
                                    <div className="main_title left">
                                        <h1>My Cart<span> ({cartItems?.length})</span></h1>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-9 col-md-9 col-xs-12 no_data">


                                        {/* <div className="main_title left">
                                        <h1>My Cart <span>(5)</span>  </h1>
                                    </div> */}

                                            {/* {localStorage.getItem('sampleVal')} */}
                                            {cartItems?.length == 0 ? (<h1>No Item found</h1>) : showCartItems()}

                                            
                                        </div>
                                       

                                        
                                        <div className="col-lg-3 col-md-3 col-xs-12">
                                            <div className="side_sec">
                                                {/* <h3>Summary</h3> */}
                                                <h3>Cart Totals</h3>
                                                <h6>Estimate Shipping and Tax</h6>
                                                {checkoutDetails()}
                                                <button className="btn btn_brown" type="button" onClick={() => navigate('/checkout')} disabled={cartItems?.length == 0}>Proceed to Checkout</button>
                                                {/* <button className="btn btn-default" type="button" onClick={() => navigate('/')}>Continue to Shopping</button> */}
                                            </div>
                                        </div>

                                        <div className="col-lg-9 col-md-9 col-xs-12">
                                        <div className="casualities bottom">
                                <a href="#"> Continue Shopping  </a>
                                <button className="btn btn update" type="button"> Update Cart  </button>
                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>)
                }
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
            </Layout>
        </>
    )
}

export default Cart