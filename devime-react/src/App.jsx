import './App.css'
import About from './components/About'
import Clients from './components/Clients'
import Contact from './components/Contact'
import Examplaire from './components/Examplaire'
import Footer from './components/Footer'
import Header from './components/Header'
import NavBar from './components/NavBar'
import Services from './components/Services'
import Team from './components/Team'

function App() {
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

export default App
