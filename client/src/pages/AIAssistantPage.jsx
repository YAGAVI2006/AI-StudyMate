import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Bot,
  Send,
  Plus,
  Trash2,
  Sparkles,
  User,
  Clock,
  AlertCircle,
  HelpCircle,
  Code,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import Loader from '../components/Loader';
import Button from '../components/Button';

const AIAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'Explain Java OOP',
    'Explain Operating System',
    'Teach me SQL',
    'Explain Recursion',
    'Difference between JVM and JDK',
  ];

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai/history');
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query || !query.trim()) return;

    if (query.length > 1000) {
      setErrorMessage('Message exceeds 1000 character limit.');
      return;
    }

    setErrorMessage('');
    setInputMessage('');
    setSending(true);

    // Optimistic user entry
    const tempUserMsg = {
      _id: 'temp_' + Date.now(),
      question: query,
      response: null,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.post('/ai/chat', { message: query });
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempUserMsg._id ? res.data : msg))
      );
    } catch (err) {
      console.error('Error sending message:', err);
      const errText =
        err.response?.data?.message || 'Network error connecting to AI StudyMate Assistant.';
      setErrorMessage(errText);
      // Remove temp message if failed
      setMessages((prev) => prev.filter((msg) => msg._id !== tempUserMsg._id));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.delete('/ai/history');
      setMessages([]);
    } catch (err) {
      console.error('Error clearing chat history:', err);
    }
  };

  if (loading) {
    return <Loader message="Connecting to AI StudyMate Tutor..." />;
  }

  return (
    <div className="h-[85vh] flex flex-col lg:flex-row gap-6 pb-6">
      {/* Left Chat Sidebar (History & New Chat) */}
      <div className="w-full lg:w-72 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between flex-shrink-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 text-sm">AI Study Assistant</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#2563EB]">
              Gemini 2.5
            </span>
          </div>

          <Button
            onClick={() => setMessages([])}
            icon={Plus}
            className="w-full justify-center text-xs py-2.5"
          >
            New Chat Session
          </Button>

          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Recent Conversations ({messages.length})
            </span>
            <div className="max-h-[300px] overflow-y-auto space-y-1.5 scrollbar-thin">
              {messages.length > 0 ? (
                messages.map((m, i) => (
                  <div
                    key={m._id || i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-700 truncate hover:bg-blue-50 hover:text-[#2563EB] transition-colors cursor-pointer"
                  >
                    💬 {m.question}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs italic py-4 text-center">
                  No previous conversations yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors mt-4"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Main Chat Canvas */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">AI StudyMate Tutor</h2>
              <span className="text-xs text-slate-400 font-medium">
                Personalized Step-by-Step Educational Explanations
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </div>
        </div>

        {/* Scrollable Message List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {messages.length === 0 && !sending ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6 py-12">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Ask AI StudyMate Anything
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Get structured step-by-step definitions, code examples, real-world analogies, and practice questions.
                </p>
              </div>

              {/* Suggested Question Chips */}
              <div className="w-full space-y-2 pt-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Suggested Prompts
                </span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] text-xs font-semibold border border-slate-200/80 transition-all hover:scale-105"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={msg._id || index} className="space-y-6">
                {/* User Message (Right Side) */}
                <div className="flex justify-end items-start gap-3">
                  <div className="bg-[#2563EB] text-white p-4 rounded-3xl rounded-tr-xs max-w-lg shadow-md shadow-blue-500/10 space-y-1">
                    <p className="text-sm font-medium leading-relaxed">{msg.question}</p>
                    <span className="text-[10px] text-blue-200 block text-right">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-blue-100 text-[#2563EB] font-bold flex items-center justify-center text-xs flex-shrink-0">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                </div>

                {/* AI Response (Left Side) */}
                {msg.response ? (
                  <div className="flex justify-start items-start gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-5 h-5" />
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 text-slate-900 p-5 sm:p-6 rounded-3xl rounded-tl-xs max-w-2xl shadow-xs space-y-3 leading-relaxed text-sm">
                      {/* Render Structured AI Text */}
                      <div className="whitespace-pre-wrap font-sans text-slate-800 space-y-3">
                        {msg.response}
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span>AI StudyMate Tutor • Gemini 2.5 Flash</span>
                        <span>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Loading Typing Indicator */
                  <div className="flex justify-start items-start gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-3xl rounded-tl-xs flex items-center gap-2 text-slate-500 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping"></span>
                      <span>AI StudyMate is generating step-by-step explanation...</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Box Area */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-2">
          <div className="relative flex items-center">
            <textarea
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI StudyMate a question... (e.g. What is recursion?, Shift+Enter for new line)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] resize-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={sending || !inputMessage.trim()}
              className="absolute right-3 p-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Press <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for new line</span>
            <span>{inputMessage.length} / 1000 chars</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
