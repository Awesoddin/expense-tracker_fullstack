import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import axios from 'axios';
import { loginIcon } from '../../utils/Icons';

function Login({ setIsAuthenticated }) {
    const [inputState, setInputState] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/login', {
                email,
                password
            });
            
            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true);
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    }

    const { email, password } = inputState;

    const handleInput = name => e => {
        setInputState({...inputState, [name]: e.target.value})
    }

    return (
        <LoginStyled>
            <div className="auth-container">
                <h2>{loginIcon} Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-control">
                        <input 
                            type="email" 
                            value={email}
                            name={'email'} 
                            placeholder="Email"
                            onChange={handleInput('email')}
                            required
                        />
                    </div>
                    <div className="input-control">
                        <input 
                            type="password"
                            value={password}
                            name={'password'} 
                            placeholder="Password"
                            onChange={handleInput('password')}
                            required
                        />
                    </div>
                    <div className="submit-btn">
                        <Button 
                            name={'Login'}
                            icon={loginIcon}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={'var(--color-accent'}
                            color={'#fff'}
                        />
                    </div>
                </form>
            </div>
        </LoginStyled>
    )
}

const LoginStyled = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(252, 246, 249, 0.78);

    .auth-container {
        background: #fff;
        border-radius: 20px;
        padding: 2rem;
        width: 400px;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

        h2 {
            text-align: center;
            margin-bottom: 2rem;
        }

        .input-control {
            margin-bottom: 1rem;
            
            input {
                width: 100%;
                padding: .8rem;
                border: 2px solid #fff;
                border-radius: 5px;
                font-size: inherit;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                color: rgba(34, 34, 96, 0.9);
                &::placeholder {
                    color: rgba(34, 34, 96, 0.4);
                }
            }
        }

        .submit-btn {
            text-align: center;
        }
    }
`;

export default Login;