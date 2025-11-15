import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type QuestionType = 'MCQ' | 'Boolean' | 'text';

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: string[] | boolean[] | string;
  answer: string | boolean;
}

function CreateQuiz() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Date.now().toString(),
      type: 'MCQ',
      question: '',
      options: ['', ''],
      answer: ''
    }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Date.now().toString() + Math.random(),
      type: 'MCQ',
      question: '',
      options: ['', ''],
      answer: ''
    }]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        if (field === 'type') {
          // Reset options and answer when type changes
          const newType = value as QuestionType;
          let newOptions: string[] | boolean[] | string;
          let newAnswer: string | boolean;

          if (newType === 'MCQ') {
            newOptions = ['', ''];
            newAnswer = '';
          } else if (newType === 'Boolean') {
            newOptions = [true, false] as boolean[];
            newAnswer = true;
          } else {
            newOptions = '';
            newAnswer = '';
          }

          return { ...q, type: newType, options: newOptions, answer: newAnswer } as Question;
        }
        return { ...q, [field]: value } as Question;
      }
      return q;
    }));
  };

  const updateOption = (id: string, index: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === id && Array.isArray(q.options) && typeof q.options[0] === 'string') {
        const newOptions = [...(q.options as string[])];
        newOptions[index] = value;
        return { ...q, options: newOptions } as Question;
      }
      return q;
    }));
  };

  const addOption = (id: string) => {
    setQuestions(questions.map(q => {
      if (q.id === id && Array.isArray(q.options) && typeof q.options[0] === 'string') {
        return { ...q, options: [...(q.options as string[]), ''] } as Question;
      }
      return q;
    }));
  };

  const removeOption = (id: string, index: number) => {
    setQuestions(questions.map(q => {
      if (q.id === id && Array.isArray(q.options) && typeof q.options[0] === 'string' && q.options.length > 2) {
        const newOptions = (q.options as string[]).filter((_, i) => i !== index);
        return { ...q, options: newOptions } as Question;
      }
      return q;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate questions
      const validQuestions = questions.filter(q => {
        if (!q.question || (typeof q.question === 'string' && !q.question.trim())) return false;
        if (q.type === 'MCQ' && Array.isArray(q.options)) {
          const filledOptions = q.options.filter(opt => typeof opt === 'string' && opt.trim() !== '');
          if (filledOptions.length < 2) return false;
          if (!q.answer) return false;
        }
        if (q.type === 'text' && (!q.answer || (typeof q.answer === 'string' && !q.answer.trim()))) return false;
        return true;
      });

      if (validQuestions.length === 0) {
        setError('Please add at least one valid question');
        setIsSubmitting(false);
        return;
      }

      // Prepare questions for API (remove id field)
      const questionsForAPI = validQuestions.map(q => ({
        type: q.type,
        question: q.question,
        options: q.options,
        answer: q.answer,
      }));

      const response = await fetch(`${API_URL}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: quizTitle,
          questions: questionsForAPI,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create quiz');
      }

      // Reset form
      setQuizTitle('');
      setQuestions([{
        id: Date.now().toString(),
        type: 'MCQ',
        question: '',
        options: ['', ''],
        answer: ''
      }]);

      // Navigate to home
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box' as const
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold'
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Create Quiz</h1>
      
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

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="quizTitle" style={labelStyle}>
            Quiz Title:
          </label>
          <input
            id="quizTitle"
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
            required
            style={inputStyle}
          />
        </div>

        {questions.map((q, qIndex) => (
          <div
            key={q.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Question {qIndex + 1}</h3>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => setQuestions(questions.filter(question => question.id !== q.id))}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Question Type:</label>
              <select
                value={q.type}
                onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                style={inputStyle}
              >
                <option value="MCQ">MCQ</option>
                <option value="Boolean">Boolean</option>
                <option value="text">Text</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Question Text:</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                placeholder="Enter question"
                required
                style={inputStyle}
              />
            </div>

            {q.type === 'MCQ' && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={labelStyle}>Options:</label>
                  <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Add Option
                  </button>
                </div>
                {Array.isArray(q.options) && q.options.map((option, oIndex) => (
                  <div key={oIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={option as string}
                      onChange={(e) => updateOption(q.id, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      required
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(q.id, oIndex)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {q.type === 'Boolean' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Options:</label>
                <div style={{ padding: '0.5rem', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                  <div>True / False</div>
                </div>
              </div>
            )}

            {q.type === 'text' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Expected Answer Format:</label>
                <div style={{ padding: '0.5rem', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                  Text Input
                </div>
              </div>
            )}

            <div>
              <label style={labelStyle}>Correct Answer:</label>
              {q.type === 'MCQ' && (
                <select
                  value={q.answer as string}
                  onChange={(e) => updateQuestion(q.id, 'answer', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">Select correct answer</option>
                  {Array.isArray(q.options) && q.options.map((option, oIndex) => (
                    <option key={oIndex} value={option as string}>
                      {option || `Option ${oIndex + 1}`}
                    </option>
                  ))}
                </select>
              )}

              {q.type === 'Boolean' && (
                <select
                  value={q.answer.toString()}
                  onChange={(e) => updateQuestion(q.id, 'answer', e.target.value === 'true')}
                  style={inputStyle}
                  required
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              )}

              {q.type === 'text' && (
                <input
                  type="text"
                  value={q.answer as string}
                  onChange={(e) => updateQuestion(q.id, 'answer', e.target.value)}
                  placeholder="Enter the correct answer"
                  required
                  style={inputStyle}
                />
              )}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={addQuestion}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Add Question
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {isSubmitting ? 'Creating Quiz...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateQuiz;
