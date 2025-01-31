import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Quiz related API calls
export const quizApi = {
    // Create a new quiz
    createQuiz: async (quizData) => {
        try {
            const response = await apiClient.post('/quizzes', quizData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to create quiz' };
        }
    },

    // Get all quizzes
    getAllQuizzes: async () => {
        try {
            const response = await apiClient.get('/quizzes');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch quizzes' };
        }
    },

    // Get a specific quiz by ID
    getQuizById: async (quizId) => {
        try {
            const response = await apiClient.get(`/quizzes/${quizId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch quiz' };
        }
    },

    // Update a quiz
    updateQuiz: async (quizId, updates) => {
        try {
            // If only status is being updated, use the status endpoint
            if (Object.keys(updates).length === 1 && 'status' in updates) {
                const response = await apiClient.put(`/quizzes/${quizId}/status`, updates);
                return response.data;
            }
            
            // Otherwise, do a full quiz update
            const response = await apiClient.put(`/quizzes/${quizId}`, updates);
            return response.data;
        } catch (error) {
            console.error('Update quiz error:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Failed to update quiz' };
        }
    },

    // Delete a quiz
    deleteQuiz: async (quizId) => {
        try {
            const response = await apiClient.delete(`/quizzes/${quizId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to delete quiz' };
        }
    }
};
