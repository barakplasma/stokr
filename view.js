window.Stokr.View = (function () {
  // make sure that the view does now save state

  function stockRowsToStockList (stockData, settings) {
    // noinspection UnnecessaryLocalVariableJS
    const html = `${settings.featureToggles.includes('filterPanel')?createFilterPanel():''}<ul class="stockList">${stockRowGenerator(stockData).join('')}</ul>`;
    return html;
  }

  function stockRowGenerator  (stockData) {
    // const stockData = stockDataFetcher();
    return stockData.map(stock => {
      return createStockRow(stock);
    });
  }

// Added data-id to components in the HTML so we can find it’s related data using the clickHandler
  function createStockRow (stock) {
    // noinspection UnnecessaryLocalVariableJS
    const row = `
   <li class="stockRow" data-id="${stock.Symbol}">
     <span class="stock-data stock-name" aria-label="Stock Symbol & Stock Name">
      ${window.Stokr.Controller.concatenateStockSymbolAndName(stock)}
     </span>
     <span class="stock-data stock-price" aria-label="Stock LastTradePrice">
      ${window.Stokr.Controller.roundPrice(stock.LastTradePriceOnly)}
     </span>
     <span class="stock-data stock-Change" data-change="${window.Stokr.Controller.stockGainOrLoss(stock)}" aria-label="Stock PercentChange">
      ${stock[window.Stokr.Controller.getStockSettings()]}
     </span>
     <div class="stock-position" aria-label="Row Up and Down Arrows">
     <svg class="arrows" viewBox="0 0 33 25" 
     version="1.1" 
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <polygon data-id="upArrow" fill="#8F8F8F" id="UpTriangle" transform="translate(16.500000, 11.000000) scale(-1, 1) translate(-16.500000, -11.000000)" points="16.1891892 3 28 19 5 19">
      </polygon>
     </svg>
     <svg class="arrows" 
     viewBox="0 0 33 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <polygon data-id="downArrow" fill="#8F8F8F" id="DownTriangle" transform="translate(16.500000, 11.000000) scale(1, -1) translate(-16.500000, -11.000000) " points="16.1891892 3 28 19 5 19">
      </polygon>
     </svg>
     </div>
   </li>
 `;
    return row;
  }
  // todo put event listeners into view (since they aren't relevant in a CLI for example)
  // Added event listeners to containers after the HTML was rendered (event delegation)
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

    // console.dir(e.target);

    // console.dir(e.target.parentNode.dataset.id);

    // console.log(stockDataFetcher().find(row => {
    //   return row.Symbol === e.target.parentNode.dataset.id;
    // }));

    if (e.target.classList.contains('stock-Change')) {
      // console.log('perCha');

      window.Stokr.Model.stockSettings.changePercentToggle = window.Stokr.Model.stockSettings.changePercentToggle ? false : true;
      window.Stokr.Controller.init();
    }

    // console.dir(e.target.dataset);
    if (e.target.dataset.id === 'upArrow') {
      // console.dir(e.target.parentNode.parentNode.parentNode.dataset.id) //ex 'WIX'
      const stockToMove = e.target.parentNode.parentNode.parentNode.dataset.id;
      window.Stokr.Controller.reOrderStocks(stockToMove, -1);
      redoClickHandlers();
    }
    if (e.target.dataset.id === 'downArrow') {
      const stockToMove = e.target.parentNode.parentNode.parentNode.dataset.id;
      window.Stokr.Controller.reOrderStocks(stockToMove, 1);
      redoClickHandlers();
    }

    if (e.target.alt === 'Filter'){
      window.Stokr.Controller.toggleFeatures('Filter');
    }
  }

  function redoClickHandlers() {
    // console.time('redoClickHandlers');
    removeClickHandlersFromDOM();
    // window.Stokr.Controller.init();
    addClickHandlersToDOM();
    // console.timeEnd('redoClickHandlers');
  }

  function createFilterPanel() {
    const nameFilter = `<label for="stockName">By Name</label><input name="stockName" type="text" />`;
    const gainFilter = `<label for="stockGain">By Gain</label><input name="stockGain" type="number" />`;
    const fromRangeFilter = `<label for="fromRange">By Range: From</label><input name="fromRange" type="date" />`;
    const toRangeFilter = `<label for="toRange">By Range: To</label><input name="toRange" type="date" />`;
    const fields = [nameFilter,gainFilter,fromRangeFilter,toRangeFilter];
    const wrappedFields = fields.map(field=>{
      let newField = `<span class="formField">${field}</span>`;
      return newField;
    });
    const applyButton = `<button>Apply</button>`;
    const filterSection = `<div class="filterPanel">${wrappedFields.join('').concat(applyButton)}</div>`;
    return filterSection;
  }

  return {

// render function that initiates the HTML string creation and pushes to the document with innerHTML
    displayStockData: function (stockData,featureToggles) {
      document.querySelector('main').innerHTML = stockRowsToStockList(stockData,featureToggles);
      redoClickHandlers();
    }
  }
})();
