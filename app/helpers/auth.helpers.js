import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export function validatePassword(plain, hashed) {
	return bcrypt.compare(plain, hashed);
}

export async function hashPassword(password) {
	const SALT_WORK_FACTOR = 10;
	const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
	return bcrypt.hash(password, salt);
}

export function generateJWTToken(userObject) {
	const today = new Date();
	const expiry = new Date(today);

	expiry.setDate(today.getDate() + 2);
	return jwt.sign({
		identity: userObject.id,
		isAdmin: userObject.isAdmin,
		isSuperUser: userObject.isSuperUser,
		exp: Number.parseInt(expiry.getTime() / 100, 10)
	}, process.env.JWT_SECRET);
}

export function toAuthJSON(userObject) {
	return {
		_id: userObject.id,
		name: userObject.username,
		token: userObject.token
	};
}
