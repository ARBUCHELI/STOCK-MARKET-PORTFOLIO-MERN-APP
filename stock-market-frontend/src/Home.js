import React from 'react';

const Home = () => {
  const backgroundImageUrl = "https://img.freepik.com/free-photo/vintage-grunge-blue-concrete-texture-wall-background-with-vignette_1258-28373.jpg";

  return (
    <div 
      style={{
        height: '100vh',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h1 style={{ fontSize: '4rem' }}>Welcome to Your Stock Market Portfolio</h1>
      <p style={{ fontSize: '1.5rem' }}>Start managing your stocks today. Navigate to the stocks or watchlist sections.</p>
    </div>
  );
};

export default Home;
