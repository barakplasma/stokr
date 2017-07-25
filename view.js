window.Stokr.View = (function () {
  // make sure that the view does now save state
  // todo render filter panel with stock data display and ui state
  // https://wix-kickstart-2017.slack.com/archives/C5G408NHK/p1500992023789897
  function stockRowsToStockList(stockData, settings) {
    const html = `${generateFilterArea(settings)}<ul class="stockList">${stockRowGenerator(stockData, settings).join('')}</ul>`;
    return html;
  }

  function generateFilterArea(settings) {
    if (settings.featureToggles.filterPanel) {
      return createFilterPanel(settings);
    } else {
      return '';
    }
  }

  //hashchange event and handler for search

  function stockRowGenerator(stockData, settings) {
    // const stockData = stockDataFetcher();
    return stockData.map(stock => {
      return createStockRow(stock, settings);
    });
  }

// Added data-id to components in the HTML so we can find it’s related data using the clickHandler
  function createStockRow(stock, settings) {
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
     <div class="stock-position" style="${settings.featureToggles.filterPanel ? `display: none;` : ``}" aria-label="Row Up and Down Arrows">
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

  // put event listeners into view (since they aren't relevant in a CLI for example)
  // Added event listeners to containers after the HTML was rendered (event delegation)
  function addClickHandlersToDOM() {
    // very general click handler
    document.querySelector('.container').addEventListener('click', dataIDClickHandler);
    document.querySelector('.container').addEventListener('touchstart', dataIDClickHandler);
    if (document.querySelector('.filterPanel')) {
      document.querySelector('.filterPanel').addEventListener('input', dataIDClickHandler);
    }
    window.addEventListener('hashchange', hashChangeHandler);
    // there is a utility function to removeClickHandlersFromDOM()
  }

  function removeClickHandlersFromDOM() {
    document.querySelector('.container').removeEventListener('click', dataIDClickHandler);
    document.querySelector('.container').removeEventListener('touchstart', dataIDClickHandler);
    if (document.querySelector('.filterPanel')) {
      document.querySelector('.filterPanel').removeEventListener('input', dataIDClickHandler);
    }
    // console.log('removed ID click handler');
  }

// On events, find the `data-id` of the item and find it’s data based on that id
  function dataIDClickHandler(e) {
    // console.dir(e);
    // console.dir(e.target);
    // console.dir(e.target.value);
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

    if (e.target.alt === 'Filter') {
      window.Stokr.Controller.toggleFeatures('Filter');
    }

    if (e.target.id === 'filterApply') {
      let filterSettings = document.querySelectorAll('input,select');
      sendFilterSettings(filterSettings);
    }
  }

  function redoClickHandlers() {
    // console.time('redoClickHandlers');
    removeClickHandlersFromDOM();
    // window.Stokr.Controller.init();
    addClickHandlersToDOM();
    // console.timeEnd('redoClickHandlers');
  }

  // todo https://wix-kickstart-2017.slack.com/archives/C5G408NHK/p1500988337716456
  function createFilterPanel(settings) {
    const nameFilter = `<label for="stockName">By Name</label><input name="stockName" type="text" value="${settings.filterSettings.stockName}"/>`;
    const gainFilter = `
      <label for="stockGain">By Gain</label>
      <select name="stockGain" value="${settings.filterSettings.stockGain}">
      <option value="all">all</option>
      <option value="gaining">gaining</option>
      <option value="losing">losing</option>
      </select>
    `;
    const fromRangeFilter = `
      <label for="fromRange">By Price Range: From</label>
      <input name="fromRange" type="number" min="0" step="0.01"  value="${settings.filterSettings.fromRange}"/>`;
    const toRangeFilter = `
      <label for="toRange">By Price Range: To</label>
      <input name="toRange" type="number" min="0" step="0.01" value="${settings.filterSettings.toRange}"/>`;
    const fields = [nameFilter, gainFilter, fromRangeFilter, toRangeFilter];
    const wrappedFields = fields.map(field => {
      let newField = `<span class="formField">${field}</span>`;
      return newField;
    });
    const applyButton = `<button id="filterApply">Apply</button>`;
    const filterSection = `<div class="filterPanel">${wrappedFields.join('').concat(applyButton)}</div>`;
    return filterSection;
  }

  function sendFilterSettings(filterSettings) {
    // console.log('preObj ',filterSettings);
    let filterSettingsObject = {};
    filterSettings.forEach(setting => {
      filterSettingsObject[setting.name] = setting.value
    });
    window.Stokr.Controller.filterStocks(filterSettingsObject);
  }

  function hashChangeHandler() {
    window.Stokr.Controller.init();
  }

  function createSearchRoute() {
    document.querySelector('main').innerHTML = `
      <div class="searchRoute"><input placeholder="CANCEL"><div><a href="#">Return to Main View</a></div></div>
    `;
  }

  return {
// todo refactor input the filter values from the model into the view on rerender instead of current
// render function that initiates the HTML string creation and pushes to the document with innerHTML
    /* todo `View.render` should check the URL hash and render the relevant view based on the hash
     `window.location.hash` */
    displayStockData: function (stockData, settings) {
      if (window.location.hash === '#search') {
        createSearchRoute();
      }
      else {
        document.querySelector('main').innerHTML = stockRowsToStockList(stockData, settings);
        redoClickHandlers();
      }
    }
  }
})();
