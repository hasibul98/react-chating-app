import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
function Header({ user }) {
  const navigate = useNavigate();
  const exitUser = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };
  const showButton = () => {
    return (
      <button onClick={exitUser} className='sign-out-button'>
        Sign out
      </button>
    );
  };
  return (
    <div className='chat-header'>
      <h2>Chat Room</h2>
      <div className='user-info'>
        <span>Welcome, {user ? user.email : "Guest user"}</span>
        {user ? showButton() : ""}
      </div>
    </div>
  );
}

export default Header;
