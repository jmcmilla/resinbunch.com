/*
 * src/app/(public)/utils.js
 * Copyright (c)2025 James R. McMillan
 */


'use client';
import axios from 'axios';

const apiQueue = [];
let checkInterval = 0;
let processInterval = 0;

const processQueue = async () => {
  clearTimeout(processInterval);
  const config = apiQueue.shift();
  const results = await callAPI(config);
  if (config.callback) {
    config.callback(results);
  }
  if (apiQueue.length > 0) {
    console.log(apiQueue.length + ' left');
    processInterval = setTimeout(processQueue, 100);
  }
}
const queueAPI = (config) => {
  apiQueue.push(config);
}

const checkQueue = () => {
  clearTimeout(checkInterval);
  if (apiQueue.length > 0) {
    console.log('Processing request queue');
    processQueue();
  } else {
    console.log('Request queue is empty, check again in half a second');
    checkInterval = setTimeout(checkQueue, 500);
  }
};

const callAPI = async (config) => {
  config.baseURL = 'https://api.resinbunch.com/public';
  const { data } = await axios(config);
  return data;
}

const formatCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format;

export { callAPI, queueAPI, checkQueue, formatCurrency };
