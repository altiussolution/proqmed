import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import PageLoader from '../components/loaders/pageLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { wishListCount, addToCart, viewCartItems, getCartCount, getWLCount } from '../utils/apiServices';
import empty_cart from './../assets/empty.png';
import { navigate } from "gatsby";
import { checkLogin } from "./../services/headerServices";
import StarRatings from 'react-star-ratings';

const Wishlist = () => {

    const [wishList, setWishList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [quote_id, setQuoteId] = useState("");
    const [qty, setQty] = useState(1);
    const [isButton, setButton] = useState(false);
    const [cartCnt, setCartCnt] = useState(getCartCount())
    const [wishListCnt, setWishListCnt] = useState(getWLCount());
    const [permit,permission] = useState([]);
    const [p,per] = useState(false);
    useEffect(() => {
        if(localStorage.permissions){
            permission(localStorage.permissions);
            
           
        }
        getWishList()
        setQuoteId(localStorage.cartId)

    }, [])

    const wistlistsValue = () => {
        setWishListCnt(getWLCount());
    }

    const getWishList = () => {
        setLoader(true);
        if (!checkLogin()) {
            navigate('/signin')
          } else {
        try {
            axios({
                method: "get",
                url: `${process.env.GATSBY_CART_URL_STARCARE}admin/getwishlist/${localStorage.customer_id}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.userToken}`
                },
            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {
                    if(localStorage.permissions){
                        let viewwis=localStorage.permissions.includes("Can View Wishlist")
                        per(viewwis)
                    }
                   
                    setWishList(res.data)
                    console.log(res.data)
                    wishListCount();
                    wistlistsValue();
                    setLoader(false);
                }

            }).catch((err) => {
                setLoader(false);
                console.error(err)
            })
        } catch (err) {
            setLoader(false);
            console.error(err)
        }
    }
    }

    const removeWishList = (pro_id, data) => {
        if (window.confirm("Delete the item?")) {
            removeProduct(pro_id, data)
        }
    }

    const removeProduct = (pro_id, data) => {
        try {
            axios({
                method: "post",
                url: `${process.env.GATSBY_CART_URL_STARCARE}admin/removewishlists/${localStorage.customer_id}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.userToken}`
                },
                data: {
                    "data": {
                        "customer_id": localStorage.customer_id,
                        "product_id": pro_id
                    }
                }
            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {
                    // toast.success(res.data);
                    if (data === "remove") {
                        toast.success("Wishlist Removed");
                        getWishList()
                    }
                }
            }).catch((err) => {
                console.error(err)
            })
        } catch (err) {
            console.error(err)
        }
    }

    const addtoCartItem = (sku, id) => {
        if (localStorage.userToken) {
            const cartItem = {
                "cartItem": {
                    "sku": sku,
                    "qty": qty,
                    "quote_id": quote_id
                }
            }
            setButton(true);
            const jwt = localStorage.userToken
            if (cartItem) {
                try {
                    axios({
                        method: 'post',
                        url: `${process.env.GATSBY_API_BASE_URL_STARCARE}carts/mine/items`,
                        data: cartItem,
                        headers: {
                            'Authorization': `Bearer ${jwt}`
                        }
                    }).then((res) => {
                        if (res.statusText === "OK" && res.status == 200) {
                            viewCartItems();
                            removeProduct(id, 'cart')
                            toast.success('Succesfully added to cart');
                            setTimeout(() => {
                                setCartCnt(getCartCount())
                            }, 3000);
                            setButton(false);
                        }
                    }).catch((err) => {
                        console.error(err);
                        toast.error('Failed to add cart')
                    })
                } catch (err) {
                    console.error(err)
                }
            }
        }
        else {
            localStorage.clear()
            navigate("/signin")
        }
    }
    if(p==true){
    return (
        <>
            <Layout>
                {loader ?
                    (<div className="mx-auto">
                        <PageLoader />
                    </div>) :
                    
                    (<main className="whishlist_page">
                        <div className="App">
                            <div className="content_wrapper">
                                <div className="container">
                                    <div className="main_title">
                                        {/* <h1>My Wishlist <span>(5)</span></h1> */}
                                        <h1>My Wishlist<span> ({wishList.length})</span></h1>
                                    </div>


                                    <div className="row no_data_found">

                                        {wishList.length == 0 ? <div className="col-lg-12 col-md-12 col-xs-12 text-center">
                                            <img src={empty_cart} alt={"Empty Cart"} />
                                            <h4>No items in Wishlist</h4>
                                        </div> :
                                            <div className="col-lg-12 col-md-12 col-xs-12">                                        
 
    <div className="fo-bg-white">
                                                {
                                                    wishList.map((item, index) => (
                                                        <div key={item.sku} className="product_item">
                                                            <div className="product_img">
                                                                <img src={item.image} />
                                                            </div>
                                                            <div className="product_desc">
                                                                <h3>{item.name}</h3>
                                                                <div className="to-flx">
                                                                <span>{item.created_at}</span>
                                                                <p>SKU: <span>{item.sku}</span></p>
                                                                <span>{item.review_count}</span>
                                                                </div>
                                                                <div className="qty_price">
                                                                    <h6>${parseFloat(item.price).toFixed(2)}</h6>
                                                                </div>

                                                                
                                                            </div>
                                                            <div className="user_actions">
                                                                    <p>Item added 26 November</p>
                                                                {/* <button className="btn_gray btn" onClick={() => navigate('/checkout')} >Buy Now</button> */}
                                                                <button className="btn_gray btn" onClick={() => addtoCartItem(item.sku, item.id)}>Add to cart</button>
                                                                <button className="btn btn_outline" type="button" onClick={() => removeWishList(item.id, 'remove')}>Delete</button>
                                                            </div>
                                                            
                                                        </div>
                                                    ))
                                                }
                                                </div>
                                                

                                                
                                            </div>

                                            
                                        }
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
            }else {
                return (
                 <div>
                     <span>Access Denied</span>
                 </div>   
                )
            }
}


export default Wishlist 