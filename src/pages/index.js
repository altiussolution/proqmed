import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Home from '../components/home.js'
import 'bootstrap/dist/css/bootstrap.min.css';


const IndexPage = ({data}) =>{
  return (
    <Layout>
    <Home /> 
    </Layout>
    
  )
}

export default IndexPage
