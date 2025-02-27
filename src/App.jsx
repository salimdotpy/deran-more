import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import { LoadingComponent, NotFound } from "./ui/sections";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";

function App() {
  const [theme, setTheme] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    if (localStorage?.getItem('theme') === 'dark') {
      setTheme(true);
    }
  }, []);

  useEffect(() => {
    if (theme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme ? 'dark' : 'light');
  }, [theme]);

  return (
    <BrowserRouter>
      <LoadingComponent />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth/admin" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer theme={theme ? 'dark' : 'light'} />
    </BrowserRouter>
  )
}

export default App
