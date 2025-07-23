/*
 * src/app/(admin)/admin/sales/page.js
 * Copyright (c)2025 James R. McMillan
 */
'use client';

import { Component } from 'react';
import { AdminContext } from '../../context';
import {
  Alert,
  AlertTitle,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { formatDateTime, formatCurrency } from '../lib/utils.mjs';


class RemotePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      paused: true,
      localSales: [],
    };
    this.loadSales = this.loadSales.bind(this);
  }
  static contextType = AdminContext;
  async loadSales(lastEvaluatedKey = undefined) {
    let r = [];
    const { data } = await this.context.callAPI({
      method: 'GET',
      url: '/sales',
      parameters: { lastEvaluatedKey },
    });
    const lastKey = data.lastEvaluatedKey || undefined
    if (lastKey) {
      let nextSales = await this.loadSales(lastKey);
      r = r.concat(nextSales)
    }
    r = r.concat(data.sales);
    return r.sort((a,b) => a.created - b.created );
  }
  componentDidMount() {
    this.loadSales().then((sales) => {
      this.setState({ loaded: true, localSales: sales });
    }).catch((error) => {
      this.setState({ loaded: true, error: error });
    });
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
        <Typography variant="h5">Remote Sales</Typography>
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
      </Container>
    );
  }
}

export default RemotePage;
