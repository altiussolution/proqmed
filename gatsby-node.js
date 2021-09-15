const axios = require("axios");
const path = require("path");
const { getCategoryURL, getProductURL } = require("./src/utils/url");

let categories,     
  subCategories = [];

  exports.sourceNodes = ({ actions: { createNode }, createContentDigest,stage, loaders }) => {
    if (stage === "build-html") {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /bad-module/,
              use: loaders.null(),
            },
          ],
        },
      })
    }
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios(
          "https://safety.altiussolution.com/rest/V1/altius/categories?rootCategoryId=48"
      );  
      categories = data;
      // console.log("data", data)   
      categories.children_data.forEach(child_data => {
        if(child_data.is_active){
          const categoryNode = {
            id: String(child_data.id),
            parent: null,
            children: [],
            grand_child: child_data.children_data,
            name: child_data.name,
            image: child_data.image,
            internal: {
              type: "Category",
              contentDigest: createContentDigest(child_data)
            },
          };
          subCategories.push(child_data);
          if (child_data.product_count > 5) createNode(categoryNode);
          resolve();
          
        }
      
      });

    } catch (error) {
      console.error(error);
      reject("Something went wrong", error);
    }  
  });
};  

exports.createPages = ({ actions: { createPage } }) => {
  subCategories.forEach(child => createSubCategory(child, createPage, []));
};

const createSubCategory = (data, createPage, hierarchy) => {
  if (data.product_count <= 5 && data.children_data.length && data.level === 2)
    return;
  createPage({
    path: getCategoryURL(data),
    component: path.resolve("src/templates/Category.js"),
    context: { ...data, hierarchy },
  });
  if (data.children_data.length) {
    data.children_data.forEach(child =>
      createSubCategory(
        child,
        createPage,
        hierarchy.concat({
          id: data.id,
          name: data.name,
        })
      )
    );  
  } else {
    createPage({
      path: getCategoryURL(data),
      component: path.resolve("src/templates/Products.js"),
      context: { ...data, hierarchy },
    });
  }
  return;
};