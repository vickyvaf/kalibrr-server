const express = require("express");
const auth = require("../../middlewares/auth");
const {
  getDetailUser,
  deleteUser,
  updateUser,
  updateEmailUser,
  updatePasswordUser,
  createResume,
  // deleteResume,
  getAllResume,
  // getOneResume,
  getApply,
  apply,
} = require("./controller");
const { Users } = require("../../models");

// path
const path = require("path");

// fs
const fs = require("fs")

// uuid
const { v4: uuidv4 } = require("uuid");

// multer
const multer = require("multer");
const storage = multer.diskStorage({
  // set the directory to save resume file
  destination: async (req, file, cb) => { 
    const dir = path.join(__dirname, "../../../public/uploads/users/" + req.userId.id + "/"); /* fungsi dari path join dirname untuk mengambil hasil dari posisi directory (string) */

    // check the directory
    if (!fs.existsSync(dir)) { /* mengecek directorynya ada atau tidak (boolean) */
      fs.mkdirSync(dir, { recursive: true }); /* membuat directory otomatis */
      return cb(null, dir);
    }

    // if there's a directory
    // get the file name from database
    const resultFileName = await Users.findOne({
      where: { id: req.userId.id },
      attributes: ['resume'],
    });

    // console.log(resultFileName.dataValues.resume);

    fs.unlinkSync(dir + resultFileName.dataValues.resume); /* hapus file sebelumnya */
    cb(null, dir);
  },

  // set filename using uuid (safety)
  filename: (req, file, cb) => {
    // console.log(file);
    const fileName = path.basename(uuidv4(file.originalname), path.extname(file.originalname))
    cb(null, fileName + path.extname(file.originalname));
  }
});

const uploadResume = multer({
    storage: storage
}).single("cv");

const route = express();

route.get("/user", auth, getDetailUser);
route.put("/user", auth, updateUser);
route.put("/user-email", auth, updateEmailUser);
route.put("/user-password", auth, updatePasswordUser);
route.delete("/user", auth, deleteUser);

route.get("/user/resume", auth, getAllResume); /* id */
// route.get("/user/resume/:id", auth, getOneResume);
route.put("/user/resume", auth, uploadResume, createResume);
// route.delete("/user/resume/:id", auth, deleteResume);

route.get("/user/apply", auth, getApply);
route.post("/user/apply", auth, apply);

module.exports = route;
