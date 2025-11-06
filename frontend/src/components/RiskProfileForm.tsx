import React, { useState } from 'react';
import { optimizePortfolio, saveRiskProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface RiskProfileFormProps {
  onPortfolioGenerated: (portfolio: any) => void;
}

const RiskProfileForm: React.FC<RiskProfileFormProps> = ({ onPortfolioGenerated }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = [
    {
      id: "country",
      question: "¿En qué país resides actualmente?",
      type: "text",
      placeholder: "Ej: Argentina"
    },
    {
      id: "experience_level",
      question: "¿Cuál es tu nivel de experiencia en inversiones?",
      type: "radio",
      options: [
        { value: "beginner", label: "Principiante" },
        { value: "intermediate", label: "Intermedio" },
        { value: "advanced", label: "Avanzado" }
      ]
    },
    {
      id: "investment_goal",
      question: "¿Cuál es tu principal objetivo de inversión?",
      type: "radio",
      options: [
        { value: "retirement", label: "Jubilación" },
        { value: "house", label: "Ahorro para una casa" },
        { value: "growth", label: "Crecimiento de capital" },
        { value: "income", label: "Generación de ingresos" }
      ]
    },
    {
      id: "risk_tolerance",
      question: "¿Cómo describirías tu tolerancia al riesgo?",
      type: "radio",
      options: [
        { value: "low", label: "Baja (prefiero seguridad, aunque gane menos)" },
        { value: "medium", label: "Media (busco equilibrio entre riesgo y retorno)" },
        { value: "high", label: "Alta (dispuesto a asumir riesgos por mayores retornos)" }
      ]
    },
    {
      id: "investment_amount",
      question: "¿Cuánto capital inicial te gustaría invertir?",
      type: "number",
      placeholder: "Ej: 100000"
    }
  ];

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem('user_id'); // Asume que el user_id se guarda en localStorage al loguearse
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const riskProfileData = {
      risk_profile_answers: answers, // Guardar todas las respuestas
      country: answers.country,
      experience_level: answers.experience_level,
      investment_goal: answers.investment_goal,
      risk_level: answers.risk_tolerance, // Mapear a risk_level para el backend
      preferences: { amount: parseFloat(answers.investment_amount) }
    };

    try {
      // Primero, guardar el perfil de riesgo
      await saveRiskProfile(riskProfileData);

      // Luego, optimizar el portafolio
      const portfolioResponse = await optimizePortfolio(riskProfileData);
      onPortfolioGenerated(portfolioResponse.data);
      navigate('/dashboard/overview'); // Redirigir al dashboard
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al generar el portafolio.');
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-2xl w-full animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Cuestionario de Perfil de Riesgo</h2>
        <p className="text-center text-slate-600 mb-8">Responde estas 5 preguntas para que la IA pueda generar tu portafolio ideal.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xl font-semibold text-slate-800 mb-3">
              {currentQuestion + 1}. {currentQ.question}
            </label>
            {
              currentQ.type === "text" && (
                <input
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder={currentQ.placeholder}
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  required
                />
              )
            }
            {
              currentQ.type === "number" && (
                <input
                  type="number"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder={currentQ.placeholder}
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  required
                />
              )
            }
            {
              currentQ.type === "radio" && (
                <div className="mt-2 space-y-2">
                  {currentQ.options?.map(option => (
                    <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name={currentQ.id}
                        value={option.value}
                        checked={answers[currentQ.id] === option.value}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        className="form-radio h-5 w-5 text-blue-600"
                        required
                      />
                      <span className="ml-3 text-lg text-slate-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              )
            }
          </div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentQuestion === 0 || loading}
              className="bg-gray-300 text-slate-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400 transition duration-300 disabled:opacity-50"
            >
              Anterior
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading || !answers[currentQ.id]}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !answers[currentQ.id]}
                className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
              >
                {loading ? 'Generando Portafolio...' : 'Generar Portafolio'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiskProfileForm;
