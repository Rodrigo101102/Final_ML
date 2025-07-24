import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { styled } from '@mui/material/styles';

// Components
import AppRouter from './routes/AppRouter';

// Theme
import theme from './theme';

// Global styles
const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        height: '100%',
        scrollBehavior: 'smooth',
      },
      body: {
        height: '100%',
        margin: 0,
        padding: 0,
        fontFamily: theme.typography.fontFamily,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        overflowY: 'auto',
      },
      '#root': {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
      // Custom scrollbar
      '*::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '*::-webkit-scrollbar-track': {
        background: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
      },
      '*::-webkit-scrollbar-thumb': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '10px',
        '&:hover': {
          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
        },
      },
      // Loading animations
      '@keyframes fadeIn': {
        from: {
          opacity: 0,
          transform: 'translateY(20px)',
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
      '@keyframes slideInFromLeft': {
        from: {
          opacity: 0,
          transform: 'translateX(-100px)',
        },
        to: {
          opacity: 1,
          transform: 'translateX(0)',
        },
      },
      '@keyframes pulse': {
        '0%': {
          transform: 'scale(1)',
        },
        '50%': {
          transform: 'scale(1.05)',
        },
        '100%': {
          transform: 'scale(1)',
        },
      },
      // Animation classes
      '.fade-in': {
        animation: 'fadeIn 0.6s ease-out',
      },
      '.slide-in-left': {
        animation: 'slideInFromLeft 0.8s ease-out',
      },
      '.pulse-hover:hover': {
        animation: 'pulse 0.3s ease-in-out',
      },
      // Utility classes
      '.gradient-text': {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
      '.glass-effect': {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
      },
      // Focus styles for accessibility
      '*:focus-visible': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: '2px',
        borderRadius: '4px',
      },
      // Print styles
      '@media print': {
        body: {
          background: 'white !important',
        },
        '*': {
          color: 'black !important',
          background: 'white !important',
        },
      },
    })}
  />
);

// Styled app container
const AppContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  position: 'relative',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    zIndex: -2,
  },
  '&::after': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
    `,
    zIndex: -1,
    pointerEvents: 'none',
  },
}));

// Error boundary component
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {globalStyles}
          <AppContainer>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              padding: '2rem',
              textAlign: 'center',
              color: 'white'
            }}>
              <h1 style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                ¡Oops! Algo salió mal
              </h1>
              <p style={{ 
                fontSize: '1.2rem', 
                marginBottom: '2rem',
                opacity: 0.9,
                maxWidth: '600px'
              }}>
                Ha ocurrido un error inesperado en la aplicación ML Traffic Analyzer. 
                Por favor, recarga la página para continuar.
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(33, 150, 243, 0.3)';
                }}
              >
                Recargar Aplicación
              </button>
              
              {/* Development error details */}
              {process.env.NODE_ENV === 'development' && (
                <details style={{ 
                  marginTop: '2rem', 
                  textAlign: 'left',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '1rem',
                  borderRadius: '8px',
                  maxWidth: '800px',
                  overflow: 'auto'
                }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Detalles del Error (Desarrollo)
                  </summary>
                  <pre style={{ 
                    fontSize: '0.8rem', 
                    marginTop: '1rem',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </AppContainer>
        </ThemeProvider>
      );
    }

    return this.props.children;
  }
}

// Main App component
function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        <AppContainer>
          <AppRouter />
        </AppContainer>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;