import React , { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/layout"
import "../components/layout.css"
import { useForm } from "react-hook-form";

const Tracking =  () => {
    const [jwt, setjwt] = useState("");
    const [track, settrack] = useState([]);
    const [order, setorder] = useState([]);

    const {register, handleSubmit, errors } = useForm();

    useEffect(() => {
      setjwt(localStorage.userToken);
      onSubmit();
  },[])
  const onSubmit =(event) => {
    try {
        axios({
          method: 'get',
          url: `${process.env.GATSBY_CART_URL_STARCARE}trackorder/order_id/${order}`,
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        }).then((res) => {
          if (res.statusText === "OK" && res.status == 200) {
              settrack(res.data[0]);
              console.log(res.data[0])
              
          }
        }).catch((err) => {
          console.error(err);
        })
      } catch (err) {
        console.error(err)
      }    
  }

   // const trackorder = async () => {

     // };
      return (
        
<Layout>
    <main>
                    <div className="App">
                        <div className="content_wrapper">
                            <div className="container">
                                <div className="main_title">
                                    <h1>Track <span>Order</span></h1>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-xs-12">
                                    <form onSubmit={handleSubmit(onSubmit)} className="Changepwd_form" autoComplete="off">
                                            <div className="inline_form">
                                            <div className="form-group">
                                                <label>Order Id</label>
                                                <input  className="form-control"      
                                                   id="orderid" name="orderid" onChange={(event) => setorder(event.target.value)} ref={register({    
                                                    required: true,
                                                   })}/> 
                                                {errors.orderid && errors.orderid.type === 'required' && <span>Please Enter OrderID</span>}
                                            </div>
                                            </div>
                                            <div className="form_btn">
                                            <button className="btn btn_gray"  type="submit">Track Order</button>
                                            </div>
                                            </form>
                                     </div>
                                     </div>
                                </div>
                                </div>
                                </div>
                                </main>
            
                <tr>
                  <th>product_name</th>
                  <td>:</td>
                  <td>{track.product_name}</td>
                </tr>

              
  </Layout>

      )
    }

export default Tracking;