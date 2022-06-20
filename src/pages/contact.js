import React, {useRef, useEffect} from "react";
import Layout from "../components/layout";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';   
const Contact = () => {

    const { register, handleSubmit, errors } = useForm();
    const _isMounted = useRef(false);   

    useEffect(() => {
        return () => { _isMounted.current = true }
      }, []);

      const Submit = contactData => {
        let ContactDetail = {
            "data": {
                 "name":  contactData.firstname,
                "email":  contactData.email,    
                "phone":  contactData.telephone, 
              "message":  contactData.Message
            }   
          }
          try{
            axios({
              method: 'post',
              url: `${process.env.GATSBY_CART_URL_STARCARE}contactform`,
              data: ContactDetail,
              })
              .then(function (response) {
                if (response.statusText === "OK" && response.status == 200) {

                toast.success("Your mail has been sent to admin")
                 // toast.success(response.data)
                  document.getElementById("create-form").reset();
                  
                }
              })
              .catch(function (response) {
                                                  
              });
    
          }catch(err){
            console.error(`An error occured ${err}`)
          }

      }

      const handleChange = (event) => {
        const re = /^[0-9\b]+$/;
        if (!re.test(event.target.value)) {
            event.target.value = ""
        }
        
    }

    return (
        <Layout>

            <main className="contactus_page">
                <div className="App">
                    <div className="content_wrapper">
                        <div className="container">
                            <div className="main_title">
                                <h3>Contact Us</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-9 col-md-8 col-xs-12 left_side">
                                    {/* <h3>Get In Touch</h3> */}
                                    <p>Please fill out the quick form and we will be in touch with lightning speed.</p>

                                    <form id="create-form" className="contact_form" onSubmit={handleSubmit(Submit)} >
                                        <div className="contact_form">
                                            <input className="form-control" name="firstname" placeholder="Name *" type="text" ref={register({
                                                required: true
                                            })}/>
                                            {errors.firstname && errors.firstname.type === 'required' && <span className="error_label">Name is required</span>}
                                        </div>
                                        <div className="contact_form">
                                            <input className="form-control" name="email" placeholder="Email *" type="email" ref={register({
                                                    required: true,
                                                    pattern: /\S+@\S+\.\S+/
                                                })} required/>  
                                                 {errors.email && errors.email.type === 'required' && <span className="error_label">Email is required</span>}
                                                 {errors.email && errors.email.type === 'pattern' && <span className="error_label">Valid email required</span>}
                                        </div>
                                        <div className="contact_form">
                                            <input className="form-control" name="telephone" id="telephone" placeholder="Phone *" type="tel" maxLength = "10" minLength = "10" onChange={handleChange} ref={register({
                                                required: true,
                                            })} />
                                            {errors.telephone && errors.telephone.type === 'required' && <span className="error_label">Phone number required</span>}
                                            {errors.telephone && errors.telephone.type === 'minlength' && <span className="error_label">Enter Valid Phone Number</span>}
                                        </div>
                                        <div className="contact_form">
                                            <textarea className="form-control" rows="4" placeholder="Message *" id="Message" name="Message" type="text" ref={register({
                                                    required: true
                                                 })}></textarea>
                                            {errors.Message && errors.Message.type  === 'required' && <span className="error_label">Message is required</span>}
                                        </div>
                                       
                                        {/* <div className="text-center">
                                            <input className="btn submit_btn btn_gray" type="submit"  />
                                        </div> */}
                                          <div className="form_btn">
                                                <button className="btn btn_gray" type="submit">Submit</button>
                                                </div>
                                    </form>
                                </div>
                                <div className="col-lg-3 col-md-4 col-xs-12 right_side">
                                    <div>
                                        <h3>Connect with us:</h3>
                                        <p>For support or any questions:</p>
                                        <p>Email us at <a onClick={() => {window.open("https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=support@proqmed.com", "_blank");}}>support@proqmed.com</a></p>
                                        <p>Call us: <a href="tel:9500988362">+91-950-098-8362 </a> </p>
                                    </div>

                                    <div>
                                        <h3>India Office:</h3>
                                        <p>56-C Bharathi Park, 2nd Cross Road,<br></br>
                                        Saibaba Colony, Coimbatore – 641 011<br></br>
                                        India.
                                        </p>
                                    </div>

                                    <div>
                                        <h3>US Office:</h3>
                                        <p>31700 West Thirteen Mile Road<br></br>
                                        Suite 205, Farmington Hills,<br></br>
                                        MI 48334, USA.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="map_sec">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1998205.2680127076!2d76.45002089942092!3d11.992161694701243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBangalore%2C%20Karnataka!3m2!1d12.9715987!2d77.5945627!4m5!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!3m2!1d11.0168445!2d76.9558321!5e0!3m2!1sen!2sin!4v1606548279484!5m2!1sen!2sin" width="100%" height="450" frameBorder="0" allowFullScreen="" aria-hidden="false" tabIndex="0"></iframe>
                            </div> */}
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

        </Layout >
    )
}

export default Contact;