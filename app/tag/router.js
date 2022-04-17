const router = require("express").Router();
const { police_check } = require("../../middleware");
const tagController = require("./controller");

router.post("/tags", police_check("create", "Tags"), tagController.store);
router.put("/tags/:id", police_check("update", "Tags"), tagController.update);
router.delete("/tags/:id", police_check("delete", "Tags"), tagController.destroy);
router.get("/tags", tagController.index);

module.exports = router;
