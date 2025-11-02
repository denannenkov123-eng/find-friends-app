import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [filters, setFilters] = useState({
    maxDistance: 5,
    selectedInterests: [],
    onlineOnly: false
  });

  const allInterests = ['кофе', 'йога', 'спорт', 'книги', 'кино', 'музыка', 'путешествия', 'искусство', 'фотография', 'технологии'];

  const mockUsers = [
    {
      id: 1,
      name: "Анна",
      age: 25,
      bio: "Люблю кофе и йогу",
      avatar: "👩",
      distance: 0.5,
      interests: ["кофе", "йога", "путешествия"],
      online: true
    },
    {
      id: 2,
      name: "Максим", 
      age: 28,
      bio: "Фотограф и велосипедист",
      avatar: "👨",
      distance: 1.2,
      interests: ["фотография", "спорт", "искусство"],
      online: true
    },
    {
      id: 3,
      name: "София",
      age: 24,
      bio: "Книголюб и киноман",
      avatar: "👩",
      distance: 2.1,
      interests: ["книги", "кино", "кофе"],
      online: false
    },
    {
      id: 4,
      name: "Алексей",
      age: 26,
      bio: "Бегун и технолог",
      avatar: "👨",
      distance: 1.8,
      interests: ["спорт", "технологии", "музыка"],
      online: true
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    setCurrentUser({
      id: 0,
      name: "Вы",
      avatar: "😊"
    });

    setMessages({
      1: [
        { id: 1, text: "Привет! Как дела?", sender: 1, time: "12:30" },
        { id: 2, text: "Привет! Отлично, только с йоги", sender: 0, time: "12:32" }
      ],
      2: [
        { id: 1, text: "Здорово! Вижу ты тоже любишь фотографию", sender: 2, time: "11:15" }
      ]
    });
  }, []);

  useEffect(() => {
    let filtered = users.filter(user => {
      const distanceMatch = user.distance <= filters.maxDistance;
      const interestsMatch = filters.selectedInterests.length === 0 || 
        filters.selectedInterests.some(interest => user.interests.includes(interest));
      const onlineMatch = !filters.onlineOnly || user.online;
      
      return distanceMatch && interestsMatch && onlineMatch;
    });
    setFilteredUsers(filtered);
  }, [users, filters]);

  const handleInterestToggle = (interest) => {
    setFilters(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : [...prev.selectedInterests, interest]
    }));
  };

  const handleSendMessage = (userId) => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 0,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => ({
        ...prev,
        [userId]: [...(prev[userId] || []), message]
      }));
      
      setNewMessage('');
      
      setTimeout(() => {
        const autoReplies = [
          "Привет! Как твои дела?",
          "Здорово что написал!",
          "Сейчас занят, отвечу позже",
          "Интересно, расскажи подробнее!"
        ];
        const autoReply = {
          id: Date.now() + 1,
          text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
          sender: userId,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => ({
          ...prev,
          [userId]: [...(prev[userId] || []), autoReply]
        }));
      }, 2000);
    }
  };

  const SimpleMap = () => (
    <div className="simple-map">
      <div className="map-header">
        <h3>🗺️ Карта друзей</h3>
        <p>Наведите на маркеры для информации</p>
      </div>
      
      <div className="map-visual">
      <div className="map-point" style={{ top: '30%', left: '25%' }}>
          <span className="point-avatar">👩</span>
          <div className="point-info">Анна</div>
        </div>
        
        <div className="map-point" style={{ top: '50%', left: '60%' }}>
          <span className="point-avatar">👨</span>
          <div className="point-info">Максим</div>
        </div>
        
        <div className="map-point" style={{ top: '70%', left: '40%' }}>
          <span className="point-avatar">👩</span>
          <div className="point-info">София</div>
        </div>
        
        <div className="map-point" style={{ top: '40%', left: '75%' }}>
          <span className="point-avatar">👨</span>
          <div className="point-info">Алексей</div>
        </div>
        
        <div className="user-location" style={{ top: '50%', left: '50%' }}>
          <span className="point-avatar current">😊</span>
          <div className="point-info">Вы</div>
        </div>
      </div>
      
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color current"></span>
          <span>Вы</span>
        </div>
        <div className="legend-item">
          <span className="legend-color online"></span>
          <span>Онлайн</span>
        </div>
        <div className="legend-item">
          <span className="legend-color offline"></span>
          <span>Офлайн</span>
        </div>
      </div>
    </div>
  );

  const ChatWindow = () => {
    const user = users.find(u => u.id === activeChat);
    const chatMessages = messages[activeChat] || [];

    if (!user) return null;

    return (
      <div className="chat-window">
        <div className="chat-header">
          <button className="back-btn" onClick={() => setActiveChat(null)}>←</button>
          <div className="chat-user-info">
            <span className="avatar">{user.avatar}</span>
            <div>
              <h4>{user.name}</h4>
              <span className={`status ${user.online ? 'online' : 'offline'}`}>
                {user.online ? 'online' : 'offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {chatMessages.map(message => (
            <div key={message.id} className={`message ${message.sender === 0 ? 'sent' : 'received'}`}>
              <div className="message-bubble">
                {message.text}
                <span className="message-time">{message.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(activeChat)}
          />
          <button onClick={() => handleSendMessage(activeChat)}>📨</button>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header className="header">
        <h1>👋 Find Friends</h1>
        <p>Находите друзей рядом с вами</p>
      </header>

      <div className="main-content">
        <div className="sidebar">
          <div className="filters">
            <h3>🔍 Фильтры</h3>
            
            <div className="filter-group">
              <label>Расстояние: {filters.maxDistance} км</label>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={filters.maxDistance}
                onChange={(e) => setFilters(prev => ({...prev, maxDistance: Number(e.target.value)}))}
              />
            </div>

            <div className="filter-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={filters.onlineOnly}
                  onChange={(e) => setFilters(prev => ({...prev, onlineOnly: e.target.checked}))}
                />
                Только онлайн
              </label>
            </div>
            <div className="interests">
              <h4>Интересы:</h4>
              <div className="interest-tags">
                {allInterests.map(interest => (
                  <span 
                    key={interest}
                    className={`interest-tag ${filters.selectedInterests.includes(interest) ? 'active' : ''}`}
                    onClick={() => handleInterestToggle(interest)}
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="users-list">
            <h3>👥 Люди рядом ({filteredUsers.length})</h3>
            {filteredUsers.map(user => (
              <div 
                key={user.id} 
                className={`user-card ${user.online ? 'online' : 'offline'} ${activeChat === user.id ? 'active' : ''}`}
                onClick={() => setActiveChat(user.id)}
              >
                <div className="user-avatar">{user.avatar}</div>
                <div className="user-info">
                  <h4>{user.name}, {user.age}</h4>
                  <p>{user.bio}</p>
                  <div className="user-meta">
                    <span className="distance">📍 {user.distance} км</span>
                    <span className={`online ${user.online ? 'online' : 'offline'}`}>
                      {user.online ? '🟢 Онлайн' : '⚫ Офлайн'}
                    </span>
                  </div>
                </div>
                <button 
                  className="wave-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChat(user.id);
                  }}
                >
                  👋
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="map-container">
          <SimpleMap />
        </div>

        {activeChat && <ChatWindow />}
      </div>
    </div>
  );
}

export default App;