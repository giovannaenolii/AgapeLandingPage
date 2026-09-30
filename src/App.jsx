import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import Home from './pages/Home';
import { ThemeProvider } from './context/ThemeContext';

const Cases = lazy(() => import('./pages/Cases'));

let isFirstLoad = true;

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    // Se for o primeiro load da aba (ex: F5 / Refresh)
    if (isFirstLoad) {
      isFirstLoad = false;
      
      // Remove o hash na URL imediatamente para o navegador desistir de pular para a âncora
      if (pathname === '/' && hash) {
        window.history.replaceState(null, '', '/');
      }

      scrollToTop();
      requestAnimationFrame(scrollToTop);
      const t1 = setTimeout(scrollToTop, 50);
      const t2 = setTimeout(scrollToTop, 150);
      const t3 = setTimeout(scrollToTop, 300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }

    if (!hash) {
      scrollToTop();
      requestAnimationFrame(scrollToTop);
      const timeoutId = setTimeout(scrollToTop, 50);
      const timeoutId2 = setTimeout(scrollToTop, 150);
      
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(timeoutId2);
      };
    } else {
      const elementId = hash.replace('#', '');
      const scrollToHash = () => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      };

      scrollToHash();
      const t1 = setTimeout(scrollToHash, 50);
      const t2 = setTimeout(scrollToHash, 150);
      const t3 = setTimeout(scrollToHash, 300); // Safety check
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cases" element={<Cases />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
