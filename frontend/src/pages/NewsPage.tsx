import React, { useEffect, useState } from 'react';
import { fetchNews } from '../services/api';

interface NewsItemProps {
  source: string;
  title: string;
  summary: string;
  date: string;
}

const NewsItem: React.FC<NewsItemProps> = ({ source, title, summary, date }) => {
  const getSourceInitial = (src: string) => src.charAt(0).toUpperCase();
  const getRandomColor = () => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getRandomColor()}`}>
        {getSourceInitial(source)}
      </div>
      <div>
        <p className="text-sm text-gray-500">{source} - {new Date(date).toLocaleDateString()}</p>
        <h3 className="text-lg font-semibold text-slate-900 mt-1 mb-2">{title}</h3>
        <p className="text-slate-700 text-sm">{summary}</p>
        <a href="#" className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium">Leer más</a>
      </div>
    </div>
  );
};

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await fetchNews();
        setNews(response.data);
      } catch (err) {
        setError("Error al cargar las noticias.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Cargando noticias...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Noticias Financieras</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <NewsItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
