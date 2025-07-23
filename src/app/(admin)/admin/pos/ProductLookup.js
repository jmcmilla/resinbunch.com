/*
 * src/app/(admin)/admin/pos/ProductLookup.js
 * Copyright (c)2025 James R. McMillan
 */


'use client';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

class ProductLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: props.value ? props.value : '',
      matches: [],
    };
  }
  static propTypes = {
    value: PropTypes.string.isRequired,
    products: PropTypes.array.isRequired,
    onChange: PropTypes.func
  }
  componentDidUpdate(prevProps,prevState) {
    if (prevProps.value !== this.props.value) {
      this.setState({ description: this.props.value })
    }
  }
  render() {
    return (
      <div style={{ position: 'relative' }}>
      <TextField
        fullWidth
        slotProps={{
          input: {
            autoComplete: false,
          }
        }}
        onKeyUp={(evt) => {
          if (evt.code === 'Escape') {
            this.setState({ matches: [] });
          }
        }}
        value={this.state.description}
        onInput={(evt) => {
          const copy = JSON.parse(JSON.stringify(this.state));
          const value = evt?.target?.value;
          copy.description = value;
          copy.matches = this.props.products.filter((p) => {
            return p.description.toUpperCase().includes(value.toUpperCase());
          });
          this.setState(copy, () => {
            if (this.props.onChange) {
              this.props.onChange(value);
            }
          });
        }}
      />
      {this.state.matches.length > 0 && (
        <div style={{
            zIndex: '999',
            position: 'absolute',
            padding: '3px',
            top: '45pt',
            fontSize: '12pt',
            backgroundColor: 'white',
            color: 'black',
            boxShadow: '0px 0px 3px #000',
            maxHeight: '500px',
            overflow: 'scroll',
          }}
        >
          {this.state.matches.map((m) => {
            return (
              <div key={m.product_id}
                style={{ backgroundColor: 'white', cursor: 'pointer' }}
                onMouseOver={(evt) => {
                  evt.target.style.backgroundColor = "lightblue";
                }}
                onMouseOut={(evt) => {
                  evt.target.style.backgroundColor = 'white';
                }}
                onClick={(evt) => {
                  evt.stopPropagation();
                  evt.preventDefault();
                  const copy = JSON.parse(JSON.stringify(this.state));
                  copy.product = m;
                  copy.description = m.description;
                  copy.matches = [];
                  this.setState(copy, () => {
                    if (this.props.onChange) {
                      this.props.onChange(m.description, m);
                    }
                  });
                }}
              >
                {m.description}
              </div>
            );
          })}
        </div>
      )}
      </div>
    );
  }
}

export default ProductLookup;
