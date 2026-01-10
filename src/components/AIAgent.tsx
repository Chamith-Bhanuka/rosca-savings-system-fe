import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import ReactMarkdown from 'react-markdown';
import { X, Send, Paperclip } from 'lucide-react';
import agentVideo from '../assets/agent.mp4';
import agentIcon from '../assets/agent-icon.png';

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
}

const AIAgent: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Hello! I am SeettuBot. Ask me about finding groups or how the system works!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .custom-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const base64 = await convertToBase64(file);
      setSelectedImage(base64);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg = input;
    const imgToSend = selectedImage;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: userMsg || 'Analyze this image',
        image: imgToSend || undefined,
      },
    ]);

    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const historyForApi = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const response = await fetch('http://localhost:5000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg || 'Analyze this image',
          image: imgToSend,
          history: historyForApi,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: "Sorry, I'm having trouble connecting right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 font-['Inter']">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`w-[calc(100vw-2rem)] sm:w-[380px] h-[calc(100vh-120px)] sm:h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all ${
            isDark
              ? 'bg-[#1a110d] border border-white/10'
              : 'bg-white border border-gray-200'
          }`}
          style={{
            maxHeight: 'calc(100vh - 120px)',
          }}
        >
          {/* Header */}
          <div
            className={`p-4 flex justify-between items-center ${
              isDark
                ? 'bg-gradient-to-r from-[#1a110d] to-[#2a1a0d] border-b border-white/10'
                : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] border-b border-[#8b6635]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-transparent">
                <img
                  src={agentIcon}
                  alt="Agent"
                  className="w-full h-full object-cover scale-150"
                />
              </div>
              <div>
                <h3
                  className={`font-['Playfair_Display'] font-bold ${
                    isDark ? 'text-[#d4a574]' : 'text-white'
                  }`}
                >
                  Seettu Assistant
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span
                    className={`text-xs ${isDark ? 'text-gray-400' : 'text-white/80'}`}
                  >
                    Online
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-white/20 text-white/80 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            className={`flex-1 p-4 overflow-y-auto custom-scrollbar ${
              isDark ? 'bg-[#0f0806]' : 'bg-[#faf8f5]'
            }`}
            ref={scrollRef}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? isDark
                        ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white rounded-tr-none'
                        : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white rounded-tr-none'
                      : isDark
                        ? 'bg-[#1a110d]/80 backdrop-blur-xl border border-white/10 text-[#f2f0ea] rounded-tl-none'
                        : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Uploaded"
                      className="w-full rounded-lg mb-2 max-h-48 object-cover"
                    />
                  )}
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          className={`underline font-semibold ${
                            msg.role === 'user'
                              ? 'text-white'
                              : isDark
                                ? 'text-[#d4a574] hover:text-[#c39464]'
                                : 'text-[#b8894d] hover:text-[#a67a42]'
                          }`}
                        />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className={`p-3 rounded-xl rounded-tl-none text-xs flex items-center gap-2 ${
                    isDark
                      ? 'bg-[#1a110d]/80 border border-white/10 text-gray-400'
                      : 'bg-white border border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 rounded-full bg-current animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-current animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-current animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div
              className={`px-4 py-2 border-t flex items-center gap-3 ${
                isDark
                  ? 'bg-[#1a110d]/80 border-white/10'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <img
                src={selectedImage}
                alt="Preview"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p
                  className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Image ready to send
                </p>
                <p
                  className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                >
                  Click send or add a message
                </p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-red-500/20 text-red-400'
                    : 'hover:bg-red-100 text-red-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Area */}
          <div
            className={`p-4 border-t ${
              isDark
                ? 'bg-[#1a110d]/80 backdrop-blur-xl border-white/10'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex gap-2">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {/* Paperclip Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                  isDark
                    ? 'bg-white/5 border border-white/10 text-gray-400 hover:text-[#d4a574] hover:border-[#d4a574]/40'
                    : 'bg-gray-50 border border-gray-300 text-gray-600 hover:text-[#b8894d] hover:border-[#b8894d]/40'
                }`}
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className={`flex-1 rounded-lg px-4 py-3 text-sm outline-none transition-all ${
                  isDark
                    ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#d4a574] focus:ring-1 focus:ring-[#d4a574]'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#b8894d] focus:ring-1 focus:ring-[#b8894d]'
                }`}
              />

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={loading || (!input.trim() && !selectedImage)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                  loading || (!input.trim() && !selectedImage)
                    ? isDark
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isDark
                      ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg hover:shadow-[#d4a574]/30'
                      : 'bg-gradient-to-r from-[#b8894d] to-[#8b6635] text-white hover:shadow-lg hover:shadow-[#b8894d]/30'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button with Video Background */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-2xl flex items-center justify-center transition-transform hover:scale-110 ${
            isDark
              ? 'shadow-[#d4a574]/40 bg-gradient-to-br from-[#d4a574] to-[#a3784e]'
              : 'shadow-[#b8894d]/40 bg-gradient-to-br from-[#b8894d] to-[#8b6635]'
          }`}
        >
          {/* Video Background */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={agentVideo} type="video/mp4" />
          </video>
        </button>
      )}
    </div>
  );
};

export default AIAgent;
