import React, { useState, useEffect } from "react";
import { Link, navigate, useStaticQuery } from "gatsby";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { getCategoryURL } from "../../utils/url";
import { logout } from "./../../services/headerServices";

const Sidebar = () => {


  const [isLoged, setIsLoged] = useState(false);

  const data = useStaticQuery(graphql`
  {
    allCategory {
      edges {
        node {
          id
          name
          grand_child {
            id
            is_active
            name
          }
        }
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`)




  useEffect(() =>{

    if(localStorage.userToken){
      setIsLoged(true);
    }

  }, [])   

  const rendercategory = () =>{
    let allCategory = data.allCategory.edges;
    const elements_in_each_row = Math.round(allCategory.length / 3);
    const list = [];

    for (let i = 0; i < allCategory.length; i += elements_in_each_row) {
      list.push(allCategory.slice(i, i + elements_in_each_row));
    }

    return <ul>
        {     
          list.map((el, index) => (    
            el.map(item => (       
              <li key={item.node.id}>   
                <Link to={getCategoryURL(item.node)} className="itm_list_title">{item.node.name}</Link>
                  <ul className="sub_menus">
                    {
                        item.node.grand_child.map(grand_child =>(
                          <li key={grand_child.id} ><Link to={getCategoryURL(grand_child)} >{grand_child.name}</Link></li>
                        ))
                    }
                  </ul>
              </li>  
            ))
          ))
        }
      </ul>

  }

  return (   
    <div className="sidenav">
      <div className="sidenav_content">
        <div className="sidebar_links">
          <ul>  
            {isLoged && <li onClick={() => { logout('logOut'); navigate('/')}}>
              Logout
            </li>}
            {!isLoged && <li>
              <Link to="/signup">Register</Link>
            </li>}
           {!isLoged && <li>
              <Link to="/signin">Login</Link>
            </li>}
          </ul>
        </div>

        <div className="sidenav_menus">
          {rendercategory()}
        </div>

        <div className="my_accounts">
          <div className="sidebar_links">
            <p>My Accounts</p>
          </div>
          <ul>
            <li>
              <Link to="/cart">My Cart</Link>
            </li>
            <li>
              <Link to="/orders">My Orders</Link>
            </li>

            <li>
              <Link to="/wishlist">My Whishlist</Link>
            </li>
            <li>
              <Link to="/compareList">CompareList</Link>
            </li>

            <li>
              <Link to='/changePassword'>Change Password</Link>
            </li>
          </ul>
        </div>

        <a href="javascript:void(0)" className="closebtn">×</a>
        {/* <a href="javascript:void(0)">&times;</a> */}
      </div>
    </div>
  )

}

export default Sidebar;
