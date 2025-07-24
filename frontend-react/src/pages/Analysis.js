import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Slider,
  Stack,
  Divider,
  IconButton,
  Collapse
} from '@mui/material';
import {
  PlayArrow,
  Security,
  Warning,
  Error,
  SmartToy,
  Shield,
  BugReport,
  NetworkCheck,
  Computer,
  Close,
  Storage,
  CheckCircle,
  ErrorOutline
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Header from '../components/Layout/Header';

// Styled components
const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

function Analysis() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [duration, setDuration] = useState(20);
  const [connectionType, setConnectionType] = useState('wifi');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ message: '', percentage: 0 });
  const [results, setResults] = useState(null);
  const [alert, setAlert] = useState(null);
  const [databaseStatus, setDatabaseStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Check database status on load
  useEffect(() => {
    axios.get('/api/test').then(res => setBackendStatus(res.data)).catch(() => setBackendStatus(null));
    checkDatabaseStatus();
  }, []);

  // Reset pagination when results change
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  const checkDatabaseStatus = async () => {
    try {
      const response = await axios.get('/database/status');
      setDatabaseStatus(response.data);
    } catch (error) {
      console.error('Error checking database:', error);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const updateProgress = (message, percentage) => {
    setProgress({ message, percentage });
  };

  const startAnalysis = async () => {
    if (!duration || !connectionType) {
      showAlert('Por favor, complete todos los campos.', 'error');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    updateProgress('1. Preparando captura de tráfico...', 20);

    try {
      updateProgress('2. Capturando tráfico de red...', 40);

      const response = await axios.post('/analyze', {
        duration: parseInt(duration),
        connection_type: connectionType
      });

      if (response.data.success) {
        updateProgress('3. Procesando con Machine Learning...', 80);

        setTimeout(() => {
          updateProgress('✓ Análisis completado con éxito', 100);
          setResults(response.data);
          setIsAnalyzing(false);
          showAlert(
            `Análisis completado: ${response.data.summary.total_flows} flujos procesados con ${response.data.summary.columns_count} características`,
            'success'
          );
          checkDatabaseStatus();
        }, 1000);
      } else {
        throw new Error(response.data.error || 'Error desconocido en el análisis');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert(`❌ Error en el análisis: ${error.response?.data?.detail || error.message}`, 'error');
      setIsAnalyzing(false);
      setProgress({ message: '', percentage: 0 });
    }
  };

  // Helper functions for result display
  const LABEL_MAP = {
    'BENIGN': 'BENIGN',
    'Bot': 'Bot',
    'BruteForce': 'Brute Force',
    'Brute Force': 'Brute Force',
    'DDoS': 'DDoS',
    'DoS': 'DoS',
    'PortScan': 'Port Scan',
    'Port Scan': 'Port Scan',
    'WebAttack': 'Web Attack',
    'Web Attack': 'Web Attack',
    'Unknown': 'Unknown'
  };

  const getSummary = (rows) => {
    const threatCounts = {
      'BENIGN': 0,
      'Bot': 0,
      'Brute Force': 0,
      'DDoS': 0,
      'DoS': 0,
      'Port Scan': 0,
      'Web Attack': 0,
      'Unknown': 0
    };
    rows.forEach(row => {
      const rawLabel = row.Prediction;
      const label = LABEL_MAP[rawLabel] || 'Unknown';
      if (threatCounts.hasOwnProperty(label)) {
        threatCounts[label]++;
      } else {
        threatCounts['Unknown']++;
      }
    });
    return threatCounts;
  };

  const getThreatIcon = (threatType) => {
    const iconMap = {
      'BENIGN': <CheckCircle color="success" />,
      'Bot': <SmartToy color="error" />,
      'Brute Force': <Security color="error" />,
      'DDoS': <NetworkCheck color="error" />,
      'DoS': <Warning color="error" />,
      'Port Scan': <BugReport color="warning" />,
      'Web Attack': <Computer color="warning" />,
      'Unknown': <ErrorOutline color="disabled" />
    };
    return iconMap[threatType] || <ErrorOutline color="disabled" />;
  };

  const getThreatColor = (threatType) => {
    const colorMap = {
      'BENIGN': 'success',
      'Bot': 'error',
      'Brute Force': 'error',
      'DDoS': 'error',
      'DoS': 'error',
      'Port Scan': 'warning',
      'Web Attack': 'warning',
      'Unknown': 'default'
    };
    return colorMap[threatType] || 'default';
  };

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Backend Status */}
          {backendStatus && (
            <Alert 
              severity="info" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-message': { width: '100%' }
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Backend:
                  </Typography>
                  <Typography variant="body2">
                    {backendStatus.message}
                  </Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  {backendStatus.timestamp}
                </Typography>
              </Box>
            </Alert>
          )}

          {/* Alert */}
          <Collapse in={!!alert}>
            {alert && (
              <Alert 
                severity={alert.type === 'error' ? 'error' : 'success'}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setAlert(null)}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
                sx={{ borderRadius: 2 }}
              >
                {alert.message}
              </Alert>
            )}
          </Collapse>

          {/* Database Status */}
          {databaseStatus && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Storage color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Estado de la Base de Datos
                  </Typography>
                </Box>
                <Chip
                  icon={databaseStatus.status === 'connected' ? <CheckCircle /> : <ErrorOutline />}
                  label={databaseStatus.status === 'connected' ? 'Conectado' : 'Error'}
                  color={databaseStatus.status === 'connected' ? 'success' : 'error'}
                  variant="outlined"
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {databaseStatus.total_records || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Registros Totales
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {databaseStatus.database || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Base de Datos
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {databaseStatus.host}:{databaseStatus.port}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      PostgreSQL
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Analysis Form */}
          <StyledPaper elevation={4}>
            <Box maxWidth={500} mx="auto">
              <Typography variant="h5" textAlign="center" mb={4} fontWeight="bold" color="primary">
                Configuración del Análisis
              </Typography>
              
              <Stack spacing={4}>
                {/* Duration Slider */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Duración de Captura: {duration} segundos
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption">5s</Typography>
                    <Slider
                      value={duration}
                      onChange={(e, value) => setDuration(value)}
                      min={5}
                      max={60}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ flex: 1 }}
                    />
                    <Typography variant="caption">60s</Typography>
                    <TextField
                      type="number"
                      value={duration}
                      onChange={(e) => {
                        const value = Math.min(60, Math.max(5, parseInt(e.target.value) || 5));
                        setDuration(value);
                      }}
                      inputProps={{ min: 5, max: 60 }}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  </Stack>
                </Box>

                {/* Connection Type */}
                <FormControl fullWidth>
                  <InputLabel>Tipo de Conexión</InputLabel>
                  <Select
                    value={connectionType}
                    label="Tipo de Conexión"
                    onChange={(e) => setConnectionType(e.target.value)}
                  >
                    <MenuItem value="wifi">WiFi</MenuItem>
                    <MenuItem value="ethernet">Ethernet</MenuItem>
                    <MenuItem value="mobile">Móvil</MenuItem>
                  </Select>
                </FormControl>

                {/* Start Analysis Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  startIcon={isAnalyzing ? <CircularProgress size={20} /> : <PlayArrow />}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                    }
                  }}
                >
                  {isAnalyzing ? 'Analizando...' : 'Iniciar Análisis'}
                </Button>
              </Stack>
            </Box>
          </StyledPaper>

          {/* Progress Indicator */}
          {isAnalyzing && (
            <GradientCard elevation={4}>
              <CardContent>
                <Box textAlign="center">
                  <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Analizando Tráfico de Red
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                    {progress.message}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress.percentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'white'
                      }
                    }} 
                  />
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="body2">
                      Progreso: {progress.percentage}%
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Shield fontSize="small" />
                      <Typography variant="body2">
                        ML Engine Active
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </GradientCard>
          )}

          {/* Results Section */}
          {results && (() => {
            const summary = getSummary(results.full_data || []);
            const threatTypes = ['BENIGN', 'Bot', 'Brute Force', 'DDoS', 'DoS', 'Port Scan', 'Web Attack', 'Unknown'];
            
            return (
              <Stack spacing={4}>
                {/* Summary Cards */}
                <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h4" textAlign="center" mb={4} fontWeight="bold" color="primary">
                    Resultado del Análisis
                  </Typography>
                  
                  <Grid container spacing={3} justifyContent="center">
                    {threatTypes.map(threatType => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={threatType}>
                        <Card 
                          elevation={2} 
                          sx={{ 
                            borderRadius: 2,
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-4px)' }
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Box mb={1}>
                              {getThreatIcon(threatType)}
                            </Box>
                            <Typography variant="h4" fontWeight="bold" color={getThreatColor(threatType) + '.main'}>
                              {summary[threatType] || 0}
                            </Typography>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {threatType}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {threatType === 'BENIGN' ? 'Tráfico seguro' : 'Amenaza detectada'}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="body1" textAlign="center" color="textSecondary">
                    {results.summary.total_flows} flujos procesados • {results.summary.columns_count} características procesadas
                  </Typography>
                </Paper>

                {/* Detailed Results Table */}
                {results.full_data && results.full_data.length > 0 && (
                  <Paper elevation={2} sx={{ borderRadius: 2 }}>
                    <Box p={3}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        Resultados Detallados
                      </Typography>
                    </Box>
                    
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: 'grey.100' }}>
                            {(() => {
                              const backendColOrder = ['Prediction', 'Confidence', 'Flow Duration'];
                              const allCols = Object.keys(results.full_data[0]).filter(col => col.toLowerCase() !== 'label');
                              const ordered = [
                                ...backendColOrder.filter(c => allCols.includes(c)),
                                ...allCols.filter(col => !backendColOrder.includes(col))
                              ];
                              return ordered.map((col) => (
                                <TableCell key={col} align="center" sx={{ fontWeight: 'bold' }}>
                                  {col}
                                </TableCell>
                              ));
                            })()}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.full_data
                            .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                            .map((row, i) => (
                              <TableRow key={i} hover>
                                {(() => {
                                  const backendColOrder = ['Prediction', 'Confidence', 'Flow Duration'];
                                  const allCols = Object.keys(row).filter(key => key.toLowerCase() !== 'label');
                                  const ordered = [
                                    ...backendColOrder.filter(c => allCols.includes(c)),
                                    ...allCols.filter(col => !backendColOrder.includes(col))
                                  ];
                                  return ordered.map((key, j) => {
                                    let val = row[key];
                                    if (key === 'Prediction') {
                                      const normalized = LABEL_MAP[val] || val;
                                      return (
                                        <TableCell key={j} align="center">
                                          <Chip
                                            label={normalized}
                                            color={getThreatColor(normalized)}
                                            variant="outlined"
                                            size="small"
                                          />
                                        </TableCell>
                                      );
                                    }
                                    if (key === 'Confidence' && typeof val === 'number') {
                                      return (
                                        <TableCell key={j} align="center">
                                          <Typography variant="h6" fontWeight="bold">
                                            {`${Math.round(val * 100)}%`}
                                          </Typography>
                                        </TableCell>
                                      );
                                    }
                                    return (
                                      <TableCell key={j} align="center">
                                        {val}
                                      </TableCell>
                                    );
                                  });
                                })()}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    {/* Pagination */}
                    <Box display="flex" justifyContent="center" p={3}>
                      <Pagination
                        count={Math.ceil(results.full_data.length / recordsPerPage)}
                        page={currentPage}
                        onChange={(e, page) => setCurrentPage(page)}
                        color="primary"
                        size="large"
                      />
                    </Box>
                  </Paper>
                )}
              </Stack>
            );
          })()}
        </Stack>
      </Container>
    </>
  );
}

export default Analysis;