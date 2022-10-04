

exports.verifyHospital = (...roles) => {
    return (req, res, next) => {
        console.log(req.payload);
        if (!roles.includes(req.payload.role)) {
            return next(res.status(400).send(`Role ${req.payload.role} in not allow to access this resource`));
        }
        next()
    }
}



exports.verifyUser = (...roles) => {
    return (req, res, next) => {
        console.log(req.payload);
        if (!roles.includes(req.payload.role)) {
            return next(res.status(400).send(`Role ${req.payload.role} in not allow to access this resource`));
        }
        next()
    }
}