import React, { useState } from 'react';
import { quizApi } from '../services/api';
import './styles/CreateQuiz.css';

const CreateQuiz = ({ onSave, onClose }) => {
  const emptyQuestion = () => ({
    id: Date.now(), // Add unique id for React keys
    question: '',
    options: ['', '', '', ''],
    correctAnswer: null  // Initialize as null to force user selection
  });

  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    questions: [emptyQuestion()] // Use the function to create initial question
  });

  const [errors, setErrors] = useState({
    title: '',
    questions: []
  });

  // Update quiz title
  const updateTitle = (e) => {
    setQuiz({
      ...quiz,
      title: e.target.value
    });
  };

  // Update quiz description
  const updateDescription = (e) => {
    setQuiz({
      ...quiz,
      description: e.target.value
    });
  };

  // Update question text
  const updateQuestion = (id, value) => {
    const updatedQuestions = quiz.questions.map(q => {
      if (q.id === id) {
        return { ...q, question: value };
      }
      return q;
    });
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };

  // Update option text
  const updateOption = (questionId, optionIndex, value) => {
    const updatedQuestions = quiz.questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map((opt, i) => {
            if (i === optionIndex) {
              return value;
            }
            return opt;
          })
        };
      }
      return q;
    });
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };

  // Handle correct answer selection
  const updateCorrectAnswer = (questionId, optionIndex) => {
    console.log('Updating correct answer:', { questionId, optionIndex });
    const updatedQuestions = quiz.questions.map(q => {
      if (q.id === questionId) {
        return { ...q, correctAnswer: Number(optionIndex) }; // Convert to number immediately
      }
      return q;
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // Add new question
  const addNewQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, emptyQuestion()] // Use the function to create new question
    });
  };

  // Remove question
  const removeQuestion = (id) => {
    if (quiz.questions.length > 1) {
      const updatedQuestions = quiz.questions.filter(q => q.id !== id);
      setQuiz({
        ...quiz,
        questions: updatedQuestions
      });
    }
  };

  // Validate quiz data
  const validateQuiz = () => {
    console.log('Validating quiz:', quiz);
    const newErrors = {
      title: '',
      questions: []
    };
    let isValid = true;

    // Check title
    if (!quiz.title.trim()) {
      newErrors.title = 'Please enter a quiz title';
      isValid = false;
    }

    // Check each question
    quiz.questions.forEach((question, index) => {
      const questionErrors = [];
      
      // Check question text
      if (!question.question.trim()) {
        questionErrors.push('Please enter a question');
        isValid = false;
      }
      
      // Get valid (non-empty) options
      const validOptions = question.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        questionErrors.push('Please provide at least 2 valid options');
        isValid = false;
      }

      // Check for duplicate options
      const uniqueOptions = new Set(validOptions);
      if (uniqueOptions.size !== validOptions.length) {
        questionErrors.push('All options must be unique');
        isValid = false;
      }

      // Validate correct answer
      if (question.correctAnswer === null || 
          question.correctAnswer < 0 || 
          !question.options[question.correctAnswer]?.trim()) {
        questionErrors.push('Please select a valid correct answer');
        isValid = false;
      }

      newErrors.questions[index] = questionErrors.join(', ');
    });

    console.log('Validation result:', { isValid, errors: newErrors });
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateQuiz()) {
      try {
        // Format quiz data for API
        const quizData = {
          title: quiz.title.trim(),
          description: quiz.description.trim(),
          questions: quiz.questions.map(q => {
            // Get non-empty options
            const validOptions = q.options
              .map(opt => opt.trim())
              .filter(opt => opt !== '');
            
            return {
              question: q.question.trim(),
              options: validOptions,
              correctAnswer: Number(q.correctAnswer) // Ensure it's a number
            };
          })
        };

        console.log('Sending quiz data:', quizData);
        const savedQuiz = await quizApi.createQuiz(quizData);
        console.log('Quiz saved successfully:', savedQuiz);
        
        // Call onSave with the saved quiz data
        if (onSave) {
          onSave(savedQuiz);
        }
        
        // Reset form
        setQuiz({
          title: '',
          description: '',
          questions: [emptyQuestion()]
        });
        
        setErrors({
          title: '',
          questions: []
        });

        // Close the create quiz modal/form
        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error('Failed to save quiz:', error);
        alert('Failed to save quiz. Please try again.');
      }
    }
  };

  return (
    <div className="create-quiz">
      <div className="quiz-form">
        <h2>Create New Quiz</h2>
        
        {/* Quiz Title */}
        <div className="form-group">
          <label>Quiz Title:</label>
          <input
            type="text"
            value={quiz.title}
            onChange={updateTitle}
            placeholder="Enter quiz title"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        {/* Quiz Description */}
        <div className="form-group">
          <label>Description (Optional):</label>
          <textarea
            value={quiz.description}
            onChange={updateDescription}
            placeholder="Enter quiz description"
          />
        </div>

        {/* Questions */}
        {quiz.questions.map((question, questionIndex) => (
          <div key={question.id} className="question-container">
            <div className="question-header">
              <h3>Question {questionIndex + 1}</h3>
              {quiz.questions.length > 1 && (
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => removeQuestion(question.id)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Question:</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => updateQuestion(question.id, e.target.value)}
                placeholder="Enter question"
                className={errors.questions[questionIndex] ? 'error' : ''}
              />
              {errors.questions[questionIndex] && (
                <span className="error-text">{errors.questions[questionIndex]}</span>
              )}
            </div>

            {/* Options */}
            <div className="options-container">
              {question.options.map((option, optionIndex) => (
                <div key={`${question.id}-option-${optionIndex}`} className="option-group">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctAnswer === optionIndex}
                    onChange={() => updateCorrectAnswer(question.id, optionIndex)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="button-group">
          <button type="button" onClick={addNewQuestion}>Add Question</button>
          <button type="button" onClick={handleSubmit}>Save Quiz</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
