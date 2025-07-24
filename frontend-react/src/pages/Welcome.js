import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PlayArrow,
  NetworkCheck,
  DataObject,
  FilterList,
  Transform,
  Psychology,
  ArrowDownward
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import wiresharkImg from '../assets/images/wireshark.png'; 
import flometerImg from '../assets/images/flometer.png'; 
import preprocesadorImg from '../assets/images/preprocesador.png'; 
import pcaImg from '../assets/images/pca.png'; 
import modeloImg from '../assets/images/modelo_random_forest.png'; 

// Styled components
const GradientBackground = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6, 2),
}));

const ProcessCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, #2a2a3e 0%, #1e1e2e 100%)',
  border: `1px solid ${theme.palette.grey[700]}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  maxWidth: '1000px',
  width: '100%',
  color: 'white',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
}));

const ProcessStep = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: `1px solid rgba(255, 255, 255, 0.1)`,
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
    border: `1px solid rgba(59, 130, 246, 0.4)`,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 96,
  height: 96,
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  border: `2px solid rgba(59, 130, 246, 0.3)`,
  marginBottom: theme.spacing(2),
}));

const ArrowIcon = styled(ArrowDownward)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
  opacity: 0.8,
  animation: 'bounce 2s infinite',
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateY(0)',
    },
    '40%': {
      transform: 'translateY(-10px)',
    },
    '60%': {
      transform: 'translateY(-5px)',
    },
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.2rem',
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #45a049 30%, #388e3c 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
  },
}));

function Welcome() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const processSteps = [
    {
      title: 'Captura red con Wireshark',
      description: 'Captura de tráfico de red en tiempo real',
      image: wiresharkImg,
      icon: <NetworkCheck />,
      color: '#ff6b6b'
    },
    {
      title: 'Flometer (.pcap)',
      description: 'Procesamiento de archivos de captura',
      image: flometerImg,
      icon: <DataObject />,
      color: '#4ecdc4'
    },
    {
      title: 'Selección de Columnas',
      description: 'Filtrado y selección de características relevantes',
      image: preprocesadorImg,
      icon: <FilterList />,
      color: '#45b7d1'
    },
    {
      title: 'PCA .joblib',
      description: 'Análisis de componentes principales',
      image: pcaImg,
      icon: <Transform />,
      color: '#96ceb4'
    },
    {
      title: 'Modelo Random Forest .joblib',
      description: 'Clasificación con Machine Learning',
      image: modeloImg,
      icon: <Psychology />,
      color: '#ffeaa7'
    }
  ];

  return (
    <>
      <Header />
      
      <GradientBackground>
        <Container maxWidth="lg">
          <ProcessCard elevation={24}>
            {/* Header */}
            <Box textAlign="center" mb={6}>
              <Typography 
                variant="h3" 
                component="h1" 
                fontWeight="bold" 
                color="white" 
                gutterBottom
                sx={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  mb: 3 
                }}
              >
                Proceso de Detección
              </Typography>
              
              <Typography 
                variant="h6" 
                color="rgba(255, 255, 255, 0.8)" 
                sx={{ 
                  maxWidth: 600, 
                  mx: 'auto', 
                  mb: 3,
                  lineHeight: 1.6 
                }}
              >
                Este diagrama representa el flujo del proceso de Machine Learning con las siguientes tecnologías:
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={1} 
                justifyContent="center" 
                flexWrap="wrap"
                gap={1}
              >
                <Chip 
                  label="Random Forest" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                />
                <Chip 
                  label="PCA" 
                  color="secondary" 
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                />
                <Chip 
                  label="Redes Neuronales" 
                  color="info" 
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                />
              </Stack>
            </Box>

            {/* Process Steps */}
            {isMobile ? (
              // Mobile: Stepper vertical
              <Stepper orientation="vertical" sx={{ mb: 6 }}>
                {processSteps.map((step, index) => (
                  <Step key={index} active={true}>
                    <StepLabel
                      StepIconComponent={() => (
                        <StyledAvatar>
                          <img
                            src={step.image}
                            alt={step.title}
                            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                          />
                        </StyledAvatar>
                      )}
                    >
                      <Typography variant="h6" color="white" fontWeight="bold">
                        {step.title}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography color="rgba(255, 255, 255, 0.7)">
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            ) : (
              // Desktop: Layout vertical centrado
              <Stack spacing={4} alignItems="center" sx={{ mb: 6 }}>
                {processSteps.map((step, index) => (
                  <React.Fragment key={index}>
                    <ProcessStep elevation={4}>
                      <CardContent sx={{ textAlign: 'center', p: 4 }}>
                        <StyledAvatar sx={{ mx: 'auto' }}>
                          <img
                            src={step.image}
                            alt={step.title}
                            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                          />
                        </StyledAvatar>
                        
                        <Typography 
                          variant="h6" 
                          color="white" 
                          fontWeight="bold" 
                          gutterBottom
                        >
                          {step.title}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          color="rgba(255, 255, 255, 0.7)"
                        >
                          {step.description}
                        </Typography>
                      </CardContent>
                    </ProcessStep>
                    
                    {/* Arrow between steps (except last) */}
                    {index < processSteps.length - 1 && (
                      <ArrowIcon />
                    )}
                  </React.Fragment>
                ))}
              </Stack>
            )}

            {/* Action Button */}
            <Box textAlign="center">
              <GradientButton
                component={Link}
                to="/analysis"
                startIcon={<PlayArrow />}
                size="large"
              >
                Nuevo Análisis
              </GradientButton>
            </Box>
          </ProcessCard>
        </Container>
      </GradientBackground>
    </>
  );
}

export default Welcome;