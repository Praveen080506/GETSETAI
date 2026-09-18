const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '509974976339-bpan5hceh940oqgki7adq041nnv6gldc.apps.googleusercontent.com';
console.log('Backend Google Client ID:', GOOGLE_CLIENT_ID);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
  }
});

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Google Authentication Route
router.post('/google', async (req, res) => {
  try {
    console.log('Google auth request received');
    const { credential, accessToken } = req.body;

    if (!credential && !accessToken) {
      console.error('No credential or accessToken provided');
      return res.status(400).json({ message: 'Google credential or access token is required' });
    }

    let email, name, profilePicture, googleId;

    if (credential) {
      console.log('Verifying Google ID token...');
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      console.log('Google API response status:', googleRes.status);
      
      if (!googleRes.ok) {
        const errorData = await googleRes.json().catch(() => ({}));
        console.error('Google token verification failed:', errorData);
        return res.status(401).json({ message: errorData.error_description || 'Invalid Google token' });
      }

      const payload = await googleRes.json();
      console.log('Google token payload:', { email: payload.email, name: payload.name, aud: payload.aud });

      // Verify client ID
      if (payload.aud !== GOOGLE_CLIENT_ID) {
        console.error('Client ID mismatch:', { expected: GOOGLE_CLIENT_ID, received: payload.aud });
        return res.status(401).json({ message: 'Google token client ID mismatch' });
      }

      email = payload.email?.toLowerCase().trim();
      name = payload.name || payload.given_name || email?.split('@')[0];
      profilePicture = payload.picture || '';
      googleId = payload.sub || '';
    } else if (accessToken) {
      console.log('Verifying Google access token with userinfo...');
      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log('Google userinfo response status:', googleRes.status);

      if (!googleRes.ok) {
        const errorData = await googleRes.json().catch(() => ({}));
        console.error('Google access token verification failed:', errorData);
        return res.status(401).json({ message: errorData.error_description || 'Invalid Google access token' });
      }

      const payload = await googleRes.json();
      console.log('Google userinfo payload:', { email: payload.email, name: payload.name, sub: payload.sub });

      email = payload.email?.toLowerCase().trim();
      name = payload.name || payload.given_name || email?.split('@')[0];
      profilePicture = payload.picture || '';
      googleId = payload.sub || '';
    }

    if (!email) {
      console.error('No email in Google payload');
      return res.status(400).json({ message: 'Google account has no email address' });
    }

    console.log('Google user data:', { name, email, profilePicture, googleId });
    console.log('Looking for existing user with email:', email);
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      console.log('Existing user found, updating Google metadata');
      // Update Google metadata and profile picture
      let modified = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        modified = true;
      }
      // Always update profile picture if user has Google auth provider or if current picture is empty
      if (profilePicture && (!user.profilePicture || user.authProvider === 'google')) {
        user.profilePicture = profilePicture;
        modified = true;
      }
      if (modified) {
        await user.save();
        console.log('User updated successfully with profile picture');
      }
    } else {
      console.log('Creating new user with Google credentials');
      // Create new user with name, email, and a secure random password (hashed by pre-save hook)
      const randomPassword = crypto.randomBytes(16).toString('hex');

      user = new User({
        name,
        email,
        password: randomPassword,
        profilePicture,
        googleId,
        authProvider: 'google'
      });

      await user.save();
      console.log('New user created successfully');
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('JWT token generated');

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      college: user.college,
      year: user.year,
      branch: user.branch,
      state: user.state,
      enrolledCourses: user.enrolledCourses,
      authProvider: user.authProvider || 'google'
    };

    console.log('Sending successful response with user data:', { name: userResponse.name, profilePicture: userResponse.profilePicture });
    res.json({
      message: 'Google authentication successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
});

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      college: user.college,
      year: user.year,
      branch: user.branch,
      state: user.state,
      enrolledCourses: user.enrolledCourses
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      college: user.college,
      year: user.year,
      branch: user.branch,
      state: user.state,
      enrolledCourses: user.enrolledCourses
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get User Profile (protected route - optional for now)
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      college: user.college,
      year: user.year,
      branch: user.branch,
      state: user.state,
      enrolledCourses: user.enrolledCourses
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, phone, profilePicture, college, year, branch, state } = req.body;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (college !== undefined) user.college = college;
    if (year !== undefined) user.year = year;
    if (branch !== undefined) user.branch = branch;
    if (state !== undefined) user.state = state;

    await user.save();

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      college: user.college,
      year: user.year,
      branch: user.branch,
      state: user.state,
      enrolledCourses: user.enrolledCourses
    };

    res.json({ message: 'Profile updated successfully', user: userResponse });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload Profile Picture
router.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile picture
    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      college: user.college,
      year: user.year,
      branch: user.branch,
      state: user.state,
      enrolledCourses: user.enrolledCourses
    };

    res.json({ message: 'Profile picture uploaded successfully', user: userResponse });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Remove Profile Picture
router.delete('/profile-picture', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove profile picture
    user.profilePicture = '';
    await user.save();

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      college: user.college,
      year: user.year,
      branch: user.branch,
      state: user.state,
      enrolledCourses: user.enrolledCourses
    };

    res.json({ message: 'Profile picture removed successfully', user: userResponse });
  } catch (error) {
    console.error('Remove profile picture error:', error);
    res.status(500).json({ message: 'Server error during profile picture removal' });
  }
});

module.exports = router;
