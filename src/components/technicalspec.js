import React, { useState, useEffect } from "react"
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { checkLogin } from "./../services/headerServices";
import { navigate } from 'gatsby';
import { useForm } from "react-hook-form";
import StarRatings from 'react-star-ratings';
import { ToastContainer, toast } from 'react-toastify';

const Technicalspec = ({ specification, attachment }) => {
  const [productReview, setProductReview] = useState([]);
  const [jwt, setjwt] = useState();
  const { register, handleSubmit, errors } = useForm();
  const [review, setReviewPopup] = useState(false);
  const [showReview, setShowReview] = useState(true);
  const handleCloseReview = () => setShowReview(false);
  const handleShowReview = () => setShowReview(true);
  const [overall_rating, setOverall_rating] = useState(0);
  const [quality_rating, setQuality_rating] = useState(0);
  const [value_rating, setValue_rating] = useState(0);
  const [price_rating, setPrice_rating] = useState(0);
  const [error_rating, setError_rating] = useState(false);

  useEffect(() => {
    setjwt(localStorage.userToken)
    getReview();

  }, []);

  const getReview = async () => {
    try {
      axios({
        method: 'get',
        url: `${process.env.GATSBY_CART_URL_STARCARE}admin/reviewandrating/${specification.items.id}`,
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      }).then((res) => {
        if (res.statusText === "OK" && res.status == 200) {
          setProductReview(res.data);
        }
      }).catch((err) => {
        console.error(err);
      })
    } catch (err) {
      console.error(err)
    }
  };

  const reviewPopupOpen = () => {
    if (!checkLogin()) {
      navigate('/signin')
    } else {
      setReviewPopup(true)
      handleShowReview(true)
      setOverall_rating(0)
      setQuality_rating(0)
      setValue_rating(0)
      setPrice_rating(0)
      setError_rating(false)
    }
  }

  const onSubmitReview = (reviewDetails) => {
    if (quality_rating === 0 || value_rating === 0 || price_rating === 0 || overall_rating === 0) {
      return;
    }
    let reviewData = {
      "data":
      {
        "product_id": specification.items.id,
        "customer_id": localStorage.customer_id,
        "nick_name": reviewDetails.nick_name,
        "review_title": reviewDetails.review_title,
        "review_details": reviewDetails.review_details,
        "quality_rating": quality_rating,
        "value_rating": value_rating,
        "price_rating": price_rating,
        "rating": overall_rating
      }
    }

    try {
      axios({
        method: 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}admin/addreviews`,
        data: reviewData,
      })
        .then(function (response) {
          toast.success(response.data)
          handleCloseReview()
          getReview();
        })
        .catch(function (response) {
          toast.error('An error occured please contact admin')
        });

    } catch (err) {
      console.error(`An error occured ${err}`)
    }

  }

  const changeRating = (rating) => {
    setOverall_rating(rating)
  }

  const changeQualityRating = (rating) => {
    setQuality_rating(rating)
  }

  const changeValueRating = (rating) => {
    setValue_rating(rating)
  }

  const changePriceRating = (rating) => {
    setPrice_rating(rating)
  }


  return (
    <>
      {specification && specification.items ? (
        <>
          <section>
            <Tabs defaultActiveKey="desc" id="uncontrolled-tab-example">
              <Tab eventKey="desc" title="Technical Specs">
                <div className="table-responsive pt-3">
                  <table className="table table-striped">
                    <tbody>
                      {Object.keys(specification).map(key => {
                        if (
                          key === "items" ||
                          key === "key" ||
                          key.includes("Spec Sheet") ||
                          key === "Mfr Part No."
                        )
                          return null;
                        return (
                          <tr key={key}>
                            <th className="border px-4 py-2 font-bold">{key}</th>
                            <td className="border px-4 py-2">
                              {specification[key] ? specification[key] : " "}
                              {/* {specification[key].replace(/;/g, ", ")} */}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Tab>

              <Tab eventKey="spec" title="Full Description">
                <div className="mt-4 liBullet" dangerouslySetInnerHTML={{ __html: specification.items.desc }} />

                {/* </Tab>  */}


              </Tab>
              <Tab eventKey="attach" title="Technical Attachment">
                <div>
                  {attachment[0].sku ?
                    <a href={attachment[0].attachment_file} download>Sku:{attachment[0].sku}</a> : <span>Attachment Not found</span>
                  }
                
                </div>
              </Tab>

              <Tab eventKey="review" title="Reviews">

                {productReview.length == 0 ? <div>No Reviews</div> :
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Summary of Review</th>
                        <th>Detail</th>
                        <th>Rating</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    {
                      productReview.map((reviews, index) => (
                        <tbody key={index}>
                          <tr>
                            <td><span>{reviews.nickname}</span></td>
                            <td><span>{reviews.summary_of_review}</span></td>
                            <td className="detail_size"><span>{reviews.detail}</span></td>
                            <td>
                              <StarRatings
                                rating={Math.round(reviews.review_percentage/20)}
                                numberOfStars={5}
                                name='rating'
                                starDimension="15px"
                                starSpacing="0px"
                                starRatedColor="rgb(242 187 22)"
                              />
                            </td>
                            <td><span>{new Date(reviews.created_at).toLocaleString()}</span></td>
                          </tr>
                        </tbody>
                      ))
                    }
                  </table>
                }
                <div className="button_sec">
                  <button onClick={() => reviewPopupOpen()} className="btn_gray btn">
                    Add Review
              </button>
                </div>
              </Tab>
            </Tabs>
            {review ? <Modal show={showReview} onHide={handleCloseReview} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title>Add Review</Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <form onSubmit={handleSubmit(onSubmitReview)} action="" className="header_signin_form">
                  <div className="form-group">
                    <label htmlFor="nick_name">Nick Name<span className="error_label">*</span></label>
                    <input className="form-control" name="nick_name" placeholder="Nick Name" type="text" ref={register({
                      required: true
                    })} />
                    {errors.nick_name && errors.nick_name.type === 'required' && <span className="error">Nick Name is required</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="review_title">Review Title<span className="error_label">*</span></label>
                    <input className="form-control" name="review_title" placeholder="Review Title" type="text" ref={register({
                      required: true
                    })} />
                    {errors.review_title && errors.review_title.type === 'required' && <span className="error">Review Title is required</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="review_details">Review Details<span className="error_label">*</span></label>
                    <input className="form-control" name="review_details" placeholder="Review Details" type="text" ref={register({
                      required: true
                    })} />
                    {errors.review_details && errors.review_details.type === 'required' && <span className="error">Review Details is required</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="quality_rating">Quality Rating<span className="error_label">*</span></label>
                    <StarRatings
                      numberOfStars={5}
                      name='quality_rating'
                      rating={quality_rating}
                      starDimension="25px"
                      starSpacing="1px"
                      starRatedColor="rgb(242 187 22)"
                      starHoverColor="rgb(242 187 22)"
                      isSelectable={true}
                      changeRating={e => { changeQualityRating(e) }}
                    />
                    {quality_rating === 0 && error_rating && <span className="error">Quality Rating is required</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="value_rating">Value Rating<span className="error_label">*</span></label>
                    <StarRatings
                      numberOfStars={5}
                      name='value_rating'
                      rating={value_rating}
                      starDimension="25px"
                      starSpacing="1px"
                      starRatedColor="rgb(242 187 22)"
                      starHoverColor="rgb(242 187 22)"
                      isSelectable={true}
                      ref={register}
                      changeRating={e => { changeValueRating(e) }}
                    />
                    {value_rating === 0 && error_rating && <span className="error">Value Rating is required</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="price_rating">Price Rating<span className="error_label">*</span></label>
                    <StarRatings
                      numberOfStars={5}
                      name='price_rating'
                      rating={price_rating}
                      starDimension="25px"
                      starSpacing="1px"
                      starRatedColor="rgb(242 187 22)"
                      starHoverColor="rgb(242 187 22)"
                      isSelectable={true}
                      ref={register}
                      changeRating={e => { changePriceRating(e) }}
                    />
                    {price_rating === 0 && error_rating && <span className="error">Price Rating is required</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="rating">Rating<span className="error_label">*</span></label>
                    <StarRatings
                      numberOfStars={5}
                      name='rating'
                      rating={overall_rating}
                      starDimension="25px"
                      starSpacing="1px"
                      starRatedColor="rgb(242 187 22)"
                      starHoverColor="rgb(242 187 22)"
                      isSelectable={true}
                      ref={register}
                      changeRating={e => { changeRating(e) }}
                    />
                    {overall_rating === 0 && error_rating && <span className="error">Rating is required</span>}
                  </div>
                  <button type="submit" className="btn_link theme_btn_blue w-100" onClick={() => { setError_rating(true) }}>Submit</button>
                </form>
              </Modal.Body>
              <Modal.Footer>

              </Modal.Footer>
            </Modal> : <div></div>}
          </section>
        </>
      ) : (
          <div></div>
        )
      }
    </>
  )
}

export default Technicalspec