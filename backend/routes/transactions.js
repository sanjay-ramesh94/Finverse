const express = require('express');
const router = express.Router();
const multer = require('multer');
const transactionController = require('../controllers/transactionController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/", upload.single("image"), transactionController.createTransaction);
router.get("/user/:userId", transactionController.getTransactionsByUser);
router.get("/investments/:userId", transactionController.getInvestmentsByUser);
router.get("/:id", transactionController.getTransactionById);
router.put("/:id", upload.single("image"), transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
