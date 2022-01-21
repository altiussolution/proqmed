import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import {  navigate } from "gatsby";
import 'react-toastify/dist/ReactToastify.css';   
import { Link } from "gatsby";
import { TablePagination } from '@mui/material';
import { checkLogin } from "./../services/headerServices";
import StarRatings from 'react-star-ratings';
const Myreviews = () => {
 const [page, setPage] = React.useState(0);
 const [rowsPerPage, setRowsPerPage] = React.useState(4);
 const [reviews, setReviews] = useState([]);
 const [isuserlogged, setIsLogged] = useState(false);
 const [norevs, noreviews] = useState("");
 useEffect(() => {
 getReviews();
 setIsLogged(checkLogin());
}, [])

const getReviews = async () => {
 const res = await fetch(
     `${process.env.GATSBY_CART_URL_STARCARE}customer/reviewslist/customer_id/39`
 );
 const json = await res.json();
 if(json=="Reviews not available for this customer"){
     
     await noreviews(json);
 }else {
     await setReviews(json);
    
 }
};

const handleChangePage = (event, newPage) => {
 setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
 setRowsPerPage(parseInt(event.target.value, 10));
 setPage(0);
};
const logout = () => {
 setIsLogged(false)
 localStorage.clear();
 navigate('/')  

}

return (
 <Layout>
   <div class="container-fluid grey">
<div class="container">
    <div class="row">
        <div class="col-lg-4 col-md-12 col-sm-12">
            <div class="profile-sec">
                <img src="images/sample.png" alt=""/>
                <div class="name">
                    <span>Hello</span>
                    <p>{localStorage.user_name}</p>
                </div>
            </div>

            <div class="profile-sec details">
                <h4><span><img src="images/orders.png" alt=""/></span><Link to="/orders"><a>MY ORDERS</a> </Link></h4>
                <h4><span><img src="images/account.png" alt=""/></span><Link to="/profile"><a> ACCOUNT SETTINGS</a></Link></h4>
                <ul>
                    <li><Link to="/profile"><a>Profile Information</a></Link></li>
                    <li><Link to="/myAddress"><a>Manage Addresses</a></Link></li>

                </ul>
                <h4><span><img src="images/logout.png" alt=""/></span><a onClick={() => { logout() }}>LOGOUT</a></h4>
            </div>
        </div>

        <div class="col-lg-8 col-md-12 col-sm-12 ">
            <div class="fo-bg-white">
                <div class="top">
                    <div class="header">
                    <h2 class="heading">My Reviews <span>({reviews.length})</span></h2>
                </div>
                
                </div>
                {reviews.length!=0 ?
              
                <div class="wishlist">
                   {
                    reviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((quote, index) => (
                  <div class="sec-top">
                    <div class="row fo-align">
                      <div class="col-lg-4 col-md-12 col-sm-12">
                    
                        
                          <img src="images/fp1.png" alt=""/>
                        
                      </div>

                      <div class="col-lg-8 col-md-12 col-sm-12">
                        <div class="wishlist-content">             
                        <p>{quote.product_name}</p>               
                        
                        <div class="fo-date">
                        <div class="star">                   
                          {/* <p > <span><i class="fa fa-star" aria-hidden="true"></i></span>{quote.review_percentage}</p>  */}
                           <StarRatings
                               rating={Math.round(quote.review_percentage)}
                               numberOfStars={5}
                               name='rating'
                               starDimension="20px"
                               starSpacing="0px"
                               starRatedColor="rgb(242 187 22)"
                           />                         
                        </div> 
                        <span class="added">{quote.summary_of_review}</span>
                      </div> 
                      <p class="description">{quote.detail}</p>
                                                          
                              
                      </div>
                    </div>

                    
                  </div>
                </div>
            ))
           }
                </div>
               
                : "Reviews not available"}
          </div>    
          <div class="bottom-paginatino">
          <TablePagination
  component="div"
  rowsPerPageOptions={[4, 8, 12, 16, 20, 24]}
  page={page}
  count={reviews.length}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
          </div>
    </div>
</div>
</div>
</div>

 </Layout>
)
}

export default Myreviews;