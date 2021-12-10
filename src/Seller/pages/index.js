import React from "react"
import { Link } from "gatsby"

import Layout from "../Seller/components/layout";
import Home from '../../pages/sellerhome';
import 'bootstrap/dist/css/bootstrap.min.css';


const IndexPage = ({data}) =>{
  return (
    <Layout>
    <Home /> 
    </Layout>
    
  )
}

export default IndexPage