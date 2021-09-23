import React, { useState, useEffect } from "react"
import axios from "axios";
import { getProductURL } from "../utils/url";
import { Link } from "gatsby";
import Layout from '../components/layout';
import PageLoader from "../components/loaders/pageLoader";


const BestsellingProduts = ({ location }) => {
    const [ bestsellingProduts, setBestsellingProduts] = useState(null);
    const [loader, setLoader] = useState(false);


    useEffect(() => {
        setLoader(true);
        const bestsellingProduts = async () => {
            await axios({
                method: "get",
                url: `${process.env.GATSBY_CART_URL_STARCARE}admin/bestsellingproducts/`
            }).then((res) => {
                const item = res.data
                setBestsellingProduts(item);
                setLoader(false);

            })
        }
        bestsellingProduts();
    }, []);


    const Renderproduct = () => {
        if (bestsellingProduts) {
            return <>

                {    bestsellingProduts ?
                    (bestsellingProduts.map((data, index) => (
                        <div className="brandedpro_item" key={index}>
                            <div className="products">
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
                            <h1>Our <span>Bestselling Produts</span></h1>
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

export default BestsellingProduts;
