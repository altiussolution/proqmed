import React , { useState, useEffect } from "react";
import axios from "axios";
import Technicalspec from "../components/technicalspec";
import Productdescription from "./productdescription"   
import { convertToObject } from "../utils/convertToObj";
import ImageNotFound from "./../assets/car-dealer-loader.gif";
import Layout from "../components/layout";
import { getCartCount ,getWLCount,viewCartItems} from "./../utils/apiServices";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "gatsby";
import { getProductURL } from "./../utils/url";
import PageLoader from "../components/loaders/pageLoader";
import { navigate } from "gatsby";
import StarRatings from 'react-star-ratings';
import { ToastContainer, toast } from 'react-toastify';
const similar_product = {
  autoplay: false,
  speed: 1000,
  slidesToShow:2,
  slidesToScroll: 1,
  infinite: true,
  responsive: [
    {
      breakpoint: 600,
    },

  ]
}
const Product = props  => {  
  const [customerId, setCustomerId] = useState("");
  const [isButton, setButton] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [product, setProduct] = useState(null);
  const [productdata, setProductdata] = useState([]);
  const [cartCount, setcartCount] = useState(null);
  const [attach_data, setattachment] = useState(null);
  const [sellerprod, setothersellers] = useState(null);
  const [jwt, setJwt] = useState("");
  const id = props.slug.split("-").slice(-1)[0]; 
  
  const [data, setData] = useState([  
    {
      image:(ImageNotFound),
      text: 'loading',
      width: 800,
      height: 800
    }])
    const [quote_id, setQuoteId] = useState("");
    const [qty, setQty] = useState(1);
    const [wishListCnt, setWishListCnt] = useState(getWLCount());
    const [loading, setLoading] = useState(true);
    const [p,per] = useState(false);
    const [pcar,percart] = useState(false);
    const [outp,outper] = useState(false);
    const [outpcar,outpercart] = useState(false);
    useEffect(() => {
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
      //setQuoteId(localStorage.cartId)
      if(localStorage.permissions){
        let addwis=localStorage.permissions.includes("Can Add To Wishlist")
        let addcar=localStorage.permissions.includes("Can Add To Cart")
        per(addwis)
        percart(addcar)
    }else if(!localStorage.permissions){
      outper(true)
      outpercart(true)
    }
      const fetchData = async () => {
        setLoading(true);   
        try {  
          const res = await axios.get(
            `${process.env.GATSBY_NODE_URL_STARCARE}data/singleproduct/${id}.json`
          );
          const data = convertToObject(res.data);
          console.log(data)
          setProduct(data);
          await axios.get(
            `${process.env.GATSBY_CART_URL_STARCARE}admin/productattachments/${id}`).then((data)=>{
              let response_data = data.data
              setattachment(response_data)
              setLoading(false);
          })
          await axios.get(
            `${process.env.GATSBY_CART_URL_STARCARE}compare/sellerproducts/current_product_id/${id}`).then((data)=>{
              let response_data = data.data
              setothersellers(response_data)
          })  
          
          if(data){
            setData([  
            {
              image:(!data.items ? ImageNotFound : data.items.image),
              text: 'img1',
              width: 800,
              height: 800
            },
            {
              image:(!data.items ? ImageNotFound : data.items.image),
              text: 'img2',
              width: 800,
              height: 800
            }
          ]); 
          }
          relatedproducts();
        } catch (err) {
          console.error(err);
          // setNotFound(true);
        }
      }
      
      fetchData()
      // const res = axios.get(
      //   `${process.env.GATSBY_CART_URL}admin/productattachments/${id}`).then((data)=>{
      //     let response_data = data.data
      //     setattachment(response_data)
      // }) 
      
      
    }, [id]);

  const relatedproducts = async () =>{
    await axios({
      method : "get",
      url: `${process.env.GATSBY_NODE_URL_STARCARE}data/categories/relatedproducts/${id}.json`
      }).then((res) => { 
      const item = res.data
      setProductdata(item);
    }) 
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
  const Renderproduct = () => {    
    if (productdata) { 
      console.log("productdata")
      console.log(productdata)
        return <Slider {...similar_product}> 
        {      
              productdata.map((data,index) => (  
                  <div key={`${index}_key`} className="item similar-item">
                    <div className="card">    
                   {/* <div className="wishComp">
                           <ul>
                             <li><a onClick={() => addToList(2,data.id)}><FaRegHeart /></a></li>
                           </ul>
                       </div> */}
                       <div className="image_wrapper">
                           <Link to={getProductURL(data)}><img src={data.image} /></Link>
                       </div>
                       <div className="description_list">                               
                       <Link to={getProductURL(data)}>{data.name}</Link>
                       </div> 
                       <div className="price_holder">
                       <div className="price_left">                                  
                           <div className="product_amt">
                           <span className="new_price">$000</span>
                               <span className="price">${Math.round(data.price)}</span>
                               
                           </div>
                           <div className="rating_front">
                           <StarRatings
                               rating={Math.round(data.rating)}
                               numberOfStars={5}
                               name='rating'
                               starDimension="20px"
                               starSpacing="0px"
                               starRatedColor="rgb(242 187 22)"
                           />
                           
                           </div>
                       </div>
                          <div className="price_right"> 
                          
                         {pcar && <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span class="cart_svg"></span></button>}
                         {outpcar && <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span class="cart_svg"></span></button>}

                         </div>
                       </div>
                       </div>
                    {/* <div className="similar_thumb">
                    <Link to={getProductURL(data)} >
                      <div className="similar_img"><img src={data.image} /></div>
                      <p>{data.name}</p></Link> 
                   </div> */}
                  </div>    
                                  
                ))
              
              }
       </Slider>
      
    }
}

  const cartValue = () => {
    setTimeout(() => {
      setcartCount(getCartCount());
    }, 3000);
  }

  const wistlistsValue = () => {
    setTimeout(() => {
      setWishListCnt(getWLCount());
    }, 3000);
  }


  if (notFound) {
    return (
      <div className="flex flex-col justify-center">
        <p className="text-2xl mx-auto mt-6">Product Not found</p>
        <span className="mx-auto mt-10">
          Not Found
        </span>
      </div>
    );   
  }  


 
        


return (
  <Layout cartCount={cartCount}>
           {loading ? (
          <div className="mx-auto">
            <PageLoader />
          </div>
        ) :
        <div>
     <section>
    <div className="categorylistpage"> 
       <div className="container">
        <div className="product_view">  
          <div className="row upper-space">
             <Productdescription proDescription = {product} setcartCount={cartValue.bind(this)} setWishListCnt={wistlistsValue.bind(this)}/>
             <div className="technical_sec">
             </div>
           <div className="suma">
             </div>
           </div>
           <div class="full-desc-tabs">
           <Technicalspec specification = {product} attachment={attach_data}/>
           </div>

           {/* <div className="More-Sellers">
           <h2 className="section_title">
                    <span>More sellers selling this product </span>
                    
                    </h2>
<div className="fo-scroll">
                    <table class="table table-borderless">
  <thead>
    <tr>
      <th>Product Image</th>
      <th>Sellers Information</th>
      <th>Product Name</th>
      <th>Price </th>
      <th></th>
    </tr>
  </thead>
  {
  sellerprod.map((quote, index) => (
  <tbody>
    <tr>
      <th> 
        <div className="image-sec">
        <img src={quote.product_image}></img></div> </th>
      <td>{quote.seller}</td>
      <td>{quote.product_name}</td>
      <td>{quote.price}</td>
      <td>{pcar && <button className="action action_btn btn btn_gray" onClick={() => addtoCartItems(1,1)}> <span className="fa fa-shopping-cart"></span> Add to Cart  </button>}
      {outpcar && <button className="action action_btn btn btn_gray" onClick={() => addtoCartItems(1,1)}> <span className="fa fa-shopping-cart"></span> Add to Cart  </button>}
      </td>
    </tr>
    
    
  </tbody>
       ))
      }
</table>
</div>
           </div> */}
         </div>        
      </div>
     </div>
     </section> 
  


{productdata.length == 0? <span></span>:
<section className="feature_section">
<div className="container">

<div className="row">
<div className="col-lg-12 col" >
<h2 className="section_title if_has_nav">
        <span>Similar Products</span>
        </h2>
        </div>
        </div>

        <div className="row">            
        <div className="col" >               
          {Renderproduct()}
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
</section>
}
</div>
}
</Layout>
  
)
}

export default Product
