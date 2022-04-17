const router = require("express").Router();
const cartController = require("./controller");
const { police_check } = require("../../middleware");

router.put("/carts", police_check("update", "Cart"), cartController.update);
router.get("/carts", police_check("read", "Cart"), cartController.index);

module.exports = router;
