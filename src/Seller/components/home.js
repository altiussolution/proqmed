import React from "react"
import { useStaticQuery, graphql } from "gatsby";
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



 
 </>
 )
}

 export default Home