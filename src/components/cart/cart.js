import React,{useState, useEffect} from "react";
import cart from './../../assets/ic_cart_top.png';
import wishlistTop from './../../assets/ic_wishlist_top.png';
import { Navbar,Nav } from 'react-bootstrap';
import {Link} from 'gatsby'
import {cartTotal, getCartCount,getWLCount} from '../../utils/apiServices'; //wishListCount
     
const CartCount = (data) => {  

  const [isLoged, setIsLoged] = useState(undefined);
 
  useEffect(() =>{

    if(localStorage.userToken){
      setIsLoged(localStorage.userToken);
    }

  }, []) 


return (  
    <>
          
              
              {/* { <li>
              <Link to="/wishlist" data-toggle="tooltip" title="Wishlist"><span>{isLoged ?  getWLCount(isLoged) : 0 }</span><img src={wishlistTop}/></Link>                
              </li>} */}
              
              {
                isLoged &&
              <Link to="/cart" data-toggle="tooltip" title="Cart">
              <div className="cart_img_holder"><span className="cart_count">{isLoged ? getCartCount(isLoged) : 0}</span> <span className="cart_svg"> </span></div>
              </Link>                
             }
              {
                !isLoged &&
              <Link to="/signin" data-toggle="tooltip" title="Cart">
              <div className="cart_img_holder"> <span className="cart_count">{isLoged ? getCartCount(isLoged) : 0}</span> <span className="cart_svg"> </span> 
              </div>
              </Link>                
             }
             <div className="cart_text">
              <span>My Cart</span>
                {isLoged &&  <div>${parseFloat(cartTotal()).toFixed(2)}</div>  }      
                {!isLoged &&  <div>$0.00</div>}       
                </div>

            
               
        
    </>  
)
}   

export default CartCount