import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Fade, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Page components
import Welcome from '../pages/Welcome';
import Dashboard from '../pages/Dashboard';
import Analysis from '../pages/Analysis';

// Styled components
const RouteContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  position: 'relative',
  overflowY: 'auto',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    pointerEvents: 'none',
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  gap: theme.spacing(3),
}));

const AnimatedRoute = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  minHeight: '100vh',
}));

// Loading component for route transitions
const RouteLoading = () => (
  <LoadingContainer>
    <CircularProgress 
      size={80} 
      thickness={4}
      sx={{ 
        color: 'white',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
      }} 
    />
    <Typography 
      variant="h5" 
      fontWeight="bold"
      sx={{ 
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        opacity: 0.9 
      }}
    >
      Cargando...
    </Typography>
    <Typography 
      variant="body2" 
      sx={{ 
        opacity: 0.7,
        textAlign: 'center',
        maxWidth: 300 
      }}
    >
      Preparando la interfaz del analizador de tráfico
    </Typography>
  </LoadingContainer>
);

// Enhanced route component with animations
const RouteWrapper = ({ children, ...props }) => (
  <Fade in={true} timeout={500}>
    <AnimatedRoute {...props}>
      {children}
    </AnimatedRoute>
  </Fade>
);

// Error boundary for route errors
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <RouteContainer>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            p={4}
            textAlign="center"
          >
            <Typography variant="h4" color="error" gutterBottom fontWeight="bold">
              Error de Navegación
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
              Ha ocurrido un error al cargar esta página. Por favor, intenta recargar la aplicación.
            </Typography>
            <Box
              component="button"
              onClick={() => window.location.reload()}
              sx={{
                px: 3,
                py: 1.5,
                border: 'none',
                borderRadius: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                },
              }}
            >
              Recargar Aplicación
            </Box>
          </Box>
        </RouteContainer>
      );
    }

    return this.props.children;
  }
}

// Main router component
function AppRouter() {
  return (
    <RouteErrorBoundary>
      <RouteContainer>
        <React.Suspense fallback={<RouteLoading />}>
          <Routes>
            {/* Welcome/Home Route */}
            <Route 
              path="/" 
              element={
                <RouteWrapper>
                  <Welcome />
                </RouteWrapper>
              } 
            />
            
            {/* Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={
                <RouteWrapper>
                  <Dashboard />
                </RouteWrapper>
              } 
            />
            
            {/* Analysis Route */}
            <Route 
              path="/analysis" 
              element={
                <RouteWrapper>
                  <Analysis />
                </RouteWrapper>
              } 
            />
            
            {/* Redirect unknown routes to home */}
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </React.Suspense>
      </RouteContainer>
    </RouteErrorBoundary>
  );
}

export default AppRouter;