window.Stokr.Controller = (function () {
  const View = window.Stokr.View;
  const Model = window.Stokr.Model;

// Added event listeners to containers after the HTML was rendered (event delegation)
// noinspection JSUnusedGlobalSymbols
  function addClickHandlersToDOM() {
    // very general click handler
    document.querySelector('.container').addEventListener('click', dataIDClickHandler);
    document.querySelector('.container').addEventListener('touchstart', dataIDClickHandler);
    // there is a utility function to removeClickHandlersFromDOM()
  }

  function removeClickHandlersFromDOM() {
    document.querySelector('.container').removeEventListener('click', dataIDClickHandler);
    document.querySelector('.container').removeEventListener('touchstart', dataIDClickHandler);
    // console.log('removed ID click handler');
  }

// On events, find the `data-id` of the item and find it’s data based on that id
  function dataIDClickHandler(e) {
    // console.dir(e);

    // console.dir(e.target.parentNode.dataset.id);

    // console.log(stockDataFetcher().find(row => {
    //   return row.Symbol === e.target.parentNode.dataset.id;
    // }));

    if (e.target.classList.contains('stock-Change')) {
      // console.log('perCha');

      window.Stokr.Model.stockSettings.changePercentToggle = window.Stokr.Model.stockSettings.changePercentToggle ? false : true;
      reRender();
    }

    // console.dir(e.target.dataset);
    if (e.target.dataset.id ==='upArrow') {
      // console.dir(e.target.parentNode.parentNode.parentNode.dataset.id) //ex 'WIX'
      const stockToMove = e.target.parentNode.parentNode.parentNode.dataset.id;
      Model.reOrderStocks(stockToMove,-1);
      reRender();
    }
    if (e.target.dataset.id ==='downArrow'){
      const stockToMove = e.target.parentNode.parentNode.parentNode.dataset.id;
      Model.reOrderStocks(stockToMove,1);
      reRender();
    }
  }

  function reRender() {
    // console.time('reRender');
    removeClickHandlersFromDOM();
    window.Stokr.Controller.init();
    // console.timeEnd('reRender');
  }

  return {
    init: function () {
      window.Stokr.View.displayStockData(window.Stokr.Model.stockDataFetcher());
      addClickHandlersToDOM();
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
      return Math.floor(price*100)/100;
    }
  }
})();

window.Stokr.Controller.init();
