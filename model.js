window.Stokr.Model = (function () {
  // no logic functions be here
  // don't save filtered stocks in model

  function getRemoteData() {
    // in the future, this will be a fetch from a DB
    //to model this call, here is a mockedJSONStringifyData
    return `
    [
      {
        "Symbol": "WIX",
        "Name": "Wix.com Ltd.",
        "Change": "0.750000",
        "PercentChange": "+1.51%",
        "LastTradePriceOnly": "76.099998",
        "MarketCapitalization": "3.4B"
      },
      {
        "Symbol": "MSFT",
        "Name": "Microsoft Corporation",
        "PercentChange": "-2.09%",
        "Change": "-0.850006",
        "LastTradePriceOnly": "69.620003",
        "MarketCapitalization": "7.2B"
      },
      {
        "Symbol": "YHOO",
        "Name": "Yahoo! Inc.",
        "Change": "0.279999",
        "PercentChange": "+1.11%",
        "LastTradePriceOnly": "50.599998",
        "MarketCapitalization": "4.8B"
      }
    ]
     `;
  }

  function getState() {
    return currentStocks;
  }

  // const stockOrder = [];
  const currentStocks = JSON.parse(getRemoteData());

  return {
    stockSettings: {
      "changePercentToggle": false,
      "featureToggles": {
        filterPanel: false
      }
    },

    stockDataFetcher: function () {
      return getState();
    },

  }
})();
