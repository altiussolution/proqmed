import React, { useEffect, useState } from "react";
import { Link, navigate, useStaticQuery, graphql } from "gatsby"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Layout from "../components/layout";
import { Noimage } from "../assets/sample.png";
const MyAddress = () => {
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
            <h4><span><img src="images/orders.png" alt=""/></span><Link to="/orders"><a>MY ORDERS</a> </Link></h4>
                <h4><span><img src="images/account.png" alt=""/></span><Link to="/profile"><a> ACCOUNT SETTINGS</a></Link></h4>
                <ul>
                    <li><Link to="/profile"><a>Profile Information</a></Link></li>
                    <li><Link to="/myAddress"><a>Manage Addresses</a></Link></li>

                </ul>
                <h4><span><img src="images/logout.png" alt=""/></span><a onClick={() => { navigateOnclick('/orders') }}>LOGOUT</a></h4>
            </div>
        </div>

        <div className="col-lg-8 col-md-12 col-sm-12 ">
            <div className="fo-bg-white">
                <div className="top">
                    <div className="header">
                    <h2 className="heading">My Addresses <span>({shippingAddress.length})</span></h2>
                </div>
                <a onClick={() => { navigateOnclick('/Address') }}>+ ADD A NEW ADDRESS</a>
                </div>
                <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12"> 
                    
                      
                          
                           <h6>Default Billing Address</h6>   
                         <span>Name:<a>{defBill['firstname']}</a></span><br></br>
                         <span>Address:<a>{defBill['street']}</a></span>
                         <span>City:<a>{defBill['city']}</a></span><br></br>
                         {/* <span>State:<a>{defBill['region']}</a></span><br></br> */}
                         <a>Ph no:<a>{defBill['telephone']}</a></a>
                   
                       
                       
                    
                   
                   
                </div>
               
                <div className="col-lg-4 col-md-12 col-sm-12">
                <h6>Default Shipping Address</h6>   
                         <span>Name:<a>{defShip['firstname']}</a></span><br></br>
                         <span>Address:<a>{defShip['street']}</a></span>
                         <span>City:<a>{defShip['city']}</a></span><br></br>
                         {/* <span>State:<a>{defBill['region']}</a></span><br></br> */}
                         <a>Ph no:<a>{defShip ['telephone']}</a></a>
                </div>
                </div>
                <div className="fo-addresses">
       <div className="edit-address">
                    {
             shippingAddress.map((add, index) => ( 
                        <div className="info" key={`${index}_add`}>
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
                                  <li><Link to="/Address" state={add}><a><i className="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</a></Link></li>
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