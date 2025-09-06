import React from 'react';

const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px'}}>
      <h1>Login to MidField Insights</h1>
      <button
        onClick={handleGoogleLogin}
        style={{
          cursor: 'pointer',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        Login with Google
      </button>
    </div>
  );
}
