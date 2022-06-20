import React, { useState } from "react"
import { Link } from "gatsby"
import $ from 'jquery';
import Layout from "../components/layout"
import Home from '../components/home.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCartCount } from "../utils/apiServices";


const IndexPage = ({data}) =>{
  const [cartCount, setcartCount] = useState(getCartCount());
  return (
    <Layout cartCount={cartCount}>
    <Home /> 
    </Layout>
    
  )
}

export default IndexPage
