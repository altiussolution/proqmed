import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import StarRatings from 'react-star-ratings';
import { getProductURL } from './../utils/url';
import { Link } from "gatsby";

const TrendingProducts = () => {
    const [trendingProducts, setTrendingProducts] = useState(null);

    useEffect(() => {
      const fetchTrending = async () => {
        const res = await fetch(
          `${process.env.GATSBY_CART_URL_STARCARE}admin/trendingproducts`
        );
        //   console.error('here string')
        const json = await res.json();
        await setTrendingProducts(json);
      };
      fetchTrending();
    }, []);

    const renderProducts = () => {
        if (trendingProducts) {
          return <div className="row">
            {
              trendingProducts.map((data, index) => (
                <div key={`${data.name}_${index}`} className="col-4">
                  <div className="" >
                  <Link to={getProductURL(data)}>
                    <div className="card">
    
                      <div className="image_wrapper">
                        <img src={data.image} />
    
                      </div>
    
    
                      <div className="img_content">
                        <h5 className="prod-title">{data.name.slice(0,55)}...</h5>
    
                        <StarRatings
                          rating={Math.round(data.rating)}
                          numberOfStars={5}
                          name='rating'
                          starDimension="15px"
                          starSpacing="0px"
                          starRatedColor="rgb(255 123 168)"
                          svgIconViewBox="0 0 32 32"
                                        svgIconPath="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"
                        />
    
                        <div>
                          <span className="price">$ {Math.round(data.original_price)}</span>
                          {data.strike_price != null  &&  <span className="off_txt_lft">${Math.round(data.strike_price)}</span>}
                        </div>
                      </div>
    
                    </div>
                    </Link>
                  </div>
                </div>
              ))
            }
          </div>
        }
      }

    return (
        <Layout>
              <section className="popular_section trending_products">
      <div className="container">
        <div className="row">
          <div>
            <h2 className="section_title">
              <span>Trending Products</span>
            </h2>
            <div className="col-lg-12">
              {renderProducts()}
            </div>
          </div>
        </div>
      </div>
    </section>
        </Layout>
    )
}   

export default TrendingProducts;