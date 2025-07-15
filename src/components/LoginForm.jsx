import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const exitUser = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  if (user) {
    return <button onClick={exitUser}>Sign out</button>;
  }
  if (loading) {
    return (
      <div style={{ height: "100%", textaligh: "center" }}>Loading...</div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Sign out the user after signup so they can login manually
        await signOut(auth);
        setIsSignUp(false); // Switch to login form
        setEmail("");
        setPassword("");
        setError("Account created successfully. Please login.");
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className='wrapper'>
      <div className='form'>
        <h1 className='title'>Chat Application</h1>
        <form onSubmit={handleSubmit}>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input'
            placeholder='email'
            required
          />
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input'
            placeholder='password'
            required
          />
          <div align='center'>
            <button type='submit' className='button'>
              <span>{isSignUp ? "sign Up" : "sign In"}</span>
            </button>
          </div>
        </form>
        <p>
          {isSignUp ? "Already have an account?" : "Don't have an account"}
          <button
            type='button'
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              backgroun: "none",
              border: "none",
              color: "blue",
              cursor: "pointer",
            }}
          >
            {isSignUp ? "Sign In " : "sign Up"}
          </button>
          {error && <h1 style={{ color: "red" }}>{error}</h1>}
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
