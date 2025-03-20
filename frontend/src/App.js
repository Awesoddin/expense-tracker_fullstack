import React, {useState, useMemo} from 'react'
import styled from "styled-components";
import bg from './img/bg.png'
import {MainLayout} from './styles/Layouts'
import Orb from './Components/Orb/Orb'
import Navigation from './Components/Navigation/Navigation'
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income'
import Expenses from './Components/Expenses/Expenses';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import { useGlobalContext } from './context/globalContext';

function App() {
  const [active, setActive] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') ? true : false;
  });
  const [showLogin, setShowLogin] = useState(true);

  const global = useGlobalContext()
  console.log(global);

  const displayData = () => {
    switch(active){
      case 1:
        return <Dashboard />
      case 2:
        return <Dashboard />
      case 3:
        return <Income />
      case 4: 
        return <Expenses />
      default: 
        return <Dashboard />
    }
  }

  const orbMemo = useMemo(() => {
    return <Orb />
  },[])

  if (!isAuthenticated) {
    return (
      <AppStyled bg={bg} className="App">
        {orbMemo}
        <AuthContainer>
          <div className="auth-options">
            <button 
              className={showLogin ? 'active' : ''} 
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button 
              className={!showLogin ? 'active' : ''} 
              onClick={() => setShowLogin(false)}
            >
              Sign Up
            </button>
          </div>
          {showLogin ? (
            <Login 
              setIsAuthenticated={setIsAuthenticated} 
              switchToSignup={() => setShowLogin(false)} 
            />
          ) : (
            <Signup 
              setIsAuthenticated={setIsAuthenticated} 
              switchToLogin={() => setShowLogin(true)} 
            />
          )}
        </AuthContainer>
      </AppStyled>
    );
  }

  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        <Navigation 
          active={active} 
          setActive={setActive} 
          setIsAuthenticated={setIsAuthenticated}
        />
        <main>
          {displayData()}
        </main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main{
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar{
      width: 0;
    }
  }
`;

const AuthContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;

  .auth-options {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;

    button {
      padding: 0.8rem 2rem;
      border: none;
      border-radius: 20px;
      font-size: 1.1rem;
      cursor: pointer;
      background: rgba(252, 246, 249, 0.78);
      color: rgba(34, 34, 96, 0.6);
      transition: all 0.3s ease;

      &.active {
        background: var(--color-accent);
        color: white;
      }

      &:hover {
        transform: translateY(-2px);
      }
    }
  }
`;

export default App;
