import React, { useEffect,useState } from "react";
import { navigate } from "gatsby";
import Layout from "../components/layout";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';     
const ChangePassword = () => {
    const { register, handleSubmit, errors } = useForm();
    const [jwt,setJwt] = useState("")
    
    useEffect(() => {
        setJwt(localStorage.userToken);
    },[])
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
                    localStorage.clear();
                    navigate('/')
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
    return (
        <>     
            <Layout>                 
                <main>
                    <div className="App">
                        <div className="content_wrapper">
                            <div className="container">
                                <div className="main_title">
                                    <h1>Change Password</h1>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-xs-12">
                                        <form onSubmit={handleSubmit(onSubmit)} className="Changepwd_form" autoComplete="off">
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
                </main>
            </Layout>
        </>
    )

}
  

export default ChangePassword;