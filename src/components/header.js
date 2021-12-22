import { Link, navigate, useStaticQuery, graphql } from "gatsby"
import PropTypes, { element } from "prop-types"
import React, { useState, useEffect } from "react";
import logo from './../assets/logo.png';
import Cart from './../components/cart/cart';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { checkLogin, logout } from "./../services/headerServices";
import { searchServices, getCartCount, viewCartItems } from "./../utils/apiServices";
import axios from "axios";
import { getProductURL, getCategoryURL } from "./../utils/url";
import img1 from './../assets/profile_img.png';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import { IoMailOutline } from "react-icons/io5";
import { IoCallOutline } from "react-icons/io5";
import Sidebar from './../components/Sidebar/sidebar';
import { IoMenuOutline, IoCloseSharp } from "react-icons/io5";
import closeSearch from './../assets/close.png';
import classNames from 'classnames';
import './layout.css';
import cart from './../assets/ic_cart_top.png';
import Home from '../pages/Se/sellerhome';
// import imageToBase64 from 'image-to-base64/browser';
const Header = ({ siteTitle, cartCount, allCategory }) => {

  const [isuserlogged, setIsLogged] = useState(false);
  const [search, setSearch] = useState("");
  const [activeClass, setActiveClass] = useState(false);
  const [searchResponse, setSearchRes] = useState([]);
  // Show profile Modal
  const [show, setShow] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const [jwt, setJwt] = useState("")
  const [user_name, setName] = useState("")
  const [bulkOrder, setBulkOrder] = useState([{ "sku": "", "qty": "" , "mes" : ""}, { "sku": "", "qty": "" , "mes" : "" }, { "sku": "", "qty": "" , "mes" : "" }, { "sku": "", "qty": "" , "mes" : "" }])
  // for user profile
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [mobileShow, setMobileShow] = useState(false);
  const [value, setValue] = useState();
  const [cartCnt, setCartCnt] = useState(cartCount)
  const [state, setpic] = useState("");
  const [profilepic,setProfilepic] = useState({});
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [addCartBtn, setCartBtn] = useState(false)

  useEffect(() => {
    setIsLogged(checkLogin());
    setQuoteId(localStorage.cartId);
    setJwt(localStorage.userToken);
    setEmail(localStorage.email);
    setName(localStorage.getItem('user_name'))
    window.addEventListener('scroll', isSticky);
    return () => {
        window.removeEventListener('scroll', isSticky);
    };
  }, [])
const isSticky = (e) => {
                    const header = document.querySelector('.header-section');
                    const scrollTop = window.scrollY;
                    scrollTop >= 250 ? header.classList.add('is-sticky') : header.classList.remove('is-sticky');
                };

  const getProfile = () => {
    if (jwt) {
      axios({
        method: 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}customerprofile/${email}`,
      }).then((res) => {
        if (res.statusText === "OK" && res.status == 200) {
          console.log(res,"profile")
          setProfile(res.data[0]);
          setShow(true);
        }
      }).catch((err) => {
        console.error(err);
      })
    }
  }
  const onFileChange = (event) => {
    // imageToBase64(event.target.files[0].name) // Path to the image
    // .then(
    //     (response) => {
          // console.log(response)
            // state(response);
            // const res = response
            // setpic(res);
            // console.log(setpic)
             // "cGF0aC90by9maWxlLmpwZw=="
    //     }
    // )
    // .catch(
    //     (error) => {
    //         console.log(error); // Logs an error if there was one
    //     }
    // )
    // setpic(event.target.files[0].name);
    // console.log(setpic)
  };

  const onFileUpload = () => {
    // const formData = new FormData()
    // formData.append(
    //   state.selectedFile,
    // );
    let profiledata = {   
      "data": {
          "customer_email": email,
          "image": state,
          "title": user_name
      }
  }
    if (jwt) {
      axios({
        method: 'post',
        url: `${process.env.GATSBY_CART_URL_STARCARE}profilepic/upload/`,
        headers: {
          'Authorization': `Bearer ${jwt}`
      },
      data: profiledata
      }).then((res) => {
        if (res.status == 200) {
          toast.success('Profile picture uploaded')
        }
      }).catch((err) => {
        console.error(err);
      })
    }
  };

  const getProfilepic = () => {
    if (jwt) {
      axios({
        method: 'get',
        url: `${process.env.GATSBY_CART_URL_STARCARE}profilepic/list/${email}`,
        headers: {
          'Authorization': `Bearer ${jwt}`
      }
      }).then((res) => {
        if (res.status == 200) {
          setProfilepic(res.data[0]);
          getProfile();
          setShow(true);
        }
      }).catch((err) => {
        console.error(err);
      })
    }
  }
  const onSubmit = event => {
    event.preventDefault();
    if (search.trim().length) {
      navigate(`/search?keyword=${search}`);
      setSearch("");
      setActiveClass(false);
    }
  };

  const handleClick = async event => {
    setSearch(event.target.value);
    localStorage.setItem('searchString', event.target.value)
    var boolVal = (event.target.value.length == 0 ? false : true)
    setActiveClass(boolVal);
    if (boolVal) {
      
      setTimeout(async () => {
        setSearchRes(await searchServices(localStorage.getItem('searchString')));
      }, 500)
      
    };
  }

  const cat = [];
  const catRoute = [];
  const sampleVar = () => {
    if (searchResponse) {
      searchResponse.map((item, index) => (
        item.map((val, index) => {
          if (val.items) {
            if (!cat.includes(val.items.category_name)) {
              cat.push(val.items.category_name)
              catRoute.push({ name: val.items.category_name, id: val.items.category_id })
            }
          }
        })
      ))
      return <div><h1>Category Value</h1>
        {
          catRoute.map((catVal, index) => (
            <Link to={getCategoryURL(catVal)}><p className="categories_list">{catVal ? catVal.name : 'No Product Found'}</p></Link>
          ))
        }
      </div>
    }
  }

  const searchList = () => {

    if (searchResponse) {

      return <div>
        {
          searchResponse.map((item, index) => (
            <ul key={index}>{
              item.map((val, index) => (
                (val.items ? <li key={`${index}_item`}><Link to={getProductURL(val.items)} onClick={() => setActiveClass(false)}>
                  <span className="searchImg_holder"><img src={val.items.image} className="search-img" /></span>
                  <p className="srch_txt">{val.items.name}</p></Link></li> : '')
              ))
            }
            </ul>
          ))
        }
      </div>

    } else {
      return <div>No Product found</div>
    }

  }

  const navigateOnclick = (value) => {
    if (isuserlogged) {
      navigate(value)
    } else {
      navigate('/signin')
    }
  }
  const handleChange = (event, i) => {
    const { name, value } = event.target;
    let orders = [...bulkOrder];
    orders[i] = { ...orders[i], [name]: value};
    setBulkOrder(orders); 
    if(orders[i]['sku'] === ''){
      setCartBtn(true);
      orders[i]['mes'] = "Enter Valid SKU";
      orders[i]['qty'] = " ";
    }else if(name === 'qty'){
        orders[i]['mes'] = " ";
        setCartBtn(false);
        axios.get( 
          `${process.env.GATSBY_CART_URL_STARCARE}admin/minmaxqtybulk/${orders[i]['sku']}`
        ).then(async (data) => {
          if(data.status == 200){
            await setMin(Math.round(data.data[0].min_sale_qty));
            await setMax(Math.round(data.data[0].max_sale_qty));
            if(value > max)
            {orders[i]['mes'] = `Maximum Qty is ${max}`;setCartBtn(true);}
            else if(value < min)
            {orders[i]['mes'] = `Minimum Qty is ${min}`;setCartBtn(true);}
            else{orders[i]['mes'] = " ";setCartBtn(false);}
          }
        })
    }else{
      orders[i]['mes'] = " ";
      setCartBtn(false);
    }
  }

  const clearSearchValue = () => {
    setSearch("");
    setActiveClass(false);
  }

  const validateBulkOrder = () => {
    let checkIsEmpty = false;
    for (var i = 0; i < bulkOrder.length; i++) {
      if (bulkOrder[i].sku == '' || bulkOrder[i].qty == '') {
        checkIsEmpty = true;
      }
    }
    if (!checkIsEmpty) {
      addToBulkOrder();
    } else {
      toast.error('Item number missed to entered')
    }
  }

  const addToBulkOrder = () => {
    let skuStr = bulkOrder.map((val, index) => {  
      
      return val.sku;
    }).filter(Boolean).join(',');
    let qtyStr = bulkOrder.map((val, index) => {
      return val.qty;
    }).filter(Boolean).join(',');
    let bulkData = {
      "data": {
        "sku": skuStr.trim(),
        "qty": qtyStr.trim(),
        "quote_id": quoteId,
        "token": jwt
      }
    }

    if (bulkData.data.sku === "" || bulkData.data.qty === "") {
      toast.success('Required field missing')
    } else {
      try {
        axios({
          method: 'post',
          url: `${process.env.GATSBY_CART_URL_STARCARE}bulkorder/`,
          headers: {
            'Authorization': `Bearer ${jwt}`
          },
          data: bulkData
        }).then((res) => {
          if (res.statusText === "OK" && res.status == 200) {
            viewCartItems();
            setTimeout(() => {
              setCartCnt(getCartCount());
            }, 500)
            toast.success('Items added sucessfully')
          }
        }).catch((err) => {
          console.error(err)
          toast.error('SignIn to add BulkOrder')
        })
      }
      catch (err) {
        console.error(err)
      }
    }

  }

  const logout = () => {
    setIsLogged(false)
    localStorage.clear();
    setValue({})
    navigate('/')  

  }

  const renderCategories = (type) => {

    const elements_in_each_row = Math.round(allCategory.length / 3);
    const list = [];
    const topSelected = [];

    for (let i = 0; i < allCategory.length; i += elements_in_each_row) {
      list.push(allCategory.slice(i, i + elements_in_each_row));
    }

    for (let i = 0; i < 6; i++) {
      topSelected.push([allCategory[i]]);
    }

    if (type === 'dropdown') {
      return <div className="itm_list_holder">
        {
          list.map((el, index) => (
            el.map(item => (
              <figure key={item.node.id} className="itm_list">
                <Link to={getCategoryURL(item.node)} className="itm_list_title">{item.node.name}</Link>
                {
                  item.node.grand_child.map(grand_child => (
                    <span key={grand_child.id} ><Link to={getCategoryURL(grand_child)} >{grand_child.name}</Link></span>
                  ))
                }

              </figure>
            ))
          ))
        }
      </div>
    }

    if (type === 'topList')
      return <div>
        {
          topSelected.map((el, index) => (
            el.map(item => (
              <Link to={getCategoryURL(item.node)} key={item.node.id}
                activeClassName="active" >{item.node.name}</Link>
            ))
          ))
        }
      </div>
  }
  
  

  return (

    <header className="header-section">
      {/* <div className="d-none d-md-none d-lg-block"> */}
      <div>
        
        <Navbar className="middlenavbar" expand="lg">
          <div className="container">
            <Navbar.Brand className="logo">
              <Link to="/">
                <img src={logo}></img>
              </Link>
              <div className="mobile_header d-lg-none d-md-block">
                <button onClick={() => setMobileShow(mobileShow == true ? false : true)}>{mobileShow == true ? <IoCloseSharp /> : <IoMenuOutline />}</button>
                {
                  mobileShow && <Sidebar />
                }
              </div>
            </Navbar.Brand>
            <div className="menu_main">
            <div className="menu_top">
            <Navbar className="bulkorder all_categories_list">
              <div className="dropdown">
                <a className="btn dropbtn"><span>All Categories</span>Department</a>
                <div className="dropdown-content">
                  <ul className="categories_dropdown">
                    {renderCategories('dropdown')}
                  </ul>
                </div>
              </div>
            </Navbar>
            <form className="w-100 d-flex mr-1 t_search" onSubmit={onSubmit}>
              <input
                className="search"
                type="text"
                placeholder="Search By Products"
                value={search}
                onChange={handleClick}
              />
              <input
                type="submit"
                value=""
                className=" search_submit px-6 py-3 cursor-pointer"
              />

        {  activeClass == true ?
             <img src={closeSearch}
                className="px-6 py-3 cursor-pointer search_clear"
                onClick={clearSearchValue}
              /> :<></>
            }
            </form>
            <Navbar className="bulkorder my_account">
           
              <div className="dropdown">
                <a className="btn dropbtn"><span>{isuserlogged ? `Welcome! ${user_name}` : <div>Hello,SignIn</div>}</span>My Account</a>
                <div className="dropdown-content">
                  <ul>
                    {!isuserlogged && <li><Link to="/signup">Register</Link>
                    <Link to="/signin">Login</Link></li>}
                    <li onClick={() => { navigateOnclick('/cart') }}>My Cart</li>
                    <li onClick={() => { navigateOnclick('/orders') }}>My Orders</li>
                    <li onClick={() => { navigateOnclick('/wishlist') }}>My Wishlist</li>
                    <li onClick={() => { navigateOnclick('/compareList') }}>Compare List</li>
                    <li onClick={() => { navigateOnclick('/changePassword') }}>Change Password</li>
                    {/* <li onClick={() => { navigateOnclick('/setting') }}>Setting</li> */}
                    {isuserlogged && <li onClick={getProfilepic}>My Profile</li>}
                    {isuserlogged && <li onClick={() => { navigateOnclick('/userManage') }}>User Management</li>}
                    {isuserlogged && <li onClick={() => { navigateOnclick('/myquotes') }}>My Quotes</li>}
                    {isuserlogged && <li onClick={() => { logout() }}>Logout</li>}
                  </ul>

                </div>

              </div>
            </Navbar>
            <Navbar className="bulkorder my_account">
            <div><Cart cartCount={cartCount} />
            {/* <img src={cart}/> */}
            </div>
              <div className="dropdown">
                
              
                {/* <a className="btn dropbtn carttop"><span>My Cart</span>$0.00</a> */}
                <div className="dropdown-content">
                  <ul>
                   <li onClick={() => { navigateOnclick('/cart') }}>My Cart</li>
                    <li onClick={() => { navigateOnclick('/orders') }}>My Orders</li>
                    <li onClick={() => { navigateOnclick('/wishlist') }}>My Wishlist</li>
                    <li onClick={() => { navigateOnclick('/compareList') }}>Compare List</li>
                    <li onClick={() => { navigateOnclick('/changePassword') }}>Change Password</li>
                    {/* <li onClick={() => { navigateOnclick('/setting') }}>Setting</li> */}
                    {isuserlogged && <li onClick={getProfile}>My Profile</li>}
                    {isuserlogged && <li onClick={() => { navigateOnclick('/myquotes') }}>My Quotes</li>}
                  </ul>

                </div>

              </div>
            </Navbar>
            <div className={`${activeClass ? "sampleDropDown" : "d-none"}`}>
              {sampleVar()}
              {searchList()}
            </div>
            </div>
            
            {/* <Cart cartCount={cartCount} /> */}
            {/* <Navbar className="bulkorder">
              <div className="dropdown">
                <button className="btn dropbtn">Bulk Order</button>
                <div className="dropdown-content">
                  <h1>Add Items</h1>
                  {
                    bulkOrder.map((val, index) => (

                      <div key={index} className="item_entry">
                        <div className="form-group">
                          <input placeholder="SKU" name="sku" value={val.sku || ''} onChange={e => { handleChange(e, index) }} />
                          <input placeholder="Qty" name="qty" value={val.qty || ''} onChange={e => { handleChange(e, index) }} />
                        </div>
                        <span className="text-danger">{val.mes}</span>
                        <div className="clearfix"></div>
                      </div>
                    ))
                  }
                  <button onClick={addToBulkOrder} className="btn add_btn btn_gray" disabled={addCartBtn}>Add to cart</button>
                  <Nav.Link onClick={() => { navigateOnclick('/bulkOrder') }}>Add More Items</Nav.Link>
                </div>
              </div>
            </Navbar> */}
            <div className="menu_botm">
              <ul>
                  <li onClick={() => { navigateOnclick('/') }}><a>Home</a></li>
                  <li onClick={() => { navigateOnclick('/mainCategory') }}><a>Shop</a></li>
                  <li onClick={() => { navigateOnclick('/aboutUs') }}><a >About</a></li>
                  <li onClick={() => { navigateOnclick('/contact') }}><a >Contact</a></li>
                  <li onClick={() => { navigateOnclick('/tracking') }}><a >Order Tracking</a></li>
                  <li onClick={() => { navigateOnclick('/Se/sellerhome') }}><a>Sell on Proqmed</a></li>                  
              </ul>
              <ul className="contact_top">
                  <li>For Sales & Support <a href="#">(+91)1234-5670</a></li>
                  <li><a href="#">support@proqmed.com</a></li>            
              </ul>
            </div>
          </div>
          </div>
        </Navbar>
            
      </div>



      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="profile_modal">
        <Modal.Header closeButton>
          <Modal.Title>Profile Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="profile_sec">
            <div className="profile_pic">
            {profilepic.logo ? <img src={`data:image/png;base64,${profilepic.logo}`}/>: ''}
              {/* <img src={profilepic.logo} /> */}
              <input type="file" onChange={onFileChange}/>
              <button onClick={onFileUpload}>
                  Upload!
                </button>
            </div>

            <Table>
              <tbody>
                <tr>
                  <th>Firstname</th>
                  <td>:</td>
                  <td>{jwt && profile.firstname}</td>
                </tr>

                <tr>
                  <th>Lastname</th>
                  <td>:</td>
                  <td>{jwt && profile.lastname}</td>
                </tr>

                <tr>
                  <th>Email</th>
                  <td>:</td>
                  <td>{jwt && profile.email}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>


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


    </header>

  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header

