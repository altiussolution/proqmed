import React , { useEffect } from "react";
import { Link } from "gatsby"
import Layout from "../components/layout";
import { getCategoryURL } from "../utils/url";
import ImageNotFound from "./../assets/not-found.png";
import { IoGridOutline } from "react-icons/io5";
import Brands from "../components/brands";
import FeatureProduct from "../components/featureProduct";


export default function Category(props) {

  const { pageContext } = props;
  // const { State } = props.location;

  useEffect(() => {
    console.log(props)
  }, [pageContext]);

  const renderCategories = () => {

    return <div id="products" className="row list-group">
      {
        pageContext.children_data.map(({ id, name, children_data, image, product_count }, index) => (
         <>{product_count !=0 && <div key={index} className="item product_item">
            <Link key={id} to={getCategoryURL({ id, name })} state={pageContext}>
              <div className="thumbnail">
                <div className="product_img">
                  <img src={`${image}`} alt={name} onError={e => (e.target.src = ImageNotFound)} />
                </div>
                <div className="caption">
                  <p className="product_text">
                    {name}
                  </p>
                  <div className="rating_field">
                    <div className="star-rating">
                      <span className="fa fa-star-ofa far fa-star" data-rating="1"></span>
                      <span className="fas fa-star" data-rating="2"></span>
                      <span className="far fa-star" data-rating="3"></span>
                      <span className="far fa-star" data-rating="4"></span>
                      <span className="far fa-star" data-rating="5"></span>
                      <input type="hidden" name="whatever1" className="rating-value" value="2.56" />
                    </div>

                  </div>
                </div>
              </div>
            </Link>
          </div> } </>
        ))
      }
    </div>
  }

  return (

    <Layout>
      <div className="App">
        <div className="content_wrapper">
          <div className="container">
            <div className="">
              <h1 className="page-title"><span>{pageContext.name}</span>
                {/* <div className="mt-2 mb-2 mx-2">
                  <p>
                    {pageContext.hierarchy.map(parent => (
                      <>{parent.product_count > 0 && <React.Fragment key={parent.id}>
                        <Link
                          className="text-gray-600 hover:text-gray-800"
                          to={getCategoryURL(parent)}
                        >
                          <span>{parent.name}</span>
                        </Link>

                      </React.Fragment>}</>
                    ))}
                    <span>{pageContext.hierarchy.length > 0 && pageContext.name}</span>
                  </p>
                </div> */}
              </h1>
            </div>
            <div className="row catgoryPage">
              <div className="col-lg-12 col-md-12 col-xs-12">
                <div className="category_container">
                  <div className="card d-none">
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

                    <div className="tools_items">
                      <div className="tools">
                        <span>
                          Sort by:
                  </span>
                        <div className="option">
                          <select className="form-control" id="sort_option1">
                            <option>Relavance</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                      <div className="tools">
                        <span className="title_view">
                          <Link to="" className="view-grid  active" id="grid" data-toggle="tooltip" data-placement="top" title="Grid"><IoGridOutline /></Link>
                          <Link to="" className="view-list" id="list" data-toggle="tooltip" data-placement="top" title="List"><i className="fas fa-list"></i></Link>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="cat_scroll products_collection">
                    <div className="">
                      {renderCategories()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
        <FeatureProduct />
        <Brands />

      </div>
    </Layout>
  )
}
