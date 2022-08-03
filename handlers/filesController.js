let formidable = require("formidable");
let fs = require("fs");
const path = require("path");
const { Book } = require("../models/bookModel");

module.exports.uploadFile = () => {
  return async (req, res) => {
    let form = new formidable.IncomingForm();
    const uploadFolder = path.join(__dirname, "public", "files");
    form.multiples = true;
    form.maxFileSize = 50 * 1024 * 1024;
    form.uploadDir = uploadFolder;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err, "Error parsing the files");
        return res.status(400).json({
          status: "Fail",
          message: "There was an error parsing the files",
          error: err,
        });
      }
      const isFileValid = (file) => {
        const type = file.mimetype.split("/").pop();
        const validTypes = ["jpg", "jpeg", "png", "pdf"];
        if (validTypes.indexOf(type) === -1) {
          return false;
        }
        return true;
      };
      if(!files.file.length){
        const file = files.file
        const isValid = isFileValid(file)
        const fileName =  encodeURIComponent(file.originalFilename.replace(/\s/g, "-"))

        if(!isValid){
          return res.status(400).json({
            status: "Fail",
            message: "The file type is not a valid type",
          });
        }
        try{
          fs.renameSync(file.filepath, path.join(uploadFolder, fileName))
        }catch(err){
          console.log(err)
        }
        try{
          const newFile =  await Book.create({
            title: fields.title, 
            author: fields.author, 
            description: fields.description, 
            name: `files/${fileName}`
          })
          return res.status(200).json({
            status: "success",
            message: "File created successfully!!",
          });
        }catch (error) {
          res.json({
            error,
          });
      }
      }
    });
  };
};
