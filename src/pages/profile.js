import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { checkLogin } from "./../services/headerServices";
import { navigate} from "gatsby"
import Table from 'react-bootstrap/Table';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
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
        url: `${process.env.GATSBY_CART_URL_STARCARE}customer/updatename`,
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
        url: `${process.env.GATSBY_CART_URL_STARCARE}customer/updateemail`,
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
const editingGender = (value) =>{

}
const editingNumber = (value) =>{

}
      const uploadImage = async (e) => {
        const file = e.target.files[0];
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
    return (
        <Layout>


            <main className="profile_page">
                <div className="App">
                    <div className="content_wrapper">
                        <div className="container">
                            <div className="main_title">
                                <h1>My <span>Profile</span></h1>
                            </div>
                            <div className="col-lg-9 col-md-9 col-xs-12 no_data ">
                            <div className="profile_pic">
            {profilepic.logo ? <img src={profilepic.logo}/>: <div></div>}
              <input type="file" onChange={(e) => {uploadImage(e);}}/>
              {aftimg && <button onClick={onFileUpload} className="action action_btn btn btn_gray">
                  Upload!
                </button>}
                {p && <button onClick={() => { navigateOnclick('/changePassword') }} className="action action_btn btn btn_gray">
                  Change Password
                </button>}
                {outp && <button onClick={() => { navigateOnclick('/changePassword') }} className="action action_btn btn btn_gray">
                  Change Password
                </button>}
            </div>

            <Table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>:</td>
                  {!showname && <td>{jwt && profile.firstname}{jwt && profile.lastname}
                  
                  </td>}
                  {showname && <td><form onSubmit={handleSubmit(Namesubmit)}>
                  <label htmlFor="firstname">Name</label>
                  <input type="text"  name="firstname" maxLength="20" className="form-control" ref={register({
                              required: true})} />
                               <input type="text"  name="lastname" maxLength="20" className="form-control" ref={register({
                              required: true})} />
                  <button type="submit">Save</button>
                  </form></td>}
                  
                  {!showname && <td><button onClick={editingName}>Edit</button></td>}
                </tr>

                <tr>
                  <th>Email</th>
                  <td>:</td>
                  {!showmail && <td>{jwt && profile.email}
                 
                  </td>}
                  {showmail && <td><form onSubmit={handleSubmit(Emailsubmit)}>
                  <label htmlFor="email">Email</label>
                  <input type="text"  name="email" maxLength="20" className="form-control" ref={register({
                              required: true})} />
                  <button type="submit">Save</button>
                  </form></td>}
                  
                  {!showmail && <td><button onClick={editingEmail}>Edit</button></td>}
                </tr>
                <tr>
                  <th>Gender</th>
                  <td>:</td>
                  {<td>{jwt && profile.gender}
                  
                  </td>}
                  {/* <button onClick={editingGender}>Edit</button> */}
                </tr>
                <tr>
                  <th>Mobile Number</th>
                  <td>:</td>
                  {<td>{jwt && profile.telephone}
                  
                  </td>}
                  {/* <button onClick={editingNumber}>Edit</button> */}
                </tr>
              </tbody>
            </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </Layout>
    )
}

export default Profile