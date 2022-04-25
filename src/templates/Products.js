import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "gatsby";
import Layout from "../components/layout";
import PageLoader from "../components/loaders/pageLoader";
import { TablePagination } from '@mui/material';
import FilterProduct from "../components/FilterProduct";
import CategoryCard from "../components/categoryCard/caregoryCard";
import { convertToObject } from "../utils/convertToObj";
import { ImageNotFound } from "../assets/No_image_available.png.webp"
import { getCategoryURL } from "./../utils/url";
import { IoGridOutline } from "react-icons/io5";
import { IoList } from "react-icons/io5";
import { IoChevronForwardOutline } from "react-icons/io5";
import empty_cart from './../assets/empty.png';
import { checkLogin } from "../services/headerServices";

const Hamburger = ({ pageContext }) => {
  return (
    <div className="mt-1 mb-2">
      {pageContext.hierarchy.map(parent => (
        <React.Fragment key={parent.id}>
          <Link
            className="text-gray-600 hover:text-gray-800"
            to={getCategoryURL(parent)}
          >
            <span dangerouslySetInnerHTML={{ __html: parent.name }} />
          </Link>
          &nbsp;&nbsp; <IoChevronForwardOutline /> &nbsp;&nbsp;
        </React.Fragment>
      ))}
      <span dangerouslySetInnerHTML={{ __html: pageContext.name }} />
    </div>
  );
};


const NoProductsFound = ({ error }) => {
  return (
    <>
      <div className="max-w-md my-0 mx-auto">
        no product here
      </div>
      <div className="flex flex-col items-center no_data_found">
        <img src={empty_cart} alt={"Empty Cart"} />
        <h4>No items found!</h4>
        {error && error}
        <p className="my-4">
          Go Back
        </p>
      </div>
    </>
  );
};

