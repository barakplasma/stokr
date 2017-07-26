window.Stokr.Model = (function () {
  // no logic functions be here
  // don't save filtered stocks in model

  function badNetworkRequest() {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:7000/quotes?q=MSFT,WIX,AMZN', false);  // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
      return request.responseText;
    }
  }

  const fetchStockAsync = async () =>
    await (await fetch('http://localhost:7000/quotes?q=MSFT,WIX,AMZN')).json()

  async function getRemoteData() {
    // in the future, this will be a fetch from a DB
    //to model this call, here is a mockedJSONStringifyData
    let response = await fetch('http://localhost:7000/quotes?q=MSFT,WIX,AMZN');
    let data = await response.json();
    return data.query.results.quote;
    // return `
    // [
    //   {
    //     "Symbol": "WIX",
    //     "Name": "Wix.com Ltd.",
    //     "Change": "0.750000",
    //     "PercentChange": "+1.51%",
    //     "LastTradePriceOnly": "76.099998",
    //     "MarketCapitalization": "3.4B"
    //   },
    //   {
    //     "Symbol": "MSFT",
    //     "Name": "Microsoft Corporation",
    //     "PercentChange": "-2.09%",
    //     "Change": "-0.850006",
    //     "LastTradePriceOnly": "69.620003",
    //     "MarketCapitalization": "7.2B"
    //   },
    //   {
    //     "Symbol": "YHOO",
    //     "Name": "Yahoo! Inc.",
    //     "Change": "0.279999",
    //     "PercentChange": "+1.11%",
    //     "LastTradePriceOnly": "50.599998",
    //     "MarketCapitalization": "4.8B"
    //   }
    // ]
    //  `;
  }

  function getState() {
    return JSON.parse(badNetworkRequest()).query.results.quote;
  }

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
