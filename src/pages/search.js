import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import axios from "axios";
import "./../templates/categorylist.css"
import CategoryCard from "./../components/categoryCard/caregoryCard"
import { searchServices } from "./../utils/apiServices";
import FilterProduct from "./../components/FilterProduct";
import PageLoader from "../components/loaders/pageLoader";
import { convertToObject } from "../utils/convertToObj"

const Search = (props,pageContext) => {  
  
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null); 
    const [searchProducts, setSearchProducts] = useState([]);
    const searchTerm = props.location.search.replace("?keyword=", "");

    useEffect(() => {
        setLoading(true);
        let ignore = false;  
        const fetchSearch = async () => {
            try{   
                const res = await axios(
                  `${process.env.GATSBY_NODE_URL_STARCARE}search/${searchTerm}`
                );
      
                let productList = [];               
                for(let prod of res.data[0]){
                  prod[0][1].push(prod[0][0])  
                  let proProduct = prod[0][1];
                  productList.push(proProduct);
                }
                setSearchProducts("hi")
                let result = [];

                Object.entries(productList).forEach(([key, value]) => {
                  Object.entries(value).forEach(([i, j]) => {
                    let items = j.items;
                    if(typeof items !== "undefined" ){
                      result.push(items);
                    }
                  });
                });
                if(localStorage.getItem('userToken')){
                  let catFromLocal = localStorage.getItem('category_permissions');
                  if(catFromLocal){
                    var allowedCat = catFromLocal.split(',').map(function(item) {
                      return parseInt(item, 10);
                    });
                    result = result.filter((o) => allowedCat.includes(+o.category_id));
                    console.log(result)
                    await setProducts(result);
                    // return await result;
               
                  }else {
                    await setProducts(productList);
                  }
                }
                
                setLoading(false);
            }catch (err) {
                if (!ignore) {
                  setLoading(false);
                  setError(`Something went wrong. ${err}`);
                }
              }
        };
        fetchSearch();
        
        return () => {  
            ignore = true;
          };
      }, [searchTerm]);   


    const renderSearchCard = () => {
      //  if(products.length !== 0)
       if(products.length !== 0){
            return products.map(product => {
              const data = convertToObject(product.flat());
              // return <div key={data.items.id}>{data.items.name}</div>
              return <CategoryCard data={{values:data,crumpy:pageContext}} key={data.items.id} />;
            }); }
            else {
            return (
              <div className="mx-auto">
                {/* <NoProducts /> */}
                {/* is no product */}
                <h2 className="text-2xl text-center mt-4">No items found!</h2>
              </div>
            );
            }
        // else if(searchProducts.length === 0)  {
        //   if (searchProducts == "empty")
        //     return (
        //       <div className="mx-auto">
        //         {/* <NoProducts /> */}
        //         <h2 className="text-2xl text-center mt-4">No Items Found!</h2>
        //         <p className="text-center">Try clearing all filters</p>
        //       </div>
        //     );
        //   else
        //     return searchProducts.map(data => (
        //       // <div key={data.items.id}>{data.items.name}</div>
        //       <CategoryCard data={{values:data,crumpy:pageContext}} key={data.items.id} />
        //     ));
        
       
        //     }
            
      };
    

    return(
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
                        <div className="col-lg-2 col-md-2 col-xs-12">
                            <div className="category_sidebar">
                             {products && products.length > 0 && (
                                <FilterProduct
                                location={props.location}
                                handleFilterChange={setSearchProducts}
                                products={products}
                                doClear = {true}
                                />
                            )} 
                            </div>
                        </div>
                        <div className="col-lg-10 col-md-10 col-xs-12">
                            <div className="category_container">
                                <div className="cat_scroll">
                                    <div className="container_">
                                        <div id="products" className="row list-group">
                                            {renderSearchCard()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
        )}
        </Layout>
        </>
    )

}

export default Search;