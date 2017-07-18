const table = `<table>
  <thead>
  <tr>
    <th aria-label="Stock Symbol & Stock Name"></th>
    <th aria-label="Stock LastTradePrice"></th>
    <th aria-label="Stock PercentChange"></th>
    <th aria-label="Manual Arrangement controller"></th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>AAPL (Apple.com Company)</td>
    <td>143.73</td>
    <td>-2.62%</td>
    <td>⬙</td>
  </tr>
  <tr>
    <td>GOOG (Google.com Inc)</td>
    <td>927.33</td>
    <td>-2.62%</td>
    <td>⬙</td>
  </tr>
  <tr>
    <td>WIX (Wix.com Ltd)</td>
    <td>76.10</td>
    <td>+0.33%</td>
    <td>⬙</td>
  </tr>
  <tr>
    <td>MSFT (Microsoft.com Coporation)</td>
    <td>41.51</td>
    <td>-17.76%</td>
    <td>⬙</td>
  </tr>
  <tr>
    <td>BMW (BMW Cars Coporation)</td>
    <td>300.2</td>
    <td>-1.76%</td>
    <td>⬙</td>
  </tr>
  <tr>
    <td>GPO (GoPro.com LTD)</td>
    <td>11.09</td>
    <td>30.38%</td>
    <td>⬙</td>
  </tr>
  </tbody>
</table>
`;

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
</ul>`;

<!-- todo - Break down the string creation with functions-->
init();

function init() {
  sendStockDataToDom();
}

function sendStockDataToDom() {
  document.querySelector('main').innerHTML = processDataToHTML();
}

function processDataToHTML() {
  // temporarily, do it the easy way for testing
  return list;
}

<!-- todo - Have one render function that initiates the HTML string creation and pushes to the document with `innerHTML`-->
<!-- todo - Add event listeners to containers after the HTML was rendered (event delegation)-->
<!-- todo - On events, find the `data-id` of the item and find it’s data based on that id (only when you need to update it or do something with it)-->
