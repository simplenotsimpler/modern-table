/**
 * ModernTable Library
 * Library for displaying a data table from a JSON source.
 * @author SimpleNotSimpler
 * @version 1.0.7
 * @license MIT
 *                                                                                                
 * @requires modern-table.css {@link modern-table.css}
 * 
 * Recommended (for number/date formatting):
 * Number formatting: format-int-number library {@link https://github.com/simplenotsimpler/format-intl-number}
 * Date formatting: Moment.js {@link https://momentjs.com/}
 * 
 */



/**
 *
 * @class ModernTable
 * @classdesc A simple ES6 class targeting modern browsers that dynamically creates a data table from a JSON source. Displays nicely within Bootstrap Card.
 * 
 * <ul><strong>RECOMMENDED</strong>:
 * <li>Number formatting: <a href="https://github.com/simplenotsimpler/format-intl-number">format-intl-number library</a></li>
 * <li>Date formatting: <a href="https://momentjs.com/">Moment.js</a></li>
 * </ul> 
 *
 * <ul><strong>NOTES:</strong>
 *    <li>Underscores (_) used to indicate private (local) methods that should not be used outside of the class.</li>
 *    <li>tableFooter can affect the width of the first column.</li>
 * </ul>
 * 
 * @param {string} tableContainerID The ID of the element that contains the table.
 * @param {string} tableID The ID we want to assign to the table.
 * @param {string} dataURL URL used to fetch JSON data to build table.
 * @param {Object} [options] Optional configuration object.
 * @param {string} [options.tableClasses] Enter classes as a single string same as if entering in the class attribute.
 * @param {string} [options.tableCaption] String for specifying table caption.
 * @param {string} [options.tableFooter] String for specifying table footer.
 * @param {boolean} [options.enableSearch=true] - boolean to enable using the search box.
 * @param {string} [options.searchClasses] Classes to be used on the search element.
 * @param {Object} [options.colConfig] Column configuration object. Key is column name.
 * @param {string} [options.colConfig.colName] The name of the column in the model to set options for. 
 * @param {string} [options.colConfig.colName.format] Column format: 'date-us', 'number-grouped', 'number-ungrouped', 'currency-us', 'percent'. 
 * @param {string} [options.colConfig.colName.dateSource] Date format of source data.
 * @param {string} [options.colConfig.colName.dateDisplay] Format that the date should be displayed in.
 * @param {number} [options.colConfig.colName.numDecimals=0] Number of decimals to display. 
 * @param {string} [options.colConfig.colName.alignment] Cell alignment: left, center, and right.
 * 
 */
class ModernTable {

    constructor(
        //required parameters
        tableContainerID = '',
        tableID = '',
        dataURL = '',

        //optional parameters via config object
        {
            tableClasses = '',
            tableCaption = '',
            tableFooter = '',
            enableStickyHeader = true,
            enableSearch = true,
            searchClasses = '',
            colConfig = {}
        } = {}
    ) {

        this.tableContainer = document.getElementById(`${tableContainerID}`);
        this.tableID = tableID;
        this.dataURL = dataURL;
        this.tableClasses = tableClasses;
        this.tableCaption = tableCaption;
        this.tableFooter = tableFooter;
        this.enableStickyHeader = enableStickyHeader;
        this.enableSearch = enableSearch;
        this.searchClasses = searchClasses;
        //because using async functions with fetching data, this is a globabl variable rather than being passed
        this.colConfig = colConfig;
        this.defaultAlignment = 'left';


        //call last
        this._buildTable();

    }

    /**
     * @summary Builds the table by fetching the data & rendering the table in the GUI.
     * @private
     * @memberof ModernTable
     */
    async _buildTable() {
        const data = await this._fetchData(this.dataURL);
        this._renderTable(data);
    }

    /**
     * @summary Fetches data and renders table if data was successfully fetched.
     * @private
     * @param {string} urlToBeFetched
     * @returns {Object[]} responseJSON
     * @memberof ModernTable
     */

