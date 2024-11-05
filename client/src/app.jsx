import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BookList from './components/books/BookList';
import AddBook from './components/books/AddBook';
import BookDetails from './components/books/BookDetails';
import UserProfile from './components/profile/UserProfile';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LoadingProvider>
          <Router>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 ml-64 p-8 bg-gray-50">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  <Route path="/" element={
                    <ProtectedRoute>
                      <BookList />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/add-book" element={
                    <ProtectedRoute>
                      <AddBook />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/books/:id" element={
                    <ProtectedRoute>
                      <BookDetails />
                    </ProtectedRoute>
                  } />

                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
          </Router>
        </LoadingProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;