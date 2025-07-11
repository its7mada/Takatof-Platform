const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/img");
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadUserAvatarImage = multer({
  storage: storage1,
  limits: { fileSize: 15 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        "File upload only supports the following filetypes - " + filetypes
      )
    );
  },
}).single("avatar");

//================================================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/img");
    ensureDirExists(uploadPath); // تأكد من أن المجلد موجود
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const uploadProductImages = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // حد الحجم 15 ميجابايت
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        `File upload only supports the following file types: ${allowedFileTypes.source}`
      )
    );
  },
}).fields([
  { name: "mainImage", maxCount: 1 },
  { name: "additionalImages", maxCount: 10 },
]);

//================================================================================

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/img");
    ensureDirExists(uploadPath); // تأكد من أن المجلد موجود
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const uploadCategorieImage = multer({
  storage: storage2,
  limits: { fileSize: 15 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        "File upload only supports the following filetypes - " + filetypes
      )
    );
  },
}).single("imageUrl");

module.exports = {
  uploadUserAvatarImage,
  uploadProductImages,
  uploadCategorieImage,
};
