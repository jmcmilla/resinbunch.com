/*
 * src/app/(admin)/admin/sales/page.js
 * Copyright (c)2025 James R. McMillan
 */
'use client';

import { Component } from 'react';
import { AdminContext } from '../../context';
import { Alert, AlertTitle, Button, CircularProgress, Container, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from '@mui/material';
import { formatDateTime, formatCurrency } from '../lib/utils.mjs';

class SalesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      paused: true,
      localSales: [],
    };
    this.postSale = this.postSale.bind(this);
  }
  static contextType = AdminContext;
  async postSale() {
    try {
      const { localSales, paused } = this.state;
      const sale = localSales[0];
      if (sale && !paused) {
        await this.context.callAPI({
          method: 'POST',
          url: '/sales',
          data: sale,
        });
        localSales.shift();
        window.localStorage.setItem('sales', JSON.stringify(localSales));
        this.setState({ localSales }, () => {
          setTimeout(this.postSale, 1000);
        });
      }
    } catch (e) {
      console.log('Error posting sale, try again later');
      console.log(e);
      setTimeout(this.postSale, 30000);
    }
  }
  componentDidMount() {
    const localSales = window.localStorage.getItem('sales') || '[]';
    if (localSales) {
      this.setState({ localSales: JSON.parse(localSales), loaded: true});
    }
  }
  render() {
    if (this.state.error) {
      return (<Alert severity="error"><AlertTitle>Error:</AlertTitle>{this.state.error}</Alert>)
    }
    if (!this.state.loaded) {
      return (<center><CircularProgress /></center>)
    }
    const totalItems = this.state.localSales.reduce((p, c) => {
      return p += c.items.length;
    }, 0);
    const grandTotal = this.state.localSales.reduce((p, c) => {
      return p += parseFloat(c.total);
    }, 0);
    return (
      <Container maxWidth={false}>
        <Typography variant="h5">Local Sales</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>Items</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.localSales.map((s, idx) => (
              <TableRow key={'sale-' + idx}>
                <TableCell>{formatDateTime(s.created)}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{s.items.length}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{formatCurrency(s.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell sx={{ textAlign: 'right' }}>
                Total:
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                {totalItems}
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                {formatCurrency(grandTotal)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <Button onClick={(evt) => {
          this.setState({ paused: !this.state.paused }, () => {
            if (!this.state.paused) {
              this.postSale();
            }
          });
        }}>
          {this.state.paused ? 'Start Upload' : 'Stop Upload'}
        </Button>
      </Container>
    );
  }
}

export default SalesPage;
