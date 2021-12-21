import React from "react";
import { Navbar } from 'react-bootstrap';
import logo from '../../assets/logo.png';
import { Link } from "gatsby"
// import Menu from "./sidebar";

// const Header = ({ siteTitle, cartCount, allCategory }) => {
  class Header extends React.Component {
  // const [set,setQuoteId] = useState({});

// useEffect(() => {
// setQuoteId(Menu)
// }, [])



render() {
 return (
  <header>
<Navbar>


        {/* <Menu/> */}
<Navbar.Brand className="logo">
              <Link to="/">
                <img src={logo}></img>
              </Link>
            </Navbar.Brand>
            <form className="w-100 d-flex mr-1 t_search">
              <input
                className="search"
                type="text"
                placeholder="Search for members , works.."
              />
              <input
                type="submit"
                value=""
                className="search_submit px-6 py-3 cursor-pointer"
              />

        {/* {  activeClass == true ?
             <img src={closeSearch}
                className="px-6 py-3 cursor-pointer search_clear"
                onClick={clearSearchValue}
              /> :<></>
            } */}
            </form>
</Navbar>
  </header>
 )
          }
         
}
















export default Header