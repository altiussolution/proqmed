import React,{useState,useEffect} from "react"
import axios from "axios";
import Slider from "react-slick";
import { Link } from "gatsby";
import PageLoader from "./loaders/pageLoader"
import { checkLogin } from "./../services/headerServices";
import banner_01 from './../assets/banner1.jpg';
import banner_sml_01 from './../assets/banner_sml_01.jpg';
import banner_sml_02 from './../assets/banner_sml_02.jpg';
import delivery from './../assets/delivery.png';
import safety from './../assets/safety.png';
import secure from './../assets/secure.png';

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
           url: `${process.env.GATSBY_CART_URL_STARCARE}admin/bannersliders/`
           }).then((res) => {
           const item = res.data
           setSplash(item);
            setLoader(false);
       
       }) 
        }
        splash();
           axios({
           method : "get",
           url: `${process.env.GATSBY_CART_URL_STARCARE}admin/sidebanner/`
           }).then((res) => {
            setTopRight(res.data);
            setLoader(false);       
       }) 
        
    }, []);


const Renderproduct = () => {    
    if (splash) { 
        return <>
    <div className="banner_top">
    <img src={banner_01} /> 
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
                {/* <PageLoader /> */}
            </div>) : <span></span>}
  
  </section>
  </div>

  

  )
  }

export default Mainslider