    async _fetchData(urlToBeFetched) {

        try {
            const response = await fetch(urlToBeFetched);

            if (response.ok) {

                //check for content type per:
                // https://stackoverflow.com/questions/37121301/how-to-check-if-the-response-of-a-fetch-is-a-json-object-in-javascript
                //  answered May 9 '16 at 17:02 nils

                const responseContentType = response.headers.get("content-type");

                if (responseContentType && responseContentType.indexOf("application/json") !== -1) {
                    const responseJSON = await response.json();
                    return responseJSON;
                } else {
                    throw new JSONSyntaxError(`<br><strong>Data URL:</strong> ${urlToBeFetched}`);
                }
            } else {
                throw new HTTPError(`${response.status} ${response.statusText} <br><strong>Data URL:</strong> ${urlToBeFetched}`);
            }
        } catch (error) {
            const tblErrorHandler = new TableErrorHandler(error);
        }

    }

    /**
     * @summary Processes fetched data into an HTML table.
     * @private
     * @param {Object[]} tableData
     * @memberof ModernTable
     */

    _renderTable(tableData) {

        const table = document.createElement('table');

        // note: order is critical. table body must be rendered FIRST !!!
        // otherwise everything is rendered in the head
        this._renderTableBody(table, tableData);
        this._renderTableHead(table, tableData);

        if (this.tableClasses) {
            table.className = this.tableClasses;
        }

        if (this.tableCaption) {
            table.createCaption().innerText = this.tableCaption;
            // adding mt-caption to table colors the table text when try override 
            // and does not color the caption itself
            // so need this class only on the caption (makes sense)
            // table.classList.add('mt-caption');
            table.caption.classList.add('mt-caption');
        }

        if (this.tableFooter) {
            table.createTFoot().innerText = this.tableFooter;
        }

        // add class to table so retains border on table header when have sticky header
        table.classList.add('mt-table');

        table.id = this.tableID;

        //add class to container so fixes table overflow
        this.tableContainer.classList.add('mt-table-height');


        //add table almost last
        this.tableContainer.insertAdjacentElement('afterbegin', table);

        if (this.enableSearch) {
            this._renderTableSearch(table);
        }
    }

    /**
     *
     * @summary Creates a search as you type search element.
     * @private
     * @param {Object} elementTable
     * @memberof ModernTable
     */
    _renderTableSearch(elementTable) {
        const tableSearchBox = document.createElement('input');

        tableSearchBox.className = this.searchClasses;
        tableSearchBox.setAttribute('type', 'search');
        tableSearchBox.setAttribute('placeholder', 'Search table');
        tableSearchBox.setAttribute('aria-label', 'Search');
        tableSearchBox.setAttribute('size', '50');

        elementTable.insertAdjacentElement('beforebegin', tableSearchBox);

        tableSearchBox.addEventListener('keyup', (e) => {

            this._cancelSearch(e);

            this._filterTable(e, elementTable.rows);
        });
    }

    /**
     * @summary Provides a method for canceling a search.
     * @private
     * @param {event} e
     * @memberof ModernTable
     */
    _cancelSearch(e) {
        /* ESC = 27, CTRL+Z / CMD+Z = 90
        http://keycodes.atjayjo.com/#charcode */
        if (e.keyCode === 27 || e.keyCode === 90) {
            e.target.value = '';
        }
    }

    /**
     * @summary Loops through each cell in each row and checks if matches searchText.
     * @private
     * @param {event} e
     * @param {array} rows - rows collection of a table element
     * @memberof ModernTable
     */

    _filterTable(e, rows) {
        const searchText = e.target.value.toLowerCase();
        let isMatch = true;

        // Accessing Table cells collection via the row
        // https://www.w3schools.com/jsref/coll_table_cells.asp
        // Keep names generic. Otherwise, renaming can break code
        // e.g. tableRow.tableCells doesn't work.
        for (let row of rows) {
            for (let cell of row.cells) {
                if (cell.textContent.toLowerCase().indexOf(searchText) > -1) {
                    isMatch = true;
                }
            }

            if (isMatch) {
                row.style.display = '';
                isMatch = false;
            } else {
                row.style.display = 'none';
            }

        }
    }

