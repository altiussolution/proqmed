import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import { navigate, useStaticQuery, Link } from "gatsby";
import axios from "axios";
import { TablePagination } from '@mui/material';
import Switch from "react-switch";
import PageLoader from "../components/loaders/pageLoader";
import Modal from 'react-bootstrap/Modal'
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import Dropdown from 'react-bootstrap/Dropdown'
import Multiselect from 'multiselect-react-dropdown';
import Select from 'react-select';
const UserManage = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
 const [field, setField] = useState([]);
 const [quoteedit, setQuotePopupedit] = useState(false);
 const [quoteadd, setQuotePopupadd] = useState(false);
 const { register, handleSubmit, errors } = useForm();
 const [quoteForm, setQuoteForm ] = useState();
 const [showQuote, setShowQuote] = useState(true);
 const [showQuoteadd, setShowQuoteadd] = useState(true);
 const [statys, statusIn] = useState(false);
 const [subusers, setSubusers] = useState([]);
 const [nousers, nosubs] = useState("");
 const [customerId, setCustomerId] = useState("");
 const [loader, setLoader] = useState(false);
 const [subcat,SubCate] = useState([]);
 const handleCloseQuote = () => setShowQuote(false);
 const handleShowQuote = () => setShowQuote(true);
 const handleShowQuoteforadd = () => setShowQuoteadd(true);
 const handleCloseQuoteforadd = () => setShowQuoteadd(false);
 const [quoteConversations, setQuotesConversations] = useState([])
 const [perms, savedperms] = useState([])
 const [clip,categoryda] = useState([]);
 const [names, setNames] = useState([]);
 const [catie, setCats] = useState([]);
 const [username, setUsername] = useState();
 const data = useStaticQuery(graphql`
 {
   allCategory {
     edges {
       node {
         id
         name
         grand_child {
           id
           is_active
           name
         }
       }
     }
   }
   site {
     siteMetadata {
       title
     }
   }
 }
`)
 useEffect(() => {
     setCustomerId(localStorage.customer_id)
     setUsername(localStorage.user_name)
     rendercategory();
    getQuotes();
    
    console.log(data)
 }, []);

 const getQuotes = async () => {
    setLoader(true)
    const res = await fetch(
        `${process.env.GATSBY_CART_URL_STARCARE}subuser/subuserlist/parent_customer_id/39`
    );
    const json = await res.json();
    if(json=="Subusers not available for this customer"){
        setLoader(false)
        await nosubs(json);
    }else {
        await setSubusers(json);
        setLoader(false)
    }
};
const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
const rendercategory = () =>{
    const list = [];
    const lis = [];
    const lott = [];
    let allCategory = data.allCategory.edges;
      list.push(allCategory);
    list.map((el,index)=>(
         lis.push(el)
))
for(let i=0 ;i < lis[0].length;i++){
    lott.push(lis[0][i].node)
}
categoryda(lott)
}

 const editQuote = (quote) => {
    // setIndex(index);
    
    
    setQuotePopupedit(true)
    handleShowQuote(true)
    getConversation(quote['subuser_id'])
    setQuoteForm(quote)
    console.log(quote)
}

const addQuote = () => {
    navigate('/manageUser')
    // console.log(clip)
    // setQuotePopupadd(true)
    // handleShowQuoteforadd(true)
    // getConversation()
}

const getConversation = (id) => {
    try {
        axios({
            method: "get",
            url: `${process.env.GATSBY_CART_URL_STARCARE}subuser/subuserpermissions`,
        }).then((res) => {
            if (res.statusText === "OK" && res.status == 200) {
                console.error(res)
                setQuotesConversations(res.data)
                funn(res.data);
                // {
                //     quoteConversations.map((conv, index) => (
                //         savedperms(conv)
                        
                //     ))}
                // console.log(perms)    
            }

        }).catch((err) => {
            console.error(err)
        })
    } catch (err) {
        console.error(err)
    }
}
const funn = (data) => {
    console.log(data)
savedperms(data)
}
const removeQuote = (id) => {
    if (window.confirm("Delete the subuser?")) {
        try {
            axios({
                method: "delete",
                url: `${process.env.GATSBY_CART_URL_STARCARE}subuser/subuserdelete/${id}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.userToken}`
                }
            }).then((res) => {
                if (res.statusText === "OK" && res.status == 200) {
                    toast.success("SubUser Deleted Successfully");
                    getQuotes();
                }
            }).catch((err) => {
                console.error(err)
            })
        } catch (err) {
            console.error(err)
        }
    }

}

