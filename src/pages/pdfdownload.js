import React, {  useState }from "react";
import Layout from "../components/layout";
import axios from "axios";

const PdfDownLoad = () => {
const [attach_data, setattachment] = useState(null);
    const handleClick = () =>{
        const res = axios.get(
        `${process.env.GATSBY_CART_URL}admin/pdfinvoice/95`).then((data)=>{
          let response_data = data.data
          setattachment(response_data)
      })   
    }

    return (
        <Layout>
            <main className="profile_page">
                <div className="App">
                    <div className="content_wrapper">
                        <div className="container">
                            <div className="main_title">
                                <h1 >My <span>Pdf Download</span></h1>
                            </div>
                            <button onClick={handleClick}>
                                Pdf Download
                            </button>
                            <div> 
                            {  attach_data?  
                                <a href={attach_data[0].invoice_pdf} download>{attach_data[0].invoice_pdf}</a>:<span></span>
                            }
                                </div>
                            <div className="row">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </Layout>
    )
}

export default PdfDownLoad