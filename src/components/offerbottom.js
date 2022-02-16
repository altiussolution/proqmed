import React,{useState,useEffect} from "react"
import axios from "axios";
import { Link } from "gatsby"
import ad1 from "./../assets/ad1.jpg"
import ad2 from "./../assets/ad2.png"
import { getProductURL,getCategoryURL } from "../utils/url";
import ImageNotFound from "./../assets/not-found.png";

const Offerbottom = () => {
  const [splash, setSplash] = useState(null);
    const [loader, setLoader] = useState(ad1);          

    useEffect(() => {
        setLoader(true);
        const splash = async () => {
          await axios({
           method : "get",
           url: `${process.env.GATSBY_CART_URL_STARCARE}category/asseenonbanner`
           }).then((res) => {
             console.log(res)
           const item = res.data
           setSplash(item);
            setLoader(false);
       
       }) 
        }
        splash();
    }, []);

const Renderproduct = () => {    
    if (splash) { 

        return <>
        {splash.slice(0 ,2).map((data,index) => (
        (
      <div className="col-lg-6 col-md-12 col-xs-12" key={`${data.category_name}_${index}`}>
          {/* <Link to={data.category_url} ><img src={data.category_image} alt={"banner"} /></Link>  */}
          <div className="img-wrapper-as-seen">
          <div className="wrapper-content">
            <p>Medical Research</p>
            <h1>Health Matters</h1>
            <Link to={getCategoryURL(data.sub_category)} ><button className="btn btn update" type="button">Read More </button></Link>
            </div>
            <Link to={getCategoryURL(data.sub_category)} ><img src={data.category_image} onError={e => (e.target.src = ImageNotFound)}
   /></Link> 
          </div>
          </div>
          
           )))}
</>
    }
}

return(
  <section className = "add-banner upper-space" >
  <div className = "container" >
    <div className="row">
    <div className="col-lg-12 col" >
  <h2 className="section_title">
                    <span>As Seen On</span>
                    {/* <span><Link to="/featuredProducts">+ View all Products</Link></span> */}
                    </h2>
                    </div>
                    </div>
  <div className="row">
{/*   
  <div className="col-lg-6 col-md-6 col-xs-12"><img src={ad1} alt={"banner"} /></div>
  <div className="col-lg-6 col-md-6 col-xs-12"><img src={ad2} alt={"banner"} /></div> */}
    {Renderproduct()}
    </div>
  </div>
     </section>
)
}
export default Offerbottom