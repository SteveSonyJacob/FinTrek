import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
let db;
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  
  db = admin.firestore();
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.warn('Firebase initialization failed:', error.message);
  console.warn('Server will run without Firebase functionality');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running 🚀' });
});

app.post('/addUser', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        error: 'Name and email are required' 
      });
    }
    
    if (!db) {
      return res.status(500).json({ 
        error: 'Firebase not configured. Please set up Firebase credentials in Replit Secrets.' 
      });
    }
    
    const userRef = await db.collection('users').add({
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({ 
      message: 'User added successfully', 
      id: userRef.id 
    });
    
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ 
      error: 'Failed to add user' 
    });
  }
});

app.get('/users', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        error: 'Firebase not configured. Please set up Firebase credentials in Replit Secrets.' 
      });
    }
    
    const snapshot = await db.collection('users').get();
    const users = [];
    
    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({ users });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});