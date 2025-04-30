'use client';

import React from 'react';
import { AdminContext } from '../context';
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
      nextId: 0,
      id: 0,
      description: '',
      category: '',
      weight: 0,
      material_cost: 0,
      other_cost: 0,
      price: 0,
      error: false,
    };
    this.handleAddNew = this.handleAddNew.bind(this);
    this.saveProduct = this.saveProduct.bind(this);
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
      copy.nextId = copy.products.reduce((p, c) => Math.max(p, c.id), 0) + 1;
      console.log('NextID: ', copy.nextId);
    }
    copy.loaded = true;
    this.setState(copy);
    return data;
  }
  async deleteProduct() {
    try {
      const copy = JSON.parse(JSON.stringify(this.state));
      const { id } = copy;
      copy.error = '';
      const request = {
        url: `/product?id=${id}`,
        method: 'DELETE',
      };
      const result = await this.context.callAPI(request);
      if (!result) {
        throw new Error('Unable to delete Product');
      }
      this.setState(copy, this.loadProducts);
    } catch (e) {
      console.error(e);
      this.setState({ error: e.message });
    }
  }
  async saveProduct() {
    try {
      const copy = JSON.parse(JSON.stringify(this.state));
      const { id, description, category, weight, material_cost, other_cost, price } = copy;
      const request = {
        url: '/product',
        data: { id, description, category, weight, material_cost, other_cost, price }
      };
      if (copy.mode === 'new') {
        request.data.id = this.state.nextId;
        request.method = 'POST';
      } else {
        request.method = 'PUT';
      }
      const result = await this.context.callAPI(request);
      if ( !result) {
        throw new Error('Unable to save Product');
      }
      const { data } = result;
      copy.mode = '';
      copy.view = 'list';
      copy.id = 0;
      copy.description = '';
      copy.weight = 0;
      copy.material_cost = 0;
      copy.other_cost = 0;
      copy.price = 0;
      this.setState(copy, this.loadProducts);
    } catch (e) {
      console.error(e);
      this.setState({ loading: true, error: e.message });
    }

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
    const formatCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format;
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
                        <TableCell>Category</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Weight</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Other Cost</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.products.length === 0 && (
                        <TableRow>
                          <TableCell style={{ textAlign: 'center' }} colSpan={7}>No Data</TableCell>
                        </TableRow>
                      )}
                      {this.state.products.map((row) => {
                        return (
                          <TableRow key={'product_' + row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.category}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{row.weight}</TableCell>
                            <TableCell>{formatCurrency(row.material_cost)}</TableCell>
                            <TableCell>{formatCurrency(row.other_cost)}</TableCell>
                            <TableCell>{formatCurrency(row.price)}</TableCell>
                            <TableCell>
                              <Button onClick={(evt) => {
                                this.setState({
                                  id: row.id,
                                  category: row.category,
                                  description: row.description,
                                  weight: row.weight,
                                  material_cost: row.material_cost,
                                  other_cost: row.other_cost,
                                  price: row.price,
                                  mode: 'edit',
                                  view: 'form'
                                });
                              }}>Edit</Button>
                              <Button onClick={(evt) => {
                                this.setState({
                                  id: row.id
                                }, this.deleteProduct);
                              }}>
                                Delete
                              </Button>
                            </TableCell>
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
              <Grid item size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Category"
                  value={this.state.category}
                  onInput={(evt) => {
                    const val = evt.target.value;
                    this.setState({
                      category: val ? val.toUpperCase() : '',
                    });
                  }}
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 6 }}>
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
                    if (evt.target.value === '' || /^[0-9]+(\.\d{0,3}?)?$/.test(evt.target.value)) {
                      const weight = evt.target.value ? parseFloat(evt.target.value) : 0;
                      const material_cost = weight * 1.25;
                      this.setState({ weight: evt.target.value, material_cost })
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ md: 3, xs: 12 }}>
                <TextField
                  fullWidth
                  label="Material Cost"
                  value={'number' == typeof this.state.material_cost ? this.state.material_cost.toFixed(2) : this.state.material_cost}
                  onFocus={(evt) => {
                    const price =
                      (evt.target.value ? parseFloat(evt.target.value) : 0)
                      + (this.state.other_cost ? parseFloat(this.state.other_cost) : 0);
                    this.setState({ price });
                  }}
                  onInput={(evt) => {
                    if (evt.target.value === '' || /^[0-9]+(\.\d{0,2}?)?$/.test(evt.target.value)) {
                      const value = evt.target.value === '' ? 0 : parseFloat(evt.target.value);
                      const price =
                        value + (this.state.other_cost ? parseFloat(this.state.other_cost) : 0);
                      this.setState({ material_cost: evt.target.value, price })
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ md: 3, xs: 12 }}>
                <TextField
                  fullWidth
                  label="Other Cost"
                  value={('number' == typeof this.state.other_cost) ? this.state.other_cost.toFixed(2) : this.state.other_cost}
                  onFocus={(evt) => {
                    const price =
                      (evt.target.value ? parseFloat(evt.target.value) : 0)
                      + (this.state.material_cost ? parseFloat(this.state.material_cost) : 0);
                    this.setState({ price });
                  }}
                  onInput={(evt) => {
                    if (evt.target.value === '' || /^[0-9]+(\.\d{0,2}?)?$/.test(evt.target.value)) {
                      const price =
                        (evt.target.value ? parseFloat(evt.target.value) : 0)
                        + (this.state.material_cost ? parseFloat(this.state.material_cost) : 0);
                      this.setState({ other_cost: evt.target.value, price })
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ md: 3, xs: 12 }}>
                <TextField
                  fullWidth
                  label="Price"
                  value={('number' == typeof this.state.price )? this.state.price.toFixed(2) : this.state.price}
                  onInput={(evt) => {
                    if (evt.target.value === '' || /^[0-9]+(\.\d{0,2}?)?$/.test(evt.target.value)) {
                      this.setState({ price: evt.target.value })
                    }
                  }}
                />
              </Grid>
              <Grid item size={12}>
                <Button variant="outlined" onClick={(evt) => this.setState({ mode: '', view: 'list' })}>Cancel</Button>
                <Button variant="contained" onClick={(evt) => {
                  this.setState({ error: '' }, this.saveProduct);
                }}>Save</Button>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Container>
    );
  }
}

export default Admin;
