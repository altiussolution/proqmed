import React , { useState, useEffect } from "react";
import axios from "axios";
import Technicalspec from "../components/technicalspec";
import Productdescription from "./productdescription"   
import { convertToObject } from "../utils/convertToObj";
import ImageNotFound from "./../assets/car-dealer-loader.gif";
import Layout from "../components/layout";
import { getCartCount ,getWLCount} from "./../utils/apiServices";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "gatsby";
import { getProductURL } from "./../utils/url";
import PageLoader from "../components/loaders/pageLoader";

const banner_slide = {
    autoplay: false,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    infinite: true
  }
const Product = props  => {  

  
  const [notFound, setNotFound] = useState(false);
  const [product, setProduct] = useState(null);
  const [productdata, setProductdata] = useState([]);
  const [cartCount, setcartCount] = useState(null);
  const [attach_data, setattachment] = useState(null);
  const id = props.slug.split("-").slice(-1)[0]; 
  const [data, setData] = useState([  
    {
      image:(ImageNotFound),
      text: 'loading',
      width: 800,
      height: 800
    }])
    const [wishListCnt, setWishListCnt] = useState(getWLCount());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

  const Renderproduct = () => {    
    if (productdata) { 
      console.log("productdata")
      console.log(productdata)
        return <Slider {...banner_slide}> 
        {      
              productdata.map((data,index) => (  
                  <div key={`${index}_key`} className="item similar-item">
                    <div className="similar_thumb">
                    <Link to={getProductURL(data)} >
                      <div className="similar_img"><img src={data.image} /></div>
                      <p>{data.name}</p></Link> 
                   </div>
                   {/* <p>{data.name}</p> */}
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
<div className="container similar_sec">
    <h3>Similar Products</h3>
     {Renderproduct()}
</div>
}
</Layout>
  
)
}

export default Product
