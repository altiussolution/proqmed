import { Link } from "gatsby"
import React from "react"


const Filter = () => (
    <section className="category_sidebar">
          
            <div className="accordion md-accordion" id="accordionEx">
              {/* <!-- Accordion card category--> */}
              <div className="card">
                <div className="card-header" role="tab" id="headingOne1">
                  <Link data-toggle="collapse" data-parent="#accordionEx" href="#category1" aria-expanded="true"
                    aria-controls="category1">
                    <h5>
                      Category
                    </h5>
                  </Link>
                </div>

                {/* <!-- Card body --> */}
                <div id="category1" className="collapse show" data-parent="#accordionEx">
                  <div className="card-body">
                    <form className="category_form">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="category_check1" />
                        <label className="form-check-label" htmlFor="category_check1">Alarm and Motion Service new
                          availabe</label>
                      </div>

                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="category_check2" />
                        <label className="form-check-label" htmlFor="category_check2">Check me out</label>
                      </div>

                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="category_check3" />
                        <label className="form-check-label" htmlFor="category_check4">Check me out</label>
                      </div>


                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="category_check5" />
                        <label className="form-check-label" htmlFor="category_check5">Check me out</label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* <!-- Accordion card Brand--> */}
              <div className="card card_space">
                <div className="card-header" role="tab" id="headingOne1">
                  <Link data-toggle="collapse" data-parent="#accordionEx" href="#brand2" aria-expanded="true"
                    aria-controls="brand2">
                    <h2>
                      Brandasasssdf
                    </h2>
                  </Link>
                </div>

                {/* <!-- Card body --> */}
                <div id="brand2" className="collapse show" data-parent="#accordionEx">
                  <div className="card-body">
                    <form className="category_form">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="brand_check1" />
                        <label className="form-check-label" htmlFor="brand_check1">Alarm and Motion</label>
                      </div>

                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="brand_check2" /> 
                        <label className="form-check-label" htmlFor="brand_check2">Check me out</label>
                      </div>

                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="brand_check3" />
                        <label className="form-check-label" htmlFor="brand_check3">Check me out</label>
                      </div>


                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="brand_check4" />
                        <label className="form-check-label" htmlFor="brand_check4">Check me out</label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* <!-- Accordion card Price--> */}
              <div className="card card_space">
                <div className="card-header" role="tab" id="headingOne1">
                  <Link data-toggle="collapse" data-parent="#accordionEx" href="#price3" aria-expanded="true"
                    aria-controls="price3">
                    <h2>
                      Price
                    </h2>
                  </Link>
                </div>

                {/* <!-- Card body --> */}
                <div id="price3" className="collapse show" data-parent="#accordionEx">
                  <div className="card-body">
                    <form className="category_form">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="price_check1" />
                        <label className="form-check-label" htmlFor="price_check1"><i className="fas fa-rupee-sign"></i> 200 - 400
                        </label>
                      </div>

                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="price_check2" />
                        <label className="form-check-label" htmlFor="price_check2"><i className="fas fa-rupee-sign"></i> 200 - 400
                        </label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* <!-- Accordion card Rating--> */}
              <div className="card card_space">
                <div className="card-header" role="tab" id="headingOne1">
                  <Link data-toggle="collapse" data-parent="#accordionEx" href="#rating4" aria-expanded="true"
                    aria-controls="rating4">
                    <h5>
                      Rating
                    </h5>
                  </Link>
                </div>

                {/* <!-- Card body --> */}
                <div id="rating4" className="collapse show" data-parent="#accordionEx">
                  <div className="card-body">
                    <form className="category_form">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="rating_check1" />
                        <div className="rating_field">
                          <div className="star-rating">
                            <span className="fa fa-star-ofa far fa-star" data-rating="1"></span>
                            <span className="far fa-star" data-rating="2"></span>
                            <span className="far fa-star" data-rating="3"></span>
                            <span className="far fa-star" data-rating="4"></span>
                            <span className="far fa-star" data-rating="5"></span>
                            <input type="hidden" name="whatever1" className="rating-value" value="2.56" />
                          </div>
                          <label htmlFor="rating_check1">above 4 star </label>
                        </div>
                      </div>

                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="rating_check2" />
                        <div className="rating_field">
                          <div className="star-rating">
                            <span className="fa fa-star-ofa far fa-star" data-rating="1"></span>
                            <span className="far fa-star" data-rating="2"></span>
                            <span className="far fa-star" data-rating="3"></span>
                            <span className="far fa-star" data-rating="4"></span>
                            <span className="far fa-star" data-rating="5"></span>
                            <input type="hidden" name="whatever1" className="rating-value" value="2.56" />
                          </div>
                          <label htmlFor="rating_check1">above 3 star</label>
                        </div>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            </div>
    </section>
)


export default Filter