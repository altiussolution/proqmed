import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab'
import { navigate, Link } from "gatsby";
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { useForm } from "react-hook-form";
import PageLoader from "../components/loaders/pageLoader";
import { getCartCount } from "./../utils/apiServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckOut = ({location}) => {

    const { register, handleSubmit, errors } = useForm();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [checkOutDetails, setCheckout] = useState([]);
    const [shippingAddress, setShippingAddress] = useState([])
    const [jwt, setJwt] = useState("")
    const [selAddIndex, setIndex] = useState(0)
    const [paymentType, setPaymentType] = useState(null)
    const [cartItems, setcartItems] = useState([]);
    const [key, setKey] = useState('shipping');
    const [selected, setSelected] = useState("");
    const [region, setRegion] = useState([]);
    const [state, setState] = useState([])
    const [loader, setLoader] = useState(false);
    const [addressEdit, setaddressEdit] = useState(false);
    const [uEmail, setUEmail] = useState();
    const [co,coun]= useState(null);
    const [sta,stat]= useState(null);
    const [countrs,countres]=useState(false);
    const [statys,stateys]=useState(false);
    const adding = {city:"add"}
    useEffect(() => {
        setJwt(localStorage.userToken);
        setUEmail(localStorage.email)
        setcartItems(JSON.parse(localStorage.cartData))
        console.log(JSON.parse(localStorage.cartData))
        getUserAddress();  
        const fetchRegion = async () => {
            const res = await fetch(
                `${process.env.GATSBY_CART_URL_STARCARE}regions`
            );

            const json = await res.json();
            await setRegion(json);
        };

        fetchRegion();

    }, []);

    const getUserAddress = () => { 
        setLoader(true);
        let shipAdd = [];
        try {
            axios({
                method: "get",
                url: `${process.env.GATSBY_CART_URL_STARCARE}customeraddress/${localStorage.getItem('email')}`,
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
            }).then((response) => {
                if (response.statusText === "OK" && response.status == 200) {
                    response.data.map(async (val, index) => {
                        await shipAdd.push(val.address);
                        await setShippingAddress(shipAdd);
                        setLoader(false);
                    })                   
                    setShow(false)
                    setLoader(false);
                }

            }).catch((err) => {
                console.error(err)
            })
        }
        catch (err) {
            console.error(err)
        }
    }

    const cartDatas = () => {

        return <div className="minicart_items">
            {
                cartItems.map((item, index) => (
                    <div key={item.item_id} className="product_items">
                        <div className="product_img">
                            <img src={item.image} />
                        </div>
                        <div className="product_item_details">
                            <div className="product_item_name">
                                <h3>{item.name}</h3>
                                <div className="details-qty">
                                    <p>Qty <span>:</span>
                                        <span className="value">{item.qty}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="product_item_price">
                                <span className="price">${Math.round(item.price).toFixed(2)*item.qty}</span> 
                            </div>
                        </div>

                    </div>
                ))
            }
        </div>

    }

    const checkOutData = () => {
        if (checkOutDetails.length != 0) {
            let checkItem = checkOutDetails[0]['totals']
            return <ul className="totals">
                <li>
                    <p>Cart Subtotal</p>
                    <span>${checkItem.subtotal}</span>
                </li>

                <li>
                    <p>Shipping <br />
                        {/* <small>Flat Rate - Fixed</small> */}
                    </p>
                    <span>${checkItem.shipping_amount}</span>
                </li>

                <li>
                    <p>Tax</p>
                    <span>${checkItem.tax_amount}</span>
                </li>

                <li>
                    <p>Order Total</p>
                    <span className="order_total">${checkItem.grand_total}</span>
                </li>
            </ul>
        }

    }


    const onSubmit = userAddresses => {
        let index = 0;
        for (let x of shippingAddress) {
            delete shippingAddress[index]['entity_id']
            delete shippingAddress[index]['email']
            index++;
        }


    if(JSON.parse(userAddresses.user_state).value === "")
        {
            return toast.error('Select State or Province'); 
        }
    else{
        if (addressEdit) {
            shippingAddress[selAddIndex] = {

                "firstname": userAddresses.firstname.trim(),
                "lastname": userAddresses.lastname.trim(),
                "street": [userAddresses.street_1.trim()],
                "city": userAddresses.user_city.trim(),
                "region_id": JSON.parse(userAddresses.user_state).value,
                "region": JSON.parse(userAddresses.user_state).title,
                "postcode": userAddresses.postcode.trim(),
                "country_id": JSON.parse(userAddresses.countryId).value,
                "telephone": userAddresses.telephone.trim()
            }

        } else {
            shippingAddress.push(
                {

                    "firstname": userAddresses.firstname.trim(),
                    "lastname": userAddresses.lastname.trim(),
                    // "company": userAddresses.company.trim(),
                    "street": [userAddresses.street_1.trim()],
                    "city": userAddresses.user_city.trim(),
                    "region_id": JSON.parse(userAddresses.user_state).value,
                    "region": JSON.parse(userAddresses.user_state).title,
                    "postcode": userAddresses.postcode.trim(),
                    "country_id": JSON.parse(userAddresses.countryId).value,
                    "telephone": userAddresses.telephone.trim()
                }
            )
        }

        let userAddVal = {
            "customer":
            {
                "email": userAddresses.email.trim(),
                "firstname": userAddresses.firstname.trim(),
                "lastname": userAddresses.lastname.trim(),
                "websiteId": 1,
                "addresses": shippingAddress
            }
        }

        try {
            axios({
                method: "put",
                url: `${process.env.GATSBY_CART_URL_STARCARE}customers/me`,
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
                data: userAddVal
            }).then((response) => {
                console.log("Add Address", response)
                if (response.statusText === "OK" && response.status == 200) {
                    
                    getUserAddress()
                    setLoader(false);
                    setShow(false)
                }

            }).catch((err) => {
                toast.error('error occured');
                setShow(false)
                console.error(err)
            })
        }
        catch (err) {
            toast.error('error occured');
            setShow(false)
            console.error(err)
        }
    }
    }

    const confirmShippingAddress = () => {
        if (selAddIndex == null) {
            toast.error('select address')
            return;
        }
        let data = {
            "data":{
                "customer_id":localStorage.customer_id,
                "post_code": shippingAddress[selAddIndex]['postcode']
            }
        }
        try {
            axios({
                method: "post",
                url: `${process.env.GATSBY_CART_URL_STARCARE}checkout/productpincodecheck`,
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
                data: data
            }).then((response) => {
                if (shippingAddress) {

                    delete shippingAddress[selAddIndex]['entity_id']
                    delete shippingAddress[selAddIndex]['default_billing']
                    delete shippingAddress[selAddIndex]['default_shipping']
                    let userAddVal = {
                        "addressInformation": {
                            "billing_address": shippingAddress[selAddIndex],
                            "shipping_address": shippingAddress[selAddIndex],
                            "shipping_carrier_code": "flatrate",
                            "shipping_method_code": "flatrate"
                            // "shippingCarrierCode": "apptha",
                            // "shippingMethodCode": "apptha"
                        }
                    }
        
                    try {
                        axios({
                            method: "post",
                            url: `${process.env.GATSBY_CART_URL_STARCARE}carts/mine/shipping-information`,
                            headers: {
                                'Authorization': `Bearer ${jwt}`
                            },
                            data: userAddVal
                        }).then((response) => {
                            if (response.statusText === "OK" && response.status == 200) {
                                setCheckout([response.data]);
                                setKey('profile')// open tab
                            }
        
                        }).catch((err) => {
                            console.error(err)
                        })
                    }
                    catch (err) {
                        console.error(err)
                    }
                }
            }).catch((err) => {
                toast.error(err.response.data.message)
            })
        }
        catch (err) {
            console.error(err)
        }
       

    }

    const onPaymentSubmit = () => {

        if (selAddIndex == null) {
            toast.error('Select address');
            return;
        }

        if (paymentType == null) {
            toast.error('Select Payment Type');
            return;
        }

        if (paymentType === 'checkmo') {
            consfirmShipping()
        }

        if (paymentType === 'paypal') {
            let checkoutVal = checkOutDetails[0]['totals']
            let items = [];
            checkoutVal.items.map((cart, index) => {
                items.push({
                    "name": cart.name,
                    "description": "Sample Description",
                    "quantity": cart.qty,
                    "price": cart.base_price,
                    "tax": cart.base_tax_amount,
                    "sku": '1',
                    "currency": checkoutVal['base_currency_code']
                })
            })


            let cardPay = {
                "intent": "sale",
                "payer": {
                    "payment_method": paymentType
                },
                "transactions": [
                    {
                        "amount": {
                            "total": checkoutVal['base_subtotal'] + checkoutVal['base_tax_amount'] + checkoutVal['base_shipping_amount'] + 0.01,
                            "currency": checkoutVal['base_currency_code'],
                            "details": {
                                "subtotal": checkoutVal['base_subtotal'],
                                "tax": checkoutVal['base_tax_amount'],
                                "shipping": checkoutVal['base_shipping_amount'],
                                "handling_fee": "1.00",
                                "shipping_discount": "-1.00",
                                "insurance": "0.01"
                            }
                        },
                        "description": "The payment transaction description.",
                        "custom": "EBAY_EMS_90048630024435",
                        "invoice_number": "48787589673",
                        "payment_options": {
                            "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
                        },
                        "soft_descriptor": "Sample soft description",
                        "item_list": {
                            "items": items,
                            "shipping_address": {
                                "recipient_name": shippingAddress[selAddIndex]['firstname'],
                                "line1": shippingAddress[selAddIndex]['street'][0].split(',')[0],
                                "line2": shippingAddress[selAddIndex]['street'][0].split(',')[1],
                                "city": shippingAddress[selAddIndex]['city'],
                                "country_code": shippingAddress[selAddIndex]['country_id'],
                                "postal_code": shippingAddress[selAddIndex]['postcode'],
                                "phone": shippingAddress[selAddIndex]['telephone'],
                                "state": shippingAddress[selAddIndex]['region']
                            }
                        }
                    }
                ],
                "note_to_payer": "Contact us for any questions on your order.",
                "redirect_urls": {
                    "return_url": "https://example.com/return",
                    "cancel_url": "https://example.com/cancel"
                }
            }

            try {
                axios({
                    method: "post",
                    url: "https://api.sandbox.paypal.com/v1/payments/payment",
                    auth: {
                        username: 'AUZMSAfKBTZk6yksluh7EhjnFQYj5yYUqtADWsETF4_SQSDP1KmEOKuzcSRuzGP7IarqHI2p4mLg59XV',
                        password: 'EACWYE1GY53lQ-0v1FMW_j3Ud5wCz2qMUBuw66dvbraj1fqNScoLY7H6AoarM9VWRZzcoyteTknU_5lm'
                    },
                    data: cardPay
                }).then((res) => {

                    if (res.statusText === "Created" && res.status == 201) {
                        consfirmShipping()
                    }

                }).catch((err) => {

                    console.error(err);

                })

            } catch (err) {
                console.error(err);
            }

        }
    }

    const consfirmShipping = () => {
       
        if (shippingAddress) {
            setLoader(true);
            let payDetails = {
                "paymentMethod": {
                    "method": 'checkmo'
                },
                // "shippingMethod":
                // {
                //   "method_code":"flatrate",
            
                //   "carrier_code":"flatrate"
                //  },
                "billingAddress": shippingAddress[selAddIndex]
            }

            try {
                axios({
                    method: "post",
                    url: `${process.env.GATSBY_CART_URL_STARCARE}carts/mine/payment-information`,
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    },
                    data: payDetails
                }).then((response) => {
                    if (response.statusText === "OK" && response.status == 200) {
                        
                        console.log(response.data)
                        let data = [
                            { 
                                order_id:response.data
                            }
                        ]
                        try {
                            axios({
                                method: "post",
                                url: `${process.env.GATSBY_CART_URL_STARCARE}getincrementid`,
                                data: data
                            }).then((res)=> {
                                if (res.statusText === "OK" && res.status == 200) {
                                    console.log(res.data)
                                     navigate(`/paymentSuccess?id=${response.data}&increid=${res.data}`)
                                     setLoader(false);
                                     localStorage.setItem('cartData', [])
                                } 
                            })
                        } catch(err)  {
                            toast.error(err.response.data.message)
                            setLoader(false);
                        }
                        // navigate("/paymentSuccess")
                       

                    }

                }).catch((err) => {
                    console.error(err.response.data.message)
                    toast.error(err.response.data.message)
                    setLoader(false);
                })
            }
            catch (err) {
                console.error(err)
                setLoader(false);
            }
        }
    }

    const handleChange = (event) => {
        const re = /^[0-9\b]+$/;
        if (!re.test(event.target.value)) {
            event.target.value = ""
        }
    }

    const deleteAddress = (id) => {
        if(!id){
           return toast.success('Select Address to deleted'); 
        }
        else{
            // shippingAddress.splice(selAddIndex,1);
            if (window.confirm("Are you sure want to delete this Address?")) {
            try {
                axios({
                    method: "get",
                    url: `${process.env.GATSBY_CART_URL_STARCARE}addressdelete/${id}`,
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    }
                }).then((response) => {
                        
                    if (response.statusText === "OK" && response.status == 200) {
                        shippingAddress.splice(selAddIndex,1);
                        toast.success('Address deleted Sucessfully'); 
                        getUserAddress();
                    }

                }).catch((err) => {
                    toast.error('Sn error occured');
                })
            }
        
            catch (err) {
                console.error(err)
            }
        }
        }
    }

    const editAddress = (add,index) => {
        setIndex(index);
        console.log(add)
        countres(true)
        stateys(true)
        coun(add['country_id'])
        stat(add['region'])
        setShow(true);
        setaddressEdit(true);
    }

    const listAddress = () => {

        return <div className="shipping_address_items">
            {
                shippingAddress.map((add, index) => (
                    <div key={`${index}_add`} className={`selected_item ${index == selAddIndex && 'activeAdd'}`} onClick={() => setIndex(index)}>
                        <div className="address">
                            <span>{add.firstname}</span><span>{add.lastname},</span><br></br>
                            <span>{add.street.join()},</span><br></br>
                            <span>{add.city}-{add.postcode},</span><br></br>
                            <span>{add.region},</span><br></br>
                            <a href={`tel:${add.telephone}`}>{add.telephone}</a>
                        </div>
                        {/* <button className="action action_btn btn btn_gray" onClick={() => setIndex(index)}>Ship Here</button> */}

                        <div className="action_sec">
                            <button className="action action_btn btn btn_gray" onClick={() => {deleteAddress(add.entity_id); setaddressEdit(false)}} >Delete</button>
                            <Link to="/Address/" state={{data:add,prevPath:location.pathname}}><button className="action action_btn btn btn_gray ml-1"  >Edit</button></Link>
                        </div>

                    </div>
                ))
            }
        </div>

    }

    const parseSelected = (event) => {
        countres(false)
        stateys(false)
        setState([])
        const valueToParse = event.target.value;
        const itemSelected = JSON.parse(valueToParse);
        setSelected(itemSelected);
        console.log(itemSelected)
        if (itemSelected['states']) {
            setState(itemSelected['states'])
        }
        return;
    }


    return (
        <>
            <Layout cartCount={getCartCount()}>
                {(loader ? <PageLoader /> :

                    <main className="checkout_page">
                        <div className="App">
                            <div className="content_wrapper">
                                <div className="container">
                                    {/* Meenakshi here */}

                                    <Tabs activeKey={key} onSelect={(k) => setKey(k)} transition={false} id="noanim-tab-example">
                                        <Tab eventKey="shipping" title="Shipping Address">
                                            <div className="row">
                                                <div className="col-lg-9 col-md-9 col-xs-12 checkout_shipping_address">
                                                    <div className="sec_bg">
                                                        <h3>Shipping Address</h3>

                                                        <div className="shipping_address_items">
                                                            {listAddress()}
                                                        </div>

                                                        <div className="new_address_popup">
                                                            <Link to="/Address" state={{data:adding,prevPath:location.pathname}}><button type="button" className="btn action action_show_popup btn_gray">
                                                                + New Address
                                                            </button></Link>

                                                            <button type="button" className="btn action btn_next ml-2" onClick={() => confirmShippingAddress()}>Next</button>

                                                            {/* {(loader ? <PageLoader/> : */}

                                                            <Modal
                                                                show={show}
                                                                onHide={handleClose}
                                                                backdrop="static"
                                                                keyboard={false}
                                                            >
                                                                <Modal.Header closeButton>
                                                                    <Modal.Title>Shipping Address</Modal.Title>
                                                                </Modal.Header>
                                                                <Modal.Body>
                                                                    <form onSubmit={handleSubmit(onSubmit)} className="opc_new_shipping_address">
                                                                        <div className="form-group">
                                                                            <label htmlFor="email">Email Address </label>
                                                                            <input className="form-control" name="email" id="email" placeholder="Email Address" type="text" ref={register({
                                                                                required: true,
                                                                                pattern: /\S+@\S+\.\S+/
                                                                            })} value={uEmail} readOnly={true} />
                                                                            {errors.email && errors.email.type === 'required' && <span className="error_label">Email field is required</span>}
                                                                            {errors.email && errors.email.type === 'pattern' && <span className="error_label">Valid email required</span>}
                                                                        </div>

                                                                        <div className="form-group">
                                                                            <label htmlFor="firstname">First Name <span className="error_label">*</span></label>
                                                                            <input className="form-control" name="firstname" id="firstname" placeholder="First Name" type="text" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(addressEdit ? shippingAddress[selAddIndex]['firstname'] : "")} />
                                                                            {errors.firstname && errors.firstname.type === 'required' && <span className="error_label">First name field is required</span>}
                                                                        </div>


                                                                        <div className="form-group">
                                                                            <label htmlFor="lastname">Last Name <span className="error_label">*</span></label>
                                                                            <input className="form-control" name="lastname" id="lastname" placeholder="Last Name" type="text" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(addressEdit ? shippingAddress[selAddIndex]['lastname'] : "")} />
                                                                            {errors.lastname && errors.lastname.type === 'required' && <span className="error_label">Last name field is required</span>}
                                                                        </div>


                                                                        <div className="form-group">
                                                                            <label htmlFor="company">Company <span className="error_label">*</span></label>
                                                                            <input className="form-control" name="company" id="company" placeholder="Company" type="text" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(addressEdit ? shippingAddress[selAddIndex]['company'] : "")} />
                                                                            {errors.company && errors.company.type === 'required' && <span className="error_label">Company name field is required</span>}
                                                                        </div>

                                                                        <div className="form-group">
                                                                            <label htmlFor="countryId">Country <span className="error_label">*</span></label>
                                                                            <select className="form-control" id="countryId" name="countryId" ref={register({
                                                                                required: true
                                                                            })} onChange={parseSelected} value="India">
                                                                                {/* {countrs && <option value={co} selected>{co}</option>} */}
                                                                                {
                                                                                    region.map(regionName => (
                                                                                        <option key={regionName.value} value={JSON.stringify(regionName)} >{regionName.label}</option>
                                                                                    ))
                                                                                }

                                                                            </select>

                                                                            {errors.countryId && errors.countryId.type === 'required' && <span className="error_label">Country required</span>}
                                                                        </div>


                                                                        <div className="form-group">
                                                                            <label htmlFor="user_state">State/Province <span className="error_label">*</span></label>
                                                                            <div className="form-group">
                                                                                <select className="form-control" id="user_state" name="user_state"
                                                                                    ref={register({
                                                                                        required: true
                                                                                    })} defaultValue={(addressEdit ? shippingAddress[selAddIndex]['region_id'] : "")}>
                                                                                        {/* {statys && <option value={sta} selected>{sta}</option>} */}
                                                                                    {
                                                                                        state.map(stateVal => (
                                                                                            <option key={stateVal.value} value={JSON.stringify(stateVal)} >{stateVal.label}</option>
                                                                                        ))
                                                                                    }
                                                                                </select>
                                                                                {errors.user_state && errors.user_state.type === 'required' && <span className="error_label">State required</span>}
                                                                            </div>
                                                                        </div>


                                                                        <div className="form-group">
                                                                            <label>Address <span className="error_label">*</span></label>
                                                                            <input className="form-control" name="street_1" id="street_1" placeholder="Line 1" type="text" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(addressEdit ? shippingAddress[selAddIndex]['street'][0].split('\n')[0] : "")} />
                                                                            {errors.street_1 && errors.street_1.type === 'required' && <span className="error_label">Line 1 required</span>}
                                                                        </div>


                                                                        {/* <div className="form-group">
                                                                            <input className="form-control" name="street_2" id="street_2" placeholder="Line 2" type="text" ref={register({
                                                                                
                                                                            })} defaultValue={(addressEdit ? shippingAddress[selAddIndex]['street'][0].split('\n')[1] : "")} />
                                                                            {errors.street_2 && errors.street_2.type === 'required' && <span className="error_label">Line 2 is required</span>}
                                                                        </div> */}

                                                                        {/* <div className="form-group">
                                                                            <input className="form-control" name="street_3" id="street_3" placeholder="Line 3" type="text" ref={register({
                                                                                
                                                                            })} defaultValue={(addressEdit ? shippingAddress[selAddIndex]['street'][0].split('\n')[2] : "")} />
                                                                            {errors.street_3 && errors.street_3.type === 'required' && <span className="error_label">Line 3 is required</span>}
                                                                        </div> */}

                                                                        <div className="form-group">
                                                                            <label>City <span className="error_label">*</span></label>
                                                                            <input className="form-control" name="user_city" id="user_city" placeholder="City" type="text" ref={register({
                                                                                required: true
                                                                            })} defaultValue={(addressEdit ? shippingAddress[selAddIndex]['city'] : "")} />
                                                                            {errors.user_city && errors.user_city.type === 'required' && <span className="error_label">City is required</span>}
                                                                        </div>

                                                                        <div className="form-group">
                                                                            <label htmlFor="postcode">Zip/Postal Code <span className="error_label">*</span></label>
                                                                            <input className="form-control" name="postcode" id="postcode" placeholder="Zip/Postal Code " type="text" onChange={handleChange} ref={register({
                                                                                required: true,
                                                                            })} 
                                                                            maxLength="6"
                                                                            defaultValue={(addressEdit ? shippingAddress[selAddIndex]['postcode'] : "")} />
                                                                            {errors.postcode && errors.postcode.type === 'required' && <span className="error_label">Postcode required</span>}
                                                                            {errors.postcode && errors.postcode.type === 'minLength' && <span className="error_label">Enter valid Postcode</span>}
                                                                        </div>

                                                                        <div className="form-group">
                                                                            <label htmlFor="telephone">Phone Number<span className="error_label">*</span></label>
                                                                            <input className="form-control" name="telephone" id="telephone" placeholder="Telephone" type="text" onChange={handleChange} 
                                                                            maxLength="10"
                                                                            ref={register({
                                                                                required: true,
                                                                            })} defaultValue={(addressEdit ? shippingAddress[selAddIndex]['telephone'] : "")} />
                                                                            {errors.telephone && errors.telephone.type === 'required' && <span className="error_label">Phone required</span>}
                                                                            {errors.telephone && errors.telephone.type === 'minLength' && <span className="error_label">Enter Valid Phone Number</span>}
                                                                        </div>

                                                                        <input className="btn btn_gray" type="submit" />

                                                                        {/* <button type="submit" className="primary btn btn_gray btn-block">Ship Here</button> */}
                                                                    </form>


                                                                </Modal.Body>
                                                            </Modal>

                                                        </div>
                                                    
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-md-3 col-xs-12">
                                                    <div className="sec_bg">
                                                        <div className="side_sec">
                                                            <h3>Order Summary</h3>
                                                            {checkOutData()}

                                                            <Accordion defaultActiveKey="0">
                                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                                    <p>{cartItems.length} Item in Cart</p>
                                                                </Accordion.Toggle>
                                                                <Accordion.Collapse eventKey="0">
                                                                    <div className="content minicart_items">
                                                                        <div className="minicart_items_wrapper">
                                                                            <div className="minicart_items">
                                                                                {cartDatas()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Accordion.Collapse>
                                                            </Accordion>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </Tab>

                                     {checkOutDetails.length != 0 && <Tab eventKey="profile" title="Review &amp; Payments">
                                            <div className="row">
                                                <div className="col-lg-9 col-md-9 col-xs-12 checkout_shipping_address">
                                                    <div className="sec_bg">
                                                        <h3>Payment Method</h3>
                                                        {(loader ? <PageLoader /> :
                                                            <form onSubmit={handleSubmit(onPaymentSubmit)} className="payment_method_form" autoComplete="off" >

                                                                <div className="form-group">
                                                                    <div className="form-check">
                                                                        <input id="male" className="form-check-input" type="radio" name="payment_money" value="checkmo" onChange={(event) => setPaymentType(event.target.value)} />
                                                                        <label className="form-check-label">
                                                                            Check / Money order
                                                                </label>
                                                                    </div>
                                                                    <div className="form-check">
                                                                        <input id="female" className="form-check-input" type="radio" name="payment_money" value="paypal" onChange={(event) => setPaymentType(event.target.value)} />
                                                                        <label className="form-check-label" htmlFor="payment_paygate">
                                                                            Paypal
                                                                </label>
                                                                    </div>
                                                                </div>
                                                                <div className="form_btn">
                                                <button className="btn btn_gray" type="submit">Submit</button>
                                                </div>
                                                            </form>
                                                        )}
                                                     
                                                    </div>
                                                </div>

                                                <div className="col-lg-3 col-md-3 col-xs-12">
                                                    <div className="sec_bg">
                                                        <div className="side_sec">
                                                            <h3>Order Summary</h3>
                                                            {checkOutData()}
                                                            <Accordion defaultActiveKey="0">
                                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                                    <p><span>{cartItems.length}</span>Item in Cart</p>
                                                                </Accordion.Toggle>
                                                                <Accordion.Collapse eventKey="0">
                                                                    <div className="content minicart_items">
                                                                        <div className="minicart_items_wrapper">
                                                                            <div className="minicart_items">
                                                                            {cartDatas()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Accordion.Collapse>
                                                            </Accordion>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </Tab>}

                                    </Tabs>

                                </div>
                            </div>
                        </div>
                        <ToastContainer
                            position="bottom-right"
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </main>
                )}

            </Layout>
        </>
    )

}

export default CheckOut