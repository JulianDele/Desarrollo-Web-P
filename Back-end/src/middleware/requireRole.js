const responses = require('../utils/responses');


module.exports = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !rolesPermitidos.includes(req.user.role)) {
            return responses.forbidden(res);
        }
        next();
    };
};