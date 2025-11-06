import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white p-8 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">PortafolioAI</h3>
          <p className="text-slate-400">
            Tu compañero inteligente para decisiones financieras.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-slate-400 hover:text-white transition duration-300">Sobre Nosotros</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition duration-300">Términos de Servicio</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition duration-300">Política de Privacidad</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Síguenos</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-slate-400 hover:text-white transition duration-300"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-slate-400 hover:text-white transition duration-300"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-slate-400 hover:text-white transition duration-300"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
      <div className="text-center text-slate-500 mt-8 pt-8 border-t border-slate-700">
        &copy; {new Date().getFullYear()} PortafolioAI. Todos los derechos reservados.
        <p className="text-sm mt-2">Disclaimer: Este sitio es solo para fines educativos y no constituye asesoramiento financiero.</p>
      </div>
    </footer>
  );
};

export default Footer;
