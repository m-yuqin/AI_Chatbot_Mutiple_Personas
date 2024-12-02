import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Chatbot.css';

function Chatbot() {
  
  //const welcomeMsg = "Hello, I'm Doremon. a friendly robot cat from the future.I am helpful, curious, and always ready to assist with a smile. I respond in a childlike and enthusiastic manner.How can I help you?"
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isEnterPressed, setIsEnterPressed] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const { character } = location.state;
 
  useEffect(() => {
    const welcomeMessages = {
      doraemon: "Hello, I'm Doremon. a friendly robot cat from the future.I am helpful, curious, and always ready to assist with a smile. I respond in a childlike and enthusiastic manner.How can I help you?",
      HelloKitty: "Hellom I am Hello Kitty, the happiest little robot cat in the whole wide world! Let's be best friends and have lots of fun together! I love cute things, yummy treats, and making everyone smile. Tell me what you're up to today, or maybe you want to talk about your favorite things? 🎀💖",
      ironman: "Listen up, world. I'm Iron Man robot. Genius, billionaire, playboy, philanthropist. Got a problem? Need a solution? I'm your guy. Don't waste my time with small talk. Let's get down to business.",
      
    };
  
    const welcomeMessage = welcomeMessages[character] || 'Welcome!';
    setMessages([{ role: 'bot', content: welcomeMessage }]);

  }, [character]);

 

  const handleKeyDown = (event) => {
    
    if (event.key === 'Enter' && event.shiftKey==false) {
      setIsEnterPressed(true);
      return handleSubmit(event);
    }
    else{
      setIsEnterPressed(false);
    }
    
  };

   const handleInputChange = (e) => {
    setUserInput(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  //Initializes the textarea height on component mount.
  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollTo(0, messagesEndRef.current.scrollHeight);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput) return;

    const userMessage = { role: 'user', content: userInput };
    //setMessages([...messages, userMessage]);
    setMessages(prevState => [...prevState, userMessage]);
    setUserInput('');
    

    try {
      //const response = await axios.post('http://localhost:5000/chat', { message: userInput });
      const response = await axios.post('http://localhost:5000/chat', { message: userInput,character });
      const botMessage = { role: 'bot', content: response.data.response };
      console.log("BotMessage: " + botMessage.content);
      //So that it saves all the previous messages also.
      setMessages(prevState => [...prevState, botMessage]);
    } catch (error) {
      console.error(error);
    }

    setIsEnterPressed(false); // Reset the button state after submission
    scrollToBottom();
  };

  useEffect(() => {
    console.log("Messages:");
    console.log(messages);
  }, [messages]);

  return (
    <div className="app-container">
      <header className="chat-header">
      <h1>My Chat Bot</h1>
      </header>
      <div className="chat-content">
        <div className="chat-container">
          <div className="chat-messages" ref={messagesEndRef}>
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                {message.role === 'user' && <div className="message-prompt">{message.content}</div>}
                {message.role === 'bot' && <div className="message-response">{message.content}</div>}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <textarea ref={textareaRef} value={userInput} onChange={handleInputChange} onKeyDown={handleKeyDown} />
            <button type="submit" className={`send-button ${isEnterPressed ? 'active' : ''}`}>Send</button>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default Chatbot;
