// Import mongoose to create database models
const mongoose = require('mongoose');

// Create the Question schema (database structure)
const QuestionSchema = new mongoose.Schema({
  // The question text
  question: {
    type: String,
    required: true,
    trim: true
  },
  // Array of possible answers
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(options) {
        return Array.isArray(options) && options.length >= 2;
      },
      message: 'At least 2 options are required'
    }
  },
  // The correct answer
  correctAnswer: {
    type: Number,
    required: true,
    min: 0
  }
});

// Create the Quiz schema (database structure)
const QuizSchema = new mongoose.Schema({
  // Title of the quiz - Required field
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Description of the quiz - Optional field
  description: {
    type: String,
    default: '',
    trim: true
  },
  // Quiz status - Can be 'active' or 'inactive'
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  // Array of questions in the quiz
  questions: {
    type: [QuestionSchema],
    required: true,
    validate: {
      validator: function(questions) {
        return Array.isArray(questions) && questions.length > 0;
      },
      message: 'At least one question is required'
    }
  },
  // When the quiz was created - Automatically set
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'quizzes' // This ensures the collection is named 'quizzes'
});

// Create and export the Quiz model
module.exports = mongoose.model('Quiz', QuizSchema);
