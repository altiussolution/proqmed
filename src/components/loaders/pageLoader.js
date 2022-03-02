import React from "react";
import "./pageLoader.css";

const PageLoader = () => {
  return (
    <div className="loader_overlay">
    <div className="gooey">
      <span className="dot"></span>
      <div className="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    
    </div>
  );
};

export default PageLoader;
