'use client';

import React from 'react';
import { AdminContext } from '../context';
import { Button, Container, Grid, ImageList, ImageListItem, Paper, Stack, Typography } from "@mui/material";

class Admin extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextType = AdminContext;
  componentDidMount() {

  }
  render() {
    return (
      <Container maxWidth="xl">
        <Paper>
          <Grid container spacing={1}>
            <Grid size={12}>
              <Typography variant="body2">Welcome To the Administration Site.</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default Admin;
