import { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  console.log(messages);
  // console.log(onSnapshot);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // console.log("Snapshot:", snapshot);

      const docs = snapshot.docs.map((doc) => {
        console.log("Raw doc:", doc);
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      console.log("Mapped Docs:", docs);
      setMessages(docs);
      console.log(messages);
    });
    return () => unsubscribe();
  }, []);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.email,
      photoURL: user.photoURL || null,
    });
    setNewMessage("");
  };

  return (
    <div className='chat-room'>
      <div className='messages-container' style={{ marginBottom: "100px" }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.uid === user.uid ? "sent" : "received"
            }`}
          >
            <div className='message-info'>
              <span className='sender'>{message.displayName}</span>
              <span className='timestamp'>
                {message.createdAt?.toDate().toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </span>
              <div className='message-text'>{message.text}</div>
            </div>
            <div ref={messagesEndRef}></div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className='message-form'>
        <input
          type='text'
          placeholder='Tpe a message...'
          className='message-input'
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button type='submit' className='send-button'>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
