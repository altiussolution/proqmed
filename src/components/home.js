import React from "react"
import Mainslider from "./mainslider"
import Offerbottom from "./offerbottom"
import Topcategory from "./topcategory"
import Mostpopular from "./mostpopular"
import Brands from "./brands"
import FeatureProduct from "./featureProduct"
import { useStaticQuery, graphql } from "gatsby";
import "../templates/categorylist.css"
import TrendingProducts from "./trendingProducts"
const Home = ({ children, categories }) => {
  const data = useStaticQuery(graphql`
  query {
    site {
      siteMetadata {
        title
      }  
    }
    allCategory(limit: 12) {
      edges {
        node {
          grand_child {
            id
            name
          }
          id
          name  
          image
        } 
      }
    }
  }
`);  
 
  return (   
  <>
  <Mainslider />
  <FeatureProduct />
  <Offerbottom />
  <Topcategory categories={data.allCategory.edges}/>    
  <Mostpopular /> 
  <Brands />
  <TrendingProducts /> 
  
  </>
  )
}
 
  export default Home