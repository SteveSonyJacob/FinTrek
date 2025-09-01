import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';
const JWT_REFRESH_EXPIRES_IN = '7d';

// Initialize Firebase Admin SDK
let db, auth;
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  
  db = admin.firestore();
  auth = admin.auth();
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.warn('Firebase initialization failed:', error.message);
  console.warn('Server will run without Firebase functionality');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handling for validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// JWT Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Helper function to generate tokens
const generateTokens = (userId, email) => {
  const accessToken = jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  const refreshToken = jwt.sign(
    { userId, email, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
  
  return { accessToken, refreshToken };
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'FinTrek Backend is running 🚀',
    version: '1.0.0',
    status: 'healthy'
  });
});

// AUTH ENDPOINTS

// User Signup
app.post('/auth/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
], handleValidation, async (req, res) => {
  try {
    if (!auth || !db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const { email, password, firstName, lastName } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Create user profile in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      firstName,
      lastName,
      hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Generate tokens
    const tokens = generateTokens(userRecord.uid, email);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        uid: userRecord.uid,
        email,
        firstName,
        lastName
      },
      tokens
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// User Login
app.post('/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
], handleValidation, async (req, res) => {
  try {
    if (!auth || !db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const { email, password } = req.body;
    
    // Get user by email
    const userRecord = await auth.getUserByEmail(email);
    
    // Get user document from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    const userData = userDoc.data();
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.hashedPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const tokens = generateTokens(userRecord.uid, email);

    res.json({
      message: 'Login successful',
      user: {
        uid: userRecord.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      },
      tokens
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh Token
app.post('/auth/refresh', [
  body('refreshToken').exists()
], handleValidation, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    const tokens = generateTokens(decoded.userId, decoded.email);
    
    res.json({ tokens });

  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// USER MANAGEMENT ENDPOINTS

// Get Profile
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const userDoc = await db.collection('users').doc(req.user.userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const userData = userDoc.data();
    const { hashedPassword, ...profile } = userData;

    res.json({ profile });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update Profile
app.put('/profile', authenticateToken, [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
], handleValidation, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const updates = {};
    const { firstName, lastName } = req.body;
    
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection('users').doc(req.user.userId).update(updates);

    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete Account
app.delete('/profile', authenticateToken, async (req, res) => {
  try {
    if (!auth || !db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const userId = req.user.userId;
    
    // Delete user's transactions
    const transactionQuery = await db.collection('transactions').where('userId', '==', userId).get();
    const batch = db.batch();
    
    transactionQuery.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete user profile
    batch.delete(db.collection('users').doc(userId));
    
    await batch.commit();
    
    // Delete Firebase Auth user
    await auth.deleteUser(userId);

    res.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// TRANSACTION ENDPOINTS

// Add Transaction
app.post('/transactions', authenticateToken, [
  body('amount').isFloat({ min: 0.01 }),
  body('type').isIn(['income', 'expense']),
  body('category').trim().isLength({ min: 1 }),
  body('description').optional().trim(),
  body('date').optional().isISO8601(),
], handleValidation, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const { amount, type, category, description, date } = req.body;
    
    const transaction = {
      id: uuidv4(),
      userId: req.user.userId,
      amount: parseFloat(amount),
      type,
      category,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('transactions').add(transaction);

    res.status(201).json({
      message: 'Transaction added successfully',
      transaction: { ...transaction, firestoreId: docRef.id }
    });

  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Get All Transactions
app.get('/transactions', authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const { limit = 50, startAfter, type, category } = req.query;
    
    let query = db.collection('transactions')
      .where('userId', '==', req.user.userId)
      .orderBy('date', 'desc');
    
    if (type) {
      query = query.where('type', '==', type);
    }
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    if (startAfter) {
      const startAfterDoc = await db.collection('transactions').doc(startAfter).get();
      query = query.startAfter(startAfterDoc);
    }
    
    query = query.limit(parseInt(limit));
    
    const snapshot = await query.get();
    const transactions = [];
    
    snapshot.forEach(doc => {
      transactions.push({
        firestoreId: doc.id,
        ...doc.data()
      });
    });

    res.json({ transactions, count: transactions.length });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get Single Transaction
app.get('/transactions/:id', authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const doc = await db.collection('transactions').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const transaction = doc.data();
    
    // Check if transaction belongs to the user
    if (transaction.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.json({
      transaction: {
        firestoreId: doc.id,
        ...transaction
      }
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Update Transaction
app.put('/transactions/:id', authenticateToken, [
  body('amount').optional().isFloat({ min: 0.01 }),
  body('type').optional().isIn(['income', 'expense']),
  body('category').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim(),
  body('date').optional().isISO8601(),
], handleValidation, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const docRef = db.collection('transactions').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const transaction = doc.data();
    
    if (transaction.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const updates = {};
    const { amount, type, category, description, date } = req.body;
    
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (type) updates.type = type;
    if (category) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (date) updates.date = new Date(date);
    
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await docRef.update(updates);

    res.json({ message: 'Transaction updated successfully' });

  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete Transaction
app.delete('/transactions/:id', authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const docRef = db.collection('transactions').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const transaction = doc.data();
    
    if (transaction.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    await docRef.delete();

    res.json({ message: 'Transaction deleted successfully' });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// ANALYTICS ENDPOINTS

// Summary Analytics
app.get('/analytics/summary', authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const { period = '30' } = req.query; // days
    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const snapshot = await db.collection('transactions')
      .where('userId', '==', req.user.userId)
      .where('date', '>=', startDate)
      .get();

    let totalIncome = 0;
    let totalExpenses = 0;
    let transactionCount = 0;

    snapshot.forEach(doc => {
      const transaction = doc.data();
      transactionCount++;
      
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpenses;

    res.json({
      summary: {
        period: `${periodDays} days`,
        totalIncome,
        totalExpenses,
        balance,
        transactionCount,
        avgDailySpending: totalExpenses / periodDays,
        savingsRate: totalIncome > 0 ? ((balance / totalIncome) * 100) : 0
      }
    });

  } catch (error) {
    console.error('Summary analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch summary analytics' });
  }
});

// Category Breakdown
app.get('/analytics/category', authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const { type = 'expense', period = '30' } = req.query;
    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const snapshot = await db.collection('transactions')
      .where('userId', '==', req.user.userId)
      .where('type', '==', type)
      .where('date', '>=', startDate)
      .get();

    const categoryTotals = {};
    let grandTotal = 0;

    snapshot.forEach(doc => {
      const transaction = doc.data();
      const category = transaction.category;
      
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      
      categoryTotals[category] += transaction.amount;
      grandTotal += transaction.amount;
    });

    const categories = Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount,
      percentage: grandTotal > 0 ? ((amount / grandTotal) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);

    res.json({
      breakdown: {
        type,
        period: `${periodDays} days`,
        categories,
        totalAmount: grandTotal
      }
    });

  } catch (error) {
    console.error('Category analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch category analytics' });
  }
});

// Monthly Trends
app.get('/analytics/trends', authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not configured' });
    }

    const { months = '6' } = req.query;
    const monthsCount = parseInt(months);
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsCount);
    startDate.setDate(1); // First day of the month

    const snapshot = await db.collection('transactions')
      .where('userId', '==', req.user.userId)
      .where('date', '>=', startDate)
      .orderBy('date', 'asc')
      .get();

    const monthlyData = {};

    snapshot.forEach(doc => {
      const transaction = doc.data();
      const date = transaction.date.toDate ? transaction.date.toDate() : new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });

    const trends = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      balance: data.income - data.expenses
    }));

    res.json({
      trends: {
        period: `${monthsCount} months`,
        data: trends
      }
    });

  } catch (error) {
    console.error('Trends analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch trend analytics' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`FinTrek Backend server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});