import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Chat() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const initialRoom = params.get('room') || '';
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState(initialRoom);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const sockRef = useRef(null);
  const messagesEndRef = useRef(null);

  const loadRooms = async () => {
    const { data } = await api.get('/api/chat/rooms');
    if (data.ok) setRooms(data.rooms);
  };

  const loadMessages = async (rid) => {
    if (!rid) return setMessages([]);
    const { data } = await api.get(`/api/chat/room/${rid}/messages`);
    if (data.ok) setMessages(data.messages);
  };

  useEffect(() => { loadRooms(); }, []);
  useEffect(() => { if (roomId) loadMessages(roomId); }, [roomId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const sock = io(API_URL, { auth: { token } });
    sockRef.current = sock;

    sock.on('connect', () => {});
    sock.on('newMessage', (msg) => {
      if (msg.roomId === roomId) setMessages((m) => [...m, msg]);
    });

    return () => sock.close();
  }, [roomId]);

  useEffect(() => {
    if (!sockRef.current || !roomId) return;
    sockRef.current.emit('joinRoom', { roomId });
    return () => sockRef.current?.emit('leaveRoom', { roomId });
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!text.trim() || !roomId) return;
    sockRef.current.emit('sendMessage', { roomId, text: text.trim() });
    setText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const header = useMemo(() => {
    const r = rooms.find(x => x.id === roomId);
    if (!r) return 'Select a conversation';
    return `Room #${r.id.slice(0, 8)}`;
  }, [rooms, roomId]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      padding: '24px',
      // ✅ important: give space for your NavBar
      paddingTop: '90px'
    }}>
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 968px) {
          .chat-container {
            flex-direction: column !important;
          }
          .chat-sidebar {
            max-width: 100% !important;
            margin-bottom: 20px !important;
          }
        }
        @media (max-width: 640px) {
          .chat-wrapper {
            padding: 16px !important;
          }
          .chat-sidebar {
            max-height: 300px !important;
          }
        }
      `}</style>

      {/* ✅ Back bar (so user always has navigation even if NavBar is hidden) */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={() => nav(-1)}
          style={{
            padding: '10px 14px',
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          ← Back
        </button>

        <button
          onClick={() => nav('/market')}
          style={{
            padding: '10px 14px',
            background: '#4a7c3b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700
          }}
        >
          Go to Marketplace
        </button>
      </div>

      <div className="chat-wrapper" style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: 0,
            marginBottom: '8px'
          }}>
            Messages
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#666',
            margin: 0
          }}>
            Chat with buyers and farmers about your orders
          </p>
        </div>

        {/* Chat Container */}
        <div className="chat-container" style={{
          display: 'flex',
          gap: '20px',
          height: 'calc(100vh - 260px)',
          minHeight: '600px'
        }}>
          {/* Sidebar - Chat List */}
          <div className="chat-sidebar" style={{
            width: '360px',
            maxWidth: '360px',
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0
              }}>
                Conversations
              </h2>
              <div style={{
                fontSize: '13px',
                color: '#666',
                background: '#f0f0f0',
                padding: '4px 10px',
                borderRadius: '12px',
                fontWeight: '600'
              }}>
                {rooms.length}
              </div>
            </div>

            {/* User Info */}
            <div style={{
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '13px',
                color: '#666',
                marginBottom: '4px'
              }}>
                Logged in as
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                {user?.fullName}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#4a7c3b',
                fontWeight: '500',
                marginTop: '2px'
              }}>
                {user?.role}
              </div>
            </div>

            {/* Chat Rooms List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {rooms.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRoomId(r.id)}
                  style={{
                    background: roomId === r.id ? '#e8f5e9' : 'white',
                    border: roomId === r.id ? '2px solid #4a7c3b' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: roomId === r.id ? '#4a7c3b' : '#1a1a1a'
                    }}>
                      Room #{r.id.slice(0, 8)}
                    </div>
                    {roomId === r.id && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#4a7c3b'
                      }}></div>
                    )}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#666',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {r.messages?.[0]?.text || 'No messages yet'}
                  </div>
                </button>
              ))}

              {rooms.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#999'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                    No conversations yet
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    Start chatting from a product page
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div style={{
            flex: 1,
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e0e0e0',
              background: 'white'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0
              }}>
                {header}
              </h2>
              {roomId && (
                <div style={{
                  fontSize: '13px',
                  color: '#4a7c3b',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#4a7c3b'
                  }}></div>
                  Active
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              background: '#f9fafb',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {!roomId ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  color: '#999'
                }}>
                  <div>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
                    <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                      Select a conversation
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      Choose a chat from the sidebar to start messaging
                    </div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  color: '#999'
                }}>
                  <div>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                    <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '6px' }}>
                      No messages yet
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      Start the conversation by sending a message
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m) => {
                    const isOwn = m.senderId === user?.id;
                    return (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          justifyContent: isOwn ? 'flex-end' : 'flex-start',
                          marginBottom: '16px'
                        }}
                      >
                        <div style={{ maxWidth: '70%', minWidth: '200px' }}>
                          <div style={{
                            background: isOwn ? '#4a7c3b' : 'white',
                            color: isOwn ? 'white' : '#1a1a1a',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                            border: isOwn ? 'none' : '1px solid #e0e0e0'
                          }}>
                            <div style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              marginBottom: '6px',
                              opacity: isOwn ? 0.9 : 0.7
                            }}>
                              {m.sender?.fullName || 'User'}
                            </div>
                            <div style={{
                              fontSize: '14px',
                              lineHeight: '1.5',
                              wordBreak: 'break-word'
                            }}>
                              {m.text}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              marginTop: '6px',
                              opacity: isOwn ? 0.8 : 0.6,
                              textAlign: 'right'
                            }}>
                              {new Date(m.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            {roomId && (
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid #e0e0e0',
                background: 'white'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      resize: 'none',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                  <button
                    onClick={send}
                    disabled={!text.trim()}
                    style={{
                      padding: '12px 24px',
                      background: text.trim() ? '#4a7c3b' : '#e0e0e0',
                      color: text.trim() ? 'white' : '#999',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: text.trim() ? 'pointer' : 'not-allowed',
                      transition: 'background 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => {
                      if (text.trim()) e.target.style.background = '#3d6630';
                    }}
                    onMouseOut={(e) => {
                      if (text.trim()) e.target.style.background = '#4a7c3b';
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
