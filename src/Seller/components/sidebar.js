import React, { useState } from "react"

import { Link } from "gatsby"
import "../../components/layout.css"
// import styles from "./menu.scss"

const Menu = ()=> {
  const [nav,showNav] = useState(false)

const showmenu = ()=>{
  if(nav==false){
    showNav(true)
  }else if(nav==true){
    showNav(false)
  }
  }
 
    return (
      <div>
   <button onClick={showmenu}>Menu
        {nav && <ul>
        <Link to="/sellerhome"><h1>Dashboard</h1></Link>
        <Link to="/sellerhome"><h1>Inventory</h1></Link>
        <Link to="/sellerhome"><h1>Assign Products</h1></Link>
        <Link to="/sellerhome"><h1>Orders</h1></Link>
        <Link to="/sellerhome"><h1>Discount</h1></Link>
        <Link to="/sellerhome"><h1>Management</h1></Link>
        <Link to="/sellerhome"><h1>Enquiry</h1></Link>
        <Link to="/sellerhome"><h1>Reports</h1></Link>
        </ul>}
      </button>
      </div>
    )
  }

  


export default Menu