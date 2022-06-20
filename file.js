var fs = require('fs');
const axios = require("axios");
const slugify = require("./src/utils/slugify");
const path = require("path")

let products  ;
var config = {
    method: 'get',
    url: 'http://15.207.190.73/proqmed/rest/V1/getproducts/13',
    headers: { 
      'Cookie': 'PHPSESSID=p7gd22kl8966upputlrsvtrmca'
    }
  };
  
  axios(config)
  .then(function (response) {   
    const dirPre = './public/products/';
    response.data.forEach(child=>{
        let name = child.product_name;
        let id = child.product_id;
        let fold = `${slugify(name)}-${id}`;
        let dir = dirPre + `${slugify(name)}-${id}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            });
        }
        let pathToFile = path.join(__dirname,"/public/products/", "index.html")
        let pathToNewDestination = path.join(__dirname, dir, "index.html")
        fs.copyFile(pathToFile, pathToNewDestination, function(err) {
            if (err) {
              throw err
            } else {
              console.log("Gatsby Products Generated")
            }
          })
    });
  })
  .catch(function (error) {
    console.log(error);
  });

