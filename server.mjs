// server.mjs - Simple API server that implements mockoon's auth API
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
let users = [
	{
		id: '550e8400-e29b-41d4-a716-446655440000',
		email: 'test@example.com',
		username: 'testuser',
		fullName: 'John Doe',
		firstName: 'John',
		lastName: 'Doe',
		primaryBranchID: 'BRANCH001',
		userType: 'internal',
		activityLat: '-6.2000',
		activityLon: '106.8166',
		gender: 'male',
		birthPlace: 'Jakarta',
		dateOfBirth: '1990-01-01',
		nik: '1234567890123456',
		nationality: 'ID',
		religion: 'Islam',
		maritalStatus: 'single',
		phone: '081234567890',
		address: 'Jl. Demo No. 1, Jakarta',
		profession: 'Engineer',
		addressLat: '-6.2005',
		addressLon: '106.8169',
		settings: '{"theme":"dark","language":"id"}',
		roleCode: 'platform_admin',
		name: 'John Doe',
		passwordHash: '$2b$10$3QfcRRcltYOv1nFZROz0O.QecB2f02.TDN.PfeZOhAPhZRz4XI2fy', // 'password123' hashed
		created_at: '2024-01-01T00:00:00Z'
	}
];

// Utility function to generate JWT
function generateToken(user) {
	return jwt.sign(
		{
			sub: user.id,
			email: user.email,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
		},
		'secret_key_for_demo_only' // In real app, use environment variable
	);
}

function sanitizeUser(user) {
	const { ...safeUser } = user;
	return safeUser;
}

// Auth routes
app.post('/auth/register', (req, res) => {
	const payload = req.body;
	const requiredFields = [
		'email',
		'passwordRaw',
		'fullName',
		'firstName',
		'lastName',
		'username',
		'primaryBranchID',
		'userType',
		'activityLat',
		'activityLon',
		'gender',
		'birthPlace',
		'dateOfBirth',
		'nik',
		'nationality',
		'religion',
		'maritalStatus',
		'phone',
		'address',
		'profession',
		'addressLat',
		'addressLon',
		'settings',
		'roleCode'
	];

	const missingFields = requiredFields.filter((field) => !payload[field]);

	if (missingFields.length > 0) {
		return res.status(400).json({
			error: 'Bad Request',
			message: `Missing required fields: ${missingFields.join(', ')}`
		});
	}

	// Check for duplicate email or username
	const existingUser = users.find(
		(user) => user.email === payload.email || user.username === payload.username
	);
	if (existingUser) {
		return res.status(409).json({
			error: 'Conflict',
			message: 'Email or username already exists'
		});
	}

	// Validate settings JSON
	try {
		if (payload.settings) {
			JSON.parse(payload.settings);
		}
	} catch {
		return res.status(400).json({
			error: 'Bad Request',
			message: 'Settings must be a valid JSON string'
		});
	}

	// Create new user
	const newUser = {
		id: randomUUID(),
		email: payload.email,
		username: payload.username,
		fullName: payload.fullName,
		firstName: payload.firstName,
		lastName: payload.lastName,
		primaryBranchID: payload.primaryBranchID,
		userType: payload.userType,
		activityLat: payload.activityLat,
		activityLon: payload.activityLon,
		gender: payload.gender,
		birthPlace: payload.birthPlace,
		dateOfBirth: payload.dateOfBirth,
		nik: payload.nik,
		nationality: payload.nationality,
		religion: payload.religion,
		maritalStatus: payload.maritalStatus,
		phone: payload.phone,
		address: payload.address,
		profession: payload.profession,
		addressLat: payload.addressLat,
		addressLon: payload.addressLon,
		settings: payload.settings,
		roleCode: payload.roleCode,
		name: payload.fullName,
		passwordHash: bcrypt.hashSync(payload.passwordRaw, 10),
		created_at: new Date().toISOString()
	};

	users.push(newUser);

	// Generate token
	const token = generateToken(newUser);

	res.status(201).json({
		user: sanitizeUser(newUser),
		token,
		message: 'Registration successful'
	});
});

app.post('/auth/login', (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			error: 'Bad Request',
			message: 'Email and password are required'
		});
	}

	// Find user by email
	const user = users.find((user) => user.email === email);

	if (!user) {
		return res.status(401).json({
			error: 'Invalid credentials',
			message: 'User with this email does not exist'
		});
	}

	// Check credentials (in real app, compare hashed password)
	const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
	if (!isValidPassword) {
		return res.status(401).json({
			error: 'Invalid credentials',
			message: 'Email or password is incorrect'
		});
	}

	// Generate token
	const token = generateToken(user);

	res.status(200).json({
		user: sanitizeUser(user),
		token,
		message: 'Login successful'
	});
});

app.get('/auth/verify', (req, res) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({
			error: 'Unauthorized',
			message: 'Invalid or missing token'
		});
	}

	const token = authHeader.split(' ')[1];

	try {
		// Verify JWT token
		const decoded = jwt.verify(token, 'secret_key_for_demo_only');

		// Find user by ID from token payload
		const user = users.find((u) => u.id === decoded.sub);

		if (!user) {
			return res.status(401).json({
				error: 'Unauthorized',
				message: 'User not found'
			});
		}

		res.status(200).json({
			user: sanitizeUser(user),
			valid: true
		});
	} catch {
		res.status(401).json({
			error: 'Unauthorized',
			message: 'Invalid or expired token'
		});
	}
});

app.post('/auth/logout', (req, res) => {
	// In a real app, this might invalidate the token on the server
	// For this demo, we just return success
	res.status(200).json({
		message: 'Logout successful'
	});
});

// Task routes (from original mockoon config)
app.get('/tasks', (req, res) => {
	res.json([
		{
			task_id: '1',
			name: 'Learn Svelte',
			is_done: false
		},
		{
			task_id: '2',
			name: 'Build a Todo App',
			is_done: true
		},
		{
			task_id: '3',
			name: 'Deploy to Production',
			is_done: false
		}
	]);
});

app.post('/tasks', (req, res) => {
	const { name } = req.body;
	const newTask = {
		task_id: randomUUID(),
		name,
		is_done: false
	};
	res.status(201).json(newTask);
});

app.get('/tasks/:id', (req, res) => {
	res.json({
		task_id: req.params.id,
		name: 'Sample Task',
		is_done: false
	});
});

app.patch('/tasks/:id', (req, res) => {
	res.json({
		task_id: req.params.id,
		name: req.body.name || 'Sample Task',
		is_done: req.body.is_done || false
	});
});

app.listen(PORT, () => {
	console.log(`Mock API server running on http://localhost:${PORT}`);
	console.log('Available endpoints:');
	console.log('  POST   /auth/register - Register new user');
	console.log('  POST   /auth/login    - Login user');
	console.log('  GET    /auth/verify   - Verify token');
	console.log('  POST   /auth/logout   - Logout user');
	console.log('  GET    /tasks         - Get all tasks');
	console.log('  POST   /tasks         - Add new task');
	console.log('  GET    /tasks/:id     - Get specific task');
	console.log('  PATCH  /tasks/:id     - Update specific task');
});
