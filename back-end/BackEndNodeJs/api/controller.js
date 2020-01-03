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
    //    console.log(userInfo);
    
        db.close();
    });
});
const mongoUpdating = (uidValue, nameObject) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("HomeDepot");
        var query = { uid: uidValue };
        var newvalues = { $set: { name: nameObject } };
        dbo.collection("UserInfo").updateOne(query, newvalues, function (err, result) {
            if (err) throw err;
           
            console.log("Document updated");
            db.close();
        });
    });
};
var controllers = {
    home: function (req, res) { res.send("Welcome Backend Api"); },
    user: function (req, res) {
        res.send(userInfo);
    },
    postuser: function (req, res) {
        console.log(req.body.id);
        console.log(req.body.objName); //Empty
        mongoUpdating(req.body.id, req.body.objName);
      
        res.send('POST request');
      //  return res.json({ success: true });

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
 
}



module.exports = controllers;

