import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Header from "./header"
import Footer from "./footer" ;
import "./layout.css";


const Layout = ({ children, cartCount }) => {
 return(
  <>
  <Header/>
<Footer/>
</>
 )
}




export default Layout




