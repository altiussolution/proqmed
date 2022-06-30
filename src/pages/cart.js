import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import { navigate } from "gatsby";
import { deleteCart } from "./../utils/apiServices";
import ImageNotFound from "./../assets/not-found.png"
import { getProductURL } from './../utils/url';
import { Link } from "gatsby";
import PageLoader from "../components/loaders/pageLoader";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiTwotoneDelete } from "react-icons/ai";
import { AiTwotoneHeart } from "react-icons/ai";
import { string } from "prop-types";
const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const [loader, setLoader] = useState(false);
    const [checkOut, setCheckout] = useState([]);
    const [jwt, setjwt] = useState();
    const [customerId, setCustomerId] = useState("");
    const [tierAmt, setTierProduct] = useState([]);
    const [currency,setCurrency]=useState();

    //const [normal_price, setPrice] = useState("")
   // const [qty, setQty] = useState(1);


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
      setLoader(true)
            let resi=[]
            let stocks=[]
            let cq=[]
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
                          `${process.env.GATSBY_CART_URL_STARCARE}cart/productstatus/product_id/${res.data[i].id}`
                      );  
                        
                      resi.push(await resp.json());
                      }  
                      // for(let i=0;i<cq.length;i++){
                      //   if(resi[i][i]['Tier_quantity'] == cartItems[i].qty){
                      //           cartItems[i].price == 
                      //     }
                      // }            
                      for(let i=0;i<resi.length;i++){
                        await stocks.push(resi[i][0]['stock_status'])
                      }
                     await res.data.forEach(object => {
                        object.status = stocks;
                      });
                      console.log(res.data)
                      console.log(cq)
                      let trumpcard=[];
                     
                       
                      const data = JSON.stringify(res.data)
                      localStorage.setItem('cartData' , JSON.stringify(res.data))
                      setCartItems(JSON.parse(data))
                      setLoader(false)
                }).catch((err) =>{
                  alert('error occured')
                  console.error(err)
                })
              
            } catch (err) {
                console.error(err)
            }
          
      }

    const fetchCheckTotal = async () => {
      const curr = await fetch(
        `${process.env.GATSBY_CART_URL_STARCARE}getcurrentcurrency`
    );
    const jsonp = await curr.json(); 
    await setCurrency(jsonp);
        const jwt = localStorage.getItem('userToken')
        try {
            axios({
                method: 'get',
                url: `${process.env.GATSBY_API_BASE_URL_STARCARE}carts/mine/totals`,
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            }).then((res) => {
                if (res.statusText === "OK" && res.status === 200) {
                  console.log(res.data)
                    setCheckout(res.data.total_segments)
                    //toast.success('Update Cart Successfully')
                }else{
                  navigate("/signin")
                }
            }).catch((err) => {
              navigate("/signin")
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
        if (window.confirm("Would you like delete the product in cart?")) {
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
    const handleChange = async (event,data) => {
        axios({
            method: "get",
            url: `${process.env.GATSBY_CART_URL_STARCARE}admin/tierprice/${data.id}`,
            //${proDescription.items.id}
          }).then((res) => {
            setTierProduct(res.data)
          }).catch((err) => {
            console.error(err);
          });
          
        if (event.target.value <= 0) {
          event.target.value = 1;
          data.qty=event.target.value
          data.price = data.price
         // setQty(event.target.value)
          //setPrice(data.qty)
        } else {
            data.qty=event.target.value
            data.price = data.price
          //setQty(event.target.value)
       
        //   await updatePirce(price)
        }
      }
    //   const updatePirce = (price) => {
    //     if (price != undefined) {
    //       setPrice(price)
    //     } else {
    //       setPrice(qty)
    //     }
    //   }
    // const handleChange = (event,data,ivalue) => {
    //     if (event.target.value <= 0) {
    //         event.target.value = 1;
    //         data.qty = event.target.value;
           
    //     } else {
    //         setupdCart(event.target.value)
    //         data.qty = event.target.value;
            
    //     }

    // }

    const addToList = (type,id) => {
      if (localStorage.userToken) {

        // type 1 = wishlist
        // type 2 = comparelist
        let url = (type === 1 ? `${process.env.GATSBY_CART_URL_STARCARE}admin/addtocompare/2` : `${process.env.GATSBY_CART_URL_STARCARE}wishlist/addwishlist_product/`)
        let message = (type === 1 ? 'Sucessfully added to  compare list' : 'Sucessfully added to wish list')
        let errormessage = (type === 1 ? 'SignIn to add compare list' : 'SignIn to add wish list')

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
            if (res.statusText === "OK" && res.status === 200) {
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
      }  else {
        localStorage.clear()
        navigate("/signin")
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
            if (response.statusText === "OK" && response.status === 200) {
              // setTimeout(()=>{
                fetchCheckTotal()
              // },5000)
                listCarts()
                // viewCartItems1()
                
                // toast.success("Updated sucessfully")
            }
        }).catch((err) => {
            toast.error(err.response.data.message)
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
            <div className="fo-scrol">
              <table className="table table-striped">
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
                    <tbody key={index}>
                    <tr>
                      <td className="product_img"><Link to={getProductURL(cart)}> <img src={cart.image} onError={e => (e.target.src = ImageNotFound)}/></Link></td>
                      <td><Link to={getProductURL(cart)}><p>{cart.name}</p></Link></td>
                      <td>{currency}{parseFloat(cart.price).toFixed(2)}</td>
                      <td><input type="number" name="qty" defaultValue={cart.qty} onChange={e => { handleChange(e, cart,index) }}/></td>
                        <td><p className="green">{cart.status[index]}</p></td>
                        <td><p>{currency} {Math.round(cart.qty*cart.price)}</p></td>
                       
                            <td> <div className="casualities">
                                <a onClick={() => { resetCart(cart.item_id) }}> <AiTwotoneDelete /></a>
                                {/* <button className="btn btn heart" type="button" onClick={() => { updateCarts(cart) }}><AiOutlineCloudUpload /></button> */}
                                <button className="btn btn heart" type="button" onClick={() => addToList(2,cart.id)}><AiTwotoneHeart /></button>
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
        return <div className="fo-scroll-crt">
            
            <table className="table table-striped summary">
            <tbody>
                {
                    checkOut.map((item, index) => ( 
                        <tr key={index}>
                            {item.code != "tax" && <><th>{item.code == "shipping" ? (item.value!=0 ? item.title : '') : (item.code == "vattax") ? "Vat Tax" : item.title}</th>
                            <td>{item.code == "shipping" ? (item.value!=0 && item.value) : item.value}</td></>}
                        </tr>
                         ))
                }
            </tbody>
            </table>
        </div>

    }



const alldel=(id) =>{
  for(let i=0;i<cartItems.length;i++){


    const jwt = localStorage.getItem('userToken')
    try{
      axios({  
          method : 'delete',
          url : `${process.env.GATSBY_CART_URL_STARCARE}carts/mine/items/${cartItems[i].item_id}`,
          headers : {
            'Authorization' : `Bearer ${jwt}`
          }  
        }).then((res) => {
          if(res.statusText === "OK" && res.status === 200){
            setLoader(true);
            setTimeout(() => {
                setLoader(false);
                fetchCheckTotal();
                listCarts()

                toast.success('All item deleted successfully')
            }, 3000)
          }
        }).catch((err) =>{
          alert('error occured')
          console.error(err)
        })   
      
    }catch(err){
        console.error(err) 
    }
    

  }
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
                                   
                                    
                                    <div className="row">
                                        <div className="col-lg-9 col-md-9 col-xs-12">

                                          <div className="fo-bg-white">
                                        <div className="main_title left crt">
                                        <h1>My Cart<span> ({cartItems?.length})</span></h1> 
                                    </div>

                                        {/* <div className="main_title left">
                                        <h1>My Cart <span>(5)</span>  </h1>
                                    </div> <a onClick={() => { alldel() }}> <AiTwotoneDelete /></a>*/}

                                            {/* {localStorage.getItem('sampleVal')} */}
                                            {cartItems.length === 0 ? (<h2 className="fo-center">No Cart Items</h2>) : showCartItems()}

                                            </div>
                                        </div>
                                       

                                        
                                        {cartItems.length === 0 ? (<h1></h1>) :   <div className="col-lg-3 col-md-3 col-xs-12">
                                            <div className="side_sec">
                                                {/* <h3>Summary</h3> */}
                                                <h4>Cart Total</h4>
                                                <h6>Estimate Shipping and Tax</h6>
                                               {checkoutDetails()}
                                                <button className="btn btn_brown" type="button" onClick={() => navigate('/checkout')} disabled={cartItems?.length === 0}>Proceed to Checkout</button>
                                                {/* <button className="btn btn-default" type="button" onClick={() => navigate('/')}>Continue to Shopping</button> */}
                                            </div>
                                        </div>}

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