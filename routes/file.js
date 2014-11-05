var express = require('express');
var router = express.Router();

/* GET file listing. */
router.post('/uploads', function(req, res) {
  res.send('FIle uploads');
});

module.exports = router;
