import React from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import './MainPage.css';

function CharacterCard({ character }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/chat', { state: { character } });
  };

  return ( 
      <div className="character-card" onClick={handleClick}>
        <img src={`/${character}.png`} alt={character} className="doraemon-image" />
        <button className="chat-button">Chat with {character}</button>
      </div>
    
  );
}

function MainPage() {
  const characters = ['doraemon', 'ironman','HelloKitty'];
  return (
    <div className="main-page">
      {characters.map((character, index) => (
        <CharacterCard key={index} character={character} />
      ))}
    </div>
  );
}

export default MainPage;