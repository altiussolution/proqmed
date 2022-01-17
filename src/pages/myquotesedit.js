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

const MyQuotesEdit = ({location} ) => {

    const [quotes, setQuotes] = useState([])
   // const [quote, setQuotePopup] = useState(false);
    const { register, handleSubmit, errors } = useForm();
    const [showQuote, setShowQuote] = useState(true);
    const handleCloseQuote = () => setShowQuote(false);
    const handleShowQuote = () => setShowQuote(true);
    const [quoteConversations, setQuotesConversations] = useState([])
    const [loader, setLoader] = useState(false);
    const [quoteForm, setQuoteForm ] = useState([]);
    const [edit, editdata] = useState([]);

    useEffect(() => {
console.log(location.state)
        if(location.state){
            setQuoteForm(location.state)
            console.log("oi",setQuoteForm)
            console.log(quoteForm["entity_id"])

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



 

    const onSubmitQuote = quoteDetails => {
        let quoteData = {
            "data":
            {
                "quote_id": quoteForm['entity_id'],
                "conversation": quoteDetails['conversation'],
                "quote_qty": quoteDetails['quantity'],
                "quote_price": quoteDetails['price_per_item']

            }
        }

        try {
            axios({
                method: 'post',
                url: `${process.env.GATSBY_CART_URL_STARCARE}admin/editquoteconversation`,
                data: quoteData,
            })
                .then(function (response) {
                    toast.success('Quote Updated sucessfully')
                    handleCloseQuote();
                    getQuotes();
                })
                .catch(function (response) {
                    toast.error('An error occured please contact admin')
                });

        } catch (err) {
            console.error(`An error occured ${err}`)
        }
    };

    const getConversation = (id) => {
        try {
            axios({
                method: "get",
                url: `${process.env.GATSBY_CART_URL_STARCARE}admin/quotesconversations/${id}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.userToken}`
                },
            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {
                    console.error(res)
                    setQuotesConversations(res.data)
                }

            }).catch((err) => {
                console.error(err)
            })
        } catch (err) {
            console.error(err)
        }
    }


    return (
        <Layout>
            <section className="inner_banner_section">
            </section>
         
                    <h6>Update Quote Details</h6>
                
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
                                    })} defaultValue={(quoteForm['quote_price'])} readOnly={true} />
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
             
        </Layout >
    )


}

export default MyQuotesEdit