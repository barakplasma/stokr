<!-- todo - Break down the string creation with functions-->
init();

function init() {
  sendStockDataToDom();
}

<!-- todo - Have one render function that initiates the HTML string creation and pushes to the document with `innerHTML`-->
function sendStockDataToDom() {
  document.querySelector('main').innerHTML = processDataToHTML();
}

function processDataToHTML() {
  // temporarily, do it the easy way for testing
  const list = `
<ul>
  <li>
    <span aria-label="Stock Symbol & Stock Name">AAPL (Apple.com Company)</span>
    <span aria-label="Stock LastTradePrice">143.73</span>
    <span aria-label="Stock PercentChange">-2.62%</span>
    <span aria-label="Manual Arrangement Controller">⬙</span>
  </li>
  <li>
    <span aria-label="Stock Symbol & Stock Name">GOOG (Google.com Inc)</span>
    <span aria-label="Stock LastTradePrice">927.33</span>
    <span aria-label="Stock PercentChange">-5.62%</span>
    <span aria-label="Manual Arrangement Controller">⬙</span>
  </li>
  <li>
    <span aria-label="Stock Symbol & Stock Name">WIX (Wix.com span)</span>
    <span aria-label="Stock LastTradePrice">76.10</span>
    <span aria-label="Stock PercentChange">+0.33%</span>
    <span aria-label="Manual Arrangement Controller">⬙</span>
  </li>
  <li>
    <span aria-label="Stock Symbol & Stock Name">MSFT (Microsoft.com Corporation)</span>
    <span aria-label="Stock LastTradePrice">41.51</span>
    <span aria-label="Stock PercentChange">-17.76%</span>
    <span aria-label="Manual Arrangement Controller">⬙</span>
  </li>
  <li>
    <span aria-label="Stock Symbol & Stock Name">BMW (BMW Cars Corporation)</span>
    <span aria-label="Stock LastTradePrice">300.2</span>
    <span aria-label="Stock PercentChange">-1.76%</span>
    <span aria-label="Manual Arrangement Controller">⬙</span>
  </li>
  <li>
    <span aria-label="Stock Symbol & Stock Name">GPO (GoPro.com span)</span>
    <span aria-label="Stock LastTradePrice">11.09</span>
    <span aria-label="Stock PercentChange">30.38%</span>
    <span aria-label="Manual Arrangement Controller">⬙</span>
  </li>
</ul>
`;
  return list;
}

<!-- todo - Add event listeners to containers after the HTML was rendered (event delegation)-->
<!-- todo - On events, find the `data-id` of the item and find it’s data based on that id (only when you need to update it or do something with it)-->
