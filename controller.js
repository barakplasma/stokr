window.Stokr.Controller = (function () {
  // state is stored in the model, and passed into the view as an arg

  // todo breakup filterStocks functions to separate functions here

  function processModel() {
    return window.Stokr.Model.stockDataFetcher()
      .then(res=>res.map(stock=>{
      stock.PercentChange = calculatePercentChange(stock.LastTradePriceOnly,stock.Change);
      return stock;
    }));
  }

  function calculatePercentChange(price,change) {
    return `${(change/price*100).toFixed(2)}%`;
  }

  return {
    init: function () {
      processModel().then(modelData=>window.Stokr.View.displayStockData(modelData,window.Stokr.Model.stockSettings))
    },

    toggleFeatures: function (e) {
      if(e === 'Filter') {
        if(window.Stokr.Model.stockSettings.featureToggles.filterPanel === true){
          window.Stokr.Model.stockSettings.featureToggles.filterPanel = false;
        }else{
          window.Stokr.Model.stockSettings.featureToggles.filterPanel = true;
        }
        this.init();
      }
      if(e === 'reset'){
        //implement for of loop on properties to false
      }
      this.init();
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
      window.Stokr.View.displayStockData(currentStocks,window.Stokr.Model.stockSettings);
    },

    filterStocks: function (filterSettings) {
      // console.log('filterSettings: ',filterSettings);
      window.Stokr.Model.stockSettings.filterSettings = filterSettings;
      let currentStocks = processModel();
      // console.log(currentStocks); //beforeFilter
      let filteredStocks = currentStocks.filter(stock=>{
        if(filterSettings.stockName !== ''){
          return stock.Name.toUpperCase().includes(filterSettings.stockName.toUpperCase()) || stock.Symbol.toUpperCase().includes(filterSettings.stockName.toUpperCase());
        }
        else{return true};
      }).filter(stock=>{
        if(filterSettings.stockGain !== ''){
          if(filterSettings.stockGain==='gaining'){
            return stock.Change>0;
          }
          if(filterSettings.stockGain==='losing'){
            return stock.Change<0;
          }
          if(filterSettings.stockGain==='all'){
            return true;
          }
        }
        else{return true};
      }).filter(stock=>{
        if(filterSettings.fromRange !== ''){
          return stock.LastTradePriceOnly > filterSettings.fromRange;
        }
        else{return true};
      }).filter(stock=>{
        if(filterSettings.toRange !== ''){
          return stock.LastTradePriceOnly < filterSettings.toRange ;
        }
        else{return true};
      });
      // console.log(filteredStocks); //afterFilter
      window.Stokr.View.displayStockData(filteredStocks,window.Stokr.Model.stockSettings);
      return filteredStocks;
    },

  }
})();

window.Stokr.Controller.init();
function test() {
  console.assert(window.Stokr.Controller.filterStocks({"stockName":"wix","stockGain":"gaining","fromRange":"1","toRange":"80"})[0].Symbol==='WIX',`filter isn't working`);
  // resetFilterTest
  window.Stokr.Controller.filterStocks({"stockName":"","stockGain":"","fromRange":"","toRange":""});
}
test();
