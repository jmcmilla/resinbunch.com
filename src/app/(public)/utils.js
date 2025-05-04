/*
 * src/app/(public)/utils.js
 * Copyright (c)2025 James R. McMillan
 */


'use client';
import axios from 'axios';

const callAPI = async (config) => {
  try {
    config.baseURL = 'https://api.resinbunch.com/public';
    const { data } = await axios(config);
    return data;
  } catch (e) {
    throw e;
  }
}

const formatCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format;

export { callAPI, formatCurrency };
