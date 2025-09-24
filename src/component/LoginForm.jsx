
// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
// import jwt_decode from "jwt-decode";
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoggingIn(true);

    try {
      const res = await fetch("http://localhost:5000/api/agent-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

          if (!data.agent.isFullyRegistered) {
        navigate('/registration', { state: { email: data.agent.email } });
      } else {
        navigate('/dashboard');
      }
          // Pass the entire agent data to the parent component (App.js)

      onLoginSuccess(data.agent);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google credential:", credentialResponse.credential);

      // Send the Google token to backend
      const res = await fetch("http://localhost:5000/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google login failed");

      localStorage.setItem("agent", JSON.stringify(data.agent));
      if (!data.agent.isFullyRegistered) {
        navigate('/registration', { state: { email: data.agent.email } });
      } else {
        navigate('/dashboard');
      }



       onLoginSuccess({
      ...data.agent,
      accessToken: data.accessToken,
      isFullyRegistered: data.isFullyRegistered,
    });
  } catch (err) {
    setError(err.message);
  }
};

  const handleGoogleFailure = () => {
    setError("Google Login failed. Please try again.");
  };
  

  return (
    <GoogleOAuthProvider clientId="226973400056-4elplcihprd0balu9kkkm9ub7c4vcojn.apps.googleusercontent.com">
      <div className="login-container">
        <div className="background">
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <Card className="login-card">
          <div className="text-center mb-4">
            <h2 className="login-title">Associate Login</h2>
            <p className="login-subtitle">Access your HerbalLife dashboard</p>
          </div>

          {error && <Alert variant="danger" className="error-alert">{error}</Alert>}

          {/* Google Login Button */}
          <div className="mb-4 text-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              size="large"
              width="100%"
            />
          </div>

          <div className="divider">
            <span>Or continue with email</span>
          </div>

          <Form onSubmit={handleLogin}>
           <Form.Group controlId="emailInput" className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="passwordInput" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="login-button w-100"
              disabled={loggingIn}
            >
              {loggingIn ? "Logging In..." : "Login with Email"}
            </Button>
          </Form>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;




