import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { checkLogin } from "./../services/headerServices";
import { navigate, Link} from "gatsby"
import Table from 'react-bootstrap/Table';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { logout } from "./../services/headerServices";
import account from "./../assets/account.png"
import logoutt from "./../assets/logout.png"
import order from "./../assets/order.png"
import Modal from 'react-bootstrap/Modal';

const Profile = () => {
  const { register, handleSubmit, errors } = useForm();
    const [jwt, setJwt] = useState("")
    const [isuserlogged, setIsLogged] = useState(false);
    const [email, setEmail] = useState("");
    const [user_name, setName] = useState("")
    const [profile, setProfile] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [state, setpic] = useState("");
    const [p,per] = useState(false);
    const [outp,outper] = useState(false);
    const [aftimg,afterimage]= useState(false);
  const [profilepic,setProfilepic] = useState({});
  const [showname,Naming]= useState(false);
  const [showmail,Emailing]= useState(false);
  const [showgender,Gendering]= useState(false);
  const [shownumber,Numbering]= useState(false);
  const [value, setValue] = useState();
 // const [showQuote, setShowQuote] = useState(true);
  const [quote, setQuotePopup] = useState(false);
  //const handleCloseQuote = () => setShowQuote(false);
 // const handleShowQuote = () => setShowQuote(true);

  const [permits,setPermit] = useState([]);
    useEffect(() => {
      setPermit(localStorage.permissions);
        setIsLogged(checkLogin());
        setJwt(localStorage.userToken);
        setEmail(localStorage.email);
    
        setName(localStorage.getItem('user_name'))
        
          axios({
         method: 'get',
         url: `${process.env.GATSBY_CART_URL_STARCARE}profilepic/list/${localStorage.email}`,
         headers: {
           'Authorization': `Bearer ${jwt}`
       }
       }).then((res) => {
         if (res.status == 200) {
         setProfilepic(res.data[0]);
           getProfile();
           setShow(true);
         }
       }).catch((err) => {
         console.error(err);
       })
     
      }, [])
    const getProfile = () => {
        
          axios({
            method: 'post',
            url: `${process.env.GATSBY_CART_URL_STARCARE}customerprofile/${localStorage.email}`,
          }).then((res) => {
            if (res.statusText === "OK" && res.status == 200) {
              console.log(res,"profile")
              setProfile(res.data[0]);
              setShow(true);
             if(!localStorage.permissions){
              outper(true)
              
            }
            else {
              let hi = JSON.parse(localStorage.permissions)
              let addwis=hi.includes("Can Edit Profile")
             
              per(addwis)
            
          }
            }
          }).catch((err) => {
            console.error(err);
          })
        
      }
      const onFileUpload = () => {
        let profiledata = {   
          "data": {
              "customer_email": email,
              "image": state,
              "title": user_name
          }
      }
        if (jwt) {
          axios({
            method: 'post',
            url: `${process.env.GATSBY_CART_URL_STARCARE}profilepic/upload/`,
            headers: {
              'Authorization': `Bearer ${jwt}`
          },
          data: profiledata
          }).then((res) => {
            if (res.status == 200) {
              toast.success('Profile picture uploaded')
              afterimage(false);
            }
          }).catch((err) => {
            console.error(err);
            afterimage(false);
          })
        }
      };
      const navigateOnclick = (value) => {
        if (isuserlogged) {
          navigate(value)
        } else {
          navigate('/signin')
        }
      }
const editingName = (value) =>{
  Naming(true)
}
const Namesubmit = Nameval =>{
  let data = {
    "data": {
      "customer_email":localStorage.email,
      "first_name":Nameval['firstname'],
      "last_name":Nameval['lastname']
    }
  }
  try {
    axios({
        method: 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}customer/update_name`,
        data: data,
    })
        .then(function (response) {
            toast.success('Name Updated Successfully')
            Naming(false)
                        getProfile()
        })
        .catch(function (response) {
            toast.error('An error occured please contact admin')
            Naming(false)
        });

} catch (err) {
    console.error(`An error occured ${err}`)
    Naming(false)
}
}

const editingEmail = (value) =>{
  Emailing(true)
}

const Emailsubmit = emailss => {
  let data = {
    "data": {
      "customer_email":localStorage.email,
      "new_email":emailss['email'],
    }
  }
  try {
    axios({
        method: 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}customer/update_email`,
        data: data,
    })
        .then(function (response) {
            toast.success('Email Updated Successfully')
            Emailing(false)
            getProfile()

        })
        .catch(function (response) {
            toast.error('An error occured please contact admin')
            Emailing(false)
        });

} catch (err) {
    console.error(`An error occured ${err}`)
    Emailing(false)
}
}
// const editingGender = (value) =>{
//   Gendering(true)
// }
// const Gendersubmit = gen => {
//   let data = {
//     "data": {
//       "customer_email":localStorage.email,
//       "gender":gen['gender'],
//     }
//   }
//   try {
//     axios({
//         method: 'post',
//         url: `${process.env.GATSBY_CART_URL_STARCARE}customer/update_gender`,
//         data: data,
//     })
//         .then(function (response) {
//             toast.success('Gender Updated Successfully')
//             Gendering(false)
//         })
//         .catch(function (response) {
//             toast.error('An error occured please contact admin')
//             Gendering(false)
//         });

