/*
 * src/app/(admin)/admin/lib/loadProducts.js
 * Copyright (c)2025 James R. McMillan
 */

async function loadProducts(context) {
  const { data } = await context.callAPI({
    method: 'GET',
    url: '/product'
  });
  if (data) {
    for (const product of data) {
      product.total_cost = (product.material_cost + product.other_cost) * product.available;
      product.revenue = (product.price * product.available);
      product.profit = product.revenue - product.total_cost;
    }
  }
  return data;
}

export default loadProducts;
