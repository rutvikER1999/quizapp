import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Question {
  type: 'MCQ' | 'Boolean' | 'text';
  question: string;
  options: string[] | boolean[] | string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

function TakeQuiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | boolean)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/quiz/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch quiz');
      }

      setQuiz(data.data.quiz);
      // Initialize answers array
      setAnswers(new Array(data.data.quiz.questions.length).fill(''));
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (value: string | boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/quiz/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit quiz');
      }

      // Navigate to results page with data
      navigate(`/quiz/${id}/results`, { state: data.data });
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz');
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
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
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasAnswer = answers[currentQuestionIndex] !== '';

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>{quiz.title}</h1>
        <p style={{ color: '#666' }}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </p>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
              height: '100%',
              backgroundColor: '#007bff',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

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

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem',
          backgroundColor: '#f9f9f9',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>
          {currentQuestion.question}
        </h2>

        {currentQuestion.type === 'MCQ' && Array.isArray(currentQuestion.options) && (
          <div>
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                style={{
                  display: 'block',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  border: '2px solid',
                  borderColor: answers[currentQuestionIndex] === option ? '#007bff' : '#ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: answers[currentQuestionIndex] === option ? '#e7f3ff' : 'white',
                }}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option as string}
                  checked={answers[currentQuestionIndex] === option}
                  onChange={() => handleAnswerChange(option as string)}
                  style={{ marginRight: '0.5rem' }}
                />
                {option}
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === 'Boolean' && (
          <div>
            {[true, false].map((value) => (
              <label
                key={String(value)}
                style={{
                  display: 'block',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  border: '2px solid',
                  borderColor: answers[currentQuestionIndex] === value ? '#007bff' : '#ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: answers[currentQuestionIndex] === value ? '#e7f3ff' : 'white',
                }}
              >
                <input
                  type="radio"
                  name="answer"
                  checked={answers[currentQuestionIndex] === value}
                  onChange={() => handleAnswerChange(value)}
                  style={{ marginRight: '0.5rem' }}
                />
                {String(value)}
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === 'text' && (
          <input
            type="text"
            value={answers[currentQuestionIndex] as string}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your answer"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box' as const,
            }}
          />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Cancel
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!hasAnswer}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: hasAnswer ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: hasAnswer ? 'pointer' : 'not-allowed',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: hasAnswer ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: hasAnswer ? 'pointer' : 'not-allowed',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default TakeQuiz;

