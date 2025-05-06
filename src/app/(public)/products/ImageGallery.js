/* eslint-disable @next/next/no-img-element */
import { Alert, AlertTitle, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { queueAPI, callAPI } from '../utils';

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
  async loadNext(lastEvaluatedKey) {
    const { images } = this.state;
    const data = await callAPI({
      url: '/productImage?product_id=' + this.props.product_id + '&lastEvaluatedKey=' + lastEvaluatedKey,
    });
    this.setState({ images: images.concat(data.Items)}, () => {
      if (data['LastEvaluatedKey']) {
        this.loadNext(data['LastEvaluatedKey'].uuid);
      } else {
        this.setState({ loaded: true });
      }
    });
  }
  async load() {
    queueAPI({
      url: '/productImage?product_id=' + this.props.product_id,
      callback: (results) => {
        if (results && results['LastEvaluatedKey']) {
          this.setState({
            images: results.Items,
          }, () => {
            this.loadNext(results['LastEvaluatedKey'].uuid);
          });
        } else {
          this.setState({
            images: results.Items,
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
              <a href={i.data} download={true}>
                <img src={i.data} alt={i.caption} />
              </a>
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
