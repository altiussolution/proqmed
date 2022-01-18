import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { navigate, useStaticQuery, Link } from "gatsby";
import Switch from "react-switch";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';

import Multiselect from 'multiselect-react-dropdown';
const Managesub = ({location}) => {
 const [clip,categoryda] = useState([]);
 const [statys, statusIn] = useState(false);
 const [statysedit, statusInedit] = useState(false);
 const { register, handleSubmit, errors } = useForm();
 const [quoteForm, setQuoteForm ] = useState();
 const [quoteedit, setQuotePopupedit] = useState(false);
 const [quoteadd, setQuotePopupadd] = useState(false);
 const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShown2, setPasswordShown2] = useState(false);
 const [customerId, setCustomerId] = useState("");
 const [quoteConversations, setQuotesConversations] = useState([])
 const [names, setNames] = useState([]);
 const [catie, setCats] = useState([]);
 const [namesedit, setNamesedit] = useState([]);
 const [catieedit, setCatsedit] = useState([]);
 const data = useStaticQuery(graphql`
 {
   allCategory {
     edges {
       node {
         id
         name
         grand_child {
           id
           is_active
           name
         }
       }
     }
   }
   site {
     siteMetadata {
       title
     }
   }
 }
`)

 useEffect(() => {
  setCustomerId(localStorage.customer_id)
  rendercategory();
  getConversation();
  console.log(location.state['subuser_firstname'])
 if(location.state['subuser_firstname']){
  console.log(location.state.subuser_id)
  setQuoteForm(location.state)
  setQuotePopupedit(true)
  setCatsedit(location.state['category_permissions'])
  setNamesedit(location.state['allowed_permissions'])
  statusInedit(location.state['subuser_status'])
 }else {
  setQuotePopupadd(true)
 }

}, []);
const rendercategory = () =>{
 const list = [];
 const lis = [];
 const lott = [];
 let allCategory = data.allCategory.edges;
   list.push(allCategory);
 list.map((el,index)=>(
      lis.push(el)
))
for(let i=0 ;i < lis[0].length;i++){
 lott.push(lis[0][i].node)
}
categoryda(lott)
}

const getConversation = (id) => {
 try {
     axios({
         method: "get",
         url: `${process.env.GATSBY_CART_URL_STARCARE}subuser/subuserpermissions`,
     }).then((res) => {
         if (res.statusText === "OK" && res.status == 200) {
             console.error(res)
             setQuotesConversations(res.data)
             
             // {
             //     quoteConversations.map((conv, index) => (
             //         savedperms(conv)
                     
             //     ))}
             // console.log(perms)    
         }

     }).catch((err) => {
         console.error(err)
     })
 } catch (err) {
     console.error(err)
 }
}

const onSubmitQuote = quoteDetails => {
    
 let quoteData = [
     {
         "subuser_id": quoteForm['subuser_id'],
         "role_name": quoteForm['role_name'],
         "firstname": quoteDetails['firstname'],
         "lastname": quoteDetails['lastname'],
         "email": quoteDetails['email'],
         "password": quoteDetails['password'],
         "allowedpermissions": namesedit,
         "categorypermissions": catieedit,
         "status" : statysedit

     }
 ]

 try {
     axios({
         method: 'put',
         url: `${process.env.GATSBY_CART_URL_STARCARE}subuser/subuserupdate`,
         data: quoteData,
     })
         .then(function (response) {
             toast.success("SubUser Updated sucessfully")
             navigate('/userManage')
         })
         .catch(function (response) {
             toast.error('An error occured please contact admin')
             navigate('/userManage')
         });

 } catch (err) {
     console.error(`An error occured ${err}`)
     navigate('/userManage')

 }
};
const handleChange = nextChecked => {
 statusIn(nextChecked);
 
};
const handleChange1 = nextChecked => {
   console.log(nextChecked)
  statusInedit(nextChecked);
 
};
let onSelectNames = name => {
 setNames(name);
};

let onRemoveNames = name => {
 setNames(name);
};
let onSelectCats = name => {
 setCats(name);
};

let onRemoveCats = name => {
 setCats(name);
};

//for edit 
let onSelectNames1 = name => {
    setNamesedit(name);
   };
   
   let onRemoveNames1 = name => {
    setNamesedit(name);
   };
   let onSelectCats1 = name => {
    setCatsedit(name);
   };
   
   let onRemoveCats1 = name => {
    setCatsedit(name);
   };
