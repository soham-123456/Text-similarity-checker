Text Similarity Checker
A full-stack web application that calculates similarity between two text blocks using Node.js/Express backend and React frontend.
Features

Text Processing: Removes punctuation, converts to lowercase, and splits into words
Similarity Calculation: Uses Jaccard similarity algorithm
Word Count: Displays total words in each text block
Shared Words: Shows common words between texts
Minimum Word Validation: Requires at least 10 words in each text block
Responsive UI: Modern design with Tailwind CSS
Data Storage: Supports both MongoDB and in-memory storage

Tech Stack
Backend

Node.js
Express.js
MongoDB (optional, falls back to in-memory)
Mongoose
CORS

Frontend

React 18
Tailwind CSS
Modern responsive design

Setup Instructions
Prerequisites

Node.js (v14 or higher)
MongoDB (optional - app works without it)

Backend Setup

Navigate to backend directory:
bashmkdir text-similarity-backend
cd text-similarity-backend

Create package.json and install dependencies:
bashnpm init -y
npm install express cors mongoose
npm install -D nodemon

Create server.js (use the provided backend code)
Start the backend server:
bash# Development mode
npm run dev

# Production mode
npm start

Server will run on: http://localhost:5000

Frontend Setup

Create React app:
bashnpx create-react-app text-similarity-frontend
cd text-similarity-frontend

Install Tailwind CSS:
bashnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Replace the generated files with the provided frontend code
Start the frontend:
bashnpm start

App will run on: http://localhost:3000

MongoDB Setup (Optional)

Install MongoDB locally or use MongoDB Atlas
Default connection string: mongodb://localhost:27017/textSimilarity
Environment variable: Set MONGODB_URI if using different connection

API Endpoints
POST /api/similarity
Calculate similarity between two text blocks.
Request Body:
json{
  "text1": "This is the first text block with more than ten words for testing.",
  "text2": "This is the second text block with more than ten words for testing."
}
Response:
json{
  "success": true,
  "result": {
    "text1WordCount": 12,
    "text2WordCount": 13,
    "sharedWords": ["this", "is", "the", "text", "block", "with", "more", "than", "ten", "words", "for", "testing"],
    "sharedWordCount": 12,
    "similarityScore": 85.71
  }
}
GET /api/submissions
Get recent submissions (last 10).
GET /api/health
Health check endpoint.
Algorithm Details
Text Processing

Convert to lowercase
Remove punctuation (.,!?;:"'()-)
Split into words
Filter empty strings

Similarity Calculation

Method: Jaccard Similarity
Formula: (Shared Words) / (Total Unique Words) × 100
Example:

Text 1: "hello world test"
Text 2: "hello universe test"
Shared words: ["hello", "test"] = 2
Total unique words: ["hello", "world", "test", "universe"] = 4
Similarity: (2/4) × 100 = 50%



File Structure
text-similarity-app/
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── TextSimilarityChecker.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
Usage Examples
Valid Input
Text 1: "This is a simple example text block with more than ten words for testing."
Text 2: "This is another example text block with more than ten words for comparison."
Invalid Input (Too Short)
Text 1: "Too short."
Text 2: "Not enough words."
Features Implemented
✅ Backend Requirements

Express.js server
MongoDB integration (with fallback)
Word count calculation
Shared words detection
Case-insensitive comparison
Punctuation removal

✅ Frontend Requirements

React application
Two text input areas
Similarity check button
Results display
Word count display
Responsive design

✅ Constraints

Case insensitive matching
Punctuation removal
Minimum 10 words validation
Error handling

Error Handling

Network errors: Shows connection error message
Validation errors: Shows specific validation messages
Server errors: Shows generic error message
Database errors: Falls back to in-memory storage

Testing
Test the application with the provided examples:

High Similarity Test:

Text 1: "The quick brown fox jumps over the lazy dog in the park."
Text 2: "The quick brown fox jumps over the lazy dog in the garden."


Low Similarity Test:

Text 1: "Machine learning algorithms are revolutionizing data science and artificial intelligence applications."
Text 2: "Cooking delicious meals requires fresh ingredients and proper kitchen techniques for best results."



Contributing

Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Create a Pull Request

License
MIT License - see LICENSE file for details.
