import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Sidebar from "./sidebar"
import Header from "./header"
import Footer from "./footer" 
import "./layout.css"


const Layout = ({ children, cartCount }) => {
 return(
  <>
  
 
  <Header/>
  
<Footer/>
</>
 )
}




export default Layout




