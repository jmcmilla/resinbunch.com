/* eslint-disable @next/next/no-img-element */
'use client';

import { Component } from 'react';
import { Alert, AlertTitle, Button, CircularProgress, Container, Grid, ImageList, ImageListItem, ImageListItemBar, Paper, Stack, Typography } from "@mui/material";
import { callAPI, formatCurrency } from '../utils.js';

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
    const request = {
      url: '/product',
      method: 'GET',
    };
    callAPI(request).then((data) => {
      this.setState({ loaded: true, error: false, products: data });
    }).catch((e) => {
      this.setState({ loaded: true, error: e.message });
    });
  }
  render() {
    return (
      <Container maxWidth="xl">
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
          this.state.loaded && this.state.products.map((p) => {
            return (
              <Grid container size={12} key={p.id}>
                <Grid size={11}>
                  <Typography variant="h6">{p.description}</Typography>
                </Grid>
                <Grid size={1}>
                  <Typography variant="h6">{formatCurrency(p.price)}</Typography>
                </Grid>
                <Grid size={12}>
                  <ImageList>
                    {
                      p.images.map((i) => (
                        <ImageListItem key={i.uuid}>
                          <img src={i.data} alt={i.caption} />
                          <ImageListItemBar
                            title={i.caption}
                            position="below"
                          />
                        </ImageListItem>
                      ))
                    }
                  </ImageList>
                </Grid>
              </Grid>
            );
          })
        }
      </Container>
    );
  }
}