    /**
     * @summary Process fetched data into a table body.
     * @private
     * @param {string} elementTable
     * @param {Object} tableData
     * @memberof ModernTable
     */
    _renderTableBody(elementTable, tableData) {

        const dataRows = tableData;

        for (let dataRow of dataRows) {

            let tableRow = elementTable.insertRow();
            let tableCell;

            //switched to using entries so that can more easily check the key for formatting
            const dataCells = Object.entries(dataRow);

            for (let [dataKey, dataCell] of dataCells) {

                let alignment = this.defaultAlignment;
                let alignmentClass;

                tableCell = tableRow.insertCell();


                //from https://dmitripavlutin.com/7-tips-to-handle-undefined-in-javascript/
                // section 2.2 Tip # 3

                //check that colConfig was set before call stuff
                if (this.colConfig) {
                    if (dataKey in this.colConfig) {

                        // format table cell
                        dataCell = this._formatCellValue(dataCell, dataKey);

                        alignment = this._setAlignment(dataKey);
                    }
                }

                alignmentClass = `align-text-${alignment}`;


                tableCell.innerText = dataCell;
                tableCell.classList.add(alignmentClass);
            }
        }
    }

    /**
     *
     * @summary Creates table row from fetched data's keys. 
     * @private
     * @param {string} elementTable
     * @param {Object[]} tableData
     * @memberof ModernTable
     */
    _renderTableHead(elementTable, tableData) {

        const firstRow = tableData[0];
        const colHeaders = Object.keys(firstRow);

        let alignment = this.defaultAlignment;
        let alignmentClass;
        let colHeader;
        let tableTH;

        let tableHead = elementTable.createTHead();
        let tableHeadRow = tableHead.insertRow();


        for (colHeader of colHeaders) {

            //have to set the colTitle to colHeader so have a default for later
            let colTitle = colHeader;

            if (this.colConfig) {

                if (colHeader in this.colConfig) {

                    //set column title if it had been configured manually 
                    colTitle = this._setColTitle(colHeader);

                    //set alignment for table header cell
                    alignment = this._setAlignment(colHeader);

                }
            }

            //often when get data from databases, columns will have underscores to separate words
            colTitle = colTitle.replace('_', ' ');

            //create table element, set text & scope (for screen readers)
            tableTH = document.createElement('th');
            tableTH.innerText = colTitle;
            tableTH.setAttribute('scope', 'col');

            // https://css-tricks.com/almanac/properties/t/text-transform/
            // https://codepen.io/mariemosley/pen/0f4293fce0d14aafc3818c950ab0ded3
            // best practice is to use classList.add
            tableTH.classList.add('mt-col-header-capitalize');


            if (this.enableStickyHeader) {
                tableTH.classList.add('mt-header-sticky');
                tableTH.classList.add('mt-thead-style');
            }

            alignmentClass = `align-text-${alignment}`;
            tableTH.classList.add(alignmentClass);

            //before end position === appendChild location
            tableHeadRow.insertAdjacentElement('beforeend', tableTH);
        }
    }

    /**
     * @summary Sets the column title from colTitle configuration if explicitly set.
     * @private
     * @param {string} configKey
     * @returns {string} colTitle
     * @memberof ModernTable
     */
    _setColTitle(configKey) {

        let colTitle = configKey;

        let currentColConfig = this.colConfig[configKey];

        if ('colTitle' in currentColConfig) {
            colTitle = currentColConfig['colTitle'];
        }

        return colTitle;

    }


    /**
     * @summary Sets the alignment for a column from the alignment colConfig.
     * @private
     * @param {string} configKey
     * @returns {string} alignment
     * @memberof ModernTable
     */
    _setAlignment(configKey) {

        let alignment;
        let currentColConfig = this.colConfig[configKey];

        if ('alignment' in currentColConfig) {
            alignment = currentColConfig['alignment'];
        } else {
            alignment = this.defaultAlignment;
        }

        return alignment;
    }
    
