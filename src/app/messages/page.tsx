'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import { Message } from '@/types/database';
import { messageController } from '@/controllers/messageController';

export default function Messages() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (user) {
      const unsubscribe = messageController.subscribeToMessages(user.userID, (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: newMessage,
          toWhoID: selectedUser.userID
        })
      });

      if (response.ok) {
        const message = await response.json();
        setMessages((prev) => [...prev, message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-red-900">
      <Sidebar />
      <div className="flex-1 container mx-auto px-4 py-8 pl-72">
        <div className="bg-white/10 backdrop-blur-md rounded-xl h-[calc(100vh-4rem)] flex overflow-hidden">
          <div className="w-72 border-r border-white/10">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-white mb-4">Messages</h2>
              <div className="space-y-2">
                {users.map((u) => (
                  <button
                    key={u.userID}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${
                      selectedUser?.userID === u.userID
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <Image
                      src={u.imageURL}
                      alt={u.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span>{u.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={selectedUser.imageURL}
                      alt={selectedUser.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <h3 className="text-lg font-semibold text-white">
                      {selectedUser.name}
                    </h3>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.userID === user?.userID ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.userID === user?.userID
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        <p>{message.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/5 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a user to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 