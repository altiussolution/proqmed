
import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import PageLoader from '../components/loaders/pageLoader';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';    
import isImageUrl  from 'is-image-url';

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
                                        <h1>My <span>CompareList</span></h1>
                                    </div>
                              
                                    <div className="compareList_details table-responsive">
                                        <table className="table compareList_table">
                                        <tbody>
                                            {
                                            compareLists?.length == 0 ?  <td>No items found</td>:
                                                 compareAttr.map((tle,ind)=>(
                                                    <tr>
                                                        <th>{tle}</th>
                                                        {
                                                            compareLists.map((item,index)=>(
                                                                <td className="compare_product">
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
                                                ))

                                            }
                                        </tbody>
                                        </table>
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
