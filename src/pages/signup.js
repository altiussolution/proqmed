import React, { useState } from "react"
import { useForm } from "react-hook-form";
import axios from "axios";
import { navigate, Link } from "gatsby";
import Layout from "../components/layout";
import logo from './../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sign_bg2 from './../assets/sign_bg2.jpg';
import PageLoader from "../components/loaders/pageLoader";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";

const SignUp = () => {

  const { register, handleSubmit, errors } = useForm();
  const [loader, setLoader] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShown2, setPasswordShown2] = useState(false);
  const onSubmit = data => {    
   
    if(data.password === data.conpassword){
      setLoader(true);
    let customerData =
    {
      "data": {
        "email": data.email.trim(),
        "firstname": data.firstname.trim(),
        "lastname": data.lastname.trim(),
        "password": data.password.trim()
      }
    }
    try {

      axios({
        method: 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}registration/`,
        data: customerData,
      })
        .then(function (response) {
          if (response.data === 'Your Account Created') {
            // toast.success(response.data);
            toast.success("Account created successfully for further information please check your registered mail")
            navigate('/signin')
            setLoader(false);
          }

          if (response.data === 'Customer Account Already Edits') {
            setLoader(false);
            toast.error('Customer Account Already Exists');
          }

        })
        .catch((err) => {
          setLoader(false);
          toast.error('An error occured please contact admin');
        })

    } catch (err) {
      setLoader(false);
      console.error(`An error occured ${err}`)
    }
  }else {
    toast.error('Passowords does not match');
    
  }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const togglePasswordVisiblity2 = () => {
    setPasswordShown2(passwordShown2 ? false : true);
  };


  return (
    <>
  <Layout>
      {loader ?
      (<div className="mx-auto">
          <PageLoader />
      </div>) :
      (<div className="login_page">
        <div className="wrapper">
          <div className="login_box">
            {/* <div className="col-lg-6 col-md-6 col-xs-12 left_side">
              <img src={sign_bg2} alt={"Laptop"} />
            </div> */}

           
              <div className="box_content fo-signup">
                {/* <div className="logo mb-3">
                  <Link to="/">
                    <img src={logo} />
                  </Link>
                </div> */}
                <h1>Create Account</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="login_form">
                 {/* pattern: /^(?!\s)(?!.*\s$)[a-zA-Z0-9\s()-]+$/ // pattern for first and last white space restriction*/}

                 <div className="form-host">
                   <span> First Name</span>
                  <input className="form-control" name="firstname" placeholder="Enter your First name *"  type="text" ref={register({ 
                    required: true,     
                    pattern:/^(?=.*[a-zA-Z])([a-zA-Z]+)$/               
                       })} />
                  {errors.firstname && errors.firstname.type === 'required' && <span className="error_label">This field is required</span>}
                  {errors.firstname && errors.firstname.type === 'pattern' && <span className="error_label">Special characters and Numeric characters are not allowed</span>}
                  </div>

                  <div className="form-host">
                   <span> Last Name</span>
                  <input className="form-control" name="lastname" placeholder="Enter your Last name *" type="text" ref={register({ 
                    required: true,
                    pattern:/^(?=.*[a-zA-Z])([a-zA-Z]+)$/               
                     })} />
                  {errors.lastname && errors.lastname.type === 'required' && <span className="error_label" >This field is required</span>}
                  {errors.lastname && errors.lastname.type === 'pattern' && <span className="error_label">Special characters and Numeric characters are not allowed</span>}

                  </div>

                  <div className="form-host">
                   <span> Email</span>
                  <input className="form-control" name="email" placeholder="Enter your email *" type="text" ref={register({
                    required: true,
                    pattern: /\S+@\S+\.\S+/
                  })} />
                  {errors.email && errors.email.type === 'required' && <span className="error_label">Email field is required</span>}
                  {errors.email && errors.email.type === 'pattern' && <span className="error_label">Valid email required</span>}

                  </div>

                  <div className="form-host">
                   <span> Password</span>
                  <input className="form-control" name="password" placeholder="Password *" type={passwordShown2 ? "text" : "password"} ref={register({
                    required: true,
                    minLength: 6,
                    pattern: /(?=.*\d)(?=.*[a-z])(?!.*\s).*/
                  })} />
                  <button className="btn btn heart" type="button" onClick={togglePasswordVisiblity2}>{passwordShown2 ? <AiFillEye />: <AiFillEyeInvisible />}</button>
                  {errors.password && errors.password.type === 'required' && <span className="error">Password field is required</span>}
                  {errors.password && errors.password.type === 'minLength' && <span className="error">Passwords must contain 6 characters</span>}
                  {errors.password && errors.password.type === 'pattern' && <span className="error">Password must contain 6 charactors along with 1 number and alphanumeric</span>}

                  </div>

                  <div className="form-host">
                   <span> Confirm Password</span>
                  <input className="form-control" name="conpassword" placeholder="Confirm Password *" type={passwordShown ? "text" : "password"} ref={register({
                    required: true,
                    minLength: 6,
                    pattern: /(?=.*\d)(?=.*[a-z])(?!.*\s).*/
                  })} />
                  <button className="btn btn heart" type="button" onClick={togglePasswordVisiblity}>{passwordShown ? <AiFillEye />: <AiFillEyeInvisible />} </button>
                  {errors.conpassword && errors.conpassword.type === 'required' && <span className="error">Confirm Password field is required</span>}
                  {errors.conpassword && errors.conpassword.type === 'minLength' && <span className="error">Confirm Password must contain 6 digits</span>}
                  {errors.conpassword && errors.conpassword.type === 'pattern' && <span className="error">Confirm Password must contain 6 charactors along with 1 number and alphanumeric</span>}
                  <div className="my-3">

                    </div>
                    <input className="btn btn_gray submit_btn" type="submit" value="Create"/>
                  </div>

                </form>
                <p className="user_link"><a><Link to="/termsConditions" className="ml-2">Terms of use </Link> & <Link to="/privacyPolicy" className="ml-2">Privacy policy</Link></a>
                </p>
                <p className="user_link">
                  Already have an account? <Link to="/signin" className="ml-2">Sign in</Link>
                </p>
              </div>

        
          </div>
        </div>

      </div>)
}

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
    </>
  )
}

export default SignUp
