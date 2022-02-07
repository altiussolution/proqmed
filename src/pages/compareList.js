
import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import PageLoader from '../components/loaders/pageLoader';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';    
import isImageUrl  from 'is-image-url';
import empty_cart from './../assets/empty.png';

const CompareList = () => {
    const [compareLists, setCompareList] = useState([]);
    const [compareAttr, setcompareAttr] = useState([]);
    const [loader, setLoader] = useState(false);
    
    useEffect(() => {
        setLoader(true);
        getCompareList()
        
    }, [])

    const getCompareList = () => {
        let attributesVal = ['image','name','id','sku','price'];
        try {
            axios({
                method: "get",
                url: `${process.env.GATSBY_CART_URL_STARCARE}admin/getcompared/${localStorage.customer_id}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.userToken}`
                },
            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {
                    console.log(res.data)
                    res.data.map((data,ind)=>{
                        Object.entries(data.attributes).map(([val, key])=>{
                            Object.entries(key).map(([key, val],i)=>{
                                if(attributesVal.indexOf(key) == -1){
                                    attributesVal.push(key);
                                }
                                res.data[ind][key] = val;   
                                delete res.data[ind]['attributes']
                                setcompareAttr(attributesVal);
                            })
                        })
                    })
                    setCompareList(res.data)         
                    setLoader(false);
                    console.log(attributesVal)
                }
            }).catch((err) => {    
                console.error(err)
            })
        } catch (err) {
            console.error(err)  
        }
        
    }


    const removeCompareList = (pro_id) => {
        if (window.confirm("Delete the item?")) {
            try {
                axios({
                    method: "post",
                    url: `${process.env.GATSBY_CART_URL_STARCARE}admin/removecompared/${localStorage.customer_id}`,
                    headers: {
                        'Authorization': `Bearer ${localStorage.userToken}`
                    },
                    data: {
                        "data": {
                            "customer_id": localStorage.customer_id,
                            "product_id": pro_id
                        }
                    }
                }).then((res) => {
                    if (res.statusText === "OK" && res.status == 200) {
                        toast.success(res.data);
                        getCompareList()
                    }
                }).catch((err) => {
                    console.error(err)
                })
            } catch (err) {
                console.error(err)
            }
        }
 
    }

    return (
        <>
            <Layout>
                {loader ?
                    (<div className="mx-auto">
                        <PageLoader />
                    </div>) :
                    (<main className="compare_page">
                        <div className="App">
                            <div className="content_wrapper">
                                <div className="container">
                                    <div className="main_title">
                                        <h1>My CompareList <span>({compareLists.length})</span></h1>
                                    </div>
                                   
                                            {/* {localStorage.getItem('sampleVal')} */}
                                           
                                            <div className="row no_data_found">
                                            {compareLists.length == 0 ? <div className="col-lg-12 col-md-12 col-xs-12 text-center">
                                            <img src={empty_cart} alt={"Empty Cart"} />
                                            <h4>No items in CompareList</h4>
                                        </div> :
                                            
                                    <div className="compareList_details table-responsive">
                                        <table className="table compareList_table">
                                        <tbody>
                                            
                                            {/* {compareList.length == 0 ?  <div></div>: */}
                                                 {compareLists ?
                                                 compareAttr.map((tle,ind)=>(
                                                    <tr key={ind}>
                                                        <th>{tle}</th>
                                                        {
                                                            compareLists.map((item,index)=>(
                                                                <td className="compare_product" key={index}>
                                                                    {isImageUrl(item[tle]) ? <img src={item[tle]}/> : <p className={`${tle === 'price' && 'price'}`}>{tle === 'price' ?`$${parseFloat(item[tle]).toFixed(2)}` : item[tle]}</p>}
                                                                    {tle == 'image' &&
                                                                        <div className="close">
                                                                            <button onClick={() => removeCompareList(item.id)} className="close_link">X</button>
                                                                        </div>
                                                                    }
                                                                   
                                                                </td>
                                                            ))
                                                        }
                                                    </tr>
                                                )) : <div></div>
                                                }


                                           
                                        </tbody>
                                        </table>
                                    </div>
}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </main>)
                }
 
            </Layout>
        </>
    )
}


export default CompareList;
