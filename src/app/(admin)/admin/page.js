'use client';

import React from 'react';
import { AdminContext } from '../context';
import { Alert, AlertTitle, Button, Container, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";
import ProductImageGallery from './ProductImageGallery';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const formatCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format;

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortCol: 'id',
      sortDir: 'asc',
      keyword: '',
      loaded: false,
      view: 'list',
      mode: '',
      products: [],
      nextId: 0,
      id: 0,
      description: '',
      category: '',
      weight: 0,
      material_cost: 0,
      other_cost: 0,
      price: 0,
      available: 0,
      error: false,
    };
    this.handleAddNew = this.handleAddNew.bind(this);
    this.saveProduct = this.saveProduct.bind(this);
    this.doFilter = this.doFilter.bind(this);
    this.doSort = this.doSort.bind(this);
    this.toggleSort = this.toggleSort.bind(this);
    this.exportProducts = this.exportProducts.bind(this);
    this.loadProducts = this.loadProducts.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }
  static contextType = AdminContext;
  async loadProducts() {
    const copy = JSON.parse(JSON.stringify(this.state));
    const { data } = await this.context.callAPI({
      method: 'GET',
      url:'/product'
    });
    if (data) {
      copy.products = data;
      copy.nextId = copy.products.reduce((p, c) => Math.max(p, c.id), 0) + 1;
      for(const product of copy.products) {
        product.total_cost = (product.material_cost + product.other_cost) * product.available;
        product.revenue = (product.price * product.available);
        product.profit = product.revenue - product.total_cost;
      }
      console.log('NextID: ', copy.nextId);
    }
    copy.loaded = true;
    this.setState(copy);
    return data;
  }
  async exportProducts() {
    const copy = JSON.parse(JSON.stringify(this.state));
    const { products } = copy;
    if (products.length === 0) {
      copy.error = 'No products to export';
      this.setState(copy);
      return;
    }
    const squareMapping = [
      {
        name: 'Token',
        column: false,
      },
      {
        name: 'Item Name',
        column: 'description',
      },
      {
        name: 'Variation Name',
        column: false,
      },
      {
        name: 'SKU',
        column: 'id',
      },
      {
        name: 'Description',
        column: 'description',
      },
      {
        name: 'Categories',
        column: 'category',
      },
      {
        name: 'Reporting Category',
        column: false,
      },
      {
        name: 'GTIN',
        column: false,
      },
      {
        name: 'Item Type',
        column: false,
      },
      {
        name: 'Weight (lb)',
        column: 'weight',
      },
      {
        name: 'Social Media Link Title',
        column: false,
      },
      {
        name: 'Social Media Link Description',
        column: false,
      },
      {
        name: 'Price',
        column: 'price',
      },
      {
        name: 'Online Sale Price',
        column: 'price',
      },
      {
        name: 'Archived',
        column: false,
        transform: () => 'N',
      },
      {
        name: 'Sellable',
        column: 'available',
        transform: (v) => v > 0 ? 'Y' : 'N',
      },
      {
        name: 'Contains Alcohol',
        column: false,
        transform: () => 'N',
      },
      {
        name: 'Stockable',
        column: false,
        transform: () => 'Y',
      },
      {
        name: 'Skip Detail Screen in POS',
        column: false,
        transform: () => 'N',
      },
      {
        name: 'Option Name 1',
        column: false,
      },
      {
        name: 'Option Value 1',
        column: false,
      },
      {
        name: 'Current Quantity The Resin bunch',
        column: 'available',
      },
      {
        name: 'New Quantity The Resin bunch',
        column: 'available',
      },
      {
        name: 'Stock Alert Enabled The Resin bunch',
        column: false,
        transform: () => 'Y',
      },
      {
        name: 'Stock Alert Count The Resin bunch',
        column: false,
        transform: () => '0',
      }
    ];
    let csvContent = 'data:text/csv;charset=utf-8,' +
      squareMapping.map((o) => o.name).join(',') + '\n';
    for (const p of products) {
      for (const o of squareMapping) {
        if (o.column) {
          if (o.transform) {
            csvContent += o.transform(p[o.column]) + ',';
          } else {
            csvContent += p[o.column] + ',';
          }
        } else if (o.transform) {
          csvContent += o.transform() + ',';
        } else {
          csvContent += ',';
        }
      }
      csvContent += '\n';
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'products.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
    copy.error = '';
    this.setState(copy);
  }
  async deleteProduct() {
    const copy = JSON.parse(JSON.stringify(this.state));
    const { id } = copy;
    try {
      if (!confirm('Are you sure you want to delete product id: ' + id + '\nClick OK to continue.')) {
        return;
      }
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
      const { id, description, category, weight, material_cost, other_cost, price, available } = copy;
      const request = {
        url: '/product',
        data: { id, description, category, weight, material_cost, other_cost, price, available }
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
      copy.available = 0;
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
  toggleSort(col) {
    const { sortCol, sortDir } = this.state;
    let rdir = 'asc';
    if (sortCol === col) {
      if (sortDir === 'asc') {
        rdir = 'desc';
      }
    }
    this.setState({ sortCol: col, sortDir: rdir });
  }
  doFilter(p) {
    const { keyword } = this.state;
    const exp = new RegExp('.*' + keyword + '.*', 'gi');
    return exp.test(p.description) || exp.test(p.category) || exp.test(formatCurrency(p.price));
  }
  doSort(a,b) {
    const { sortDir, sortCol } = this.state;
    let r;
    switch(sortCol) {
      case 'category':
      case 'description':
        if (sortDir === 'desc') {
          r = a[sortCol].localeCompare(b[sortCol]);
        } else {
          r = b[sortCol].localeCompare(a[sortCol]);
        }
        break;
      default:
        if (sortDir === 'desc') {
          r = Number(a[sortCol]) - Number(b[sortCol]);
        } else {
          r = Number(b[sortCol]) - Number(a[sortCol]);
        }
        break;
    }
    return r;
  }
  componentDidMount() {
    this.loadProducts().catch((e) => {
      console.log(e);
      this.setState( { error: e.message });
    });
  }
  render() {
    const { sortCol, sortDir, products } = this.state;
    const total_count = products.length;
    const total_weight = products.reduce((prev, curr) => prev += parseFloat(curr.weight), 0);
    const total_material_cost = products.reduce((prev, curr) => prev += parseFloat(curr.material_cost), 0);
    const total_other_cost = products.reduce((prev, curr) => prev += parseFloat(curr.other_cost), 0);
    const total_available = products.reduce((prev, curr) => prev += parseInt(curr.available), 0);
    const total_cost = products.reduce((prev, curr) => prev += parseFloat(curr.total_cost), 0);
    const total_revenue = products.reduce((prev, curr) => prev += parseFloat(curr.revenue), 0);
    const total_profit = products.reduce((prev, curr) => prev += parseFloat(curr.profit), 0);
    return (
      <Container maxWidth={false}>
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
                  <Grid item size={3} sx={{ textAlign: 'right' }}>
                    <TextField fullWidth
                      variant="standard"
                      label="Keyword"
                      value={this.state.keyword}
                      onInput={(evt) => {
                      this.setState({ keyword: evt.target.value });
                    }} />
                  </Grid>
                  <Grid item size={3} sx={{ textAlign: 'right' }}>
                    <Button onClick={this.handleAddNew}>Add New</Button>
                    <Button onClick={this.exportProducts}>Export</Button>
                  </Grid>
                </Grid>
                <Divider />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell onClick={() => this.toggleSort('id')}>
                          ID
                          {sortCol === 'id' && sortDir === 'asc' && <KeyboardArrowUpIcon />}
                          {sortCol === 'id' && sortDir === 'desc' && <KeyboardArrowDownIcon />}
                        </TableCell>
                        <TableCell onClick={() => this.toggleSort('category')}>
                          Category
                          {sortCol === 'category' && sortDir === 'asc' && <KeyboardArrowUpIcon />}
                          {sortCol === 'category' && sortDir === 'desc' && <KeyboardArrowDownIcon />}
                        </TableCell>
                        <TableCell onClick={() => this.toggleSort('description')}>
                          Description
                          {sortCol === 'description' && sortDir === 'asc' && <KeyboardArrowUpIcon />}
                          {sortCol === 'description' && sortDir === 'desc' && <KeyboardArrowDownIcon />}
                        </TableCell>
                        <TableCell onClick={() => this.toggleSort('weight')}>
                          Weight
                          {sortCol === 'weight' && sortDir === 'asc' && <KeyboardArrowUpIcon />}
                          {sortCol === 'weight' && sortDir === 'desc' && <KeyboardArrowDownIcon />}
                        </TableCell>
                        <TableCell onClick={() => this.toggleSort('material_cost')}>
                          Cost
                          {sortCol === 'material_cost' && sortDir === 'asc' && <KeyboardArrowUpIcon />}
                          {sortCol === 'material_cost' && sortDir === 'desc' && <KeyboardArrowDownIcon />}
                        </TableCell>
                        <TableCell onClick={() => this.toggleSort('other_cost')}>
                          Other Cost
                          {sortCol === 'other_cost' && sortDir === 'asc' && <KeyboardArrowUpIcon />}
                          {sortCol === 'other_cost' && sortDir === 'desc' && <KeyboardArrowDownIcon />}
                        </TableCell>
                        <TableCell onClick={() => this.toggleSort('price')}>
                          Price
                          {sortCol === 'price' && sortDir === 'asc' && <KeyboardArrowUpIcon />}
                          {sortCol === 'price' && sortDir === 'desc' && <KeyboardArrowDownIcon />}
                        </TableCell>
                        <TableCell onClick={() => this.toggleSort('available')}>
                          Available
                          {sortCol === 'available' && sortDir === 'asc' && <KeyboardArrowUpIcon />}
                          {sortCol === 'available' && sortDir === 'desc' && <KeyboardArrowDownIcon />}
                        </TableCell>
                        <TableCell onClick={() => this.toggleSort('total_cost')}>
                          Total Cost
                          {sortCol === 'total_cost' && sortDir === 'asc' && <KeyboardArrowUpIcon />}
                          {sortCol === 'total_cost' && sortDir === 'desc' && <KeyboardArrowDownIcon />}
                        </TableCell>
                        <TableCell onClick={() => this.toggleSort('revenue')}>
                          Revenue
                          {sortCol === 'revenue' && sortDir === 'asc' && <KeyboardArrowUpIcon />}
                          {sortCol === 'revenue' && sortDir === 'desc' && <KeyboardArrowDownIcon />}
                        </TableCell>
                        <TableCell onClick={() => this.toggleSort('profit')}>
                          Profit
                          {sortCol === 'profit' && sortDir === 'asc' && <KeyboardArrowUpIcon />}
                          {sortCol === 'profit' && sortDir === 'desc' && <KeyboardArrowDownIcon />}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.products.length === 0 && (
                        <TableRow>
                          <TableCell style={{ textAlign: 'center' }} colSpan={7}>No Data</TableCell>
                        </TableRow>
                      )}
                      {this.state.products.filter(this.doFilter).sort(this.doSort).map((row) => {
                        return (
                          <TableRow key={'product_' + row.id}>
                            <TableCell sx={{ textAlign: 'right', backgroundColor: (sortCol === 'id' ? 'rgba(128,128,128,.3)' : '')}}>{row.id}</TableCell>
                            <TableCell sx={{ backgroundColor: (sortCol === 'category' ? 'rgba(128,128,128,.3)' : '') }}>{row.category}</TableCell>
                            <TableCell sx={{ backgroundColor: (sortCol === 'description' ? 'rgba(128,128,128,.3)' : '') }}>{row.description}</TableCell>
                            <TableCell sx={{ textAlign: 'right', backgroundColor: (sortCol === 'weight' ? 'rgba(128,128,128,.3)' : '') }}>{row.weight}</TableCell>
                            <TableCell sx={{ textAlign: 'right', backgroundColor: (sortCol === 'material_cost' ? 'rgba(128,128,128,.3)' : '') }}>{formatCurrency(row.material_cost)}</TableCell>
                            <TableCell sx={{ textAlign: 'right', backgroundColor: (sortCol === 'other_cost' ? 'rgba(128,128,128,.3)' : '') }}>{formatCurrency(row.other_cost)}</TableCell>
                            <TableCell sx={{ textAlign: 'right', backgroundColor: (sortCol === 'price' ? 'rgba(128,128,128,.3)' : '') }}>{formatCurrency(row.price)}</TableCell>
                            <TableCell sx={{ textAlign: 'right', backgroundColor: (sortCol === 'available' ? 'rgba(128,128,128,.3)' : '') }}>{row.available}</TableCell>
                            <TableCell sx={{ textAlign: 'right', backgroundColor: (sortCol === 'total_cost' ? 'rgba(128,128,128,.3)' : '') }}>{formatCurrency(row.total_cost)}</TableCell>
                            <TableCell sx={{ textAlign: 'right', backgroundColor: (sortCol === 'revenue' ? 'rgba(128,128,128,.3)' : '') }}>{formatCurrency(row.revenue)}</TableCell>
                            <TableCell sx={{ textAlign: 'right', backgroundColor: (sortCol === 'profit' ? 'rgba(128,128,128,.3)' : '') }}>{formatCurrency(row.profit)}</TableCell>
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
                                  available: row.available,
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
                    <TableFooter>
                      <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', backgroundColor: (sortCol === 'id' ? 'rgba(128,128,128,.3)' : '') }}></TableCell>
                      <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', backgroundColor: (sortCol === 'category' ? 'rgba(128,128,128,.3)' : '') }}></TableCell>
                      <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right', backgroundColor: (sortCol === 'description' ? 'rgba(128,128,128,.3)' : '') }}>{total_count}</TableCell>
                      <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right', backgroundColor: (sortCol === 'weight' ? 'rgba(128,128,128,.3)' : '') }}>{total_weight.toFixed(2)}</TableCell>
                      <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right', backgroundColor: (sortCol === 'material_cost' ? 'rgba(128,128,128,.3)' : '') }}>{formatCurrency(total_material_cost)}</TableCell>
                      <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right', backgroundColor: (sortCol === 'other_cost' ? 'rgba(128,128,128,.3)' : '') }}>{formatCurrency(total_other_cost)}</TableCell>
                      <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right', backgroundColor: (sortCol === 'price' ? 'rgba(128,128,128,.3)' : '') }}></TableCell>
                      <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right', backgroundColor: (sortCol === 'available' ? 'rgba(128,128,128,.3)' : '') }}>{total_available}</TableCell>
                      <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right', backgroundColor: (sortCol === 'total_cost' ? 'rgba(128,128,128,.3)' : '') }}>{formatCurrency(total_cost)}</TableCell>
                      <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right', backgroundColor: (sortCol === 'revenue' ? 'rgba(128,128,128,.3)' : '') }}>{formatCurrency(total_revenue)}</TableCell>
                      <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right', backgroundColor: (sortCol === 'profit' ? 'rgba(128,128,128,.3)' : '') }}>{formatCurrency(total_profit)}</TableCell>
                      <TableCell></TableCell>
                    </TableFooter>
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
              <Grid item size={{ md: 6, xs: 12}}>
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
              <Grid item size={{ md: 6, xs: 12 }}>
                <TextField
                  fullWidth
                  label="Available"
                  value={this.state.available}
                  onInput={(evt) => {
                    if (evt.target.value === '' || /^[0-9]+$/.test(evt.target.value)) {
                      this.setState({ available: evt.target.value })
                    }
                  }}
                />
              </Grid>
              <Grid item size={{ md: 4, xs: 12 }}>
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
              <Grid item size={{ md: 4, xs: 12 }}>
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
              <Grid item size={{ md: 4, xs: 12 }}>
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
              <Grid item size={6}>
                <Button variant="outlined" onClick={(evt) => this.setState({ mode: '', view: 'list' })}>Cancel</Button>
              </Grid>
              <Grid item size={6} sx={{ textAlign: 'right' }}>
                <Button variant="contained" onClick={(evt) => {
                  this.setState({ error: '' }, this.saveProduct);
                }}>Save</Button>
              </Grid>
              {this.state.mode === 'edit' && (
                <>
                  <ProductImageGallery product_id={this.state.id} />
                </>
              )}
            </Grid>
          )}
        </Paper>
      </Container>
    );
  }
}

export default Admin;
