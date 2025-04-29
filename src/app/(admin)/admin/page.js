'use client';

import React from 'react';
import { AdminContext } from '../context';
import axios from 'axios';
import { Alert, AlertTitle, Button, Container, Divider, Grid, ImageList, ImageListItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      view: 'list',
      mode: '',
      products: [],
      count: 0,
      scannedCount: 0,
      id: 0,
      description: '',
      weight: 0,
      material_cost: 0,
      other_cost: 0,
      price: 0,
      error: false,
    };
    this.handleAddNew = this.handleAddNew.bind(this);
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
  handleAddNew(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    this.setState({ view: 'form', mode: 'new' });
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
        <Paper sx={{ padding: '10px' }}>
          {this.state.error && (
            <Alert severity="error">
              <AlertTitle>Error:</AlertTitle>
              {this.state.error}
            </Alert>
          )}
          {this.state.view === 'list' && (
            <Grid container spacing={1}>
              <Grid size={12}>
                <Grid container>
                  <Grid item size={6}>
                    <Typography variant="h4">Products</Typography>
                  </Grid>
                  <Grid item size={6} sx={{ textAlign: 'right' }}>
                    <Button onClick={this.handleAddNew}>Add New</Button>
                  </Grid>
                </Grid>
                <Divider />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Weight</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Other Cost</TableCell>
                        <TableCell>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.products.length === 0 && (
                        <TableRow>
                          <TableCell style={{ textAlign: 'center' }} colSpan={6}>No Data</TableCell>
                        </TableRow>
                      )}
                      {this.state.products.map((row) => {
                        return (
                          <TableRow key={'product_' + row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{row.weight}</TableCell>
                            <TableCell>{row.material_cost}</TableCell>
                            <TableCell>{row.other_cost}</TableCell>
                            <TableCell>{row.price}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
          {this.state.view === 'form' && (
            <Grid container spacing={1}>
              <Grid item size={12}>
                <Typography variant='h4'>{this.state.mode === 'new' ? 'Add New' : 'Edit'} Product</Typography>
              </Grid>
              <Grid item size={{ xs: 12, md: 1 }}>
                <TextField
                  sx={{ textAlign: 'right' }}
                  fullWidth
                  label="Barcode ID"
                  value={this.state.id}
                  onInput={(evt) => {
                    if (evt.target.value === '' || /^[0-9]+$/.test(evt.target.value)) {
                      this.setState({ id: evt.target.value })
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 11 }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={this.state.description}
                  onInput={(evt) => this.setState({ description: evt.target.value })}
                />
              </Grid>
              <Grid item size={{ md: 3, xs: 12}}>
                <TextField
                  fullWidth
                  label="Weight (oz)"
                  value={this.state.weight}
                  onInput={(evt) => {
                    if (evt.target.value === '' || /^\d+$/.test(evt.target.value)) {
                      this.setState({ weight: evt.target.value })
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ md: 3, xs: 12 }}>
                <TextField
                  fullWidth
                  label="Material Cost"
                  value={this.state.material_cost}
                  onInput={(evt) => {
                    if (evt.target.value === '' || /^[0-9]+(\.\d{2})?$/.test(evt.target.value)) {
                      this.setState({ material_cost: evt.target.value })
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ md: 3, xs: 12 }}>
                <TextField
                  fullWidth
                  label="Other Cost"
                  value={this.state.other_cost}
                  onInput={(evt) => {
                    if (evt.target.value === '' || /^[0-9]+(\.\d{2})?$/.test(evt.target.value)) {
                      this.setState({ other_cost: evt.target.value })
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ md: 3, xs: 12 }}>
                <TextField
                  fullWidth
                  label="Price"
                  value={this.state.price}
                  onInput={(evt) => {
                    if (evt.target.value === '' || /^[0-9]+(\.\d{2})?$/.test(evt.target.value)) {
                      this.setState({ price: evt.target.value })
                    }
                  }}
                />
              </Grid>
              <Grid item size={12}>
                <Button variant="outlined" onClick={(evt) => this.setState({ mode: '', view: 'list' })}>Cancel</Button>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Container>
    );
  }
}

export default Admin;
