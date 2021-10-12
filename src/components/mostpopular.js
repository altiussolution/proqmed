import React, { useState, useEffect } from "react";
import StarRatings from 'react-star-ratings';
import { getProductURL } from './../utils/url';
import { Link } from "gatsby";
import Glov from "./../assets/glov.png"

const Mostpopular = () => {

  const [popularProducts, setPopularProducts] = useState(null);

  useEffect(() => {
    const fetchPopular = async () => {
      const res = await fetch(
        `${process.env.GATSBY_CART_URL_STARCARE}admin/mostpopular/15`
      );
      const json = await res.json();
      await setPopularProducts(json);
    };
    fetchPopular();
  }, []);

  const renderProducts = () => {
    if (popularProducts) {
      return <div className="row">
        {
          popularProducts.slice(popularProducts.length-6, popularProducts.length).map((data, index) => (
            <div key={`${data.name}_${index}`} className="col-4 col">
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
                      starRatedColor="rgb(242 187 22)"
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
    <section className="popular_section">
      <div className="container">
        <div className="row">
      {/* <h2 className="section_title">
              <span>Most Popular</span>
              <span><Link to="/mostpopular">+ View all Products</Link></span>
            </h2> */}
            <h2 className="section_title text-center">
<span>Featured Products</span>

</h2>
            
              {/* {renderProducts()} */}

              {/* <div className="row"> */}
                <div className="col-lg-4 border flx">
                  
                  <img className="w-100" src={Glov} alt={"banner"}/> 

                  <div className="banner_sep">
                  <StarRatings
                                        // rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Stethescope </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    
                                    </div>
                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                
                
                
               
                
                
              </div>
              </div>
      {/* </div> */}
    </section>

  )

}

export default Mostpopular