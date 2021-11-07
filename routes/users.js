var express = require("express");
var router = express.Router();
var { createMockData } = require("../controllers/apiControllers");

/* GET users listing. */
router.get("/", createMockData);

module.exports = router;
