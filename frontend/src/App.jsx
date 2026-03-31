import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import PostList from './pages/PostList.jsx';
import PostDetail from './pages/PostDetail.jsx';
import NewPost from './pages/NewPost.jsx';

const Protected = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 1rem' }}>
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/posts"     element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/new-post"  element={<Protected><NewPost /></Protected>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}