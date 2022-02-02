import React, { useRef, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import axios from "axios";
import { navigate, Link } from "gatsby";
import logo from './../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sign_bg from './../assets/bg.jpg';
import PageLoader from "../components/loaders/pageLoader";

const Resett = (props) => {

  const { register, handleSubmit, errors } = useForm();
  const _isMounted = useRef(false);
  const [isButton, setButton] = useState(false);
  const [loader, setLoader] = useState(false);

 

  useEffect(() => {
    return () => { _isMounted.current = true }
  }, []);

  const onSubmit = userCredential => {
    setLoader(true);
    let userLoginData = {
      "data":
      {
        "password": userCredential.password.trim(),
        "confirmpassword": userCredential.confirmpassword.trim(),
      }
    }

    try {
      axios({
        method: 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}customerlogin/id`,
        data: userLoginData,
       
      })
      
        .then(function (response) {
          if (response.statusText === "OK" && response.status == 200 ) {
            console.log(response.data)
            let categoryJson = [];
            if(response.data[0]['approve_account'] === "approved"){
           
          }else{
            setLoader(false);
             toast.error('Admin need to approve you')
          }
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

                  <input className="form-control" name="password" placeholder="Password *" type="password" ref={register({
                    required: true,
      
                  })} />
                  {errors.password && errors.password.type === 'required' && <span>Password field is required</span>}
                  <input className="form-control" name="confirmpassword" placeholder="Confirm Password *" type="password" ref={register({
                    required: true,
      
                  })} />
                  {errors.confirmpassword && errors.confirmpassword.type === 'required' && <span>Confirm Password field is required</span>}
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
