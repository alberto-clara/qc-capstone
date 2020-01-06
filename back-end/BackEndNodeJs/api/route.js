var cors = require("cors");
const controllers = require('./controller');

module.exports = function (app) {
    app.use(cors());
    app.route('/')
        .get(controllers.home);
    app.route('/user')
        .get(controllers.user);
    app.route('/post-user')
        .post(controllers.postuser);
    app.route('/insert-user')
        .post(controllers.newuser);
};