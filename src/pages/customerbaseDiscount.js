import React, { useState, useEffect } from "react"
import { Link } from "gatsby";
import Layout from '../components/layout';
import { getProductURL } from "../utils/url";
import PageLoader from "../components/loaders/pageLoader";
import axios from "axios";

const CustomerDiscount = () => {
    
const[customerDiscount, setCustomerDiscount] = useState(null)
const [loader, setLoader] = useState(false);

useEffect(() => {
    setLoader(true);
        const customerDiscount = async() => {
            await axios({
                method: "get",
                url : `${process.env.GATSBY_CART_URL_STARCARE}admin/customerdiscountproducts/${localStorage.customer_id}`
            }).then((res) => {
                let item = res.data;           
                item.filter(obj => {
                    obj.id = obj.product_id
                })
                setCustomerDiscount(item);
                setLoader(false);
            } )
        } 
        customerDiscount();

}, []);


const Renderproduct = () => {
    return <>

    {customerDiscount ? 
    (customerDiscount.map((data,index) => (
        <div className="brandedpro_item" key={index}>
                            <div className="products">
                                <Link to={getProductURL(data)} ><img className="product_img" src={data.product_image} alt="Kohler Forte Widespread" /></Link>
                                <h4 className="product_name"><Link to={getProductURL(data)} >{data.product_name}</Link></h4>
                                <p className="product_number"><span><strong>Model:</strong> {data.product_sku}</span></p>
                                <p className="product_number"><span><strong>original Price:</strong> ${data.original_price} </span></p>
                                <div className="product_btm">
                                <span><strong>Discount Price:</strong></span><h3 className="product_price"> ${Math.floor(data.discount_price)}<sup className="price_decimal"></sup></h3>
                                </div>
                            </div>
                        </div>
    )))  :
    
    <div></div>}
    </>
}


return (

    <Layout>
        <section className="page_content inner_page">
            <div className="content_wrapper">
                <div className="container">
                    <div className="row main_title">
                        <h1>My <span>offers</span></h1>
                        <span><Link to="/discountProducts"> + View all Discounts</Link></span>
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
export default CustomerDiscount;