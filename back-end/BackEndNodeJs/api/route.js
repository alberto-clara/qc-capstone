var cors = require("cors");
const controllers = require('./controller');

module.exports = function (app) {
    app.use(cors());
    app.route('/')
        .get(controllers.home);
    app.route('/user/:id')
        .get(controllers.user);
    
};