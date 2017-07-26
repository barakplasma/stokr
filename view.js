window.Stokr.View = (function () {
  // make sure that the view does now save state
  // todo render all html incl filter panel with normal render
  // todo pull view logic from controller to view
  function stockRowsToStockList(stockData, settings) {
    return `<ul class="stockList">${stockRowGenerator(stockData, settings).join('')}</ul>`;
  }

  function stockRowGenerator(stockData, settings) {
    // const stockData = stockDataFetcher();
    return stockData.map(stock => {
      return createStockRow(stock, settings);
    });
  }

// Added data-id to components in the HTML so we can find it’s related data using the clickHandler
  function createStockRow(stock, settings) {
    return `
   <li class="stockRow" data-id="${stock.Symbol}">
     <span class="stock-data stock-name" aria-label="Stock Symbol & Stock Name">
      ${window.Stokr.Controller.concatenateStockSymbolAndName(stock)}
     </span>
     <span class="stock-data stock-price" aria-label="Stock LastTradePrice">
      ${window.Stokr.Controller.roundPrice(stock.LastTradePriceOnly)}
     </span>
     <span class="stock-data stock-Change" data-change="${window.Stokr.Controller.stockGainOrLoss(stock)}" aria-label="Stock PercentChange">
      ${window.Stokr.Controller.roundPrice(parseFloat(stock[window.Stokr.Controller.getStockSettings()]))}
     </span>
     <div class="stock-position" style="${settings.featureToggles.filterPanel ? `display: none;` : ``}" aria-label="Row Up and Down Arrows">
     <svg class="arrows" viewBox="0 0 33 25" 
     version="1.1" 
     xmlns="http://www.w3.org/2000/svg">
      <polygon data-id="upArrow" fill="#8F8F8F" id="UpTriangle" transform="translate(16.500000, 11.000000) scale(-1, 1) translate(-16.500000, -11.000000)" points="16.1891892 3 28 19 5 19">
      </polygon>
     </svg>
     <svg class="arrows" 
     viewBox="0 0 33 25" version="1.1" xmlns="http://www.w3.org/2000/svg" >
      <polygon data-id="downArrow" fill="#8F8F8F" id="DownTriangle" transform="translate(16.500000, 11.000000) scale(1, -1) translate(-16.500000, -11.000000) " points="16.1891892 3 28 19 5 19">
      </polygon>
     </svg>
     </div>
   </li>
 `;
  }

  // todo put event listeners into view (since they aren't relevant in a CLI for example)
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

      window.Stokr.Model.stockSettings.changePercentToggle = !window.Stokr.Model.stockSettings.changePercentToggle;
      window.Stokr.Controller.render();
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

    if (e.target.alt === 'Refresh') {
      window.Stokr.Controller.populateModelWithNewStockData();
    }
  }

  function redoClickHandlers() {
    // console.time('redoClickHandlers');
    removeClickHandlersFromDOM();
    // window.Stokr.Controller.render();
    addClickHandlersToDOM();
    // console.timeEnd('redoClickHandlers');
  }

  function createFilterPanel() {
    const nameFilter = `<label for="stockName">By Name</label><input name="stockName"/>`;
    const gainFilter = `
      <label for="stockGain">By Gain</label>
      <select name="stockGain">
      <option value="all" selected>all</option>
      <option value="gaining">gaining</option>
      <option value="losing">losing</option>
      </select>`;
    const fromRangeFilter = `<label for="fromRange">By Price Range: From</label><input name="fromRange" type="number" min="0" 
step="0.01"/>`;
    const toRangeFilter = `<label for="toRange">By Price Range: To</label><input name="toRange" type="number" min="0" 
step="0.01"/>`;
    const fields = [nameFilter, gainFilter, fromRangeFilter, toRangeFilter];
    const wrappedFields = fields.map(field => {
      return `<span class="formField">${field}</span>`;
    });
    const applyButton = `<button id="filterApply">Apply</button>`;
    return `<div class="filterPanel">${wrappedFields.join('').concat(applyButton)}</div>`;
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
    window.Stokr.Controller.render();
  }


  function createHeader() {
    return `  
      <header>
      <h1 aria-label="Product Name"
          class="productName">STOKR</h1>
      <span class="functionBar">
      <a href="#search"><img
        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQxcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQxIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0NCAoNDE0MTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPkdyb3VwIDc8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMDAxLUluZGV4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTA3NS4wMDAwMDAsIC0xMDEuMDAwMDAwKSIgc3Ryb2tlPSIjQUJBQkFCIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwNzYuMDAwMDAwLCAxMDIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjguNjYzNDY0NCwyNy45MzM1MjQ1IEMzMS45NTA3ODk4LDI0Ljk4OTQ3ODkgMzMuOTkwMTYxOCwyMC44ODc5MzIgMzMuOTkwMTYxOCwxNi4zNTE0ODM1IEMzMy45OTAxNjE4LDcuMzkyMDAxNDcgMjYuMDM1MzQzMiwwLjEyODkwNjI1IDE2LjIyMjU3NzIsMC4xMjg5MDYyNSBDNi40MDk4MTEyMiwwLjEyODkwNjI1IDAsNy4zOTIwMDE0NyAwLDE2LjM1MTQ4MzUgQzAsMjUuMzEwOTY1NSA2LjQwOTgxMTIyLDMyLjU3NDA2MDcgMTYuMjIyNTc3MiwzMi41NzQwNjA3IEMyMC40NzA5Mzc3LDMyLjU3NDA2MDcgMjQuMzcxMDQ2NCwzMS4yMTI2NzM4IDI3LjQyODE0MSwyOC45NDE2Mzk3IEwzOC4zNTIwNjU5LDM4LjQzNjQwMjEgTDM5LjUzNzU5OTQsMzcuMzg1MDExIEwyOC42NjM0NjQ0LDI3LjkzMzUyNDUgWiIgaWQ9InNlYXJjaCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
        alt="Search" /></a>
      <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQycHgiIGhlaWdodD0iNDJweCIgdmlld0JveD0iMCAwIDQyIDQyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0NCAoNDE0MTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPkdyb3VwIDg8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBkPSJNMTkuODI0MjkyMywwIEMxOS4xMDc1NjE0LDAgMTguNzQ1OTk2MywwLjc3OTk3OTg2MiAxOS4yNjExNDY2LDEuMjMwNjM0ODkgTDI1LjA3NDk4NTcsNi40ODgyNzY5MyBMMTkuMjYxMTQ2NiwxMS43NDU5MTkgQzE4LjQ3NzIyMjIsMTIuNDI0NzkwMyAxOS42MzcxMTAzLDEzLjQ3MTk4NTUgMjAuMzg5MDM3OCwxMi43NjQyMjYgTDI2Ljc2NjAyMjYsNi45OTY3MDgyNCBDMjcuMDc3OTkyNSw2LjcxNTA0ODg1IDI3LjA3Nzk5MjUsNi4yNjAwNjA2IDI2Ljc2NjAyMjYsNS45Nzg0MDEyIEwyMC4zODkwMzc4LDAuMjA5NDM5MDM3IEMyMC4yMzg2NTIzLDAuMDcyMjIwMzU3NiAyMC4wNDAyNzE0LDAgMTkuODI0MjkyMywwIFogTTIwLjUsNiBDOS4xODcxNTM4NSw2IDAsMTQuNTE0OTIzMSAwLDI1IEMwLDM1LjQ4NTA3NjkgOS4xODcxNTM4NSw0NCAyMC41LDQ0IEMzMS44MTI4NDYyLDQ0IDQxLDM1LjQ4NTA3NjkgNDEsMjUgTDQxLDI0LjI2OTIzMDggQzQxLDIzLjMxNDg0NjIgMzkuNDIzMDc2OSwyMy4yOTI5MjMxIDM5LjQyMzA3NjksMjQuMjY5MjMwOCBMMzkuNDIzMDc2OSwyNSBDMzkuNDIzMDc2OSwzNC42OTQzODQ2IDMwLjk1OTczMDgsNDIuNTM4NDYxNSAyMC41LDQyLjUzODQ2MTUgQzEwLjA0MDI2OTIsNDIuNTM4NDYxNSAxLjU3NjkyMzA4LDM0LjY5NDM4NDYgMS41NzY5MjMwOCwyNSBDMS41NzY5MjMwOCwxNS4zMDU2MTU0IDEwLjA0MDI2OTIsNy40NjE1Mzg0NiAyMC41LDcuNDYxNTM4NDYgTDIxLjI4ODQ2MTUsNy40NjE1Mzg0NiBDMjIuMzEzNDYxNSw3LjQ2MTUzODQ2IDIyLjM0OTczMDgsNiAyMS4yODg0NjE1LDYgTDIwLjUsNiBaIiBpZD0icGF0aC0xIj48L3BhdGg+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMDA0LUNoYW5nZS1NaWxsaW9ucyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExMzUuMDAwMDAwLCAtMTAyLjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC05IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTI4LjAwMDAwMCwgOTMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtOCI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Im1icmktcmVmcmVzaCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjkuNzY1MjY0LCAyOC41NTg1MjYpIHJvdGF0ZSg2Mi4wMDAwMDApIHRyYW5zbGF0ZSgtMjkuNzY1MjY0LCAtMjguNTU4NTI2KSB0cmFuc2xhdGUoOS4yNjUyNjQsIDYuNTU4NTI2KSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJTaGFwZSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIGZpbGw9IiNBQkFCQUIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBzdHJva2U9IiNBQkFCQUIiIHN0cm9rZS13aWR0aD0iMSIgZD0iTTE5LjgyNDI5MjMsMC41IEMxOS45MTk2OTYzLDAuNSAxOS45OTY5MDA3LDAuNTI4NDk1MDg3IDIwLjA1MjAyMzQsMC41Nzg3OTE2MDIgTDI2LjQzMDU4OCw2LjM0OTE4OTA3IEMyNi41MjMwMTQsNi40MzI2MzU0NSAyNi41MjMwMTQsNi41NDI0NzQgMjYuNDMwOTU4LDYuNjI1NTg2IEwyMC4wNTM2NDk0LDEyLjM5MzM5NjMgQzE5LjkwMTM1MjksMTIuNTM2NjExMSAxOS43MjIwNzg3LDEyLjUyODQwODMgMTkuNTg0MjEyMywxMi40MDM5MzY4IEMxOS40NzM3MzU3LDEyLjMwNDE5MzkgMTkuNDY5NDAyNCwxMi4yMjY5OTc4IDE5LjU4ODQ2NiwxMi4xMjM4ODk5IEwyNS40MTAzNTQ3LDYuODU5MTI0MDggTDI1LjgyMDQzMzIsNi40ODgyNzY5MyBMMTkuNTk2NTE1NiwwLjg1OTc4NzczOCBDMTkuNDQyMjYxMiwwLjcyNDc1NTI4NCAxOS41NDU2Mjk1LDAuNSAxOS44MjQyOTIzLDAuNSBaIE0yMC41LDYuNSBDOS40NTUxNjYxMiw2LjUgMC41LDE0Ljc5OTkxMDEgMC41LDI1IEMwLjUsMzUuMjAwMDg5OSA5LjQ1NTE2NjEyLDQzLjUgMjAuNSw0My41IEMzMS41NDQ4MzM5LDQzLjUgNDAuNSwzNS4yMDAwODk5IDQwLjUsMjUgTDQwLjUsMjQuMjY5MjMwOCBDNDAuNSwyNC4xMzE1ODUxIDQwLjM5NjA3MjgsMjQuMDQ2NTE2IDQwLjIwODA2MjksMjQuMDQ1MjA5MSBDNDAuMDIxNjUzNCwyNC4wNDM5MTMzIDM5LjkyMzA3NjksMjQuMTI0MTQ1OCAzOS45MjMwNzY5LDI0LjI2OTIzMDggTDM5LjkyMzA3NjksMjUgQzM5LjkyMzA3NjksMzQuOTc5MzcxNiAzMS4yMjc3NDMsNDMuMDM4NDYxNSAyMC41LDQzLjAzODQ2MTUgQzkuNzcyMjU2OTYsNDMuMDM4NDYxNSAxLjA3NjkyMzA4LDM0Ljk3OTM3MTYgMS4wNzY5MjMwOCwyNSBDMS4wNzY5MjMwOCwxNS4wMjA2Mjg0IDkuNzcyMjU2OTYsNi45NjE1Mzg0NiAyMC41LDYuOTYxNTM4NDYgTDIxLjI4ODQ2MTUsNi45NjE1Mzg0NiBDMjEuNDc4NjYxNiw2Ljk2MTUzODQ2IDIxLjU2OTA4NDUsNi44NjY5MzA3NSAyMS41NzA4NTEsNi43MjQ1NjU3NiBDMjEuNTcyNTY2NCw2LjU4NjMxNjEgMjEuNDkwNzgyMiw2LjUgMjEuMjg4NDYxNSw2LjUgTDIwLjUsNi41IFoiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
           alt="Refresh" />
      <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQ1cHgiIGhlaWdodD0iMzlweCIgdmlld0JveD0iMCAwIDQ1IDM5IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0NCAoNDE0MTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlBhdGggMjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSIwMDQtQ2hhbmdlLU1pbGxpb25zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTIwNC4wMDAwMDAsIC0xMDUuMDAwMDAwKSIgc3Ryb2tlPSIjOEY4RjhGIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExMjguMDAwMDAwLCA5My4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoLTIiIHBvaW50cz0iNzYgMTMuMTk4NTExMiAxMjEgMTMgMTAyLjYyNjg2MSAzMC41ODE0MjA2IDEwMi42MjY4NjEgNDUuMTU2MTcgOTMuNjY0MzkyMSA1MC4xMTg0ODY0IDkzLjY2NDM5MjEgMzAuNTg5OTUwNCI+PC9wb2x5Z29uPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
           alt="Filter" />
      <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0NCAoNDE0MTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPm1icmktc2V0dGluZzM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMDA0LUNoYW5nZS1NaWxsaW9ucyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyNzIuMDAwMDAwLCAtMTAzLjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbD0iI0FCQUJBQiI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC05IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTI4LjAwMDAwMCwgOTMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ibWJyaS1zZXR0aW5nMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQ0LjAwMDAwMCwgMTAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE4LDAgQzE2LjkwNCwwIDE2LDAuOTA0IDE2LDIgTDE2LDQuNjIgQzE0LjU3Niw0Ljk4NjY2NjY3IDEzLjIxNiw1LjU0NjY2NjY3IDExLjk0NjY2NjcsNi4yODY2NjY2NyBMMTAuMjQsNC41OCBDOS40NjQsMy44MDY2NjY2NyA4LjE4NjY2NjY3LDMuODA2NjY2NjcgNy40MDkzMzMzMyw0LjU4IEw0LjU4MjY2NjY3LDcuNDA5MzMzMzMgQzMuODA1MzMzMzMsOC4xODUzMzMzMyAzLjgwNTMzMzMzLDkuNDYyNjY2NjcgNC41ODI2NjY2NywxMC4yNCBMNi4yOTIsMTEuOTUwNjY2NyBDNS41NDUzMzMzMywxMy4yMTczMzMzIDQuOTgsMTQuNTc3MzMzMyA0LjYwOCwxNiBMMiwxNiBDMC45MDQsMTYgMCwxNi45MDQgMCwxOCBMMCwyMiBDMCwyMy4wOTYgMC45MDQsMjQgMiwyNCBMNC42MiwyNCBDNC45ODY2NjY2NywyNS40MjQgNS41NDY2NjY2NywyNi43ODQgNi4yODY2NjY2NywyOC4wNTMzMzMzIEw0LjU4LDI5Ljc2IEMzLjgwNjY2NjY3LDMwLjUzNiAzLjgwNjY2NjY3LDMxLjgxMzMzMzMgNC41OCwzMi41OTA2NjY3IEw3LjQwOTMzMzMzLDM1LjQxNzMzMzMgQzguMTg1MzMzMzMsMzYuMTk0NjY2NyA5LjQ2MjY2NjY3LDM2LjE5NDY2NjcgMTAuMjQsMzUuNDE3MzMzMyBMMTEuOTUwNjY2NywzMy43MDggQzEzLjIxNzMzMzMsMzQuNDU0NjY2NyAxNC41NzczMzMzLDM1LjAyIDE2LDM1LjM5MiBMMTYsMzggQzE2LDM5LjA5NiAxNi45MDQsNDAgMTgsNDAgTDIyLDQwIEMyMy4wOTYsNDAgMjQsMzkuMDk2IDI0LDM4IEwyNCwzNS4zOCBDMjUuNDI0LDM1LjAxMzMzMzMgMjYuNzg0LDM0LjQ1MzMzMzMgMjguMDUzMzMzMywzMy43MTMzMzMzIEwyOS43NiwzNS40MiBDMzAuNTM2LDM2LjE5MzMzMzMgMzEuODEzMzMzMywzNi4xOTMzMzMzIDMyLjU5MDY2NjcsMzUuNDIgTDM1LjQxNzMzMzMsMzIuNTkwNjY2NyBDMzYuMTk0NjY2NywzMS44MTQ2NjY3IDM2LjE5NDY2NjcsMzAuNTM3MzMzMyAzNS40MTczMzMzLDI5Ljc2IEwzMy43MDgsMjguMDQ5MzMzMyBDMzQuNDU0NjY2NywyNi43ODI2NjY3IDM1LjAyLDI1LjQyMjY2NjcgMzUuMzkyLDI0IEwzOCwyNCBDMzkuMDk2LDI0IDQwLDIzLjA5NiA0MCwyMiBMNDAsMTggQzQwLDE2LjkwNCAzOS4wOTYsMTYgMzgsMTYgTDM1LjM4LDE2IEMzNS4wMTMzMzMzLDE0LjU3NiAzNC40NTMzMzMzLDEzLjIxNiAzMy43MTMzMzMzLDExLjk0NjY2NjcgTDM1LjQyLDEwLjI0IEMzNi4xOTMzMzMzLDkuNDY0IDM2LjE5MzMzMzMsOC4xODY2NjY2NyAzNS40Miw3LjQwOTMzMzMzIEwzMi41OTA2NjY3LDQuNTgyNjY2NjcgQzMxLjgxNDY2NjcsMy44MDUzMzMzMyAzMC41MzczMzMzLDMuODA1MzMzMzMgMjkuNzYsNC41ODI2NjY2NyBMMjguMDQ5MzMzMyw2LjI5MiBDMjYuNzgyNjY2Nyw1LjU0NTMzMzMzIDI1LjQyMjY2NjcsNC45OCAyNCw0LjYwOCBMMjQsMiBDMjQsMC45MDQgMjMuMDk2LDAgMjIsMCBMMTgsMCBaIE0xOCwxLjMzMzMzMzMzIEwyMiwxLjMzMzMzMzMzIEMyMi4zODEzMzMzLDEuMzMzMzMzMzMgMjIuNjY2NjY2NywxLjYxODY2NjY3IDIyLjY2NjY2NjcsMiBMMjIuNjY2NjY2Nyw1LjA0NCBDMjIuNjY2NTEwNyw1LjM1NTgwNTQgMjIuODgyNTAwNSw1LjYyNjA2OTUxIDIzLjE4NjY2NjcsNS42OTQ2NjY2NyBDMjQuODQ0LDYuMDY4IDI2LjQyNCw2LjcyMTMzMzMzIDI3Ljg1NzMzMzMsNy42MzQ2NjY2NyBDMjguMTIwODgsNy44MDAzOTE3NyAyOC40NjQwMzg0LDcuNzYxNjQ4MDcgMjguNjg0LDcuNTQxMzMzMzMgTDMwLjcwMjY2NjcsNS41MjUzMzMzMyBDMzAuOTcyLDUuMjU2IDMxLjM4LDUuMjU2IDMxLjY0OTMzMzMsNS41MjUzMzMzMyBMMzQuNDc2LDguMzUyIEMzNC43NDUzMzMzLDguNjIxMzMzMzMgMzQuNzQ1MzMzMyw5LjAyOTMzMzMzIDM0LjQ3Niw5LjI5ODY2NjY3IEwzMi40NjY2NjY3LDExLjMwNjY2NjcgQzMyLjI0NDk3MDEsMTEuNTI3MDQxNyAzMi4yMDYxNjM5LDExLjg3MTg2MTkgMzIuMzczMzMzMywxMi4xMzYgQzMzLjI4LDEzLjU3MDY2NjcgMzMuOTI5MzMzMywxNS4xNTIgMzQuMjkzMzMzMywxNi44MDkzMzMzIEMzNC4zNjA1Mjk0LDE3LjExNjA2NjcgMzQuNjMyNjYwOCwxNy4zMzQzMjcyIDM0Ljk0NjY2NjcsMTcuMzMzMzMzMyBMMzgsMTcuMzMzMzMzMyBDMzguMzgxMzMzMywxNy4zMzMzMzMzIDM4LjY2NjY2NjcsMTcuNjE4NjY2NyAzOC42NjY2NjY3LDE4IEwzOC42NjY2NjY3LDIyIEMzOC42NjY2NjY3LDIyLjM4MTMzMzMgMzguMzgxMzMzMywyMi42NjY2NjY3IDM4LDIyLjY2NjY2NjcgTDM0Ljk1NiwyMi42NjY2NjY3IEMzNC42NDQxOTQ2LDIyLjY2NjUxMDcgMzQuMzczOTMwNSwyMi44ODI1MDA1IDM0LjMwNTMzMzMsMjMuMTg2NjY2NyBDMzMuOTMyLDI0Ljg0NCAzMy4yNzg2NjY3LDI2LjQyNCAzMi4zNjUzMzMzLDI3Ljg1NzMzMzMgQzMyLjE5OTYwODIsMjguMTIwODggMzIuMjM4MzUxOSwyOC40NjQwMzg0IDMyLjQ1ODY2NjcsMjguNjg0IEwzNC40NzQ2NjY3LDMwLjcwMjY2NjcgQzM0Ljc0NCwzMC45NzIgMzQuNzQ0LDMxLjM4IDM0LjQ3NDY2NjcsMzEuNjQ5MzMzMyBMMzEuNjQ4LDM0LjQ3NiBDMzEuMzc4NjY2NywzNC43NDUzMzMzIDMwLjk3MDY2NjcsMzQuNzQ1MzMzMyAzMC43MDEzMzMzLDM0LjQ3NiBMMjguNjkzMzMzMywzMi40NjY2NjY3IEMyOC40NzI5NTgzLDMyLjI0NDk3MDEgMjguMTI4MTM4MSwzMi4yMDYxNjM5IDI3Ljg2NCwzMi4zNzMzMzMzIEMyNi40MjkzMzMzLDMzLjI4IDI0Ljg0OCwzMy45MjkzMzMzIDIzLjE5MDY2NjcsMzQuMjkzMzMzMyBDMjIuODgzOTMzMywzNC4zNjA1Mjk0IDIyLjY2NTY3MjgsMzQuNjMyNjYwOCAyMi42NjY2NjY3LDM0Ljk0NjY2NjcgTDIyLjY2NjY2NjcsMzggQzIyLjY2NjY2NjcsMzguMzgxMzMzMyAyMi4zODEzMzMzLDM4LjY2NjY2NjcgMjIsMzguNjY2NjY2NyBMMTgsMzguNjY2NjY2NyBDMTcuNjE4NjY2NywzOC42NjY2NjY3IDE3LjMzMzMzMzMsMzguMzgxMzMzMyAxNy4zMzMzMzMzLDM4IEwxNy4zMzMzMzMzLDM0Ljk1NiBDMTcuMzMzNDg5MywzNC42NDQxOTQ2IDE3LjExNzQ5OTUsMzQuMzczOTMwNSAxNi44MTMzMzMzLDM0LjMwNTMzMzMgQzE1LjE1NiwzMy45MzIgMTMuNTc2LDMzLjI3ODY2NjcgMTIuMTQyNjY2NywzMi4zNjUzMzMzIEMxMS44NzkxMiwzMi4xOTk2MDgyIDExLjUzNTk2MTYsMzIuMjM4MzUxOSAxMS4zMTYsMzIuNDU4NjY2NyBMOS4yOTczMzMzMywzNC40NzQ2NjY3IEM5LjAyOCwzNC43NDQgOC42MiwzNC43NDQgOC4zNTA2NjY2NywzNC40NzQ2NjY3IEw1LjUyNCwzMS42NDggQzUuMjU0NjY2NjcsMzEuMzc4NjY2NyA1LjI1NDY2NjY3LDMwLjk3MDY2NjcgNS41MjQsMzAuNzAxMzMzMyBMNy41MzMzMzMzMywyOC42OTMzMzMzIEM3Ljc1NTAyOTk0LDI4LjQ3Mjk1ODMgNy43OTM4MzYwNywyOC4xMjgxMzgxIDcuNjI2NjY2NjcsMjcuODY0IEM2LjcyLDI2LjQyOTMzMzMgNi4wNzA2NjY2NywyNC44NDggNS43MDY2NjY2NywyMy4xOTA2NjY3IEM1LjYzOTQ3MDY0LDIyLjg4MzkzMzMgNS4zNjczMzkyMywyMi42NjU2NzI4IDUuMDUzMzMzMzMsMjIuNjY2NjY2NyBMMiwyMi42NjY2NjY3IEMxLjYxODY2NjY3LDIyLjY2NjY2NjcgMS4zMzMzMzMzMywyMi4zODEzMzMzIDEuMzMzMzMzMzMsMjIgTDEuMzMzMzMzMzMsMTggQzEuMzMzMzMzMzMsMTcuNjE4NjY2NyAxLjYxODY2NjY3LDE3LjMzMzMzMzMgMiwxNy4zMzMzMzMzIEw1LjA0NCwxNy4zMzMzMzMzIEM1LjM1NTgwNTQsMTcuMzMzNDg5MyA1LjYyNjA2OTUxLDE3LjExNzQ5OTUgNS42OTQ2NjY2NywxNi44MTMzMzMzIEM2LjA2OCwxNS4xNTYgNi43MjEzMzMzMywxMy41NzYgNy42MzQ2NjY2NywxMi4xNDI2NjY3IEM3LjgwMDM5MTc3LDExLjg3OTEyIDcuNzYxNjQ4MDcsMTEuNTM1OTYxNiA3LjU0MTMzMzMzLDExLjMxNiBMNS41MjUzMzMzMyw5LjI5NiBDNS4yNTYsOS4wMjY2NjY2NyA1LjI1Niw4LjYxODY2NjY3IDUuNTI1MzMzMzMsOC4zNDkzMzMzMyBMOC4zNTIsNS41MjI2NjY2NyBDOC42MjEzMzMzMyw1LjI1MzMzMzMzIDkuMDI5MzMzMzMsNS4yNTMzMzMzMyA5LjI5ODY2NjY3LDUuNTIyNjY2NjcgTDExLjMwNjY2NjcsNy41MzMzMzMzMyBDMTEuNTI3MDQxNyw3Ljc1NTAyOTk0IDExLjg3MTg2MTksNy43OTM4MzYwNyAxMi4xMzYsNy42MjY2NjY2NyBDMTMuNTcwNjY2Nyw2LjcyIDE1LjE1Miw2LjA3MDY2NjY3IDE2LjgwOTMzMzMsNS43MDY2NjY2NyBDMTcuMTE2MDY2Nyw1LjYzOTQ3MDY0IDE3LjMzNDMyNzIsNS4zNjczMzkyMyAxNy4zMzMzMzMzLDUuMDUzMzMzMzMgTDE3LjMzMzMzMzMsMiBDMTcuMzMzMzMzMywxLjYxODY2NjY3IDE3LjYxODY2NjcsMS4zMzMzMzMzMyAxOCwxLjMzMzMzMzMzIFogTTIwLDEzLjMzMzMzMzMgQzE2LjMyNTMzMzMsMTMuMzMzMzMzMyAxMy4zMzMzMzMzLDE2LjMyNTMzMzMgMTMuMzMzMzMzMywyMCBDMTMuMzMzMzMzMywyMy42NzQ2NjY3IDE2LjMyNTMzMzMsMjYuNjY2NjY2NyAyMCwyNi42NjY2NjY3IEMyMy42NzQ2NjY3LDI2LjY2NjY2NjcgMjYuNjY2NjY2NywyMy42NzQ2NjY3IDI2LjY2NjY2NjcsMjAgQzI2LjY2NjY2NjcsMTYuMzI1MzMzMyAyMy42NzQ2NjY3LDEzLjMzMzMzMzMgMjAsMTMuMzMzMzMzMyBaIE0yMCwxNC42NjY2NjY3IEMyMi45NTMzMzMzLDE0LjY2NjY2NjcgMjUuMzMzMzMzMywxNy4wNDY2NjY3IDI1LjMzMzMzMzMsMjAgQzI1LjMzMzMzMzMsMjIuOTUzMzMzMyAyMi45NTMzMzMzLDI1LjMzMzMzMzMgMjAsMjUuMzMzMzMzMyBDMTcuMDQ2NjY2NywyNS4zMzMzMzMzIDE0LjY2NjY2NjcsMjIuOTUzMzMzMyAxNC42NjY2NjY3LDIwIEMxNC42NjY2NjY3LDE3LjA0NjY2NjcgMTcuMDQ2NjY2NywxNC42NjY2NjY3IDIwLDE0LjY2NjY2NjcgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
           alt="Settings" />
    </span>
    </header>
  `
  }

  function createMain() {
    return `
      <main>
        <section class="filterPanel_Container"></section>
        <ul class="stockList">
        </ul>
      </main>
    `;
  }

  function normalRoute(stockData, settings) {
    document.querySelector('.container').innerHTML = createHeader() + createMain();
    document.querySelector('.stockList').innerHTML = stockRowsToStockList(stockData, settings);
    let filterPanelLocation = document.querySelector('.filterPanel_Container');
    let filterPanelGenerated = filterPanelLocation.innerHTML !== '';
    // console.log(settings);
    if (settings.featureToggles.filterPanel && !filterPanelGenerated) {
      filterPanelLocation.innerHTML = createFilterPanel();
    }
    if (!settings.featureToggles.filterPanel && filterPanelGenerated) {
      filterPanelLocation.innerHTML = '';
    }
    redoClickHandlers();
  }

  function searchRoute() {
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
        searchRoute()
      } else {
        normalRoute(stockData, settings)
      }
    }
  }
})();
