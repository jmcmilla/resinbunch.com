'use client';

import React from 'react';
import { AdminContext } from '../context';
import axios from 'axios';
import { Alert, AlertTitle, Button, Container, Grid, ImageList, ImageListItem, Paper, Stack, Typography } from "@mui/material";

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      products: [],
      count: 0,
      scannedCount: 0,
      error: false,
    };
  }
  static contextType = AdminContext;
  async loadProducts() {
    const copy = JSON.parse(JSON.stringify(this.state));
    const { data } = await this.context.callAPI({
      method: 'GET',
      url:'/product'
    });
    if (data['Items']) {
      copy.products = data['Items'];
      copy.count = data['Count'];
      copy.scannedCount = data['ScannedCount'];
    }
    copy.loaded = true;
    this.setState(copy);
    return data;
  }
  componentDidMount() {
    this.loadProducts().catch((e) => {
      console.log(e);
      this.setState( { error: e.message });
    });
  }
  render() {
    return (
      <Container maxWidth="xl">
        <Paper>
          <Grid container spacing={1}>
            <Grid size={12}>
              {this.state.error && (
                <Alert severity="error">
                  <AlertTitle>Error:</AlertTitle>
                  {this.state.error}
                </Alert>
              )}
              <Typography variant="h4">Products</Typography>

            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default Admin;
