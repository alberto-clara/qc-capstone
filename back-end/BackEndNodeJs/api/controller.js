var MongoClient = require('mongodb').MongoClient;

var url = "mongodb+srv://gum:Gumgum123@cluster0-ycsux.azure.mongodb.net/test?retryWrites=true&w=majority";


const mongoUpdating = (uidValue, nameObject,emailObject,addressObject,phoneObject) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("HomeDepot");
        var query = { uid: uidValue };
        var newvalues = { $set: { name: nameObject, email: emailObject, address: addressObject, phone: phoneObject } };
        dbo.collection("UserDetail").updateOne(query, newvalues, function (err, result) {
            if (err) throw err;
            console.log("Document updated");
            db.close();
        });
    });
};
var controllers = {
    home: function (req, res) { res.send("Welcome Backend Api"); },
    user: function (req, res) {
        var info;
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("HomeDepot");
            var queryAll = {};
            dbo.collection("UserDetail").find(queryAll).toArray(function (err, result) {
                if (err) throw err;
                info = result;
                console.log(info);
                res.send(info);
                db.close();
            });
        });
      
    },
    postuser: function (req, res) {
        console.log(req.body.id);
        console.log(req.body.objName); //Empty
        mongoUpdating(req.body.id, req.body.objName, req.body.objEmailAddress, req.body.objAddress, req.body.objPhone);
       res.json({ success: true });
    },
    newuser: function (req, res) {
        console.log(req.body.id);
        console.log(req.body.email);
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("HomeDepot");
            console.log(req);
            var query = { uid: req.body.id, email: req.body.email};
            dbo.collection("UserDetail").insertOne(query, function (err, result) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
        res.json({ success: true });
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

