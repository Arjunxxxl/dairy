var express = require('express');
var router = express.Router();

// Get Homepage
// Get Homepage
router.get('/', function(req, res){
	res.render('desicowmilk');
});


module.exports = router;
