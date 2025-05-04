/* eslint-disable @next/next/no-img-element */
'use client';

import { Component } from 'react';
import { Alert, AlertTitle, Button, CircularProgress, Container, Grid, ImageList, ImageListItem, ImageListItemBar, Paper, Stack, Typography } from "@mui/material";
import { callAPI, checkQueue, formatCurrency } from '../utils.js';
import ImageGallery from './ImageGallery.js';

export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      products: [],
    };
  }
  componentDidMount() {
    checkQueue();
    const request = {
      url: '/product',
      method: 'GET',
    };
    callAPI(request).then((data) => {
      this.setState({ loaded: true, error: false, products: data.sort((a,b) => a.id - b.id) });
    }).catch((e) => {
      this.setState({ loaded: true, error: e.message });
    });
  }
  render() {
    return (
      <Container maxWidth="md">
        <Typography variant="h2">Products</Typography>
        {this.state.error && (
          <Alert severity="error">
            <AlertTitle>Error:</AlertTitle>
            {this.state.error}
          </Alert>
        )}
        {!this.state.loaded && (
          <center><CircularProgress /></center>
        )}
        {
          this.state.loaded && this.state.products.filter((p) => p.price > 0 ).map((p, idx) => {
            return (
              <Grid container space={1} size={12} key={p.id} sx={{ padding: '5px', backgroundColor: (idx%2 === 0 ? 'rgba(128,128,128,.4)' : 'auto' )}}>
                <Grid size={{ xs: 11 }}>
                  <Typography variant="h6">{p.description}</Typography>
                </Grid>
                <Grid size={{ xs: 1 }} sx={{ textAlign: 'right' }}>
                  <Typography variant="h6">{formatCurrency(p.price)}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <ImageGallery product_id={p.id} />
                </Grid>
              </Grid>
            );
          })
        }
      </Container>
    );
  }
}
