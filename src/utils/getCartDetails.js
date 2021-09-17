import axios from "axios";
// import jwtDecode from "jwt-decode";  

const getCartDetails = async () => {
  let cartData;
  
  const jwt = await localStorage.getItem("userToken");
 
    const res = await axios({  
       method : 'get',
       url : `${process.env.GATSBY_CART_URL_STARCARE}carts/mine/items`,
       headers : {
              'Authorization' : `Bearer ${jwt}`
            }  
     }).then((res) => {
       return res;
     }).catch((err) =>{
       alert('error occured')
       console.error(err)
     })
 
 
  try {   
    const data =res.data;
    cartData = data.data;
    return cartData;
  } catch (err) {
    console.error(err)
    return [];
  }
};

const totalCartItems = cartData => {
  return cartData.reduce((sum, item) => sum + item.qty, 0);
};

export { getCartDetails, totalCartItems };
