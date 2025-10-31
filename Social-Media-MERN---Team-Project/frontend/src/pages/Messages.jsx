import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  MessageCircle,
} from 'lucide-react';

const Messages = () => {
  const user = useSelector((state) => state.user.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Mock conversations
  const conversations = [
    {
      _id: 1,
      name: 'Sarah Designer',
      username: 'sarahdesigner',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastMessage: 'That design looks amazing!',
      unread: 2,
      timestamp: '2 min ago',
      online: true,
    },
    {
      _id: 2,
      name: 'John Developer',
      username: 'johndeveloper',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'Let me check the code...',
      unread: 0,
      timestamp: '1 hour ago',
      online: true,
    },
    {
      _id: 3,
      name: 'Mike Chen',
      username: 'mikechen',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'Thanks for the photos!',
      unread: 0,
      timestamp: '3 hours ago',
      online: false,
    },
    {
      _id: 4,
      name: 'Emma Wilson',
      username: 'emmaw',
      avatar: 'https://i.pravatar.cc/150?img=4',
      lastMessage: 'See you at the meetup!',
      unread: 0,
      timestamp: 'Yesterday',
      online: false,
    },
  ];

  // Mock messages
  const messages = selectedChat ? [
    { id: 1, sender: 'other', text: 'Hey! How are you?', timestamp: '10:30 AM' },
    { id: 2, sender: 'user', text: "I'm good! Working on a new project", timestamp: '10:32 AM' },
    { id: 3, sender: 'other', text: 'That sounds cool! Tell me more', timestamp: '10:33 AM' },
    { id: 4, sender: 'user', text: "Will do! Let's catch up later", timestamp: '10:34 AM' },
    { id: 5, sender: 'other', text: 'Perfect! 😊', timestamp: '10:35 AM' },
  ] : [];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Add message sending logic here
      setMessageInput('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white">
      {/* Conversations Sidebar */}
      <div
        className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${
          selectedChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation._id}
              onClick={() => setSelectedChat(conversation)}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-all border-b border-gray-50 ${
                selectedChat?._id === conversation._id ? 'bg-blue-50' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900 truncate">
                    {conversation.name}
                  </p>
                  <p className="text-xs text-gray-500 flex-shrink-0">
                    {conversation.timestamp}
                  </p>
                </div>
                <p
                  className={`text-sm truncate ${
                    conversation.unread > 0
                      ? 'font-semibold text-gray-900'
                      : 'text-gray-600'
                  }`}
                >
                  {conversation.lastMessage}
                </p>
              </div>

              {/* Unread Badge */}
              {conversation.unread > 0 && (
                <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  {conversation.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <div className="relative">
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {selectedChat.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedChat.name}</p>
                <p className="text-xs text-gray-500">
                  {selectedChat.online ? 'Active now' : 'Active 2h ago'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600">
                <Phone size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600">
                <Video size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600">
                <Info size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-end gap-3">
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-all text-gray-600">
                <Paperclip size={20} />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleSendMessage();
                    }
                  }}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="1"
                />
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-all"
                >
                  <Smile size={20} />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
          <div className="text-center">
            <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="font-semibold">Select a conversation to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
