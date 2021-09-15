import React,{useState,useEffect} from "react"
import axios from "axios";
import { Link } from "gatsby"

const Offerbottom = () => {
  const [splash, setSplash] = useState(null);
    const [loader, setLoader] = useState(false);          

    useEffect(() => {
        setLoader(true);
        const splash = async () => {
          await axios({
           method : "get",
           url: `${process.env.GATSBY_CART_URL}admin/footerbanner/`
           }).then((res) => {
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
        {splash.map((data) => (
        (
      <div className="col-lg-6 col-md-6 col-xs-12">
          <Link to={data.button_link} ><img src={data.banner_image} alt={"banner"} /></Link> 
          </div>
           )))}
</>
    }
}

return(
  <section className = "add-banner upper-space" >
  <div className = "container" >
  <div className="row">
    {Renderproduct()}
    </div>
  </div>
     </section>
)
}
export default Offerbottom