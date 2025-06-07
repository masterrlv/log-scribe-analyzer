
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Settings, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { StoredFile } from "../services/fileStorage";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedFile: StoredFile | null;
}

const ChatInterface = ({ selectedFile }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: selectedFile 
        ? `Hello! I'm here to help you analyze ${selectedFile.name}. You can ask me questions about the logs, error patterns, or any insights you'd like to explore.`
        : "Hello! Select a file from the history to start analyzing and chatting about your logs.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update welcome message when file changes
    if (selectedFile) {
      setMessages(prev => [
        {
          id: Date.now().toString(),
          content: `Now analyzing ${selectedFile.name}. This file contains ${selectedFile.analysisData.totalEntries.toLocaleString()} log entries with ${selectedFile.analysisData.errorCount} errors. What would you like to know about it?`,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [selectedFile]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      let botResponse = "I'm a demo bot. To connect me to a real AI service, configure the API endpoint in settings.";
      
      if (selectedFile && inputMessage.toLowerCase().includes('error')) {
        botResponse = `Based on ${selectedFile.name}, I found ${selectedFile.analysisData.errorCount} errors. The most common error patterns are: ${selectedFile.analysisData.topErrors.slice(0, 3).map(e => e.message).join(', ')}.`;
      } else if (selectedFile && inputMessage.toLowerCase().includes('summary')) {
        botResponse = `Here's a summary of ${selectedFile.name}: Total entries: ${selectedFile.analysisData.totalEntries.toLocaleString()}, Errors: ${selectedFile.analysisData.errorCount}, Warnings: ${selectedFile.analysisData.warningCount}, Info: ${selectedFile.analysisData.infoCount}. Upload time: ${new Date(selectedFile.uploadDate).toLocaleDateString()}.`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold">Log Analysis Assistant</h3>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="text-slate-400 hover:text-white"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 bg-slate-700 border-b border-slate-600">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-300 block mb-1">API Endpoint</label>
              <Input
                placeholder="Enter your chatbot API endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setIsConnected(!!apiEndpoint);
                  setShowSettings(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Connect
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setApiEndpoint('');
                  setIsConnected(false);
                }}
                className="border-slate-500 text-slate-300"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : ''}`}>
              <div
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {formatTime(message.timestamp)}
              </p>
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <Input
            placeholder={selectedFile ? "Ask about your logs..." : "Select a file to start chatting"}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!selectedFile}
            className="bg-slate-700 border-slate-600 text-white"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !selectedFile}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!selectedFile && (
          <p className="text-xs text-slate-400 mt-2">Select a file from the history to enable chat</p>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