    /**
     * 
     * @summary Formats table cells with number and/or date formatting.
     * 
     * Notes:
     * - Recommended to use [format-intl-number library](https://github.com/simplenotsimpler/format-intl-number) or  [Moment.js](https://momentjs.com/) for formatting. 
     * - However, other formatting libraries can be used if desired. 
     * - Gracefully fails to no number/date formatting if libraries are not loaded or the format option was not specified in the colConfig.
     * @private
     * @param {*} cellValue
     * @param {string} configKey
     * @returns cellValue
     * @memberof ModernTable
     */
    _formatCellValue(cellValue, configKey) {

        let currentColConfig = this.colConfig[configKey];

        //check that format was set in options
        if ('format' in currentColConfig) {
            
            let currentColFormat = currentColConfig['format'];
            
            // make sure the formatIntlNumber library loaded            
            if (currentColFormat !== 'date-us' && typeof formatIntlNumber !=='undefined' ) {
                if ('numDecimals' in currentColConfig) {
                    let numDecimals = currentColConfig['numDecimals'];

                    cellValue = formatIntlNumber(cellValue, currentColFormat, numDecimals);
                } else {
                    cellValue = formatIntlNumber(cellValue, currentColFormat);
                }
            } else if (currentColFormat === 'date-us' && typeof moment !=='undefined' ) {
                let dateFrom = currentColConfig['dateFrom'];
                let dateTo = currentColConfig['dateTo'];

                //strict mode recommended per https://momentjs.com/guides/#/parsing/strict-mode/
                cellValue = moment(cellValue, dateFrom, true).format(dateTo);

            }
        }

        return cellValue;

    }

}

/**
 * @summary Processes an error into a user friendly version displayed in the gui. 
 * @class TableErrorHandler  * 
 * @param {Object} error
 */
class TableErrorHandler {
    constructor(error) {
        this.tableContainer = document.getElementById('table-container');
        this.tableErrorContainer = document.createElement('section');
        this.tableErrorContainerHeader = document.createElement('h1');
        this.tableErrorContainerBody = document.createElement('div');


        this.tableContainer.insertAdjacentElement('beforebegin', this.tableErrorContainer);
        this.tableErrorContainer.insertAdjacentElement('afterbegin', this.tableErrorContainerHeader);
        this.tableErrorContainer.insertAdjacentElement('beforeend', this.tableErrorContainerBody);

        this.tableErrorContainer.className = 'table-error';

        this.tableErrorContainerHeader.innerHTML = `Error Displaying Table`;

        //this splits error stack into clean separate lines. makes so all have proper indent.
        // from https://stackoverflow.com/questions/784539/how-do-i-replace-all-line-breaks-in-a-string-with-br-tags
        //  answered Apr 24 '09 at 4:43 eyelidlessness
        const prettyErrorStack = error.stack.replace(/(?:\r\n|\r|\n)/g, '<br>');

        this.tableErrorContainerBody.innerHTML = `
   
    <h2>Our apologies. Please contact your system administrator with these details:</h2>
    <section class="table-error-details">
    <p><strong>${error.name}</strong>: ${error.message}</p>
    <p><strong>Stack trace:</strong></p>
    <p class="table-error-details">${prettyErrorStack}</p>
    </section>
    `;


    }
}

/**
 * @summary Custom errror for processing HTTP errors.
 * @class HTTPError 
 * @extends {Error}
 */
class HTTPError extends Error {

    constructor(message) {
        super(message);
        this.name = 'HTTPError';
    }
}

/**
 *
 * @summary Custom error for JSON Syntax errors. Passes the stack trace.
 * @class JSONSyntaxError 
 * @extends {SyntaxError}
 */
class JSONSyntaxError extends SyntaxError {
    constructor(message) {
        super(message);
        this.name = 'JSONSyntaxError';
        this.stack = (new Error()).stack;
    }
}
