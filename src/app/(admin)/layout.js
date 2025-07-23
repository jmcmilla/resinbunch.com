'use client';

import { AdminContext } from './context';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import axios from 'axios';

import {
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import { useState } from 'react';


import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
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
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }
      throw e;
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
              onClick={() => {
                setOpen(true);
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Administration
            </Typography>
            {token && (<Button onClick={() => {
              clearToken();
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }} color="inherit">Logout</Button>)}
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: 1,
          justifyContent: 'flex-end',
        }}>
          <Typography variant="h6">Administration</Typography>
          <IconButton onClick={() => {
            setOpen(false);
          }}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem>
            <ListItemButton onClick={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              window.location.href = '/admin';
            }}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={'Products'} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={(evt) => {
              window.location.href = '/admin/pos';
            }}>
              <ListItemIcon>
                <PointOfSaleIcon />
              </ListItemIcon>
              <ListItemText primary={'Checkout'} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={(evt) => {
              window.location.href = '/admin/remote';
            }}>
              <ListItemIcon>
                <MonetizationOnIcon />
              </ListItemIcon>
              <ListItemText primary={'Remote Sales'} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={(evt) => {
              window.location.href = '/admin/sales';
            }}>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary={'Local Sales'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </AdminContext.Provider>
  );
}
