import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateQuiz from './pages/CreateQuiz'
import TakeQuiz from './pages/TakeQuiz'
import QuizResults from './pages/QuizResults'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{
      padding: '1rem 2rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link
          to="/"
          style={{
            marginRight: '1.5rem',
            textDecoration: 'none',
            color: '#007bff',
            fontWeight: 'bold'
          }}
        >
          Home
        </Link>
        {isAuthenticated && (
          <Link
            to="/create-quiz"
            style={{
              textDecoration: 'none',
              color: '#007bff',
              fontWeight: 'bold'
            }}
          >
            Create Quiz
          </Link>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated ? (
          <>
            <span style={{ color: '#666' }}>{user?.name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              textDecoration: 'none',
              color: '#007bff',
              fontWeight: 'bold'
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/create-quiz"
            element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route path="/quiz/:id" element={<TakeQuiz />} />
          <Route path="/quiz/:id/results" element={<QuizResults />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
