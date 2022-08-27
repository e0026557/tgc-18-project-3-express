const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { checkIfAuthenticatedJWT } = require('../../middlewares');
const dataLayer = require('../../dal/accounts');
const {
	sendResponse,
	sendDatabaseError,
	validateEmail
} = require('../../utilities');

// *** FUNCTIONS ***
const generateAccessToken = function (
	username,
	id,
	role_id,
	tokenSecret,
	expiry
) {
	return jwt.sign(
		{
			username: username,
			id: id,
			role_id: role_id
		},
		tokenSecret,
		{
			expiresIn: expiry
		}
	);
};

// *** ROUTES ***

router.post('/register', async function (req, res) {
	// name, username, email, password, contact_number, role_id
	// Extract and validate user data from req.body
	let error = {};

	const name = req.body.name;
	if (name.length == 0 || name.length > 100) {
		error.name = 'Name must not be more than 100 characters long';
	}

	const username = req.body.username;
	if (username.length == 0 || username.length > 100) {
		error.username = 'Username must not be more than 100 characters long';
	}

	const email = req.body.email;
	if (!validateEmail(email)) {
		error.email = 'Invalid email address';
	}

	const password = req.body.password;
	if (password.length == 0 || password.length > 100) {
		error.password = 'Password must not be more than 100 characters long';
	}

	const contact_number = req.body.contact_number;
	if (contact_number.length == 0 || contact_number.length > 15) {
		error.contact_number =
			'Contact number must not be more than 15 characters long';
	}

	// If there is any error in user data, return error response
	if (Object.keys(error).length > 0) {
		sendResponse(res, 400, error);
		return;
	}

	// Collate user data
	const userData = {
		name,
		username,
		email,
		password,
		contact_number
	};

	// Create new Customer user
	try {
		// Check that whether user already exist before registering user
		const user = await dataLayer.getUserByCredentials({
			username,
			password
		})

		if (user) {
			sendResponse(res, 400, {
				error: 'User already exists'
			});
			return;
		}

		await dataLayer.addUser(userData, 1);

		sendResponse(res, 201, { message: 'User successfully registered' });
	} catch (error) {
		console.log(error);
		sendDatabaseError(res);
	}
});

router.post('/login', async function (req, res) {
	// Get user by username and password
	const userData = {
		username: req.body.username,
		password: req.body.password
	};

	const user = await dataLayer.getUserByCredentials(userData);

	// If user does not exist or user is not a customer (role_id != 1)
	if (!user || user.get('role_id') != 1) {
		sendResponse(res, 400, {
			error: 'Invalid username and/or password'
		});
		return;
	}

	// If user exists and is a customer, create JWT and refresh token
	const accessToken = generateAccessToken(
		user.get('username'),
		user.get('id'),
		user.get('role_id'),
		process.env.TOKEN_SECRET,
		'1h'
	);

	const refreshToken = generateAccessToken(
		user.get('username'),
		user.get('id'),
		user.get('role_id'),
		process.env.REFRESH_TOKEN_SECRET,
		'7d'
	);

	// Send back response containing JWT and refresh token
	sendResponse(res, 200, {
		accessToken: accessToken,
		refreshToken: refreshToken
	});
});

// (FOR TESTING PURPOSES)
router.get('/profile', checkIfAuthenticatedJWT, function (req, res) {
	const user = req.user;
	res.json(user);
});

router.post('/refresh', async function (req, res) {
	// Get the refreshToken from req.body (need not be in authorisation header for refresh tokens)
	const refreshToken = req.body.refreshToken;

	if (refreshToken) {
		// Check if the token is already blacklisted
		const blacklistedToken = await dataLayer.getBlacklistedToken(
			refreshToken
		);

		// If the blacklistedToken is NOT null, then it means it exists and was blacklisted
		if (blacklistedToken) {
			sendResponse(res, 400, {
				error: 'Refresh token has been blacklisted'
			});
			return;
		}

		// Verify refresh token
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			function (err, tokenData) {
				// If verified
				if (!err) {
					// Generate new access token (JWT)
					const accessToken = generateAccessToken(
						tokenData.username,
						tokenData.id,
						tokenData.role_id,
						process.env.TOKEN_SECRET,
						'1h'
					);

					sendResponse(res, 200, {
						accessToken: accessToken
					});
				} else {
					sendResponse(res, 400, {
						error: 'Invalid refresh token'
					});
				}
			}
		);
	} else {
		// If no refresh token
		sendResponse(res, 400, {
			error: 'No refresh token found'
		});
	}
});

router.post('/logout', async function (req, res) {
	const refreshToken = req.body.refreshToken;
	if (refreshToken) {
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async function (err, tokenData) {
				// Add refresh token to the black list
				if (!err) {
					await dataLayer.addBlacklistedToken(refreshToken);
					sendResponse(res, 200, {
						message: 'Successfully logged out'
					});
				}
			}
		);
	} else {
		sendResponse(res, 400, {
			error: 'No refresh token found'
		});
	}
});

module.exports = router;
