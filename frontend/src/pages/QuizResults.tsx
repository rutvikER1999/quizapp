import { useParams, useNavigate, useLocation } from 'react-router-dom';

interface ResultItem {
  question: string;
  type: 'MCQ' | 'Boolean' | 'text';
  options: string[] | boolean[] | string;
  correctAnswer: string | boolean;
  userAnswer: string | boolean;
  isCorrect: boolean;
}

interface ResultsData {
  quizId: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  results: ResultItem[];
}

function QuizResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const resultsData = location.state as ResultsData | null;

  if (!resultsData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>No results data found.</p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  const { quizTitle, totalQuestions, correctAnswers, wrongAnswers, score, results } = resultsData;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Quiz Results</h1>
      <h2 style={{ color: '#666', marginBottom: '2rem' }}>{quizTitle}</h2>

      {/* Score Summary */}
      <div
        style={{
          border: '2px solid #007bff',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '2rem',
          backgroundColor: '#f0f8ff',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#007bff', marginBottom: '0.5rem' }}>
          {score.toFixed(1)}%
        </div>
        <div style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
          You got {correctAnswers} out of {totalQuestions} questions correct
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
              {correctAnswers}
            </div>
            <div style={{ color: '#666' }}>Correct</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>
              {wrongAnswers}
            </div>
            <div style={{ color: '#666' }}>Wrong</div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <h3 style={{ marginBottom: '1rem' }}>Question Review</h3>
      {results.map((result, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            backgroundColor: result.isCorrect ? '#f0fff4' : '#fff5f5',
            borderLeft: `4px solid ${result.isCorrect ? '#28a745' : '#dc3545'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'start', marginBottom: '1rem' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: result.isCorrect ? '#28a745' : '#dc3545',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                marginRight: '1rem',
                flexShrink: 0,
              }}
            >
              {result.isCorrect ? '✓' : '✗'}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>
                Question {index + 1}: {result.question}
              </h4>

              {result.type === 'MCQ' && Array.isArray(result.options) && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Options:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    {result.options.map((opt, optIndex) => (
                      <li key={optIndex} style={{ color: '#666' }}>
                        {String(opt)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#28a745' }}>Correct Answer: </strong>
                <span>{String(result.correctAnswer)}</span>
              </div>

              <div>
                <strong style={{ color: result.isCorrect ? '#28a745' : '#dc3545' }}>
                  Your Answer: 
                </strong>
                <span>{String(result.userAnswer)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginRight: '1rem',
          }}
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate(`/quiz/${id}`)}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          Retake Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizResults;

