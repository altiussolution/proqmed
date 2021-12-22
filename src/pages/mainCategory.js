import { useStaticQuery, graphql, Link } from "gatsby"
import React from "react"
import Layout from "../components/layout";
import { getCategoryURL } from "../utils/url";
import "./../templates/categorylist.css";
import ImageNotFound from "./../assets/not-found.png"


import Brands from "../components/brands";
import FeatureProduct from "../components/featureProduct";

const MainCategory = () => {
  const data = useStaticQuery(graphql`
    {
      allCategory {
        edges {
          node {
            grand_child {
              id
              name
            }
            name
            image
            id
          }
        }
      }
    }
  `)

  const mainCategory = data.allCategory.edges;

  const renderCategories = () => {
    return <div id="products" className="row list-group catgoryPage">
      {
        mainCategory.map((el, index) => (
          <Link to={getCategoryURL(el.node)}
            key={index} className="item product_item">
            <div className="thumbnail">
              <div className="product_img">
                <img className="img-fluid" src={`${el.node.image}`} onError={e => (e.target.src = ImageNotFound)} alt={el.node.image} />
              </div>
              <div className="caption">
                <p className="product_text">
                  {el.node.name}
                </p>
              </div>
            </div>
            <ul className="sub_categoriesList">
              {
                el.node.grand_child.map((e, index) => (
                  <li key={e.name}><Link className="sub_categoriesItem" to={getCategoryURL(e)}>{index}{e.name}</Link></li>
                ))
              }
            </ul>
          </Link>
        ))
      }
    </div>

  }


  return (
    <>
      <Layout className="catgoryPage">
        <div className="content_wrapper">
          <div className="container">
            <div className="page-title">
              <h1 className="page-title"><span>Category</span>
              </h1>
            </div>
          </div>

          <section className="category_container">
            <div className="cat_scroll">
              <div className="container">
                {renderCategories()}
              </div>
            </div>
            
          </section>
          
          <section className="add-banner upper-space">
          <div className="container">
              <div className="categoryDesc">
                <h3>CategoryName</h3>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.
              </p>
              </div>
            </div>
          </section>
        </div>

        <FeatureProduct />
        <Brands />

      </Layout>
    </>
  )
}

export default MainCategory