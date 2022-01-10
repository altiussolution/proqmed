import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { checkLogin } from "./../services/headerServices";
import { navigate} from "gatsby"
import Table from 'react-bootstrap/Table';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { logout } from "./../services/headerServices";

const Profile = () => {
  const { register, handleSubmit, errors } = useForm();
    const [jwt, setJwt] = useState("")
    const [isuserlogged, setIsLogged] = useState(false);
    const [email, setEmail] = useState("");
    const [user_name, setName] = useState("")
    const [profile, setProfile] = useState({});
    const [show, setShow] = useState(false);
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

    useEffect(() => {
        setIsLogged(checkLogin());
        setJwt(localStorage.userToken);
        setEmail(localStorage.email);
        if(localStorage.permissions){
          let addwis=localStorage.permissions.includes("Can Edit Profile")
         
          per(addwis)
        
      }else if(!localStorage.permissions){
        outper(true)
        
      }
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



  const logout = () => {
    setIsLogged(false)
    localStorage.clear();
    setValue({})
    navigate('/')  

  }
    return (
        <Layout>

<div class="container-fluid grey">
<div class="container">
    <div class="row">
        <div class="col-lg-4 col-md-12 col-sm-12">
            <div class="profile-sec">
              <div className="fo-deflx">
              {profilepic.logo ? <img src={profilepic.logo}/>: <div></div>}
            <div className="fo-center">
              <input type="file" onChange={(e) => {uploadImage(e);}}/>
              </div>
              {aftimg && <button onClick={onFileUpload} className="action action_btn btn btn_gray">
                  Upload!
                </button>}
              </div>
            
                  <div class="name">
                    <span>Hello</span>
                    <p>{jwt && profile.firstname}</p>
                </div>
            </div>
         

            <div class="profile-sec details">
                <h4><span><img src="images/orders.png" alt="" /></span><a onClick={() => { navigateOnclick('/orders') }}>MY ORDERS</a> </h4>
                <h4><span><img src="images/account.png" alt=""/></span><a href="#"> ACCOUNT SETTINGS</a></h4>
                <ul>
                    <li onClick={() => { navigateOnclick('/profile') }}><a>Profile Information</a></li>
                    <li><a>Manage Addresses</a></li>
                    <li><a href="#">My reviews</a></li>
                </ul>
              {isuserlogged && <h4><span><img src="images/logout.png" alt=""/></span><a onClick={() => { logout() }}>LOGOUT</a></h4>}
            </div>
        </div>
<div class="col-lg-8 col-md-12 col-sm-12 ">
            <div class="fo-bg-white">
                <div class="top">
                    <div class="header">
                    <h2 class="heading">My Profile </h2>
                </div>
               
                </div>

                <div class="my-profile">
                    <div class="form-1">
                        <div class="head-label">
                            <h4>Personal Information</h4>
                            {!showname &&<span><i class="fa fa-pencil" aria-hidden="true"  onClick={editingName}>Edit</i></span>}

                        </div>
                       
                       {!showname && <div class="form-content">
                            <input type="text" value={jwt && profile.firstname} disabled/>
                            <input type="text" value={jwt && profile.lastname} disabled/>
                        </div>}
                        {showname && <form onSubmit={handleSubmit(Namesubmit)}>
                        <div class="form-content">
                            <input type="text" placeholder="First Name" name="firstname" maxLength="20"ref={register({
                              required: true})} />
                            <input type="text" placeholder="Last Name" name="lastname" maxLength="20" ref={register({
                              required: true})} />
                            <button type="submit" class="btn btn-danger square">SAVE</button>
                        </div></form>}
                    </div>


                    <div class="form-1">
                        <div class="head-label">
                            <h4>Email Address</h4>
                            {!showmail && <span><i class="fa fa-pencil" aria-hidden="true" onClick={editingEmail}>Edit</i></span>}
                            <span>
                            {p && <a onClick={() => { navigateOnclick('/changePassword') }} >
                  Change Password
                </a>}
                {outp && <a onClick={() => { navigateOnclick('/changePassword') }} >
                  Change Password
                </a>}
                </span>    
                        </div>

                        {!showmail && <div class="form-content">
                            <input type="text" value={jwt && profile.email} disabled/>
                            </div>}
                         
                        {showmail && <form onSubmit={handleSubmit(Emailsubmit)}>
                           <div class="form-content">
                            <input type="text" placeholder="Email Address" name="email" maxLength="50" ref={register({
                              required: true})} />
                            
                            <button type="submit" class="btn btn-danger square">SAVE</button>
                        </div></form>}
                    </div>

                    <div class="form-1">
                        <div class="head-label">
                            <h4>Mobile Number</h4>
                            {!shownumber && <span><i class="fa fa-pencil" aria-hidden="true" onClick={editingNumber}>Edit</i></span>}
                            
                        </div>
                        {!shownumber &&  <div class="form-content">
                            <input type="text" value={jwt && profile.contact_number} disabled/>
                         </div>}
                        {shownumber &&  <form onSubmit={handleSubmit(Numbersubmit)}><div class="form-content">
                            <input type="text" placeholder="Number" name="number" maxLength="10" ref={register({
                              required: true})} />
                            
                            <button type="submit" class="btn btn-danger square">SAVE</button>
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