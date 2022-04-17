const router = require("express").Router();
const invoiceController = require("./controller");

router.get("/invoices/:order_id", invoiceController.show);
router.get("/invoices", invoiceController.index);

module.exports = router;
