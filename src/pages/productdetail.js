import React from "react"
import Technicalspec from "../components/technicalspec"
import Feedbacks from "../components/feedbacks"
import Layout from "../components/layout"
import Productdescription from  "../templates/productdescription"

const Productdetail = () => (
  <Layout>
    <section>
    <div className="categorylistpage">
      <div className="container_">
        <div className="product_view">
          <div className="row upper-space">
            <div className="col-lg-6 col-md-6 col-xs-12">
            </div>
            <div className="col-lg-6 col-md-6 col-xs-12 pr-5 product_details">
              <Productdescription />
            </div>  
          </div>
        </div>
        <div className="technical_sec">
          <Technicalspec />
        </div>
        <div className="technical_sec">
          <Feedbacks />
        </div>
      </div>
    </div>
    </section>
    </Layout>
)

export default Productdetail