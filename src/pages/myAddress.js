import React, { useEffect, useState } from "react";
import { Link, navigate, useStaticQuery, graphql } from "gatsby"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Layout from "../components/layout";
import { Noimage } from "../assets/sample.png";
import account from "./../assets/account.png"
import logoutt from "./../assets/logout.png"
import order from "./../assets/order.png"
const MyAddress = ({location}) => {
 const [jwt, setJwt] = useState("")
 const [uEmail, setUEmail] = useState();
 const [username, setUsername] = useState();
 const [loader, setLoader] = useState(false);
 const [profilepic,setProfilepic] = useState({});
 const [region, setRegion] = useState([]);
 const [shippingAddress, setShippingAddress] = useState([])
 const [defBill,defaultBilling] = useState([]);
 const [defShip,defaultShipping] = useState([]);
 const admintoken = "nulqmtn1cyo9ko7ip4zbumjqrlk9k825"
 const adding = {city:"add",hello:"world"}
 useEffect(() => {
  setJwt(localStorage.userToken);
  setUEmail(localStorage.email) 
  setUsername(localStorage.user_name)
  getBillAddress();
  getShipAddress();
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


const getBillAddress =() => {
    let arr=[]
    try {
        axios({
            method: "get",
            url: `${process.env.GATSBY_CART_URL_STARCARE}customers/${localStorage.customer_id}/billingAddress/`,
            headers: {
                'Authorization': `Bearer ${admintoken}`
            },
        }).then((response) => {
            if (response.statusText === "OK" && response.status == 200) {
               console.log(response.data) 
               
                defaultBilling(response.data)               
            }
   
        }).catch((err) => {
            console.error(err)
        })
    }
    catch (err) {
        console.error(err)
    }
}

const getShipAddress =()=> {
    try {
        axios({
            method: "get",
            url: `${process.env.GATSBY_CART_URL_STARCARE}customers/${localStorage.customer_id}/shippingAddress/`,
            headers: {
                'Authorization': `Bearer ${admintoken}`
            },
        }).then((response) => {
            if (response.statusText === "OK" && response.status == 200) {
               console.log(response.data)  
               defaultShipping(response.data)                
            }
   
        }).catch((err) => {
            console.error(err)
        })
    }
    catch (err) {
        console.error(err)
    }
}


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
console.log(defBill)
console.log(defShip)
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
  <div className="container-fluid grey">
<div className="container padd">
    <div className="row">
        <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="profile-sec">
            <div className="fo-deflx">
            {profilepic.logo ? <img src={profilepic.logo}/>: <div><img src={Noimage}/></div>}
            </div>
                <div className="name">
                    <span>Hello,</span>
                    <p>{username}</p>
                </div>
            </div>

            <div className="profile-sec details">
            <h4><Link to="/orders"><a><span><img src={order}/></span>MY ORDERS</a> </Link></h4>
            <h4><Link to="/profile"><a><span><img src={account}/></span> ACCOUNT SETTINGS</a></Link></h4>
                <ul>
                    <li><Link to="/profile">Profile Information</Link></li>
                    <li><Link to="/myAddress">Manage Addresses</Link></li>
                    <li><Link to="/myReviews">My reviews</Link></li>

                </ul>
            <h4><a onClick={() => { navigateOnclick('/orders') }}><span><img src={logoutt}/></span>LOGOUT</a></h4>
            </div>
        </div>

        <div className="col-lg-8 col-md-12 col-sm-12 ">
            <div className="fo-bg-white">
                <div className="top">
                    <div className="header">
                    <h2 className="heading">My Addresses <span>({shippingAddress.length})</span></h2>
                </div>
                <Link to="/Address" state={{data:adding,prevPath:location.pathname}}><button className="sample">+ ADD A NEW ADDRESS</button></Link>
                </div>
                <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">                    
                      <div className="fo-aligh">
                          
                           <h6>Default Billing Address</h6>   
                         <p> <span className="bold"> Name : </span> <a>{defBill['firstname']}</a></p>
                         <p> <span className="bold">Address : </span><a>{defBill['street']}</a></p>
                         <p> <span className="bold"> City : </span><a>{defBill['city']}</a></p>
                         {/* <span>State:<a>{defBill['region']}</a></span><br></br> */}
                         <p> <span className="bold"> Ph no : </span> <a>{defBill['telephone']}</a></p>
                   
                         </div>
                       
                    
                   
                   
                </div>
               
                <div className="col-lg-4 col-md-12 col-sm-12">

                <div className="fo-aligh">
                <h6>Default Shipping Address</h6>   
                         <p > <span className="bold"> Name :</span> <a>{defShip['firstname']}</a></p>
                         <p> <span className="bold"> Address : </span><a>{defShip['street']}</a></p>
                         <p> <span className="bold">City : </span><a>{defShip['city']}</a></p>
                         {/* <span>State:<a>{defBill['region']}</a></span><br></br> */}
                         <p> <span className="bold"> Ph no :</span> <a>{defShip ['telephone']}</a></p>
                         </div>
                </div>
                </div>
                <div className="fo-addresses">
       <div className="edit-address">
                    {
             shippingAddress.map((add, index) => ( 
                        <div className="fo-info" key={`${index}_add`}>
                            <div className="left">
                                <p>{add.firstname}{add.lastname} <span>{add.telephone}</span></p>
                                <h6>{add.company},{add.street.join()},{add.city}.</h6>
                            </div>
                            <div className="right">
                                {/* <div className="dropdown address">
                                    <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i className="fa fa-ellipsis-v fa-2x" aria-hidden="true"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                      <li><Link to="/Address" state={add}><a><i className="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</a></Link></li>
                                      <li><a><i className="fa fa-trash-o" aria-hidden="true"></i>
                                        Delete</a></li>
                                      
                                    </ul>
                                  </div> */}
                                  <li><Link to="/Address" state={{data:add,prevPath:location.pathname}} ><a><i className="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</a></Link></li>
                                      <button onClick={() => {deleteAddress(add.entity_id)}}><a ><i className="fa fa-trash-o" aria-hidden="true"></i>
                                        Delete</a></button>
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