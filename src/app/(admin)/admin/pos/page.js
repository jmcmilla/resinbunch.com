/*
 * src/app/(admin)/admin/pos/page.js
 * Copyright (c)2025 James R. McMillan
 */
'use client';

import { Component } from 'react';
import { AdminContext } from '../../context';
import { Alert, AlertTitle, Autocomplete, Button, CircularProgress, Container, Grid, Snackbar, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import loadProducts from '../lib/loadProducts';
import ProductLookup from './ProductLookup';

const formatCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format;

class POS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      view: 'list',
      products: [],
      items: [],
      product_id: '',
      description: '',
      snack: '',
      qty: 1,
      price: 0.00,
      tax: 0.00,
      total: 0.00,
      collected: 0.00,
    };
    this.load = this.load.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
  }
  static contextType = AdminContext;
  async load() {
    try {
      const products = await loadProducts(this.context);
      this.setState({ products, loaded: true });
    } catch (e) {
      this.setState({ error: e.message, loaded: true });
    }
  }
  handleInput(key, value) {
    const copy = JSON.parse(JSON.stringify(this.state));
    switch (key) {
      case 'description':
        copy.description = value;
        break;
      case 'qty':
        if (value === '' || !isNaN(parseInt(value))) {
          copy.qty = value;
        }
        break;
      case 'price':
        if (value === '' || !isNaN(parseFloat(value))) {
          copy.price = value;
        }
        break;
    }
    if (!isNaN(parseInt(copy.qty)) && !isNaN(parseFloat(copy.price))) {
      copy.total = parseInt(copy.qty) * parseFloat(copy.price);
    }
    this.setState(copy);
  }
  handleAddItem(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    const copy = JSON.parse(JSON.stringify(this.state));
    const { product_id, description, qty, price, total } = copy;
    const item = {
      product_id,
      description,
      qty,
      price,
      total
    };
    if (!description) {
      alert('Please enter at least a description');
      return false;
    }
    copy.items.push(item);
    copy.description = '';
    copy.qty = '1';
    copy.price = '0.00';
    copy.total = '0.00';
    this.setState(copy);
  }
  componentDidMount() {
    this.load();
  }
  render() {
    if (this.state.error) {
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {this.state.error}
        </Alert>);
    }
    if (!this.state.loaded) {
      return <center><CircularProgress></CircularProgress></center>
    }
    const subtotal = this.state.items.reduce((prev, curr) => {
      if (isNaN(parseFloat(curr.total))) {
        return prev;
      }
      return prev += parseFloat(curr.total);
    }, 0);
    const collected = isNaN(parseFloat(this.state.collected)) ? 0 : parseFloat(this.state.collected);
    const change = collected - subtotal;
    return (
      <Container maxWidth={false}>
        <Grid container>
          <Grid size={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>Qty</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>Price</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.items.map((i, idx) => {
                  return (
                    <TableRow key={'item-' + idx}>
                      <TableCell>{i.description}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>{i.qty}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>{formatCurrency(i.price)}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>{formatCurrency(i.total)}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="secondary" onClick={(evt) => {
                          evt.stopPropagation();
                          evt.preventDefault();
                          const copy = JSON.parse(JSON.stringify(this.state));
                          copy.items.splice(idx, 1);
                          this.setState(copy);
                        }}>
                          <RemoveIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>
                    <ProductLookup value={this.state.description} products={this.state.products} onChange={(description, product) => {
                      const copy = JSON.parse(JSON.stringify(this.state));
                      if (product) {
                        copy.product_id = product.id;
                        copy.description = product.description;
                        copy.price = product.price;
                        copy.total = parseInt(copy.qty) * parseFloat(product.price);
                      } else {
                        copy.description = description;
                      }
                      this.setState(copy);
                    }} />
                  </TableCell>
                  <TableCell>
                    <TextField
                      slotProps={{
                        htmlInput: {
                          style: { textAlign: 'right' },
                          inputMode: "numeric",
                        }
                      }}
                      fullWidth
                      variant="outlined"
                      onInput={(evt) => this.handleInput('qty', evt.target.value)} value={this.state.qty}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      slotProps={{
                        htmlInput: {
                          style: { textAlign: 'right' },
                          inputMode: 'decimal',
                        }
                      }}
                      fullWidth
                      variant="outlined"
                      onInput={(evt) => this.handleInput('price', evt.target.value)} value={this.state.price}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      slotProps={{
                        htmlInput: {
                          style: { textAlign: 'right' },
                        }
                      }}
                      fullWidth
                      variant="outlined"
                      value={formatCurrency(this.state.total)}
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={this.handleAddItem} color="primary">
                      <AddIcon />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right' }}>Amount Due:</TableCell>
                  <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right' }}>{formatCurrency(subtotal)}</TableCell>
                  <TableCell>&nbsp;</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right' }}>Collected:</TableCell>
                  <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right' }}>
                    <TextField slotProps={{
                      htmlInput: {
                        inputMode: 'decimal',
                        style: { textAlign: 'right' }
                      }}}
                      value={this.state.collected}
                      onInput={(evt) => {
                      const value = evt?.target?.value;
                      if (value === '' || !isNaN(parseFloat(value))) {
                        this.setState({ collected: value });
                      }
                    }} />
                  </TableCell>
                  <TableCell>&nbsp;</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right' }}>Change:</TableCell>
                  <TableCell sx={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'right' }}>{formatCurrency(change)}</TableCell>
                  <TableCell>&nbsp;</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Grid>
          <Grid size={6}>
            <Button
              variant="text"
              color="info"
              onClick={(evt) => {
                if (this.state.items.length) {
                  if (!confirm('Resetting the form will remove all existing items.\nClick OK to continue')) {
                    return false;
                  }
                }
                this.setState({ items: [], description: '', qty: 1, price: 0.00, total: 0.00 });
              }}
            >Reset Form</Button>
          </Grid>
          <Grid size={6} sx={{ textAlign: 'right' }}>
             <Button
              variant="contained"
              color="success"
              disabled={subtotal === 0 || change < 0}
              onClick={(evt) => {
                const sales = localStorage.getItem('sales') ? JSON.parse(localStorage.getItem('sales')) : [];
                const sale = {
                  created: new Date(),
                  items: this.state.items,
                  total: subtotal,
                  collected: collected,
                  change: change,
                };
                sales.push(sale);
                localStorage.setItem('sales', JSON.stringify(sales));
                this.setState({ snack: 'Saved!', items: [], description: '', qty: 1, price: 0.00, total: 0.00, collected: 0.00 });
              }}
            >Save</Button>
          </Grid>
        </Grid>
        {this.state.snack && (
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center'}} open={this.state.snack} onClose={(evt, reason) => {
            this.setState({ snack: '' })
          }} autoHideDuration={3000}>
            <Alert>
              <AlertTitle>Success!</AlertTitle>
            </Alert>
          </Snackbar>
        )}
      </Container>
    );
  }
}

export default POS;
