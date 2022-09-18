const { Router } = require("express");
const router = Router();

const {
	searchitems,
	Getitems,
	borrarcache,
} = require("../controllers/index.controller");

router.get("/search", searchitems);
router.post("/search", searchitems);
// router.get('/Inventary',Getitems)

router.get("/borrarcache", borrarcache);
// router.get('/Inventary',Getitems)

module.exports = router;
