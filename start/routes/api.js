var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var order = mongoose.model('Order');
var User = mongoose.model('User');

//Used for routes that must be authenticated.
isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	res.redirect('/#login');
};

router.use('/orders', isAuthenticated);

router.route('/orders')
	//creates a new order
	.post(function(req, res){
		if(!req.isAuthenticated()){
			return res.send(401, {message:'not authorized'});
		}
		var order = new order();
		order.cupcakeFlavor = req.body.text;
		order.created_by = req.body.created_by;
		order.save(function(err, order) {
			if (err){
				return res.send(500, err);
			}
			return res.json(order);
		});
	})
	//gets all orders
	.get(function(req, res){
		order.find(function(err, orders){
			if(err){
				return res.send(500, err);
			}
			return res.send(orders);
		});
	});

//order-specific commands. likely won't be used
router.route('/orders/:id')
	//gets specified order
	.get(function(req, res){
		order.findById(req.params.id, function(err, order){
			if(err)
				res.send(err);
			res.json(order);
		});
	}) 
	//updates specified order
	.put(function(req, res){
		order.findById(req.params.id, function(err, order){
			if(err)
				res.send(err);

			order.created_by = req.body.created_by;
			order.cupcakeFlavor = req.body.text;

			order.save(function(err, order){
				if(err)
					res.send(err);

				res.json(order);
			});
		});
	})
	//deletes the order
	.delete(function(req, res) {
		order.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});

module.exports = router;