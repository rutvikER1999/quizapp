import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Quiz {
  id: string;
  title: string;
  questionsCount: number;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/quiz`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch quizzes');
      }

      setQuizzes(data.data.quizzes || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Welcome to Quiz App</h1>
      {isAuthenticated && user && (
        <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#666' }}>
          Welcome, {user.name}!
        </p>
      )}
      <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
        {isAuthenticated ? 'Create and manage your quizzes' : 'Browse and take quizzes'}
      </p>

      {isAuthenticated && (
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to="/create-quiz"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginRight: '1rem'
            }}
          >
            Create Quiz
          </Link>
        </div>
      )}

      {!isAuthenticated && (
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to="/login"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            Login
          </Link>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h2>Available Quizzes</h2>
        
        {isLoading && (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading quizzes...</p>
        )}

        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
              marginBottom: '1rem',
              border: '1px solid #f5c6cb',
            }}
          >
            {error}
          </div>
        )}

        {!isLoading && !error && quizzes.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No quizzes available yet. {isAuthenticated && 'Create one to get started!'}
          </p>
        )}

        {!isLoading && !error && quizzes.length > 0 && (
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{quiz.title}</h3>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                  {quiz.questionsCount} {quiz.questionsCount === 1 ? 'question' : 'questions'}
                </p>
                <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Created by {quiz.createdBy.name}
                </p>
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
