import React, { useEffect, useState } from "react";
import { Link, navigate, useStaticQuery, graphql } from "gatsby"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Layout from "../components/layout";
import { Noimage } from "../assets/sample.png";
const MyAddress = () => {
 const [jwt, setJwt] = useState("")
 const [uEmail, setUEmail] = useState();
 const [loader, setLoader] = useState(false);
 const [profilepic,setProfilepic] = useState({});
 const [region, setRegion] = useState([]);
 const [shippingAddress, setShippingAddress] = useState([])
 useEffect(() => {
  setJwt(localStorage.userToken);
  setUEmail(localStorage.email)
  getUserAddress();  
  const fetchRegion = async () => {
      const res = await fetch(
          `${process.env.GATSBY_CART_URL_STARCARE}regions`
      );

      const json = await res.json();
      await setRegion(json);
  };

  fetchRegion();
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
}, []);

const getUserAddress = () => { 
 setLoader(true);
 let shipAdd = [];
 try {
     axios({
         method: "get",
         url: `${process.env.GATSBY_CART_URL_STARCARE}customeraddress/${localStorage.getItem('email')}`,
         headers: {
             'Authorization': `Bearer ${jwt}`
         },
     }).then((response) => {
         if (response.statusText === "OK" && response.status == 200) {
             response.data.map(async (val, index) => {
                 await shipAdd.push(val.address);
                 await setShippingAddress(shipAdd);
                 setLoader(false);
                 console.log(shippingAddress)
             })                   
             setLoader(false);
         }

     }).catch((err) => {
         console.error(err)
     })
 }
 catch (err) {
     console.error(err)
 }
}
const navigateOnclick = (value) => {

   navigate(value)
 
}
const deleteAddress = (id) => {
            if (window.confirm("Are you sure want to delete this Address?")) {
            try {
                axios({
                    method: "get",
                    url: `${process.env.GATSBY_CART_URL_STARCARE}addressdelete/${id}`,
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    }
                }).then((response) => {
                        
                    if (response.statusText === "OK" && response.status == 200) {
                        // shippingAddress.splice(selAddIndex,1);
                        toast.success('Address deleted Sucessfully'); 
                        getUserAddress();
                    }

                }).catch((err) => {
                    toast.error('Sn error occured');
                })
            }
        
            catch (err) {
                console.error(err)
            }
        }
        
    }
    const listAddress = () => {

     return <div className="shipping_address_items">
         {
             shippingAddress.map((add, index) => (
                 <div key={`${index}_add`}>
                     <address>
                         <span>{add.firstname}</span> <span>{add.lastname}</span><br></br>
                         <span>{add.company}</span><br></br>
                         {add.street.join()}
                         <span>{add.city}</span><br></br>
                         <span>{add.region}</span><br></br>
                         <a href={`tel:${add.telephone}`}>{add.telephone}</a>
                     </address>
                     {/* <button className="action action_btn btn btn_gray" onClick={() => setIndex(index)}>Ship Here</button> */}

                     <div className="action_sec">
                         <button className="action action_btn btn btn_gray" onClick={() => {deleteAddress(add.entity_id)}}>Delete</button>
                         <Link to="/Address" state={add}><button className="action action_btn btn btn_gray ml-1">Edit</button></Link>
                     </div>

                 </div>
             ))
         }
     </div>

 }
 return (
  <Layout>
  <div class="container-fluid grey">
<div class="container">
    <div class="row">
        <div class="col-lg-4 col-md-12 col-sm-12">
            <div class="profile-sec">
            {profilepic.logo ? <img src={profilepic.logo}/>: <div><img src={Noimage}/></div>}
                <div class="name">
                    <span>Hello,</span>
                    <p>{localStorage.user_name}</p>
                </div>
            </div>

            <div class="profile-sec details">
                <h4><span><img src="images/orders.png" alt=""/></span><a href="#">MY ORDERS</a> </h4>
                <h4><span><img src="images/account.png" alt=""/></span><a href="#"> ACCOUNT SETTINGS</a></h4>
                <ul>
                    <li><a href="#">Profile Information</a></li>
                    <li><a href="#">Manage Addresses</a></li>
                    <li><a href="#">My reviews</a></li>
                </ul>
                <h4><span><img src="images/logout.png" alt=""/></span><a href="#">LOGOUT</a></h4>
            </div>
        </div>

        <div class="col-lg-8 col-md-12 col-sm-12 ">
            <div class="fo-bg-white">
                <div class="top">
                    <div class="header">
                    <h2 class="heading">My Addresses <span>({shippingAddress.length})</span></h2>
                </div>
                <a onClick={() => { navigateOnclick('/Address') }}>+ ADD A NEW ADDRESS</a>
                </div>
                <div class="fo-addresses">
       <div class="edit-address">
                    {
             shippingAddress.map((add, index) => ( 
                        <div class="info" key={`${index}_add`}>
                            <div class="left">
                                <label>Billing Address</label>
                                <p>{add.firstname}{add.lastname} <span>{add.telephone}</span></p>
                                <h6>{add.company},{add.street.join()},{add.city}.</h6>
                            </div>
                            <div class="right">
                                <div class="dropdown address">
                                    <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-ellipsis-v fa-2x" aria-hidden="true"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                      <li><a href="#"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</a></li>
                                      <li><a href="#"><i class="fa fa-trash-o" aria-hidden="true"></i>
                                        Delete</a></li>
                                      
                                    </ul>
                                  </div>
                            </div>
                  </div>
                        )) }
                    </div>
                </div>

                
          </div>    
          
    </div>
</div>
</div>
</div>
</Layout>
 )
}
export default MyAddress