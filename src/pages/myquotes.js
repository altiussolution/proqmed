import React, { useState, useEffect } from "react";
import Layout from '../components/layout';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal'
import { useForm } from "react-hook-form";
import PageLoader from "../components/loaders/pageLoader";
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { Link, navigate, useStaticQuery, graphql } from "gatsby"

const MyQuotes = ({ setcartCount }) => {

    const [quotes, setQuotes] = useState([])
    const [quote, setQuotePopup] = useState(false);
    const { register, handleSubmit, errors } = useForm();
    const [showQuote, setShowQuote] = useState(true);
    const handleCloseQuote = () => setShowQuote(false);
    const handleShowQuote = () => setShowQuote(true);
    const [quoteConversations, setQuotesConversations] = useState([])
    const [loader, setLoader] = useState(false);
    const [quoteForm, setQuoteForm ] = useState();
    const [quote_id, setQuoteId] = useState("");

    useEffect(() => {
        const jwt = localStorage.getItem('userToken')
        if(jwt){
          try
          {    
            axios({
              method : 'post',
              url: `${process.env.GATSBY_CART_URL_STARCARE}carts/mine`,
              headers : {
                  'Authorization' : `Bearer ${jwt}`
              }
            })
            .then((response) => {
              if(response.statusText === "OK" && response.status == 200)
              {
                console.log(response.data)
                  localStorage.setItem('cartId',response.data);
                  setQuoteId(localStorage.cartId)
              }
            }) 
            .catch((error) => {
              console.error(error,'error')
            })
          }catch(err){
            console.error(err);
            toast.error('something went wrong')
          }
        }else{
            
        } 
        getQuotes();
    }, [])


    const getQuotes = () => {
        setLoader(true);
        try {
            axios({
                method: "get",
                url: `${process.env.GATSBY_CART_URL_STARCARE}admin/addtoquotelist/${localStorage.customer_id}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.userToken}`
                },
            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {
                    setQuotes(res.data)
                    setLoader(false);
                }

            }).catch((err) => {
                console.error(err)
                setLoader(false);
            })
        } catch (err) {
            console.error(err)
            setLoader(false);
        }
    }



    const removeQuote = (id) => {
        if (window.confirm("Delete the item?")) {
            try {
                axios({
                    method: "post",
                    url: `${process.env.GATSBY_CART_URL_STARCARE}admin/deletequote`,
                    headers: {
                        'Authorization': `Bearer ${localStorage.userToken}`
                    },
                    data: {
                        "data": {
                            "quote_id": id,
                            "customer_id": localStorage.customer_id,
                        }
                    }
                }).then((res) => {
                    if (res.statusText === "OK" && res.status == 200) {
                        toast.success("Quote Deleted Successfully");
                        getQuotes();
                    }
                }).catch((err) => {
                    console.error(err)
                })
            } catch (err) {
                console.error(err)
            }
        }

    }

    // const onSubmitQuote = quoteDetails => {
    //     let quoteData = {
    //         "data":
    //         {
    //             "quote_id": quoteForm['entity_id'],
    //             "conversation": quoteDetails['conversation'],
    //             "quote_qty": quoteDetails['quantity'],
    //             "quote_price": quoteDetails['price_per_item']

    //         }
    //     }

    //     try {
    //         axios({
    //             method: 'post',
    //             url: `${process.env.GATSBY_CART_URL_STARCARE}admin/editquoteconversation`,
    //             data: quoteData,
    //         })
    //             .then(function (response) {
    //                 toast.success('Quote Updated sucessfully')
    //                 handleCloseQuote();
    //                 getQuotes();
    //             })
    //             .catch(function (response) {
    //                 toast.error('An error occured please contact admin')
    //             });

    //     } catch (err) {
    //         console.error(`An error occured ${err}`)
    //     }
    // };

    // const getConversation = (id) => {
    //     try {
    //         axios({
    //             method: "get",
    //             url: `${process.env.GATSBY_CART_URL_STARCARE}admin/quotesconversations/${id}`,
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.userToken}`
    //             },
    //         }).then((res) => {
    //             if (res.statusText === "OK" && res.status == 200) {
    //                 console.error(res)
    //                 setQuotesConversations(res.data)
    //             }

    //         }).catch((err) => {
    //             console.error(err)
    //         })
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }


    const addItemToCart = cartDetails => {
        console.log(cartDetails)
        let cartItem = {
            "cartItem":
            {
                "sku": cartDetails['product_sku'],
                "qty": cartDetails['quote_qty'],
                "quote_id": quote_id
            }
        }
        const jwt = localStorage.getItem('userToken')
        if (cartItem) {
            try {
                axios({
                    method: 'post',
                    url: `${process.env.GATSBY_API_BASE_URL_STARCARE}carts/mine/items`,
                    data: cartItem,
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    }
                }).then((res) => {
                    if (res.statusText === "OK" && res.status == 200) {
                        toast.success('succesfully added to cart');
                        setcartCount();
                    }
                }).catch((err) => {
                    console.error(err);
                    toast.error('Failed to add cart')
                })
            } catch (err) {
                console.error(err)
            }
        }
    }


    return (
        <Layout>
            <section className="inner_banner_section">
            </section>
            {loader ?
                (<div className="mx-auto">
                    <PageLoader />
                </div>) :
                <section className="page_content inner_page">
                    <div className="container boxed-content">
                        <div className="sec_block">
                            <div className=" page_title_sec">
                                <h3 className="text-capitalize">My Quotes</h3>
                            </div>
                            <div className=" compare_section cart_page">
                                <table className="table compareList_table">
                                    <thead>
                                        <tr>
                                            <th>Quote Id</th>
                                            <th>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Quote Price</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {
                                        quotes.map((quote, index) => (
                                            <tbody key={index}>

                                                <tr>

                                                    <td>
                                                        <span>{quote.entity_id}</span>
                                                    </td>
                                                    <td>
                                                        <span>{quote.product_name}</span>
                                                    </td>
                                                    <td>
                                                        <span>{quote.quote_qty}</span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            $ {parseFloat(quote.quote_price).toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td> {quote.status === 'Approved' ?
                                                        <button className="btn_gray btn" onClick={() => addItemToCart(quote)}>
                                                            Add To Cart
                                                        </button>
                                                        : <span>{quote.status}</span>
                                                    }

                                                    </td>
                                                    <td className="action_sec">
                                                        <span>
                                                        {/*<Link to="/myquotesedit" state={quote}> <button className="action action_btn btn btn_gray">Edit
                              </button></Link>

                                                            <button type="button" className="action action_btn btn btn_gray ml-1" onClick={() => removeQuote(quote.entity_id)}> Delete
                                                </button>*/}
                              <Link to="/myquotesedit" state={quote} className="action action_btn btn btn_gray"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                              </Link>
                                                            <a type="button" className="action action_btn btn btn_gray ml-1" onClick={() => removeQuote(quote.entity_id)}> <i className="fa fa-trash-o" aria-hidden="true"></i>
                              </a>
                                                        </span>
                                                    </td>

                                                </tr>
                                            </tbody>
                                        ))
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            }
            {/*quote ? <Modal show={showQuote} onHide={handleCloseQuote} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Quote Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="detail" id="uncontrolled-tab-example">
                        <Tab eventKey="detail" title="Quote Details">

                            <p >Product Name:&nbsp;<span>{quoteForm['product_name']}</span></p>
                            <p >Quote Description :&nbsp;<span>{quoteForm['quote_desc']}</span></p>

                            <form onSubmit={handleSubmit(onSubmitQuote)} action="" className="header_signin_form">
                                <div className="form-group">
                                    <label htmlFor="quantity">Quoted Quantity </label>
                                    <input className="form-control" name="quantity" placeholder="Quantity" type="text" ref={register({
                                        required: true
                                    })} defaultValue={(quoteForm['quote_qty'])} readOnly={true} />
                                    {errors.quantity && errors.quantity.type === 'required' && <span className="error">Quantity is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price_per_item">Quoted Price </label>
                                    <input className="form-control" type="number" name="price_per_item" placeholder="Price Per Item" ref={register({
                                        required: true
                                    })} defaultValue={parseFloat(quoteForm['quote_price']).toFixed(2)} readOnly={true} />
                                    {errors.price_per_item && errors.price_per_item.type === 'required' && <span className="error">Price is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="conversation">Message </label>
                                    <textarea className="form-control" name="conversation" placeholder="Message" ref={register({
                                        required: true
                                    })}>
                                    </textarea>
                                    {errors.conversation && errors.conversation.type === 'required' && <span className="error">Message is required</span>}
                                </div>
                                <button type="submit" className="btn_link theme_btn_blue w-100">Submit</button>
                            </form>
                        </Tab>
                        <Tab eventKey="conv" title="Conversations">
                            {quoteConversations.length > 0 &&
                                <div>
                                    <div className="row page_title_sec">
                                        <h3>Conversations</h3>
                                    </div>
                                    {
                                        quoteConversations.map((conv, index) => (
                                            <div key={index}>
                                                <p>{conv['created_at']} - {conv['sender']}</p>
                                                <p>{conv['conversation']}</p>
                                            </div>
                                        ))
                                    }

                                </div>
                            }
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal> : <div></div>
                        */}
        </Layout >
    )


}

export default MyQuotes
