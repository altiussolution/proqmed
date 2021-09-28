import { Link } from "gatsby"
import React from "react"
import { getCategoryURL } from "../utils/url";
import ImageNotFound from "./../assets/not-found.png"

const Topcategory = ({categories}) => {
    const renderCategories = () => {
        const elements_in_each_row = Math.round(categories.length / 4);
    
        const list = [];
        for (let i = 0; i < categories.length; i += elements_in_each_row) {
          list.push(categories.slice(i, i + elements_in_each_row));
        }

        return list.map((el, index) => (
          <div key={index} className="col-lg-3 col-md-3 col-xs-12 shop-by-department">
            {el.map(item => (
              <div key={item.node.id} className="p-1 block hover:bg-gray-200" >
                <div className="card">                  
                <div className="image_wrapper">
                <div className="card_overlay">
                <ul>
                  {   
                    item.node.grand_child.map((e,index)=>(
                    <li key={e.name}><Link to={getCategoryURL(e)}>{e.name}</Link></li>
                    ))
                  }
                </ul>
                </div>
                        <img className="img-fluid" src={`${item.node.image}`} onError={e => (e.target.src = ImageNotFound)}/>
                </div>
                {/* {console.log("imagezz", item.node.image)} */}
                <h3>{item.node.name}</h3>
                </div>
                
              </div>
            ))}
          </div>
        ));   
      };

    return (
    <section className="category_section">
    <div className="container">
        
        <div className="row">
        <h2 className="section_title">
        <span>Shop by Department </span>
        <span><Link to="/mainCategory" >+ View all Categories</Link></span>
        </h2>
          <div className="row">
        
            {renderCategories()}
        </div>
    </div>
    </div>
</section>

    )
}

export default Topcategory     