import React from "react";
import { Router } from "@reach/router";
import Product from "../templates/Product";
import Layout from "../components/layout";

const ProductPage = props => {
  return (
    
      <div className="summa">
        <Router>
          <Product path="/products/:slug" />
        </Router>
      </div>
  );
};

export default ProductPage;
