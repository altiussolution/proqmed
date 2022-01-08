import React, { useState } from "react"
import { useForm } from "react-hook-form";
import axios from "axios";
import { navigate, Link } from "gatsby";
import logo from './../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sign_bg from './../assets/bg.jpg';
import PageLoader from "../components/loaders/pageLoader";
import { trim } from "jquery";

const SignUp = () => {

  const { register, handleSubmit, watch, errors } = useForm();
  const [loader, setLoader] = useState(false);


  const onSubmit = data => {    
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
            toast.success(response.data);
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
              <div className="box_content fo-signup">
                <div className="logo mb-3">
                  <Link to="/">
                    <img src={logo} />
                  </Link>
                </div>
                <h1>Sign up</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="login_form">
                 {/* pattern: /^(?!\s)(?!.*\s$)[a-zA-Z0-9\s()-]+$/ // pattern for first and last white space restriction*/}
                  <input className="form-control" name="firstname" placeholder="First name *"  type="text" ref={register({ 
                    required: true,     
                    pattern:/^(?=.*[a-zA-Z])([a-zA-Z]+)$/               
                       })} />
                  {errors.firstname && errors.firstname.type === 'required' && <span>This field is required</span>}
                  {errors.firstname && errors.firstname.type === 'pattern' && <span>Special characters and Numeric characters are not allowed</span>}
                  <input className="form-control" name="lastname" placeholder="Last name *" type="text" ref={register({ 
                    required: true,
                    pattern:/^(?=.*[a-zA-Z])([a-zA-Z]+)$/               
                     })} />
                  {errors.lastname && errors.lastname.type === 'required' && <span>This field is required</span>}
                  {errors.lastname && errors.lastname.type === 'pattern' && <span>Special characters and Numeric characters are not allowed</span>}
                  <input className="form-control" name="email" placeholder="Email *" type="text" ref={register({
                    required: true,
                    pattern: /\S+@\S+\.\S+/
                  })} />
                  {errors.email && errors.email.type === 'required' && <span className="error">Email field is required</span>}
                  {errors.email && errors.email.type === 'pattern' && <span className="error">Valid email required</span>}
                  <input className="form-control" name="password" placeholder="Password *" type="password" ref={register({
                    required: true,
                    minLength: 8,
                    pattern: /(?=.*\d)(?=.*[a-z])(?!.*\s).*/
                  })} /> <span><i className="fa fa-eye" aria-hidden="true"></i></span>
                  {errors.password && errors.password.type === 'required' && <span className="error">Password field is required</span>}
                  {errors.password && errors.password.type === 'minLength' && <span className="error">Password must contain 8 digits</span>}
                  {errors.password && errors.password.type === 'pattern' && <span className="error">Password must contain 8 charactor along with 1 number and alphanumeric</span>}
                  <div className="my-3">
                    <input className="btn btn_gray submit_btn" type="submit" />
                  </div>

                </form>
                <p className="user_link">
                  Already have an account? <Link to="/signin" className="ml-2">Sign in</Link>
                </p>
              </div>

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
    </>
  )
}

export default SignUp
