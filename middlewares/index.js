const jwt = require('jsonwebtoken');
const { sendResponse } = require("../utilities");

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

const checkIfAuthenticatedJWT = function (req, res, next) {
	// Extract out the authorization headers
	const authHeader = req.headers.authorization;
	if (authHeader) {
		// Extract out the JWT and check whether it is valid
		// Example authHeader => BEARER ortsejlrtwlter
		const token = authHeader.split(' ')[1];
		jwt.verify(token, process.env.TOKEN_SECRET, function (err, tokenData) {
			// err arg -> null if no error
			// tokenData arg -> data that we embedded in JWT as payload
			if (err) {
				sendResponse(res, 401, {
					error: 'Invalid access token'
				});
			}
			else {
				// If token is valid
				req.user = tokenData; // so that the route can use this data
				next();
			}
		})
		next();
	}
	else {
		sendResponse(res, 401, {
			error: 'No authorization headers found'
		});
	}

}

module.exports = {
	checkIfAuthenticated,
	checkIfAuthenticatedJWT
};