const onSubmitQuote = quoteDetails => {
    
    let quoteData = [
        {
            "subuser_id": quoteForm['subuser_id'],
            "role_name": quoteForm['role_name'],
            "firstname": quoteDetails['firstname'],
            "lastname": quoteDetails['lastname'],
            "email": quoteDetails['email'],
            "password": quoteDetails['password'],
            "allowedpermissions": names,
            "categorypermissions": catie,
            "status" : statys

        }
    ]

    try {
        axios({
            method: 'put',
            url: `${process.env.GATSBY_CART_URL_STARCARE}subuser/subuserupdate`,
            data: quoteData,
        })
            .then(function (response) {
                toast.success('SubUser Updated sucessfully')
                handleCloseQuote();
                getQuotes();
            })
            .catch(function (response) {
                toast.error('An error occured please contact admin')
            });

    } catch (err) {
        console.error(`An error occured ${err}`)
    }
};
const searchUser = async (val) => {
if(val.target.value.length>=2){
    let data = {
        
            "data":{
                "search_keyword":val.target.value,
                "parent_customer_id":"39"
            }
        
    }
    try {
        axios({
            method: 'post',
            url: `${process.env.GATSBY_CART_URL_STARCARE}subuser/subusersearch`,
            data: data,
        })
            .then(function (response) {
                setSubusers(response.data)
            })
            .catch(function (response) {
                
            });

    } catch (err) {
        console.error(`An error occured ${err}`)
    }
}else if(val.target.value.length==0 || val.target.value.length==1){
    const res = await fetch(
        `${process.env.GATSBY_CART_URL_STARCARE}subuser/subuserlist/parent_customer_id/39`
    );
    const json = await res.json();
    if(json=="Subusers not available for this customer"){
        
        await nosubs(json);
    }else {
        await setSubusers(json);
        
    }
}
}
const handleChange = nextChecked => {
    statusIn(nextChecked);
    
  };
  const handleChange1 = nextChecked => {
      console.log(nextChecked)
     statusIn(nextChecked);
    
  };
  let onSelectNames = name => {
    setNames(name);
  };

  let onRemoveNames = name => {
    setNames(name);
  };
  let onSelectCats = name => {
    setCats(name);
  };

  let onRemoveCats = name => {
    setCats(name);
  };
