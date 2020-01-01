var MongoClient = require('mongodb').MongoClient;
var axios = require('axios');
var url = "mongodb+srv://gum:Gumgum123@cluster0-ycsux.azure.mongodb.net/test?retryWrites=true&w=majority";


var userInfo=[];


MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("HomeDepot");
    var queryAll = {};
    dbo.collection("UserInfo").find(queryAll).toArray(function (err, result) {
        if (err) throw err;
        userInfo = result;
        console.log(userInfo);
    
        db.close();
    });
});

var controllers = {
    home: function (req, res) { res.send("Welcome Backend Api"); },
    user: function (req, res) {
        // user/phuuuuu
        // req.params.id =.... phuuuuuuuu
        console.log(userInfo);

        res.send(userInfo);
    },
    postuser: function (req, res) {
        console.log("HEEEEEEEEEEEEEEEEEY");
        console.log(req.body.objName); //Empty
        res.send(req.method);
    }
/*
  router.post('/updateData', (req, res) => {
      const { id, update } = req.body;
      Data.findByIdAndUpdate(id, update, (err) => {
          if (err) return res.json({ success: false, error: err });
          return res.json({ success: true });
      });
  });
  */
 /*   leastRetail: function (req, res) {
        var productInfo = [];
        for (var i = 0; i < LeastRetail.length; i++) {
            if (LeastRetail[i].id === "") { break; }
            productInfo.push({
                id: LeastRetail[i].id,
                product_name: LeastRetail[i].product_name,
                description: LeastRetail[i].long_description,
                retail: LeastRetail[i].unit_retail
            });
        }

        res.send(productInfo);
    },

    vendorPage: function (req, res) {

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("HomeDepot");
            var query = { "product_key": req.params.id };
            dbo.collection("Vendors").find(query).toArray(function (err, result) {
                Vendors = result;
                for (var i = 0; i < Vendors.length; i++) {
                    if (Vendors[i].Supplier_name === null) { Vendors[i] = Vendors[i - 1]; }
                    Vendors[i].Supplier_name = replacing(Vendors[i].Supplier_name);
                }

                //  console.log(result);
            });
        });
        res.send(Vendors);
    }*/
}



module.exports = controllers;

