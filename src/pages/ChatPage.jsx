import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DEMO_USERS_LIST, CHAT_MESSAGES, getAvatarColor } from '../data/demoData';
import { HiPaperAirplane, HiDotsVertical, HiSearch, HiPhone, HiVideoCamera } from 'react-icons/hi';

const chatContacts = DEMO_USERS_LIST.filter(u => ['user-1', 'user-2', 'user-4', 'user-7'].includes(u.uid));

export default function ChatPage() {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState(chatContacts[1]); // Marcus
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [newMsg, setNewMsg] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const msg = {
      id: Date.now(),
      senderId: user?.uid || 'demo-user-1',
      text: newMsg.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, msg]);
    setNewMsg('');

    // Simulate reply after 1.5s
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        senderId: selectedContact.uid,
        text: getAutoReply(),
        timestamp: new Date().toISOString(),
      }]);
    }, 1500);
  };

  const getAutoReply = () => {
    const replies = [
      "That's awesome! Let's schedule our next session 🎯",
      "Great progress! Keep practicing 💪",
      "I have some resources to share with you 📚",
      "Looking forward to our next swap! 🤝",
      "You're leveling up fast! 🚀",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fade-in h-[calc(100vh-7rem)] lg:h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 flex glass-card overflow-hidden">
        {/* Contacts Sidebar */}
        <div className={`${showContacts ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 border-r border-white/10 bg-navy-900/50 absolute md:relative z-10 h-full`}>
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white mb-3">Messages</h2>
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full bg-navy-800 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric transition-colors text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatContacts.map(contact => (
              <button
                key={contact.uid}
                onClick={() => { setSelectedContact(contact); setShowContacts(false); }}
                className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors border-none cursor-pointer text-left ${
                  selectedContact.uid === contact.uid ? 'bg-electric/10 border-r-2 border-r-electric' : ''
                }`}
              >
                <div className="relative shrink-0">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: getAvatarColor(contact.displayName) }}
                  >
                    {contact.displayName.charAt(0)}
                  </div>
                  {contact.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-neon-green rounded-full border-2 border-navy-900" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{contact.displayName}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {contact.online ? 'Online' : 'Offline'} • {contact.city}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 bg-navy-900/30">
            <button
              onClick={() => setShowContacts(!showContacts)}
              className="md:hidden text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-1"
            >
              ☰
            </button>
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: getAvatarColor(selectedContact.displayName) }}
              >
                {selectedContact.displayName.charAt(0)}
              </div>
              {selectedContact.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green rounded-full border-2 border-navy-900" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{selectedContact.displayName}</p>
              <p className="text-xs text-gray-500">{selectedContact.online ? '🟢 Online' : '⚫ Offline'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                <HiPhone size={18} />
              </button>
              <button className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                <HiVideoCamera size={18} />
              </button>
              <button className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                <HiDotsVertical size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-center text-xs text-gray-600 my-4">Today</div>
            {messages.map(msg => {
              const isMe = msg.senderId === (user?.uid || 'demo-user-1');
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                      ? 'bg-electric text-white rounded-br-md'
                      : 'bg-white/10 text-gray-200 rounded-bl-md'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-white/10 flex items-center gap-3">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-navy-800 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-electric transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={!newMsg.trim()}
              className="w-11 h-11 rounded-xl bg-electric flex items-center justify-center text-white hover:bg-electric-dark transition-colors disabled:opacity-50 border-none cursor-pointer shrink-0"
            >
              <HiPaperAirplane size={18} className="rotate-90" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
