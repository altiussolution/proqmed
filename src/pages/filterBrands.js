import React, { useState, useEffect } from "react"
import axios from "axios";
import { Link } from "gatsby";
import Layout from '../components/layout';
import PageLoader from "../components/loaders/pageLoader";
const FilterBrands = props => {
    const [productBrand, setProductBrand] = useState(null);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setLoader(true);
        const productBrand = async () => {
            await axios({
                method: "get",
                url: `${process.env.GATSBY_CART_URL}admin/brandlist/`
            }).then((res) => {
                const item = res.data
                setProductBrand(item);
                setLoader(false);
            })
        }
        productBrand();
    }, [props.id]);

    const Renderproduct = () => {
        if (productBrand) {

            return <>
                {    productBrand ?
                    (productBrand.map((data, index) => (
                        <div className="brand_item" key={index}>
                            <div className="products">
                                <Link to="/brandedProducts/" state={{ brand_id: data.brand_id }} >
                                    <img className="product_img" src={data.image} />
                                </Link>
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

export default FilterBrands;
