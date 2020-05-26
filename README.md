# ModernTable [![GitHub version](https://badge.fury.io/gh/simplenotsimpler%2Fmodern-table.svg)](https://badge.fury.io/gh/simplenotsimpler%2Fmodern-table) [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
A simple modern ES6 library that fetches JSON data and displays it in a table. Unlike most data tables, this displays nicely within a Bootstrap 4 Card. 

# Notes:
* __*Only*__ targets **modern** browsers. 
* This class is ___NOT___  compatible with IE. This is intentional...how can we help Microsoft kill IE if we keep making stuff that works with it?
* Tested with Bootstrap 4.4.1 CSS framework.
* This has __*NOT*__ been tested with other CSS frameworks.
* If number or date formatting are specified in the configuration, but the proper library does not load, this gracefully fails to no formatting.
* Strongly recommended to use ISO 8601 date formats in your source data and configuration. Then use the UI for localization.

# Live Demo
[https://simplenotsimpler.github.io/modern-table-example/](https://simplenotsimpler.github.io/modern-table-example/)

# Getting Started
## Documentation
[https://simplenotsimpler.github.io/modern-table/](https://simplenotsimpler.github.io/modern-table/)

## Requires:
* JSON data source
* Container to hold the table
* [modern-table.css](/src/modern-table.css)

## Recommended:
* Number formatting: [format-intl-number library](https://github.com/simplenotsimpler/format-intl-number)
* Date formatting: [Moment.js](https://momentjs.com/)

## CDN:
* CSS:  
`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/simplenotsimpler/modern-table@1.0.5/src/modern-table.css">`

* JS:  
`<script src="https://cdn.jsdelivr.net/gh/simplenotsimpler/modern-table@1.0.5/src/modern-table.js"></script>`

## Example
**HTML:**
```html
<div class="card card-body rounded shadow-lg">
    <div id="table-container" class="table-responsive table-height"></div>
</div>
```
**JS:**
```javascript
const localJSON = 'data/sample-sales-data.json';

const sampleTable = new ModernTable(
  'table-container', // tableContainerID
  'sample-table', // tableID
  localJSON, // dataURL
  {
    tableClasses: 'table table-bordered table-striped table-hover table-sticky table-sm',
    tableCaption: 'Sample Sales Data',  
    searchClasses: 'form-control mb-2 w-25 float-right',
    colConfig: {
      'rpt_date': {
        'format': 'date-us',
        'dateFrom': 'YYYY-MM-DD',
        'dateTo': 'MM/DD/YY',
        'columnTitle': 'report date'
      },
      'new_customers': {
        'format': 'number-grouped',
        'alignment': 'right'
      },
      'revenue': {
        'format': 'currency-us',
        'alignment': 'right'
      },
      'cogs': {
        'format': 'currency-us',
        'alignment': 'right'
      },
      'profit': {
        'format': 'currency-us',
        'alignment': 'right'
      },
      'profit_margin': {
        'format': 'percent',
        'numDecimals': 1,
        'alignment': 'right'
      }
    }
  });
```
# Styling
For the most part, the table is stylistically agnostic with a few exceptions which allow for a simple table scroll:
* Container for the table has explicit height and overflow. These can be overriden.
* Table header is sticky.
* Sticky table header makes the header row background transparent, so this was explicitly set. This can be overridden.

For details on specific classes see [modern-table.css](/src/modern-table.css).

# License
ModernTable is [MIT licensed](./LICENSE).