import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, navigate, useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout";
import { ToastContainer, toast } from 'react-toastify';
const Address = ({location}) => {
    const { register, handleSubmit, errors } = useForm();
  const [jwt, setJwt] = useState("")
 const [uEmail, setUEmail] = useState();
 const [username, setUsername] = useState();
 const [loader, setLoader] = useState(false);
 const [profilepic,setProfilepic] = useState({});
 const [region, setRegion] = useState([]);
 const [edit, editdata] = useState([]);
useEffect(() => {
 setJwt(localStorage.userToken);
 setUsername(localStorage.user_name)
 setUEmail(localStorage.email)
 if(location.state['city']){
    editdata(location.state)
 }

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
const handleChange = (event) => {
    const re = /^[0-9\b]+$/;
    if (!re.test(event.target.value)) {
        event.target.value = ""
    }
}
const onSubmit = userAddresses => {
    let index = 0;
    let shippingAddress = [];


if(JSON.parse(userAddresses.user_state).value === "")
    {
        return toast.error('Select State or Province'); 
    }
else{

shippingAddress.push(
            {

                "firstname": userAddresses.firstname.trim(),
                "lastname": userAddresses.lastname.trim(),
                "company": userAddresses.company.trim(),
                "street": [userAddresses.street_1.trim()],
                "city": userAddresses.user_city.trim(),
                "region_id": JSON.parse(userAddresses.user_state).value,
                "region": JSON.parse(userAddresses.user_state).title,
                "postcode": userAddresses.postcode.trim(),
                "country_id": JSON.parse(userAddresses.countryId).value,
                "telephone": userAddresses.telephone.trim()
            }
        )
    

    let userAddVal = {
        "customer":
        {
            "email": userAddresses.email.trim(),
            "firstname": userAddresses.firstname.trim(),
            "lastname": userAddresses.lastname.trim(),
            "websiteId": 1,
            "addresses": shippingAddress
        }
    }

    try {
        axios({
            method: "put",
            url: `${process.env.GATSBY_CART_URL_STARCARE}customers/me`,
            headers: {
                'Authorization': `Bearer ${jwt}`
            },
            data: userAddVal
        }).then((response) => {
            console.log("Add Address", response)
            if (response.statusText === "OK" && response.status == 200) {
                
              
                setLoader(false);
                
            }

        }).catch((err) => {
            toast.error('error occured');
           
            console.error(err)
        })
    }
    catch (err) {
        toast.error('error occured');
     
        console.error(err)
    }
}
}

return (
  <Layout>
  <div class="container-fluid grey">
  <div class="container padd">
      <div class="row">
          <div class="col-lg-4 col-md-12 col-sm-12">
              <div class="profile-sec">
              <div className="fo-deflx">
                  <img src="images/sample.png" alt=""/>
                  </div>
                  <div class="name">
                      <span>Hello</span>
                      <p>{username}</p>
                  </div>
              </div>
  
              <div class="profile-sec details">
                
                  <h4><span><img src="images/orders.png" alt=""/></span><Link to="/orders"><a>MY ORDERS</a> </Link></h4>
                <h4><span><img src="images/account.png" alt=""/></span><Link to="/profile"><a> ACCOUNT SETTINGS</a></Link></h4>
                <ul>
                    <li><Link to="/profile"><a>Profile Information</a></Link></li>
                    <li><Link to="/myAddress"><a>Manage Addresses</a></Link></li>
                    <li><Link to="/myReviews"><a>My reviews</a></Link></li>

                </ul>
                  <h4><span><img src="images/logout.png" alt=""/></span><a href="#">LOGOUT</a></h4>
              </div>
          </div>
  
          <div class="col-lg-8 col-md-12 col-sm-12 ">
              <div class="fo-bg-white">
                  <div class="top">
                      <div class="header">
                      <h2 class="heading">Manage Addresses</h2>
                  </div>
                  
                  
                  </div>
  
                  <div class="address-form">
                      <form onSubmit={handleSubmit(onSubmit)}>
                      <div class="fo-bg-slice">
                          <h6>Add Address</h6>
                          <div class="row">
                              <div class="col-lg-6 col-md-12 col-sm-12">
                                  <div>
                                  <input type="text" className="form-control" placeholder="Name" name="name" id="name" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(edit ? edit['firstname'] : "")}/>
                                         {errors.firstname && errors.name.type === 'required' && <span className="error_label">Name is required</span>}</div>     
                                         <div>                            
                                  <input type="text" className="form-control" placeholder="Pincode" name="postcode" id="postcode" onChange={handleChange} ref={register({
                                                                                required: true,
                                                                            })} 
                                                                            maxLength="6" defaultValue={(edit ? edit['postcode'] : "")}/>
                                               {errors.postcode && errors.postcode.type === 'required' && <span className="error_label">Postcode required</span>}
                                                                            {errors.postcode && errors.postcode.type === 'minLength' && <span className="error_label">Enter valid Postcode</span>}                              
                                                                            </div>  
                                                                            <div>
                                                                            <input className="form-control" name="user_city" id="user_city" placeholder="City" type="text" ref={register({
                                                                                required: true
                                                                            })}  defaultValue={(edit ? edit['city'] : "")}/>
                                                                            {errors.user_city && errors.user_city.type === 'required' && <span className="error_label">City is required</span>}</div> 
                                 <div><input type="text" className="form-control" placeholder="Landmark (Optional)" maxLength="20"/></div> 
                              </div>
  
                              <div class="col-lg-6 col-md-12 col-sm-12">
                                  <div>
                                  <input className="form-control" name="telephone" id="telephone" placeholder="Mobile Number" type="text" onChange={handleChange} 
                                                                            maxLength="10"
                                                                            ref={register({
                                                                                required: true,
                                                                            })} defaultValue={(edit ? edit['telephone'] : "")}/>
                                                                            {errors.telephone && errors.telephone.type === 'required' && <span className="error_label">Phone required</span>}
                                                                            {errors.telephone && errors.telephone.type === 'minLength' && <span className="error_label">Enter Valid Phone Number</span>}</div>
                                  <div> <input type="text" className="form-control" placeholder="Locality" name="locality" id="locality"  ref={register({
                                                                                required: true,
                                                                            })} maxLength="20"/></div>
                                  <div>  <input type="text" className="form-control" placeholder="State/Province" name="user_state" id="user_state"  ref={register({
                                                                                required: true,
                                                                            })} maxLength="20" defaultValue={(edit ? edit['region'] : "")}/>
                                  {errors.user_state && errors.user_state.type === 'required' && <span className="error_label">State required</span>}
                                  </div>
                                  <div>  <input type="text" className="form-control" placeholder="Alternate Phone (Optional)" name="altertelephone" id="altertelephone" onChange={handleChange} maxLength="10"/></div>
                              </div>
  
                              <div class="col-lg-12 col-md-12 col-sm-12">
                              <input className="form-control" name="street_1" id="street_1" placeholder="Address" type="text" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(edit ? edit['street'] : "")}/>
                                                                            {errors.street_1 && errors.street_1.type === 'required' && <span className="error_label">Address required</span>}
                              </div>
                          </div>
                          <h6> Address Type</h6>
                          <div class="billing-stat">
                              <div class="form-check disc">
                                  <input class="form-check-input" type="checkbox" id="billing" name="billing" />
                                  <p class="form-check-label">Billing </p>
                                </div>
  
                                <div class="form-check disc">
                                  <input class="form-check-input" type="checkbox" id="shipping" name="shipping"/>
                                  <p class="form-check-label">Shipping </p>
                                </div>
                              
                          </div>
                          <div class="buttons">                            
                              <button class="btn btn-danger square" type="submit">SAVE</button>
                              <Link to="/myAddress"><button type="button" class="btn btn" >CANCEL</button></Link>
                          </div>
                      </div>
                      </form>
                     
                  </div>
  
                  
            </div>    
            
      </div>
  </div>
  </div>
  </div>
  </Layout>
)
}

export default Address