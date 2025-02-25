import {BrowserRouter, Routes, Route} from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Index from "./pages";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
