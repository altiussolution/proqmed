import React, { useEffect, useState, useReducer } from "react";
import { navigate } from "gatsby";
import queryString from "query-string";
import Helmet from 'react-helmet';
import { FaStar } from 'react-icons/fa';
import MultiRangeSlider from '../PriceSlider/MultiRangeSlider';
import { Slider } from '@mui/material';
import { convertToObject } from "../../utils/convertToObj";
import "./filter.css";
const arr = [];
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
  const [minValue, set_minValue] = useState(25);
const [maxValue, set_maxValue] = useState(75);
const [unchange,unchangeMax] = useState(150);
const [unchangem,unchangeMin] = useState(150);
  const [filters, dispatch] = useReducer(filterReducer, {}); // {'Brand':['VERTO','GRAPHITE']}
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [parsing, setParsing] = useState(true);
  const displayFilters = {};
  const [filterCheckBox, setFilterCheckBox] = useState(products);
  const [checked, setChecked] = useState(false);
  const [groupId,grpI] = useState("");
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
    grpI(localStorage.group)
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
      arr.push(el[0].items.prices[groupId]['final_price'])
      
      const product = convertToObject(el.flat());
      // console.log(product)
      for (let prop in product) {
        if (prop !== "items" && prop !=="Special Price") {
          displayFilters[prop] = displayFilters[prop]
            ? displayFilters[prop].add(prop=="Offer Percentage" ? product[prop][groupId]:product[prop])
            : new Set([prop=="Offer Percentage" ? product[prop][groupId]:product[prop]]);

        }
      }
    }); 
    set_maxValue(Math.max(...arr))
    set_minValue(Math.min(...arr))
    unchangeMin(Math.min(...arr))
    unchangeMax(Math.max(...arr)+10)
    setFiltersToDisplay(displayFilters);
  }, [products]);

  const filter = async () => {
    const query = queryString.stringify(filters, { arrayFormat: "index" });
    if(query=="" && minValue!=25 && maxValue!=75){
      setChecked(false)
      console.log("gokul",minValue,maxValue)
      var numbers = [];
      for (var i = minValue; i <= maxValue; i++) {
        numbers.push(i);
      }
    
        var result = products.filter(function (prod) {
          return numbers.some(function (o2) {
              return Math.round(prod[0].items.prices[groupId]['final_price']) === o2; // return the ones with equal id
         });
      });
      let arr1=[];
      result.forEach(el => {
        arr1.push(el[0])
      })
      await setFilteredProducts(arr1)
      await setFilterCheckBox(products)
    }else {
      let tempFilteredProducts;
      var numbers = [];
      for (var i = minValue; i <= maxValue; i++) {
        numbers.push(i);
      }
    
        var result = products.filter(function (prod) {
          return numbers.some(function (o2) {
              return Math.round(prod[0].items.prices[groupId]['final_price']) === o2; // return the ones with equal id
         });
      });
      
     
      tempFilteredProducts = filterOperation(result);
      if(tempFilteredProducts.length!==0){
        await setFilteredProducts(tempFilteredProducts);
        await setFilterCheckBox(tempFilteredProducts)
      }else{
        setFilteredProducts([])
        setFilterCheckBox(products)
      }
      
      if (parsing) setParsing(false);
    }
   
  };

  const filterOperation = products => {
    let tempFilteredProducts = [];
    Object.keys(filters).forEach((prop, index) => {
      console.log(prop)
      products.forEach(el => {
        if (index === 0) {
          const product = convertToObject(el.flat());
          if (product[prop] && filters[prop].includes(prop=="Offer Percentage" ? product[prop][groupId]:product[prop])) {
            tempFilteredProducts = tempFilteredProducts
              .filter(item => item.items.id !== product.items.id)
              .concat(product);
          }
        } else {
          tempFilteredProducts = tempFilteredProducts.filter(product => {
            return product[prop] && filters[prop].includes(prop=="Offer Percentage" ? product[prop][groupId]:product[prop]);
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
     if(e.target.checked){
       setChecked(true)
     }else {
      
     }

  };

  const handleInput = (e) => {
    // dispatch({
    //   type: "CLEAR",
    //   payload: {},
    // })
   
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
    var numbers = [];
    for (var i = e.minValue; i <= e.maxValue; i++) {
      numbers.push(i);
    }
    filterOperationPrice(products,numbers);
    return numbers;
  };

  const filterOperationPrice = async(products,numbers) => {
    console.log(numbers)
    console.log(filterCheckBox,checked)
    let arr1 = [];
   if(checked){
     var res = filterCheckBox.filter(function (prod){
      return numbers.some(function (o2) {     
        return Math.round(prod.items.prices[groupId]['final_price']) === o2; // return the ones with equal id
      
      
 });
     })
     if(res.length){
      await setFilteredProducts(res);
     }else {
      handleFilterChange("empty");
     }
    
    if (parsing) setParsing(false);
   } else {
    var result = filterCheckBox.filter(function (prod) {
      return numbers.some(function (o2) {     
            return Math.round(prod[0].items.prices[groupId]['final_price']) === o2; // return the ones with equal id
          
          
     });
  });
  // console.log(numbers,"numbers output")
  console.log(result)
   result.forEach(el => {
    arr1.push(el[0])
  }); 
  if(arr1.length){
    await setFilteredProducts(arr1);
  } else {
    handleFilterChange("empty");
  }
  
  //await setFiltersToDisplay(displayFilters);
  //  if (parsing) setParsing(false);
   }
   
  }
 const allClear = ()=> {
  dispatch({
    type: "CLEAR",
    payload: {},
  })
  set_maxValue(Math.max(...arr))
    set_minValue(Math.min(...arr))
    unchangeMin(Math.min(...arr))
    unchangeMax(Math.max(...arr)+10)
 }
  const checkIfChecked = (val, key) => {
    if (location.search.length) {
      if (parsedQuery[key] && parsedQuery[key].includes(val)) return true;
    }
    return false;
  };

 

const renderPriceFilters = () => {
  return (
    <div className="filtr-price"><h6>Price</h6>
    <MultiRangeSlider
			min={unchangem}
			max={unchange}
			step={1}
			ruler={false}
			label={true}
			preventWheel={true}
			minValue={minValue}
			maxValue={maxValue}
			onInput={(e) => {
				handleInput(e);
			}}
		/>
    </div>
  )
 
}
  const renderFilters = () => {      
    if (filtersToDisplay) {
      console.log(filtersToDisplay)
      return Object.keys(filtersToDisplay).map(key => {
        const values = Array.from(filtersToDisplay[key]);
        return (
          <div key={key} className={key + ' ' + "my-3"}>
            <h6>{key}</h6>
            
            {values.map((val, i) => (
              <div key={i}>
             {val != "" &&  <div
                key={val + i}
                className="text-sm opacity-50 flex items-center">
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
                  <span >{key == "Offer Percentage" ? (val==9 ? Math.round(val) :Math.round(val) ) : (key == "Rating" && val!="") ? val  : key == "Special Price" ? Math.round(val) : val}
                 <span className={key == "Rating" ? "fa fa-star" : "inp_val"}>{key == "Offer Percentage" ? (val==9 ? "% & below" :"% & more") : (key == "Rating" && val!="") ? "& above" : ""}</span>

                 </span>
                  </label>
                   </div> 
              </div> }
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
            onClick={() => allClear()}
            mediummediummedium="true"
            title="Clear Filters"
            className="clear_all_link"
          >
            Clear all
          </div>
        </div>
        
        <div className="productFilters ">
          {renderPriceFilters()}
          {renderFilters()}
          </div>
      </div>
    </div>
  );
}