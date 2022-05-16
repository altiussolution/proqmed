import React from "react";
import { Router } from "@reach/router";
import Products from "../templates/Products";
import Layout from "../components/layout";

const CategoriesPage = props => {
  return (
    
      <div className="summa">
       <Router>
          <Products path="/categories/:slug/" />
          </Router>
      </div>
  );
};

export default CategoriesPage;