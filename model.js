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

  function getState() {
    return fetchStockAsync().then(res=>res.query.results.quote);
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
