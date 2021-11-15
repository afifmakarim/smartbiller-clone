var express = require("express");
var router = express.Router();
var {
  inquiryToBiller,
  confirmationToBiller,
} = require("../controllers/apiControllers");
const verifyBasicAuth = require("../middleware/verifyBasicAuth");

router.post("/inquiry", [verifyBasicAuth], inquiryToBiller);
router.post("/confirmation", [verifyBasicAuth], confirmationToBiller);

module.exports = router;
