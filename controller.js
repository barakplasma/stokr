window.Stokr.Controller = (function () {
  return {

    // window.Stokr = window.Stokr || {};
    //
    // const View  = window.Stokr.View ;
    // const Model = window.Stokr.Model ;

    // const [View] = window.Stokr.View;
    // const [Model] = window.Stokr.Model;

    init: function () {
      window.Stokr.View.displayStockData(window.Stokr.Model.stockDataFetcher());
      this.addClickHandlersToDOM();
    },


    concatenateStockSymbolAndName: function (stock) {
      return `${stock.Symbol.toUpperCase()} (${stock.Name})`;
    },

// Added event listeners to containers after the HTML was rendered (event delegation)
// noinspection JSUnusedGlobalSymbols
    addClickHandlersToDOM: function () {
      // very general click handler
      document.querySelector('.container').addEventListener('click', this.dataIDClickHandler);
      document.querySelector('.container').addEventListener('touchstart', this.dataIDClickHandler);
      // there is a utility function to removeClickHandlersFromDOM()
    },

    removeClickHandlersFromDOM: function () {
      document.querySelector('.container').removeEventListener('click', this.dataIDClickHandler);
      document.querySelector('.container').removeEventListener('touchstart', this.dataIDClickHandler);
      console.log('removed ID click handler');
    },

// On events, find the `data-id` of the item and find it’s data based on that id
    dataIDClickHandler: function (e) {
      // console.dir(e);

      // console.dir(e.target.parentNode.dataset.id);

      // console.log(stockDataFetcher().find(row => {
      //   return row.Symbol === e.target.parentNode.dataset.id;
      // }));

      if (e.target.classList.contains('stock-percentChange')) {
        // console.log('perCha');
        stockSettings.changePercentToggle = stockSettings.changePercentToggle ? false : true;
        reRender();
      }
    },

    reRender: function () {
      console.time('reRender');
      removeClickHandlersFromDOM();
      init();
      console.timeEnd('reRender');
    },

    getStockSettings: function () {
      return window.Stokr.Model.stockSettings.changePercentToggle ? 'MarketCapitalization' :
        'PercentChange';
    },
  }
})();

window.Stokr.Controller.init();
