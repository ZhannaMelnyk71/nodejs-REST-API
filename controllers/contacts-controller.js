// import fs from "fs/promises";
// import path from "path";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";
import Contact from "../models/contact.js";

const getAll = async (req, res) => {
    const {_id: owner} = req.user;
    const {page = 1, limit = 10, ...query} = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({owner, ...query}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "email");
    res.json(result)
};
    
const getById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
};

// const avatarPath = path.resolve("public", "avatars");
// console.log(avatarPath)

// const add = async (req, res) => {
//     const {_id: owner} = req.user;
//     const {path: oldPath, filename} = req.file;
//     const newPath = path.join(avatarPath, filename);
//     await fs.rename(oldPath, newPath);
//     const avatar = path.join("avatars", filename);
//     const result = await Contact.create({...req.body, avatar, owner});
//     res.status(201).json(result);
// }

const add = async (req, res) => {
  const { _id: owner } = req.user;
  console.log(req.body)
  const result = await Contact.create({...req.body, owner});
    res.status(201).json(result);
};

const updateById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const deleteById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json({
      message: "Contact deleted"
    })
};

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    updateStatusContact: ctrlWrapper(updateStatusContact),
    deleteById: ctrlWrapper(deleteById),
}