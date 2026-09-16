(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.TikTokShopOperatingContract = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CENT_TOLERANCE = 0.01;
  const EXCLUDED_SCOPE = 'excluded_unpaid';

  function numberOrNull(value) {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(String(value).replace(/[$,]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }

  function sumStrict(rows, field) {
    if (!rows.length) return null;
    let total = 0;
    for (const row of rows) {
      const value = numberOrNull(row[field]);
      if (value === null) return null;
      total += value;
    }
    return total;
  }

  function sumOncePerOrder(rows, field) {
    if (!rows.length) return null;
    const grouped = new Map();
    rows.forEach((row, index) => {
      const key = row.order_id || `__row_${index}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(row);
    });
    let total = 0;
    for (const orderRows of grouped.values()) {
      const values = orderRows
        .map(row => numberOrNull(row[field]))
        .filter(value => value !== null);
      if (!values.length) return null;
      total += values.find(value => Math.abs(value) > CENT_TOLERANCE) ?? values[0];
    }
    return total;
  }

  function uniqueOrderCount(rows) {
    return new Set(rows.map(row => row.order_id).filter(Boolean)).size;
  }

  function check(label, value, unavailableDetail, reviewDetail) {
    if (value === null) {
      return { label, status: 'UNAVAILABLE', difference: null, detail: unavailableDetail };
    }
    const pass = Math.abs(value) <= CENT_TOLERANCE;
    return {
      label,
      status: pass ? 'PASS' : 'REVIEW',
      difference: value,
      detail: pass ? 'Difference is within $0.01.' : reviewDetail
    };
  }

  function analyze(rows) {
    const orderRows = rows.filter(row => row.record_type === 'order');
    const hasScope = orderRows.some(row => String(row.paid_scope || '').trim());
    const effectiveRows = hasScope
      ? orderRows.filter(row => row.paid_scope !== EXCLUDED_SCOPE)
      : orderRows;
    const excludedRows = hasScope
      ? orderRows.filter(row => row.paid_scope === EXCLUDED_SCOPE)
      : [];
    const reviewRows = hasScope
      ? orderRows.filter(row => row.paid_scope === 'review_missing_paid_time')
      : [];

    const itemQuantity = sumStrict(effectiveRows, 'quantity');
    const grossSales = sumStrict(effectiveRows, 'gross_sales');
    const sellerDiscount = sumStrict(effectiveRows, 'seller_funded_discount');
    const platformItemDiscount = sumStrict(effectiveRows, 'platform_item_discount');
    const paymentPlatformDiscount = sumStrict(effectiveRows, 'payment_platform_discount');
    let productSales = sumStrict(effectiveRows, 'product_sales_after_discount');
    let productSalesSource = 'Seller Center product subtotal after discount';
    if (productSales === null && grossSales !== null && sellerDiscount !== null) {
      productSales = grossSales - sellerDiscount;
      productSalesSource = 'Legacy estimate: gross sales minus seller-funded discount';
    }
    const shippingRevenue = sumOncePerOrder(effectiveRows, 'shipping_revenue');
    const otherRevenue = sumStrict(effectiveRows, 'other_revenue');
    const exportedPayment = sumOncePerOrder(effectiveRows, 'payment_amount');
    const derivedPayment = [productSales, shippingRevenue, otherRevenue].every(value => value !== null)
      ? productSales + shippingRevenue + otherRevenue
      : null;
    const totalDiscount = [sellerDiscount, platformItemDiscount, paymentPlatformDiscount]
      .every(value => value !== null)
      ? sellerDiscount + platformItemDiscount + paymentPlatformDiscount
      : null;
    const productIdentityDifference = [grossSales, productSales, sellerDiscount, platformItemDiscount]
      .every(value => value !== null)
      ? grossSales - productSales - sellerDiscount - platformItemDiscount
      : null;
    const paymentDifference = derivedPayment !== null && exportedPayment !== null
      ? derivedPayment - exportedPayment
      : null;
    const averageItemPrice = productSales !== null && itemQuantity > 0
      ? productSales / itemQuantity
      : null;
    const averageListPrice = grossSales !== null && itemQuantity > 0
      ? grossSales / itemQuantity
      : null;

    return {
      scope: {
        sourceRows: orderRows.length,
        effectiveRows: effectiveRows.length,
        effectiveOrders: uniqueOrderCount(effectiveRows),
        excludedRows: excludedRows.length,
        excludedOrders: uniqueOrderCount(excludedRows),
        reviewRows: reviewRows.length,
        reviewOrders: uniqueOrderCount(reviewRows),
        rule: hasScope
          ? 'Paid Time present, plus positive-payment rows flagged for review; unpaid rows excluded.'
          : 'No paid-scope field supplied; all order rows retained.'
      },
      metrics: {
        itemQuantity,
        grossSales,
        productSales,
        productSalesSource,
        sellerDiscount,
        platformItemDiscount,
        paymentPlatformDiscount,
        totalDiscount,
        shippingRevenue,
        otherRevenue,
        derivedPayment,
        exportedPayment,
        paymentDifference,
        averageItemPrice,
        averageListPrice
      },
      checks: [
        check(
          'Product price identity',
          productIdentityDifference,
          'Needs gross sales, product subtotal, seller discount, and item-level platform discount.',
          'Gross sales do not equal product subtotal plus seller and item-level platform discounts.'
        ),
        check(
          'Payment amount comparison',
          paymentDifference,
          'Needs product subtotal, one shipping amount per order, other revenue, and exported Order Amount.',
          'The derived payment amount differs from exported Order Amount. Review platform payment discounts, subsidies, or unmapped revenue.'
        )
      ]
    };
  }

  return Object.freeze({ analyze, numberOrNull });
});
