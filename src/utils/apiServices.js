import axios from "axios";
import { arrayOf } from "prop-types";

const searchServices = async (value) => {
  if(value.length !== 0){
    try
      {
          const res = await axios(
            `${process.env.GATSBY_NODE_URL_STARCARE}search/${value}`
          );

          let productList = [];
           console.log(res.data[0])
          for(let prod of res.data[0]){
            prod[0][3].push(prod[0][0])
            let proProduct = prod[0][3];
            productList.push(proProduct);
          }
          
          let result = [];

          Object.entries(productList).forEach(([key, value]) => {
            Object.entries(value).forEach(([i, j]) => {
              let items = j.items;
              if(typeof items !== "undefined" ){
                result.push(items);
              }
            });
          });
          if(localStorage.getItem('userToken')){
            let catFromLocal = localStorage.getItem('category_permissions');
            if(catFromLocal){
              var allowedCat = catFromLocal.split(',').map(function(item) {
                return parseInt(item, 10);
              });
              result = result.filter((o) => allowedCat.includes(+o.category_id));
              return await result;
            }
          }
          return await productList;
      
      } 
      catch (err) {
        console.error(err)
      }
    }
}

const addToCart = (cartItem) => {
  const jwt = localStorage.getItem('userToken')
  if(cartItem) {
    try
    {
        axios({
          method: 'post',
          url: `${process.env.GATSBY_API_BASE_URL_STARCARE}carts/mine/items`,
          data: cartItem,
          headers : {
            'Authorization' : `Bearer ${jwt}`
          }
        }).then((res) => {
          if(res.statusText === "OK" && res.status === 200){
            return res;
            // alert('succesfully added to cart');
            // viewCartItems();
          }
        }).catch((err) => {
          console.error(err);
          alert(err.response.data.message)
        })
    }catch(err){
      console.error(err)
    }
  }
}

const deleteCart = (id) => {
  const jwt = localStorage.getItem('userToken')
  try{
    axios({  
        method : 'delete',
        url : `${process.env.GATSBY_CART_URL_STARCARE}carts/mine/items/${id}`,
        headers : {
          'Authorization' : `Bearer ${jwt}`
        }  
      }).then((res) => {
        if(res.statusText === "OK" && res.status === 200){
          viewCartItems();
        }
      }).catch((err) =>{
        alert('error occured')
        console.error(err)
      })   
    
  }catch(err){
      console.error(err) 
  }
}

const viewCartItems = () => {
  let resi=[]
  let stocks=[]
  const jwt = localStorage.getItem('userToken');
  const email = localStorage.email;
  try{
    axios({  
        method : 'get',
        url : `${process.env.GATSBY_CART_URL_STARCARE}mycartitems/${email}`,
        headers : {
               'Authorization' : `Bearer ${jwt}`
             }  
      }).then(async (res) => {
        if(res.statusText === "OK" && res.status === 200){
            for(let i=0;i<res.data.length;i++){
              const resp = await fetch(
                `${process.env.GATSBY_CART_URL_STARCARE}cart/productstatus/product_id/${res.data[i].product_id}`
            );
            resi.push(await resp.json());
            }
            for(let i=0;i<resi.length;i++){
              stocks.push(resi[i][0]['stock_status'])
            }
            res.data.forEach(object => {
              object.status = stocks;
            });
            console.log(res.data)
            localStorage.setItem('cartData' , JSON.stringify(res.data))
        }

        return res;
        
      }).catch((err) =>{
        alert('error occured')
        console.error(err)
      })
    
  }catch(err){
      console.error(err)
  }
}

const getCartCount = (value) =>{
  if(value){
    const isBrowser = typeof window !== "undefined"
    if(isBrowser && localStorage.getItem('cartData')){
      let cart = JSON.parse(localStorage.getItem('cartData'))
      return cart.length
    } else {
      return 0
    }
  }
}


const cartTotal = () => {
  if(localStorage.userToken){
    if(localStorage.cartData !== ""){
      let x = JSON.parse(localStorage.cartData)
        if(x.length !== 0){
          var total = x.reduce(function(res,item) {
            return res + (item.price * item.qty);
          }, 0);
          return total;
        }else{
          return 0;
        }
    }else{
      return 0;
    }
  }
}    

const wishListCount = async () => { 
  if(localStorage.userToken){
    try{   
      axios({
        method: 'get',
        url: `${process.env.GATSBY_CART_URL_STARCARE}wishlistcount/${localStorage.email}`,
      }).then((res)=>{
        if(res.statusText === "OK" && res.status === 200){
        localStorage.setItem('wishCount',res.data)   
        }
        return res;

      }).catch((err) =>{
        console.error(err)
      })
    }catch(err){
      console.error(err);  
    }
  }
}

const getWLCount = () =>{
  const isBrowser = typeof window !== "undefined"
      if(isBrowser && JSON.parse(localStorage.getItem('wishCount'))){
       let wish = localStorage.getItem('wishCount')
       return  wish      
      }        
}



export {searchServices,addToCart,deleteCart,viewCartItems,getCartCount,cartTotal,wishListCount,getWLCount}