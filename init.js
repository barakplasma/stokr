init();

function init() {
  displayStockData();
  addClickHandlerstoDOM();
}

<!-- render function that initiates the HTML string creation and pushes to the document with `innerHTML`-->
function displayStockData() {
  document.querySelector('main').innerHTML = stockRowsToStockList();
}

function stockRowsToStockList() {
  // noinspection UnnecessaryLocalVariableJS
  const html = `<ul class="stockList">${stockRowGenerator().join('')}</ul>`;
  return html;
}

function stockRowGenerator() {
  const mockedJSONStringifyData = `[
  {
    "Symbol": "WIX",
    "Name": "Wix.com Ltd.",
    "Change": "0.750000",
    "PercentChange": "+1.51%",
    "LastTradePriceOnly": "76.099998"
  },
  {
    "Symbol": "MSFT",
    "Name": "Microsoft Corporation",
    "PercentChange": "-2.09%",
    "Change": "-0.850006",
    "LastTradePriceOnly": "69.620003"
  },
  {
    "Symbol": "YHOO",
    "Name": "Yahoo! Inc.",
    "Change": "0.279999",
    "PercentChange": "+1.11%",
    "LastTradePriceOnly": "50.599998"
  }
  ]`;
  const stockData = JSON.parse(mockedJSONStringifyData);
  return stockData.map(stock => createStockRow(stock));
}

<!-- todo - Add `data-id` to components in the HTML so we could find it’s related data later-->
function createStockRow(stock) {
  const row = `
   <li class="stockRow">
     <span class="stock-data stock-name" data-id="stock-name" aria-label="Stock Symbol & Stock Name">${concatenateStockSymbolAndName(stock)}</span>
     <span class="stock-data stock-price" data-id="stock-price" aria-label="Stock LastTradePrice">
${stock.LastTradePriceOnly}</span>
     <span class="stock-data stock-percentChange" data-id="stock-percentChange" aria-label="Stock PercentChange">${stock.PercentChange}</span>
     <span class="stock-position" data-id="" aria-label="Manual Arrangement Controller">&#x2B19;
     </span>
   </li>
 `;
  return row;
}

function concatenateStockSymbolAndName(stock) {
  return `${stock.Symbol.toUpperCase()} (${stock.Name})`;
}


<!-- todo - Add event listeners to containers after the HTML was rendered (event delegation)-->

<!-- todo - On events, find the `data-id` of the item and find it’s data based on that id (only when you need to update it or do something with it)-->
