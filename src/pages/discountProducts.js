import React, { useState, useEffect } from "react"
import axios from "axios";
import { getProductURL } from "../utils/url";
import { Link } from "gatsby";
import Layout from '../components/layout';
import PageLoader from "../components/loaders/pageLoader";

const DiscountProducts = ({ location }) => {
    const [discountProduct, setDiscountProduct] = useState(null);
    const [loader, setLoader] = useState(false);
    // const [customerDiscount, setCustomerDiscount] = useState(null);

    useEffect(() => {
        setLoader(true);
        const discountProduct = async () => {
            await axios({
                method: "get",
                url: `${process.env.GATSBY_NODE_URL}data/categories/discountproducts.json`
            }).then((res) => {
                const item = res.data
                setDiscountProduct(item);
                setLoader(false);

            })
        }
        discountProduct();
    }, []);
// }).then(async (res) => {
//     await axios.get(
//     `${process.env.GATSBY_NODE_URL}data/categories/discountproducts.json`
//   ).then(async (res)=>{
//       const item = res.data
//       setDiscountProduct(item)
//       console.log("res")
//       console.log(item)
//       setLoader(false);
//   })
  
//     })
// }
// discountProduct();
// // setLoader(false);
//     },[])




    const Renderproduct = () => {
        if (discountProduct) {
            return <>

                {    discountProduct ?
                    (discountProduct.map((data, index) => (
                        <div className="brandedpro_item" key={index}>
                            <div className="products">
                                <div className="price_off">{data.offer}off</div>
                                <img className="product_img" src={data.image} alt="Kohler Forte Widespread" />
                                
                                <h4 className="product_name">{data.name.slice(0,70)}...<br />
                                </h4>
                                <p className="product_number">Model:<span>{data.sku}</span></p>                                
                                <div className="product_btm">
                                    <h3 className="product_price">${Math.floor(data.price)}<sup className="price_decimal"></sup></h3>
                                    <button className="btn btn_gray" >
                                        <Link to={getProductURL(data)} >View</Link>
                                    </button>
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
                            <h1>Our <span>DiscountProducts</span></h1>
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

export default DiscountProducts;
