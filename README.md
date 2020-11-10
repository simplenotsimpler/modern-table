# ModernTable [![GitHub version](https://badge.fury.io/gh/simplenotsimpler%2Fmodern-table.svg)](https://badge.fury.io/gh/simplenotsimpler%2Fmodern-table) [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
Simple modern JavaScript ES6 library that fetches JSON data into an HTML table which displays nicely within a Bootstrap 4 Card.

# Notes:
* __*Only*__ targets **modern** browsers. 
* To help [Microsoft phase out IE11](https://techcommunity.microsoft.com/t5/microsoft-365-blog/microsoft-365-apps-say-farewell-to-internet-explorer-11-and/ba-p/1591666) and in anticipation of [Bootstrap 5 dropping IE support](https://blog.getbootstrap.com/2020/06/16/bootstrap-5-alpha/), IE is not supported.
* Compatible with Bootstrap 4.4.1 and higher.
* Specifically tested with Bootstrap 4.4.1 and 4.5.3.
* Theoretically, this should work with other CSS frameworks. However, this has __*NOT*__ been tested with other CSS frameworks, so your mileage may vary.
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
`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/simplenotsimpler/modern-table@1.0.7/src/modern-table.css">`

* JS:  
`<script src="https://cdn.jsdelivr.net/gh/simplenotsimpler/modern-table@1.0.7/src/modern-table.js"></script>`

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
This project is [MIT licensed](./LICENSE).