import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./ProtectedRoute";
import ChatRoom from "./components/ChatRoom";
import Header from "./components/Header";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(user);
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='App'>
      <BrowserRouter>
        <Header user={user} />
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <ChatRoom user={user} />
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={<LoginForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