const onSubmitQuoteadd = quoteDetails => {
    
    let quoteData = [
    
        
        {
            "role_name": quoteDetails['rolename'],
            "firstname": quoteDetails['firstname'],
            "lastname": quoteDetails['lastname'],
            "email": quoteDetails['email'],
            "parent_customer_id": 39,
            "password": quoteDetails['password'],
            "allowedpermissions": names,
            "categorypermissions": catie,
            "status" : statys
        }
    ]

    try {
        axios({
            method: 'post',
            url: `${process.env.GATSBY_CART_URL_STARCARE}subuser/subusercreate`,
            data: quoteData,
        })
            .then(function (response) {
                toast.success('SubUser Created sucessfully')
                handleShowQuoteforadd();
                getQuotes();
            })
            .catch(function (response) {
                toast.error('An error occured please contact admin')
            });

    } catch (err) {
        console.error(`An error occured ${err}`)
    }
};


 return (
  <Layout>
            {/* <section className="inner_banner_section">
            </section>
            {loader ?
                (<div className="mx-auto">
                    <PageLoader />
                </div>) :
                <section className="page_content inner_page">
                    <div className="container boxed-content">
                        <div className="sec_block">
                            <div className=" page_title_sec fo-flx">
                                <h3 className="text-capitalize">User Management</h3>
                                <button className="action action_btn btn btn_gray" onClick={() => addQuote()}>+ Add 
                              </button>
                            </div>
                            <div className=" compare_section cart_page user">
            
                               {subusers.length!=0 ? <table className="table compareList_table">
                                    <thead>
                                        <tr>
                                            <th>S.no</th>
                                            <th>Name</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {
                                        subusers.map((quote, index) => (
                                            <tbody key={index}>

                                                <tr>

                                                    <td>
                                                        <span>{index + 1}</span>
                                                    </td>
                                                    <td>
                                                        <span>{quote.subuser_firstname}</span>
                                                    </td>
                                                    <td>
                                                        <span>{quote.role_name}</span>
                                                    </td>
                                                    <td>
                                                        <span>{quote.subuser_status == false ? "In-Active" : "Active"}</span>
                                                    </td>
                                                    <td className="action_sec">
                                                        <span>
                                                            <a onClick={() => editQuote(quote)}><i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                              </a>
                                                            <a onClick={() => removeQuote(quote.subuser_id)}> <i class="fa fa-trash-o" aria-hidden="true"></i>

                              </a>
                                                            <Link to="/manageUser" state={quote}><button className="action action_btn btn btn_gray">Edit
                              </button></Link>
                                                            <button type="button" className="action action_btn btn btn_gray ml-1" onClick={() => removeQuote(quote.subuser_id)}> Delete
                              </button>
                                                        </span>
                                                    </td>

                                                </tr>
                                            </tbody>
                                        ))
                                    }
                                </table> : "SubUsers not available"}
                            </div>
                        </div>
                    </div>
                </section>
            } */}
           <div class="container-fluid grey">
<div class="container padd">
    <div class="row">
        <div class="col-lg-4 col-md-12 col-sm-12">
            <div class="profile-sec">
                <img src="images/sample.png" alt=""/>
                <div class="name">
                    <span>Hello</span>
                    <p>{username}</p>
                </div>
            </div>

            <div class="profile-sec details">
                <h4><span><img src="images/orders.png" alt=""/></span><a href="/orders">MY ORDERS</a> </h4>
                <h4><span><img src="images/account.png" alt=""/></span><a > ACCOUNT SETTINGS</a></h4>
                <ul>
                    <li><a href="/profile">Profile Information</a></li>
                    <li><a href="/myAddress">Manage Addresses</a></li>
                   
                </ul>
                <h4><span><img src="images/users.png" alt=""/></span><a href="#"> USER MANAGEMENT</a></h4>
                <h4><span><img src="images/logout.png" alt=""/></span><a href="#">LOGOUT</a></h4>
            </div>
        </div>
       
        <div class="col-lg-8 col-md-12 col-sm-12 ">
            
            <div class="fo-bg-white">
                <div class="top">
                    <div class="header">
                    <h2 class="heading">User Management  </h2>
                </div>


                <div class="right">
                    <div class="search" >
                        <span class="fa fa-search"></span>
                        <input placeholder="Search" onChange={e => { searchUser(e) }}/>
                      </div>

                      <button type="button" class="btn btn-danger" onClick={() => addQuote()}> Create</button>
                </div>
               
               
                </div>
                {subusers.length == 0 ? 
                (<div className="col-lg-9 col-md-9 col-xs-12 no_data ">
                 <div class="grid-right">

                </div>
            <h1>No Item found</h1>
            
            </div>) :
                <div class="user-content">
                    <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        {
                        subusers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((quote, index) => (
                        <tbody key={index}>
                         <tr>
                            <td>{index + 1}</td>
                            <td>{quote.subuser_firstname}</td>
                            <td>{quote.role_name}</td>
                            <td class="green">{quote.subuser_status == false ? "In-Active" : "Active"}</td>
                            <td> <Link to="/manageUser" state={quote}><span><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span></Link> <span onClick={() => removeQuote(quote.subuser_id)}><i class="fa fa-trash-o" aria-hidden="true"></i></span> </td>
                         </tr>

                        
                        </tbody>
                         ))
                        }
                      </table>
                      <div class="bottom-paginatino">
          <TablePagination
  component="div"
  rowsPerPageOptions={[4, 8, 12, 16, 20, 24]}
  page={page}
  count={subusers.length}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
          </div>  
                </div> 
}
                

                
          </div>  
         
          
    </div>

</div>
</div>
</div>
           
        </Layout >
)
}

export default UserManage;