import { Outlet, NavLink, useParams, useNavigate, useLocation } from 'react-router';
import { Menu, X, BookOpen, Layers, Cpu, Box, Workflow, Palette, Settings, Globe } from 'lucide-react';
import { useState } from 'react';

const navigationEn = [
  { name: 'Introduction', href: '/', icon: BookOpen },
  { name: 'Technology Stack', href: '/stack', icon: Layers },
  { name: 'Architecture', href: '/architecture', icon: Cpu },
  { name: 'Coding Patterns', href: '/patterns', icon: Settings },
  { name: 'Components & UI', href: '/components', icon: Box },
  { name: 'Shared Utilities', href: '/utilities', icon: Box },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'Brand Identity', href: '/brand', icon: Palette },
];

const navigationEs = [
  { name: 'Introducción', href: '/', icon: BookOpen },
  { name: 'Stack Tecnológico', href: '/stack', icon: Layers },
  { name: 'Arquitectura', href: '/architecture', icon: Cpu },
  { name: 'Patrones de Código', href: '/patterns', icon: Settings },
  { name: 'Componentes e UI', href: '/components', icon: Box },
  { name: 'Utilidades Compartidas', href: '/utilities', icon: Box },
  { name: 'Flujos de Trabajo', href: '/workflows', icon: Workflow },
  { name: 'Identidad de Marca', href: '/brand', icon: Palette },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { lang = 'es' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = lang === 'en' ? navigationEn : navigationEs;

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'es' : 'en';
    const currentPath = location.pathname.replace(/^\/(en|es)/, '');
    navigate(`/${newLang}${currentPath || '/'}`);
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-gray-800 font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-gray-50 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white min-h-16">
          <div className="flex items-center w-full">
            <img src="/media/topnetworks-positivo-sinfondo.webp" alt="TopNetworks" className="w-full max-w-[180px] h-auto object-contain my-2" />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            // Treat the root item specially to avoid double slashes, e.g. /es instead of /es/
            const targetPath = item.href === '/' ? `/${lang}` : `/${lang}${item.href}`;
            return (
              <NavLink
                key={item.name}
                to={targetPath}
                end={item.href === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                    isActive 
                      ? 'bg-brand-blue-50 text-brand-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} className="shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 lg:px-8">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 -ml-2 p-2"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 flex items-center justify-end gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
            >
              <Globe size={16} />
              <span>{lang === 'en' ? 'English' : 'Español'}</span>
            </button>
            <img src="/media/topnetworks-positivo-sinfondo.webp" alt="TopNetworks" className="h-6 hidden sm:block" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
