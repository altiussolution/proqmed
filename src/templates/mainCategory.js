import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout";


const MainCategory = () => {
    const data = useStaticQuery(graphql`
    {
      allCategory {
        edges {
          node {
            name
            id      
          }
        }
      } 
    }  
  `)

  const mainCategory = data.allCategory.edges;

  const renderCategories = () => {
    const list = [];
    let mainCategory3 = mainCategory;
    for (let i = 0; i < mainCategory.length; i += 1) {
        list.push(mainCategory[i]['node']);
    }
    let catFromLocal = localStorage.getItem('category_permissions');
    if(catFromLocal){
      var allowedCat = catFromLocal.split(',').map(function(item) {
        return parseInt(item, 10);
      });
      mainCategory3 = mainCategory.filter((o) => allowedCat.includes(+o.node.id));
      return <div className="row">
        {
            mainCategory3.map((el, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-xs-12 item product_item">
                    <div  className="thumbnail">
                        <div className="product_img">
                            <img className="w-100" src={el.node.image} alt={el.node.image}/>
                        </div>
                        <div className="caption">
                        <p className="product_text">
                            {el.node.name}
                        </p>
                    </div>
                    </div>
                </div>
            ))
        }
    </div>
    } else {
        return <div className="row">
        {
            mainCategory.map((el, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-xs-12 item product_item">
                    <div  className="thumbnail">
                        <div className="product_img">
                            <img className="w-100" src={el.node.image} alt={el.node.image}/>
                        </div>
                        <div className="caption">
                        <p className="product_text">
                            {el.node.name}
                        </p>
                    </div>
                    </div>
                </div>
            ))
        }
    </div>
    }
    
  
  }

    
  return (
    <>
    <Layout>
        <div className="content_wrapper">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12">
                        <div className="category_container">
                            <div className="card">
                            <div className="tools_items">
                                <div className="tools">
                                <span>
                                    Show:
                                </span>
                                <div className="option">
                                    <select className="form-control" id="show_option1">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    </select>
                                </div>
                                </div>
                                <div className="tools">
                                <p className="category-product-count">Showing 01 - 20 of 500</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-5">
            {renderCategories()}
            </div>
        </div>
    </Layout>
    </>
  )
}

export default MainCategory