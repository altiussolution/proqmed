import React from "react"
import { Link } from "gatsby"

import Layout from "../Seller/components/layout.js"
import Home from '../Seller/components/home.js'
import 'bootstrap/dist/css/bootstrap.min.css';


const IndexPage = ({data}) =>{
  return (
    <Layout>
    <Home /> 
    </Layout>
    
  )
}

export default IndexPage