import React, {  useState,useEffect }from "react";
import Layout from "../components/layout";
import axios from "axios";
import StarRatings from 'react-star-ratings';
import { getProductURL } from './../utils/url';
import { Link } from "gatsby";
import Dropdown from 'react-bootstrap/Dropdown'

const SourceProduct = () => {

    const [soProduct, sourceProduct] = useState([]);
    const [storeList, storeName] = useState([]);

    
    useEffect(() => {
        storeDropdown()
       
    }, [])

    const sourceProductApi = (code) => {
        try{
            axios({
                method : "get",
                url: `${process.env.B2B_API_BASE_URL}sourceproductlist/${code}`,
            }).then((res) => {
                if(res.statusText === "OK" && res.status == 200){
                  sourceProduct(res.data)
                }
                
            }).catch((err) => {  
                console.error(err);
            })
        }
        catch(err){
            console.error(err)
        }    
    }

    const storeDropdown = () => {
        
        try{
            axios({
                method : "get",
                url:  `${process.env.B2B_API_BASE_URL}sourcelist`,
            }).then((res) => {
                if(res.statusText === "OK" && res.status == 200){
                    storeName(res.data)
                    sourceProductApi(res.data[0].sourceCode)
                }
                
            }).catch((err) => {  
                console.error(err);
            })
        }
        catch(err){
            console.error(err)
        }

    }

    const sourceList = () => {      
          return <>        
{soProduct.length ==0?<span>Product not found</span>: 
    (soProduct.map((data,index) => (
        <div className="brandedpro_item" key={index}>
            <div className="products">
                <Link to={getProductURL(data)} ><img className="product_img" src={data.image}  /></Link>
                <h4 className="product_name"><Link to={getProductURL(data)} >{data.name}</Link></h4>
                <p className="product_number"><span><strong>Model:</strong> {data.sku}</span></p>
                <p className="product_number"><span><strong> Price:</strong> ${Math.round(data.price)} </span></p>                              

            </div>
        </div>
    )))
        
}
     </>
        
      }
    return (
        <Layout>
                               
            <section className="page_content inner_page">
                <Dropdown>
                  <Dropdown.Toggle variant='Secondary' id="dropdown-basic" >
                  StoreList
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                  {storeList.map((item,index)=>{
                      return <Dropdown.Item key={index} onClick={() => { sourceProductApi(item.sourceCode) }}>{item.sourceName}</Dropdown.Item>
                    }) 
                    } 
                  </Dropdown.Menu>
                  </Dropdown>
            <div className="content_wrapper">
                <div className="container">
                    <div className="row main_title">
                        <h1><span>SourceProduct</span></h1>
                    </div>
                    <div className="row product_list">
                       {sourceList()}
                    </div>
                </div>
            </div>
        </section>

        </Layout>
    )
}

export default SourceProduct