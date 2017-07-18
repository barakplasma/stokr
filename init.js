function init() {
  displayStockData();
  addClickHandlersToDOM();
}

const stockSettings = {
  "changePercentToggle": false
};

// render function that initiates the HTML string creation and pushes to the document with innerHTML
function displayStockData() {
  document.querySelector('main').innerHTML = stockRowsToStockList();
}

function stockRowsToStockList() {
  // noinspection UnnecessaryLocalVariableJS
  const html = `<ul class="stockList">${stockRowGenerator().join('')}</ul>`;
  return html;
}

function stockDataFetcher() {
  const mockedJSONStringifyData = `[
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
  ]`;

  return JSON.parse(mockedJSONStringifyData);
}

function stockRowGenerator() {
  const stockData = stockDataFetcher();
  return stockData.map(stock => {
    return createStockRow(stock);
  });
}

// Added data-id to components in the HTML so we can find it’s related data using the clickHandler
function createStockRow(stock) {
  // noinspection UnnecessaryLocalVariableJS
  const row = `
   <li class="stockRow" data-id="${stock.Symbol}">
     <span class="stock-data stock-name" aria-label="Stock Symbol & Stock Name">
      ${concatenateStockSymbolAndName(stock)}
     </span>
     <span class="stock-data stock-price" aria-label="Stock LastTradePrice">
      ${stock.LastTradePriceOnly}
     </span>
     <span class="stock-data stock-percentChange" aria-label="Stock PercentChange">
      ${stockSettings.changePercentToggle?stock.MarketCapitalization:stock.PercentChange}
     </span>
     <span class="stock-position" aria-label="Manual Arrangement Controller">&#x2B19;
     </span>
   </li>
 `;
  return row;
}

function concatenateStockSymbolAndName(stock) {
  return `${stock.Symbol.toUpperCase()} (${stock.Name})`;
}

// Added event listeners to containers after the HTML was rendered (event delegation)
// noinspection JSUnusedGlobalSymbols
function addClickHandlersToDOM() {
  // very general click handler
  document.querySelector('.container').addEventListener('click', dataIDClickHandler);
  // there is a utility function to removeClickHandlersFromDOM()
}

function removeClickHandlersFromDOM() {
  document.querySelector('.container').removeEventListener('click', dataIDClickHandler);
  console.log('removed ID click handler');
}

// On events, find the `data-id` of the item and find it’s data based on that id
function dataIDClickHandler(e) {
  // console.dir(e);

  // console.dir(e.target.parentNode.dataset.id);

  // console.log(stockDataFetcher().find(row => {
  //   return row.Symbol === e.target.parentNode.dataset.id;
  // }));

  if (e.target.classList.contains('stock-percentChange')) {
    // console.log('perCha');
    stockSettings.changePercentToggle = stockSettings.changePercentToggle?false:true;
    reRender();
  }
}

function reRender() {
  console.time('reRender');
  removeClickHandlersFromDOM();
  init();
  console.timeEnd('reRender');
}

init();
