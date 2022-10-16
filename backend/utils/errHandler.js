const createError = require("http-errors");

exports.errHandler = (controller) => async (req, res, next) => {
    try {
        await controller(req, res);
    } catch (e) {
        return next(createError(e.status, e.statusText));
    }
}