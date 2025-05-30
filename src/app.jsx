import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/header';
import Footer from './components/footer';
import Home from './components/home';
import Login from './components/login';
import Register from './components/register';
import Profile from './components/profile';
import About from './components/about';
import Contact from './components/contact';
import Terms from './components/terms';
import Privacy from './components/privacy';
import Events from './components/Events';
import ForgotPassword from './components/forgotpassword';
import ResetPassword from './components/resetpassword';
import CreateEvent from './components/createevent';
import AdminDashboard from './components/admin/AdminDashboard';
import EventDetails from './components/eventdetails'; 
import ScrollToTop from './components/ScrollToTop';
import './app.css';

// Componente para proteger a rota de login
function ProtectedLogin() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return isLoggedIn ? <Navigate to="/profile" /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<ProtectedLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/events" element={<Events />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;