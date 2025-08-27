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
import Task0Form from "./components/estimation/Task0Form";
import EntrepreneurPrixPage from "./components/estimation/EntrepreneurPrixPage";
import EstimationGrosBetonForm from './components/estimation/EstimationGrosBetonForm';
import EstimationSemelles from './components/estimation/EstimationSemelles'
import ScrollTop from './components/ScrollTop';
// import Unauthorized from './components/authentification/Unauthorized';



import Chatbot from './components/Chatbot/ChatBot';
import TaskDefault from './components/estimation/defaulttasks/TaskDefault';
function MainApp() {
  return (
    <>
      <NavBar >
      </NavBar>
      
      <Header />
      <Services />
      <Examplaire />
      <About />
      <Team />
      <Clients />
      <Contact />
      <Footer />
      
      <Chatbot />

    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<MainApp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/estimation-tache0" element={<Task0Form />} />
        <Route path="/prix-page" element={<EntrepreneurPrixPage />} />
        <Route path="/EstimationGrosBetonForm" element={<EstimationGrosBetonForm />} />
        <Route path="/EstimationSemelles" element={<EstimationSemelles />} />
        <Route path="/TaskDefault" element={<TaskDefault />} />
        
        {/* <Route path="/Unauthorized" element={<Unauthorized />} /> */}

      </Routes>
    </Router>
  );
}

export default App;