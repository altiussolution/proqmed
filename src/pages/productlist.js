import { Link } from "gatsby"
import React from "react"
import imgg from './../assets/img.png';
import { IoGridOutline } from "react-icons/io5";

const Productlist = () => (
    <section className="category_container">
            <div className="card">
              <div className="tools_items">
                <div className="tools">
                  <span>
                    Show:
                  </span>
                  <div className="option">
                    <select className="form-control" id="show_option1">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                </div>
                <div className="tools">
                  <p className="category-product-count">Showing 01 - 20 of 500</p>
                </div>
              </div>

              <div className="tools_items">
                <div className="tools">
                  <span>
                    Sort by:
                  </span>
                  <div className="option">
                    <select className="form-control" id="sort_option1">
                      <option>Relavance</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                </div>
                <div className="tools">
                  <span className="title_view">
                    <Link className="view-grid  active" id="grid" data-toggle="tooltip" data-placement="top" title="Grid"><IoGridOutline /></Link>
                    <Link className="view-list" id="list"  data-toggle="tooltip" data-placement="top" title="List"><i className="fas fa-list"></i></Link>
                  </span>
                </div>
              </div>
            </div>
            <div className="cat_scroll">
              <div className="container_">
                <div id="products" className="row list-group">
                  <div className="item product_item">
                    <Link to="/productdetail">
                    <div className="thumbnail">
                      <div className="product_img">
                        
                        <img className="w-100" src={imgg} alt={"banner"}/>
                      </div>
                      <div className="caption">
                        <p className="product_text">
                          Product description... Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                          sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>

                        <div className="rating_field">
                          <div className="star-rating">
                            <span className="fa fa-star-ofa far fa-star" data-rating="1"></span>
                            <span className="fas fa-star" data-rating="2"></span>
                            <span className="far fa-star" data-rating="3"></span>
                            <span className="far fa-star" data-rating="4"></span>
                            <span className="far fa-star" data-rating="5"></span>
                            <input type="hidden" name="whatever1" className="rating-value" value="2.56" />
                          </div>
                          <span className="rating_text">
                            3 ratings
                          </span>
                        </div>
                        <p className="product_amt">
                          <i className="fas fa-pound-sign"></i> 21.000</p>
                        <button className="btn btn_gray" href="product-details.html">Buy now</button>
                      </div>
                    </div>

                    <div className="tag_links">
                      <ul>
                        <li>
                          <button><i className="far fa-clone"></i></button>
                        </li>
                        <li>
                          <button><i className="far fa-bookmark"></i></button>
                        </li>
                      </ul>
                    </div>
                    </Link>
                  </div>



 


                  
                  <div className="item product_item">
                    <div className="thumbnail">
                      <div className="product_img">
                        <img className="w-100" src={imgg} alt={"banner"}/>
                      </div>
                      <div className="caption">
                        <p className="product_text">
                          Product description... Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                          sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
                          <p className="no_reviews">No Reviews </p>
                        <p className="product_amt">
                          <i className="fas fa-pound-sign"></i> 21.000</p>
                        <Link className="btn btn_gray" href="product-details.html">Buy now</Link>
                      </div>
                    </div>

                    <div className="tag_links">
                      <ul>
                        <li>
                          <button><i className="far fa-clone"></i></button>
                        </li>
                        <li>
                        <button><i className="far fa-bookmark"></i></button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="tools_items">
                <div className="tools">
                  <span>
                    Show:
                  </span>
                  <div className="option">
                    <select className="form-control" id="show_option1">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                </div>
                <div className="tools">
                  <p className="category-product-count">Showing 01 - 20 of 500</p>
                </div>
              </div>

              <div className="tools_items">
                <div className="tools">
                  <span>
                    Sort by:
                  </span>
                  <div className="option">
                    <select className="form-control" id="sort_option1">
                      <option>Relavance</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                </div>
                <div className="tools">
                  <span className="title_view">
                    <Link className="view-grid  active" id="grid" data-toggle="tooltip" data-placement="top" title="Grid"><i className="fas fa-th"></i></Link>
                    <Link className="view-list" id="list"  data-toggle="tooltip" data-placement="top" title="List"><i className="fas fa-list"></i></Link>
                  </span>
                </div>
              </div>
            </div>
    </section>
)

export default Productlist