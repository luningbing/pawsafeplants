const assert = require('node:assert/strict');
const contract = require('../assets/tiktok-shop-operating-contract.js');

const rows = [
  {
    record_type: 'order', order_id: 'A', quantity: '1', gross_sales: '60',
    seller_funded_discount: '5', platform_item_discount: '3',
    payment_platform_discount: '2', product_sales_after_discount: '52',
    shipping_revenue: '4', other_revenue: '1', payment_amount: '95',
    paid_scope: 'included'
  },
  {
    record_type: 'order', order_id: 'A', quantity: '2', gross_sales: '40',
    seller_funded_discount: '0', platform_item_discount: '2',
    payment_platform_discount: '0', product_sales_after_discount: '38',
    shipping_revenue: '0', other_revenue: '0', payment_amount: '0',
    paid_scope: 'included'
  },
  {
    record_type: 'order', order_id: 'B', quantity: '1', gross_sales: '25',
    seller_funded_discount: '0', platform_item_discount: '0',
    payment_platform_discount: '0', product_sales_after_discount: '25',
    shipping_revenue: '3', other_revenue: '0', payment_amount: '28',
    paid_scope: 'excluded_unpaid'
  }
];

const result = contract.analyze(rows);
assert.equal(result.scope.effectiveOrders, 1);
assert.equal(result.scope.excludedOrders, 1);
assert.equal(result.metrics.itemQuantity, 3);
assert.equal(result.metrics.productSales, 90);
assert.equal(result.metrics.shippingRevenue, 4);
assert.equal(result.metrics.otherRevenue, 1);
assert.equal(result.metrics.derivedPayment, 95);
assert.equal(result.metrics.exportedPayment, 95);
assert.equal(result.metrics.paymentDifference, 0);
assert.equal(result.metrics.averageItemPrice, 30);
assert.equal(result.metrics.totalDiscount, 12);
assert.equal(result.checks[0].status, 'PASS');
assert.equal(result.checks[1].status, 'PASS');

const reviewOrder = contract.analyze(rows.slice(0, 2).map(row => ({
  ...row,
  paid_scope: 'review_missing_paid_time'
})));
assert.equal(reviewOrder.scope.reviewOrders, 1);
assert.equal(reviewOrder.scope.effectiveOrders, 1);
assert.equal(reviewOrder.metrics.itemQuantity, 3);
assert.equal(reviewOrder.metrics.productSales, 90);

const legacy = contract.analyze([{
  record_type: 'order', order_id: 'C', quantity: '2', gross_sales: '50',
  seller_funded_discount: '5'
}]);
assert.equal(legacy.metrics.productSales, 45);
assert.equal(legacy.metrics.productSalesSource.startsWith('Legacy estimate'), true);
assert.equal(legacy.checks[0].status, 'UNAVAILABLE');

console.log('tiktok-shop-operating-contract tests passed');
