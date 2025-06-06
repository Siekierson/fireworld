'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import { Message } from '@/types/database';
import { messageController } from '@/controllers/messageController';
import { supabase } from '@/lib/supabase';

export default function Messages() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!user?.userID) {
      console.log('Cannot setup subscription - no user ID');
      return;
    }

    console.log('Setting up message subscription for user:', user.userID);
    
    if (subscriptionRef.current) {
      console.log('Cleaning up previous subscription');
      subscriptionRef.current();
    }

    let isSubscribed = true;
    const processedMessageIds = new Set<string>();

    const setupSubscription = async () => {
      try {
        const cleanup = await messageController.subscribeToMessages(user.userID, (message) => {
          if (!isSubscribed) {
            console.log('Component unmounted, ignoring message');
            return;
          }

          if (processedMessageIds.has(message.messageID)) {
            console.log('Message already processed, skipping:', message.messageID);
            return;
          }

          console.log('Received message in component:', {
            messageID: message.messageID,
            from: message.userID,
            to: message.toWhoID,
            selectedUser: selectedUser?.userID,
            currentUser: user.userID,
            message: message.message,
            timestamp: message.created_at,
            isTestMessage: message.message === 'Test message from subscription'
          });

          if (message.message === 'Test message from subscription') {
            console.log('Ignoring test message');
            return;
          }

          if (message.toWhoID === user.userID || message.userID === user.userID) {
            console.log('Message is for current user, checking if it should be displayed');
            
            if (selectedUser) {
              if (message.userID === selectedUser.userID || message.toWhoID === selectedUser.userID) {
                console.log('Message is for current conversation, adding to chat');
                setMessages((prev) => {
                  const exists = prev.some(m => m.messageID === message.messageID);
                  if (exists) {
                    console.log('Message already exists in chat, skipping');
                    return prev;
                  }
                  processedMessageIds.add(message.messageID);
                  const newMessages = [...prev, message].sort((a, b) => 
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                  );
                  console.log('Added new message to chat, total messages:', newMessages.length);
                  return newMessages;
                });
              } else {
                console.log('Message is not for current conversation, skipping');
              }
            } else {
              console.log('No user selected, but message is for current user - storing for later');
              setMessages((prev) => {
                const exists = prev.some(m => m.messageID === message.messageID);
                if (exists) return prev;
                processedMessageIds.add(message.messageID);
                const newMessages = [...prev, message].sort((a, b) => 
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
                console.log('Stored message for later, total messages:', newMessages.length);
                return newMessages;
              });
            }
          } else {
            console.log('Message is not for current user, skipping');
          }
        });

        subscriptionRef.current = cleanup;
      } catch (error) {
        console.error('Error setting up subscription:', error);
      }
    };

    setupSubscription();

    return () => {
      console.log('Cleaning up subscription on unmount for user:', user.userID);
      isSubscribed = false;
      processedMessageIds.clear();
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }
    };
  }, [user?.userID, selectedUser?.userID]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.userID || !selectedUser?.userID) {
        console.log('Cannot fetch messages - missing user data:', {
          hasCurrentUser: !!user?.userID,
          hasSelectedUser: !!selectedUser?.userID,
          currentUserID: user?.userID,
          selectedUserID: selectedUser?.userID
        });
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token available for fetching messages');
          return;
        }

        console.log('Fetching messages for users:', {
          currentUser: user.userID,
          selectedUser: selectedUser.userID,
          timestamp: new Date().toISOString()
        });

        const response = await fetch(`/api/messages?otherUserID=${selectedUser.userID}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const messagesData = await response.json();
          const sortedMessages = messagesData.sort((a: Message, b: Message) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          console.log('Fetched messages:', {
            count: sortedMessages.length,
            firstMessage: sortedMessages[0]?.created_at,
            lastMessage: sortedMessages[sortedMessages.length - 1]?.created_at,
            currentUser: user.userID,
            selectedUser: selectedUser.userID
          });
          setMessages(sortedMessages);
        } else {
          console.error('Failed to fetch messages:', {
            status: response.status,
            currentUser: user.userID,
            selectedUser: selectedUser.userID
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', {
          error,
          currentUser: user.userID,
          selectedUser: selectedUser.userID
        });
      }
    };

    fetchMessages();
  }, [user?.userID, selectedUser?.userID]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !user) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          toWhoID: selectedUser.userID
        })
      });

      if (response.ok) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-red-900">
      <Sidebar />
      <div className="flex-1">
        <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
          <div className="w-96 border-r border-white/10 flex flex-col bg-[#541010]">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-semibold text-orange-500">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-2">
                {users.map((u) => (
                  <button
                    key={u.userID}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-lg transition ${
                      selectedUser?.userID === u.userID
                        ? 'bg-orange-500 text-white'
                        : 'text-orange-500 hover:bg-white/5'
                    }`}
                  >
                    <Image
                      src={u.imageURL || '/default-avatar.png'}
                      alt={u.name || 'User'}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <span className="font-medium text-lg">{u.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-[#541010]">
            {selectedUser ? (
              <>
                <div className="p-6 border-b border-white/10 bg-white/5">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={selectedUser.imageURL || '/default-avatar.png'}
                      alt={selectedUser.name || 'User'}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-orange-500">
                        {selectedUser.name}
                      </h3>
                      <p className="text-base text-orange-400">Online</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.userID === user?.userID ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.userID === user?.userID
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/10 text-orange-500'
                        }`}
                      >
                        <p className="break-words text-lg">{message.message}</p>
                        <p className="text-sm mt-2 opacity-70">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10 bg-white/5">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/5 text-orange-500 rounded-lg px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-orange-400"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold text-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-orange-500">
                <div className="text-center">
                  <p className="text-2xl mb-3">Select a user to start messaging</p>
                  <p className="text-lg opacity-75">Choose from the list on the left</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 