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
const banner_slide = {
  autoplay: false,
  speed: 1000,
  slidesToShow:1,
  slidesToScroll: 1,
  infinite: true,
  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
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

    useEffect(() => {
      setCustomerId(localStorage.customer_id)
      setJwt(localStorage.userToken)
      setQuoteId(localStorage.cartId)
      const fetchData = async () => {
        setLoading(true);   
        try {  
          const res = await axios.get(
            `${process.env.GATSBY_NODE_URL_STARCARE}data/singleproduct/${id}.json`
          );
          const data = convertToObject(res.data);
          setProduct(data);
          await axios.get(
            `${process.env.GATSBY_CART_URL_STARCARE}admin/productattachments/${id}`).then((data)=>{
              let response_data = data.data
              setattachment(response_data)
          }) 
          setLoading(false);
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
          setNotFound(true);
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
        return <Slider {...banner_slide}> 
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
                          
                         <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span class="cart_svg"></span></button>
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
        </div>        
      </div>
    </div>
    </section> 
  
} 
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
        <div className="col-lg-12 col" >               
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
</Layout>
  
)
}

export default Product
