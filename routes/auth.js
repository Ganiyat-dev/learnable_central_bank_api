const router = require('express').Router();
const AuthController = require("./../controllers/auth");

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.signin);

module.exports = router;