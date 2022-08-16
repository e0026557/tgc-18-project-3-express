const checkIfAuthenticated = function (req, res, next) {
	if (req.session.user) {
		next();
	} else {
		// Store user's intended path before login
		// req.originalUrl is the endpoint
		req.session.redirectTo = req.originalUrl || '/products';

		req.flash('error_messages', 'You need to log in to access this page');
		res.redirect('/accounts/login');
	}
};

module.exports = {
	checkIfAuthenticated
};
