/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Alert, AlertTitle, Button, Dialog, DialogTitle, Grid, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { queueAPI, callAPI } from '../utils';

export default class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      view: 'gallery',
      src: '',
      caption: '',
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
    if (this.state.view === 'gallery') {
      if (this.state.loaded && this.state.images.length > 0) {
        body = this.state.images.map((i) => (
              <ImageListItem key={i.uuid}>
                <a href="#" onClick={(evt) => {
                  evt.preventDefault();
                  evt.stopPropagation();
                  this.setState({ src: i.data, caption: i.caption, view: 'image' })
                }}>
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
    } else if (this.state.view === 'image') {
      return (
        <Dialog fullScreen onClose={(evt) => this.setState({ view: 'gallery' })} open={true}>
          <DialogTitle>
            <Grid container>
              <Grid size={10}>
                {this.state.caption || 'Image'}
              </Grid>
              <Grid size={2} sx={{ textAlign: 'right'}}>
                <Button onClick={(evt) => {this.setState({ view: 'gallery', src: '', caption: '' })}}>
                  &times;
                </Button>
              </Grid>
            </Grid>
          </DialogTitle>
          <img  src={this.state.src} title={this.state.caption || 'Image'} style={{ width: '100%' }} />
        </Dialog>);
    }
  }
}
