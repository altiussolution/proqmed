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
          <Navbar id="basic-navbar-nav" className="cart-top-holder">
            <Nav className="mr-auto">
              <ul className="cart_top">
              { <li>
              <Link to="/wishlist" data-toggle="tooltip" title="Wishlist"><span>{isLoged ?  getWLCount(isLoged) : 0 }</span><img src={wishlistTop}/></Link>                
              </li>}
              { <li>
              <Link to="/cart" data-toggle="tooltip" title="Cart"><span>{isLoged ? getCartCount(isLoged) : 0}</span><img src={cart}/></Link>                
              </li>}
              <li>
                {isLoged && <a className="price_top">${parseFloat(cartTotal()).toFixed(2)}</a> }               
              </li>
            </ul>
            </Nav>     
        </Navbar>
    </>  
)
}   

export default CartCount