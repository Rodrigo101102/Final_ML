import React from 'react';
import Header from '../components/Layout/Header';

function Dashboard() {
  return (
    <>
      <Header />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: 'calc(100vh - 64px)', // asumiendo header de 64px
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        margin: 0,
        padding: 0,
      }}>
        <iframe
          title="Dashboard_ML"
          width="100%"
          height="100%"
          src="https://app.powerbi.com/view?r=eyJrIjoiMWQ2NTUxYzgtOWFkMC00NDk3LWFjMGMtMWQ2ZGEyMWIyMGQzIiwidCI6ImM2MjU5ZjJlLTg2YTAtNDI2Yi05NWUwLTZjZTMzY2FlMTc1ZiIsImMiOjR9"
          frameBorder="0"
          allowFullScreen={true}
          style={{ border: 0, minHeight: '100%', minWidth: '100%' }}
        />
      </div>
    </>
  );
}

export default Dashboard;