const onSubmitQuoteadd = quoteDetails => {
    
 let quoteData = [
 
     
     {
         "role_name": quoteDetails['rolename'],
         "firstname": quoteDetails['firstname'],
         "lastname": quoteDetails['lastname'],
         "email": quoteDetails['email'],
         "parent_customer_id": 39,
         "password": quoteDetails['password'],
         "allowedpermissions": names,
         "categorypermissions": catie,
         "status" : statys
     }
 ]

 try {
     axios({
         method: 'post',
         url: `${process.env.GATSBY_CART_URL_STARCARE}subuser/subusercreate`,
         data: quoteData,
     })
         .then(function (response) {
             toast.success('SubUser Created sucessfully')
             navigate('/userManage')
         })
         .catch(function (response) {
             toast.error('An error occured please contact admin')
             navigate('/userManage')
         });

 } catch (err) {
     console.error(`An error occured ${err}`)
     navigate('/userManage')
 }
};

const togglePasswordVisiblity = () => {
 setPasswordShown(passwordShown ? false : true);
};

const togglePasswordVisiblity2 = () => {
 setPasswordShown2(passwordShown2 ? false : true);
};

return (
 <Layout>
   <div class="container-fluid grey">
<div class="container padd">
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
                <h4><span><img src="images/orders.png" alt=""/></span><a href="#">MY ORDERS</a> </h4>
                <h4><span><img src="images/account.png" alt=""/></span><a href="#"> ACCOUNT SETTINGS</a></h4>
                <ul>
                    <li><a href="#">Profile Information</a></li>
                    <li><a href="#">Manage Addresses</a></li>
                   
                </ul>
                <h4><span><img src="images/users.png" alt=""/></span><a href="#"> USER MANAGEMENT</a></h4>
                <h4><span><img src="images/logout.png" alt=""/></span><a href="#">LOGOUT</a></h4>
            </div>
        </div>

        {quoteadd &&  <div class="col-lg-8 col-md-12 col-sm-12 ">
            <div class="fo-bg-white">
                <div class="top">
                    <div class="header">
                    <h2 class="heading">Create Sub User</h2>
                </div>

                
               
                </div>
                <div class="form-sec c-su">
                 <form onSubmit={handleSubmit(onSubmitQuoteadd)}>
                    <div class="row">
                        <div class="col-lg-6 col-md-12 col-sm-12">
                            
                                <div class="form-group">
                                 
                                  <input type="text" class="form-control" id="usr" placeholder="First Name" name="firstname"  type="text" ref={register({
                                        required: true
                                    })}/>
                                     {errors.firstname && errors.firstname.type === 'required' && <span className="error">First Name is required</span>}
                                </div>
                                
        
                                <div class="form-group">
                                    
                                    <input type="text" class="form-control" id="usr" placeholder="Email" type="text" name="email"  ref={register({
                                        required: true
                                    })}/>
                                    {errors.email && errors.email.type === 'required' && <span className="error">Email is required</span>}
                                  </div>
                                  <div class="form-group">
                                    
                                    <input type="text" class="form-control" id="usr" type="text" name="rolename" placeholder="RoleName" ref={register({
                                        required: true
                                    })}/>
                                    {errors.rolename && errors.rolename.type === 'required' && <span className="error">RoleName is required</span>}
                                  </div>
                                 <div class="form-group">
                                  <Multiselect
                                            options={quoteConversations}
                                            isObject={false} 
                                            showCheckbox={true}
                                            onSelect={onSelectNames} 
                                            onRemove={onRemoveNames}
                                            name="permission"
                                            placeholder="Select Permissions"
                                            />
                                      
                            
                                     
                                    {errors.permission && errors.permission.type === 'required' && <span className="error">Permission is required</span>}
                                    </div>
                        </div>
                        <div class="col-lg-6 col-md-12 col-sm-12">
                            
                            <div class="form-group">
                              
                              <input  class="form-control" id="pwd" placeholder="Last Name" type="text" name="lastname"  ref={register({
                                        required: true
                                    })}/>
                                   {errors.lastname && errors.lastname.type === 'required' && <span className="error">Last Name is required</span>}  
                            </div>
        
                           
        
                              <div class="form-group">
                                    
                                    <input class="form-control" id="usr" placeholder="Password"  name="password"  ref={register({
                                        required: true
                                    })} type={passwordShown2 ? "text" : "password"}/>
      
                                    <i class="fa fa-eye-slash" aria-hidden="true" onClick={togglePasswordVisiblity}></i>
                                    {errors.password && errors.password.type === 'required' && <span className="error">Password is required</span>}
                                  </div>

                                  <div className="form-group">
                                   
                                     
                                       <Multiselect
                                       options={clip}
                                       displayValue="name"
                                       value="id"
                                       onSelect={onSelectCats} 
                                       onRemove={onRemoveCats}
                                       showCheckbox={true} 
                                       name="catpermission"
                                       placeholder="Select Category"
                                       />
                                    {errors.catpermission && errors.catpermission.type === 'required' && <span className="error">Category is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                     <Switch
                                  onChange={handleChange}
                                checked={statys} name="status"
                                 className="react-switch"
        />
                                    {errors.status && errors.status.type === 'required' && <span className="error">Status is required</span>}
                                </div>
                    </div>

                    </div>

                    <div class="button-sec">
                    <button type="submit" class="btn btn-danger square">SAVE</button>
                </div>
                </form>
                </div> 
          </div>  
            
          
    </div>}
    {quoteedit &&  <div class="col-lg-8 col-md-12 col-sm-12 ">
            <div class="fo-bg-white">
                <div class="top">
                    <div class="header">
                    <h2 class="heading">Edit Sub User</h2>
                </div>

                
               
                </div>
                <div class="form-sec c-su">
                 <form onSubmit={handleSubmit(onSubmitQuote)}>
                    <div class="row">
                        <div class="col-lg-6 col-md-12 col-sm-12">
                            
                                <div class="form-group">
                                 
                                  <input type="text" class="form-control" id="usr" placeholder="First Name" name="firstname"  type="text" ref={register({
                                        required: true
                                    })} defaultValue={(quoteForm['subuser_firstname'])}/>
                                     {errors.firstname && errors.firstname.type === 'required' && <span className="error">First Name is required</span>}
                                </div>
                                
        
                                <div class="form-group">
                                    
                                    <input type="text" class="form-control" id="usr" placeholder="Email" type="text" name="email"  ref={register({
                                        required: true
                                    })} defaultValue={(quoteForm['subuser_email'])}/>
                                    {errors.email && errors.email.type === 'required' && <span className="error">Email is required</span>}
                                  </div>
                                  <div class="form-group">
                                    
                                    <input type="text" class="form-control" id="usr" type="text" name="rolename" placeholder="RoleName" ref={register({
                                        required: true
                                    })} defaultValue={(quoteForm['role_name'])}/>
                                    {errors.rolename && errors.rolename.type === 'required' && <span className="error">RoleName is required</span>}
                                  </div>
                                 <div class="form-group">
                                 <Multiselect
                                    options={quoteConversations}
                                    selectedValues={quoteForm['allowed_permissions']}
                                    isObject={false}
                                    showCheckbox={true}
                                    onSelect={onSelectNames1} 
                                    onRemove={onRemoveNames1}
                                    placeholder="Select Permissions"
                                     />
                                      
                            
                                     
                                    {errors.permission && errors.permission.type === 'required' && <span className="error">Permission is required</span>}
                                    </div>
                        </div>
                        <div class="col-lg-6 col-md-12 col-sm-12">
                            
                            <div class="form-group">
                              
                              <input  class="form-control" id="pwd" placeholder="Last Name" type="text" name="lastname"  ref={register({
                                        required: true
                                    })} defaultValue={(quoteForm['subuser_lastname'])}/>
                                   {errors.lastname && errors.lastname.type === 'required' && <span className="error">Last Name is required</span>}  
                            </div>
        
                           
        
                              <div class="form-group">
                                    
                                    <input class="form-control" id="usr" placeholder="Password"  name="password"  ref={register({
                                        required: true
                                    })} type={passwordShown ? "text" : "password"} defaultValue={(quoteForm['subuser_password'])}/>
      
                                    <i class="fa fa-eye-slash" aria-hidden="true" onClick={togglePasswordVisiblity}></i>
                                    {errors.password && errors.password.type === 'required' && <span className="error">Password is required</span>}
                                  </div>

                                  <div className="form-group">
                                   
                                     
                                  <Multiselect
                                    options={clip}
                                    showCheckbox={true}
                                    displayValue="name"
                                    onSelect={onSelectCats1} 
                                    onRemove={onRemoveCats1}
                                    selectedValues={quoteForm['category_permissions']}
                                    placeholder="Select Category"
                                     /> 
                                    {errors.catpermission && errors.catpermission.type === 'required' && <span className="error">Category is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                     <Switch
                                  onChange={handleChange1}
                                  checked={statysedit} name="status"
                                 className="react-switch"
        />
                                    {errors.status && errors.status.type === 'required' && <span className="error">Status is required</span>}
                                </div>
                    </div>

                    </div>

                    <div class="button-sec">
                    <button type="submit" class="btn btn-danger square">SAVE</button>
                </div>
                </form>
                </div> 
          </div>  
            
          
    </div>}
</div>
</div>
</div>
<ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
 </Layout>
)
}
export default Managesub;