// } catch (err) {
//     console.error(`An error occured ${err}`)
//     Gendering(false)
// }
// }
const editingNumber = (value) =>{
  Numbering(true)

}
const Numbersubmit = num => {
  let data = {
    "data": {
      "customer_email":localStorage.email,
      "telephone":num['number'],
    }
  }
  try {
    axios({
        method: 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}customer/update_phone`,
        data: data,
    })
        .then(function (response) {
            toast.success('Mobile Number Updated Successfully')
            Numbering(false)
            getProfile()
        })
        .catch(function (response) {
            toast.error('An error occured please contact admin')
            Numbering(false)
        });

} catch (err) {
    console.error(`An error occured ${err}`)
    Numbering(false)
}
}
      const uploadImage = async (e) => {
        const file = e.target.files[0];
       // setDisabled(false);
        const base64 = await convertBase64(file);
        setpic(base64);
        afterimage(true);
        console.log(base64)
      };
    
      const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
    
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
    
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
      };


      const onSubmit = userCredential => {
        try{
            axios({
                method : "put",
                url: `${process.env.GATSBY_CART_URL_STARCARE}customers/me/password`,
                headers : {
                'Authorization' : `Bearer ${jwt}`
                },  
                data : userCredential
            }).then((response) => {
                
                if(response.statusText === "OK" && response.status == 200){
                    toast.success('Password changed sucessfully');
                    //handleCloseQuote()
                   // localStorage.clear();
                    //navigate('/profile')
                }
            }).catch((err)=>{
                console.log(err);
                toast.error('An error occured, make sure your current password entered correctly');
            })                        
        }
        catch(err) {
            console.error(err)
        }
    }
    const quotePopupOpen = () => {
      if (!checkLogin()) {
        navigate('/signin')
      } else {
        setQuotePopup(true)
       // handleShowQuote(true)
       setShow(true);

      }
    }
  const logout = () => {
    setIsLogged(false)
    localStorage.clear();
    setValue({})
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
              {profilepic.logo ? <img src={profilepic.logo}/>: <div></div>}
            <div className="fo-center">
              <input className="btm" type="file" onChange={(e) => {uploadImage(e);}}/>
              </div>
              {aftimg && <button onClick={onFileUpload} className="action action_btn btn btn_gray">
                  Upload!
                </button>}
              </div>
            
                  <div className="name">
                    <span>Hello</span>
                    <p>{jwt && profile.firstname}</p>
                </div>
            </div>
         

            <div className="profile-sec details">
                <h4><span><img src={order}/></span> <a onClick={() => { navigateOnclick('/orders') }}>MY ORDERS</a> </h4>
                <h4><span><img src={account}/></span><a href="#"> ACCOUNT SETTINGS</a></h4>
                <ul>
                <li><Link to="/profile">Profile Information</Link></li>
                    <li><Link to="/myAddress">Manage Addresses</Link></li>
                    <li><Link to="/myReviews">My reviews</Link></li>
                </ul>
              {isuserlogged && <h4><span><img src={logoutt}/></span><a onClick={() => { logout() }}>LOGOUT</a></h4>}
            </div>
        </div>
<div className="col-lg-8 col-md-12 col-sm-12 ">
            <div className="fo-bg-white">
                <div className="top">
                    <div className="header">
                    <h2 className="heading">My Profile </h2>
                </div>
               
                </div>

                <div className="my-profile">
                    <div className="form-1">
                        <div className="head-label">
                            <h4>Personal Information</h4>
                           {p && <div>{!showname &&<span><i className="fa fa-pencil" aria-hidden="true"  onClick={editingName}></i>Edit</span>}</div> }
                           {outp && <div>{!showname &&<span><i className="fa fa-pencil" aria-hidden="true"  onClick={editingName}></i>Edit</span>}</div>}
                        </div>
                       
                       {!showname && <div className="form-content">
                            <input type="text" value={jwt && profile.firstname || ''} disabled/>
                            <input type="text" value={jwt && profile.lastname || ''} disabled/>
                        </div>}
                        {showname && <form onSubmit={handleSubmit(Namesubmit)}>
                        <div className="form-content">
                            <input type="text" placeholder="First Name" name="firstname" maxLength="20"ref={register({
                              required: true})} />
                            <input type="text" placeholder="Last Name" name="lastname" maxLength="20" ref={register({
                              required: true})} />
                            <button type="submit" className="btn btn-danger square">SAVE</button>
                        </div></form>}
                    </div>


                    <div className="form-1">
                        <div className="head-label">
                            <h4>Email Address</h4>
                            {p && <div>{!showmail && <span><i className="fa fa-pencil" aria-hidden="true" onClick={editingEmail}></i>Edit</span>}</div>}
                           {outp &&<div>{!showmail && <span><i className="fa fa-pencil" aria-hidden="true" onClick={editingEmail}></i>Edit</span>}</div>}

                           {p && <span>
                 <a onClick={() => quotePopupOpen()}  >
                  Change Password </a> </span> }
                   { outp && <span>
                 <a onClick={() => quotePopupOpen()}  >
                  Change Password </a> </span> }
                  {quote ? <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>

                </Modal.Header>
                <Modal.Body>
                <div className="row">
                                        <div className="col-lg-12 col-md-12 col-xs-12">
                                            <form onSubmit={handleSubmit(onSubmit)} className="Changepwd_form fo-wid" autoComplete="off">
                                                <div className="inline_form">
                                                <div className="form-group">
                                                    <label>Enter Old Password</label>
                                                    <input type="password" className="form-control" 
                                                    id="currentPassword" name="currentPassword"  ref={register({    
                                                        required: true,
                                                        minLength : 8 ,
                                                        pattern : /(?=.*\d)(?=.*[a-z])(?!.*\s).*/
                                                       })}/> 
                                                    {errors.currentPassword && errors.currentPassword.type === 'required' && <span>Current Password field is required</span>}
                                                    {errors.currentPassword && errors.currentPassword.type === 'minLength' && <span>Current  Password must contain 8 digits</span>}
                                                    {errors.currentPassword && errors.currentPassword.type === 'pattern' && <span>Current  Password must contain 8 charactor along with 1 number and alphanumeric</span>}
                                                </div>
                                                <div className="form-group">
                                                    <label>Enter New Password</label>
                                                    <input type="password" className="form-control" 
                                                    id="newPassword" name="newPassword"  ref={register({    
                                                        required: true,
                                                        minLength : 8 ,
                                                        pattern : /(?=.*\d)(?=.*[a-z])(?!.*\s).*/
                                                       })}/> 
                                                    {errors.newPassword && errors.newPassword.type === 'required' && <span>New Password field is required</span>}
                                                    {errors.newPassword && errors.newPassword.type === 'minLength' && <span>New  Password must contain 8 digits</span>}
                                                    {errors.newPassword && errors.newPassword.type === 'pattern' && <span>New  Password must contain 8 charactor along with 1 number and alphanumeric</span>}
                                                </div>  
    
                                                <div className="form-group">
                                                    <label>Enter Confirm Password</label>
                                                    <input type="password" className="form-control" 
                                                    id="confirmPassword" name="confirmPassword"  ref={register({    
                                                        required: true,
                                                        minLength : 8 ,
                                                        pattern : /(?=.*\d)(?=.*[a-z])(?!.*\s).*/
                                                       })}/> 
                                                    {errors.confirmPassword && errors.confirmPassword.type === 'required' && <span>Confirm Password field is required</span>}
                                                    {errors.confirmPassword && errors.confirmPassword.type === 'minLength' && <span>Confirm  Password must contain 8 digits</span>}
                                                    {errors.confirmPassword && errors.confirmPassword.type === 'pattern' && <span>Confirm  Password must contain 8 charactor along with 1 number and alphanumeric</span>}
                                                </div> 
                                                </div>
                                                <div className="form_btn">
                                                <button className="btn btn_gray" type="submit">Change Password</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                </Modal.Body>
               </Modal>: <div></div>
                }
                 
                        </div>

                        {!showmail && <div className="form-content">
                            <input type="text" value={jwt && profile.email || ''} disabled/>
                            </div>}
                         
                        {showmail && <form onSubmit={handleSubmit(Emailsubmit)}>
                           <div className="form-content"> 
                            <input type="text" placeholder="Email Address" name="email" maxLength="50" ref={register({
                              required: true})} />
                            
                            <button type="submit" className="btn btn-danger square">SAVE</button>
                        </div></form>}
                    </div>

                    <div className="form-1">
                        <div className="head-label">
                            <h4>Mobile Number</h4>
                          {p && <div>{!shownumber && <span><i className="fa fa-pencil" aria-hidden="true" onClick={editingNumber}></i>Edit</span>}</div> } 
                          {outp && <div> {!shownumber && <span><i className="fa fa-pencil" aria-hidden="true" onClick={editingNumber}></i>Edit</span>}</div>} 
                            
                        </div>
                        {!shownumber &&  <div className="form-content">
                            <input type="text" value={jwt && profile.contact_number || ''} disabled/>
                         </div>}
                        {shownumber &&  <form onSubmit={handleSubmit(Numbersubmit)}><div className="form-content">
                            <input type="text" placeholder="Number" name="number" maxLength="10" ref={register({
                              required: true})} />
                            
                            <button type="submit" className="btn btn-danger square">SAVE</button>
                        </div></form>}
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

export default Profile