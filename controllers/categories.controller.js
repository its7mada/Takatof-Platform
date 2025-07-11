const Category = require('../database/category.table');
const { uploadCategorieImage } = require('../middleware/multerConfig');

const addCategory = async (req, res) => {
  uploadCategorieImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: `Image upload error: ${err.message}` });
    }

    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const newCategory = new Category({
        name,
        imageUrl: req.file.filename,
      });

      await newCategory.save();

      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: "Error saving category", error: error.message });
    }
  });
};

const gitCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
}

module.exports = {
  addCategory,
  gitCategories
};