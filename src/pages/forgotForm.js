import React, { useRef, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import axios from "axios";
import { navigate, Link } from "gatsby";
import logo from './../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sign_bg2 from './../assets/sign_bg2.jpg';
import PageLoader from "../components/loaders/pageLoader";

const Forgoted = (props) => {

  const { register, handleSubmit, errors } = useForm();
  const _isMounted = useRef(false);
  const [isButton, setButton] = useState(false);
  const [loader, setLoader] = useState(false);
 

 

  useEffect(() => {
    return () => { _isMounted.current = true }
  }, []);

  const onSubmit = userCredential => {
    setLoader(true);
    let userLoginData = 
      
      {
        "email": userCredential.username.trim(),
        "template": "email_reset",
        "websiteId": 1
      }
    

    try {
      axios({
        method: 'put',
        url: `${process.env.GATSBY_CART_URL_STARCARE}customers/password`,
        data: userLoginData,
       
      })
      
        .then(function (response) {
          if (response.statusText === "OK" && response.status == 200 ) {
           setLoader(false)
           toast.success("Email Sent Successfully")
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
              <img src={sign_bg2} alt={"Laptop"} />
            </div>

            <div className="col-lg-6 col-md-6 col-xs-12 right_side">
              <div className="box_content">
                <div className="logo mb-3">
                  <Link to="/">
                    <img src={logo} />
                  </Link>
                </div>

                <h1>Forgot Password</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="login_form">

                  <input className="form-control" name="username" placeholder="Email *" type="text" ref={register({
                    required: true,
                    pattern: /\S+@\S+\.\S+/
                  })} />
                  {errors.username && errors.username.type === 'required' && <span>Email field is required</span>}
                  {errors.username && errors.username.type === 'pattern' && <span>Valid email required</span>}
               

                  <div className="my-3">
                    <input className="btn btn_gray submit_btn" type="submit" value="Get Email" disabled={isButton} />
                  </div>

                </form>

                {/* <p className="user_link my-4">
                  <Link to="/changePassword">Forgot Password?</Link>
                </p> */}

                <p className="user_link">New to ProQmed? 
              <Link to="/signup" className="ml-2">Start here</Link>
                </p>
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

export default Forgoted
