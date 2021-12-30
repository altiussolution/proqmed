import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { checkLogin } from "./../services/headerServices";
import { navigate} from "gatsby"
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
const Profile = () => {
    const [jwt, setJwt] = useState("")
    const [isuserlogged, setIsLogged] = useState(false);
    const [email, setEmail] = useState("");
    const [user_name, setName] = useState("")
    const [profile, setProfile] = useState({});
    const [show, setShow] = useState(false);
    const [state, setpic] = useState("");
    const [p,per] = useState(false);
    const [outp,outper] = useState(false);
  const [profilepic,setProfilepic] = useState({});
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
            }
          }).catch((err) => {
            console.error(err);
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

      const uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setpic(base64);
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
              <button onClick={onFileUpload} className="action action_btn btn btn_gray">
                  Upload!
                </button>
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
                  <th>Firstname</th>
                  <td>:</td>
                  <td>{jwt && profile.firstname}</td>
                </tr>

                <tr>
                  <th>Lastname</th>
                  <td>:</td>
                  <td>{jwt && profile.lastname}</td>
                </tr>

                <tr>
                  <th>Email</th>
                  <td>:</td>
                  <td>{jwt && profile.email}</td>
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