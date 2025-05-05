/* eslint-disable @next/next/no-img-element */
import { Alert, AlertTitle, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { queueAPI } from '../utils';

export default class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      images: [],
    };
  }
  static propTypes = {
    product_id: PropTypes.number.isRequired,
  };
  async load() {
    queueAPI({
      url: '/productImage?product_id=' + this.props.product_id,
      callback: (results) => {
        if (results && results.Items?.length) {
          this.setState({
            loaded: true,
            images: results.Items,
          });
        } else {
          this.setState({
            loaded: true,
          });
        }
      }
    });
  }
  componentDidMount() {
    console.log('Mounted ', this.props.product_id);
    this.load().catch((e) => {
      this.setState({
        loaded: true,
        error: e.message,
      });
    });
  }
  render() {
    let body = '';
    if (this.state.error) {
      body = <Alert severity="error">
        <AlertTitle>Error Loading Image</AlertTitle>
        {this.state.error}
      </Alert>
    }
    if (this.state.loaded && this.state.images.length > 0) {
      body = this.state.images.map((i) => (
            <ImageListItem key={i.uuid}>
              <img src={i.data} alt={i.caption} />
              <ImageListItemBar
                title={i.caption}
                position="below"
              />
            </ImageListItem>
            ));
    }
    return <ImageList variant="masonry">{body}</ImageList>;
  }
}
