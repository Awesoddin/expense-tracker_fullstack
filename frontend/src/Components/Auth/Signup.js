import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import axios from 'axios';

function Signup({ setIsAuthenticated, switchToLogin }) {
    const [inputState, setInputState] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const { name, email, password, confirmPassword } = inputState;

    const handleInput = name => e => {
        setInputState({...inputState, [name]: e.target.value})
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/v1/signup', {
                name,
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setIsAuthenticated(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    }

    return (
        <SignupStyled>
            <div className="auth-container">
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-control">
                        <input 
                            type="text" 
                            value={name}
                            name={'name'} 
                            placeholder="Name"
                            onChange={handleInput('name')}
                            required
                        />
                    </div>
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
                    <div className="input-control">
                        <input 
                            type="password"
                            value={confirmPassword}
                            name={'confirmPassword'} 
                            placeholder="Confirm Password"
                            onChange={handleInput('confirmPassword')}
                            required
                        />
                    </div>
                    <div className="submit-btn">
                        <Button 
                            name={'Sign Up'}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={'var(--color-accent'}
                            color={'#fff'}
                        />
                    </div>
                </form>
                <div className="switch-form">
                    Already have an account? <span onClick={switchToLogin}>Login</span>
                </div>
            </div>
        </SignupStyled>
    )
}

const SignupStyled = styled.div`
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

        .error-message {
            color: red;
            text-align: center;
            margin-bottom: 1rem;
        }

        .switch-form {
            text-align: center;
            margin-top: 1rem;
            
            span {
                color: var(--color-accent);
                cursor: pointer;
                font-weight: 600;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
`;

export default Signup;