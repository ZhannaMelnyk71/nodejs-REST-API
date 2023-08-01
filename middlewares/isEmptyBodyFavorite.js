import { HttpError } from "../helpers/index.js";

const message = "missing field favorite"

const isEmptyBodyFavorite = (req, res, next)=> {
    const {length} = Object.keys(req.body);
    if(!length) {
        next(HttpError(400, message))
    }
    next()
}

export default isEmptyBodyFavorite;