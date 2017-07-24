window.Stokr.Controller = (function () {
  // todo state is stored in the model, and passed into the view as an arg

  return {
    init: function () {
      window.Stokr.View.displayStockData(window.Stokr.Model.stockDataFetcher(),['filterPanel']);
    },

    concatenateStockSymbolAndName: function (stock) {
      return `${stock.Symbol.toUpperCase()} (${stock.Name})`;
    },

    getStockSettings: function () {
      return window.Stokr.Model.stockSettings.changePercentToggle ? 'MarketCapitalization' :
        'PercentChange';
    },

    stockGainOrLoss: function (stock) {
      return parseFloat(stock.PercentChange) > 0 ? 'growing' : 'shrinking';
    },

    roundPrice: function (price) {
      return Math.floor(price * 100) / 100;
    },

    reOrderStocks: function (stockToMove, upOrDownCount) {
      let currentStocks = window.Stokr.Model.stockDataFetcher();
      //todo reach step, allow a variable upOrDownCount to move x spaces
      const indexToMove = window.Stokr.Model.stockDataFetcher().findIndex(stock => {
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
      window.Stokr.View.displayStockData(currentStocks);
    },
  }
})();

window.Stokr.Controller.init();
