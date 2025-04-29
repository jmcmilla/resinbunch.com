'use client';
/* eslint-disable @next/next/no-img-element */
import React, { Component } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import { Container, Button, Stack } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export default class PublicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: undefined,
    };
    this.getVariant = this.getVariant.bind(this);
  }
  componentDidMount() {
    if ('undefined' !== typeof window) {
      const pathName = window.location.pathname;
      let current_page;
      if (pathName == '/' || pathName == '/index.html') {
        current_page = 'home';
      } else if (pathName == '/contact-us/' || pathName == '/contact-us/index.html') {
        current_page = 'contact-us';
      }
      this.setState({ current_page });
    }
  }
  getVariant(p) {
    if ('undefined' !== typeof window) {
    }
    let v = 'text';
    const copy = JSON.parse(JSON.stringify(this.state));
    const { pathName } = copy;
    if (pathName == p || pathName == p + '/index.html') {
      v = 'contained';
    }
    console.log('variant: ', pathName, v);
    return v;
  }
  render() {
    let body = (<div></div>);
    if (this.state) {
      const copy = JSON.parse(JSON.stringify(this.state));
      body = (
        <div>
          <Container maxWidth={false} style={{
            backgroundImage: `url('/background.jpg')`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: '0px -585px',
            backgroundRepeat: 'no-repeat',
          }}>
            <img
              width="150px"
              alt="The Resin Bunch" src="/logo.jpg"
            />
          </Container>
          <Stack direction="row">
            <Button
              variant={copy.current_page == 'home' ? 'contained' : 'text' }
              onClick={(evt) => {
                if ('undefined' !== typeof window) {
                  window.location.href = '/';
                }
              }}
            >Home</Button>
            <Button
              variant={copy.current_page == 'contact-us' ? 'contained' : 'text' }
              onClick={(evt) => {
                window.location.href = '/contact-us';
              }}
            >Contact Us</Button>
          </Stack>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              {this.props.children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </div>
      );
    }
    return body;
  }
}

