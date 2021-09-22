import { Link, navigate } from "gatsby"
import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { getCategoryURL } from "../utils/url";
import brand1 from './../assets/brand1.jpg';
import brand2 from './../assets/brand2.jpg';
import brand3 from './../assets/brand3.jpg';
import brand4 from './../assets/brand4.jpg';
import brand5 from './../assets/brand5.jpg';
import brand6 from './../assets/brand6.jpg';
import home_icon from './../assets/home_icon.svg';

import { Navbar, Nav } from 'react-bootstrap';

  
const SubHeader = ({ allCategory }) => {

  const [popularProducts, setPopularProducts] = useState(null);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const fetchPopular = async () => {
      const res = await fetch(
        `${process.env.GATSBY_CART_URL_STARCARE}admin/mostpopular/15`
      );
      const json = await res.json();
      await setPopularProducts(json);
    };
    fetchPopular();
  }, []);

  const [search, setSearch] = useState("");
  const onSubmit = event => {
    event.preventDefault();
    if (search.trim().length) {
      navigate(`/search?keyword=${search}`);
      setSearch("");
    }
  };


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
    <div className="bottom_header">
      <div className="container">
        <Link to="/" className="home_icon">
        <img src={home_icon} alt={"banner"} />
        </Link>
        <Navbar className="bulkorder all_categories_list">
          <div className="dropdown">
            <a className="btn dropbtn">All Categories</a>  
            <div className="dropdown-content">
                <ul className="categories_dropdown">
                  <li className="parent"><a href="#">Shop By Caregory</a>
                    <ul className="child">
                      {renderCategories('dropdown')}
                    </ul>
                  </li>

                  <li className="parent"><a href="#">Shop By Brand</a>
                    <ul className="child menu_brand">
                      <li><img src={brand1} alt={"banner"} /></li>
                      <li><img src={brand2} alt={"banner"} /></li>
                      <li><img src={brand3} alt={"banner"} /></li>
                      <li><img src={brand4} alt={"banner"} /></li>
                      <li><img src={brand5} alt={"banner"} /></li>
                      <li><img src={brand6} alt={"banner"} /></li>
                    </ul>
                  </li>
                  <li className="parent d-none"><a href="#">Most Popular</a>
                    <ul className="child">
                      <li>ASAs</li>
                      <li>ASAs</li>
                      <li>ASAs</li>
                      <li>ASAs</li>
                      <li>ASAs</li>
                    </ul>
                  </li>
                </ul>
            </div>
          </div>
        </Navbar>
        {renderCategories('topList')}
      </div>

    </div>
  )
}

SubHeader.propTypes = {
  siteTitle: PropTypes.string,
}

SubHeader.defaultProps = {
  siteTitle: ``,
}

export default SubHeader
