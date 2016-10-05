var express = require('express');
var router = express.Router();
var request = require('request');

/* GET webproxy listing. */
router.get('/', function(req, res, next) {
    request(decodeURIComponent(req.query.url || '')).pipe(res);
});

module.exports = router;
