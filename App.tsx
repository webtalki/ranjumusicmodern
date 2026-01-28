import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Courses from './pages/Courses';
import DemoClasses from './pages/DemoClasses';
import MyCourses from './pages/MyCourses';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Page = 'home' | 'about' | 'courses' | 'demo' | 'mylearning' | 'login' | 'register';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
        setUser(data.session.user);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setUser(session.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutUs />;
      case 'courses':
        return <Courses />;
      case 'demo':
        return <DemoClasses />;
      case 'mylearning':
        return <MyCourses />;
      case 'login':
        return <Login onNavigate={setCurrentPage} onLoginSuccess={() => setCurrentPage('home')} />;
      case 'register':
        return <Register onNavigate={setCurrentPage} onRegisterSuccess={() => setCurrentPage('home')} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
