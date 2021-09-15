import React,{useState,useEffect} from "react"
import axios from "axios";
import Slider from "react-slick";
import { Link } from "gatsby";
import PageLoader from "./loaders/pageLoader"
import { checkLogin } from "./../services/headerServices";
import banner_01 from './../assets/banner_001.jpg';
import banner_sml_01 from './../assets/banner_sml_01.jpg';
import banner_sml_02 from './../assets/banner_sml_02.jpg';

const banner_slide = {
    dots: true,
    infinite: true,
    speed: 1000,
    fadeIn: false,
    autoplay: true,
    pauseOnHover: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};  

const Mainslider = () =>{
    const [splash, setSplash] = useState(null);
    const [loader, setLoader] = useState(false);
    const [ topRight, setTopRight ] = useState([{}]);
          

    useEffect(() => {
        setLoader(true);
        const splash = async () => {
          await axios({
           method : "get",
           url: `${process.env.GATSBY_CART_URL}admin/bannersliders/`
           }).then((res) => {
           const item = res.data
           setSplash(item);
            setLoader(false);
       
       }) 
        }
        splash();
           axios({
           method : "get",
           url: `${process.env.GATSBY_CART_URL}admin/sidebanner/`
           }).then((res) => {
            setTopRight(res.data);
            setLoader(false);       
       }) 
        
    }, []);


const Renderproduct = () => {    
    if (splash) { 
        return <>
    <div className="container">
    
         {/* <Slider {...banner_slide}> */}
             {splash.map((data) => ( 
            
              <div className="row">
          <div className="col-lg-12 col-left banner_top">
          <Link to={data.button_link} > <img src={banner_01} alt={"banner"} className="img-fluid"/> </Link> 
              
        </div>
        </div>
             ))}
        {/* </Slider> */}
    
        <div className="col-lg-12 banner_top_left">
             {topRight.map((data) => {
      return <>
      <div className="row">
        {/* <div className="col-lg-6 banner_top_left"> */}
          {/* {checkLogin() ? */}
            <Link to={data.button_link} >
            <img src={data.banner_image} alt={"banner"} className="img-fluid" />
            </Link> 
            {/* :  */}
            {/* <Link to={data.button_link}>
            <img src={data.banner_image} alt={"banner"} className="img-fluid"/>
            </Link> */}
          {/* } */}
        {/* { <Link to={data.button_link} >
          <img src={data.banner_image} alt={"banner"} onClick={() => custBaseDis(data.button_link)}/>
          </Link>  }
          { <Link to={data.button_link} onClick={() => custBaseDiscount()}> </Link> } */}
          {/* </div>  */}
          </div>    
           </>
             })}
       </div>
        {/* </div> */}
        {/* banner small */}
        {/* <div className="row">
    <div className="col-lg-6 banner_top_left"><img src={banner_sml_01} alt={"banner"}  className="img-fluid"/></div>
    <div className="col-lg-6 col-right"><img src={banner_sml_02} alt={"banner"}  className="img-fluid"/></div>
    </div> */}
        </div>
        
      

</>
    }
    
}


return (
    
    <div>
      <section className="main_slider">
  {Renderproduct()}  
  {loader ? (<div>
                {/* <PageLoader /> */}
                
            </div>) : <span></span>}
  
  </section>
  </div>

  

  )
  }

export default Mainslider