import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  IconButton,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Security as SecurityIcon,
  FiberManualRecord as FiberManualRecordIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const Header = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isActive = (path) => location.pathname === path;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/analysis', label: 'Análisis' },
    { path: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <AppBar 
      position="static" 
      sx={{
        background: 'linear-gradient(90deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ minHeight: '64px !important', py: 1 }}>
          {/* Logo y título */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none',
              '&:hover': { opacity: 0.8 }
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                mr: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <SecurityIcon />
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                component="h1"
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                  mb: 0.2
                }}
              >
                Análisis de Tráfico de Red
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.75rem'
                }}
              >
                Random Forest
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Navegación Desktop */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant={isActive(item.path) ? 'contained' : 'text'}
                  sx={{
                    color: isActive(item.path) ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: isActive(item.path) ? 'rgba(59, 130, 246, 0.8)' : 'transparent',
                    minWidth: item.label === 'Dashboard' ? 100 : 80,
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.7)',
                      color: 'white'
                    },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Navegación Mobile */}
          {isMobile && (
            <Box sx={{ mr: 2 }}>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {navigationItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={handleMenuClose}
                    selected={isActive(item.path)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {/* Estado Activo */}
          <Chip
            icon={
              <FiberManualRecordIcon 
                sx={{ 
                  color: '#4ade80 !important',
                  animation: 'pulse 2s infinite'
                }} 
              />
            }
            label="Activo"
            sx={{
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              color: '#4ade80',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              fontWeight: 500,
              '& .MuiChip-icon': {
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 }
                }
              }
            }}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;