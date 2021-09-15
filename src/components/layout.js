/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Header from "./header"
import Footer from "./footer" ;
import "./layout.css";


const Layout = ({ children, cartCount }) => {
  const data = useStaticQuery(graphql`
  {
    allCategory {
      edges {
        node {
          id
          name
          grand_child {
            id
            is_active
            name
          }
        }
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`)

  return ( 
    <>  
      <Header siteTitle={data.site.siteMetadata?.title || `Title`}  allCategory = {data.allCategory.edges} />
  <main>{children}</main>
  <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
