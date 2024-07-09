function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(function (err) {
            next(err);
        })
    }
}

module.exports = wrapAsync;