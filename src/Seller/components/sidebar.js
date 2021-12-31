import React, { useState, useEffect } from "react";

import { Link } from "gatsby"
import "../../components/layout.css"
// import styles from "./menu.scss"

const Sidebar = ()=> {
 
 
    return (
      <div>
        dgdfdfg 
        <div className="se_sidebar">
      dsfsdfsdf
    </div>
   <button >Menu
        <ul>
        <Link to="/sellerhome"><h1>Dashboard</h1></Link>
        <Link to="/sellerhome"><h1>Inventory</h1></Link>
        <Link to="/sellerhome"><h1>Assign Products</h1></Link>
        <Link to="/sellerhome"><h1>Orders</h1></Link>
        <Link to="/sellerhome"><h1>Discount</h1></Link>
        <Link to="/sellerhome"><h1>Management</h1></Link>
        <Link to="/sellerhome"><h1>Enquiry</h1></Link>
        <Link to="/sellerhome"><h1>Reports</h1></Link>
        </ul>
      </button>
      </div>
    )
  }

  


export default Sidebar