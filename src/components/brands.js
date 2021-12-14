import React, { useState, useEffect } from "react"
import axios from "axios";
import { Link } from "gatsby";
import 'react-toastify/dist/ReactToastify.css';
import brand1 from './../assets/brand_01.jpg';
import brand2 from './../assets/brand_02.jpg';
import brand3 from './../assets/brand_03.jpg';
import brand4 from './../assets/brand_04.jpg';
import brand5 from './../assets/brand_05.jpg';
import brand6 from './../assets/brand_06.jpg';

const Brands = props => { 
    const [productBrand, setProductBrand] = useState(null);
    useEffect(() => {
        const productBrand = async () => {
            await axios({
                method: "get",
                url: `${process.env.GATSBY_CART_URL_STARCARE}admin/brandlist/`
            }).then((res) => {
                const item = res.data
                setProductBrand(item);
console.log(item)
            })
        }
        productBrand();
    }, [props.id]);



    const Renderproduct = () => {
        if (productBrand) {
            return <>
                {    productBrand ?
                    (productBrand.slice(0, 18).map((data, index) => (

                        <div className="brand_item">
                            <div className="products" key={index}>
                                <Link to="/brandedProducts/" state={{ brand_id: data.brand_id }} ><img className="product_img" src={data.image} /></Link>
                            </div>
                        </div>

                    ))) : <div></div>

                }
            </>
        }
    }

    return (
        <div className="App">
            <div className="content_wrapper">
                <div className="container">
                <h2 className="section_title"><span>Popular Brands</span><span><Link to="/filterBrands">+ View all Brands</Link></span></h2>
                    <div className="row brandsec">
                   
                       
                        <div className="col-12">
                    <ul className="brands_home">
                        {/* <li><img src={brand1}></img></li>
                        <li><img src={brand2}></img></li>
                        <li><img src={brand3}></img></li>
                        <li><img src={brand4}></img></li>
                        <li><img src={brand5}></img></li>
                        <li><img src={brand6}></img></li> */}
                     {Renderproduct()}
                    </ul>   
                    </div> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Brands;



// import React, { useState, useEffect } from "react"
// import axios from "axios";
// import { Link } from "gatsby";
// import 'react-toastify/dist/ReactToastify.css';

// const Brands = props => { 
//     const [productBrand, setProductBrand] = useState(null);
//     useEffect(() => {
//         const productBrand = async () => {
//             await axios({
//                 method: "get",
//                 url: `${process.env.GATSBY_CART_URL_STARCARE}admin/brandlist/`
//             }).then((res) => {
//                 const item = res.data
//                 setProductBrand(item);

//             })
//         }
//         productBrand();
//     }, [props.id]);



//     const Renderproduct = () => {
//         if (productBrand) {
//             return <>
//                 {    productBrand ?
//                     (productBrand.slice(0, 18).map((data, index) => (

//                         <div className="brand_item">
//                             <div className="products" key={index}>
//                                 <Link to="/brandedProducts/" state={{ brand_id: data.brand_id }} ><img className="product_img" src={data.image} /></Link>
//                             </div>
//                         </div>

//                     ))) : <div></div>

//                 }
//             </>
//         }
//     }

//     return (
//         <div className="App">
//             <div className="content_wrapper">
//                 <div className="container">
                    
//                     <div className="row brandsec">
//                     <h2 className="section_title"><span>Our Brands</span><span><Link to="/filterBrands">+ View all Brands</Link></span></h2>
//                         {Renderproduct()}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Brands;