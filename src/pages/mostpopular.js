import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import StarRatings from 'react-star-ratings';
import { getProductURL } from './../utils/url';
import { Link } from "gatsby";

const Mostpopular = () => {
    const [popularProducts, setPopularProducts] = useState(null);

    useEffect(() => {
      const fetchPopular = async () => {
        const res = await fetch(
          `${process.env.GATSBY_CART_URL_STARCARE}admin/mostpopular/15`
        );
        //   console.error('here string')
        const json = await res.json();
        await setPopularProducts(json);
      };
      fetchPopular();
    }, []);

    const renderProducts = () => {
        if (popularProducts) {
          return <div className="row">
            {
              popularProducts.map((data, index) => (
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
                        />
    
                        <div>
                          <span className="price">$ {Math.round(data.price)}</span>
                          <span className="off_txt_lft">$000</span>
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
              {/* <section className="popular_section">
      <div className="container">
        <div className="row">
          <div>
            <h2 className="section_title">
              <span>Best Selling Products</span>
              <p>Contrary to popular belief, Lorem Ipsum is not simply random text</p>
            </h2>

            
            <div className="col-lg-12">
              {renderProducts()}
            </div>
          </div>
        </div>
      </div>
    </section> */}
        </Layout>
    )
}   

export default Mostpopular;