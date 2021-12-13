import React from "react"
import { useStaticQuery, graphql } from "gatsby";
import Header from '../../Seller/components/header';
import Footer from '../../Seller/components/footer';

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

  <Header/>
<Footer/>



 
 </>
 )
}

 export default Home