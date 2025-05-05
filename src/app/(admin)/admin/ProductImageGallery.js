/*
 * src/app/(admin)/admin/ProductImageGallery.js
 * Copyright (c)2025 James R. McMillan
 */
'use client';

import React, { Component } from 'react';
import { AdminContext } from '../context';
import PropTypes from 'prop-types';
import { Alert, Box, Button, CircularProgress, Grid, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import ImageUpload from './ImageUpload';

export default class ProductImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      images: [],
    };
  }
  async loadImages() {
    try {
      const request = {
        url: `/productImage?product_id=${this.props.product_id}`,
        method: 'GET',
      };
      const { data } = await this.context.callAPI(request);
      if (!data) {
        throw new Error('No Images Found');
      }
      const { Items } = data;
      this.setState({ images: Items, loaded: true, error: false });
    } catch (e) {
      this.setState({ error: e.message, loaded: true });
    }
  }
  static propTypes = {
    product_id: PropTypes.number.isRequired,
  };
  static contextType = AdminContext;
  componentDidMount() {
    this.loadImages();
  }
  render() {
    console.log('images:', this.state.images);
    if (this.state.error) {
      return <Alert severity="error">{this.state.error}</Alert>
    }
    if (!this.state.loaded) {
      return <CircularProgress />
    }
    return (
      <Grid size={12}>
        <ImageList>
          {this.state.images.map((i) => (
            <ImageListItem key={i.uuid}>
              <Box component="img" src={i.data} alt={i.caption} />
              <ImageListItemBar
                title={i.caption}
                position="below"
                actionIcon={<Button onClick={(evt) => {
                  this.setState({ loaded: false }, async () => {
                    if (confirm('Are you sure you want to delete this image?\nClick OK to continue')) {
                      const request = {
                        url: '/productImage?uuid=' + i.uuid,
                        method: 'DELETE',
                      };
                      const result = await this.context.callAPI(request);
                      this.loadImages();
                    }
                  });
                }}>Delete</Button>}
              />
            </ImageListItem>
          ))}
        </ImageList>
        <ImageUpload
          maxWidth={400}
          maxHeight={400}
          label="Add Image to Gallery"
          onSave={async (image) => {
            this.setState({ loaded: false }, async () => {
              try {
                image.product_id = this.props.product_id;
                const request = {
                  url: '/productImage',
                  method: 'POST',
                  data: image
                };
                alert('size: ' + JSON.stringify(request).length + ' bytes');
                await this.context.callAPI(request);
                this.loadImages();
              } catch (e) {
                this.setState({ error: e.message });
              }
            });
          }}
        />
      </Grid>
    );
  }
}
