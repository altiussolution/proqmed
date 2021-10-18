import { Link } from "gatsby"
import React from "react"
import { getCategoryURL } from "../utils/url";
import ImageNotFound from "./../assets/allimg.jpg"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Steth from "./../assets/steth.png"
import Doc from "./../assets/doc.png"
import Glove from "./../assets/glove.png"
import StarRatings from 'react-star-ratings';


const Topcategory = ({categories}) => {
    const renderCategories = () => {
        const elements_in_each_row = Math.round(categories.length / 4);
    
        const list = [];
        for (let i = 0; i < categories.length; i += elements_in_each_row) {
          list.push(categories.slice(i, i + elements_in_each_row));
        }

        return list.map((el, index) => (

         

          <div key={index} className="image_wrappertab">
            {el.map(item => (
              <div key={item.node.id} className="row" >
                <div className="col-lg-12 border">                  
                {/* <div className="image_wrapper">
                <div className="card_overlay"> */}
                <ul>
                  {   
                    item.node.grand_child.map((e,index)=>(
                    <li key={e.name}><Link to={getCategoryURL(e)}>{e.name}</Link></li>
                    ))
                  }
                </ul>
                {/* </div> */}
                        {/* <img className="w-100" src={`${item.node.image}`} onError={e => (e.target.src = ImageNotFound)}/> */}
                        <img className="img-fluid" src={`${item.node.image}`} onError={e => (e.target.src = ImageNotFound)}/>
                {/* </div> */}
                
                {/* <StarRatings
                                        // rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    /> */}

                <h3>{item.node.name}</h3>
                </div>
                
              </div>
            ))}
{/* Alagapan */}
            {/* <div className="image_wrappertab">
              <div className="row">
                <div className="col-lg-3 border">
                  <h4> NEW </h4>
                  <img className="w-100" src={`${item.node.image}`} alt={"banner"}/>
                  <img className="w-100" src={Steth} alt={"banner"}/> 
                  <StarRatings
                  
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3>{item.node.name}</h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                <div className="col-lg-3 border">
                  <h4> NEW </h4>
                  <img className="w-100" src={Steth} alt={"banner"}/> 
                  <StarRatings
                  
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Stethescope </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                <div className="col-lg-3 border">
                  <h4> NEW </h4>
                  <img className="w-100" src={Steth} alt={"banner"}/> 
                  <StarRatings
                  
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Stethescope </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                <div className="col-lg-3 border">
                  <h4> NEW </h4>
                  <img className="w-100" src={Steth} alt={"banner"}/> 
                  <StarRatings
                  
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Stethescope </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                
                
              </div>
            </div> */}
          </div>

        

          
          
        ));   
      };

    return (
//     <section className="category_section">
//     <div className="container">
        
//         <div className="row">
//         <h2 className="section_title">
//         <span>Shop by Department </span>
//         <span><Link to="/mainCategory" >+ View all Categories</Link></span>
//         </h2>
//           <div className="row">
        
//             {renderCategories()}
//         </div>
//     </div>
//     </div>
// </section>
<div>
<section className="category_section">
<div className="container">
<h2 className="section_title text-center">
<span>Our Products</span>
<p>Contrary to popular belief, Lorem Ipsum is not simply random text</p>
</h2>
<Tabs>
    <TabList>
      <Tab>GLOVES & MEDICAL KIT</Tab>
      <Tab>COLD CHAIN EQUIPMENT & MEDICAL DISPOSAL</Tab>
      <Tab>SURGICAL INSTRUMENTS & ANAESTHESIA EQUIPMENTS</Tab>
    </TabList>

    <TabPanel>
    
    {renderCategories().slice(0, 1)}
   
    </TabPanel>
    <TabPanel>
    {renderCategories().slice(1, 2)}
    </TabPanel>
    <TabPanel>
    {renderCategories().slice(2, 3)}
    </TabPanel>
  </Tabs>
  </div>
  </section>

  {/* Dev Code */}


  <div className="hotoffer_banner">
<div className="row">
  <div className="col-lg-6 text-center">
  <img className="HF_BImg" src={Doc} alt={"banner"}/> 
  </div>
  <div className="col-lg-6 padding_se">
    <h6> Todays Hot Offer</h6>
    <h2>Buy all your medicines @ 50% Offer</h2>

    <p>Get extra cashback with great deals & discount</p>

    <div className="timer">
      <div className="bg_white">
        <h1>93</h1>
        <p className="sep">Days</p>
      </div>
      <div className="bg_white">
        <h1>06</h1>
        <p className="sep">Hrs</p>
      </div>
      <div className="bg_white">
        <h1>54</h1>
        <p className="sep">Mins</p>
      </div>
      <div className="bg_white">
        <h1>00</h1>
        <p className="sep">Secs</p>
      </div>
    </div>

    <div className="button_sec">
    <button type="button" class="btn btn-primary">Shop Now</button>
    <a href="#">Deal of the day</a>
    </div>
  </div>
</div>
  </div>

  {/* <div className="container image_wrappertab">
  <h2 className="section_title text-center">
<span>Best Selling Products</span>
<p>Contrary to popular belief, Lorem Ipsum is not simply random text</p>
</h2>
              <div className="row">
                <div className="col-lg-3 border">
                  <h4> NEW </h4>
                  <img className="w-100" src={Steth} alt={"banner"}/> 
                  <StarRatings
                                        // rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Stethescope </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                <div className="col-lg-3 border">
                  
                  <img className="w-100" src={Glove} alt={"banner"}/> 
                  <StarRatings
                                        // rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Gloves </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                
                <div className="col-lg-3 border">
                  <h4> NEW </h4>
                  <img className="w-100" src={Steth} alt={"banner"}/> 
                  <StarRatings
                                        // rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Stethescope </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                <div className="col-lg-3 border">
                  
                  <img className="w-100" src={Glove} alt={"banner"}/> 
                  <StarRatings
                                        // rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Gloves </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                
                
              </div>

              <div className="row">
                <div className="col-lg-3 border">
                  <h4> NEW </h4>
                  <img className="w-100" src={Steth} alt={"banner"}/> 
                  <StarRatings
                                        // rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Stethescope </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                <div className="col-lg-3 border">
                  
                  <img className="w-100" src={Glove} alt={"banner"}/> 
                  <StarRatings
                                        // rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Gloves </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                
                <div className="col-lg-3 border">
                  <h4> NEW </h4>
                  <img className="w-100" src={Steth} alt={"banner"}/> 
                  <StarRatings
                                        // rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Stethescope </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                <div className="col-lg-3 border">
                  
                  <img className="w-100" src={Glove} alt={"banner"}/> 
                  <StarRatings
                                        // rating={Math.round(data.ratings_summary)}
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(242 187 22)"
                                    />

                                    <h3> Gloves </h3>
                                    <h6 className="pricegreen"> $32.00 <span>($42.00)</span> </h6>

                                    <div className="button_sec">
                                    <button type="button" class="btn btn-success">Buy Now</button>
                                    <button type="button" class="btn btn-default">Add to cart</button>
                                    </div>
                </div>
                
                
              </div>
            </div> */}
  </div>


    )

}

export default Topcategory     



