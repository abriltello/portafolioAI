import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
// importación eliminada: función de chatbot ya no existe

interface AIChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "¡Hola! Soy tu asistente de IA. Pregúntame sobre cualquier concepto financiero.", sender: 'ai', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      // El chatbot fue eliminado. Puedes mostrar un mensaje fijo o eliminar esta lógica.
      const aiMessage: Message = {
        id: messages.length + 2,
        text: "Función de asistente de IA deshabilitada.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI explanation:", error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Lo siento, no pude obtener una explicación en este momento. Intenta de nuevo más tarde.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={clsx(
        "fixed bottom-8 right-8 w-80 bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "h-96 opacity-100 translate-y-0" : "h-0 opacity-0 translate-y-full pointer-events-none"
      )}
    >
      <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-blue-600 text-white rounded-t-lg">
        <h3 className="text-lg font-semibold">Asistente de IA</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">&times;</button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex",
              msg.sender === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={clsx(
                "max-w-[70%] p-3 rounded-lg shadow-md",
                msg.sender === 'user'
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-100 text-slate-800 rounded-bl-none"
              )}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="block text-xs text-right mt-1 opacity-75">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg shadow-md bg-gray-100 text-slate-800 rounded-bl-none">
              <p className="text-sm">Escribiendo...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregúntame algo..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          disabled={loading}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default AIChatWidget;
