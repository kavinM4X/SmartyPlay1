const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    console.log('Creating new quiz:', req.body);

    // Basic validation
    if (!req.body.title?.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!Array.isArray(req.body.questions) || req.body.questions.length === 0) {
      return res.status(400).json({ error: 'At least one question is required' });
    }

    // Create quiz object
    const quizData = {
      title: req.body.title.trim(),
      description: req.body.description?.trim() || '',
      status: 'active',
      questions: req.body.questions.map(q => ({
        question: q.question.trim(),
        options: q.options.map(opt => opt.trim()),
        correctAnswer: Number(q.correctAnswer)
      }))
    };

    const newQuiz = new Quiz(quizData);
    const savedQuiz = await newQuiz.save();
    console.log('Quiz saved successfully:', savedQuiz);
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort('-createdAt');
    res.json(quizzes);
  } catch (error) {
    console.error('Error getting quizzes:', error);
    res.status(500).json({ error: 'Failed to get quizzes' });
  }
});

// Get a specific quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    console.error('Error getting quiz:', error);
    res.status(500).json({ error: 'Failed to get quiz' });
  }
});

// Update quiz status
router.put('/:id/status', async (req, res) => {
  try {
    console.log('Updating quiz status:', { id: req.params.id, status: req.body.status });
    
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['active', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Find and update the quiz
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!quiz) {
      console.log('Quiz not found:', req.params.id);
      return res.status(404).json({ error: 'Quiz not found' });
    }

    console.log('Quiz status updated:', quiz);
    res.json(quiz);
  } catch (error) {
    console.error('Error updating quiz status:', error);
    res.status(500).json({ error: 'Failed to update quiz status' });
  }
});

// Update a quiz
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    console.log('Updating quiz:', { id: req.params.id, updates });

    // Find and update the quiz
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!quiz) {
      console.log('Quiz not found:', req.params.id);
      return res.status(404).json({ error: 'Quiz not found' });
    }

    console.log('Quiz updated:', quiz);
    res.json(quiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// Delete a quiz
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

module.exports = router;
