window.Stokr.View = (function () {
  function stockRowsToStockList (stockData) {
    // noinspection UnnecessaryLocalVariableJS
    const html = `<ul class="stockList">${stockRowGenerator(stockData).join('')}</ul>`;
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
      ${stock.LastTradePriceOnly}
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

  return {

// render function that initiates the HTML string creation and pushes to the document with innerHTML
    displayStockData: function (stockData) {
      document.querySelector('main').innerHTML = stockRowsToStockList(stockData);
    }
  }
})();
