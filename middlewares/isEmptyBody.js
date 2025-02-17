import { HttpError } from "../helpers/index.js";

const message = "missing fields"

const isEmptyBody = (req, res, next)=> {
    const {length} = Object.keys(req.body);
    if(!length) {
        next(HttpError(400, message))
    }
    next()
}

export default isEmptyBody;

