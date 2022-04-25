import React, { useState, useEffect } from "react"
import axios from "axios";
import { getProductURL } from "../utils/url";
import { Link } from "gatsby";
import Layout from '../components/layout';
import { IoGridOutline } from "react-icons/io5";
import { IoList } from "react-icons/io5";
import { FaRegHeart } from 'react-icons/fa';
import PageLoader from "../components/loaders/pageLoader";
import { getCartCount ,getWLCount,viewCartItems} from "./../utils/apiServices";
import { navigate } from "gatsby";
import { ToastContainer, toast } from 'react-toastify';
import { wishListCount } from '../utils/apiServices'
import StarRatings from 'react-star-ratings';

const BrandedProducts = ({pageContext, location }) =>{
    const [productBrand, setProductBrand] = useState([]);
    const [loader, setLoader] = useState(false);
    const [brandImage, setBrandImage] = useState('');
    const [jwt, setJwt] = useState("");
    const [quote_id, setQuoteId] = useState("");
    const [qty, setQty] = useState(1);
    const [isButton, setButton] = useState(false);
    const [viewClass, setViewClass] = useState('grid_view');
    const [pcar,percart] = useState(false);
    const [outp,outper] = useState(false);
    const [outpcar,outpercart] = useState(false); 
    const [cartCount, setcartCount] = useState(null);
    const [customerId, setCustomerId] = useState("");
    const [p,per] = useState(false);
    const [permits,setPermit] = useState([]);
    useEffect(() => {
      console.log(location)
        product()
        setPermit(localStorage.permissions)
        setCustomerId(localStorage.customer_id)
        if(permits.length!=0){
          let addwis=permits.includes("Can Add To Wishlist")
          let addcar=permits.includes("Can Add To Cart")
          per(addwis)
          percart(addcar)
      }else if(!localStorage.permissions){
        outper(true)
        outpercart(true)
      }
        setJwt(localStorage.userToken)
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

                //viewCartItems()
              //  localStorage.removeItem('cartData', []);
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
      //else{
      //     navigate("/signin")
      // }
    },[]);


const product = ()=>{
    setLoader(true);      
    axios({
        method : "get",
        url: `${process.env.GATSBY_CART_URL_STARCARE}admin/brandproducts/${location.state.brand_id}/${localStorage.customer_id}`
        }).then(async (res) => {
            //    await axios.get(
            //    `${process.env.GATSBY_NODE_URL}data/brandedproducts/${location.state.brand_id}.json`
            //  ).then((res)=>{
                 const item = res.data
                 console.log("item", item)
                 setBrandImage(item[0])
                 let brand_prod = item.slice(1, item.length)
                 if(res.data !== "No products in this brand"){
                 setProductBrand(brand_prod);
                 setLoader(false);
             }
            // }
            // )
             
               })
}
const cartValue = () => {
    setTimeout(() => {
      setcartCount(getCartCount());
    }, 3000);
  }
const addtoCartItems = (sku, id) => {
    if (localStorage.userToken) {
        const cartItem = {
            "cartItem": {
                "sku": sku,
                "qty": qty,
                "quote_id": quote_id
            }
        }
        setButton(true);
        const jwt = localStorage.userToken
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
                        viewCartItems();
                        // removeProduct(id, 'cart')
                        toast.success('Succesfully added to cart');
                          cartValue();
                          setButton(false);
                    }
                }).catch((err) => {
                  if (err.message === "Request failed with status code 400") {
                    toast.error("Product that you are trying to add is not available")

                  }else{
                    toast.error('Failed to add cart')

                  }
                    console.error(err);
                    // toast.error('Failed to add cart')
                })
            } catch (err) {
                console.error(err)
            }
        }
    }
    else {
        localStorage.clear()
        navigate("/signin")
    }
}
const addToList = (type,id) => {
  if (localStorage.userToken) {

    // type 1 = wishlist
    // type 2 = comparelist
    let url = (type == 1 ? `${process.env.GATSBY_CART_URL_STARCARE}admin/addtocompare/2` : `${process.env.GATSBY_CART_URL_STARCARE}wishlist/addwishlist_product/`)
    let message = (type == 1 ? 'Sucessfully added to  compare list' : 'Sucessfully added to wish list')
    let productData = {
      "data": {
        "customer_id": customerId,
        "product_id": id
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
          toast.success(message)
          wishListCount()
          setTimeout(()=>{
            getWLCount()
          },2000)
        }
      }).catch((err) => {
        toast.error(err)
      })
    } catch (err) {
      toast.error(err)
    }
  }  else {
    localStorage.clear()
    navigate("/signin")
}
  }
  const shortBySelected = (event) => {
    // setLoading(true);
    const selecturl = event.target.value;
    if(event.target.value == ""){
      event.target.value="productsasc"
    }
    const ids = pageContext.id;  
    const selectRes =[];
    try {
      axios({
          method: 'get',
          url: `${process.env.GATSBY_CART_URL_STARCARE}admin/${selecturl}/${location.state.brand_id}/${localStorage.customer_id}`,
      }).then((res) => {
          if (res.statusText === "OK" && res.status == 200) {
            for(let response of res.data[0]){
              selectRes.push(response[0])
            }
            setProductBrand(selectRes);
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
    const renderProducts = () => {    
      if (productBrand) { 
          return <div className="row products_fp">   
              {       
                  productBrand.map((data,index) => (
                      <div  className={`item product_item deal ${viewClass}`} key={`${data.name}_${index}`}>
                        {p && <div className="wishComp">
                                  <ul>
                                    <li><a onClick={() => addToList(2,data.id)}><FaRegHeart /></a></li>
                                  </ul>
                              </div>}
                              {outp && <div className="wishComp">
                                  <ul>
                                    <li><a onClick={() => addToList(2,data.id)}><FaRegHeart /></a></li>
                                  </ul>
                              </div>}
                          <div className="card deal">    
                          
                            
                              <div className="image_wrapper br  ">
                              {/* <div className="actn_btn_holder">                                  
                                  <ul>
                                    <li className="icn"><BiShoppingBag/></li>
                                    <li>{ <Link className="btn" to={getProductURL(data)}
                                  state={data}>View Detail</Link> }</li>
                                    <li className="icn"><a onClick={() => addToList(1,data.id)}><IoIosGitCompare/></a></li>
                                  </ul>                                
                              </div> */}
                                {data.offer_percentage != 0 && <div className="price_off">{Math.round(data.offer_percentage)}% off</div>}
                               <Link to={getProductURL(data)}>
                               <img src={data.image} />
                               </Link>
                                  

                              </div>                                
                             
                              <div className="price_holder-deal">
                              <Link to={getProductURL(data)}><p className="product_title">{data.name}</p></Link>
                              <div className="price_left deal ab">                                  
                                  <div className="product_amt">
                                  {data.strike_price != null  && <span className="new_price">${Math.round(data.strike_price)}</span>}
                                      <span className="price">${Math.round(data.final_price)}</span>
                                      <div className="rating_front">
                                  <StarRatings
                                      rating={Math.round(data.rating)}
                                      numberOfStars={5}
                                      name='rating'
                                      starDimension="20px"
                                      starSpacing="0px"
                                      starRatedColor="rgb(255 123 168)"
                                      svgIconViewBox="0 0 32 32"
                                      svgIconPath="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"
                                  />
                                 
                                  </div>
                                  </div>
                                 
                                  {pcar && <div className="price_right">                                   
                                <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span className="cart_svg"></span></button>
                                { <Link  to={getProductURL(data)} state={data} className="btn outline-1">View Detail</Link> }
                                </div>}
                                {outpcar && <div className="price_right">                                   
                                <button className="addtocart" onClick={() => addtoCartItems(data.sku, data.id)}><span className="cart_svg"></span></button>
                                { <Link  to={getProductURL(data)} state={data} className="btn outline-1">View Detail</Link> }
                                </div>}
                              </div>
                                 
                              </div>
                          </div>

                      </div>
                  ))
              }
          </div>
      }
  }
    return (

        <Layout>
            <section className="page_content inner_page">
                <div className="content_wrapper">
                    <div className="container">
                        <div className="row main_title">
                            <h1>Our <span>Brands</span></h1>
                            <div className="tools_items">
                          {/* <div className="tools">
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
                          </div> */}
                          <div className="tools">
                            <div className="title_view">
                            <button  className={"view-btn list-view"+(viewClass === 'list_view' ? ' active_btn':'')} id="list" data-toggle="tooltip" data-placement="top" title="List" onClick={() => setViewClass('list_view')}><IoList /></button>
                              <button  className={"view-btn grid-view"+(viewClass === 'grid_view' ? ' active_btn':'')} id="grid" data-toggle="tooltip" data-placement="top" title="Grid" onClick={() => setViewClass('grid_view')}><IoGridOutline /></button>
                            </div>
                          </div>
                        </div>
                        </div>
                        <div className="category_container">
                    
                    <div className="cat_scroll">
                      <div className="container">
                            {renderProducts()}
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
            </section>

            {loader ? (<div>
                <PageLoader />
            </div>) : <span></span>}
        </Layout>

    )
}

export default BrandedProducts;
