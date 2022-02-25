import React, { useRef, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import axios from "axios";
import { navigate, Link } from "gatsby";
import logo from './../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sign_bg from './../assets/bg.jpg';
import PageLoader from "../components/loaders/pageLoader";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
const Resett = ({location}) => {

  const { register, handleSubmit, errors } = useForm();
  const _isMounted = useRef(false);
  const [isButton, setButton] = useState(false);
  const [loader, setLoader] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);


  useEffect(() => {
   return () => { _isMounted.current = true }
  }, []);

  const onSubmit = userCredential => {
    const params = new URLSearchParams(location.search);
    const parameter1 = params.get("email");
    const parameter2 = params.get("token");
    console.log()
    setLoader(true);
    let userLoginData = {
      
      
        "email":parameter1,
        "template":"email_reset",
        "resetToken":parameter2,
        "newPassword": userCredential.password.trim()
      
    }

    try {
      axios({
        method: 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}customers/resetPassword`,
        data: userLoginData,
       
      })
      
        .then(function (response) {
          if (response.statusText === "OK" && response.status == 200 ) {
            setLoader(false);
             toast.success("Password Changed Successfully")
             navigate('/signin')
          }
        })
        .catch(function (response) {
          setLoader(false);
          toast.error('An error occured please contact admin')
        });

    } catch (err) {
      setLoader(false);
      console.error(`An error occured ${err}`)
    }

  };

  
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  

  return (
     <>

    {loader ?
      (<div className="mx-auto">
          <PageLoader />
      </div>) :
      (<div className="login_page">
        <div className="wrapper">
          <div className="login_box">
            <div className="col-lg-6 col-md-6 col-xs-12 left_side">
              <img src={sign_bg} alt={"Laptop"} /> 
            </div>

            <div className="col-lg-6 col-md-6 col-xs-12 right_side">
              <div className="box_content">
                <div className="logo mb-3">
                  <Link to="/">
                    <img src={logo} />
                  </Link>
                </div>

                <h1>Almost Done!</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="login_form">

                  <input className="form-control" name="password" placeholder="Enter New Password *"type={passwordShown ? "text" : "password"} ref={register({
                    required: true,
      
                  })} />
                  {errors.password && errors.password.type === 'required' && <span>Password field is required</span>}
                  <button className="btn btn heart" type="button" onClick={togglePasswordVisiblity}>{passwordShown ? <AiFillEye />: <AiFillEyeInvisible />} </button>

                  {/* <input className="form-control" name="confirmpassword" placeholder="Confirm Password *" type="password" ref={register({
                    required: true,
      
                  })} />
                  {errors.confirmpassword && errors.confirmpassword.type === 'required' && <span>Confirm Password field is required</span>} */}
                  <div className="my-3">
                    <input className="btn btn_gray submit_btn" type="submit" value="Reset" disabled={isButton} />
                  </div>

                </form>

                {/* <p className="user_link my-4">
                  <Link to="/changePassword">Forgot Password?</Link>
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>)
}

      {/* {tostrShow && <Toastr message={message}/>} */}
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
                
    </>
                
  )
}

export default Resett
