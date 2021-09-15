import React from "react"
import placeholder from './../assets/placeholder.png';
import img1 from './../assets/img1.jpg';
import img2 from './../assets/img2.jpg';
import { Link } from "gatsby"

const Feedbacks = () => (
    <section>
        <div className="row user_command_sec">
        <div className="col-lg-3 col-md-3 col-xs-12 border_rt">
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
              4.0 out of 5 ratting <small>(of 246 reviews)</small>
            </span>
          </div>

          <ul className="progress_rating">
            <li>
              <div className="progress">
                <div className="progress-bar" role="progressbar"  aria-valuenow="90" aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
              <p>5 Star</p>
              <p className="value">17%</p>
            </li>
            <li>
              <div className="progress">
                <div className="progress-bar" role="progressbar"  aria-valuenow="90" aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
              <p>5 Star</p>
              <p className="value">17%</p>
            </li>
            <li>
              <div className="progress">
                <div className="progress-bar" role="progressbar"  aria-valuenow="90" aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
              <p>5 Star</p>
              <p className="value">17%</p>
            </li>
            <li>
              <div className="progress">
                <div className="progress-bar" role="progressbar"  aria-valuenow="90" aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
              <p>1 Star</p>
              <p className="value">17%</p>
            </li>
          </ul>
        </div>
        <div className="col-lg-9 col-md-9 col-xs-12 user_comment">
          <div className="user_details">
            <div className="user_profile_sec pb-2">
              <div className="user_profile">
                <img src={placeholder} />
              </div>
              <div>
                <h3 className="user_name">Henry Wilson</h3>
                <Link  className="user_email">henrywilson26@gmail.com</Link>
              </div>
            </div>
            <form>
              <div className="form-group">
                <textarea className="form-control" id="user_command_area" placeholder="Write your Comment..."
                  rows="6"></textarea>
              </div>
            </form>
            <div className="user_link">
              <Link >Attach Real-time photos</Link>
              <Link>Submit your feedback</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="view_user_cmd_sec">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-xs-12">
            <div className="user_feedback_item">
              <div className="user_profile_sec">
                <div className="user_profile">
                <img src={placeholder} />
                </div>
                <h3 className="user_name">Allen Jones</h3>
              </div>
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
                  4.0 out of 5 Ratting
                </span>
              </div>
              <div className="user_feedback">
                <ul>
                <li>
                    <img src={img1} />
                  </li>
                  <li>
                    <img src={img2} />
                  </li>
                </ul>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip
                  ex
                  ea commodo consequat.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip
                  ex
                  ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna...
                </p>
                <Link >Read More</Link>
              </div>
            </div>

            <div className="user_feedback_item">
              <div className="user_profile_sec">
                <div className="user_profile">
                <img src={placeholder} />
                </div>
                <h3 className="user_name">Allen Jones</h3>
              </div>
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
                  4.0 out of 5 Ratting
                </span>
              </div>
              <div className="user_feedback">
                <ul>
                  <li>
                    <img src={img1} />
                  </li>
                  <li>
                    <img src={img2} />
                  </li>
                </ul>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip
                  ex
                  ea commodo consequat.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip
                  ex
                  ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna...
                </p>
                <Link >Read More</Link>
              </div>
            </div>

            <div className="view_more_link mt-2">
              <Link href="view_more">view more</Link>
            </div>
          </div>


        </div>

      </div>
    </section>
)

export default Feedbacks