const Products = ({ pageContext, location , props }) => {
  const [page, setPage] = React.useState(0);
  const [permits,setPermit] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [products, setProducts] = useState([]);
  const [productTemp, setProductTemp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewClass, setViewClass] = useState('grid_view');
  const [activepage, setActivepage] = useState(1);
  const [cat_url, setcategoryUrl] = useState([]);
  const [p,per] = useState(false);
  const [pcar,percart] = useState(false);
  const [outp,outper] = useState(false);
  const [outpcar,outpercart] = useState(false);
  // const [cName, setClassName] = useState('grid_view');

  useEffect(() => {
    console.log(pageContext)
    const newHierarchy = JSON.parse(JSON.stringify(pageContext.hierarchy));
    newHierarchy.push({"id":pageContext.id,"name":pageContext.name});
    sessionStorage.setItem('Hierarchy',JSON.stringify(newHierarchy));
    const selecturl = "productsasc"
    const id = pageContext.id;  
    const selectRes =[];
    const fetchProductsasc = async () => {
    try {
      await axios({
          method: 'get',
          // url: `${process.env.GATSBY_CART_URL_STARCARE}admin/products/${id}`,
          url: `${process.env.GATSBY_NODE_URL_STARCARE}data/products/${id}.json`
      }).then((res) => {
          if (res.statusText === "OK" && res.status == 200) {
            // for(let response of res.data[0]){
            //   selectRes.push(response[0])
            // }
            console.log(res.data)
             setProducts(res.data);
            setLoading(false);
          }
      }).catch((err) => {
          console.error(err);
      })
    } catch (err) {
      console.error(err)
    }
  }
    if(!localStorage.permissions){
      outper(true)
      outpercart(true)
     } else {
      let hi = JSON.parse(localStorage.permissions)
      let addwis=hi.includes("Can Add To Wishlist")
      let addcar=hi.includes("Can Add To Cart")
      per(addwis)
      percart(addcar)
     }
  
    // let ignore = false;
    // await checkUrl() 
    const fetchProducts = async (id) => {
      setLoading(true)
      // try {
      //   const resp = await axios(
      //     `${process.env.GATSBY_NODE_URL_STARCARE}getproducts/${id}`,
      //   );
      // } catch (er){

      // }
      try {
        const response = await axios(
          // `${process.env.GATSBY_NODE_URL_STARCARE}data/products/${id}.json`,
          // `${process.env.GATSBY_CART_URL}admin/products/${id}`
          `${process.env.GATSBY_CART_URL_STARCARE}admin/products/${id}`,
        );
        // if (!ignore) {

          let productList = [];

          for (let prod of response.data[0]) {
            prod[0][1].push(prod[0][0])
            let proProduct = prod[0][1];
            productList.push(proProduct);
          }
          console.log(productList)
          if(response.data[0]=[]){
            setLoading(false);

          }
          console.log(productList)
              
          setLoading(false);
          // if (checkLogin()) {
          //   axios({
          //     method: "get",
          //     url: `${process.env.GATSBY_CART_URL_STARCARE}admin/compulsorylogincustomer/${localStorage.customer_id}`,
          //   }).then((res) => {
          //     setcategoryUrl(res.data)
          //     productList.map(product => {
          //       const data = convertToObject(product.flat());
          //       let URL;
          //        res.data.map(cusUrl=>{
          //         if(data.items.url_key === cusUrl.url) return URL = cusUrl.url             
          //        })
          //        if(data.items.url_key !== URL){
          //         setProductTemp(productList)
          //         setProducts(productList)
          //         setLoading(false);
          //        } else {
          //         setProductTemp([])
          //         setProducts([])
          //         setLoading(false);
          //        }  
          //       });
          //   }).catch((err) => {
          //     console.error(err);
          //   });
          // } else {
          //   setProductTemp(productList)
          //   setProducts(productList)
          //   setLoading(false);
          // }
        // }
      } catch (err) {
        // if (!ignore) {
          setLoading(false);
          setError(`Something went wrong. ${err}`);
        // }
      }
    }
    fetchProductsasc()
    fetchProducts(pageContext.id);
   
  }, [pageContext.id]);


  const renderProducts = () => {
    if (filteredProducts.length) {
      console.log(filteredProducts)
      if (filteredProducts === "empty")
        return (
          <div className="mx-auto no_data_found">
            <img src={empty_cart} alt={"Empty Cart"} />
            <h4>No items found!</h4>
            <p className="text-center">Try clearing all filters</p>
          </div>
        );
      else
         return filteredProducts.map(data => {
          let URL;
           cat_url.map(cusUrl=>{ 
            if(data.items.url_key === cusUrl.url) return URL = cusUrl.url             
           })
           if(data.items.url_key !== URL){
          return  <CategoryCard data={{values:data,crumpy:pageContext}} dataClass={viewClass} key={data.items.id} />
        }  
          
      });
    } else if (products.length) {
      let URL;
      return products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => {
        const data = convertToObject(product.flat());
         cat_url.map(cusUrl=>{
          if(data.items.url_key === cusUrl.url) return URL = cusUrl.url             
      })
      if(data.items.url_key !== URL){
        return <CategoryCard data={{values:data,crumpy:pageContext}} dataClass={viewClass} key={data.items.id} />;
         } 
    });
    } else
      return (
        <div className="mx-auto no_data_found">
          <img src={empty_cart} alt={"Empty Cart"} />
          <h4>No items found !</h4>
        </div>
      );

  };

  const handleChangePage = (event, newPage) => {
    // let index = e.target.value;
    // console.log(index)
    // var selectValue = [];
    // for(var i=0;i<index;i++){
    //   if(productTemp[i] !== undefined){
    //   selectValue.push(productTemp[i])
    //   }
    // }
    console.log(newPage)
    setPage(newPage);
    // await setProducts(products.slice(0, index));
    // await setProducts(selectValue);
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
// const checkUrl =()=>{
//   if (checkLogin()) {
//      axios({
//        method: "get",
//        url: `${process.env.B2B_API_BASE_URL}compulsorylogincustomer/${localStorage.customer_id}`,
//      }).then((res) => {
//        setcategoryUrl(res.data)
//      }).catch((err) => {
//        console.error(err);
//      });
//    } 
// }
  const shortBySelected = (event) => {
    // setLoading(true);
    const selecturl = event.target.value;
    if(event.target.value == ""){
      event.target.value="productsasc"
    }
    const id = pageContext.id;  
    const selectRes =[];
    try {
      axios({
          method: 'get',
          url: `${process.env.GATSBY_CART_URL_STARCARE}admin/${selecturl}/${id}/${localStorage.customer_id}`,
      }).then((res) => {
          if (res.statusText === "OK" && res.status == 200) {
            for(let response of res.data[0]){
              selectRes.push(response[0])
            }
            setProducts(selectRes);
            console.log(selectRes)
            // setLoading(false);
          }
      }).catch((err) => {
          console.error(err);
      })
    } catch (err) {
      console.error(err)
    }

  }

  const handlePageChange = (pageNumber) => {
    console.error(`active page is ${pageNumber}`);
    setActivepage(pageNumber);
  }

  return (
    <>
      <Layout>

        {loading ? (
          <div className="mx-auto">
            <PageLoader />
          </div>
        ) : (
            <div className="content_wrapper">

              <div className="container">
                

  

                <div className="row">
                  <div className="col-lg-3 col-md-4 col-xs-12">

                    <div className="category_sidebar">
                      {products && products.length > 0 && (
                        <FilterProduct
                          location={location}
                          handleFilterChange={setFilteredProducts}
                          products={products}
                          menuOpen={menuOpen}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-8 col-xs-12 ">
                  <h1 className="page-title">
                    <div>
                    <span>{pageContext.name} </span>
                  <div className="breadcrumbs_sec" >
                    <Hamburger pageContext={pageContext} />
                  </div>
                  </div>
                  <div className="tools_items">
                          <div className="tools">
                            <span>
                              Sort by:
                    </span>
                            <div className="option">
                              <select className="form-control" id="sort_option1" onChange={shortBySelected} >
                                <option value = "productsasc">Name Asc</option>
                                <option value = "productsdesc">Name Desc</option>
                                <option value = "productspriceasc">Price Asc</option>
                                <option value = "productspricedesc">Price Desc</option>
                                <option value = "productsdateasc">Created Date Asc</option>
                                <option value = "productsdatedesc">Created Date Desc</option>
                              </select>
                            </div>
                          </div>
                          <div className="tools">
                            <div className="title_view">
                              <button  className={"view-btn list-view"+(viewClass === 'list_view' ? ' active_btn':'')} id="list" data-toggle="tooltip" data-placement="top" title="List" onClick={() => setViewClass('list_view')}><IoList /></button>
                              <button  className={"view-btn grid-view"+(viewClass === 'grid_view' ? ' active_btn':'')} id="grid" data-toggle="tooltip" data-placement="top" title="Grid" onClick={() => setViewClass('grid_view')}><IoGridOutline /></button>
                              {/* className="view-list"
                              className="view-grid  active"  */}
                       </div>
                          </div>
                        </div>
                </h1>
                    <div className="category_container">
                    
                      <div className="cat_scroll">
                        <div className="container">
                          <div id="products" className="row list-group">

                            {renderProducts()}

                          </div>

                          {/* <nav className="page_navigation paging">
                        <a className="page-link page_prev disabled" href="#" aria-label="Previous">
                            <span aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="9.36" height="17" viewBox="0 0 9.36 17"><g transform="translate(63.473 17) rotate(180)"><path d="M63.225,7.893,55.58.251a.858.858,0,0,0-1.215,1.213L61.4,8.5l-7.038,7.036a.859.859,0,1,0,1.215,1.214l7.645-7.642A.866.866,0,0,0,63.225,7.893Z" transform="translate(0 0)" fill="#afafaf"/></g></svg>
                            </span>
                        </a>
                        <ul className="pagination mb-0">
                          <li className="page-item active"><a className="page-link" href="#">1</a></li>
                          <li className="page-item"><a className="page-link" href="#">2</a></li>
                          <li className="page-item"><a className="page-link" href="#">3</a></li>
                        </ul>
                        <a className="page-link page_next" href="#" aria-label="Next">
                            <span aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="9.36" height="17" viewBox="0 0 9.36 17"><g transform="translate(-54.113)"><path d="M63.225,7.893,55.58.251a.858.858,0,0,0-1.215,1.213L61.4,8.5l-7.038,7.036a.859.859,0,1,0,1.215,1.214l7.645-7.642A.866.866,0,0,0,63.225,7.893Z" transform="translate(0 0)" fill="#afafaf"/></g></svg>
                            </span>
                        </a>
                    </nav> */}
                    
                        </div>
                      </div>
                      {products && products.length > 0 && (
                      <div className="card">
                        <div className="tools_items">
                          <div className="tools">
                            {/* <span>
                              Show:
                    </span> */}
                            <div className="option">
                              {/* <select className="form-control" id="show_option1"  onChange={showSelected}>
                    
                                <option value="5" >5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="25">25</option>
                                <option value="30">30</option>
                                <option value="35">35</option>
                                <option value="40">40</option>
                                <option value="45">45</option>
                                <option value="50">50</option>
                              </select> */}
                               <TablePagination
  component="div"
  rowsPerPageOptions={[10,20,30,40,50,60]}
  page={page}
  count={products.length}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
                            </div>
                          </div>
                          {/* <div className="tools">
                            <p className="category-product-count">Showing 01 - 20 of {products.length}</p>
                          </div> */}
                        </div>

                        
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              </div>            
            </div>
         ) }
      </Layout>
    </>

  );
};

export default Products;
