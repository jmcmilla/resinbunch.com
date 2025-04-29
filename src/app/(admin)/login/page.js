'use client';
import { Alert, AlertTitle, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { Component } from 'react';
import axios from 'axios';
import { AdminContext } from '../context';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
  }
  static contextType = AdminContext;
  async handleLogin(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    try {
      const { username, password } = this.state;
      const { data } = await axios.post('https://api.resinbunch.com/auth', { username, password});
      this.context.setToken(data.access_token);
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.has('returnTo')) {
        window.location.href = queryParams.get('returnTo');
      } else {
        window.location.href = '/admin';
      }
    } catch (e) {
      console.error(e);
      this.setState({ error: 'Invalid Username or Password' });
    }
  }
  render() {
    return (
        <Container maxWidth="md">
          <Paper>
            <Grid container padding={3} spacing={2}>
              <Grid size={12}>
                <Typography variant="h6">Login</Typography>
              </Grid>
              {this.state.error && (
                <Alert sx={{ width: '100%' }} severity="error" variant="outlined">
                  <AlertTitle>Error</AlertTitle>
                  {this.state.error}
                </Alert>
              )}
              <Grid size={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Username"
                  value={this.state.username}
                  onInput={(evt) => this.setState({ username: evt.target.value })}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={this.state.password}
                  onInput={(evt) => this.setState({ password: evt.target.value })}
                />
              </Grid>
              <Grid size={12}>
                <Button onClick={this.handleLogin} fullWidth variant="contained">Login</Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
    );
  }
}
