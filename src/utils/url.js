const slugify = require("./slugify");

const getCategoryURL = ({ id, name }) => `/categories/${slugify(name)}-${id}`;
 
const getProductURL = ({ id, name,}) => `/products/${slugify(name)}-${id}`;

module.exports = {
  getCategoryURL,
  getProductURL,
};
