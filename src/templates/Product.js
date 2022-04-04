import React , { useState, useEffect } from "react";
import axios from "axios";
import Technicalspec from "../components/technicalspec";
import Productdescription from "./productdescription"   
import { convertToObject } from "../utils/convertToObj";
import ImageNotFound from "./../assets/car-dealer-loader.gif";
import Layout from "../components/layout";
import { getCartCount ,getWLCount,viewCartItems,wishListCount} from "./../utils/apiServices";
import { IoChevronForwardOutline } from "react-icons/io5";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "gatsby";
import { getProductURL , getCategoryURL } from "./../utils/url";
import PageLoader from "../components/loaders/pageLoader";
import { navigate } from "gatsby";
import StarRatings from 'react-star-ratings';
import { ToastContainer, toast } from 'react-toastify';
import { FaRegHeart } from 'react-icons/fa';

const similar_product = {
  autoplay: false,
  speed: 1000,
  slidesToShow:5,
  slidesToScroll: 1,
  infinite: false,
  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
          slidesToShow: 1,
          slidesToScroll: 2
      }
    }

  ]
}

const Product = (props,location)  => {  
  const [customerId, setCustomerId] = useState("");
  const [isButton, setButton] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [product, setProduct] = useState(null);
  const [productdata, setProductdata] = useState([]);
  const [cartCount, setcartCount] = useState(null);
  const [attach_data, setattachment] = useState(null);
  const [sellerprod, setothersellers] = useState([]);
  const [jwt, setJwt] = useState("");
  const id = props.slug.split("-").slice(-1)[0]; 
  const [crumname,crump] = useState("");
  const [permits,setPermit] = useState([]);
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
      // console.log(location,"Gokul")
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
      }
      //setQuoteId(localStorage.cartId)
      if(!localStorage.permissions){
        outper(true)
        outpercart(true)
       } else {
        let hi = JSON.parse(localStorage.permissions)
        let addwis=hi.includes("Can Add To Wishlist")
        let addcar=hi.includes("Can Add To Cart")
        per(addwis)
        percart(addcar)
       }
      const fetchData = async () => {
        setLoading(true);   
        try {  
          const res = await axios.get(
            `${process.env.GATSBY_CART_URL_STARCARE}admin/productsattributes/${id}/${localStorage.customer_id}`
            //`${process.env.GATSBY_NODE_URL_STARCARE}data/singleproduct/${id}.json`
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
            `${process.env.GATSBY_CART_URL_STARCARE}compare/sellerproducts/current_product_id/${id}/${localStorage.customer_id}`).then((data)=>{
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
const hierarchy = JSON.parse(sessionStorage.getItem('Hierarchy'));
  const relatedproducts = async () =>{
    await axios({
      method : "get",
      url: `${process.env.GATSBY_API_BASE_URL_STARCARE}relatedprodut/${id}/${localStorage.customer_id}`//`${process.env.GATSBY_NODE_URL_STARCARE}data/categories/relatedproducts/${id}.json`
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

                })
                .catch((err) => {
                  if (err.message === "Request failed with status code 400") {
                    toast.error("Product that you are trying to add is not available")

                  }else{
                    toast.error('Failed to add cart')

                  }

                    console.error(err);
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
  if (localStorage.userToken) {

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
          wishListCount()
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
  const Renderproduct = () => {    
    if (productdata) { 
      console.log("productdata")
      console.log(productdata)
        return <Slider {...similar_product}> 
        {      
              productdata.map((data,index) => (  
                  <div key={`${index}_key`} className="item similar-item">
                    <div className="card">    
                    {p && <div className="wishComp">
                                    <ul>
                                      <li><a onClick={() => addToList(2,data.id)}><FaRegHeart /></a></li>
                                    </ul>
                                </div>}
                                {outp && <div className="wishComp">
                                    <ul>
                                      <li><a onClick={() => addToList(2,data.id)}><FaRegHeart /></a></li>
                                    </ul>
                                </div>}
                              
                       <div className="image_wrapper">
                       {data.offer_percentage != 0 && <div className="price_off">{Math.round(data.offer_percentage)}% off</div>}
                           <Link to={getProductURL(data)}><img src={data.image} /></Link>
                       </div>
                       <div className="description_list">                               
                       <Link to={getProductURL(data)}>{data.name}</Link>
                       </div> 
                       <div className="price_holder">
                       <div className="price_left">                                  
                           <div className="product_amt">
                           {data.strike_price != null  &&  <span className="new_price">${Math.round(data.strike_price)}</span>}
                           {/* { data.strike_price == null &&  <span className="price">${Math.round(data.original_price)}</span>} */}
                           <span className="price">${Math.round(data.final_price)}</span>
                               
                           </div>
                           <div className="rating_front">
                           <StarRatings
                               rating={Math.round(data.rating)}
                               numberOfStars={5}
                               name='rating'
                               starDimension="20px"
                               starSpacing="0px"
                               starRatedColor="rgb(255 123 168)"
                           />
                           
                           </div>
                       </div>
                          <div className="price_right"> 
                          
                         {pcar && <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span className="cart_svg"></span></button>}
                         {outpcar && <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span className="cart_svg"></span></button>}

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
 const breadCrumps = () => {
  //  if(props.location.state['crumpy']){
  //    return (
  //      <div>
  //   {props.location.state['crumpy'].hierarchy.map(parent => (
  //     <React.Fragment key={parent.id}>
  //       <Link
  //         className="text-gray-600 hover:text-gray-800"
  //         to={getCategoryURL(parent)}
  //       >
  //         <span dangerouslySetInnerHTML={{ __html: parent.name }} />
  //       </Link>
  //       &nbsp;&nbsp; <IoChevronForwardOutline /> &nbsp;&nbsp;
  //     </React.Fragment>
  //   ))}<React.Fragment>
  //   <Link
  //     className="text-gray-600 hover:text-gray-800"
  //     to={getCategoryURL(props.location.state['crumpy'])}
  //   >
  //     <span dangerouslySetInnerHTML={{ __html: props.location.state['crumpy'].name }} />
  //   </Link>
  //   &nbsp;&nbsp; <IoChevronForwardOutline /> &nbsp;&nbsp;
  // </React.Fragment>
  //   <span dangerouslySetInnerHTML={{ __html: props.location.state['values'].items.name}} />
  //   </div>
  //    )
  //  } 
  return (
    <div>
       {hierarchy ? <>
       <h3>{hierarchy[Object.keys(hierarchy).length -1].name}</h3>
       {hierarchy.map(parent => (
         <React.Fragment key={parent.id}>
           <Link to={getCategoryURL(parent)} className="text-gray-600 hover:text-gray-800">
           <span>{parent.name}</span></Link>
           &nbsp;&nbsp; <IoChevronForwardOutline /> &nbsp;&nbsp;
         </React.Fragment>
       ))}
       {product && product.items && product.items.name && <span>{product.items.name}</span>}
       </> : <h3></h3>}
      </div>
  )
 };

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
       <div className="breadcrumbs_sec" >
       <div className="mt-1 mb-2">
       {breadCrumps()}
    </div>
                  </div>
        <div className="product_view">  
          <div className="row upper-space">
             <Productdescription proDescription = {product} setcartCount={cartValue.bind(this)} setWishListCnt={wistlistsValue.bind(this)}/>
             <div className="technical_sec">
             </div>
           <div className="suma">
             </div>
           </div>
           <div className="full-desc-tabs">
           <Technicalspec specification = {product} attachment={attach_data}/>
           </div>
{sellerprod.length != 0 ?
           <div className="More-Sellers">
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
      <th>Product Sku</th>
      <th>Price </th>
      <th></th>
    </tr>
  </thead>
  {
  sellerprod.map((quote, index) => (
  <tbody>
    <tr>
      <td> 
        <div className="image-sec">
        <img src={quote.product_image}></img></div> </td>
      <td>{quote.seller}</td>
      <td>{quote.product_name}</td>
      <td>{quote.product_sku}</td>
      <td> {quote.strike_price != null  && <span className="new_price">${Math.round(quote.strike_price)} </span>} ${Math.round(quote.final_price).toFixed(2)}</td>
      <td>{pcar && <button className="action action_btn btn btn_gray" onClick={() => addtoCartItems(quote.product_sku, quote.id)}> <span className="fa fa-shopping-cart"></span> Add to Cart  </button>}
      {outpcar && <button className="action action_btn btn btn_gray" onClick={() => addtoCartItems(quote.product_sku, quote.id)}> <span className="fa fa-shopping-cart"></span> Add to Cart  </button>}
      </td>
    </tr>
    
    
  </tbody>
       ))
      }
</table>
</div>
           </div>:<div></div>}

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
