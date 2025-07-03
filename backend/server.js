const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (optional - you can skip this and use in-memory storage)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/textSimilarity';

// Submission schema (optional - for MongoDB storage)
const submissionSchema = new mongoose.Schema({
  text1: String,
  text2: String,
  result: {
    text1WordCount: Number,
    text2WordCount: Number,
    sharedWords: [String],
    sharedWordCount: Number,
    similarityScore: Number
  },
  timestamp: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', submissionSchema);

// In-memory storage (fallback if MongoDB is not available)
let submissions = [];

// Connect to MongoDB (optional)
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('MongoDB connection failed, using in-memory storage:', err.message);
});

// Helper function to clean and process text
function processText(text) {
  // Remove punctuation and convert to lowercase
  const cleaned = text.toLowerCase().replace(/[.,!?;:"'()-]/g, '');
  // Split into words and filter out empty strings
  const words = cleaned.split(/\s+/).filter(word => word.length > 0);
  return words;
}

// Helper function to calculate similarity
function calculateSimilarity(text1, text2) {
  const words1 = processText(text1);
  const words2 = processText(text2);
  
  // Get unique words from both texts
  const uniqueWords1 = [...new Set(words1)];
  const uniqueWords2 = [...new Set(words2)];
  
  // Find shared words
  const sharedWords = uniqueWords1.filter(word => uniqueWords2.includes(word));
  
  // Calculate similarity score (Jaccard similarity)
  const totalUniqueWords = new Set([...uniqueWords1, ...uniqueWords2]).size;
  const similarityScore = totalUniqueWords > 0 ? (sharedWords.length / totalUniqueWords) * 100 : 0;
  
  return {
    text1WordCount: words1.length,
    text2WordCount: words2.length,
    sharedWords: sharedWords.sort(),
    sharedWordCount: sharedWords.length,
    similarityScore: Math.round(similarityScore * 100) / 100
  };
}

// API endpoint to check similarity
app.post('/api/similarity', async (req, res) => {
  try {
    const { text1, text2 } = req.body;
    
    // Validation
    if (!text1 || !text2) {
      return res.status(400).json({ error: 'Both text blocks are required' });
    }
    
    const words1 = processText(text1);
    const words2 = processText(text2);
    
    // Check minimum word count (optional requirement)
    if (words1.length < 10) {
      return res.status(400).json({ error: 'Text 1 must have at least 10 words' });
    }
    
    if (words2.length < 10) {
      return res.status(400).json({ error: 'Text 2 must have at least 10 words' });
    }
    
    // Calculate similarity
    const result = calculateSimilarity(text1, text2);
    
    // Store submission (try MongoDB first, fallback to in-memory)
    const submissionData = {
      text1,
      text2,
      result,
      timestamp: new Date()
    };
    
    try {
      if (mongoose.connection.readyState === 1) {
        // MongoDB is connected
        const submission = new Submission(submissionData);
        await submission.save();
      } else {
        // Use in-memory storage
        submissions.push(submissionData);
      }
    } catch (dbError) {
      console.log('Database save failed, using in-memory storage:', dbError.message);
      submissions.push(submissionData);
    }
    
    res.json({
      success: true,
      result
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get all submissions (optional)
app.get('/api/submissions', async (req, res) => {
  try {
    let allSubmissions;
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      allSubmissions = await Submission.find().sort({ timestamp: -1 }).limit(10);
    } else {
      // Use in-memory storage
      allSubmissions = submissions.slice(-10).reverse();
    }
    
    res.json({
      success: true,
      submissions: allSubmissions
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'MongoDB' : 'In-Memory'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});