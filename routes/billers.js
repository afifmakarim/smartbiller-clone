var express = require("express");
var router = express.Router();
var { inquiryToBiller } = require("../controllers/apiControllers");

router.post("/inquiry", inquiryToBiller);

module.exports = router;
