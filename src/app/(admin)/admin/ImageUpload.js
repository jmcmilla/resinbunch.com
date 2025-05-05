/* eslint-disable @next/next/no-img-element */
/*
 * src/app/(admin)/admin/ImageUpload.js
 * Copyright (c)2025 James R. McMillan
 */
'use client';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Typography, Container, Box, TextField } from '@mui/material';

export default class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.maxWidth = props.maxWidth || 600;
    this.maxHeight = props.maxHeight || 800;
    this.state = {
      view: 'form',
      caption: '',
      data: false,
    };
    this.ref = React.createRef();
    this.fileListener = this.fileListener.bind(this);
  }
  static propTypes = {
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    label: PropTypes.string,
    onSave: PropTypes.func,
  };

  fileListener(evt) {
    const current = evt.target;
    console.log('triggered change event');
    if (!current.files || !current.files[0]) {
      console.error('No files found');
      return false;
    }
    const file = current.files[0]
    const reader = new FileReader();
    reader.onload = (e) => {
      let data = e.target?.result;
      const img = new Image();
      img.src = data;
      img.onload = (ev) => {
        let nw = img.width;
        let nh = img.height;
        if (img.width > this.maxWidth || img.height > this.maxHeight) {
          console.log('image size: %sx%s', img.width, img.height);
          if (img.width > img.height) {
            // landscape, set max width and adjust height to correct ratio
            nw = this.maxWidth;
            nh = Math.ceil(img.height * (nw / img.width));
          } else {
            // portrait, set max height and adjust width to correct ratio
            nh = this.maxHeight;
            nw = Math.ceil(img.width * (nh / img.height));
          }
          console.log('resize to: ' + nw + 'x' + nh, nw, nh);
          const canvas = document.createElement('canvas');
          canvas.width = nw;
          canvas.height = nh;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, nw, nh);
          data = canvas.toDataURL(file.type);
        }
        this.setState({ data, view: 'image' });
      };
    };
    if (!/^image\/.*$/.test(file.type)) {
      console.log('image type mismatch: ', file.type);
      alert('Please choose a file that is an image');
      evt.preventDefault();
      current.value = '';
      return false;
    }
    reader.readAsDataURL(file);
  };

  render() {
    if (this.state.view === 'form') {
      return (
        <Grid container spacing={3}>
          <Grid item size={12}>
            <Typography variant='body1'>
              {this.props.label}<br/>
              <input type="file" accept="image/*.png;capture=camera" onChange={this.fileListener} />
            </Typography>
          </Grid>
        </Grid>
      );
    } else if (this.state.view === 'image') {
      return (
        <Container maxWidth={false} sx={{ border: 'solid 1px #ccc', padding: '10px' }}>
          <Grid container spacing={1}>
            <Grid item size={12} sx={{ textAlign: 'center' }}>
              <Box component="img" src={this.state.data} alt="Image Preview" />
            </Grid>
            <Grid item size={12}>
              <TextField fullWidth label="Caption" value={this.state.caption} onInput={(evt) => this.setState({ caption: evt.target.value })} />
            </Grid>
            <Grid item size={6}>
              <Button variant="outlined" onClick={(evt) => {
                this.setState({ view: 'form', data: '' });
              }}>Cancel</Button>
            </Grid>
            <Grid item size={6} sx={{ textAlign: 'right' }}>
              <Button disabled={!this.props.onSave} onClick={(evt) => {
                if (this.props.onSave) {
                  this.props.onSave({
                    data: this.state.data,
                    caption: this.state.caption
                  });
                }
                this.setState({ view: 'form', data: '', caption: '' });
              }} variant="contained">Save</Button>
            </Grid>
          </Grid>
        </Container>
      );
    }
  }
}

