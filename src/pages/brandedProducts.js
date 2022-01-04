import React, { useState, useEffect } from "react"
import axios from "axios";
import { getProductURL } from "../utils/url";
import { Link } from "gatsby";
import Layout from '../components/layout';
import { FaRegHeart } from 'react-icons/fa';
import PageLoader from "../components/loaders/pageLoader";
import { getCartCount ,getWLCount,viewCartItems} from "./../utils/apiServices";
import { navigate } from "gatsby";
import { ToastContainer, toast } from 'react-toastify';
import { wishListCount } from '../utils/apiServices'

const BrandedProducts = ({ location }) =>{
    const [productBrand, setProductBrand] = useState([]);
    const [loader, setLoader] = useState(false);
    const [brandImage, setBrandImage] = useState('');
    const [jwt, setJwt] = useState("");
    const [quote_id, setQuoteId] = useState("");
    const [qty, setQty] = useState(1);
    const [isButton, setButton] = useState(false);
    const [pcar,percart] = useState(false);
    const [outp,outper] = useState(false);
    const [outpcar,outpercart] = useState(false); 
    const [cartCount, setcartCount] = useState(null);
    const [customerId, setCustomerId] = useState("");

    useEffect(() => {
        product()
        setCustomerId(localStorage.customer_id)
        setJwt(localStorage.userToken)
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

                //viewCartItems()
              //  localStorage.removeItem('cartData', []);
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
          navigate("/signin")
      }
    },[]);


const product = ()=>{
    setLoader(true);      
    axios({
        method : "get",
        url: `${process.env.GATSBY_NODE_URL_STARCARE}data/brandedproducts/${location.state.brand_id}.json`
        }).then(async (res) => {
            //    await axios.get(
            //    `${process.env.GATSBY_NODE_URL}data/brandedproducts/${location.state.brand_id}.json`
            //  ).then((res)=>{
                 const item = res.data
                 console.log("item", item)
                 setBrandImage(item[0])
                 let brand_prod = item.slice(1, item.length)
                 if(res.data !== "No products in this brand"){
                 setProductBrand(brand_prod);
                 setLoader(false);
             }
            // }
            // )
             
               })
}
const cartValue = () => {
    setTimeout(() => {
      setcartCount(getCartCount());
    }, 3000);
  }
const addtoCartItems = (sku, id) => {
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
                          cartValue();
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
const addToList = (type,id) => {
    // type 1 = wishlist
    // type 2 = comparelist
    let url = (type == 1 ? `${process.env.GATSBY_CART_URL_STARCARE}admin/addtocompare/2` : `${process.env.GATSBY_CART_URL_STARCARE}wishlist/addwishlist_product/`)
    let message = (type == 1 ? 'Sucessfully added to  compare list' : 'Sucessfully added to wish list')
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
          wishListCount()
          setTimeout(()=>{
            getWLCount()
          },2000)
        }
      }).catch((err) => {
        toast.error(err)
      })
    } catch (err) {
      toast.error(err)
    }

  }
const Renderproduct = () => {    
    if (productBrand) {
        return <>

                {    productBrand ? 
                    (productBrand.map((data, index) => (
                        <div className="brandedpro_item" key={index}>
                            <div className="products">
                            <div className="wishComp">
                                    <ul>
                                   <li><a onClick={() => addToList(2,data.id)}><FaRegHeart /></a></li>
                                    </ul>
                                </div>
                                {/* <img className="product_img" src={data.brand_image} /> */}
                                <Link to={getProductURL(data)} ><img className="product_img" src={data.image} alt="" /></Link>
                                {/* <img className="product_img" src={data.image} alt="" /> */}
                                <h4 className="product_name">{brandImage.brand_name}</h4>
                                <h4 className="product_name"><Link to={getProductURL(data)} >{data.name.slice(0, 81)}...</Link><br />
                                </h4>
                                <p className="product_number"><span>Model:{data.sku}</span></p>
                                <div className="product_btm">
                                    <h3 className="product_price">${Math.floor(data.price)}<sup className="price_decimal"></sup></h3>                             
                                </div>
                                <div className="price_right">                                   
                                 <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span class="cart_svg"></span></button>
                                {/*outpcar && <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span class="cart_svg"></span></button>*/}                                  </div>
                            </div>
                        </div>
                    ))) : <div></div>
                }
            </>
        }
    }

    return (

        <Layout>
            <section className="page_content inner_page">
                <div className="content_wrapper">
                    <div className="container">
                        <div className="row main_title">
                            <h1>Our <span>Brands</span></h1>
                        </div>
                        <div className="row product_list">
                            {Renderproduct()}
                        </div>
                    </div>
                </div>
            </section>

            {loader ? (<div>
                <PageLoader />
            </div>) : <span></span>}
        </Layout>

    )
}

export default BrandedProducts;
