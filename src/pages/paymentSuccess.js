import React , {useEffect, useState} from "react";
import Layout from "../components/layout";
import axios from "axios";
import { Link, navigate } from "gatsby";
import Card from 'react-bootstrap/Card';
import { viewCartItems }  from "../utils/apiServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';    


const PaymentSuccess = ({location}) => {
  // if (typeof window !== `undefined`) {
    const [token, setToken]  = useState('');
    const [increid,IncreID] = useState([]);
    const [id,ID] = useState([]);
    useEffect( () => {
      let arr=[]
      let arr1=[]
      setToken(localStorage.userToken)
      const params = new URLSearchParams(location.search);
      const parameter1 = params.get("id");
      const parameter2 = params.get("increid");
      ID(parameter1.split(","))
      IncreID(parameter2.split(","))
        if(localStorage.userToken){
            localStorage.setItem('cartData', []);
            try
            {    
              axios({
                method : 'post',
                url: `${process.env.GATSBY_CART_URL_STARCARE}carts/mine`,
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
              })
              .then((response) => {
                if(response.statusText === "OK" && response.status == 200)
                {
                    localStorage.setItem('cartId',response.data);
                    viewCartItems()
                    localStorage.removeItem('cartData', []);
                }
              }) 
              .catch((error) => {
                console.error(error,'error')
              })
            }catch(err){
              console.error(err);
              toast.error('something went wrong')
            }
          }else{
              navigate("/signin")
          }
    }, []) 
  // }
  
    return (
        <Layout cartCount={0}>
             <Card border="success" style={{ width: 'auto' }}>
                <Card.Header>Payment Success</Card.Header>
                <Card.Body>
                <Card.Title>your order placed sucessfully</Card.Title>
                <Card.Text>
                  
                    { increid.map((val, index) => (
                      <Link to="/orderstatus" state={{ order_id: id[index] }}><span key={index}>{val}</span></Link>
                  ))}
                <Link to="/"> Click here </Link> to continue shopping
                </Card.Text>
                </Card.Body>
            </Card>
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
    )
}

export default PaymentSuccess