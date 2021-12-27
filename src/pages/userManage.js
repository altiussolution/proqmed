import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import Switch from "react-switch";
import PageLoader from "../components/loaders/pageLoader";
import Modal from 'react-bootstrap/Modal'
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import Dropdown from 'react-bootstrap/Dropdown'
import Multiselect from 'multiselect-react-dropdown';
import Select from 'react-select';
const UserManage = () => {
 const [field, setField] = useState([]);
 const [quoteedit, setQuotePopupedit] = useState(false);
 const [quoteadd, setQuotePopupadd] = useState(false);
 const { register, handleSubmit, errors } = useForm();
 const [quoteForm, setQuoteForm ] = useState();
 const [showQuote, setShowQuote] = useState(true);
 const [showQuoteadd, setShowQuoteadd] = useState(true);
 const [statys, statusIn] = useState(false);
 const [subusers, setSubusers] = useState([]);
 const [customerId, setCustomerId] = useState("");
 const [loader, setLoader] = useState(false);
 const [subcat,SubCate] = useState([]);
 const handleCloseQuote = () => setShowQuote(false);
 const handleShowQuote = () => setShowQuote(true);
 const handleShowQuoteforadd = () => setShowQuoteadd(true);
 const handleCloseQuoteforadd = () => setShowQuoteadd(false);
 const [quoteConversations, setQuotesConversations] = useState([])
 const [perms, savedperms] = useState([])
 useEffect(() => {
     setCustomerId(localStorage.customer_id)
    getQuotes();
 }, []);

 const getQuotes = async () => {
    setLoader(true)
    const res = await fetch(
        `${process.env.GATSBY_CART_URL_STARCARE}subuser/subuserlist/parent_customer_id/39`
    );
    const json = await res.json();
    await setSubusers(json);
    console.log(json) 
    setLoader(false)
};

 const editQuote = (quote) => {
    // setIndex(index);
    setQuotePopupedit(true)
    handleShowQuote(true)
    getConversation(quote['subuser_id'])
    setQuoteForm(quote)
}
const addQuote = () => {
    // setIndex(index);
    setQuotePopupadd(true)
    handleShowQuoteforadd(true)
    getConversation()
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
const cat = [];
cat.push(quoteDetails['catpermission'])
    let quoteData = [
        {
            "subuser_id": quoteForm['subuser_id'],
            "role_name": quoteForm['role_name'],
            "firstname": quoteDetails['firstname'],
            "lastname": quoteDetails['lastname'],
            "email": quoteDetails['email'],
            "password": quoteForm['password'],
            "allowedpermissions": quoteForm['allowed_permissions'],
            "categorypermissions": cat,
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
const handleChange = nextChecked => {
    statusIn(nextChecked);
    
  };
  const handleChange1 = nextChecked => {
      console.log(nextChecked)
     statusIn(nextChecked);
    
  };
const onSubmitQuoteadd = quoteDetails => {
    let quoteData = [
        
        {
            "role_name": quoteDetails['rolename'],
            "firstname": quoteDetails['firstname'],
            "lastname": quoteDetails['lastname'],
            "email": quoteDetails['email'],
            "parent_customer_id": customerId,
            "password": quoteDetails['password'],
            "allowedpermissions": quoteDetails['permission'],
            "categorypermissions": quoteDetails['catpermission'],
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
            <section className="inner_banner_section">
            </section>
            {loader ?
                (<div className="mx-auto">
                    <PageLoader />
                </div>) :
                <section className="page_content inner_page">
                    <div className="container boxed-content">
                        <div className="sec_block">
                            <div className="row page_title_sec">
                                <h3 className="text-capitalize">User Management</h3>
                                <button className="action action_btn btn btn_gray" onClick={() => addQuote()}>Add
                              </button>
                            </div>
                            <div className="row compare_section cart_page">
                                <table className="table compareList_table">
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
                                                        <span>{quote.subuser_status == false ? "DisApproved" : "Approved"}</span>
                                                    </td>
                                                    <td className="action_sec">
                                                        <span>
                                                            <button className="action action_btn btn btn_gray" onClick={() => editQuote(quote)}>Edit
                              </button>
                                                            <button type="button" className="action action_btn btn btn_gray ml-1" onClick={() => removeQuote(quote.subuser_id)}> Delete
                              </button>
                                                        </span>
                                                    </td>

                                                </tr>
                                            </tbody>
                                        ))
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            }
            {quoteedit ? <Modal show={showQuote} onHide={handleCloseQuote} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Update SubUser Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitQuote)} action="" className="header_signin_form">
                                <div className="form-group">
                                    <label htmlFor="firstname">First Name</label>
                                    <input className="form-control" name="firstname"  type="text" ref={register({
                                        required: true
                                    })} defaultValue={(quoteForm['subuser_firstname'])}/>
                                    {errors.firstname && errors.firstname.type === 'required' && <span className="error">First Name is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastname">Last Name</label>
                                    <input className="form-control" type="text" name="lastname"  ref={register({
                                        required: true
                                    })} defaultValue={(quoteForm['subuser_lastname'])}/>
                                    {errors.lastname && errors.lastname.type === 'required' && <span className="error">Last Name is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email </label>
                                    <input className="form-control" name="email" ref={register({
                                        required: true 
                                    })} defaultValue={(quoteForm['subuser_email'])}>
                                    </input>
                                    {errors.email && errors.email.type === 'required' && <span className="error">Email is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="rolename">Role Name </label>
                                    <input className="form-control" name="rolename" ref={register({
                                        required: true 
                                    })} defaultValue={(quoteForm['role_name'])}>
                                    </input>
                                    {errors.rolename && errors.rolename.type === 'required' && <span className="error">Role Name is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input className="form-control" name="rolename" ref={register({
                                        required: true 
                                    })} defaultValue={(quoteForm['password'])}>
                                    </input>
                                    {errors.password && errors.password.type === 'required' && <span className="error">Password is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="permission">Permissions</label>
                                    {/* <input className="form-control" name="rolename" ref={register({
                                        required: true 
                                    })} defaultValue={(quoteForm['allowed_permissions'])}>
                                    </input> */}
                                    <Multiselect
                                    options={(quoteForm['allowed_permissions'])}
                                    selectedValues={(quoteForm['allowed_permissions'])}
                                    displayValue="allowed_permissions"
                                     />
                                    {errors.permission && errors.permission.type === 'required' && <span className="error">Permissions are required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="catpermission">Category Permissions</label>
                                    <input className="form-control" name="catpermission" ref={register({
                                        required: true 
                                    })} defaultValue={(quoteForm['category_permissions'])}>
                                    </input>
                                    {errors.catpermission && errors.catpermission.type === 'required' && <span className="error">Category Permissions are required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                     <Switch
          onChange={handleChange1}
          checked={quoteForm['subuser_status']} name="status"
          className="react-switch"
        />
                                    {errors.status && errors.status.type === 'required' && <span className="error">Status is required</span>}
                                </div>
                                <button type="submit" className="btn_link theme_btn_blue w-100">Update</button>
                            </form>

                  
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal> : <div></div>
            }
             {quoteadd ? <Modal show={showQuoteadd} onHide={handleCloseQuoteforadd} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Add SubUser Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                            <form onSubmit={handleSubmit(onSubmitQuoteadd)} action="" className="header_signin_form">
                                <div className="form-group">
                                    <label htmlFor="firstname">First Name</label>
                                    <input className="form-control" name="firstname"  type="text" ref={register({
                                        required: true
                                    })} />
                                    {errors.firstname && errors.firstname.type === 'required' && <span className="error">First Name is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastname">Last Name</label>
                                    <input className="form-control" type="text" name="lastname"  ref={register({
                                        required: true
                                    })} />
                                    {errors.lastname && errors.lastname.type === 'required' && <span className="error">Last Name is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input className="form-control" type="text" name="email"  ref={register({
                                        required: true
                                    })} />
                                    {errors.email && errors.email.type === 'required' && <span className="error">Email is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="rolename">Role Name </label>
                                    <input className="form-control" type="text" name="rolename"  ref={register({
                                        required: true
                                    })} />
                                    {errors.rolename && errors.rolename.type === 'required' && <span className="error">Role Name is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input className="form-control" type="text" name="password"  ref={register({
                                        required: true
                                    })} />
                                    {errors.password && errors.password.type === 'required' && <span className="error">Last Name is required</span>}
                                </div>
                                <div className="form-group">
                                    {/* <label htmlFor="permission">Permissions</label> */}
                                    {/* <select className="form-control" name="permission"  ref={register({
                                        required: true 
                                    })}>
                                        {quoteConversations.map((conv, index) => (
                                          <option value={conv}>{conv}</option>
                                       ))}
                                       </select> */}
                                       <Dropdown>
                  <Dropdown.Toggle variant='Secondary' id="dropdown-basic" >
                  Permission
                  </Dropdown.Toggle>
                  <Dropdown.Menu multiple>
                  {quoteConversations.map((item,index)=>{
                      return <Dropdown.Item key={index} >{item}</Dropdown.Item>
                    }) 
                    } 
                  </Dropdown.Menu>
                  </Dropdown> 
                                       {/* <Select
                                       isMulti
                                    options={perms}
                                    value={perms}
                                     />  */}
                                    {errors.permission && errors.permission.type === 'required' && <span className="error">Permission is required</span>}
                                    
                                </div>
                                <div className="form-group">
                                    <label htmlFor="catpermission">Category Permissions</label>
                                    <textarea className="form-control" name="catpermission" placeholder="Select category" ref={register({
                                        required: true
                                    })}>
                                    </textarea>
                                    {errors.catpermission && errors.catpermission.type === 'required' && <span className="error">Category is required</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                     <Switch
          onChange={handleChange}
          checked={statys} name="status"
          className="react-switch"
        />
                                    {errors.status && errors.status.type === 'required' && <span className="error">Status is required</span>}
                                </div>
                                <button type="submit" className="btn_link theme_btn_blue w-100">Add</button>
                            </form>
                        
                        {/* <Tab eventKey="conv" title="Conversations">
                            {quoteConversations.length > 0 &&
                                <div>
                                    <div className="row page_title_sec">
                                        <h3>Conversations</h3>
                                    </div>
                                    {
                                        quoteConversations.map((conv, index) => (
                                            <div key={index}>
                                                <p>{conv['created_at']} - {conv['sender']}</p>
                                                <p>{conv['conversation']}</p>
                                            </div>
                                        ))
                                    }

                                </div>
                            }
                        </Tab> */}
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal> : <div></div>
            }
        </Layout >
)
}

export default UserManage;