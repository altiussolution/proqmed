import React, { useState, useEffect } from "react"
import Layout from '../components/layout';
import axios from "axios";
import { useForm } from "react-hook-form";
import StarRatings from 'react-star-ratings';
import { toast } from 'react-toastify';

const Sellerreview = ({location} ) => {
  const [jwt, setjwt] = useState();
  const { register, handleSubmit, errors } = useForm();
  const [quality_rating, setQuality_rating] = useState(0);
  const [error_rating, setError_rating] = useState(false);

  useEffect(() => {
    setjwt(localStorage.userToken)
console.log(location.state.id)
  }, []);



  const onSubmitReview = (reviewDetails) => {
    let reviewData = { 
      "data":
      {
        "seller_id": location.state.seller_id,
        "customer_id": localStorage.customer_id,
        "review": reviewDetails.review_title,
        "rating": quality_rating
      }
    }

    try {
      axios({
        method: 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}sellerreview`,
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
    setQuality_rating(rating)
  }




  return (
      <Layout>
             <div className="container-fluid grey">
        <div className="container padd">
        <div className="fo-bg-white">
          <h1>Add Seller Review</h1>
                <form onSubmit={handleSubmit(onSubmitReview)} action="" className="header_signin_form">
                
                  <div className="form-group">
                    <label htmlFor="review_title">Review <span className="error_label">*</span></label>
                    <input className="form-control" name="review_title" placeholder="Review" type="text" ref={register({
                      required: true
                    })} />
                    {errors.review_title && errors.review_title.type === 'required' && <span className="error">Review is required</span>}
                  </div>
              
                  <div className="form-group">
                    <label htmlFor="quality_rating">Rating<span className="error_label">*</span></label>
                    <StarRatings
                      numberOfStars={5}
                      name='quality_rating'
                      rating={quality_rating}
                      starDimension="25px"
                      starSpacing="1px"
                      starRatedColor="rgb(255 123 168)"
                      starRatedColor="rgb(255 123 168)"
                      isSelectable={true}
                      changeRating={e => { changeRating(e) }}
                    />
                    {quality_rating === 0 && error_rating && <span className="error">Quality Rating is required</span>}
                  </div>
                
                  <button type="submit" className="btn_link theme_btn_blue w-100" onClick={() => { setError_rating(true) }}>Submit</button>
                </form>
        
                </div>
                </div>
                </div>
   
    </Layout>

 
  )
}

export default Sellerreview;