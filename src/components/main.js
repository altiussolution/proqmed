import React,{useState,useEffect} from "react"
import axios from "axios";
import { navigate } from "gatsby"
import Slider from "react-slick";

const banner_slide = {
    dots: false,
    infinite: false,
    speed: 1000,
    fadeIn: false,
    autoplay: false,
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
          autoplay: false
        },
      },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false
      },
    },
  ],
};  

const readMoreFirst = (type) => {
      navigate(type)
       
    }


const Mainsli = () =>{
    const [splash, setSplash] = useState(null);
    const [loader, setLoader] = useState(false);
    const [ ddd, setDdd ] = useState([{}]);
          

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
           setDdd(res.data);
            setLoader(false);       
       }) 
        
    }, []);


const Renderproduct = () => {    
    if (splash) { 
        return <>
         <section className="main_slider">
    <div className="container">
    <div className="row">
    <div className="col-lg-8 col-left">
        
         <Slider {...banner_slide}>
             {splash.map((data) => (
            <div>
          <div className="item">
            
              <img src={data.banner_image} alt={"banner"} onClick={() => { readMoreFirst(data.button_link)}}/>
              <div className="item">
            
        </div>
        
        </div>

          </div>
             ))}
        </Slider>
        </div>
        
        <div className="col-lg-4 col-right">

           
             {ddd.map((data) => {
      return <>
        <div className="banner_top_right"><img src={data.banner_image} alt={"banner"} onClick={() => { readMoreFirst(data.button_link)}} /></div>     
           </>
             })}
       </div>
       
        </div>
        
        </div>
        
      </section>

</>
    }
    
}


return (
    
    <div>
  {Renderproduct()}  
  
  </div>

  )
  }

export default Mainsli