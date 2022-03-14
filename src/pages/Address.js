import React, { useEffect, useState } from "react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { Link, navigate, useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout";
import { ToastContainer, toast } from 'react-toastify';
import Multiselect from 'multiselect-react-dropdown';
import Select from 'react-select';
import noimage  from "./../assets/noimage.png"
import account from "./../assets/account.png"
import logoutt from "./../assets/logout.png"
import order from "./../assets/order.png"
const Address = ({location,data:product}) => {
 const { register, handleSubmit, errors, control } = useForm();
 const [jwt, setJwt] = useState("")
 const [uEmail, setUEmail] = useState();
 const [cusID, setCusid] = useState();
 const [username, setUsername] = useState();
 const [state, setState] = useState([])
 const [loader, setLoader] = useState(false);
 const [manilam,stateoff] = useState(false);
 const [txt,text] = useState(false);
 const [profilepic,setProfilepic] = useState({});
 const [region, setRegion] = useState([]);
 const [edit, editdata] = useState([]);
 const [editadd,editAddress] = useState(false);
 const [add,addAddress] = useState(false);
 const [India,defaultcountry] = useState({});
 const admintoken = "nulqmtn1cyo9ko7ip4zbumjqrlk9k825"
 const [ship,Shippi] = useState(false);
 const [bill,Billi] = useState(false);
 const [shipadd,Shippiadd] = useState(false);
 const [billadd,Billiadd] = useState(false);
const [Tamilan,Defaulti] = useState({});
const [checkbox,Cbox] = useState(); 
const [checkbox2,Cbox2] = useState();
useEffect(() => {
 setJwt(localStorage.userToken);
 setUsername(localStorage.user_name)
 setRegion(JSON.parse(localStorage.Regions))
 setCusid(localStorage.customer_id)
 setUEmail(localStorage.email)
 console.log(location)
  if(location.state.data['city']=="add"){
     addAddress(true)
     console.log(location)
 }else {
    const ef= {country_id:location.state.data['country_id'],label:location.state.data['region'],value:location.state.data['region_id']}
     editdata(location.state.data)
     Shippi(location.state.data['default_shipping'])
     Billi(location.state.data['default_billing'])
     Defaulti(ef)
     editAddress(true)
     console.log(location)
  } 
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
assignStats();
}, []);

const assignStats = () => {
    let arr = JSON.parse(localStorage.Regions)
    if(location.state.data['city'] =="add"){
        let obj = arr.find(o => o.value === 'IN');
        setRegion(arr)
        console.log('gokul',obj)
        defaultcountry(obj)
        setState(obj['states'])
        stateoff(true)
        text(false)
    
    }else {
      
        let obj = arr.find(o => o.value === location.state.data['country_id']);
        console.log(obj)
           defaultcountry(obj)
    if(obj['states']){
        setState(obj['states'])
        stateoff(true)
        text(false)
    }   else {
        setRegion(arr)
        stateoff(false)
        text(true)
        // defaultcountry(obj)
    }    
    }
}
const handleChange = (event) => {
    const re = /^[0-9\b]+$/;
    if (!re.test(event.target.value)) {
        event.target.value = ""
    }
}
const onSelectCats1 = (event) => {
    console.log(event)
    defaultcountry(event)
    setState([])
        if (event['states']) {
            setState(event['states'])
            stateoff(true)
            text(false)
        }else {
             stateoff(false)
             text(true)
        }
        return;
}
const onSelectStates1 = (states) => {
    console.log(India)
Defaulti(states)
}

    const filterData =(val,datas)=> {   
     if(datas=="billing" && val.target.checked){
      Billi(true)
     }else if(datas=="shipping" && val.target.checked){
       Shippi(true)
     }else if(datas=="billing" && val.target.unchecked){
        Shippi(false)
     }else if(datas=="shipping" && val.target.unchecked){
        Billi(false)
     }
    }

    const Cancelling = () => {
        console.log(location.state.prevPath)
        

        if(location.state.prevPath=="/myAddress/" || location.state.prevPath=="/myAddress"){
            navigate('/myAddress/')
        }else {
            navigate('/checkout/')
        }
    }

    const filterData1 =(val,datas)=> {
        if(datas=="billing" && val.target.checked){
         Billiadd(true)
        }else if(datas=="shipping" && val.target.checked){
          Shippiadd(true)
        }else if(datas=="billing" && val.target.unchecked){
          Shippiadd(false)     
        }else if(datas=="shipping" && val.target.unchecked){
          Billiadd(false)
        }
       }
const onSubmit = userAddresses => {
let updateAddress = {
    "address": { 
    "id":location.state.data['entity_id'],
      "customer_id": cusID,
      "defaultShipping": ship,
      "defaultBilling" : bill,
       "region": {
          "region_id": Tamilan['value'], //563
          "region": Tamilan['label'],     //TamilNadu
           //12
      },
      "street": [userAddresses.street_1.trim()],
      "postcode": userAddresses.postcode,
      "city": userAddresses.user_city,
      "firstname": userAddresses.name,
      "lastname": userAddresses.lname,   
      "telephone": userAddresses.telephone,
      "countryId": India['value'] //IN
    }
  }
    try {
        axios({
            method: "post",
            url: `${process.env.GATSBY_CART_URL_STARCARE}addresses/`,
            headers: {
                'Authorization': `Bearer ${admintoken}`
            },
            data: updateAddress
        }).then((response) => {
            console.log("Add Address", response)
            if (response.statusText === "OK" && response.status == 200) {
                console.log(location.state.prevPath)
                //  navigate('/myAddress/')

                 if(location.state.prevPath=="/myAddress/" || location.state.prevPath=="/myAddress"){
                    navigate('/myAddress/')
                }else {
                    navigate('/checkout/')
                }
                setLoader(false);
                toast.success('Edit Address Successfully');
                
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


const onSubmitadd = userAddresses => {
    let updateAddress = {
        "address": { 
          "customer_id": cusID,
          "defaultShipping": shipadd,
          "defaultBilling" : billadd,
           "region": {
              "region": Tamilan['label'],     //TamilNadu
              "region_id": Tamilan['value']   //12
          },
          "street": [userAddresses.street_1.trim()],
          "postcode": userAddresses.postcode,
          "city": userAddresses.user_city,
          "firstname": userAddresses.name,
          "lastname": userAddresses.lname,   
          "telephone": userAddresses.telephone,
          "countryId": India['value']//IN
        }
      }
        try {
            axios({
                method: "post",
                url: `${process.env.GATSBY_CART_URL_STARCARE}addresses/`,
                headers: {
                    'Authorization': `Bearer ${admintoken}`
                },
                data: updateAddress
            }).then((response) => {
                console.log("Add Address", response)
                if (response.statusText === "OK" && response.status == 200) {
                    // navigate('/myAddress/')
                    if(location.state.prevPath=="/checkout/" || location.state.prevPath=="/checkout"){
                        navigate('/checkout/')
                    }else {
                        navigate('/myAddress/')
                    }
                    setLoader(false);
                    toast.success('Add Address Successfully');
                    
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

    
return (
  <Layout {...location} propWhatever={{location}}>
  <div class="container-fluid grey">
  <div class="container padd">
      <div class="row">
          <div class="col-lg-4 col-md-12 col-sm-12">
              <div class="profile-sec">
              <div className="fo-deflx">
              {profilepic.logo ? <img src={profilepic.logo}/>: <div><img src={noimage}/></div>}                  </div>
                  <div class="name">
                      <span>Hello</span>
                      <p>{username}</p> 
                  </div>
              </div>
  
              <div class="profile-sec details">
                
                  <h4><Link to="/orders"><a><span><img src={order}/></span>MY ORDERS</a> </Link></h4>
                <h4><span><img src={account}/></span><Link to="/profile"><a> ACCOUNT SETTINGS</a></Link></h4>
                <ul>
                    <li><Link to="/profile">Profile Information</Link></li>
                    <li><Link to="/myAddress">Manage Addresses</Link></li>
                    <li><Link to="/myReviews">My reviews</Link></li>

                </ul>
                  <h4><span><img src={logoutt}/></span><a href="#">LOGOUT</a></h4>
              </div>
          </div>
  
          <div class="col-lg-8 col-md-12 col-sm-12 ">
              <div class="fo-bg-white">
                  <div class="top">
                      <div class="header">
                      <h2 class="heading">Manage Address</h2>
                  </div>
                  
                  
                  </div>
  
                 {editadd && <div class="address-form" {...location}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                      <div class="fo-bg-slice">
                          <h6>Edit Address</h6>
                          <div class="row">
                              <div class="col-lg-6 col-md-12 col-sm-12">
                                  <div>
                                  <input type="text" className="form-control" placeholder="First Name *" name="name" id="name" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(edit ? edit['firstname'] : "")}/>
                                         {errors.name && errors.name.type === 'required' && <span className="error_label">First Name is required</span>}</div>   
                                         <div>
                                  <input type="text" className="form-control" placeholder="Last Name *" name="lname" id="lname" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(edit ? edit['lastname'] : "")}/>
                                         {errors.lname && errors.lname.type === 'required' && <span className="error_label">Last Name is required</span>}</div>       
                                         <div>                            
                                  <input type="text" className="form-control" placeholder="Pincode *" name="postcode" id="postcode" onChange={handleChange} ref={register({
                                                                                required: true,
                                                                            })} 
                                                                            maxLength="6" defaultValue={(edit ? edit['postcode'] : "")}/>
                                               {errors.postcode && errors.postcode.type === 'required' && <span className="error_label">Pincode required</span>}
                                                                            {errors.postcode && errors.postcode.type === 'minLength' && <span className="error_label">Enter valid Pincode</span>}                              
                                                                            </div>  

                                 <div> <Select
                                    options={region}
                                    onChange={onSelectCats1}
                                    value={India}
                                    placeholder="Select Country *"
                                     /></div> 
                              </div>
  
                              <div class="col-lg-6 col-md-12 col-sm-12">
                                  <div>
                                  <input className="form-control" name="telephone" id="telephone" placeholder="Mobile Number *" type="text" onChange={handleChange} 
                                                                            maxLength="10"
                                                                            ref={register({
                                                                                required: true,
                                                                            })} defaultValue={(edit ? edit['telephone'] : "")}/>
                                                                            {errors.telephone && errors.telephone.type === 'required' && <span className="error_label">Mobile Number required</span>}
                                                                            {errors.telephone && errors.telephone.type === 'minLength' && <span className="error_label">Enter Valid Mobile Number</span>}</div>
                                                                            <div>
                                                                            <input className="form-control" name="user_city" id="user_city" placeholder="City *" type="text" ref={register({
                                                                                required: true
                                                                            })}  defaultValue={(edit ? edit['city'] : "")}/>
                                                                            {errors.user_city && errors.user_city.type === 'required' && <span className="error_label">City is required</span>}</div> 
                                {manilam &&  <div> 
                                    <Controller
                                      control={control} 
                                      rules={{ required: true }} 
                                      name="user_state"
                                      render={({}) => (
                                    <Select
                                    options={state}
                                    onChange={onSelectStates1}
                                    value={Tamilan}
                                    placeholder="Select State *"
                                     />
                                     )}
                                    />
                                  {errors.user_state && errors.user_state.type === 'required' && <span className="error_label">State required</span>}
                                  </div>}
                                   { txt && <div>
                                                                            <input className="form-control" name="user_state" id="user_state" placeholder="State" type="text"  />
                                                                            {errors.user_state && errors.user_state.type === 'required' && <span className="error_label">State is required</span>}</div> }
                                  
                              </div>
  
                              <div class="col-lg-12 col-md-12 col-sm-12">
                              <input className="form-control" name="street_1" id="street_1" placeholder="Address " type="text" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(edit ? edit['street'] : "")}/>
                                                                            {errors.street_1 && errors.street_1.type === 'required' && <span className="error_label">Address required</span>}
                              </div>
                          </div>
                          <h6> Address Type </h6>
                          <div class="billing-stat">
                          <div className="form-check">
                        <input type="checkbox" className="form-check-input" name="shipping" id="shipping" ref={register({
                                                                                
                                                                            })} onChange={e => { filterData(e,'shipping') }}   defaultChecked={(edit ? edit['default_shipping'] : "")} />
                        <label className="form-check-label" htmlFor="shipping">Default Shipping</label>
                      </div>
                      {/* checked={edit ? edit['default_shipping'] : "false"} checked={edit ? edit['default_billing'] : "false"}*/}
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" name="billing" id="billing" ref={register({
                                                                               
                                                                            })}  onChange={e => { filterData(e,'billing') }}  defaultChecked={(edit ? edit['default_billing'] : "")} />
                        <label className="form-check-label" htmlFor="billing">Default Billing</label>
                      </div>
                      {/* required: true */}
                          </div>
                          <div class="buttons">                            
                              <button class="btn btn-danger square" type="submit">SAVE</button>
                             <button type="button" class="btn btn" onClick={() => Cancelling()}>CANCEL</button>
                          </div>
                      </div>
                      </form>
                     
                  </div> }
                  {add && <div class="address-form">
                      <form onSubmit={handleSubmit(onSubmitadd)}>
                      <div class="fo-bg-slice">
                          <h6>Add Address</h6>
                          <div class="row">
                              <div class="col-lg-6 col-md-12 col-sm-12">
                                  <div>
                                  <input type="text" className="form-control" placeholder="First Name *" name="name" id="name" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(edit ? edit['firstname'] : "")}/>
                                         {errors.name && errors.name.type === 'required' && <span className="error_label">First Name is required</span>}</div>   
                                         <div>
                                  <input type="text" className="form-control" placeholder="Last Name *" name="lname" id="lname" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(edit ? edit['lastname'] : "")}/>
                                         {errors.lname && errors.lname.type === 'required' && <span className="error_label">Last Name is required</span>}</div>       
                                         <div>                            
                                  <input type="text" className="form-control" placeholder="Pincode *" name="postcode" id="postcode" onChange={handleChange} ref={register({
                                                                                required: true,
                                                                            })} 
                                                                            maxLength="6" defaultValue={(edit ? edit['postcode'] : "")}/>
                                               {errors.postcode && errors.postcode.type === 'required' && <span className="error_label">Pincode required</span>}
                                                                            {errors.postcode && errors.postcode.type === 'minLength' && <span className="error_label">Enter valid Pincode</span>}                              
                                                                            </div>  
                                                                         
                                 <div> <Select
                                    options={region}
                                    onChange={onSelectCats1}
                                    value={India}
                                    placeholder="Select Country *"
                                     /></div> 
                              </div>
  
                              <div class="col-lg-6 col-md-12 col-sm-12">
                                  <div>
                                  <input className="form-control" name="telephone" id="telephone" placeholder="Mobile Number *" type="text" onChange={handleChange} 
                                                                            maxLength="10"
                                                                            ref={register({
                                                                                required: true,
                                                                            })} defaultValue={(edit ? edit['telephone'] : "")}/>
                                                                            {errors.telephone && errors.telephone.type === 'required' && <span className="error_label">Mobile Number required</span>}
                                                                            {errors.telephone && errors.telephone.type === 'minLength' && <span className="error_label">Enter Valid Mobile Number</span>}</div>
                                                                            <div>
                                                                            <input className="form-control" name="user_city" id="user_city" placeholder="City *" type="text" ref={register({
                                                                                required: true
                                                                            })}  defaultValue={(edit ? edit['city'] : "")}/>
                                                                            {errors.user_city && errors.user_city.type === 'required' && <span className="error_label">City is required</span>}</div> 
                                {manilam &&  <div>
                                    <Controller
                                    control={control} 
                                    rules={{ required: true }} 
                                    name="user_state"
                                    render={({}) => (
                                     <Select
                                    options={state}
                                    onChange={onSelectStates1}
                                    placeholder="Select State *"
                                     />
                                     )}
                                    />
                                  {errors.user_state && errors.user_state.type === 'required' && <span className="error_label">State required</span>}
                                  </div> }
                                  { txt && <div>
                                                                            <input className="form-control" name="user_state" id="user_state" placeholder="State" type="text"  />
                                                                            {errors.user_state && errors.user_state.type === 'required' && <span className="error_label">State is required</span>}</div> }
                                  
                              </div>
  
                              <div class="col-lg-12 col-md-12 col-sm-12">
                              <input className="form-control" name="street_1" id="street_1" placeholder="Address *" type="text" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(edit ? edit['street'] : "")}/>
                                                                            {errors.street_1 && errors.street_1.type === 'required' && <span className="error_label">Address required</span>}
                              </div>
                          </div>
                          <h6> Address Type </h6>
                          <div class="billing-stat">
                          <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="shipping" name="shipping" ref={register({
                                                                                
                                                                            })} onChange={e => { filterData1(e,'shipping') }}/>
                        <label className="form-check-label" htmlFor="shipping">Default Shipping</label>
                      </div>
  
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="billing" name="billing" ref={register({
                                                                                
                                                                            })}  onChange={e => { filterData1(e,'billing') }} />
                        <label className="form-check-label" htmlFor="billing">Default Billing</label>
                      </div>
                              
                          </div>
                          <div class="buttons">                            
                              <button class="btn btn-danger square" type="submit">SAVE</button>
                              <button type="button" class="btn btn" onClick={() => Cancelling()}>CANCEL</button>
                          </div>
                      </div>
                      </form>
                     
                  </div> }
                  
            </div>    
            
      </div>
  </div>
  </div>
  </div>
  </Layout>
)
}

export default Address