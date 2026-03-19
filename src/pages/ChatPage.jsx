import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarColor } from '../utils/constants';
import { HiPaperAirplane, HiDotsVertical, HiSearch, HiPhone, HiVideoCamera } from 'react-icons/hi';
import { subscribeToChats, subscribeToMessages, sendMessage, markChatAsRead, subscribeToUsersPresence } from '../services/chatService';

export default function ChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [presenceMap, setPresenceMap] = useState({});
  const messagesEndRef = useRef(null);

  // Subscribe to all chats & online status
  useEffect(() => {
    if (!user?.uid) return;
    
    const unsubscribeChats = subscribeToChats(user.uid, (fetchedChats) => {
        setChats(fetchedChats);
    });

    const unsubscribePresence = subscribeToUsersPresence((map) => {
        setPresenceMap(map);
    });

    return () => {
        unsubscribeChats();
        unsubscribePresence();
    };
  }, [user]);

  // Subscribe to messages in the active chat
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }

    const unsubscribeMessages = subscribeToMessages(selectedChatId, (fetchedMessages) => {
        setMessages(fetchedMessages);
    });

    // Mark chat as read
    if (user?.uid) {
        markChatAsRead(selectedChatId, user.uid).catch(console.error);
    }

    return () => unsubscribeMessages();
  }, [selectedChatId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedChatId || !user?.uid) return;
    
    const text = newMsg.trim();
    setNewMsg(''); // Optimistic clear
    
    try {
        await sendMessage(selectedChatId, user.uid, user.displayName, text);
    } catch (error) {
        console.error("Failed to send message:", error);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUserOnline = (dateStr) => {
      if (!dateStr) return false;
      const date = new Date(dateStr);
      // Online if lastseen within 5 minutes
      return (new Date() - date) < 5 * 60 * 1000;
  };

  // Filter chats by search
  const filteredChats = chats.filter(chat => {
      const otherParticipantId = chat.participants.find(p => p !== user?.uid);
      const otherName = chat.participantNames?.[otherParticipantId] || 'User';
      return otherName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedChatData = chats.find(c => c.id === selectedChatId);
  let otherParticipantId = null;
  let otherParticipantName = 'Loading...';
  let otherParticipantAvatar = null;
  let isOtherOnline = false;

  if (selectedChatData && user?.uid) {
      otherParticipantId = selectedChatData.participants.find(p => p !== user.uid);
      otherParticipantName = selectedChatData.participantNames?.[otherParticipantId] || 'User';
      otherParticipantAvatar = selectedChatData.participantAvatars?.[otherParticipantId];
      isOtherOnline = isUserOnline(presenceMap[otherParticipantId]);
  }

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-800 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric transition-colors text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map(chat => {
              const otherId = chat.participants.find(p => p !== user?.uid);
              const otherName = chat.participantNames?.[otherId] || 'User';
              const isOnline = isUserOnline(presenceMap[otherId]);
              const unreadCount = chat.unreadCount?.[user?.uid] || 0;

              return (
                <button
                  key={chat.id}
                  onClick={() => { 
                      setSelectedChatId(chat.id); 
                      setShowContacts(false); 
                      if(unreadCount > 0 && user?.uid) markChatAsRead(chat.id, user.uid);
                  }}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors border-none cursor-pointer text-left ${
                    selectedChatId === chat.id ? 'bg-electric/10 border-r-2 border-r-electric' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: getAvatarColor(otherName) }}
                    >
                      {otherName.charAt(0)}
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-neon-green rounded-full border-2 border-navy-900" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold text-white truncate pr-2">{otherName}</p>
                        {chat.lastMessageTimestamp && (
                            <span className="text-[10px] text-gray-500 shrink-0">
                                {formatTime(chat.lastMessageTimestamp?.toDate ? chat.lastMessageTimestamp.toDate() : chat.lastMessageTimestamp)}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <p className="text-xs text-gray-400 truncate flex-1">
                          {chat.lastMessage}
                        </p>
                        {unreadCount > 0 && (
                            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                                {unreadCount}
                            </div>
                        )}
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredChats.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500">
                    No conversations yet. Go to Explore to find swap partners!
                </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChatId ? (
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
                    style={{ background: getAvatarColor(otherParticipantName) }}
                >
                    {otherParticipantName.charAt(0)}
                </div>
                {isOtherOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green rounded-full border-2 border-navy-900" />
                )}
                </div>
                <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{otherParticipantName}</p>
                <p className="text-xs text-gray-500">{isOtherOnline ? '🟢 Online' : '⚫ Offline'}</p>
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
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-gray-500">
                        Start the conversation!
                    </div>
                ) : (
                    <>
                        {messages.map((msg, i) => {
                            const isMe = msg.senderId === user?.uid;
                            // Show 'Today' only once or simple date split (simplified here)
                            const showDateDivider = i === 0 || new Date(msg.timestamp).toDateString() !== new Date(messages[i-1].timestamp).toDateString();

                            return (
                                <div key={msg.id || i}>
                                    {showDateDivider && (
                                        <div className="text-center text-xs text-gray-600 my-4">
                                            {new Date(msg.timestamp).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </div>
                                    )}
                                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}>
                                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                        isMe
                                            ? 'bg-electric text-white rounded-br-sm'
                                            : 'bg-navy-800 text-gray-100 border border-white/5 rounded-bl-sm'
                                        }`}>
                                        <p className="whitespace-pre-wrap word-break-words">{msg.text}</p>
                                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                                            {formatTime(msg.timestamp)}
                                        </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex items-center gap-3 bg-navy-900/50">
                <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-navy-950 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-electric transition-colors text-sm"
                />
                <button
                type="submit"
                disabled={!newMsg.trim() || !user}
                className="w-11 h-11 rounded-xl bg-electric flex items-center justify-center text-white hover:bg-electric-dark transition-all disabled:opacity-50 border-none cursor-pointer shrink-0 shadow-lg"
                >
                <HiPaperAirplane size={18} className="rotate-90" />
                </button>
            </form>
            </div>
        ) : (
            /* No Chat Selected State */
            <div className="flex-1 hidden md:flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-navy-800 border border-white/5 flex items-center justify-center mb-6 shadow-xl">
                    <HiPaperAirplane size={32} className="text-gray-600 rotate-45 -ml-1" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your Messages</h3>
                <p className="text-gray-500 max-w-sm">
                    Select a conversation from the sidebar to view messages or start a new chat with a skill provider.
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
