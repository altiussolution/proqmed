import React, { useState, useEffect } from "react"
import axios from "axios";
import { getProductURL } from "../utils/url";
import { Link } from "gatsby";
import Layout from '../components/layout';
import PageLoader from "../components/loaders/pageLoader";

const BrandedProducts = ({ location }) =>{
    const [productBrand, setProductBrand] = useState([]);
    const [loader, setLoader] = useState(false);
    const [brandImage, setBrandImage] = useState('');

          

    useEffect(() => {
        product()
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

const Renderproduct = () => {    
    if (productBrand) {
        return <>

                {    productBrand ? 
                    (productBrand.map((data, index) => (
                        <div className="brandedpro_item" key={index}>
                            <div className="products">
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
