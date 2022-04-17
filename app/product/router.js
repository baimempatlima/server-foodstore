const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const { police_check } = require("../../middleware");
const productController = require("./controller");

router.get("/product", productController.index);
router.post("/product", multer({ dest: os.tmpdir() }).single("image"), police_check("create", "Product"), productController.store);
router.put("/product/:id", multer({ dest: os.tmpdir() }).single("image"), police_check("update", "Product"), productController.update);
router.delete("/product/:id", police_check("delete", "Product"), productController.destroy);

module.exports = router;
