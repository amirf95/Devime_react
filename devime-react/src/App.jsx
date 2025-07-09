import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import About from './components/homePage/About';
import Clients from './components/homePage/Clients';
import Contact from './components/homePage/Contact';
import Examplaire from './components/homePage/Examplaire';
import Footer from './components/Footer';
import Header from './components/homePage/Header';
import NavBar from './components/NavBar';
import Services from './components/homePage/Services';
import Team from './components/homePage/Team';
import Login from './components/authentification/LoginForm';
import Register from './components/authentification/Register';
import UserProfile from './components/authentification/userprofil';

function MainApp() {
  return (
    <>
      <NavBar />
      <Header />
      <Services />
      <Examplaire />
      <About />
      <Team />
      <Clients />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<MainApp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />

      </Routes>
    </Router>
  );
}

export default App;