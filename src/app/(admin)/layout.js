'use client';

import { AdminContext } from './context';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import axios from 'axios';

import { Button, Box, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';


import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export default function AdminLayout({ children }) {
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('token');
    } else {
      return false;
    }
  };
  const setToken = (val) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('token', val);
    }
  };
  const clearToken = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('token');
    }
  };
  const callAPI = async (config) => {
    try {
      const token = getToken();
      config.baseURL = 'https://api.resinbunch.com'
      config.headers = {
        'Authorization': 'Bearer ' + token,
      };
      const result = await axios(config);
      return result;
    } catch (e) {
      if (e.response?.status && e.response?.status === 403) {
        alert('Session Expired');
        clearToken();
        window.location.reload();
      }
    }

  }
  const token = getToken();
  const authenticated = token ? true : false;
  if (!token && (typeof window !== 'undefined' && !/\/login\/?/.test(window.location.pathname))) {
    return window.location.href = '/login?returnTo=' + encodeURIComponent(window.location.pathname);
  }
  return (
    <AdminContext.Provider value={{
      getToken,
      setToken,
      token,
      authenticated,
      callAPI,
    }}>
      <Box sx={{ flexGrow: 1, marginBottom: '10px' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Administration
            </Typography>
            {token && (<Button onClick={() => {
              clearToken();
              window.location.reload();
            }} color="inherit">Logout</Button>)}
          </Toolbar>
        </AppBar>
      </Box>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </AdminContext.Provider>
  );
}
