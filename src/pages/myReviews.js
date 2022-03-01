import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import {  navigate } from "gatsby";
import 'react-toastify/dist/ReactToastify.css';   
import ImageNotFound from "./../assets/not-found.png"
import { Link } from "gatsby";
import { TablePagination } from '@mui/material';
import { checkLogin } from "./../services/headerServices";
import StarRatings from 'react-star-ratings';
import noimage from "./../assets/noimage.png"
import account from "./../assets/account.png"
import logoutt from "./../assets/logout.png"
import order from "./../assets/order.png"

const Myreviews = () => {
 const [page, setPage] = React.useState(0);
 const [rowsPerPage, setRowsPerPage] = React.useState(4);
 const [reviews, setReviews] = useState([]);
 const [isuserlogged, setIsLogged] = useState(false);
 const [norevs, noreviews] = useState("");
 const [username, setUsername] = useState();
 const [profilepic,setProfilepic] = useState({});
 const [jwt, setJwt] = useState("")

 useEffect(() => {
 setJwt(localStorage.userToken);
 getReviews();
 setUsername(localStorage.user_name);
 setIsLogged(checkLogin());
 axios({
    method: 'get',
    url: `${process.env.GATSBY_CART_URL_STARCARE}profilepic/list/${localStorage.email}`,
    headers: {
      'Authorization': `Bearer ${jwt}`
  }
  }).then((res) => {
    if (res.status == 200) {
    setProfilepic(res.data[0]);
    }
  }).catch((err) => {
    console.error(err);
  })
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
   <div className="container-fluid grey">
<div className="container padd">
    <div className="row">
        <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="profile-sec">
            <div className="fo-deflx">
            {profilepic.logo ? <img src={profilepic.logo}/>: <div><img src={noimage}/></div>}
            </div>
                <div className="name">
                    <span>Hello,</span>
                    <p>{username}</p>
                </div>
            </div>

            <div className="profile-sec details">
                <h4><Link to="/orders"><span><img src={order}/></span>MY ORDERS</Link></h4>
                <h4><Link to="/profile"><span><img src={account}/></span> ACCOUNT SETTINGS</Link></h4>
                <ul>
                    <li><Link to="/profile">Profile Information</Link></li>
                    <li><Link to="/myAddress">Manage Addresses</Link></li>
                    <li className="fo-active-bg"><Link to="/myReviews">My reviews</Link></li>

                </ul>
                <h4><a onClick={() => { logout() }}><span><img src={logoutt}/></span>LOGOUT</a></h4>
            </div>
        </div>

        <div className="col-lg-8 col-md-12 col-sm-12 ">
            <div className="fo-bg-white">
                <div className="top">
                    <div className="header">
                    <h2 className="heading">My Reviews <span>({reviews.length})</span></h2>
                </div>
                
                </div>
                {reviews.length!=0 ?
              
                <div className="review">
                   {
                    reviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((quote, index) => (
                  <div className="sec-top" key={index}>                                     
                      
                        <div className="review-content">  
                        <img src={quote.product_image} onError={e => (e.target.src = ImageNotFound)}/>

                        <div className="det">           
                        <p>{quote.product_name}</p>               
                        
                        <div className="fo-date">
                        <div className="star">                   
                          {/* <p > <span><i className="fa fa-star" aria-hidden="true"></i></span>{quote.review_percentage}</p>  */}
                           <StarRatings
                               rating={Math.round(quote.review_percentage)}
                               numberOfStars={5}
                               name='rating'
                               starDimension="20px"
                               starSpacing="0px"
                               starRatedColor="rgb(255 123 168)"
                           />                         
                        </div> 
                        <span className="added">{quote.summary_of_review}</span>
                      </div> 
                      <p className="description">{quote.detail}</p>
                      </div>                                 
                              
                      </div>
                    
                </div>
            ))
           }
                </div>
               
                : "Reviews not available"}
          </div>    
          <div className="bottom-paginatino">
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