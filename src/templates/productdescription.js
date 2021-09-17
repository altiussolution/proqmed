import React, { useEffect, useState } from "react"
import StarRatings from 'react-star-ratings';
import axios from "axios";
import { viewCartItems, wishListCount } from "./../utils/apiServices";
import { checkLogin } from "./../services/headerServices";
import { navigate } from 'gatsby';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegHeart } from 'react-icons/fa';
import { IoIosGitCompare } from "react-icons/io";
import Modal from 'react-bootstrap/Modal';
import { useForm } from "react-hook-form";
import ImageNotFound from "./../assets/car-dealer-loader.gif";
import SliderImage from 'react-zoom-slider';




const Productdescription = ({ proDescription, setcartCount, setWishListCnt }) => {
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
  const [data, setData] = useState([
    {
      image: (ImageNotFound),
      text: 'loading',
      width: 2000,
      height: 1800
    }])



  useEffect(() => {
    setCustomerId(localStorage.customer_id)
    setJwt(localStorage.userToken);
    setQuoteId(localStorage.cartId);
    if (proDescription.items.config_options) {
      setcartItem({
        "cartItem": {
          "sku": proDescription.items.config_options[0].optins_values.sku,
          "qty": qty,
          "quote_id": localStorage.cartId
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
          "quote_id": localStorage.cartId
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
        url: `${process.env.GATSBY_CART_URL}admin/tierprice/${proDescription.items.id}`,
        //${proDescription.items.id}
      }).then((res) => {
        setTierProduct(res.data)
      }).catch((err) => {
        console.error(err);
      });
    }

    axios({
      method: "get",
      url: `${process.env.GATSBY_CART_URL}admin/priceaddtocartenabledisable/${localStorage.customer_id}
      `,
    }).then((res) => {
      let cart_price = res.data
      if (cart_price[0].hide_price == "1") {
        setDisable(true)
        return setShowBtn(1)
      }
      if (cart_price[1].hide_add_to_cart == "1") {
        setDisable(true)
        return setButton(true)
      }
    }).catch((err) => {
      console.error(err);
    });

    const res = axios.get(
      `${process.env.GATSBY_CART_URL}admin/minmaxquantity/${proDescription.items.id}`
    ).then((data) => {
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
        "quote_id": localStorage.cartId
      }
    })
    let set_price = [];
    set_price.push(changeSizeValue.optins_values);
    setchange_Price(set_price)
    setproduct_id(changeSizeValue.optins_values.product_id)
  }

  const addItemToCart = (cartItem) => {
    let cartData;
    if (proDescription.items.config_options) {
      cartData = {
        "cartItem": {
          "sku": change_price[0].sku,
          "qty": qty,
          "quote_id": localStorage.cartId
        }
      }
    } else {
      cartData = {
        "cartItem": {
          "sku": proDescription.items.sku,
          "qty": qty,
          "quote_id": localStorage.cartId
        }
      }
    }

    if (!checkLogin()) {
      navigate('/signin')
    } else {
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
    }
  }

  const handleChange1 = (event) => {
    const re = /^[0-9\b]+$/;
    if (!re.test(event.target.value)) {
      event.target.value = ""
    }
  }

  const pinCodeChecker = (event, id) => {
    let data;
    try {
      axios.get(
        `${process.env.GATSBY_CART_URL}admin/pincodecheck/${id}`
      ).then(async (res) => {
        await res.data.map((pin) => {
          if (event == pin.pincode) {
            data = pin.pincode
          }
        })
        await verifycode(event, data)
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
    let url = (type == 1 ? `${process.env.GATSBY_NODE_URL_STARCARE}admin/addtocompare/2` : `${process.env.GATSBY_CART_URL_STARCARE}wishlist/addwishlist_product/`)
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

  }


  const handleChange = async (event) => {
    let price;
    if (event.target.value <= 0) {
      event.target.value = 1;
      setQty(event.target.value)
      setPrice(proDescription.items.price)
    } else {
      setQty(event.target.value)
      tierAmt.map(item => {
        if (event.target.value == item.Tier_quantity) {
          price = item.Tier_price
        }

      })
      await updatePirce(price)
    }
  }
  const updatePirce = (price) => {
    if (price != undefined) {
      setPrice(price)
    } else {
      setPrice(proDescription.items.price)
    }
  }
  const quotePopupOpen = () => {
    if (!checkLogin()) {
      navigate('/signin')
    } else {
      setQuotePopup(true)
      handleShowQuote(true)
    }
  }
  const onChangeValue = (event) => {
    setQty(event.Tier_quantity)
    setPrice(event.Tier_price)
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
        url: `${process.env.GATSBY_CART_URL}admin/productquote`,
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
    }
  };

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
        "quote_id": localStorage.cartId
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


  return (
    <>
      {proDescription && proDescription.items ? (
        <>
          <div className="container">
            <div className="product_view">
              <div className="row upper-space">
                <div className="col-lg-5 col-md-4 col-xs-12 text-center border_f">
                  <div className="slider_Product">
                    {data.length > 0 && <SliderImage data={data} showDescription={true} direction="right" />}
                  </div>
                </div>
                <div className="col-lg-7 col-md-8 col-xs-12 pr-5 product_details">
                  <section className="product_details">
                    <h1 className="mb-2">
                      {proDescription.items.name}
                    </h1>
                    {proDescription.items.rating ?
                      <StarRatings
                        rating={Math.round(proDescription.items.rating)}
                        numberOfStars={5}
                        name='rating'
                        starDimension="20px"
                        starSpacing="0px"
                        starRatedColor="rgb(242 187 22)"
                      /> : <p className="no_review"> No Reviews Yet</p>
                    }
                    <div className="brand mt-2">

                    </div>
                    <div className="rating_field">

                      <div className="star-rating">
                        <span className="fa fa-star-ofa far fa-star" data-rating="1"></span>
                        <span className="fas fa-star" data-rating="2"></span>
                        <span className="far fa-star" data-rating="3"></span>
                        <span className="far fa-star" data-rating="4"></span>
                        <span className="far fa-star" data-rating="5"></span>
                        <input type="hidden" name="whatever1" className="rating-value" value="2.56" />
                      </div>
                      <span className="rating_text">
                      </span>

                    </div>
                    <div className="product_note py-2">

                      <div className="prd_note">
                        <p>
                          Brand: <a href="">{proDescription.Brand}</a>
                        </p>

                        {proDescription.items.config_options ?
                          change_price.map((val, index) => (
                           <p> SKU:<span >{val.sku}</span></p>
                          )) :
                          <p> SKU: <span>{proDescription.items.sku}</span></p>
                        }
                      </div>
                      <div>
                        <i className="fas fa-check-circle"> In Stock</i>
                      </div>
                    </div>
                    {tierAmt.length != 0 ? (
                      <table className="table compareList_table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Save Discount</th>
                          </tr>
                        </thead>

                        {
                          tierAmt.map((item, index) => (
                            <tbody key={item.sku}>
                              <tr>
                                <td>
                                  <input type="radio" checked={qty == item.Tier_quantity} value="item.Tier_quantity" name="item.Tier_quantity" onChange={() => { onChangeValue(item) }} />
                                </td>
                                <td>
                                  <span>{item.Tier_quantity}</span>
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
                        <p>Qty<span className="mx-2">:</span>
                        </p>
                        <div className="qty_price">
                          <input type="number" value={qty} onChange={event => { handleChange(event) }} />
                        </div>
                        {isShow == 1 ? <span></span> :
                          (proDescription.items.config_options ?
                            change_price.map((val, index) => (
                              <span className="price" key={index}>${Math.round(val.price)}</span>
                            )) :
                            <span className="price">${Math.round(proDescription.items.price)}</span>
                          )
                        }
                      </div>
                      <div className="button_sec">
                        <button onClick={() => addItemToCart(cartItem)} className="btn_gray btn" disabled={isButton}>
                          Add To Cart
              </button>
                        <button onClick={() => quotePopupOpen()} className="btn_gray btn ml-1">
                          Request for a Quote
              </button>
                        <div className="product_detail_action">
                          <a onClick={() => addToList(2)} >
                            <FaRegHeart /> Add to Wishlist
              </a>

                          <a onClick={() => addToList(1)} >
                            <IoIosGitCompare /> Add to Compare
              </a>
                        </div>
                      </div>
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
                    <div>
                      <div className="input-group mb-3 mt-2">
                        <input type="tel" id="pincode" name="postcode" placeholder="Zip/Postal Code " onChange={handleChange1} maxLength="6" className="form-control" />
                        <button onClick={() => pinCodeChecker(document.getElementById('pincode').value, proDescription.items.id)} className="input-group-text" disabled={Istrue}>Zip/Postal Code</button>
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
