const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dataLayer = require('../../dal/accounts');
const {
	getHash,
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
		const user = await dataLayer.addUser(userData, 1);

		sendResponse(res, 201, { user: user });
	} catch (error) {
		console.log(error);
		sendDatabaseError(res);
	}
});

// TODO
router.post('/login', async function (req, res) {});

module.exports = router;
