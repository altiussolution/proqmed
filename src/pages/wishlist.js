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
import { TablePagination } from '@mui/material';

const Wishlist = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [wishList, setWishList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [quote_id, setQuoteId] = useState("");
    const [qty, setQty] = useState(1);
    const [isButton, setButton] = useState(false);
    const [cartCnt, setCartCnt] = useState(getCartCount())
    const [wishListCnt, setWishListCnt] = useState(getWLCount());
    const [permit,permission] = useState([]);
    const [p,per] = useState(false);
    const [nop,noper] = useState(false);
    const [jwt, setJwt] = useState("");
    const [permits,setPermit] = useState();

    useEffect(() => {
        getWishList()
      //setQuoteId(localStorage.cartId)
        setJwt(localStorage.userToken)
       if(!localStorage.permissions){
        noper(true) 
       } else {
        let hi = JSON.parse(localStorage.permissions)
        let addwis=hi.includes("Can View Wishlist")
        per(addwis)
       }
        const jwt = localStorage.getItem('userToken')
        if(jwt){
          try
          {    
            axios({
              method : 'post',
              url: `${process.env.GATSBY_CART_URL_STARCARE}carts/mine`,
              headers : {
                  'Authorization' : `Bearer ${jwt}`
              }
            })
            .then((response) => {
              if(response.statusText === "OK" && response.status == 200)
              {
                
                console.log(response.data)
                  localStorage.setItem('cartId',response.data);
                  setQuoteId(localStorage.cartId)
                
              }
            }) 
            .catch((error) => {
              console.error(error,'error')
            })
          }catch(err){
            console.error(err);
            toast.error('something went wrong')
          }
        }else{
            
        }
      
    }, [])

    const wistlistsValue = () => {
        setWishListCnt(getWLCount());
    }

    const getWishList = () => {
        setLoader(true);
        console.log(permits)
      
        try {
            axios({
                method: "get",
                url: `${process.env.GATSBY_CART_URL_STARCARE}admin/getwishlist/${localStorage.customer_id}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.userToken}`
                },
            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {
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
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
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
                            // removeProduct(id, 'cart')
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
    
    if(p==true || nop==true){
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
                                            <h3>My Wishlist<span> ({wishList.length})</span></h3>
                                        </div>
    
    
                                        <div className="row no_data_found">
    
                                            {wishList.length == 0 ? <div className="col-lg-12 col-md-12 col-xs-12 text-center">
                                                <img src={empty_cart} alt={"Empty Cart"} />
                                                <h4>No items in Wishlist</h4>
                                            </div> :
                                                <div className="col-lg-12 col-md-12 col-xs-12">
                                                    {
                                                        wishList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                                            <div key={item.sku} className="product_item">
                                                                <div className="product_img">
                                                                {item.offer_percentage != 0 && <div className="price_off">{parseFloat(item.offer_percentage)}% off</div>}
    
                                                                    <img src={item.image} />
                                                                </div>
                                                                <div className="product_desc">
                                                                    <h3>{item.name}</h3>
                                                                    <div className="rating_front">
                                        <StarRatings
                                            rating={Math.round(item.review_count)}
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension="20px"
                                            starSpacing="0px"
                                            starRatedColor="rgb(255 123 168)"
                                            svgIconViewBox="0 0 32 32"
                                            svgIconPath="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"
                                        />
                                        
                                        </div>
                                                                    <div className="to-flx">
                                                                    <span>{item.created_at}</span>
                                                                    <p>SKU: <span>{item.sku}</span></p>
                                                                    <span>Reviews({item.review_count})</span>
                                                                    </div>
                                                                    <div className="qty_price">
                                                                        <h6>${parseFloat(item.price).toFixed(2)}</h6>
                                                                    </div>
    
                                                                    
                                                                </div>
                                   
                                                                <div className="user_actions">
                                                                        <p>Item added {item.created_at}</p>
                                                                    {/* <button className="btn_gray btn" onClick={() => navigate('/checkout')} >Buy Now</button> */}
                                                                    <button className="btn_gray btn" onClick={() => addtoCartItem(item.sku, item.id)}>Add to cart</button>
                                                                    <button className="btn btn_outline" type="button" onClick={() => removeWishList(item.id, 'remove')}>Delete</button>
                                                                </div>
                                                                
                                                            </div>
                                                        ))
                                                    }
                                                    
                                                    
    
                                                    
                                                </div>
    
                                                
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>)
                    }

<div className="container">
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
      count={wishList.length}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />  
    </div>
                </Layout>
            </>
        )
    
            }else {
                return (
                    <Layout>
                 <div className="container padd">
                     <span className="fo-AD">Access Denied</span>
                 </div>  </Layout> 
                )
            }
}


export default Wishlist 