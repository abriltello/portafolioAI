import React, { useState } from 'react';
import { submitContactForm } from '../services/api';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-slate-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <p className="mt-2 text-slate-600 animate-fade-in">{answer}</p>
      )}
    </div>
  );
};

const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await submitContactForm(formData);
      setSuccess("Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto contigo pronto.");
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError("Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "¿Cómo creo una cuenta en PortafolioAI?",
      answer: "Puedes crear una cuenta haciendo clic en el botón 'Iniciar Sesión / Registrarse' en la página de inicio y luego seleccionando la opción 'Regístrate'."
    },
    {
      question: "¿Es PortafolioAI un asesor financiero regulado?",
      answer: "PortafolioAI es una herramienta educativa y de simulación. No ofrecemos asesoramiento financiero regulado. Siempre consulta con un profesional antes de tomar decisiones de inversión."
    },
    {
      question: "¿Cómo se genera mi portafolio?",
      answer: "Tu portafolio se genera en base a las respuestas de un cuestionario de perfil de riesgo y tus preferencias, utilizando algoritmos de optimización y, opcionalmente, inteligencia artificial."
    },
    {
      question: "¿Puedo modificar mi portafolio una vez generado?",
      answer: "Sí, puedes ajustar tus preferencias y volver a generar un portafolio. También puedes usar el simulador para probar diferentes escenarios."
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Centro de Soporte</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Contacto */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Contáctanos</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">Mensaje</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            {success && <p className="text-green-600 text-sm">{success}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>

        {/* Sección de Preguntas Frecuentes */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Preguntas Frecuentes</h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
