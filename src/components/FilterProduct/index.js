import React, { useEffect, useState, useReducer } from "react";
import { navigate } from "gatsby";
import queryString from "query-string";
import Helmet from 'react-helmet';

import { convertToObject } from "../../utils/convertToObj";
import "./filter.css";

const filterReducer = (state, { type, payload }) => {
  let newKey;
  switch (type) {
    case "ADD": {
      const { name, key } = payload;
      newKey = state[key] ? state[key].concat(name) : [name];
      return {
        ...state,
        [key]: newKey,
      };
    }
    case "REMOVE": {
      const { name, key } = payload;
      newKey = state[key].filter(el => el !== name);
      if (newKey.length) return { ...state, [key]: newKey };
      else {
        const tempState = Object.assign({}, state);
        delete tempState[key];
        return { ...tempState };
      }
    }
    case "CLEAR":
      return payload;
    case "URL_QUERY":
      return payload;
    default:
      return state;
  }
};

export default function Filter({
  products,
  handleFilterChange,
  menuOpen,
  location,
  doClear
}) {
  const [filtersToDisplay, setFiltersToDisplay] = useState({});
  const [filters, dispatch] = useReducer(filterReducer, {}); // {'Brand':['VERTO','GRAPHITE']}
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [parsing, setParsing] = useState(true);
  const displayFilters = {};
  const parsedQuery = queryString.parse(location.search.slice(8), {
    arrayFormat: "index",
  });  

//   handleChange: function() {
//   var options = e.target.options;
//   var value = [Color];
//   for (var i = 0, l = options.length; i < l; i++) {
//     if (options[i].selected) {
//       value.push(options[i].value);
//     }
//   }
//   this.props.someCallback(value);
// }
  

  useEffect(() => {
    // Parse the filter query and set filters if query available
    if (Object.keys(parsedQuery).length) {
      dispatch({
        type: "URL_QUERY",
        payload: parsedQuery,
      });
      // temporary fix by meenu
      // if(doClear == true && parsedQuery.Activity == undefined){
      //   dispatch({
      //     type: "CLEAR",
      //     payload: {},
      //   });
      // }
      // temporary fix by meenu not efficient
    }
    // Create displayFilters from Products listing
    products.forEach(el => {
      const product = convertToObject(el.flat());
      for (let prop in product) {
        if (prop !== "items") {
          displayFilters[prop] = displayFilters[prop]
            ? displayFilters[prop].add(product[prop])
            : new Set([product[prop]]);
            console.log(displayFilters[prop])

        }
      }
    }); 
    setFiltersToDisplay(displayFilters);
    console.log("oi",displayFilters)
  }, [products]);

  const filter = async () => {
    let tempFilteredProducts;
    tempFilteredProducts = filterOperation(products);
    await setFilteredProducts(tempFilteredProducts);
    if (parsing) setParsing(false);
  };

  const filterOperation = products => {
    let tempFilteredProducts = [];
    Object.keys(filters).forEach((prop, index) => {
      products.forEach(el => {
        if (index === 0) {
          const product = convertToObject(el.flat());
          if (product[prop] && filters[prop].includes(product[prop])) {
            tempFilteredProducts = tempFilteredProducts
              .filter(item => item.items.id !== product.items.id)
              .concat(product);
          }
        } else {
          tempFilteredProducts = tempFilteredProducts.filter(product => {
            return product[prop] && filters[prop].includes(product[prop]);
          });
        }  
      });
    });
    return tempFilteredProducts;
  };

  useEffect(() => {
    const query = queryString.stringify(filters, { arrayFormat: "index" });
    navigate(`${location.pathname}${query.length ? `?filter=${query}` : ""}`);
    filter();
  }, [filters]);

  useEffect(() => {
    if (!parsing) {
      if (!filteredProducts.length && Object.keys(filters).length)
        handleFilterChange("empty");
      else handleFilterChange(filteredProducts);
    }
  }, [filteredProducts]);

  const handleCheckBoxChange = (e, key) => {   
    dispatch({
      type: e.target.checked ? "ADD" : "REMOVE",
      payload: {
        name: e.target.name,
        key,
      },
    });
  };

  const checkIfChecked = (val, key) => {
    if (location.search.length) {
      if (parsedQuery[key] && parsedQuery[key].includes(val)) return true;
    }
    return false;
  };

  const renderFilters = () => {      
    if (filtersToDisplay) {
      return Object.keys(filtersToDisplay).map(key => {
        const values = Array.from(filtersToDisplay[key]);
        return (
          <div key={key} className={key + ' ' + "my-3"}>
            <h6>{key}</h6>
            
            {values.map((val, i) => (
              <div
                key={val + i}
                className="text-sm opacity-50 flex items-center "
              >
                <div>
                <input
                type="checkbox"
                name={val}
                onChange={e => handleCheckBoxChange(e, key)}
                className={key+ ' ' + "mx-2"}
                id={val}
                checked={checkIfChecked(val, key)}
              />
             
                  <label htmlFor={val} >
                  <span className={val == "Clear" ? "safety_color1" : "" || val == "Dark Copper" ? "safety_color2" : "" || val == "Blue" ? "safety_color3" : "" || val == "Black;Grey" ? "safety_color4" : "" || val == "Silver" ? "safety_color5" : "" || val == "Silver;Black" ? "safety_color6"  : "" || val == "#FFFFFF" ? "safety_color7" : "" || val == "Black" ? "safety_color8" : "" || val == "Black;Orange" ? "safety_color9" : "" || val == "Black;Brown" ? "safety_color10" : "" || val == "Black/Lime" ? "safety_color11" : "" || val == "Black/Red" ? "safety_color12" : "" || val == "Yellow" ? "safety_color13" : "" || val == "White" ? "safety_color14" : "" || val == "Brown" ? "safety_color15" : "" || val == "Grey" ? "safety_color16" : "" || val == "Sky Blue" ? "safety_color17" : "" || val == "Navy" ? "safety_color18" : "" || val == "Yellow (Plug)" ? "safety_color19" : ""}></span>
                 <span className="inp_val">{val}</span>
                  </label>
                   </div>
              </div>
            ))}
            <div className="clear"></div>
          </div>
        );
      });
    }
  };

  return (
    <div
      className={`z-10 w-2/3  sm:w-1/2 md:w-1/3 lg:w-2/5 xl:w-1/3 ${
        menuOpen ? "open" : null
      } `}
    >
      <div className="filter_wrapper text-dark  px-8 pb-5">
        <div className="flex justify-between items-center filter_sidenav">
          <div className="heading text-2xl font-light tracking-widest">
            FILTERS
          </div>
          <div
            onClick={() =>
              dispatch({
                type: "CLEAR",
                payload: {},
              })
            }
            mediummediummedium="true"
            title="Clear Filters"
            className="clear_all_link"
          >
            Clear all
          </div>
        </div>
        <div className="productFilters ">{renderFilters()}</div>
      </div>
    </div>
  );
}
