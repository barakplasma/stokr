init();

function init() {
  sendStockDataToDom();
}

<!-- render function that initiates the HTML string creation and pushes to the document with `innerHTML`-->
function sendStockDataToDom() {
  document.querySelector('main').innerHTML = processDataToHTML();
}

function processDataToHTML() {
  const html = `<ul class="stockList">${createStockList().join('')}</ul>`;
  return html;
}

function createStockList() {
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

function createStockRow(stock) {
  const row = `
   <li class="stockRow">
     <span class="stock-data stock-name" data-id="" aria-label="Stock Symbol & Stock Name">${concatenateStockSymbolAndName(stock)}</span>
     <span class="stock-data stock-price" data-id="" aria-label="Stock LastTradePrice">
${stock.LastTradePriceOnly}</span>
     <span class="stock-data stock-percentChange" data-id="" aria-label="Stock PercentChange">${stock.PercentChange}</span>
     <span class="stock-position" data-id="" aria-label="Manual Arrangement Controller">&#x2B19;
     </span>
   </li>
 `;
  return row;
}

function concatenateStockSymbolAndName(stock) {
  return `${stock.Symbol} ${stock.Name}`;
}

<!-- todo - Add event listeners to containers after the HTML was rendered (event delegation)-->
<!-- todo - On events, find the `data-id` of the item and find it’s data based on that id (only when you need to update it or do something with it)-->
