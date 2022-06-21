#!/bin/bash
cd  /var/www/html/starcare-sync
sudo rm -rf /var/www/html/starcare-sync/.cache
gatsby develop
gatsby build
node file.js
sudo cp -r public/* /var/www/html/starcare-staging/public
sudo cp -r .cache/* /var/www/html/starcare-staging/.cache
#cp -r public/categories/* /var/www/html/starcare-staging/public/categories
#cp -r public/page-data/* /var/www/html/starcare-staging/public/page-data
#cp -r public/products/* /var/www/html/starcare-staging/public/products
#cp -r public/sourceproductlist/* /var/www/html/starcare-staging/public/sourceproductlist
#cp -r public/index.html /var/www/html/starcare-staging/public
