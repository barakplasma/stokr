window.Stokr.Model = (function () {
  function getRemoteData() {
    //mockedJSONStringifyData
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
      "changePercentToggle": false
    },

    stockDataFetcher: function () {
      return getState();
    },

    reOrderStocks: function (stockToMove, upOrDownCount) {
      //todo reach step, allow a variable upOrDownCount to move x spaces
      const indexToMove = currentStocks.findIndex(stock => {
        return stock.Symbol === stockToMove;
      });
      // console.log(indexToMove);
      // move up

      if(upOrDownCount === -1 && indexToMove !== 0) {
        const leftover = currentStocks.splice(indexToMove - 1, 1);
        // console.log(leftover);
        currentStocks.splice(indexToMove, 0, leftover[0]);
        // console.log(currentStocks);
      }
      // move down
      if(upOrDownCount === 1 && indexToMove !== currentStocks.length) {
        const leftover = currentStocks.splice(indexToMove, 1);
        currentStocks.splice(indexToMove+1, 0, leftover[0]);
      }
      return currentStocks;
    },

  }
})();
