import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from 'react';
import { LoadingComponent, NotFound } from "./ui/sections";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import ProtectedRoute from "./ui/ProtectedRoute";
import SettingLogoFavicon, { SettingSeo } from "./pages/Settings";
import Frontend from "./pages/Frontend";
import { useDidMount } from "./hooks";
import { fetchSetting } from "./utils";
import UpdateProfile, { UpdatePassword } from "./pages/UpdateProfile";

function App() {
  const [theme, setTheme] = useState(false);
  const [images, setImages] = useState(null);
  const didMount = useDidMount();
  const fetchData = async () => {
    const snapshot = await fetchSetting('logo_favicon.image');
    setImages(snapshot);
  };

  useEffect(() => {
    fetchData();
    return () => {
      setImages(null);
    }
  }, []);

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

  if (didMount && images) {
    // Check if an existing manifest tag is present, remove it
    let iconTag = document.querySelector("link[rel='icon']"); //rel="icon"
    if (iconTag) {
      document.head.removeChild(iconTag);
    }

    // Create a new manifest <link> tag
    iconTag = document.createElement("link");
    iconTag.rel = "icon";
    iconTag.href = images.favicon;

    // Append to <head>
    document.head.appendChild(iconTag);
  }

  return (
    <BrowserRouter>
      <LoadingComponent />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth/admin" element={<Login />} />
        <Route path="/admin/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<UpdateProfile />} />
                <Route path="/password" element={<UpdatePassword />} />
                <Route path="/logo-favicon" element={<SettingLogoFavicon />} />
                <Route path="/seo" element={<SettingSeo />} />
                <Route path="/frontend/:type" element={<Frontend />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer theme={theme ? 'dark' : 'light'} />
    </BrowserRouter>
  )
}

export default App
