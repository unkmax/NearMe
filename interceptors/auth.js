const Error = require('../util/error');

let authorize = (req, res, roles, callback) => {
    if (typeof req.headers["auth"] != "undefined") 
        callback(false, undefined);
    else
        callback(true, undefined);
};

module.exports = (roles = []) => {
    return (req, res, next) => {
        authorize(req, res, roles, (err, exception) => {
            if (!err || roles.length === 0) next();
            else next(new Error(Error.Code.UNAUTHORIZED, exception, 401));
        });
    }
};