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
import { AiOutlineCloudUpload } from "react-icons/ai";
const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const [loader, setLoader] = useState(false);
    const [checkOut, setCheckout] = useState([]);
    const [updCart, setupdCart] = useState("");
    const [jwt, setjwt] = useState();
    const [status, setstatus] = useState([]);
    const [productid, setproductid] = useState([]);
    const [customerId, setCustomerId] = useState("");



    useEffect(() => {
        setCustomerId(localStorage.customer_id)
        setjwt(localStorage.userToken)
        // if (checkLogin()) {
            fetchCheckTotal();
            listCarts();
            //   if(localStorage.getItem('cartData')){
            //     let parseCart = JSON.parse(localStorage.getItem('cartData'));
            //     if (parseCart) {
            //         setCartItems(JSON.parse(localStorage.getItem('cartData')));
            //         console.log(JSON.parse(localStorage.getItem('cartData')))
            //         if(localStorage.getItem('userToken')){
            //             fetchCheckTotal();
            //         }
                   
            //     }
            //   }
    

    }, []);
    const listCarts = () => {
            let resi=[]
            let stocks=[]
            const jwt = localStorage.getItem('userToken');
            const email = localStorage.email;
            try {
              axios({  
                  method : 'get',
                  url : `${process.env.GATSBY_CART_URL_STARCARE}mycartitems/${email}`,
                  headers : {
                         'Authorization' : `Bearer ${jwt}`
                       }  
                }).then(async (res) => {
                  
                      console.log(res.data)
                      for(let i=0;i<res.data.length;i++){
                        const resp = await fetch(
                          `${process.env.GATSBY_CART_URL_STARCARE}cart/productstatus/product_id/${res.data[i].product_id}`
                      );
                      resi.push(await resp.json());
                      }
                      for(let i=0;i<resi.length;i++){
                        await stocks.push(resi[i][0]['stock_status'])
                      }
                     await res.data.forEach(object => {
                        object.status = stocks;
                      });
                      console.log(res.data)
                      const data = JSON.stringify(res.data)
                      localStorage.setItem('cartData' , JSON.stringify(res.data))
                      setCartItems(JSON.parse(data))
                  
          
                  
                  
                }).catch((err) =>{
                  alert('error occured')
                  console.error(err)
                })
              
            } catch (err) {
                console.error(err)
            }
          
      }

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
                    //toast.success('Update Cart Successfully')
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

    const handleChange = (event,data,ivalue) => {
        if (event.target.value <= 0) {
            event.target.value = 1;
            data.qty = event.target.value;
           
        } else {
            setupdCart(event.target.value)
            data.qty = event.target.value;
            
        }

    }

    const addToList = (type,id) => {
        // type 1 = wishlist
        // type 2 = comparelist
        let url = (type == 1 ? `${process.env.GATSBY_CART_URL_STARCARE}admin/addtocompare/2` : `${process.env.GATSBY_CART_URL_STARCARE}wishlist/addwishlist_product/`)
        let message = (type == 1 ? 'Sucessfully added to  compare list' : 'Sucessfully added to wish list')
        let errormessage = (type == 1 ? 'SignIn to add compare list' : 'SignIn to add wish list')

        let productData = {
          "data": {
            "customer_id": customerId,
            "product_id": id
          }
        }
    
        try {
          axios({
            method: 'post',
            url: url,
            data: productData,
            headers: {
              'Authorization': `Bearer ${jwt}`
            }
          }).then((res) => {
            if (res.statusText === "OK" && res.status == 200) {
              toast.success(message)
              setTimeout(()=>{
               // wishListCount()
              },2000)
            }
          }).catch((err) => {
            toast.error(errormessage)
          })
        } catch (err) {
          toast.error(err)
        }
    
      }
    const updateCarts = (item) => {
        let updateItem;
       for(let i=0;i<cartItems.length;i++){
        updateItem = {
            "cartItem": {
                "item_id": cartItems[i].item_id,
                "qty": cartItems[i].qty,
                "quote_id": cartItems[i].quote_id
            }
        }
   


    try {
        axios({
            method: "put",
            url: `${process.env.GATSBY_CART_URL_STARCARE}carts/mine/items/${cartItems[i].item_id}`,
            headers: {
                'Authorization': `Bearer ${jwt}`
            },
            data: updateItem
        }).then((response) => {
            if (response.statusText === "OK" && response.status == 200) {
                fetchCheckTotal()
                // viewCartItems1()
                
                // toast.success("Updated sucessfully")
            }
        }).catch((err) => {
            console.error(err)
            // toast.error('Failed to update')
        })
    }
    catch (err) {
        console.error(err)
    }
       }
           
    }
    


    const showCartItems = () => {

        return (
            <div>
              <table class="table table-striped">
              <thead>
                <tr>
                <th>Product</th> 
                 <th>Name</th>                       
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Sub-Total</th>
                  <th></th>
                </tr>
                </thead>
                {cartItems.map((cart, index)  => {
                  return (
                    <tbody>
                    <tr key={cart.product_id}>
                      <td><img src={cart.image} /></td>
                      <td><p>{cart.product_name}</p></td>
                      <td>${parseFloat(cart.price).toFixed(2)}</td>
                      <td><input type="number" name="qty" defaultValue={cart.qty} onChange={e => { handleChange(e, cart,index) }}/></td>
                        <td><p class="green">{cart.status[index]}</p></td>
                        <td><p>$ {cart.qty*cart.price}</p></td>
                       
                            <td> <div className="casualities">
                                <a onClick={() => { resetCart(cart.item_id) }}> <AiTwotoneDelete /></a>
                                {/* <button className="btn btn heart" type="button" onClick={() => { updateCarts(cart) }}><AiOutlineCloudUpload /></button> */}
                                <button className="btn btn heart" type="button" onClick={() => addToList(2,cart.product_id)}><AiTwotoneHeart /></button>
                            </div></td>
                    </tr>
                    </tbody>
                  )
                })}
              </table>
            </div>
          );
       

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
                                <a onClick={() => navigate('/')}> Continue Shopping  </a>
                                <button className="btn btn update" type="button" onClick={() => updateCarts()}> Update Cart  </button>
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