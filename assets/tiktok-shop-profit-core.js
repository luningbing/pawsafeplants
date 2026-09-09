(function (global) {
  'use strict';

  const nonnegative = value => Math.max(0, Number.parseFloat(value) || 0);

  function calculate(input) {
    const x = {
      price: nonnegative(input.price),
      discount: nonnegative(input.discount),
      cogs: nonnegative(input.cogs),
      shipping: nonnegative(input.shipping),
      referral: nonnegative(input.referral),
      creator: nonnegative(input.creator),
      returns: nonnegative(input.returns),
      returnCost: nonnegative(input.returnCost),
      ad: nonnegative(input.ad)
    };
    const sales = x.price - x.discount;

    if (sales <= 0) {
      return { valid: false, sales, input: x };
    }

    const referralFee = sales * x.referral / 100;
    const creatorCost = sales * x.creator / 100;
    const expectedReturnLoss = x.returns / 100 * x.returnCost;
    const contributionBeforeAds = sales - referralFee - creatorCost - x.cogs - x.shipping - expectedReturnLoss;
    const netProfit = contributionBeforeAds - x.ad;
    const marginPct = netProfit / sales * 100;
    const variableRate = (x.referral + x.creator) / 100 + expectedReturnLoss / sales;
    const fixedCosts = x.cogs + x.shipping + x.ad;
    const breakEvenPrice = variableRate < 1 ? fixedCosts / (1 - variableRate) : 0;
    const maxCreatorPct = Math.max(0, (sales - referralFee - x.cogs - x.shipping - expectedReturnLoss - x.ad) / sales * 100);
    const maxAdCost = Math.max(0, contributionBeforeAds);

    return {
      valid: true,
      input: x,
      sales,
      referralFee,
      creatorCost,
      expectedReturnLoss,
      contributionBeforeAds,
      netProfit,
      marginPct,
      breakEvenPrice,
      maxCreatorPct,
      maxAdCost
    };
  }

  global.TikTokShopProfitCore = Object.freeze({ calculate });
})(window);
