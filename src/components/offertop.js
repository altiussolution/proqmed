// import React,{useState,useEffect} from "react"
// import axios from "axios";
// import { Link } from "gatsby"
// import { navigate } from "gatsby"

// import ad1 from './../assets/ad_botm_01.jpg';
// import ad2 from './../assets/ad_botm_02.jpg';
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// const banner_slide = {
//     autoplay: true,
//     speed: 1000,
//     slidesToShow: 5,
//     slidesToScroll: 1
//   }   

//   const readMoreFirst = (type) => {
//     console.log("type")
//      console.log(type)
//       navigate(type)
       
//     }

// const Offertop = () => {
//   const [splash, setSplash] = useState(null);
//     const [loader, setLoader] = useState(false);
          

//     useEffect(() => {
//         setLoader(true);
//         const splash = async () => {
//           await axios({
//            method : "get",
//            url: `${process.env.GATSBY_CART_URL}admin/sidebanner/`
//            }).then((res) => {
//            const item = res.data
//            setSplash(item);
//             setLoader(false);
       
//        }) 
//         }
//         splash();
//     }, []);
// console.log("splash : ",splash);



// const Renderproduct = () => {    
//     if (splash) { 

//       console.log(splash)
//         return <>
//         {splash.map((data) => (
//           <div className="col-lg-4 col-right">
//           <div className="banner_top_right"><img src={data.banner_image} alt={"banner"} onClick={() => { readMoreFirst(data.button_link)}} /></div>
//          {/* <Link to="/discountProducts"><div><img src={bannerBotmRight} alt={"banner"} /></div></Link> */}
//         </div>))}
// </>
//     }
// }

// return(
//  <div>
//     {Renderproduct()}
//     </div>
// )
// }
// export default Offertop