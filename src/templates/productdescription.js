import React, { useEffect, useState } from "react"
import StarRatings from 'react-star-ratings';
import axios from "axios";
import { viewCartItems, wishListCount } from "./../utils/apiServices";
import { checkLogin } from "./../services/headerServices";
import { navigate } from 'gatsby';
import { ToastContainer, toast } from 'react-toastify';
import { IoChevronForwardOutline } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from "react-icons/io";
import Modal from 'react-bootstrap/Modal';
import { getCategoryURL } from "./../utils/url";
import { useForm } from "react-hook-form";
import CursorZoom from 'react-cursor-zoom';
import ImageNotFound from "./../assets/car-dealer-loader.gif";
import SliderImage from 'react-zoom-slider';
import { Link } from "gatsby"




const Productdescription = ({ proDescription, setcartCount, setWishListCnt}) => {
  const [quote_id, setQuoteId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [jwt, setJwt] = useState("");
  const [isButton, setButton] = useState(true);
  const [qty, setQty] = useState(1);
  const [cartItem, setcartItem] = useState();
  const { register, handleSubmit, errors } = useForm();
  const [quote, setQuotePopup] = useState(false);
  const [showQuote, setShowQuote] = useState(true);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [isShow, setShowBtn] = useState('');
  const [tierAmt, setTierProduct] = useState([]);
  const [normal_price, setPrice] = useState("")
  const handleCloseQuote = () => setShowQuote(false);
  const handleShowQuote = () => setShowQuote(true);
  const [config, setConfig] = useState([])
  const [size_arr, setSize] = useState([])
  const [index_colour, setindex_colour] = useState(1);
  const [index_size, setindex_size] = useState(0);
  const [product_id, setproduct_id] = useState();
  const [colour, setColour] = useState();
  const [change_price, setchange_Price] = useState([]);
  const [Istrue, setDisable] = useState(false)
  const [p,per] = useState(false);
    const [pcar,percart] = useState(false);
    const [pcom,percomp] = useState(false);
    const [outp,outper] = useState(false);
    const [outpcar,outpercart] = useState(false);
    const [outpcom,outpercomp] = useState(false);

  const [data, setData] = useState([
    {
      image: (ImageNotFound),
      text: 'loading',
      width: 2000,
      height: 1800
    }])
    const [permits,setPermit] = useState([]);


  useEffect(() => {
    console.log(proDescription)
    setCustomerId(localStorage.customer_id)
    setJwt(localStorage.userToken);
    //setQuoteId(localStorage.cartId);
    setPrice(proDescription.items.final_price)
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
    }
    let id = {
      "data":{
          "product_id":proDescription.items.id,
          "seller_id":proDescription.items.seller_id
      
      }
  }
  
    try
    {    
      axios({
        method : 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}seller/mostviewedproducts`,
        headers : {
            'Authorization' : `Bearer ${jwt}`
        },
        data : id
      })
      .then((response) => {
       
      }) 
      .catch((error) => {
        console.error(error,'error')
      })
    }catch(err){
      console.error(err);
      toast.error('something went wrong')
    }
    console.log(proDescription)
    if(!localStorage.permissions){
      outper(true)
      outpercart(true)
      outpercomp(true)
     } else {
      let hi = JSON.parse(localStorage.permissions)
      let addwis=hi.includes("Can Add To Wishlist")
      let addcar=hi.includes("Can Add To Cart")
      let addcom=hi.includes("Can Add To Compare")
      per(addwis)
      percart(addcar)
      percomp(addcom)
     }
    if (proDescription.items.config_options) {
      setcartItem({
        "cartItem": {
          "sku": proDescription.items.config_options[0].optins_values.sku,
          "qty": qty,
          "quote_id": quote_id
        }
      })
      let colour_list = [];
      const filteredArr = proDescription.items.config_options.reduce((values, current) => {
        const x = values.find(item => item.optins_values.options_id === current.optins_values.options_id);
        if (!x) {
          return values.concat([current]);
        } else {
          return values;
        }
      }, []);
      filteredArr.map(val => {
        if (val.option_label === 'Colour') {
          colour_list.push(val)
        }
      })
      if (colour_list.length > 0) {
        size(colour_list[0].optins_values)
      } else {
        setSize(proDescription.items.config_options)
        changeSize(proDescription.items.config_options[0], 0)
        setproduct_id(proDescription.items.config_options[0].optins_values.product_id)
      }
      setConfig(colour_list)
      setindex_colour(0)
      if (proDescription) {
        if (colour_list.length > 0) {
          setData([
            {
              image: (!proDescription.items ? ImageNotFound : colour_list[0].optins_values.image),
              text: 'img1',
              width: 2000,
              height: 1800
            }
          ]);
        } else {
          setData([
            {
              image: (!proDescription.items ? ImageNotFound : proDescription.items.image),
              text: 'img1',
              width: 2000,
              height: 1800
            }
          ]);
        }
      }
    } else {
      setcartItem({
        "cartItem": {
          "sku": proDescription.items.sku,
          "qty": qty,
          "quote_id": quote_id
        }
      })
      setData([
        {
          image: (!proDescription.items ? ImageNotFound : proDescription.items.image),
          text: 'img1',
          width: 2000,
          height: 1800
        }
      ]);

      axios({
        method: "get",
        url: `${process.env.GATSBY_CART_URL_STARCARE}admin/tierprice/${proDescription.items.id}`,
        //${proDescription.items.id}
      }).then((res) => {
        setTierProduct(res.data)
      }).catch((err) => {
        console.error(err);
      });
    }

    // axios({
    //   method: "get",
    //   url: `${process.env.GATSBY_CART_URL_STARCARE}admin/priceaddtocartenabledisable/${localStorage.customer_id}
    //   `,
    // }).then((res) => {
    //   let cart_price = res.data
    //   if (cart_price[0].hide_price == "1") {
    //     setDisable(true)
    //     return setShowBtn(1)
    //   }
    //   if (cart_price[1].hide_add_to_cart == "1") {
    //     setDisable(true)
    //     return setButton(true)
    //   }
    // }).catch((err) => {
    //   console.error(err);
    // });

    const res = axios.get(
      `${process.env.GATSBY_CART_URL_STARCARE}admin/minmaxquantity/${proDescription.items.id}`
    ).then((data) => {
      console.log(data.data[0])
      setMin(Math.round(data.data[0].min_sale_qty));
      setMax(Math.round(data.data[0].max_sale_qty));
    })

  }, []);

  const changeSize = (changeSizeValue, index2) => {
    setindex_size(index2);
    setcartItem({
      "cartItem": {
        "sku": changeSizeValue.optins_values.sku,
        "qty": qty,
        "quote_id": quote_id
      }
    })
    let set_price = [];
    set_price.push(changeSizeValue.optins_values);
    setchange_Price(set_price)
    setproduct_id(changeSizeValue.optins_values.product_id)
  }

  const addItemToCart = (cartItem) => {
    if (localStorage.userToken) {

    let cartData;
    if (proDescription.items.config_options) {
      cartData = {
        "cartItem": {
          "sku": change_price[0].sku,
          "qty": qty,
          "quote_id": quote_id
        }
      }
    } else {
      cartData = {
        "cartItem": {
          "sku": proDescription.items.sku,
          "qty": qty,
          "quote_id": quote_id
        }
      }
    }

    //if (!checkLogin()) {
     // navigate('/signin')
    //} else {
      const jwt = localStorage.getItem('userToken')
      if (cartItem) {
        if (qty < min) {
          return toast.error("Please enter a quantity greater than " + (min - 1))
        } else if (qty > max) {
          return toast.error("The Maximum you purchase is" + max)
        } else {
          try {
            axios({
              method: 'post',
              url: `${process.env.GATSBY_API_BASE_URL_STARCARE}carts/mine/items`,
              data: cartData,
              headers: {
                'Authorization': `Bearer ${jwt}`
              }
            }).then((res) => {
              if (res.statusText === "OK" && res.status == 200) {
                toast.success('succesfully added to cart');
                setcartCount();
                viewCartItems();
                setButton(false);
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
    }else {
      localStorage.clear()
      navigate("/signin")
  }
    //}
  }

  const handleChange1 = (event) => {
    const re = /^[0-9\b]+$/;
    if (!re.test(event.target.value)) {
      event.target.value = ""
    }
  }

  const pinCodeChecker = pinCode => {
    console.log(pinCode)
    let data;
    try {
      axios.get(
        `${process.env.GATSBY_CART_URL_STARCARE}admin/pincodecheck/${proDescription.items.id}`
      ).then(async (res) => {
        await res.data.map((pin) => {
          if (pinCode == pin.pincode) {
            data = pin.pincode
          }
        })
        await verifycode(pinCode, data)
      })

    } catch (err) {
      console.error(err);
    }

  }

  const verifycode = (event, data) => {
    if (event != "") {
      if (event == data) {
        setButton(false)
        return toast.success("product available")
      } else {
        setButton(true)
        return toast.error("products are not available")
      }
    } else {
      return toast.error("Please Enter Pincode")
    }
  }


  const addToList = (type) => {
    if (localStorage.userToken) {

    let url = (type == 1 ? `${process.env.GATSBY_CART_URL_STARCARE}admin/addtocompare/2` : `${process.env.GATSBY_CART_URL_STARCARE}wishlist/addwishlist_product/`)
    let message = (type == 1 ? 'Sucessfully added to compare list' : 'Sucessfully added to wish list')
    let productData = {
      "data": {
        "customer_id": customerId,
        "product_id": product_id ? product_id : proDescription.items.id
      }
    }

    try {
      axios({
        method: 'post',
        url: url,
        data: productData,
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      }).then((res) => {
        if (res.statusText === "OK" && res.status == 200) {
          toast.success(message);
          setWishListCnt();
          wishListCount();
        }
      }).catch((err) => {
        toast.error(err);
      })
    } catch (err) {
      toast.error(err);
    }
  }else {
    localStorage.clear()
    navigate("/signin")
}
  }


  const handleChange = async (event) => {
    let price;
    if (event.target.value <= 0) {
      event.target.value = 1;
      setQty(event.target.value)
      setPrice(proDescription.items.final_price)
    } else {
      setQty(event.target.value)
      tierAmt.map((item,index) => {
        console.log(item)
        if(index==0){
          item.from_qty=1
          item.to_qty=item.Tier_quantity
        }else {
          item.from_qty=+tierAmt[index-1].Tier_quantity + +1
          item.to_qty=item.Tier_quantity
        }
        
          if ((event.target.value >= item.from_qty && event.target.value <= item.to_qty) || (event.target.value > item.to_qty)) {
            console.log(item)
            price = item.Tier_price/item.Tier_quantity
          }
       
       

      })
      await updatePirce(price)
    }
  }
  // const handleChange = async (event) => {
  //   let price;
  //   if (event.target.value <= 0) {
  //     event.target.value = 1;
  //     setQty(event.target.value)
  //     setPrice(proDescription.items.price)
  //   } else {
  //     setQty(event.target.value)
  //     tierAmt.map(item => {
  //       if (event.target.value == item.Tier_quantity) {
  //         price = item.Tier_price/item.Tier_quantity
  //       }

  //     })
  //     await updatePirce(price)
  //   }
  // }
  const updatePirce = (price) => {
    console.log(price)
    if (price != undefined) {
      setPrice(price)
    } else {
      setPrice(proDescription.items.final_price)
    }
  }
  // const quotePopupOpen = () => {
  //   if (!checkLogin()) {
  //     navigate('/signin')
  //   } else {
  //     setQuotePopup(true)
  //     handleShowQuote(true)
  //   }
  // }
  const onChangeValue = (event) => {
    setQty(event.Tier_quantity)
    setPrice(event.Tier_price/event.Tier_quantity)
  }
  const onSubmitQuote = quoteDetails => {
    let quoteData = {
      "data":
      {
        "product_id": proDescription.items.id,
        "customer_id": localStorage.customer_id,
        "quantity": quoteDetails.quantity,
        "price_per_item": quoteDetails.price_per_item,
        "description": quoteDetails.description

      }
    }

    try {
      axios({
        method: 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}admin/productsaddtoquote`,
        data: quoteData,
      })
        .then(function (response) {
          toast.success(response.data)
          handleCloseQuote()
        })
        .catch(function (response) {
          toast.error('An error occured please contact admin')
        });

    } catch (err) {
      console.error(`An error occured ${err}`)
      ///
    }
  };

  const changeImage = (value) => {
    setData([
      {
        image: (!value ? ImageNotFound : value),
        text: 'img1',
        width: 2000,
        height: 1800
      }
    ]);
  }

  const size = (options, index1) => {
    setData([
      {
        image: (!options.image ? ImageNotFound : options.image),
        text: 'img1',
        width: 2000,
        height: 1800
      }
    ]);
    const size_list = [];
    proDescription.items.config_options.map((value, index) => {
      if (value.optins_values.options === options.options) {
        proDescription.items.config_options.map((size_value, index) => {
          if ((size_value.option_label !== 'Colour') && (value.optins_values.product_id === size_value.optins_values.product_id)) {
            size_list.push(size_value)
          }
        });
      }
    });
    if (size_list.length > 0) {
      changeSize(size_list[0])
    }
    setcartItem({
      "cartItem": {
        "sku": options.sku,
        "qty": qty,
        "quote_id": quote_id
      }
    })
    setindex_colour(index1);
    setColour(options.options);
    setSize(size_list)
    setindex_size(0)
    let set_price = [];
    set_price.push(options);
    setchange_Price(set_price)
    setproduct_id(options.product_id)
  }

const newprice =() => {
if(proDescription.items.config_options){
  return(
    change_price.map((val, index) => (
      <span className="price" key={index}>${Math.round(val.price)}</span>
    )
  )
  )
}else{
  return(      <span className="price">${Math.round(normal_price)}</span>
  )
}
}
  return (
    <>
      {proDescription && proDescription.items ? (
        <>
          <div className="container">
            <div className="product_view">
              <div className="row upper-space">
                <div className="col-lg-7 col-md-4 col-xs-12 text-center border_f">
                  <div className="slider_thumb">
                      <ul>
                      { proDescription.items.all_images.map((val, index) => (
                           <li key={index}><a onClick={() => changeImage(val)}><img src={val}/></a></li>
                          ))
                      }
                    </ul>
                  
                    
                  </div>
                  <div>
                    {data.length > 0 &&  <CursorZoom
                image={{
                    src: data[0].image,
                    width: 400,
                    height: 300
                }}
                zoomImage={{
                    src: data[0].image,
                    width: 600,
                    height: 500
                }}
                cursorOffset={{ x: 30, y: -30 }}
            />}
                  </div>
                </div>
                <div className="col-lg-5 col-md-8 col-xs-12 pr-5 product_details">
                  <section className="product_details">
                    <h1 className="mb-2">
                      {proDescription.items.name}
                    </h1>
                    {proDescription.items.rating != null &&
                       <StarRatings
                          rating={Math.round(proDescription.items.rating)}
                          numberOfStars={5}
                          name='rating'
                          starDimension="20px"
                          starSpacing="0px"
                          starRatedColor="rgb(255 123 168)"
                          svgIconViewBox="0 0 32 32"
                          svgIconPath="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"
                      />                        
                    }
                    <span className="rating-count">{proDescription.items.review_details.length} Comments</span>

                    <div className="brand mt-2">

                    </div>
                    {/* <div className="rating_field">

                      <div className="star-rating">
                        <span className="fa fa-star" data-rating="1"></span>
                        <span className="fa fa-star" data-rating="2"></span>
                        <span className="fa fa-star" data-rating="3"></span>
                        <span className="fa fa-star" data-rating="4"></span>
                        <span className="fa fa-star" data-rating="5"></span>
                        <input type="hidden" name="whatever1" className="rating-value" value="2.56" />
                      </div>
                      <span className="rating_text">
                      </span>

                    </div> */}
                    <div className="product_note py-2">

                      <div className="prd_note">
                        <p>
                          <span className="bold">Brand:</span> <a href="/filterBrands">{proDescription.Brand}</a>
                          {/* <Link to="/brandedProducts/" state={{ brand_id: data.brand_id }} ><img className="product_img" src={data.image} /></Link> */}

                        </p>

                        {proDescription.items.config_options ?
                          change_price.map((val, index) => (
                           <p>  <span className="bold">SKU:</span><span >{val.sku}</span></p>
                          )) :
                          <p> <span className="bold">SKU:</span> <span>{proDescription.items.sku}</span></p>
                        }
                      </div>
                      <div>
                        <i>{proDescription.items.is_in_stock == 1 ? "In Stock" :<p className="fo-o-stock">Out Of Stock</p> }</i>

                      </div>
                    </div>

<div className="price-name-strike">
                   
                          {/* {proDescription.items.config_options ?
                          change_price.map((val, index) => (
                              <span className="price" key={index}>${Math.round(val.price)}</span>
                            )) :
                            <span className="price">${Math.round(normal_price)}</span>
} */}
{proDescription.items.strike_price ==null && newprice()}
{proDescription.items.strike_price !=null && <span  className="price">${Math.round(proDescription.items.final_price)}</span>}


                       {proDescription.items.strike_price !=null && <span><strike>${Math.round(proDescription.items.strike_price)}</strike></span>}
                       {/* <span className="price"><strike>$0</strike></span> */}
</div>

                    {tierAmt.length != 0 ? (
                      <table className="table compareList_table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>QTY</th>
                            <th>Price per QTY</th>
                            <th>Tier price</th>
                            <th>Discount %</th>
                          </tr>
                        </thead>

                        {
                          tierAmt.map((item, index) => (
                            <tbody key={index}>
                              <tr>
                                <td>
                                  <input type="radio" checked={qty == item.Tier_quantity} value="item.Tier_quantity" name="item.Tier_quantity" onChange={() => { onChangeValue(item) }} />
                                </td>
                                <td>
                                  <span>{index > 0 ? +tierAmt[index-1].Tier_quantity + +1: 1}-{item.Tier_quantity}</span>
                                </td> 
                                <td>
                                  <span className="whish-list-price">
                                    $ {Math.round(parseFloat(item.Tier_price).toFixed(2)/item.Tier_quantity)}
                                  </span>
                                </td>
                                <td>
                                  <span className="whish-list-price">
                                    $ {parseFloat(item.Tier_price).toFixed(2)}
                                  </span>
                                </td>
                                <td className="product_name">
                                  <h3>{item.Discount}</h3>
                                </td>
                              </tr>
                            </tbody>
                          ))
                        }
                      </table>)
                      : <span></span>}
                    <div className="product_qty">
                      <div className="qty_inner">
                        
                        <div className="qty_price">
                          <input type="number" value={qty} onChange={event => { handleChange(event) }} />
                        </div>
                       
                      </div>
                      <div className="button_sec">
                        {pcar && <button onClick={() => addItemToCart(cartItem)} className="btn_gray btn"
                        //  disabled={isButton}
                         >
                          <span className="cart_svg"></span> Add To Cart   
              </button>}
              {outpcar && <button onClick={() => addItemToCart(cartItem)} className="btn_gray btn"
                        //  disabled={isButton}
                         >
                          <span className="cart_svg"></span> Add To Cart   
              </button>}
              {p &&<button className="btn_gray heart">     <a onClick={() => addToList(2)} >
                            <FaRegHeart />
              </a>
              </button>}
              {outp && <button className="btn_gray heart">     <a onClick={() => addToList(2)} >
                            <FaRegHeart />
              </a>
              </button>}
              
                      </div>
                      {/* <div className="product_detail_action">
                          
                       <Link to="/myquotesedit" state={{ des: proDescription }}><span className="fa fa-comments"></span> Request for a Quote
                                     </Link>
                     <a onClick={() => quotePopupOpen()} >
                     <span className="fa fa-comments"></span>   Request for a Quote
                             </a>
       
                                {pcom && <a onClick={() => addToList(1)} >
                                   <IoIosGitCompare /> Add to Compare
                     </a>}
                     {outpcom && <a onClick={() => addToList(1)} >
                                   <IoIosGitCompare /> Add to Compare
                     </a>}
                               </div> */}
                      
                    </div>

                    <div className="overview">
                      <h3>Overview</h3>
                      <p>{proDescription.items.overview}</p>
                      {/* <a>Read More</a> */}

                     {proDescription.items.seller_name !=null && <p> <span className="bold">Seller : </span><Link to="/sellerreview" state={{ seller_id: proDescription.items.seller_id }} ><span>{proDescription.items.seller_name}</span></Link></p>}
                          {/*  */}


                    </div>

                    <div className="delivery-section">
                      
                      <div className="input-sec">
                      
                      <form onSubmit={handleSubmit(pinCodeChecker)}>
                      <div className="form-group">
                      <label>Delivery</label>
                      <div className="input-group">
    
    <input className="form-control" type="tel" id="pincode" name="postcode" placeholder="Zip/Postal Code " onChange={handleChange1} maxLength="6" className="form-control" required={true}/>
    {errors.postcode && errors.postcode.type === 'required' && <span>Zip/Postal Code is required</span>}
    
    <div className="input-group-addon">
    <button type="submit"  className="btn btn-default">Check</button>
      </div>
    </div> </div>
 
</form>
                        
                      </div>
                      {/* <p className="red">currently out of stock in this area</p> */}
                    </div>


                    
                    <div>

                      {config.length > 0 && <p><span className="color_type">Colour: </span>{colour}</p>}

                      {config.map((data, index) => (
                        <div key={index} className={`product_size ml-2 ${index === index_colour ? 'product_size_active' : ''}`} onClick={() => size(data.optins_values, index)}>
                          <img style={{ width: '100px' }} src={data.optins_values.image} />
                        </div>
                      ))
                      }
                    </div>
                    {(size_arr.length > 0) &&
                      <div className="size_sec"> <span className="color_type">Size: </span>
                        {size_arr.map((data1, index) => (
                          <div key={index} className={`product_size mt-3 mr-2 ${index === index_size ? 'product_size_active' : ''}`} onClick={() => changeSize(data1, index)}>

                            <p className='test'>{data1.optins_values.options}</p>
                          </div>
                        ))
                        }
                      </div>
                    }
                    {/* <div>
                      <div className="input-group mb-3 mt-2">
                        <input type="tel" id="pincode" name="postcode" placeholder="Zip/Postal Code " onChange={handleChange1} maxLength="6" className="form-control" />
                        <button onClick={() => pinCodeChecker(document.getElementById('pincode').value, proDescription.items.id)} className="input-group-text" disabled={Istrue}>Zip/Postal Code</button>
                      </div>
                    </div> */}
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
                    {quote ? <Modal show={showQuote} onHide={handleCloseQuote} animation={false}>
                      <Modal.Header closeButton>
                        <Modal.Title>Request for a Quote</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>

                        <p >Product Name:&nbsp;<span>{proDescription.items.name}</span></p> 

                        <form onSubmit={handleSubmit(onSubmitQuote)} action="" className="header_signin_form">
                          <div className="form-group">
                            <label htmlFor="quantity">Quantity </label>
                            <input className="form-control" name="quantity" placeholder="Quantity" type="text" ref={register({
                              required: true
                            })} />
                            {errors.quantity && errors.quantity.type === 'required' && <span className="error">Quantity is required</span>}
                          </div>
                          <div className="form-group">
                            <label htmlFor="price_per_item">Price Per Item </label>
                            <input className="form-control" type="number" name="price_per_item" placeholder="Price Per Item" ref={register({
                              required: true
                            })} />
                            {errors.price_per_item && errors.price_per_item.type === 'required' && <span className="error">Price is required</span>}
                          </div>
                          <div className="form-group">
                            <label htmlFor="description">Description </label>
                            <textarea className="form-control" name="description" placeholder="Description" ref={register({
                              required: true
                            })}>
                            </textarea>
                            {errors.description && errors.description.type === 'required' && <span className="error">Description is required</span>}
                          </div>
                          <button type="submit" className="btn_link theme_btn_blue w-100">Submit</button>
                        </form>
                      </Modal.Body>
                      <Modal.Footer>

                      </Modal.Footer>
                    </Modal> : <div></div>}
                  </section>
                </div>
              </div>
            </div>
          </div>

        </>
      ) : (
          <div>


          </div>
        )

      }
    </>

  )
}

export default Productdescription
