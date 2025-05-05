/*
 * src/app/(public)/products/page.js
 * Copyright (c) James R. McMillan
 */


'use client';

import { Component } from 'react';
import { Alert, AlertTitle, Box, Button, CircularProgress, Container, Grid, ImageList, ImageListItem, ImageListItemBar, Paper, Stack, TextField, Typography } from "@mui/material";
import { callAPI, checkQueue, formatCurrency } from '../utils.js';
import ImageGallery from './ImageGallery.js';

export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      keyword: '',
      products: [],
      display: [],
    };
    this.applyFilter = this.applyFilter.bind(this);
  }
  componentDidMount() {
    checkQueue();
    const request = {
      url: '/product',
      method: 'GET',
    };
    callAPI(request).then((data) => {
      const { keyword } = this.state;
      let display = data.filter((p) => p.price > 0 && p.available > 0);
      if (keyword) {
        display = display.filter((p) => {
          const exp = new RegExp('.*' + keyword + '.*', 'gi');
          return exp.test(p.description);
        });
      }
      display = display.sort((a, b) => a.description.localeCompare(b.description));
      this.setState({ loaded: true, error: false, products: data, display });
    }).catch((e) => {
      this.setState({ loaded: true, error: e.message });
    });
  }
  applyFilter() {
    const copy = JSON.parse(JSON.stringify(this.state));
    let { keyword, products } = copy;
    let display = products.filter((p) => p.price > 0 && p.available > 0);
    if (keyword) {
      display = products.filter((p) => {
        const exp = new RegExp('.*' + keyword + '.*', 'gi');
        return exp.test(p.description);
      });
    }
    copy.display = display;
    this.setState(copy);
  }
  render() {
    const { display } = this.state;
    return (
      <Container maxWidth="md">
        <Typography variant="h2">Products</Typography>
        <Grid container>
          <Grid size={11}>
            <TextField fullWidth variant="outlined" label="Keyword" value={this.state.keyword} onInput={(evt) => {
              this.setState({ keyword: evt.target.value });
            }} />
          </Grid>
          <Grid size={1}>
            <Button sx={{ height: '100%' }} fullWidth={true} onClick={this.applyFilter} variant="contained">Filter</Button>
          </Grid>
        </Grid>
        {this.state.error && (
          <Alert severity="error">
            <AlertTitle>Error:</AlertTitle>
            {this.state.error}
          </Alert>
        )}
        {!this.state.loaded && (
          <center><CircularProgress /></center>
        )}
        <Grid container space={1} size={12} sx={{ display: { xs: 'none', md: 'flex' }, padding: { md: '5px' } }}>
          <Grid size={{ md: 8, xs: 12 }}>
            <Typography variant="h6">Description</Typography>
          </Grid>
          <Grid size={{ md: 3, xs: 12 }} sx={{ textAlign: 'center' }}>
            <Typography variant="h6">Available</Typography>
          </Grid>
          <Grid size={{ md: 1, xs: 12 }} sx={{ textAlign: 'right' }}>
            <Typography variant="h6">Price</Typography>
          </Grid>
        </Grid>
        {
          display && display.map((p, idx) => {
            return (
              <Grid container space={1} size={12} key={p.id} sx={{ padding: '5px', backgroundColor: (idx%2 === 0 ? 'rgba(128,128,128,.4)' : 'auto' )}}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box sx={{ display: { xs: 'inline', md: 'none' } }}>
                    <Typography variant="body1">Description</Typography>
                  </Box>
                  <Typography variant="h6">{p.description}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: { md: 'center' }}}>
                  <Box sx={{ display: { xs: 'inline', md: 'none' }}}>
                    <Typography variant="body1">Available</Typography>
                  </Box>
                  <Typography variant="h6">{p.available}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 1 }} sx={{ textAlign: { md: 'right' }}}>
                  <Box sx={{ display: { xs: 'inline', md: 'none' } }}>
                    <Typography variant="body1">Price</Typography>
                  </Box>
                  <Typography variant="h6">{formatCurrency(p.price)}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: { xs: 'inline', md: 'none' } }}>
                    <Typography variant="body1">Images</Typography>
                  </Box>
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
