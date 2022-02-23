import React, { useState, useEffect } from "react"
import Layout from '../components/layout';
import axios from "axios";
import { useForm } from "react-hook-form";
import StarRatings from 'react-star-ratings';
import { toast } from 'react-toastify';

const Addreview = ({location} ) => {
  const [jwt, setjwt] = useState();
  const { register, handleSubmit, errors } = useForm();
  const [overall_rating, setOverall_rating] = useState(0);
  const [quality_rating, setQuality_rating] = useState(0);
  const [value_rating, setValue_rating] = useState(0);
  const [price_rating, setPrice_rating] = useState(0);
  const [error_rating, setError_rating] = useState(false);

  useEffect(() => {
    setjwt(localStorage.userToken)
console.log(location.state.id)
  }, []);



  const onSubmitReview = (reviewDetails) => {
    if (quality_rating === 0 || value_rating === 0 || price_rating === 0 || overall_rating === 0) {
      return;
    }
    let reviewData = { 
      "data":
      {
        "product_id": location.state.id,
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
          // navigate('/')  
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
      <Layout>  
        <div className="container-fluid grey">
        <div className="container padd">
        <div className="fo-bg-white">
        <h1>Add Review</h1>
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
                      starRatedColor="rgb(255 123 168)"
                      starRatedColor="rgb(255 123 168)"
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
                      starRatedColor="rgb(255 123 168)"
                      starRatedColor="rgb(255 123 168)"
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
                      starRatedColor="rgb(255 123 168)"
                      starRatedColor="rgb(255 123 168)"
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
                      starRatedColor="rgb(255 123 168)"
                      starRatedColor="rgb(255 123 168)"
                      isSelectable={true}
                      ref={register}
                      changeRating={e => { changeRating(e) }}
                    />
                    {overall_rating === 0 && error_rating && <span className="error">Rating is required</span>}
                  </div>
                  <button type="submit" className="btn_link theme_btn_blue w-100" onClick={() => { setError_rating(true) }}>Submit</button>
                </form>
                </div>
         </div>
         </div>
    </Layout>
 
  )
}

export default Addreview;