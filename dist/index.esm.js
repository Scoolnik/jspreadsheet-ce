import { default as __WEBPACK_EXTERNAL_MODULE_jsuites_default__ } from "jsuites";
import { default as __WEBPACK_EXTERNAL_MODULE__jspreadsheet_formula_79b97a3c_default__ } from "@jspreadsheet/formula";
/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// NAMESPACE OBJECT: ./src/utils/helpers.js
var helpers_namespaceObject = {};
__webpack_require__.r(helpers_namespaceObject);
__webpack_require__.d(helpers_namespaceObject, {
  createFromTable: () => (createFromTable),
  getCaretIndex: () => (getCaretIndex),
  getCellNameFromCoords: () => (getCellNameFromCoords),
  getColumnName: () => (getColumnName),
  getCoordsFromCellName: () => (getCoordsFromCellName),
  getCoordsFromRange: () => (getCoordsFromRange),
  invert: () => (invert),
  parseCSV: () => (parseCSV)
});

;// external "jsuites"

;// ./src/utils/libraryBase.js
const lib = {
    jspreadsheet: {},
};

/* harmony default export */ const libraryBase = (lib);

;// ./src/utils/dispatch.js


/**
 * Prepare JSON in the correct format
 */
const prepareJson = function (data) {
    const obj = this;

    const rows = [];
    for (let i = 0; i < data.length; i++) {
        const x = data[i].x;
        const y = data[i].y;
        const k = obj.options.columns[x].name ? obj.options.columns[x].name : x;

        // Create row
        if (!rows[y]) {
            rows[y] = {
                row: y,
                data: {},
            };
        }
        rows[y].data[k] = data[i].value;
    }

    // Filter rows
    return rows.filter(function (el) {
        return el != null;
    });
};

/**
 * Post json to a remote server
 */
const save = function (url, data) {
    const obj = this;

    // Parse anything in the data before sending to the server
    const ret = dispatch.call(obj.parent, 'onbeforesave', obj.parent, obj, data);
    if (ret) {
        data = ret;
    } else {
        if (ret === false) {
            return false;
        }
    }

    // Remove update
    __WEBPACK_EXTERNAL_MODULE_jsuites_default__.ajax({
        url: url,
        method: 'POST',
        dataType: 'json',
        data: { data: JSON.stringify(data) },
        success: function (result) {
            // Event
            dispatch.call(obj, 'onsave', obj.parent, obj, data);
        },
    });
};

/**
 * Trigger events
 */
const dispatch = function (event) {
    const obj = this;
    let ret = null;

    let spreadsheet = obj.parent ? obj.parent : obj;

    // Dispatch events
    if (!spreadsheet.ignoreEvents) {
        // Call global event
        if (typeof spreadsheet.config.onevent == 'function') {
            ret = spreadsheet.config.onevent.apply(this, arguments);
        }
        // Call specific events
        if (typeof spreadsheet.config[event] == 'function') {
            ret = spreadsheet.config[event].apply(this, Array.prototype.slice.call(arguments, 1));
        }

        if (typeof spreadsheet.plugins === 'object') {
            const pluginKeys = Object.keys(spreadsheet.plugins);

            for (let pluginKeyIndex = 0; pluginKeyIndex < pluginKeys.length; pluginKeyIndex++) {
                const key = pluginKeys[pluginKeyIndex];
                const plugin = spreadsheet.plugins[key];

                if (typeof plugin.onevent === 'function') {
                    ret = plugin.onevent.apply(this, arguments);
                }
            }
        }
    }

    if (event == 'onafterchanges') {
        const scope = arguments;

        if (typeof spreadsheet.plugins === 'object') {
            Object.entries(spreadsheet.plugins).forEach(function ([, plugin]) {
                if (typeof plugin.persistence === 'function') {
                    plugin.persistence(obj, 'setValue', { data: scope[2] });
                }
            });
        }

        if (obj.options.persistence) {
            const url = obj.options.persistence == true ? obj.options.url : obj.options.persistence;
            const data = prepareJson.call(obj, arguments[2]);
            save.call(obj, url, data);
        }
    }

    return ret;
};

/* harmony default export */ const utils_dispatch = (dispatch);

;// external "@jspreadsheet/formula"

;// ./src/utils/freeze.js
// Get width of all freezed cells together
const getFreezeWidth = function () {
    const obj = this;

    let width = 0;
    if (obj.options.freezeColumns > 0) {
        for (let i = 0; i < obj.options.freezeColumns; i++) {
            let columnWidth;
            if (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].width !== undefined) {
                columnWidth = parseInt(obj.options.columns[i].width);
            } else {
                columnWidth = obj.options.defaultColWidth !== undefined ? parseInt(obj.options.defaultColWidth) : 100;
            }

            width += columnWidth;
        }
    }
    return width;
};

;// ./src/utils/internalHelpers.js


/**
 * Helper injectArray
 */
const injectArray = function (o, idx, arr) {
    if (idx <= o.length) {
        return o.slice(0, idx).concat(arr).concat(o.slice(idx));
    }

    const array = o.slice(0, o.length);

    while (idx > array.length) {
        array.push(undefined);
    }

    return array.concat(arr);
};

/**
 * Convert excel like column to jss id
 *
 * @param string id
 * @return string id
 */
const getIdFromColumnName = function (id, arr) {
    // Get the letters
    const t = /^[a-zA-Z]+/.exec(id);

    if (t) {
        // Base 26 calculation
        let code = 0;
        for (let i = 0; i < t[0].length; i++) {
            code += parseInt(t[0].charCodeAt(i) - 64) * Math.pow(26, t[0].length - 1 - i);
        }
        code--;
        // Make sure jss starts on zero
        if (code < 0) {
            code = 0;
        }

        // Number
        let number = parseInt(/[0-9]+$/.exec(id));
        if (number > 0) {
            number--;
        }

        if (arr == true) {
            id = [code, number];
        } else {
            id = code + '-' + number;
        }
    }

    return id;
};

/**
 * Convert jss id to excel like column name
 *
 * @param string id
 * @return string id
 */
const getColumnNameFromId = function (cellId) {
    if (!Array.isArray(cellId)) {
        cellId = cellId.split('-');
    }

    return getColumnName(parseInt(cellId[0])) + (parseInt(cellId[1]) + 1);
};

;// ./src/utils/helpers.js


/**
 * Get carret position for one element
 */
const getCaretIndex = function (e) {
    let d;

    if (this.config.root) {
        d = this.config.root;
    } else {
        d = window;
    }
    let pos = 0;
    const s = d.getSelection();
    if (s) {
        if (s.rangeCount !== 0) {
            const r = s.getRangeAt(0);
            const p = r.cloneRange();
            p.selectNodeContents(e);
            p.setEnd(r.endContainer, r.endOffset);
            pos = p.toString().length;
        }
    }
    return pos;
};

/**
 * Invert keys and values
 */
const invert = function (o) {
    const d = [];
    const k = Object.keys(o);
    for (let i = 0; i < k.length; i++) {
        d[o[k[i]]] = k[i];
    }
    return d;
};

/**
 * Get letter based on a number
 *
 * @param {number} columnNumber
 * @return string letter
 */
const getColumnName = function (columnNumber) {
    let dividend = columnNumber + 1;
    let columnName = '';
    let modulo;

    while (dividend > 0) {
        modulo = (dividend - 1) % 26;
        columnName = String.fromCharCode(65 + modulo).toString() + columnName;
        dividend = parseInt((dividend - modulo) / 26);
    }

    return columnName;
};

/**
 * Get column name from coords
 */
const getCellNameFromCoords = function (x, y) {
    return getColumnName(parseInt(x)) + (parseInt(y) + 1);
};

const getCoordsFromCellName = function (columnName) {
    // Get the letters
    const t = /^[a-zA-Z]+/.exec(columnName);

    if (t) {
        // Base 26 calculation
        let code = 0;
        for (let i = 0; i < t[0].length; i++) {
            code += parseInt(t[0].charCodeAt(i) - 64) * Math.pow(26, t[0].length - 1 - i);
        }
        code--;
        // Make sure jspreadsheet starts on zero
        if (code < 0) {
            code = 0;
        }

        // Number
        let number = parseInt(/[0-9]+$/.exec(columnName)) || null;
        if (number > 0) {
            number--;
        }

        return [code, number];
    }
};

const getCoordsFromRange = function (range) {
    const [start, end] = range.split(':');

    return [...getCoordsFromCellName(start), ...getCoordsFromCellName(end)];
};

/**
 * From stack overflow contributions
 */
const parseCSV = function (str, delimiter) {
    // user-supplied delimeter or default comma
    delimiter = delimiter || ',';
    // Remove last line break
    str = str.replace(/\r?\n$|\r$|\n$/g, '');

    const arr = [];
    let quote = false; // true means we're inside a quoted field
    // iterate over each character, keep track of current row and column (of the returned array)
    let maxCol = 0;
    let row = 0,
        col = 0;
    for (let c = 0; c < str.length; c++) {
        const cc = str[c],
            nc = str[c + 1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';

        // If the current character is a quotation mark, and we're inside a quoted field, and the next character is also a quotation mark, add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') {
            arr[row][col] += cc;
            ++c;
            continue;
        }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') {
            quote = !quote;
            continue;
        }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == delimiter && !quote) {
            ++col;
            continue;
        }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character and move on to the next row and move to column 0 of that new row
        if (cc == '\r' && nc == '\n' && !quote) {
            ++row;
            maxCol = Math.max(maxCol, col);
            col = 0;
            ++c;
            continue;
        }

        // If it's a newline (LF or CR) and we're not in a quoted field, move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) {
            ++row;
            maxCol = Math.max(maxCol, col);
            col = 0;
            continue;
        }
        if (cc == '\r' && !quote) {
            ++row;
            maxCol = Math.max(maxCol, col);
            col = 0;
            continue;
        }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }

    // fix array length
    arr.forEach((row, i) => {
        for (let i = row.length; i <= maxCol; i++) {
            row.push('');
        }
    });
    return arr;
};

const createFromTable = function (el, options) {
    if (el.tagName != 'TABLE') {
        console.log('Element is not a table');
    } else {
        // Configuration
        if (!options) {
            options = {};
        }

        options.columns = [];
        options.data = [];

        // Colgroup
        const colgroup = el.querySelectorAll('colgroup > col');
        if (colgroup.length) {
            // Get column width
            for (let i = 0; i < colgroup.length; i++) {
                let width = colgroup[i].style.width;
                if (!width) {
                    width = colgroup[i].getAttribute('width');
                }
                // Set column width
                if (width) {
                    if (!options.columns[i]) {
                        options.columns[i] = {};
                    }
                    options.columns[i].width = width;
                }
            }
        }

        // Parse header
        const parseHeader = function (header, i) {
            // Get width information
            let info = header.getBoundingClientRect();
            const width = info.width > 50 ? info.width : 50;

            // Create column option
            if (!options.columns[i]) {
                options.columns[i] = {};
            }
            if (header.getAttribute('data-celltype')) {
                options.columns[i].type = header.getAttribute('data-celltype');
            } else {
                options.columns[i].type = 'text';
            }
            options.columns[i].width = width + 'px';
            options.columns[i].title = header.innerHTML;
            if (header.style.textAlign) {
                options.columns[i].align = header.style.textAlign;
            }

            if ((info = header.getAttribute('name'))) {
                options.columns[i].name = info;
            }
            if ((info = header.getAttribute('id'))) {
                options.columns[i].id = info;
            }
            if ((info = header.getAttribute('data-mask'))) {
                options.columns[i].mask = info;
            }
        };

        // Headers
        const nested = [];
        let headers = el.querySelectorAll(':scope > thead > tr');
        if (headers.length) {
            for (let j = 0; j < headers.length - 1; j++) {
                const cells = [];
                for (let i = 0; i < headers[j].children.length; i++) {
                    const row = {
                        title: headers[j].children[i].textContent,
                        colspan: headers[j].children[i].getAttribute('colspan') || 1,
                    };
                    cells.push(row);
                }
                nested.push(cells);
            }
            // Get the last row in the thead
            headers = headers[headers.length - 1].children;
            // Go though the headers
            for (let i = 0; i < headers.length; i++) {
                parseHeader(headers[i], i);
            }
        }

        // Content
        let rowNumber = 0;
        const mergeCells = {};
        const rows = {};
        const style = {};
        const classes = {};

        let content = el.querySelectorAll(':scope > tr, :scope > tbody > tr');
        for (let j = 0; j < content.length; j++) {
            options.data[rowNumber] = [];
            if (options.parseTableFirstRowAsHeader == true && !headers.length && j == 0) {
                for (let i = 0; i < content[j].children.length; i++) {
                    parseHeader(content[j].children[i], i);
                }
            } else {
                for (let i = 0; i < content[j].children.length; i++) {
                    // WickedGrid formula compatibility
                    let value = content[j].children[i].getAttribute('data-formula');
                    if (value) {
                        if (value.substr(0, 1) != '=') {
                            value = '=' + value;
                        }
                    } else {
                        value = content[j].children[i].innerHTML;
                    }
                    options.data[rowNumber].push(value);

                    // Key
                    const cellName = getColumnNameFromId([i, j]);

                    // Classes
                    const tmp = content[j].children[i].getAttribute('class');
                    if (tmp) {
                        classes[cellName] = tmp;
                    }

                    // Merged cells
                    const mergedColspan = parseInt(content[j].children[i].getAttribute('colspan')) || 0;
                    const mergedRowspan = parseInt(content[j].children[i].getAttribute('rowspan')) || 0;
                    if (mergedColspan || mergedRowspan) {
                        mergeCells[cellName] = [mergedColspan || 1, mergedRowspan || 1];
                    }

                    // Avoid problems with hidden cells
                    if (content[j].children[i].style && content[j].children[i].style.display == 'none') {
                        content[j].children[i].style.display = '';
                    }
                    // Get style
                    const s = content[j].children[i].getAttribute('style');
                    if (s) {
                        style[cellName] = s;
                    }
                    // Bold
                    if (content[j].children[i].classList.contains('styleBold')) {
                        if (style[cellName]) {
                            style[cellName] += '; font-weight:bold;';
                        } else {
                            style[cellName] = 'font-weight:bold;';
                        }
                    }
                }

                // Row Height
                if (content[j].style && content[j].style.height) {
                    rows[j] = { height: content[j].style.height };
                }

                // Index
                rowNumber++;
            }
        }

        // Nested
        if (Object.keys(nested).length > 0) {
            options.nestedHeaders = nested;
        }
        // Style
        if (Object.keys(style).length > 0) {
            options.style = style;
        }
        // Merged
        if (Object.keys(mergeCells).length > 0) {
            options.mergeCells = mergeCells;
        }
        // Row height
        if (Object.keys(rows).length > 0) {
            options.rows = rows;
        }
        // Classes
        if (Object.keys(classes).length > 0) {
            options.classes = classes;
        }

        content = el.querySelectorAll('tfoot tr');
        if (content.length) {
            const footers = [];
            for (let j = 0; j < content.length; j++) {
                let footer = [];
                for (let i = 0; i < content[j].children.length; i++) {
                    footer.push(content[j].children[i].textContent);
                }
                footers.push(footer);
            }
            if (Object.keys(footers).length > 0) {
                options.footers = footers;
            }
        }
        // TODO: data-hiddencolumns="3,4"

        // I guess in terms the better column type
        if (options.parseTableAutoCellType == true) {
            const pattern = [];
            for (let i = 0; i < options.columns.length; i++) {
                let test = true;
                let testCalendar = true;
                pattern[i] = [];
                for (let j = 0; j < options.data.length; j++) {
                    const value = options.data[j][i];
                    if (!pattern[i][value]) {
                        pattern[i][value] = 0;
                    }
                    pattern[i][value]++;
                    if (value.length > 25) {
                        test = false;
                    }
                    if (value.length == 10) {
                        if (!(value.substr(4, 1) == '-' && value.substr(7, 1) == '-')) {
                            testCalendar = false;
                        }
                    } else {
                        testCalendar = false;
                    }
                }

                const keys = Object.keys(pattern[i]).length;
                if (testCalendar) {
                    options.columns[i].type = 'calendar';
                } else if (test == true && keys > 1 && keys <= parseInt(options.data.length * 0.1)) {
                    options.columns[i].type = 'dropdown';
                    options.columns[i].source = Object.keys(pattern[i]);
                }
            }
        }

        return options;
    }
};

;// ./src/utils/merges.js








/**
 * Is column merged
 */
const isColMerged = function (x, insertBefore) {
    const obj = this;

    const cols = [];
    // Remove any merged cells
    if (obj.options.mergeCells) {
        const keys = Object.keys(obj.options.mergeCells);
        for (let i = 0; i < keys.length; i++) {
            const info = getIdFromColumnName(keys[i], true);
            const colspan = obj.options.mergeCells[keys[i]][0];
            const x1 = info[0];
            const x2 = info[0] + (colspan > 1 ? colspan - 1 : 0);

            if (insertBefore == null) {
                if (x1 <= x && x2 >= x) {
                    cols.push(keys[i]);
                }
            } else {
                if (insertBefore) {
                    if (x1 < x && x2 >= x) {
                        cols.push(keys[i]);
                    }
                } else {
                    if (x1 <= x && x2 > x) {
                        cols.push(keys[i]);
                    }
                }
            }
        }
    }

    return cols;
};

/**
 * Is rows merged
 */
const isRowMerged = function (y, insertBefore) {
    const obj = this;

    const rows = [];
    // Remove any merged cells
    if (obj.options.mergeCells) {
        const keys = Object.keys(obj.options.mergeCells);
        for (let i = 0; i < keys.length; i++) {
            const info = getIdFromColumnName(keys[i], true);
            const rowspan = obj.options.mergeCells[keys[i]][1];
            const y1 = info[1];
            const y2 = info[1] + (rowspan > 1 ? rowspan - 1 : 0);

            if (insertBefore == null) {
                if (y1 <= y && y2 >= y) {
                    rows.push(keys[i]);
                }
            } else {
                if (insertBefore) {
                    if (y1 < y && y2 >= y) {
                        rows.push(keys[i]);
                    }
                } else {
                    if (y1 <= y && y2 > y) {
                        rows.push(keys[i]);
                    }
                }
            }
        }
    }

    return rows;
};

/**
 * Merge cells
 * @param cellName
 * @param colspan
 * @param rowspan
 * @param ignoreHistoryAndEvents
 */
const getMerge = function (cellName) {
    const obj = this;

    let data = {};
    if (cellName) {
        if (obj.options.mergeCells && obj.options.mergeCells[cellName]) {
            data = [obj.options.mergeCells[cellName][0], obj.options.mergeCells[cellName][1]];
        } else {
            data = null;
        }
    } else {
        if (obj.options.mergeCells) {
            var mergedCells = obj.options.mergeCells;
            const keys = Object.keys(obj.options.mergeCells);
            for (let i = 0; i < keys.length; i++) {
                data[keys[i]] = [obj.options.mergeCells[keys[i]][0], obj.options.mergeCells[keys[i]][1]];
            }
        }
    }

    return data;
};

/**
 * Merge cells
 * @param cellName
 * @param colspan
 * @param rowspan
 * @param ignoreHistoryAndEvents
 */
const setMerge = function (cellName, colspan, rowspan, ignoreHistoryAndEvents) {
    const obj = this;

    let test = false;

    if (!cellName) {
        if (!obj.highlighted.length) {
            alert(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('No cells selected'));
            return null;
        } else {
            const x1 = parseInt(obj.highlighted[0].getAttribute('data-x'));
            const y1 = parseInt(obj.highlighted[0].getAttribute('data-y'));
            const x2 = parseInt(obj.highlighted[obj.highlighted.length - 1].getAttribute('data-x'));
            const y2 = parseInt(obj.highlighted[obj.highlighted.length - 1].getAttribute('data-y'));
            cellName = getColumnNameFromId([x1, y1]);
            colspan = x2 - x1 + 1;
            rowspan = y2 - y1 + 1;
        }
    } else if (typeof cellName !== 'string') {
        return null;
    }

    const cell = getIdFromColumnName(cellName, true);

    if (obj.options.mergeCells && obj.options.mergeCells[cellName]) {
        if (obj.records[cell[1]][cell[0]].element.getAttribute('data-merged')) {
            test = 'Cell already merged';
        }
    } else if ((!colspan || colspan < 2) && (!rowspan || rowspan < 2)) {
        test = 'Invalid merged properties';
    } else {
        var cells = [];
        for (let j = cell[1]; j < cell[1] + rowspan; j++) {
            for (let i = cell[0]; i < cell[0] + colspan; i++) {
                var columnName = getColumnNameFromId([i, j]);
                if (obj.records[j][i].element.getAttribute('data-merged')) {
                    test = 'There is a conflict with another merged cell';
                }
            }
        }
    }

    if (test) {
        alert(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate(test));
    } else {
        // Add property
        if (colspan > 1) {
            obj.records[cell[1]][cell[0]].element.setAttribute('colspan', colspan);
        } else {
            colspan = 1;
        }
        if (rowspan > 1) {
            obj.records[cell[1]][cell[0]].element.setAttribute('rowspan', rowspan);
        } else {
            rowspan = 1;
        }
        // Keep links to the existing nodes
        if (!obj.options.mergeCells) {
            obj.options.mergeCells = {};
        }

        obj.options.mergeCells[cellName] = [colspan, rowspan, []];
        // Mark cell as merged
        obj.records[cell[1]][cell[0]].element.setAttribute('data-merged', 'true');
        // Overflow
        obj.records[cell[1]][cell[0]].element.style.overflow = 'hidden';
        // History data
        const data = [];
        // Adjust the nodes
        for (let y = cell[1]; y < cell[1] + rowspan; y++) {
            for (let x = cell[0]; x < cell[0] + colspan; x++) {
                if (!(cell[0] == x && cell[1] == y)) {
                    data.push(obj.options.data[y][x]);
                    updateCell.call(obj, x, y, '', true);
                    obj.options.mergeCells[cellName][2].push(obj.records[y][x].element);
                    obj.records[y][x].element.style.display = 'none';
                    obj.records[y][x].element = obj.records[cell[1]][cell[0]].element;
                }
            }
        }
        // In the initialization is not necessary keep the history
        updateSelection.call(obj, obj.records[cell[1]][cell[0]].element);

        if (!ignoreHistoryAndEvents) {
            setHistory.call(obj, {
                action: 'setMerge',
                column: cellName,
                colspan: colspan,
                rowspan: rowspan,
                data: data,
            });

            utils_dispatch.call(obj, 'onmerge', obj, { [cellName]: [colspan, rowspan] });
        }
    }
};

/**
 * Remove merge by cellname
 * @param cellName
 */
const removeMerge = function (cellName, data, keepOptions) {
    const obj = this;

    if (obj.options.mergeCells && obj.options.mergeCells[cellName]) {
        const beforeMerges = { [cellName]: obj.options.mergeCells[cellName] };
        const cell = getIdFromColumnName(cellName, true);
        obj.records[cell[1]][cell[0]].element.removeAttribute('colspan');
        obj.records[cell[1]][cell[0]].element.removeAttribute('rowspan');
        obj.records[cell[1]][cell[0]].element.removeAttribute('data-merged');
        const info = obj.options.mergeCells[cellName];

        let index = 0;

        let j, i;

        for (j = 0; j < info[1]; j++) {
            for (i = 0; i < info[0]; i++) {
                if (j > 0 || i > 0) {
                    obj.records[cell[1] + j][cell[0] + i].element = info[2][index];
                    obj.records[cell[1] + j][cell[0] + i].element.style.display = '';
                    // Recover data
                    if (data && data[index]) {
                        updateCell.call(obj, cell[0] + i, cell[1] + j, data[index]);
                    }
                    index++;
                }
            }
        }

        // Update selection
        updateSelection.call(obj, obj.records[cell[1]][cell[0]].element, obj.records[cell[1] + j - 1][cell[0] + i - 1].element);

        if (!keepOptions) {
            delete obj.options.mergeCells[cellName];
        }

        utils_dispatch.call(obj, 'onunmerge', obj, cellName, beforeMerges);
    }
};

/**
 * Remove all merged cells
 */
const destroyMerge = function (keepOptions) {
    const obj = this;

    // Remove any merged cells
    if (obj.options.mergeCells) {
        var mergedCells = obj.options.mergeCells;
        const keys = Object.keys(obj.options.mergeCells);
        for (let i = 0; i < keys.length; i++) {
            removeMerge.call(obj, keys[i], null, keepOptions);
        }
    }
};

;// ./src/utils/lazyLoading.js
/**
 * Go to a page in a lazyLoading
 */
const loadPage = function (pageNumber) {
    const obj = this;

    // Search
    let results;

    if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
        results = obj.results;
    } else {
        results = obj.rows;
    }

    // Per page
    const quantityPerPage = 100;

    // pageNumber
    if (pageNumber == null || pageNumber == -1) {
        // Last page
        pageNumber = Math.ceil(results.length / quantityPerPage) - 1;
    }

    let startRow = pageNumber * quantityPerPage;
    let finalRow = pageNumber * quantityPerPage + quantityPerPage;
    if (finalRow > results.length) {
        finalRow = results.length;
    }
    startRow = finalRow - 100;
    if (startRow < 0) {
        startRow = 0;
    }

    // Appeding items
    for (let j = startRow; j < finalRow; j++) {
        if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
            obj.tbody.appendChild(obj.rows[results[j]].element);
        } else {
            obj.tbody.appendChild(obj.rows[j].element);
        }

        if (obj.tbody.children.length > quantityPerPage) {
            obj.tbody.removeChild(obj.tbody.firstChild);
        }
    }
};

const loadValidation = function () {
    const obj = this;

    if (obj.selectedCell) {
        const currentPage = parseInt(obj.tbody.firstChild.getAttribute('data-y')) / 100;
        const selectedPage = parseInt(obj.selectedCell[3] / 100);
        const totalPages = parseInt(obj.rows.length / 100);

        if (currentPage != selectedPage && selectedPage <= totalPages) {
            if (!Array.prototype.indexOf.call(obj.tbody.children, obj.rows[obj.selectedCell[3]].element)) {
                obj.loadPage(selectedPage);
                return true;
            }
        }
    }

    return false;
};

const loadUp = function () {
    const obj = this;

    // Search
    let results;

    if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
        results = obj.results;
    } else {
        results = obj.rows;
    }
    let test = 0;
    if (results.length > 100) {
        // Get the first element in the page
        let item = parseInt(obj.tbody.firstChild.getAttribute('data-y'));
        if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
            item = results.indexOf(item);
        }
        if (item > 0) {
            for (let j = 0; j < 30; j++) {
                item = item - 1;
                if (item > -1) {
                    if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
                        obj.tbody.insertBefore(obj.rows[results[item]].element, obj.tbody.firstChild);
                    } else {
                        obj.tbody.insertBefore(obj.rows[item].element, obj.tbody.firstChild);
                    }
                    if (obj.tbody.children.length > 100) {
                        obj.tbody.removeChild(obj.tbody.lastChild);
                        test = 1;
                    }
                }
            }
        }
    }
    return test;
};

const loadDown = function () {
    const obj = this;

    // Search
    let results;

    if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
        results = obj.results;
    } else {
        results = obj.rows;
    }
    let test = 0;
    if (results.length > 100) {
        // Get the last element in the page
        let item = parseInt(obj.tbody.lastChild.getAttribute('data-y'));
        if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
            item = results.indexOf(item);
        }
        if (item < obj.rows.length - 1) {
            for (let j = 0; j <= 30; j++) {
                if (item < results.length) {
                    if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
                        obj.tbody.appendChild(obj.rows[results[item]].element);
                    } else {
                        obj.tbody.appendChild(obj.rows[item].element);
                    }
                    if (obj.tbody.children.length > 100) {
                        obj.tbody.removeChild(obj.tbody.firstChild);
                        test = 1;
                    }
                }
                item = item + 1;
            }
        }
    }

    return test;
};

;// ./src/utils/filter.js




/**
 * Open the column filter
 */
const openFilter = function (columnId) {
    const obj = this;

    if (!obj.options.filters) {
        console.log('Jspreadsheet: filters not enabled.');
    } else {
        // Make sure is integer
        columnId = parseInt(columnId);
        // Reset selection
        obj.resetSelection();
        // Load options
        let optionsFiltered = [];
        if (obj.options.columns[columnId].type == 'checkbox') {
            optionsFiltered.push({ id: 'true', name: 'True' });
            optionsFiltered.push({ id: 'false', name: 'False' });
        } else {
            const options = [];
            let hasBlanks = false;
            for (let j = 0; j < obj.options.data.length; j++) {
                const k = obj.options.data[j][columnId];
                const v = obj.records[j][columnId].element.innerHTML;
                if (k && v) {
                    options[k] = v;
                } else {
                    hasBlanks = true;
                }
            }
            const keys = Object.keys(options);
            optionsFiltered = [];
            for (let j = 0; j < keys.length; j++) {
                optionsFiltered.push({ id: keys[j], name: options[keys[j]] });
            }
            // Has blank options
            if (hasBlanks) {
                optionsFiltered.push({ value: '', id: '', name: '(Blanks)' });
            }
        }

        // Create dropdown
        const div = document.createElement('div');
        obj.filter.children[columnId + 1].innerHTML = '';
        obj.filter.children[columnId + 1].appendChild(div);
        obj.filter.children[columnId + 1].style.paddingLeft = '0px';
        obj.filter.children[columnId + 1].style.paddingRight = '0px';
        obj.filter.children[columnId + 1].style.overflow = 'initial';

        const opt = {
            data: optionsFiltered,
            multiple: true,
            autocomplete: true,
            opened: true,
            value: obj.filters[columnId] !== undefined ? obj.filters[columnId] : null,
            width: '100%',
            position: obj.options.tableOverflow == true || obj.parent.config.fullscreen == true ? true : false,
            onclose: function (o) {
                resetFilters.call(obj);
                obj.filters[columnId] = o.dropdown.getValue(true);
                obj.filter.children[columnId + 1].innerHTML = o.dropdown.getText();
                obj.filter.children[columnId + 1].style.paddingLeft = '';
                obj.filter.children[columnId + 1].style.paddingRight = '';
                obj.filter.children[columnId + 1].style.overflow = '';
                closeFilter.call(obj, columnId);
                refreshSelection.call(obj);
            },
        };

        // Dynamic dropdown
        __WEBPACK_EXTERNAL_MODULE_jsuites_default__.dropdown(div, opt);
    }
};

const closeFilter = function (columnId) {
    const obj = this;

    if (!columnId) {
        for (let i = 0; i < obj.filter.children.length; i++) {
            if (obj.filters[i]) {
                columnId = i;
            }
        }
    }

    // Search filter
    const search = function (query, x, y) {
        for (let i = 0; i < query.length; i++) {
            const value = '' + obj.options.data[y][x];
            const label = '' + obj.records[y][x].element.innerHTML;
            if (query[i] == value || query[i] == label) {
                return true;
            }
        }
        return false;
    };

    const query = obj.filters[columnId];
    obj.results = [];
    for (let j = 0; j < obj.options.data.length; j++) {
        if (search(query, columnId, j)) {
            obj.results.push(j);
        }
    }
    if (!obj.results.length) {
        obj.results = null;
    }

    updateResult.call(obj);
};

const resetFilters = function () {
    const obj = this;

    if (obj.options.filters) {
        for (let i = 0; i < obj.filter.children.length; i++) {
            obj.filter.children[i].innerHTML = '&nbsp;';
            obj.filters[i] = null;
        }
    }

    obj.results = null;
    updateResult.call(obj);
};

;// ./src/utils/orderBy.js







/**
 * Update order arrow
 */
const updateOrderArrow = function (column, order) {
    const obj = this;

    // Remove order
    for (let i = 0; i < obj.headers.length; i++) {
        obj.headers[i].classList.remove('arrow-up');
        obj.headers[i].classList.remove('arrow-down');
    }

    // No order specified then toggle order
    if (order) {
        obj.headers[column].classList.add('arrow-up');
    } else {
        obj.headers[column].classList.add('arrow-down');
    }
};

/**
 * Update rows position
 */
const updateOrder = function (rows) {
    const obj = this;

    // History
    let data = [];
    for (let j = 0; j < rows.length; j++) {
        data[j] = obj.options.data[rows[j]];
    }
    obj.options.data = data;

    data = [];
    for (let j = 0; j < rows.length; j++) {
        data[j] = obj.records[rows[j]];

        for (let i = 0; i < data[j].length; i++) {
            data[j][i].y = j;
        }
    }
    obj.records = data;

    data = [];
    for (let j = 0; j < rows.length; j++) {
        data[j] = obj.rows[rows[j]];
        data[j].y = j;
    }
    obj.rows = data;

    // Update references
    updateTableReferences.call(obj);

    // Redo search
    if (obj.results && obj.results.length) {
        if (obj.searchInput.value) {
            obj.search(obj.searchInput.value);
        } else {
            closeFilter.call(obj);
        }
    } else {
        // Create page
        obj.results = null;
        obj.pageNumber = 0;

        if (obj.options.pagination > 0) {
            obj.page(0);
        } else if (obj.options.lazyLoading == true) {
            loadPage.call(obj, 0);
        } else {
            for (let j = 0; j < obj.rows.length; j++) {
                obj.tbody.appendChild(obj.rows[j].element);
            }
        }
    }
};

/**
 * Sort data and reload table
 */
const orderBy = function (column, order) {
    const obj = this;

    if (column >= 0) {
        // Merged cells
        if (obj.options.mergeCells && Object.keys(obj.options.mergeCells).length > 0) {
            if (!confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('This action will destroy any existing merged cells. Are you sure?'))) {
                return false;
            } else {
                // Remove merged cells
                obj.destroyMerge();
            }
        }

        // Direction
        if (order == null) {
            order = obj.headers[column].classList.contains('arrow-down') ? 1 : 0;
        } else {
            order = order ? 1 : 0;
        }

        // Test order
        let temp = [];
        if (
            obj.options.columns &&
            obj.options.columns[column] &&
            (obj.options.columns[column].type == 'number' ||
                obj.options.columns[column].type == 'numeric' ||
                obj.options.columns[column].type == 'percentage' ||
                obj.options.columns[column].type == 'autonumber' ||
                obj.options.columns[column].type == 'color')
        ) {
            for (let j = 0; j < obj.options.data.length; j++) {
                temp[j] = [j, Number(obj.options.data[j][column])];
            }
        } else if (
            obj.options.columns &&
            obj.options.columns[column] &&
            (obj.options.columns[column].type == 'calendar' || obj.options.columns[column].type == 'checkbox' || obj.options.columns[column].type == 'radio')
        ) {
            for (let j = 0; j < obj.options.data.length; j++) {
                temp[j] = [j, obj.options.data[j][column]];
            }
        } else {
            for (let j = 0; j < obj.options.data.length; j++) {
                temp[j] = [j, obj.records[j][column].element.textContent.toLowerCase()];
            }
        }

        // Default sorting method
        if (typeof obj.parent.config.sorting !== 'function') {
            obj.parent.config.sorting = function (direction) {
                return function (a, b) {
                    const valueA = a[1];
                    const valueB = b[1];

                    if (!direction) {
                        return valueA === '' && valueB !== '' ? 1 : valueA !== '' && valueB === '' ? -1 : valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
                    } else {
                        return valueA === '' && valueB !== '' ? 1 : valueA !== '' && valueB === '' ? -1 : valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
                    }
                };
            };
        }

        temp = temp.sort(obj.parent.config.sorting(order));

        // Save history
        const newValue = [];
        for (let j = 0; j < temp.length; j++) {
            newValue[j] = temp[j][0];
        }

        // Save history
        setHistory.call(obj, {
            action: 'orderBy',
            rows: newValue,
            column: column,
            order: order,
        });

        // Update order
        updateOrderArrow.call(obj, column, order);
        updateOrder.call(obj, newValue);

        // On sort event
        utils_dispatch.call(
            obj,
            'onsort',
            obj,
            column,
            order,
            newValue.map((row) => row)
        );

        return true;
    }
};

;// ./src/utils/history.js







/**
 * Initializes a new history record for undo/redo
 *
 * @return null
 */
const setHistory = function (changes) {
    const obj = this;

    if (obj.ignoreHistory != true) {
        // Increment and get the current history index
        const index = ++obj.historyIndex;

        // Slice the array to discard undone changes
        obj.history = obj.history = obj.history.slice(0, index + 1);

        // Keep history
        obj.history[index] = changes;
    }
};

/**
 * Process row
 */
const historyProcessRow = function (type, historyRecord) {
    const obj = this;

    const rowIndex = !historyRecord.insertBefore ? historyRecord.rowNumber + 1 : +historyRecord.rowNumber;

    if (obj.options.search == true) {
        if (obj.results && obj.results.length != obj.rows.length) {
            obj.resetSearch();
        }
    }

    // Remove row
    if (type == 1) {
        const numOfRows = historyRecord.numOfRows;
        // Remove nodes
        for (let j = rowIndex; j < numOfRows + rowIndex; j++) {
            obj.rows[j].element.parentNode.removeChild(obj.rows[j].element);
        }
        // Remove references
        obj.records.splice(rowIndex, numOfRows);
        obj.options.data.splice(rowIndex, numOfRows);
        obj.rows.splice(rowIndex, numOfRows);

        conditionalSelectionUpdate.call(obj, 1, rowIndex, numOfRows + rowIndex - 1);
    } else {
        // Insert data
        const records = historyRecord.rowRecords.map((row) => {
            return [...row];
        });
        obj.records = injectArray(obj.records, rowIndex, records);

        const data = historyRecord.rowData.map((row) => {
            return [...row];
        });
        obj.options.data = injectArray(obj.options.data, rowIndex, data);

        obj.rows = injectArray(obj.rows, rowIndex, historyRecord.rowNode);
        // Insert nodes
        let index = 0;
        for (let j = rowIndex; j < historyRecord.numOfRows + rowIndex; j++) {
            obj.tbody.insertBefore(historyRecord.rowNode[index].element, obj.tbody.children[j]);
            index++;
        }
    }

    for (let j = rowIndex; j < obj.rows.length; j++) {
        obj.rows[j].y = j;
    }

    for (let j = rowIndex; j < obj.records.length; j++) {
        for (let i = 0; i < obj.records[j].length; i++) {
            obj.records[j][i].y = j;
        }
    }

    // Respect pagination
    if (obj.options.pagination > 0) {
        obj.page(obj.pageNumber);
    }

    updateTableReferences.call(obj);
};

/**
 * Process column
 */
const historyProcessColumn = function (type, historyRecord) {
    const obj = this;

    const columnIndex = !historyRecord.insertBefore ? historyRecord.columnNumber + 1 : historyRecord.columnNumber;

    // Remove column
    if (type == 1) {
        const numOfColumns = historyRecord.numOfColumns;

        obj.options.columns.splice(columnIndex, numOfColumns);
        for (let i = columnIndex; i < numOfColumns + columnIndex; i++) {
            obj.headers[i].parentNode.removeChild(obj.headers[i]);
            obj.cols[i].colElement.parentNode.removeChild(obj.cols[i].colElement);
        }
        obj.headers.splice(columnIndex, numOfColumns);
        obj.cols.splice(columnIndex, numOfColumns);
        for (let j = 0; j < historyRecord.data.length; j++) {
            for (let i = columnIndex; i < numOfColumns + columnIndex; i++) {
                obj.records[j][i].element.parentNode.removeChild(obj.records[j][i].element);
            }
            obj.records[j].splice(columnIndex, numOfColumns);
            obj.options.data[j].splice(columnIndex, numOfColumns);
        }
        // Process footers
        if (obj.options.footers) {
            for (let j = 0; j < obj.options.footers.length; j++) {
                obj.options.footers[j].splice(columnIndex, numOfColumns);
            }
        }
    } else {
        // Insert data
        obj.options.columns = injectArray(obj.options.columns, columnIndex, historyRecord.columns);
        obj.headers = injectArray(obj.headers, columnIndex, historyRecord.headers);
        obj.cols = injectArray(obj.cols, columnIndex, historyRecord.cols);

        let index = 0;
        for (let i = columnIndex; i < historyRecord.numOfColumns + columnIndex; i++) {
            obj.headerContainer.insertBefore(historyRecord.headers[index], obj.headerContainer.children[i + 1]);
            obj.colgroupContainer.insertBefore(historyRecord.cols[index].colElement, obj.colgroupContainer.children[i + 1]);
            index++;
        }

        for (let j = 0; j < historyRecord.data.length; j++) {
            obj.options.data[j] = injectArray(obj.options.data[j], columnIndex, historyRecord.data[j]);
            obj.records[j] = injectArray(obj.records[j], columnIndex, historyRecord.records[j]);
            let index = 0;
            for (let i = columnIndex; i < historyRecord.numOfColumns + columnIndex; i++) {
                obj.rows[j].element.insertBefore(historyRecord.records[j][index].element, obj.rows[j].element.children[i + 1]);
                index++;
            }
        }
        // Process footers
        if (obj.options.footers) {
            for (let j = 0; j < obj.options.footers.length; j++) {
                obj.options.footers[j] = injectArray(obj.options.footers[j], columnIndex, historyRecord.footers[j]);
            }
        }
    }

    for (let i = columnIndex; i < obj.cols.length; i++) {
        obj.cols[i].x = i;
    }

    for (let j = 0; j < obj.records.length; j++) {
        for (let i = columnIndex; i < obj.records[j].length; i++) {
            obj.records[j][i].x = i;
        }
    }

    // Adjust nested headers
    if (obj.options.nestedHeaders && obj.options.nestedHeaders.length > 0 && obj.options.nestedHeaders[0] && obj.options.nestedHeaders[0][0]) {
        for (let j = 0; j < obj.options.nestedHeaders.length; j++) {
            let colspan;

            if (type == 1) {
                colspan = parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length - 1].colspan) - historyRecord.numOfColumns;
            } else {
                colspan = parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length - 1].colspan) + historyRecord.numOfColumns;
            }
            obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length - 1].colspan = colspan;
            obj.thead.children[j].children[obj.thead.children[j].children.length - 1].setAttribute('colspan', colspan);
        }
    }

    updateTableReferences.call(obj);
};

/**
 * Undo last action
 */
const undo = function () {
    const obj = this;

    // Ignore events and history
    const ignoreEvents = obj.parent.ignoreEvents ? true : false;
    const ignoreHistory = obj.ignoreHistory ? true : false;

    obj.parent.ignoreEvents = true;
    obj.ignoreHistory = true;

    // Records
    const records = [];

    // Update cells
    let historyRecord;

    if (obj.historyIndex >= 0) {
        // History
        historyRecord = obj.history[obj.historyIndex--];

        if (historyRecord.action == 'insertRow') {
            historyProcessRow.call(obj, 1, historyRecord);
        } else if (historyRecord.action == 'deleteRow') {
            historyProcessRow.call(obj, 0, historyRecord);
        } else if (historyRecord.action == 'insertColumn') {
            historyProcessColumn.call(obj, 1, historyRecord);
        } else if (historyRecord.action == 'deleteColumn') {
            historyProcessColumn.call(obj, 0, historyRecord);
        } else if (historyRecord.action == 'moveRow') {
            obj.moveRow(historyRecord.newValue, historyRecord.oldValue);
        } else if (historyRecord.action == 'moveColumn') {
            obj.moveColumn(historyRecord.newValue, historyRecord.oldValue);
        } else if (historyRecord.action == 'setMerge') {
            obj.removeMerge(historyRecord.column, historyRecord.data);
        } else if (historyRecord.action == 'setStyle') {
            obj.setStyle(historyRecord.oldValue, null, null, 1);
        } else if (historyRecord.action == 'setWidth') {
            obj.setWidth(historyRecord.column, historyRecord.oldValue);
        } else if (historyRecord.action == 'setHeight') {
            obj.setHeight(historyRecord.row, historyRecord.oldValue);
        } else if (historyRecord.action == 'setHeader') {
            obj.setHeader(historyRecord.column, historyRecord.oldValue);
        } else if (historyRecord.action == 'setComments') {
            obj.setComments(historyRecord.oldValue);
        } else if (historyRecord.action == 'orderBy') {
            let rows = [];
            for (let j = 0; j < historyRecord.rows.length; j++) {
                rows[historyRecord.rows[j]] = j;
            }
            updateOrderArrow.call(obj, historyRecord.column, historyRecord.order ? 0 : 1);
            updateOrder.call(obj, rows);
        } else if (historyRecord.action == 'setValue') {
            // Redo for changes in cells
            for (let i = 0; i < historyRecord.records.length; i++) {
                records.push({
                    x: historyRecord.records[i].x,
                    y: historyRecord.records[i].y,
                    value: historyRecord.records[i].oldValue,
                });

                if (historyRecord.oldStyle) {
                    obj.resetStyle(historyRecord.oldStyle);
                }
            }
            // Update records
            obj.setValue(records);

            // Update selection
            if (historyRecord.selection) {
                obj.updateSelectionFromCoords(historyRecord.selection[0], historyRecord.selection[1], historyRecord.selection[2], historyRecord.selection[3]);
            }
        }
    }
    obj.parent.ignoreEvents = ignoreEvents;
    obj.ignoreHistory = ignoreHistory;

    // Events
    utils_dispatch.call(obj, 'onundo', obj, historyRecord);
};

/**
 * Redo previously undone action
 */
const redo = function () {
    const obj = this;

    // Ignore events and history
    const ignoreEvents = obj.parent.ignoreEvents ? true : false;
    const ignoreHistory = obj.ignoreHistory ? true : false;

    obj.parent.ignoreEvents = true;
    obj.ignoreHistory = true;

    // Records
    var records = [];

    // Update cells
    let historyRecord;

    if (obj.historyIndex < obj.history.length - 1) {
        // History
        historyRecord = obj.history[++obj.historyIndex];

        if (historyRecord.action == 'insertRow') {
            historyProcessRow.call(obj, 0, historyRecord);
        } else if (historyRecord.action == 'deleteRow') {
            historyProcessRow.call(obj, 1, historyRecord);
        } else if (historyRecord.action == 'insertColumn') {
            historyProcessColumn.call(obj, 0, historyRecord);
        } else if (historyRecord.action == 'deleteColumn') {
            historyProcessColumn.call(obj, 1, historyRecord);
        } else if (historyRecord.action == 'moveRow') {
            obj.moveRow(historyRecord.oldValue, historyRecord.newValue);
        } else if (historyRecord.action == 'moveColumn') {
            obj.moveColumn(historyRecord.oldValue, historyRecord.newValue);
        } else if (historyRecord.action == 'setMerge') {
            setMerge.call(obj, historyRecord.column, historyRecord.colspan, historyRecord.rowspan, 1);
        } else if (historyRecord.action == 'setStyle') {
            obj.setStyle(historyRecord.newValue, null, null, 1);
        } else if (historyRecord.action == 'setWidth') {
            obj.setWidth(historyRecord.column, historyRecord.newValue);
        } else if (historyRecord.action == 'setHeight') {
            obj.setHeight(historyRecord.row, historyRecord.newValue);
        } else if (historyRecord.action == 'setHeader') {
            obj.setHeader(historyRecord.column, historyRecord.newValue);
        } else if (historyRecord.action == 'setComments') {
            obj.setComments(historyRecord.newValue);
        } else if (historyRecord.action == 'orderBy') {
            updateOrderArrow.call(obj, historyRecord.column, historyRecord.order);
            updateOrder.call(obj, historyRecord.rows);
        } else if (historyRecord.action == 'setValue') {
            obj.setValue(historyRecord.records);
            // Redo for changes in cells
            for (let i = 0; i < historyRecord.records.length; i++) {
                if (historyRecord.oldStyle) {
                    obj.resetStyle(historyRecord.newStyle);
                }
            }
            // Update selection
            if (historyRecord.selection) {
                obj.updateSelectionFromCoords(historyRecord.selection[0], historyRecord.selection[1], historyRecord.selection[2], historyRecord.selection[3]);
            }
        }
    }
    obj.parent.ignoreEvents = ignoreEvents;
    obj.ignoreHistory = ignoreHistory;

    // Events
    utils_dispatch.call(obj, 'onredo', obj, historyRecord);
};

;// ./src/utils/toolbar.js




const setItemStatus = function (toolbarItem, worksheet) {
    if (worksheet.options.editable != false) {
        toolbarItem.classList.remove('jtoolbar-disabled');
    } else {
        toolbarItem.classList.add('jtoolbar-disabled');
    }
};

const getDefault = function () {
    const items = [];
    const spreadsheet = this;

    const getActive = function () {
        return getWorksheetInstance.call(spreadsheet);
    };

    items.push({
        content: 'undo',
        onclick: function () {
            const worksheet = getActive();

            worksheet.undo();
        },
    });

    items.push({
        content: 'redo',
        onclick: function () {
            const worksheet = getActive();

            worksheet.redo();
        },
    });

    items.push({
        content: 'save',
        onclick: function () {
            const worksheet = getActive();

            if (worksheet) {
                worksheet.download();
            }
        },
    });

    items.push({
        type: 'divisor',
    });

    items.push({
        type: 'select',
        width: '120px',
        options: ['Default', 'Verdana', 'Arial', 'Courier New'],
        render: function (e) {
            return '<span style="font-family:' + e + '">' + e + '</span>';
        },
        onchange: function (a, b, c, d, e) {
            const worksheet = getActive();

            let cells = worksheet.getSelected(true);
            if (cells) {
                let value = !e ? '' : d;

                worksheet.setStyle(
                    Object.fromEntries(
                        cells.map(function (cellName) {
                            return [cellName, 'font-family: ' + value];
                        })
                    )
                );
            }
        },
        updateState: function (a, b, toolbarItem) {
            setItemStatus(toolbarItem, getActive());
        },
    });

    items.push({
        type: 'select',
        width: '48px',
        content: 'format_size',
        options: ['x-small', 'small', 'medium', 'large', 'x-large'],
        render: function (e) {
            return '<span style="font-size:' + e + '">' + e + '</span>';
        },
        onchange: function (a, b, c, value) {
            const worksheet = getActive();

            let cells = worksheet.getSelected(true);
            if (cells) {
                worksheet.setStyle(
                    Object.fromEntries(
                        cells.map(function (cellName) {
                            return [cellName, 'font-size: ' + value];
                        })
                    )
                );
            }
        },
        updateState: function (a, b, toolbarItem) {
            setItemStatus(toolbarItem, getActive());
        },
    });

    items.push({
        type: 'select',
        options: ['left', 'center', 'right', 'justify'],
        render: function (e) {
            return '<i class="material-icons">format_align_' + e + '</i>';
        },
        onchange: function (a, b, c, value) {
            const worksheet = getActive();

            let cells = worksheet.getSelected(true);
            if (cells) {
                worksheet.setStyle(
                    Object.fromEntries(
                        cells.map(function (cellName) {
                            return [cellName, 'text-align: ' + value];
                        })
                    )
                );
            }
        },
        updateState: function (a, b, toolbarItem) {
            setItemStatus(toolbarItem, getActive());
        },
    });

    items.push({
        content: 'format_bold',
        onclick: function () {
            const worksheet = getActive();

            let cells = worksheet.getSelected(true);
            if (cells) {
                worksheet.setStyle(
                    Object.fromEntries(
                        cells.map(function (cellName) {
                            return [cellName, 'font-weight:bold'];
                        })
                    )
                );
            }
        },
        updateState: function (a, b, toolbarItem) {
            setItemStatus(toolbarItem, getActive());
        },
    });

    items.push({
        type: 'color',
        content: 'format_color_text',
        k: 'color',
        updateState: function (a, b, toolbarItem) {
            setItemStatus(toolbarItem, getActive());
        },
    });

    items.push({
        type: 'color',
        content: 'format_color_fill',
        k: 'background-color',
        updateState: function (a, b, toolbarItem, d) {
            setItemStatus(toolbarItem, getActive());
        },
    });

    let verticalAlign = ['top', 'middle', 'bottom'];

    items.push({
        type: 'select',
        options: ['vertical_align_top', 'vertical_align_center', 'vertical_align_bottom'],
        render: function (e) {
            return '<i class="material-icons">' + e + '</i>';
        },
        value: 1,
        onchange: function (a, b, c, d, value) {
            const worksheet = getActive();

            let cells = worksheet.getSelected(true);
            if (cells) {
                worksheet.setStyle(
                    Object.fromEntries(
                        cells.map(function (cellName) {
                            return [cellName, 'vertical-align: ' + verticalAlign[value]];
                        })
                    )
                );
            }
        },
        updateState: function (a, b, toolbarItem) {
            setItemStatus(toolbarItem, getActive());
        },
    });

    items.push({
        content: 'web',
        tooltip: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Merge the selected cells'),
        onclick: function () {
            const worksheet = getActive();

            if (worksheet.selectedCell && confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('The merged cells will retain the value of the top-left cell only. Are you sure?'))) {
                const selectedRange = [
                    Math.min(worksheet.selectedCell[0], worksheet.selectedCell[2]),
                    Math.min(worksheet.selectedCell[1], worksheet.selectedCell[3]),
                    Math.max(worksheet.selectedCell[0], worksheet.selectedCell[2]),
                    Math.max(worksheet.selectedCell[1], worksheet.selectedCell[3]),
                ];

                let cell = getCellNameFromCoords(selectedRange[0], selectedRange[1]);
                if (worksheet.records[selectedRange[1]][selectedRange[0]].element.getAttribute('data-merged')) {
                    worksheet.removeMerge(cell);
                } else {
                    let colspan = selectedRange[2] - selectedRange[0] + 1;
                    let rowspan = selectedRange[3] - selectedRange[1] + 1;

                    if (colspan !== 1 || rowspan !== 1) {
                        worksheet.setMerge(cell, colspan, rowspan);
                    }
                }
            }
        },
        updateState: function (a, b, toolbarItem) {
            setItemStatus(toolbarItem, getActive());
        },
    });

    items.push({
        type: 'select',
        options: [
            'border_all',
            'border_outer',
            'border_inner',
            'border_horizontal',
            'border_vertical',
            'border_left',
            'border_top',
            'border_right',
            'border_bottom',
            'border_clear',
        ],
        columns: 5,
        render: function (e) {
            return '<i class="material-icons">' + e + '</i>';
        },
        right: true,
        onchange: function (a, b, c, d) {
            const worksheet = getActive();

            if (worksheet.selectedCell) {
                const selectedRange = [
                    Math.min(worksheet.selectedCell[0], worksheet.selectedCell[2]),
                    Math.min(worksheet.selectedCell[1], worksheet.selectedCell[3]),
                    Math.max(worksheet.selectedCell[0], worksheet.selectedCell[2]),
                    Math.max(worksheet.selectedCell[1], worksheet.selectedCell[3]),
                ];

                let type = d;

                if (selectedRange) {
                    // Default options
                    let thickness = b.thickness || 1;
                    let color = b.color || 'black';
                    const borderStyle = b.style || 'solid';

                    if (borderStyle === 'double') {
                        thickness += 2;
                    }

                    let style = {};

                    // Matrix
                    let px = selectedRange[0];
                    let py = selectedRange[1];
                    let ux = selectedRange[2];
                    let uy = selectedRange[3];

                    const setBorder = function (columnName, i, j) {
                        let border = ['', '', '', ''];

                        if (
                            ((type === 'border_top' || type === 'border_outer') && j === py) ||
                            ((type === 'border_inner' || type === 'border_horizontal') && j > py) ||
                            type === 'border_all'
                        ) {
                            border[0] = 'border-top: ' + thickness + 'px ' + borderStyle + ' ' + color;
                        } else {
                            border[0] = 'border-top: ';
                        }

                        if ((type === 'border_all' || type === 'border_right' || type === 'border_outer') && i === ux) {
                            border[1] = 'border-right: ' + thickness + 'px ' + borderStyle + ' ' + color;
                        } else {
                            border[1] = 'border-right: ';
                        }

                        if ((type === 'border_all' || type === 'border_bottom' || type === 'border_outer') && j === uy) {
                            border[2] = 'border-bottom: ' + thickness + 'px ' + borderStyle + ' ' + color;
                        } else {
                            border[2] = 'border-bottom: ';
                        }

                        if (
                            ((type === 'border_left' || type === 'border_outer') && i === px) ||
                            ((type === 'border_inner' || type === 'border_vertical') && i > px) ||
                            type === 'border_all'
                        ) {
                            border[3] = 'border-left: ' + thickness + 'px ' + borderStyle + ' ' + color;
                        } else {
                            border[3] = 'border-left: ';
                        }

                        style[columnName] = border.join(';');
                    };

                    for (let j = selectedRange[1]; j <= selectedRange[3]; j++) {
                        // Row - py - uy
                        for (let i = selectedRange[0]; i <= selectedRange[2]; i++) {
                            // Col - px - ux
                            setBorder(getCellNameFromCoords(i, j), i, j);

                            if (worksheet.records[j][i].element.getAttribute('data-merged')) {
                                setBorder(getCellNameFromCoords(selectedRange[0], selectedRange[1]), i, j);
                            }
                        }
                    }

                    if (Object.keys(style)) {
                        worksheet.setStyle(style);
                    }
                }
            }
        },
        onload: function (a, b) {
            // Border color
            let container = document.createElement('div');
            let div = document.createElement('div');
            container.appendChild(div);

            let colorPicker = __WEBPACK_EXTERNAL_MODULE_jsuites_default__.color(div, {
                closeOnChange: false,
                onchange: function (o, v) {
                    o.parentNode.children[1].style.color = v;
                    b.color = v;
                },
            });

            let i = document.createElement('i');
            i.classList.add('material-icons');
            i.innerHTML = 'color_lens';
            i.onclick = function () {
                colorPicker.open();
            };
            container.appendChild(i);
            a.children[1].appendChild(container);

            div = document.createElement('div');
            __WEBPACK_EXTERNAL_MODULE_jsuites_default__.picker(div, {
                type: 'select',
                data: [1, 2, 3, 4, 5],
                render: function (e) {
                    return '<div style="height: ' + e + 'px; width: 30px; background-color: black;"></div>';
                },
                onchange: function (a, k, c, d) {
                    b.thickness = d;
                },
                width: '50px',
            });
            a.children[1].appendChild(div);

            const borderStylePicker = document.createElement('div');
            __WEBPACK_EXTERNAL_MODULE_jsuites_default__.picker(borderStylePicker, {
                type: 'select',
                data: ['solid', 'dotted', 'dashed', 'double'],
                render: function (e) {
                    if (e === 'double') {
                        return '<div style="width: 30px; border-top: 3px ' + e + ' black;"></div>';
                    }
                    return '<div style="width: 30px; border-top: 2px ' + e + ' black;"></div>';
                },
                onchange: function (a, k, c, d) {
                    b.style = d;
                },
                width: '50px',
            });
            a.children[1].appendChild(borderStylePicker);

            div = document.createElement('div');
            div.style.flex = '1';
            a.children[1].appendChild(div);
        },
        updateState: function (a, b, toolbarItem) {
            setItemStatus(toolbarItem, getActive());
        },
    });

    items.push({
        type: 'divisor',
    });

    items.push({
        content: 'fullscreen',
        tooltip: 'Toggle Fullscreen',
        onclick: function (a, b, c) {
            if (c.children[0].textContent === 'fullscreen') {
                spreadsheet.fullscreen(true);
                c.children[0].textContent = 'fullscreen_exit';
            } else {
                spreadsheet.fullscreen(false);
                c.children[0].textContent = 'fullscreen';
            }
        },
        updateState: function (a, b, c, d) {
            if (d.parent.config.fullscreen === true) {
                c.children[0].textContent = 'fullscreen_exit';
            } else {
                c.children[0].textContent = 'fullscreen';
            }
        },
    });

    return items;
};

const adjustToolbarSettingsForJSuites = function (toolbar) {
    const spreadsheet = this;

    const items = toolbar.items;

    for (let i = 0; i < items.length; i++) {
        // Tooltip
        if (items[i].tooltip) {
            items[i].title = items[i].tooltip;

            delete items[i].tooltip;
        }

        if (items[i].type == 'select') {
            if (items[i].options) {
                items[i].data = items[i].options;
                delete items[i].options;
            } else {
                items[i].data = items[i].v;
                delete items[i].v;

                if (items[i].k && !items[i].onchange) {
                    items[i].onchange = function (el, config, value) {
                        const worksheet = getWorksheetInstance.call(spreadsheet);

                        const cells = worksheet.getSelected(true);

                        worksheet.setStyle(
                            Object.fromEntries(
                                cells.map(function (cellName) {
                                    return [cellName, items[i].k + ': ' + value];
                                })
                            )
                        );
                    };
                }
            }
        } else if (items[i].type == 'color') {
            items[i].type = 'i';

            items[i].onclick = function (a, b, c) {
                if (!c.color) {
                    __WEBPACK_EXTERNAL_MODULE_jsuites_default__.color(c, {
                        onchange: function (o, v) {
                            const worksheet = getWorksheetInstance.call(spreadsheet);

                            const cells = worksheet.getSelected(true);

                            worksheet.setStyle(
                                Object.fromEntries(
                                    cells.map(function (cellName) {
                                        return [cellName, items[i].k + ': ' + v];
                                    })
                                )
                            );
                        },
                        onopen: function (o) {
                            o.color.select('');
                        },
                    });

                    c.color.open();
                }
            };
        }
    }
};

/**
 * Create toolbar
 */
const createToolbar = function (toolbar) {
    const spreadsheet = this;

    const toolbarElement = document.createElement('div');
    toolbarElement.classList.add('jss_toolbar');

    adjustToolbarSettingsForJSuites.call(spreadsheet, toolbar);

    if (typeof spreadsheet.plugins === 'object') {
        Object.entries(spreadsheet.plugins).forEach(function ([, plugin]) {
            if (typeof plugin.toolbar === 'function') {
                const result = plugin.toolbar(toolbar);

                if (result) {
                    toolbar = result;
                }
            }
        });
    }

    __WEBPACK_EXTERNAL_MODULE_jsuites_default__.toolbar(toolbarElement, toolbar);

    return toolbarElement;
};

const updateToolbar = function (worksheet) {
    if (worksheet.parent.toolbar) {
        worksheet.parent.toolbar.toolbar.update(worksheet);
    }
};

const showToolbar = function () {
    const spreadsheet = this;

    if (spreadsheet.config.toolbar && !spreadsheet.toolbar) {
        let toolbar;

        if (Array.isArray(spreadsheet.config.toolbar)) {
            toolbar = {
                items: spreadsheet.config.toolbar,
            };
        } else if (typeof spreadsheet.config.toolbar === 'object') {
            toolbar = spreadsheet.config.toolbar;
        } else {
            toolbar = {
                items: getDefault.call(spreadsheet),
            };

            if (typeof spreadsheet.config.toolbar === 'function') {
                toolbar = spreadsheet.config.toolbar(toolbar);
            }
        }

        spreadsheet.toolbar = spreadsheet.element.insertBefore(createToolbar.call(spreadsheet, toolbar), spreadsheet.element.children[1]);
    }
};

const hideToolbar = function () {
    const spreadsheet = this;

    if (spreadsheet.toolbar) {
        spreadsheet.toolbar.parentNode.removeChild(spreadsheet.toolbar);

        delete spreadsheet.toolbar;
    }
};

;// ./src/utils/selection.js








const updateCornerPosition = function () {
    const obj = this;

    // If any selected cells
    if (!obj.highlighted || !obj.highlighted.length) {
        obj.corner.style.top = '-2000px';
        obj.corner.style.left = '-2000px';
    } else {
        // Get last cell
        const last = obj.highlighted[obj.highlighted.length - 1].element;
        const lastX = last.getAttribute('data-x');

        const contentRect = obj.content.getBoundingClientRect();
        const x1 = contentRect.left;
        const y1 = contentRect.top;

        const lastRect = last.getBoundingClientRect();
        const x2 = lastRect.left;
        const y2 = lastRect.top;
        const w2 = lastRect.width;
        const h2 = lastRect.height;

        const x = x2 - x1 + obj.content.scrollLeft + w2 - 4;
        const y = y2 - y1 + obj.content.scrollTop + h2 - 4;

        // Place the corner in the correct place
        obj.corner.style.top = y + 'px';
        obj.corner.style.left = x + 'px';

        if (obj.options.freezeColumns) {
            const width = getFreezeWidth.call(obj);
            // Only check if the last column is not part of the merged cells
            if (lastX > obj.options.freezeColumns - 1 && x2 - x1 + w2 < width) {
                obj.corner.style.display = 'none';
            } else {
                if (obj.options.selectionCopy != false) {
                    obj.corner.style.display = '';
                }
            }
        } else {
            if (obj.options.selectionCopy != false) {
                obj.corner.style.display = '';
            }
        }
    }

    updateToolbar(obj);
};

const resetSelection = function (blur) {
    const obj = this;

    let previousStatus;

    // Remove style
    if (!obj.highlighted || !obj.highlighted.length) {
        previousStatus = 0;
    } else {
        previousStatus = 1;

        for (let i = 0; i < obj.highlighted.length; i++) {
            obj.highlighted[i].element.classList.remove('highlight');
            obj.highlighted[i].element.classList.remove('highlight-left');
            obj.highlighted[i].element.classList.remove('highlight-right');
            obj.highlighted[i].element.classList.remove('highlight-top');
            obj.highlighted[i].element.classList.remove('highlight-bottom');
            obj.highlighted[i].element.classList.remove('highlight-selected');

            const px = parseInt(obj.highlighted[i].element.getAttribute('data-x'));
            const py = parseInt(obj.highlighted[i].element.getAttribute('data-y'));

            // Check for merged cells
            let ux, uy;

            if (obj.highlighted[i].element.getAttribute('data-merged')) {
                const colspan = parseInt(obj.highlighted[i].element.getAttribute('colspan'));
                const rowspan = parseInt(obj.highlighted[i].element.getAttribute('rowspan'));
                ux = colspan > 0 ? px + (colspan - 1) : px;
                uy = rowspan > 0 ? py + (rowspan - 1) : py;
            } else {
                ux = px;
                uy = py;
            }

            // Remove selected from headers
            for (let j = px; j <= ux; j++) {
                if (obj.headers[j]) {
                    obj.headers[j].classList.remove('selected');
                }
            }

            // Remove selected from rows
            for (let j = py; j <= uy; j++) {
                if (obj.rows[j]) {
                    obj.rows[j].element.classList.remove('selected');
                }
            }
        }
    }

    // Reset highlighted cells
    obj.highlighted = [];

    // Reset
    obj.selectedCell = null;

    // Hide corner
    obj.corner.style.top = '-2000px';
    obj.corner.style.left = '-2000px';

    if (blur == true && previousStatus == 1) {
        utils_dispatch.call(obj, 'onblur', obj);
    }

    return previousStatus;
};

/**
 * Update selection based on two cells
 */
const updateSelection = function (el1, el2, origin) {
    const obj = this;

    const x1 = el1.getAttribute('data-x');
    const y1 = el1.getAttribute('data-y');

    let x2, y2;
    if (el2) {
        x2 = el2.getAttribute('data-x');
        y2 = el2.getAttribute('data-y');
    } else {
        x2 = x1;
        y2 = y1;
    }

    updateSelectionFromCoords.call(obj, x1, y1, x2, y2, origin);
};

const removeCopyingSelection = function () {
    const copying = document.querySelectorAll('.jss_worksheet .copying');
    for (let i = 0; i < copying.length; i++) {
        copying[i].classList.remove('copying');
        copying[i].classList.remove('copying-left');
        copying[i].classList.remove('copying-right');
        copying[i].classList.remove('copying-top');
        copying[i].classList.remove('copying-bottom');
    }
};

const updateSelectionFromCoords = function (x1, y1, x2, y2, origin) {
    const obj = this;

    // select column
    if (y1 == null) {
        y1 = 0;
        y2 = obj.rows.length - 1;

        if (x1 == null) {
            return;
        }
    } else if (x1 == null) {
        // select row
        x1 = 0;
        x2 = obj.options.data[0].length - 1;
    }

    // Same element
    if (x2 == null) {
        x2 = x1;
    }
    if (y2 == null) {
        y2 = y1;
    }

    // Selection must be within the existing data
    if (x1 >= obj.headers.length) {
        x1 = obj.headers.length - 1;
    }
    if (y1 >= obj.rows.length) {
        y1 = obj.rows.length - 1;
    }
    if (x2 >= obj.headers.length) {
        x2 = obj.headers.length - 1;
    }
    if (y2 >= obj.rows.length) {
        y2 = obj.rows.length - 1;
    }

    // Limits
    let borderLeft = null;
    let borderRight = null;
    let borderTop = null;
    let borderBottom = null;

    // Origin & Destination
    let px, ux;

    if (parseInt(x1) < parseInt(x2)) {
        px = parseInt(x1);
        ux = parseInt(x2);
    } else {
        px = parseInt(x2);
        ux = parseInt(x1);
    }

    let py, uy;

    if (parseInt(y1) < parseInt(y2)) {
        py = parseInt(y1);
        uy = parseInt(y2);
    } else {
        py = parseInt(y2);
        uy = parseInt(y1);
    }

    // Verify merged columns
    for (let i = px; i <= ux; i++) {
        for (let j = py; j <= uy; j++) {
            if (obj.records[j][i] && obj.records[j][i].element.getAttribute('data-merged')) {
                const x = parseInt(obj.records[j][i].element.getAttribute('data-x'));
                const y = parseInt(obj.records[j][i].element.getAttribute('data-y'));
                const colspan = parseInt(obj.records[j][i].element.getAttribute('colspan'));
                const rowspan = parseInt(obj.records[j][i].element.getAttribute('rowspan'));

                if (colspan > 1) {
                    if (x < px) {
                        px = x;
                    }
                    if (x + colspan > ux) {
                        ux = x + colspan - 1;
                    }
                }

                if (rowspan) {
                    if (y < py) {
                        py = y;
                    }
                    if (y + rowspan > uy) {
                        uy = y + rowspan - 1;
                    }
                }
            }
        }
    }

    // Vertical limits
    for (let j = py; j <= uy; j++) {
        if (obj.rows[j].element.style.display != 'none') {
            if (borderTop == null) {
                borderTop = j;
            }
            borderBottom = j;
        }
    }

    for (let i = px; i <= ux; i++) {
        for (let j = py; j <= uy; j++) {
            // Horizontal limits
            if (!obj.options.columns || !obj.options.columns[i] || obj.options.columns[i].type != 'hidden') {
                if (borderLeft == null) {
                    borderLeft = i;
                }
                borderRight = i;
            }
        }
    }

    // Create borders
    if (!borderLeft) {
        borderLeft = 0;
    }
    if (!borderRight) {
        borderRight = 0;
    }

    const ret = utils_dispatch.call(obj, 'onbeforeselection', obj, borderLeft, borderTop, borderRight, borderBottom, origin);
    if (ret === false) {
        return false;
    }

    // Reset Selection
    const previousState = obj.resetSelection();

    // Keep selected cell
    obj.selectedCell = [x1, y1, x2, y2];

    // Add selected cell
    if (obj.records[y1][x1]) {
        obj.records[y1][x1].element.classList.add('highlight-selected');
    }

    // Redefining styles
    for (let i = px; i <= ux; i++) {
        for (let j = py; j <= uy; j++) {
            if (obj.rows[j].element.style.display != 'none' && obj.records[j][i].element.style.display != 'none') {
                obj.records[j][i].element.classList.add('highlight');
                obj.highlighted.push(obj.records[j][i]);
            }
        }
    }

    for (let i = borderLeft; i <= borderRight; i++) {
        if (
            (!obj.options.columns || !obj.options.columns[i] || obj.options.columns[i].type != 'hidden') &&
            obj.cols[i].colElement.style &&
            obj.cols[i].colElement.style.display != 'none'
        ) {
            // Top border
            if (obj.records[borderTop] && obj.records[borderTop][i]) {
                obj.records[borderTop][i].element.classList.add('highlight-top');
            }
            // Bottom border
            if (obj.records[borderBottom] && obj.records[borderBottom][i]) {
                obj.records[borderBottom][i].element.classList.add('highlight-bottom');
            }
            // Add selected from headers
            obj.headers[i].classList.add('selected');
        }
    }

    for (let j = borderTop; j <= borderBottom; j++) {
        if (obj.rows[j] && obj.rows[j].element.style.display != 'none') {
            // Left border
            obj.records[j][borderLeft].element.classList.add('highlight-left');
            // Right border
            obj.records[j][borderRight].element.classList.add('highlight-right');
            // Add selected from rows
            obj.rows[j].element.classList.add('selected');
        }
    }

    obj.selectedContainer = [borderLeft, borderTop, borderRight, borderBottom];

    // Handle events
    if (previousState == 0) {
        utils_dispatch.call(obj, 'onfocus', obj);

        removeCopyingSelection();
    }

    utils_dispatch.call(obj, 'onselection', obj, borderLeft, borderTop, borderRight, borderBottom, origin);

    // Find corner cell
    updateCornerPosition.call(obj);
};

/**
 * Get selected column numbers
 *
 * @return array
 */
const getSelectedColumns = function (visibleOnly) {
    const obj = this;

    if (!obj.selectedCell) {
        return [];
    }

    const result = [];

    for (let i = Math.min(obj.selectedCell[0], obj.selectedCell[2]); i <= Math.max(obj.selectedCell[0], obj.selectedCell[2]); i++) {
        if (!visibleOnly || obj.headers[i].style.display != 'none') {
            result.push(i);
        }
    }

    return result;
};

/**
 * Refresh current selection
 */
const refreshSelection = function () {
    const obj = this;

    if (obj.selectedCell) {
        obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
    }
};

/**
 * Remove copy selection
 *
 * @return void
 */
const removeCopySelection = function () {
    const obj = this;

    // Remove current selection
    for (let i = 0; i < obj.selection.length; i++) {
        obj.selection[i].classList.remove('selection');
        obj.selection[i].classList.remove('selection-left');
        obj.selection[i].classList.remove('selection-right');
        obj.selection[i].classList.remove('selection-top');
        obj.selection[i].classList.remove('selection-bottom');
    }

    obj.selection = [];
};

const doubleDigitFormat = function (v) {
    v = '' + v;
    if (v.length == 1) {
        v = '0' + v;
    }
    return v;
};

/**
 * Helper function to copy data using the corner icon
 */
const copyData = function (o, d) {
    const obj = this;

    // Get data from all selected cells
    const data = obj.getData(true, false);

    // Selected cells
    const h = obj.selectedContainer;

    // Cells
    const x1 = parseInt(o.getAttribute('data-x'));
    const y1 = parseInt(o.getAttribute('data-y'));
    const x2 = parseInt(d.getAttribute('data-x'));
    const y2 = parseInt(d.getAttribute('data-y'));

    // Records
    const records = [];
    let breakControl = false;

    let rowNumber, colNumber;

    if (h[0] == x1) {
        // Vertical copy
        if (y1 < h[1]) {
            rowNumber = y1 - h[1];
        } else {
            rowNumber = 1;
        }
        colNumber = 0;
    } else {
        if (x1 < h[0]) {
            colNumber = x1 - h[0];
        } else {
            colNumber = 1;
        }
        rowNumber = 0;
    }

    // Copy data procedure
    let posx = 0;
    let posy = 0;

    for (let j = y1; j <= y2; j++) {
        // Skip hidden rows
        if (obj.rows[j] && obj.rows[j].element.style.display == 'none') {
            continue;
        }

        // Controls
        if (data[posy] == undefined) {
            posy = 0;
        }
        posx = 0;

        // Data columns
        if (h[0] != x1) {
            if (x1 < h[0]) {
                colNumber = x1 - h[0];
            } else {
                colNumber = 1;
            }
        }
        // Data columns
        for (let i = x1; i <= x2; i++) {
            // Update non-readonly
            if (
                obj.records[j][i] &&
                !obj.records[j][i].element.classList.contains('readonly') &&
                obj.records[j][i].element.style.display != 'none' &&
                breakControl == false
            ) {
                // Stop if contains value
                if (!obj.selection.length) {
                    if (obj.options.data[j][i] != '') {
                        breakControl = true;
                        continue;
                    }
                }

                // Column
                if (data[posy] == undefined) {
                    posx = 0;
                } else if (data[posy][posx] == undefined) {
                    posx = 0;
                }

                // Value
                let value = data[posy][posx];

                if (value && !data[1] && obj.parent.config.autoIncrement != false) {
                    if (
                        obj.options.columns &&
                        obj.options.columns[i] &&
                        (!obj.options.columns[i].type || obj.options.columns[i].type == 'text' || obj.options.columns[i].type == 'number')
                    ) {
                        if (('' + value).substr(0, 1) == '=') {
                            const tokens = value.match(/([A-Z]+[0-9]+)/g);

                            if (tokens) {
                                const affectedTokens = [];
                                for (let index = 0; index < tokens.length; index++) {
                                    const position = getIdFromColumnName(tokens[index], 1);
                                    position[0] += colNumber;
                                    position[1] += rowNumber;
                                    if (position[1] < 0) {
                                        position[1] = 0;
                                    }
                                    const token = getColumnNameFromId([position[0], position[1]]);

                                    if (token != tokens[index]) {
                                        affectedTokens[tokens[index]] = token;
                                    }
                                }
                                // Update formula
                                if (affectedTokens) {
                                    value = updateFormula(value, affectedTokens);
                                }
                            }
                        } else {
                            if (value == Number(value)) {
                                value = Number(value) + rowNumber;
                            }
                        }
                    } else if (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].type == 'calendar') {
                        const date = new Date(value);
                        date.setDate(date.getDate() + rowNumber);
                        value =
                            date.getFullYear() +
                            '-' +
                            doubleDigitFormat(parseInt(date.getMonth() + 1)) +
                            '-' +
                            doubleDigitFormat(date.getDate()) +
                            ' ' +
                            '00:00:00';
                    }
                }

                records.push(updateCell.call(obj, i, j, value));

                // Update all formulas in the chain
                updateFormulaChain.call(obj, i, j, records);
            }
            posx++;
            if (h[0] != x1) {
                colNumber++;
            }
        }
        posy++;
        rowNumber++;
    }

    // Update history
    setHistory.call(obj, {
        action: 'setValue',
        records: records,
        selection: obj.selectedCell,
    });

    // Update table with custom configuration if applicable
    updateTable.call(obj);

    // On after changes
    const onafterchangesRecords = records.map(function (record) {
        return {
            x: record.x,
            y: record.y,
            value: record.value,
            oldValue: record.oldValue,
        };
    });

    utils_dispatch.call(obj, 'onafterchanges', obj, onafterchangesRecords);
};

const hash = function (str) {
    let hash = 0,
        i,
        chr;

    if (!str || str.length === 0) {
        return hash;
    } else {
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0;
        }
    }
    return hash;
};

/**
 * Move coords to A1 in case overlaps with an excluded cell
 */
const conditionalSelectionUpdate = function (type, o, d) {
    const obj = this;

    if (type == 1) {
        if (obj.selectedCell && ((o >= obj.selectedCell[1] && o <= obj.selectedCell[3]) || (d >= obj.selectedCell[1] && d <= obj.selectedCell[3]))) {
            obj.resetSelection();
            return;
        }
    } else {
        if (obj.selectedCell && ((o >= obj.selectedCell[0] && o <= obj.selectedCell[2]) || (d >= obj.selectedCell[0] && d <= obj.selectedCell[2]))) {
            obj.resetSelection();
            return;
        }
    }
};

/**
 * Get selected rows numbers
 *
 * @return array
 */
const getSelectedRows = function (visibleOnly) {
    const obj = this;

    if (!obj.selectedCell) {
        return [];
    }

    const result = [];

    for (let i = Math.min(obj.selectedCell[1], obj.selectedCell[3]); i <= Math.max(obj.selectedCell[1], obj.selectedCell[3]); i++) {
        if (!visibleOnly || obj.rows[i].element.style.display != 'none') {
            result.push(i);
        }
    }

    return result;
};

const selectAll = function () {
    const obj = this;

    if (!obj.selectedCell) {
        obj.selectedCell = [];
    }

    obj.selectedCell[0] = 0;
    obj.selectedCell[1] = 0;
    obj.selectedCell[2] = obj.headers.length - 1;
    obj.selectedCell[3] = obj.records.length - 1;

    obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
};

const getSelection = function () {
    const obj = this;

    if (!obj.selectedCell) {
        return null;
    }

    return [
        Math.min(obj.selectedCell[0], obj.selectedCell[2]),
        Math.min(obj.selectedCell[1], obj.selectedCell[3]),
        Math.max(obj.selectedCell[0], obj.selectedCell[2]),
        Math.max(obj.selectedCell[1], obj.selectedCell[3]),
    ];
};

const getSelected = function (columnNameOnly) {
    const obj = this;

    const selectedRange = getSelection.call(obj);

    if (!selectedRange) {
        return [];
    }

    const cells = [];

    for (let y = selectedRange[1]; y <= selectedRange[3]; y++) {
        for (let x = selectedRange[0]; x <= selectedRange[2]; x++) {
            if (columnNameOnly) {
                cells.push(getCellNameFromCoords(x, y));
            } else {
                cells.push(obj.records[y][x]);
            }
        }
    }

    return cells;
};

const getRange = function () {
    const obj = this;

    const selectedRange = getSelection.call(obj);

    if (!selectedRange) {
        return '';
    }

    const start = getCellNameFromCoords(selectedRange[0], selectedRange[1]);
    const end = getCellNameFromCoords(selectedRange[2], selectedRange[3]);

    if (start === end) {
        return obj.options.worksheetName + '!' + start;
    }

    return obj.options.worksheetName + '!' + start + ':' + end;
};

const isSelected = function (x, y) {
    const obj = this;

    const selection = getSelection.call(obj);

    return x >= selection[0] && x <= selection[2] && y >= selection[1] && y <= selection[3];
};

const getHighlighted = function () {
    const obj = this;

    const selection = getSelection.call(obj);

    if (selection) {
        return [selection];
    }

    return [];
};

;// ./src/utils/meta.js


/**
 * Get meta information from cell(s)
 *
 * @return integer
 */
const getMeta = function (cell, key) {
    const obj = this;

    if (!cell) {
        return obj.options.meta;
    } else {
        if (key) {
            return obj.options.meta && obj.options.meta[cell] && obj.options.meta[cell][key] ? obj.options.meta[cell][key] : null;
        } else {
            return obj.options.meta && obj.options.meta[cell] ? obj.options.meta[cell] : null;
        }
    }
};

/**
 * Update meta information
 *
 * @return integer
 */
const updateMeta = function (affectedCells) {
    const obj = this;

    if (obj.options.meta) {
        const newMeta = {};
        const keys = Object.keys(obj.options.meta);
        for (let i = 0; i < keys.length; i++) {
            if (affectedCells[keys[i]]) {
                newMeta[affectedCells[keys[i]]] = obj.options.meta[keys[i]];
            } else {
                newMeta[keys[i]] = obj.options.meta[keys[i]];
            }
        }
        // Update meta information
        obj.options.meta = newMeta;
    }
};

/**
 * Set meta information to cell(s)
 *
 * @return integer
 */
const setMeta = function (o, k, v) {
    const obj = this;

    if (!obj.options.meta) {
        obj.options.meta = {};
    }

    if (k && v) {
        // Set data value
        if (!obj.options.meta[o]) {
            obj.options.meta[o] = {};
        }
        obj.options.meta[o][k] = v;

        utils_dispatch.call(obj, 'onchangemeta', obj, { [o]: { [k]: v } });
    } else {
        // Apply that for all cells
        const keys = Object.keys(o);
        for (let i = 0; i < keys.length; i++) {
            if (!obj.options.meta[keys[i]]) {
                obj.options.meta[keys[i]] = {};
            }

            const prop = Object.keys(o[keys[i]]);
            for (let j = 0; j < prop.length; j++) {
                obj.options.meta[keys[i]][prop[j]] = o[keys[i]][prop[j]];
            }
        }

        utils_dispatch.call(obj, 'onchangemeta', obj, o);
    }
};

;// ./src/utils/pagination.js





/**
 * Which page the row is
 */
const whichPage = function (row) {
    const obj = this;

    // Search
    if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
        row = obj.results.indexOf(row);
    }

    return Math.ceil((parseInt(row) + 1) / parseInt(obj.options.pagination)) - 1;
};

/**
 * Update the pagination
 */
const updatePagination = function () {
    const obj = this;

    // Reset container
    obj.pagination.children[0].innerHTML = '';
    obj.pagination.children[1].innerHTML = '';

    // Start pagination
    if (obj.options.pagination) {
        // Searchable
        let results;

        if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
            results = obj.results.length;
        } else {
            results = obj.rows.length;
        }

        if (!results) {
            // No records found
            obj.pagination.children[0].innerHTML = __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('No records found');
        } else {
            // Pagination container
            const quantyOfPages = Math.ceil(results / obj.options.pagination);

            let startNumber, finalNumber;

            if (obj.pageNumber < 6) {
                startNumber = 1;
                finalNumber = quantyOfPages < 10 ? quantyOfPages : 10;
            } else if (quantyOfPages - obj.pageNumber < 5) {
                startNumber = quantyOfPages - 9;
                finalNumber = quantyOfPages;
                if (startNumber < 1) {
                    startNumber = 1;
                }
            } else {
                startNumber = obj.pageNumber - 4;
                finalNumber = obj.pageNumber + 5;
            }

            // First
            if (startNumber > 1) {
                const paginationItem = document.createElement('div');
                paginationItem.className = 'jss_page';
                paginationItem.innerHTML = '<';
                paginationItem.title = 1;
                obj.pagination.children[1].appendChild(paginationItem);
            }

            // Get page links
            for (let i = startNumber; i <= finalNumber; i++) {
                const paginationItem = document.createElement('div');
                paginationItem.className = 'jss_page';
                paginationItem.innerHTML = i;
                obj.pagination.children[1].appendChild(paginationItem);

                if (obj.pageNumber == i - 1) {
                    paginationItem.classList.add('jss_page_selected');
                }
            }

            // Last
            if (finalNumber < quantyOfPages) {
                const paginationItem = document.createElement('div');
                paginationItem.className = 'jss_page';
                paginationItem.innerHTML = '>';
                paginationItem.title = quantyOfPages;
                obj.pagination.children[1].appendChild(paginationItem);
            }

            // Text
            const format = function (format) {
                const args = Array.prototype.slice.call(arguments, 1);
                return format.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] != 'undefined' ? args[number] : match;
                });
            };

            obj.pagination.children[0].innerHTML = format(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Showing page {0} of {1} entries'), obj.pageNumber + 1, quantyOfPages);
        }
    }
};

/**
 * Go to page
 */
const page = function (pageNumber) {
    const obj = this;

    const oldPage = obj.pageNumber;

    // Search
    let results;

    if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
        results = obj.results;
    } else {
        results = obj.rows;
    }

    // Per page
    const quantityPerPage = parseInt(obj.options.pagination);

    // pageNumber
    if (pageNumber == null || pageNumber == -1) {
        // Last page
        pageNumber = Math.ceil(results.length / quantityPerPage) - 1;
    }

    // Page number
    obj.pageNumber = pageNumber;

    let startRow = pageNumber * quantityPerPage;
    let finalRow = pageNumber * quantityPerPage + quantityPerPage;
    if (finalRow > results.length) {
        finalRow = results.length;
    }
    if (startRow < 0) {
        startRow = 0;
    }

    // Reset container
    while (obj.tbody.firstChild) {
        obj.tbody.removeChild(obj.tbody.firstChild);
    }

    // Appeding items
    for (let j = startRow; j < finalRow; j++) {
        if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
            obj.tbody.appendChild(obj.rows[results[j]].element);
        } else {
            obj.tbody.appendChild(obj.rows[j].element);
        }
    }

    if (obj.options.pagination > 0) {
        updatePagination.call(obj);
    }

    // Update corner position
    updateCornerPosition.call(obj);

    // Events
    utils_dispatch.call(obj, 'onchangepage', obj, pageNumber, oldPage, obj.options.pagination);
};

const quantiyOfPages = function () {
    const obj = this;

    let results;
    if ((obj.options.search == true || obj.options.filters == true) && obj.results) {
        results = obj.results.length;
    } else {
        results = obj.rows.length;
    }

    return Math.ceil(results / obj.options.pagination);
};

;// ./src/utils/footer.js


const setFooter = function (data) {
    const obj = this;

    if (data) {
        obj.options.footers = data;
    }

    if (obj.options.footers) {
        if (!obj.tfoot) {
            obj.tfoot = document.createElement('tfoot');
            obj.table.appendChild(obj.tfoot);
        }

        for (let j = 0; j < obj.options.footers.length; j++) {
            let tr;

            if (obj.tfoot.children[j]) {
                tr = obj.tfoot.children[j];
            } else {
                tr = document.createElement('tr');
                const td = document.createElement('td');
                tr.appendChild(td);
                obj.tfoot.appendChild(tr);
            }
            for (let i = 0; i < obj.headers.length; i++) {
                if (!obj.options.footers[j][i]) {
                    obj.options.footers[j][i] = '';
                }

                let td;

                if (obj.tfoot.children[j].children[i + 1]) {
                    td = obj.tfoot.children[j].children[i + 1];
                } else {
                    td = document.createElement('td');
                    tr.appendChild(td);

                    // Text align
                    const colAlign = obj.options.columns[i].align || obj.options.defaultColAlign || 'center';
                    td.style.textAlign = colAlign;
                }
                td.textContent = parseValue.call(obj, +obj.records.length + i, j, obj.options.footers[j][i]);

                // Hide/Show with hideColumn()/showColumn()
                td.style.display = obj.cols[i].colElement.style.display;
            }
        }
    }
};

;// ./src/utils/internal.js












const updateTable = function () {
    const obj = this;

    // Check for spare
    if (obj.options.minSpareRows > 0) {
        let numBlankRows = 0;
        for (let j = obj.rows.length - 1; j >= 0; j--) {
            let test = false;
            for (let i = 0; i < obj.headers.length; i++) {
                if (obj.options.data[j][i]) {
                    test = true;
                }
            }
            if (test) {
                break;
            } else {
                numBlankRows++;
            }
        }

        if (obj.options.minSpareRows - numBlankRows > 0) {
            obj.insertRow(obj.options.minSpareRows - numBlankRows);
        }
    }

    if (obj.options.minSpareCols > 0) {
        let numBlankCols = 0;
        for (let i = obj.headers.length - 1; i >= 0; i--) {
            let test = false;
            for (let j = 0; j < obj.rows.length; j++) {
                if (obj.options.data[j][i]) {
                    test = true;
                }
            }
            if (test) {
                break;
            } else {
                numBlankCols++;
            }
        }

        if (obj.options.minSpareCols - numBlankCols > 0) {
            obj.insertColumn(obj.options.minSpareCols - numBlankCols);
        }
    }

    // Update footers
    if (obj.options.footers) {
        setFooter.call(obj);
    }

    if (obj.options.columns.length < obj.options.minDimensions[0]) {
        obj.options.minDimensions[0] = obj.options.columns.length;
    }

    // Update corner position
    setTimeout(function () {
        updateCornerPosition.call(obj);
    }, 0);
};

/**
 * Trying to extract a number from a string
 */
const parseNumber = function (value, columnNumber) {
    const obj = this;

    // Decimal point
    const decimal = columnNumber && obj.options.columns[columnNumber].decimal ? obj.options.columns[columnNumber].decimal : '.';

    // Parse both parts of the number
    let number = '' + value;
    number = number.split(decimal);
    number[0] = number[0].match(/[+-]?[0-9]/g);
    if (number[0]) {
        number[0] = number[0].join('');
    }
    if (number[1]) {
        number[1] = number[1].match(/[0-9]*/g).join('');
    }

    // Is a valid number
    if (number[0] && Number.isInteger(Number(number[0]))) {
        if (!number[1]) {
            value = Number(number[0] + '.00');
        } else {
            value = Number(number[0] + '.' + number[1]);
        }
    } else {
        value = null;
    }

    return value;
};

/**
 * Parse formulas
 */
const executeFormula = function (expression, x, y) {
    const obj = this;

    const formulaResults = [];
    const formulaLoopProtection = [];

    // Execute formula with loop protection
    const execute = function (expression, x, y) {
        // Parent column identification
        const parentId = getColumnNameFromId([x, y]);

        // Code protection
        if (formulaLoopProtection[parentId]) {
            console.error('Reference loop detected');
            return '#ERROR';
        }

        formulaLoopProtection[parentId] = true;

        // Convert range tokens
        const tokensUpdate = function (tokens) {
            for (let index = 0; index < tokens.length; index++) {
                const f = [];
                const token = tokens[index].split(':');
                const e1 = getIdFromColumnName(token[0], true);
                const e2 = getIdFromColumnName(token[1], true);

                let x1, x2;

                if (e1[0] <= e2[0]) {
                    x1 = e1[0];
                    x2 = e2[0];
                } else {
                    x1 = e2[0];
                    x2 = e1[0];
                }

                let y1, y2;

                if (e1[1] <= e2[1]) {
                    y1 = e1[1];
                    y2 = e2[1];
                } else {
                    y1 = e2[1];
                    y2 = e1[1];
                }

                for (let j = y1; j <= y2; j++) {
                    for (let i = x1; i <= x2; i++) {
                        f.push(getColumnNameFromId([i, j]));
                    }
                }

                expression = expression.replace(tokens[index], f.join(','));
            }
        };

        // Range with $ remove $
        expression = expression.replace(/\$?([A-Z]+)\$?([0-9]+)/g, '$1$2');

        let tokens = expression.match(/([A-Z]+[0-9]+):([A-Z]+[0-9]+)/g);
        if (tokens && tokens.length) {
            tokensUpdate(tokens);
        }

        // Get tokens
        tokens = expression.match(/([A-Z]+[0-9]+)/g);
        tokens = new Set(tokens);

        // Direct self-reference protection
        if (tokens && tokens.has(parentId)) {
            console.error('Self Reference detected');
            return '#ERROR';
        } else {
            // Expressions to be used in the parsing
            const formulaExpressions = {};

            if (tokens) {
                for (const t of tokens) {
                    // Keep chain
                    if (!obj.formula[t]) {
                        obj.formula[t] = new Set();
                    }
                    // Is already in the register
                    obj.formula[t].add(parentId);

                    // Do not calculate again
                    if (!(t in globalThis)) {
                        // Coords
                        const position = getIdFromColumnName(t, 1);
                        // Get value
                        let value;

                        if (position[1] in obj.options.data && position[0] in obj.options.data[position[1]]) {
                            value = obj.options.data[position[1]][position[0]];
                        } else {
                            value = '';
                        }
                        // Get column data
                        if (('' + value).substr(0, 1) == '=') {
                            if (t in formulaResults) {
                                value = formulaResults[t];
                            } else {
                                value = execute(value, position[0], position[1]);
                                formulaResults[t] = value;
                            }
                        }
                        // Type!
                        if (('' + value).trim() == '') {
                            formulaExpressions[t] = null;
                        } else {
                            if (value == Number(value) && obj.parent.config.autoCasting != false) {
                                // Number
                                formulaExpressions[t] = Number(value);
                            } else {
                                // Trying any formatted number
                                const number = parseNumber.call(obj, value, position[0]);
                                if (obj.parent.config.autoCasting != false && number) {
                                    formulaExpressions[t] = number;
                                } else {
                                    formulaExpressions[t] = '"' + value + '"';
                                }
                            }
                        }
                    }
                }
            }

            const ret = utils_dispatch.call(obj, 'onbeforeformula', obj, expression, x, y);
            if (ret === false) {
                return expression;
            } else if (ret) {
                expression = ret;
            }

            // Convert formula to javascript
            let res;

            try {
                res = __WEBPACK_EXTERNAL_MODULE__jspreadsheet_formula_79b97a3c_default__(expression.substr(1), formulaExpressions, x, y, obj);

                if (typeof res === 'function') {
                    res = '#ERROR';
                }
            } catch (e) {
                res = '#ERROR';

                if (obj.parent.config.debugFormulas === true) {
                    console.log(expression.substr(1), formulaExpressions, e);
                }
            }

            return res;
        }
    };

    return execute(expression, x, y);
};

const parseValue = function (i, j, value, cell) {
    const obj = this;

    if (('' + value).substr(0, 1) == '=' && obj.parent.config.parseFormulas != false) {
        value = executeFormula.call(obj, value, i, j);
    }

    // Column options
    const options = obj.options.columns && obj.options.columns[i];
    if (options && !isFormula(value)) {
        // Mask options
        let opt = null;
        if ((opt = getMask(options))) {
            if (value && value == Number(value)) {
                value = Number(value);
            }
            // Process the decimals to match the mask
            let masked = __WEBPACK_EXTERNAL_MODULE_jsuites_default__.mask.render(value, opt, true);
            // Negative indication
            if (cell) {
                if (opt.mask) {
                    const t = opt.mask.split(';');
                    if (t[1]) {
                        const t1 = t[1].match(new RegExp('\\[Red\\]', 'gi'));
                        if (t1) {
                            if (value < 0) {
                                cell.classList.add('red');
                            } else {
                                cell.classList.remove('red');
                            }
                        }
                        const t2 = t[1].match(new RegExp('\\(', 'gi'));
                        if (t2) {
                            if (value < 0) {
                                masked = '(' + masked + ')';
                            }
                        }
                    }
                }
            }

            if (masked) {
                value = masked;
            }
        }
    }

    return value;
};

/**
 * Get dropdown value from key
 */
const getDropDownValue = function (column, key) {
    const obj = this;

    const value = [];

    if (obj.options.columns && obj.options.columns[column] && obj.options.columns[column].source) {
        // Create array from source
        const combo = [];
        const source = obj.options.columns[column].source;

        for (let i = 0; i < source.length; i++) {
            if (typeof source[i] == 'object') {
                combo[source[i].id] = source[i].name;
            } else {
                combo[source[i]] = source[i];
            }
        }

        // Guarantee single multiple compatibility
        const keys = Array.isArray(key) ? key : ('' + key).split(';');

        for (let i = 0; i < keys.length; i++) {
            if (typeof keys[i] === 'object') {
                value.push(combo[keys[i].id]);
            } else {
                if (combo[keys[i]]) {
                    value.push(combo[keys[i]]);
                }
            }
        }
    } else {
        console.error('Invalid column');
    }

    return value.length > 0 ? value.join('; ') : '';
};

const validDate = function (date) {
    date = '' + date;
    if (date.substr(4, 1) == '-' && date.substr(7, 1) == '-') {
        return true;
    } else {
        date = date.split('-');
        if (date[0].length == 4 && date[0] == Number(date[0]) && date[1].length == 2 && date[1] == Number(date[1])) {
            return true;
        }
    }
    return false;
};

/**
 * Strip tags
 */
const stripScript = function (a) {
    const b = new Option();
    b.innerHTML = a;
    let c = null;
    for (a = b.getElementsByTagName('script'); (c = a[0]); ) c.parentNode.removeChild(c);
    return b.innerHTML;
};

const createCell = function (i, j, value) {
    const obj = this;

    // Create cell and properties
    let td = document.createElement('td');
    td.setAttribute('data-x', i);
    td.setAttribute('data-y', j);

    if (obj.headers[i].style.display === 'none') {
        td.style.display = 'none';
    }
    // Security
    if (('' + value).substr(0, 1) == '=' && obj.options.secureFormulas == true) {
        const val = secureFormula(value);
        if (val != value) {
            // Update the data container
            value = val;
        }
    }

    // Custom column
    if (obj.options.columns && obj.options.columns[i] && typeof obj.options.columns[i].type === 'object') {
        if (obj.parent.config.parseHTML === true) {
            td.innerHTML = value;
        } else {
            td.textContent = value;
        }
        if (typeof obj.options.columns[i].type.createCell == 'function') {
            obj.options.columns[i].type.createCell(td, value, parseInt(i), parseInt(j), obj, obj.options.columns[i]);
        }
    } else {
        // Hidden column
        if (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].type == 'hidden') {
            td.style.display = 'none';
            td.textContent = value;
        } else if (obj.options.columns && obj.options.columns[i] && (obj.options.columns[i].type == 'checkbox' || obj.options.columns[i].type == 'radio')) {
            // Create input
            const element = document.createElement('input');
            element.type = obj.options.columns[i].type;
            element.name = 'c' + i;
            element.checked = value == 1 || value == true || value == 'true' ? true : false;
            element.onclick = function () {
                obj.setValue(td, this.checked);
            };

            if (obj.options.columns[i].readOnly == true || obj.options.editable == false) {
                element.setAttribute('disabled', 'disabled');
            }

            // Append to the table
            td.appendChild(element);
            // Make sure the values are correct
            obj.options.data[j][i] = element.checked;
        } else if (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].type == 'calendar') {
            // Try formatted date
            let formatted = null;
            if (!validDate(value)) {
                const tmp = __WEBPACK_EXTERNAL_MODULE_jsuites_default__.calendar.extractDateFromString(
                    value,
                    (obj.options.columns[i].options && obj.options.columns[i].options.format) || 'YYYY-MM-DD'
                );
                if (tmp) {
                    formatted = tmp;
                }
            }
            // Create calendar cell
            td.textContent = __WEBPACK_EXTERNAL_MODULE_jsuites_default__.calendar.getDateString(
                formatted ? formatted : value,
                obj.options.columns[i].options && obj.options.columns[i].options.format
            );
        } else if (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].type == 'dropdown') {
            // Create dropdown cell
            td.classList.add('jss_dropdown');
            td.textContent = getDropDownValue.call(obj, i, value);
        } else if (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].type == 'color') {
            if (obj.options.columns[i].render == 'square') {
                const color = document.createElement('div');
                color.className = 'color';
                color.style.backgroundColor = value;
                td.appendChild(color);
            } else {
                td.style.color = value;
                td.textContent = value;
            }
        } else if (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].type == 'image') {
            if (value && value.substr(0, 10) == 'data:image') {
                const img = document.createElement('img');
                img.src = value;
                td.appendChild(img);
            }
        } else {
            if (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].type == 'html') {
                td.innerHTML = stripScript(parseValue.call(this, i, j, value, td));
            } else {
                if (obj.parent.config.parseHTML === true) {
                    td.innerHTML = stripScript(parseValue.call(this, i, j, value, td));
                } else {
                    td.textContent = parseValue.call(this, i, j, value, td);
                }
            }
        }
    }

    // Readonly
    if (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].readOnly == true) {
        td.className = 'readonly';
    }

    // Text align
    const colAlign = (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].align) || obj.options.defaultColAlign || 'center';
    td.style.textAlign = colAlign;

    // Wrap option
    if (
        (!obj.options.columns || !obj.options.columns[i] || obj.options.columns[i].wordWrap != false) &&
        (obj.options.wordWrap == true ||
            (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].wordWrap == true) ||
            td.innerHTML.length > 200)
    ) {
        td.style.whiteSpace = 'pre-wrap';
    }

    // Overflow
    if (i > 0) {
        if (this.options.textOverflow == true) {
            if (value || td.innerHTML) {
                obj.records[j][i - 1].element.style.overflow = 'hidden';
            } else {
                if (i == obj.options.columns.length - 1) {
                    td.style.overflow = 'hidden';
                }
            }
        }
    }

    utils_dispatch.call(obj, 'oncreatecell', obj, td, i, j, value);

    return td;
};

/**
 * Update cell content
 *
 * @param object cell
 * @return void
 */
const updateCell = function (x, y, value, force) {
    const obj = this;

    let record;

    // Changing value depending on the column type
    if (obj.records[y][x].element.classList.contains('readonly') == true && !force) {
        // Do nothing
        record = {
            x: x,
            y: y,
            col: x,
            row: y,
        };
    } else {
        // Security
        if (('' + value).substr(0, 1) == '=' && obj.options.secureFormulas == true) {
            const val = secureFormula(value);
            if (val != value) {
                // Update the data container
                value = val;
            }
        }

        // On change
        const val = utils_dispatch.call(obj, 'onbeforechange', obj, obj.records[y][x].element, x, y, value);

        // If you return something this will overwrite the value
        if (val != undefined) {
            value = val;
        }

        if (
            obj.options.columns &&
            obj.options.columns[x] &&
            typeof obj.options.columns[x].type === 'object' &&
            typeof obj.options.columns[x].type.updateCell === 'function'
        ) {
            const result = obj.options.columns[x].type.updateCell(obj.records[y][x].element, value, parseInt(x), parseInt(y), obj, obj.options.columns[x]);

            if (result !== undefined) {
                value = result;
            }
        }

        // History format
        record = {
            x: x,
            y: y,
            col: x,
            row: y,
            value: value,
            oldValue: obj.options.data[y][x],
        };

        let editor = obj.options.columns && obj.options.columns[x] && typeof obj.options.columns[x].type === 'object' ? obj.options.columns[x].type : null;
        if (editor) {
            // Update data and cell
            obj.options.data[y][x] = value;
            if (typeof editor.setValue === 'function') {
                editor.setValue(obj.records[y][x].element, value);
            }
        } else {
            // Native functions
            if (obj.options.columns && obj.options.columns[x] && (obj.options.columns[x].type == 'checkbox' || obj.options.columns[x].type == 'radio')) {
                // Unchecked all options
                if (obj.options.columns[x].type == 'radio') {
                    for (let j = 0; j < obj.options.data.length; j++) {
                        obj.options.data[j][x] = false;
                    }
                }

                // Update data and cell
                obj.records[y][x].element.children[0].checked = value == 1 || value == true || value == 'true' || value == 'TRUE' ? true : false;
                obj.options.data[y][x] = obj.records[y][x].element.children[0].checked;
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'dropdown') {
                // Update data and cell
                obj.options.data[y][x] = value;
                obj.records[y][x].element.textContent = getDropDownValue.call(obj, x, value);
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'calendar') {
                // Try formatted date
                let formatted = null;
                if (!validDate(value)) {
                    const tmp = __WEBPACK_EXTERNAL_MODULE_jsuites_default__.calendar.extractDateFromString(
                        value,
                        (obj.options.columns[x].options && obj.options.columns[x].options.format) || 'YYYY-MM-DD'
                    );
                    if (tmp) {
                        formatted = tmp;
                    }
                }
                // Update data and cell
                obj.options.data[y][x] = value;
                obj.records[y][x].element.textContent = __WEBPACK_EXTERNAL_MODULE_jsuites_default__.calendar.getDateString(
                    formatted ? formatted : value,
                    obj.options.columns[x].options && obj.options.columns[x].options.format
                );
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'color') {
                // Update color
                obj.options.data[y][x] = value;
                // Render
                if (obj.options.columns[x].render == 'square') {
                    const color = document.createElement('div');
                    color.className = 'color';
                    color.style.backgroundColor = value;
                    obj.records[y][x].element.textContent = '';
                    obj.records[y][x].element.appendChild(color);
                } else {
                    obj.records[y][x].element.style.color = value;
                    obj.records[y][x].element.textContent = value;
                }
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'image') {
                value = '' + value;
                obj.options.data[y][x] = value;
                obj.records[y][x].element.innerHTML = '';
                if (value && value.substr(0, 10) == 'data:image') {
                    const img = document.createElement('img');
                    img.src = value;
                    obj.records[y][x].element.appendChild(img);
                }
            } else {
                // Update data and cell
                obj.options.data[y][x] = value;
                // Label
                if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'html') {
                    obj.records[y][x].element.innerHTML = stripScript(parseValue.call(obj, x, y, value));
                } else {
                    if (obj.parent.config.parseHTML === true) {
                        obj.records[y][x].element.innerHTML = stripScript(parseValue.call(obj, x, y, value, obj.records[y][x].element));
                    } else {
                        obj.records[y][x].element.textContent = parseValue.call(obj, x, y, value, obj.records[y][x].element);
                    }
                }
                // Handle big text inside a cell
                if (
                    (!obj.options.columns || !obj.options.columns[x] || obj.options.columns[x].wordWrap != false) &&
                    (obj.options.wordWrap == true ||
                        (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].wordWrap == true) ||
                        obj.records[y][x].element.innerHTML.length > 200)
                ) {
                    obj.records[y][x].element.style.whiteSpace = 'pre-wrap';
                } else {
                    obj.records[y][x].element.style.whiteSpace = '';
                }
            }
        }

        // Overflow
        if (x > 0) {
            if (value) {
                obj.records[y][x - 1].element.style.overflow = 'hidden';
            } else {
                obj.records[y][x - 1].element.style.overflow = '';
            }
        }

        if (obj.options.columns && obj.options.columns[x] && typeof obj.options.columns[x].render === 'function') {
            obj.options.columns[x].render(
                obj.records[y] && obj.records[y][x] ? obj.records[y][x].element : null,
                value,
                parseInt(x),
                parseInt(y),
                obj,
                obj.options.columns[x]
            );
        }

        // On change
        utils_dispatch.call(obj, 'onchange', obj, obj.records[y] && obj.records[y][x] ? obj.records[y][x].element : null, x, y, value, record.oldValue);
    }

    return record;
};

/**
 * The value is a formula
 */
const isFormula = function (value) {
    const v = ('' + value)[0];
    return v == '=' || v == '#' ? true : false;
};

/**
 * Get the mask in the jSuites.mask format
 */
const getMask = function (o) {
    if (o.format || o.mask || o.locale) {
        const opt = {};
        if (o.mask) {
            opt.mask = o.mask;
        } else if (o.format) {
            opt.mask = o.format;
        } else {
            opt.locale = o.locale;
            opt.options = o.options;
        }

        if (o.decimal) {
            if (!opt.options) {
                opt.options = {};
            }
            opt.options = { decimal: o.decimal };
        }
        return opt;
    }

    return null;
};

/**
 * Secure formula
 */
const secureFormula = function (oldValue) {
    let newValue = '';
    let inside = 0;

    for (let i = 0; i < oldValue.length; i++) {
        if (oldValue[i] == '"') {
            if (inside == 0) {
                inside = 1;
            } else {
                inside = 0;
            }
        }

        if (inside == 1) {
            newValue += oldValue[i];
        } else {
            newValue += oldValue[i].toUpperCase();
        }
    }

    return newValue;
};

/**
 * Update all related cells in the chain
 */
let chainLoopProtection = [];

const updateFormulaChain = function (x, y, records) {
    const obj = this;

    const cellId = getColumnNameFromId([x, y]);
    if (obj.formula[cellId] && obj.formula[cellId].size > 0) {
        if (chainLoopProtection[cellId]) {
            obj.records[y][x].element.innerHTML = '#ERROR';
            obj.formula[cellId] = '';
        } else {
            // Protection
            chainLoopProtection[cellId] = true;

            for (const n of obj.formula[cellId]) {
                const cell = getIdFromColumnName(n, true);
                // Update cell
                const value = '' + obj.options.data[cell[1]][cell[0]];
                if (value.substr(0, 1) == '=') {
                    records.push(updateCell.call(obj, cell[0], cell[1], value, true));
                } else {
                    // No longer a formula, remove from the chain
                    obj.formula[cellId].delete(n);
                }
                updateFormulaChain.call(obj, cell[0], cell[1], records);
            }
        }
    }

    chainLoopProtection = [];
};

/**
 * Update formula
 */
const updateFormula = function (formula, referencesToUpdate) {
    const testLetter = /[A-Z]/;
    const testNumber = /[0-9]/;

    let newFormula = '';
    let letter = null;
    let number = null;
    let token = '';

    for (let index = 0; index < formula.length; index++) {
        if (testLetter.exec(formula[index])) {
            letter = 1;
            number = 0;
            token += formula[index];
        } else if (testNumber.exec(formula[index])) {
            number = letter ? 1 : 0;
            token += formula[index];
        } else {
            if (letter && number) {
                token = referencesToUpdate[token] ? referencesToUpdate[token] : token;
            }
            newFormula += token;
            newFormula += formula[index];
            letter = 0;
            number = 0;
            token = '';
        }
    }

    if (token) {
        if (letter && number) {
            token = referencesToUpdate[token] ? referencesToUpdate[token] : token;
        }
        newFormula += token;
    }

    return newFormula;
};

/**
 * Update formulas
 */
const updateFormulas = function (referencesToUpdate) {
    const obj = this;

    // Update formulas
    for (let j = 0; j < obj.options.data.length; j++) {
        for (let i = 0; i < obj.options.data[0].length; i++) {
            const value = '' + obj.options.data[j][i];
            // Is formula
            if (value.substr(0, 1) == '=') {
                // Replace tokens
                const newFormula = updateFormula(value, referencesToUpdate);
                if (newFormula != value) {
                    obj.options.data[j][i] = newFormula;
                }
            }
        }
    }

    // Update formula chain
    const formula = [];
    const keys = Object.keys(obj.formula);
    for (let j = 0; j < keys.length; j++) {
        // Current key and values
        let key = keys[j];
        const value = obj.formula[key];
        // Update key
        if (referencesToUpdate[key]) {
            key = referencesToUpdate[key];
        }
        // Update values
        formula[key] = new Set();
        for (let letter of value) {
            if (referencesToUpdate[letter]) {
                letter = referencesToUpdate[letter];
            }
            formula[key].add(letter);
        }
    }
    obj.formula = formula;
};

/**
 * Update cell references
 *
 * @return void
 */
const updateTableReferences = function () {
    const obj = this;
    if (obj.skipUpdateTableReferences) {
        return;
    }

    // Update headers
    for (let i = 0; i < obj.headers.length; i++) {
        const x = obj.headers[i].getAttribute('data-x');

        if (x != i) {
            // Update coords
            obj.headers[i].setAttribute('data-x', i);
            // Title
            if (!obj.headers[i].getAttribute('title')) {
                obj.headers[i].innerHTML = getColumnName(i);
            }
        }
    }

    // Update all rows
    for (let j = 0; j < obj.rows.length; j++) {
        if (obj.rows[j]) {
            const y = obj.rows[j].element.getAttribute('data-y');

            if (y != j) {
                // Update coords
                obj.rows[j].element.setAttribute('data-y', j);
                obj.rows[j].element.children[0].setAttribute('data-y', j);
                // Row number
                obj.rows[j].element.children[0].innerHTML = j + 1;
            }
        }
    }

    // Regular cells affected by this change
    const affectedTokens = [];
    const mergeCellUpdates = [];

    // Update cell
    const updatePosition = function (x, y, i, j) {
        if (x != i) {
            obj.records[j][i].element.setAttribute('data-x', i);
        }
        if (y != j) {
            obj.records[j][i].element.setAttribute('data-y', j);
        }

        // Other updates
        if (x != i || y != j) {
            const columnIdFrom = getColumnNameFromId([x, y]);
            const columnIdTo = getColumnNameFromId([i, j]);
            affectedTokens[columnIdFrom] = columnIdTo;
        }
    };

    for (let j = 0; j < obj.records.length; j++) {
        for (let i = 0; i < obj.records[0].length; i++) {
            if (obj.records[j][i]) {
                // Current values
                const x = obj.records[j][i].element.getAttribute('data-x');
                const y = obj.records[j][i].element.getAttribute('data-y');

                // Update column
                if (obj.records[j][i].element.getAttribute('data-merged')) {
                    const columnIdFrom = getColumnNameFromId([x, y]);
                    const columnIdTo = getColumnNameFromId([i, j]);
                    if (mergeCellUpdates[columnIdFrom] == null) {
                        if (columnIdFrom == columnIdTo) {
                            mergeCellUpdates[columnIdFrom] = false;
                        } else {
                            const totalX = parseInt(i - x);
                            const totalY = parseInt(j - y);
                            mergeCellUpdates[columnIdFrom] = [columnIdTo, totalX, totalY];
                        }
                    }
                } else {
                    updatePosition(x, y, i, j);
                }
            }
        }
    }

    // Update merged if applicable
    const keys = Object.keys(mergeCellUpdates);
    if (keys.length) {
        for (let i = 0; i < keys.length; i++) {
            if (mergeCellUpdates[keys[i]]) {
                const info = getIdFromColumnName(keys[i], true);
                let x = info[0];
                let y = info[1];
                updatePosition(x, y, x + mergeCellUpdates[keys[i]][1], y + mergeCellUpdates[keys[i]][2]);

                const columnIdFrom = keys[i];
                const columnIdTo = mergeCellUpdates[keys[i]][0];
                for (let j = 0; j < obj.options.mergeCells[columnIdFrom][2].length; j++) {
                    x = parseInt(obj.options.mergeCells[columnIdFrom][2][j].getAttribute('data-x'));
                    y = parseInt(obj.options.mergeCells[columnIdFrom][2][j].getAttribute('data-y'));
                    obj.options.mergeCells[columnIdFrom][2][j].setAttribute('data-x', x + mergeCellUpdates[keys[i]][1]);
                    obj.options.mergeCells[columnIdFrom][2][j].setAttribute('data-y', y + mergeCellUpdates[keys[i]][2]);
                }

                obj.options.mergeCells[columnIdTo] = obj.options.mergeCells[columnIdFrom];
                delete obj.options.mergeCells[columnIdFrom];
            }
        }
    }

    // Update formulas
    updateFormulas.call(obj, affectedTokens);

    // Update meta data
    updateMeta.call(obj, affectedTokens);

    // Refresh selection
    refreshSelection.call(obj);

    // Update table with custom configuration if applicable
    updateTable.call(obj);
};

/**
 * Update scroll position based on the selection
 */
const updateScroll = function (direction) {
    const obj = this;

    // Jspreadsheet Container information
    const contentRect = obj.content.getBoundingClientRect();
    const x1 = contentRect.left;
    const y1 = contentRect.top;
    const w1 = contentRect.width;
    const h1 = contentRect.height;

    // Direction Left or Up
    const reference = obj.records[obj.selectedCell[3]][obj.selectedCell[2]].element;

    // Reference
    const referenceRect = reference.getBoundingClientRect();
    const x2 = referenceRect.left;
    const y2 = referenceRect.top;
    const w2 = referenceRect.width;
    const h2 = referenceRect.height;

    let x, y;

    // Direction
    if (direction == 0 || direction == 1) {
        x = x2 - x1 + obj.content.scrollLeft;
        y = y2 - y1 + obj.content.scrollTop - 2;
    } else {
        x = x2 - x1 + obj.content.scrollLeft + w2;
        y = y2 - y1 + obj.content.scrollTop + h2;
    }

    // Top position check
    if (y > obj.content.scrollTop + 30 && y < obj.content.scrollTop + h1) {
        // In the viewport
    } else {
        // Out of viewport
        if (y < obj.content.scrollTop + 30) {
            obj.content.scrollTop = y - h2;
        } else {
            obj.content.scrollTop = y - (h1 - 2);
        }
    }

    // Freeze columns?
    const freezed = getFreezeWidth.call(obj);

    // Left position check - TODO: change that to the bottom border of the element
    if (x > obj.content.scrollLeft + freezed && x < obj.content.scrollLeft + w1) {
        // In the viewport
    } else {
        // Out of viewport
        if (x < obj.content.scrollLeft + 30) {
            obj.content.scrollLeft = x;
            if (obj.content.scrollLeft < 50) {
                obj.content.scrollLeft = 0;
            }
        } else if (x < obj.content.scrollLeft + freezed) {
            obj.content.scrollLeft = x - freezed - 1;
        } else {
            obj.content.scrollLeft = x - (w1 - 20);
        }
    }
};

const updateResult = function () {
    const obj = this;

    let total = 0;
    let index = 0;

    // Page 1
    if (obj.options.lazyLoading == true) {
        total = 100;
    } else if (obj.options.pagination > 0) {
        total = obj.options.pagination;
    } else {
        if (obj.results) {
            total = obj.results.length;
        } else {
            total = obj.rows.length;
        }
    }

    // Reset current nodes
    while (obj.tbody.firstChild) {
        obj.tbody.removeChild(obj.tbody.firstChild);
    }

    // Hide all records from the table
    for (let j = 0; j < obj.rows.length; j++) {
        if (!obj.results || obj.results.indexOf(j) > -1) {
            if (index < total) {
                obj.tbody.appendChild(obj.rows[j].element);
                index++;
            }
            obj.rows[j].element.style.display = '';
        } else {
            obj.rows[j].element.style.display = 'none';
        }
    }

    // Update pagination
    if (obj.options.pagination > 0) {
        updatePagination.call(obj);
    }

    updateCornerPosition.call(obj);

    utils_dispatch.call(obj, 'onupdateresult', obj, obj.results);

    return total;
};

/**
 * Get the cell object
 *
 * @param object cell
 * @return string value
 */
const getCell = function (x, y) {
    const obj = this;

    if (typeof x === 'string') {
        // Convert in case name is excel liked ex. A10, BB92
        const cell = getIdFromColumnName(x, true);

        x = cell[0];
        y = cell[1];
    }

    return obj.records[y][x].element;
};

/**
 * Get the cell object from coords
 *
 * @param object cell
 * @return string value
 */
const getCellFromCoords = function (x, y) {
    const obj = this;

    return obj.records[y][x].element;
};

/**
 * Get label
 *
 * @param object cell
 * @return string value
 */
const getLabel = function (x, y) {
    const obj = this;

    if (typeof x === 'string') {
        // Convert in case name is excel liked ex. A10, BB92
        const cell = getIdFromColumnName(x, true);

        x = cell[0];
        y = cell[1];
    }

    return obj.records[y][x].element.innerHTML;
};

/**
 * Activate/Disable fullscreen
 * use programmatically : table.fullscreen(); or table.fullscreen(true); or table.fullscreen(false);
 * @Param {boolean} activate
 */
const fullscreen = function (activate) {
    const spreadsheet = this;

    // If activate not defined, get reverse options.fullscreen
    if (activate == null) {
        activate = !spreadsheet.config.fullscreen;
    }

    // If change
    if (spreadsheet.config.fullscreen != activate) {
        spreadsheet.config.fullscreen = activate;

        // Test LazyLoading conflict
        if (activate == true) {
            spreadsheet.element.classList.add('fullscreen');
        } else {
            spreadsheet.element.classList.remove('fullscreen');
        }
    }
};

/**
 * Show index column
 */
const showIndex = function () {
    const obj = this;

    obj.table.classList.remove('jss_hidden_index');
};

/**
 * Hide index column
 */
const hideIndex = function () {
    const obj = this;

    obj.table.classList.add('jss_hidden_index');
};

/**
 * Create a nested header object
 */
const createNestedHeader = function (nestedInformation) {
    const obj = this;

    const tr = document.createElement('tr');
    tr.classList.add('jss_nested');
    const td = document.createElement('td');
    td.classList.add('jss_selectall');

    tr.appendChild(td);
    // Element
    nestedInformation.element = tr;

    let headerIndex = 0;
    for (let i = 0; i < nestedInformation.length; i++) {
        // Default values
        if (!nestedInformation[i].colspan) {
            nestedInformation[i].colspan = 1;
        }
        if (!nestedInformation[i].title) {
            nestedInformation[i].title = '';
        }
        if (!nestedInformation[i].id) {
            nestedInformation[i].id = '';
        }

        // Number of columns
        let numberOfColumns = nestedInformation[i].colspan;

        // Classes container
        const column = [];
        // Header classes for this cell
        for (let x = 0; x < numberOfColumns; x++) {
            if (obj.options.columns[headerIndex] && obj.options.columns[headerIndex].type == 'hidden') {
                numberOfColumns++;
            }
            column.push(headerIndex);
            headerIndex++;
        }

        // Created the nested cell
        const td = document.createElement('td');
        td.setAttribute('data-column', column.join(','));
        td.setAttribute('colspan', nestedInformation[i].colspan);
        td.setAttribute('align', nestedInformation[i].align || 'center');
        td.setAttribute('id', nestedInformation[i].id);
        td.textContent = nestedInformation[i].title;
        tr.appendChild(td);
    }

    return tr;
};

const getWorksheetActive = function () {
    const spreadsheet = this.parent ? this.parent : this;

    return spreadsheet.element.tabs ? spreadsheet.element.tabs.getActive() : 0;
};

const getWorksheetInstance = function (index) {
    const spreadsheet = this;

    const worksheetIndex = typeof index !== 'undefined' ? index : getWorksheetActive.call(spreadsheet);

    return spreadsheet.worksheets[worksheetIndex];
};

;// ./src/utils/editor.js






/**
 * Open the editor
 *
 * @param object cell
 * @return void
 */
const openEditor = function (cell, empty, e) {
    const obj = this;

    // Get cell position
    const y = cell.getAttribute('data-y');
    const x = cell.getAttribute('data-x');

    // On edition start
    utils_dispatch.call(obj, 'oneditionstart', obj, cell, parseInt(x), parseInt(y));

    // Overflow
    if (x > 0) {
        obj.records[y][x - 1].element.style.overflow = 'hidden';
    }

    // Create editor
    const createEditor = function (type) {
        // Cell information
        const info = cell.getBoundingClientRect();

        // Create dropdown
        const editor = document.createElement(type);
        editor.style.width = info.width + 'px';
        editor.style.height = info.height - 2 + 'px';
        editor.style.minHeight = info.height - 2 + 'px';

        // Edit cell
        cell.classList.add('editor');
        cell.innerHTML = '';
        cell.appendChild(editor);

        return editor;
    };

    // Readonly
    if (cell.classList.contains('readonly') == true) {
        // Do nothing
    } else {
        // Holder
        obj.edition = [obj.records[y][x].element, obj.records[y][x].element.innerHTML, x, y];

        // If there is a custom editor for it
        if (obj.options.columns && obj.options.columns[x] && typeof obj.options.columns[x].type === 'object') {
            // Custom editors
            obj.options.columns[x].type.openEditor(cell, obj.options.data[y][x], parseInt(x), parseInt(y), obj, obj.options.columns[x], e);

            // On edition start
            utils_dispatch.call(obj, 'oncreateeditor', obj, cell, parseInt(x), parseInt(y), null, obj.options.columns[x]);
        } else {
            // Native functions
            if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'hidden') {
                // Do nothing
            } else if (obj.options.columns && obj.options.columns[x] && (obj.options.columns[x].type == 'checkbox' || obj.options.columns[x].type == 'radio')) {
                // Get value
                const value = cell.children[0].checked ? false : true;
                // Toogle value
                obj.setValue(cell, value);
                // Do not keep edition open
                obj.edition = null;
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'dropdown') {
                // Get current value
                let value = obj.options.data[y][x];
                if (obj.options.columns[x].multiple && !Array.isArray(value)) {
                    value = value.split(';');
                }

                // Create dropdown
                let source;

                if (typeof obj.options.columns[x].filter == 'function') {
                    source = obj.options.columns[x].filter(obj.element, cell, x, y, obj.options.columns[x].source);
                } else {
                    source = obj.options.columns[x].source;
                }

                // Do not change the original source
                const data = [];
                if (source) {
                    for (let j = 0; j < source.length; j++) {
                        data.push(source[j]);
                    }
                }

                // Create editor
                const editor = createEditor('div');

                // On edition start
                utils_dispatch.call(obj, 'oncreateeditor', obj, cell, parseInt(x), parseInt(y), null, obj.options.columns[x]);

                const options = {
                    data: data,
                    multiple: obj.options.columns[x].multiple ? true : false,
                    autocomplete: obj.options.columns[x].autocomplete ? true : false,
                    opened: true,
                    value: value,
                    width: '100%',
                    height: editor.style.minHeight,
                    position: obj.options.tableOverflow == true || obj.parent.config.fullscreen == true ? true : false,
                    onclose: function () {
                        closeEditor.call(obj, cell, true);
                    },
                };
                if (obj.options.columns[x].options && obj.options.columns[x].options.type) {
                    options.type = obj.options.columns[x].options.type;
                }
                __WEBPACK_EXTERNAL_MODULE_jsuites_default__.dropdown(editor, options);
            } else if (obj.options.columns && obj.options.columns[x] && (obj.options.columns[x].type == 'calendar' || obj.options.columns[x].type == 'color')) {
                // Value
                const value = obj.options.data[y][x];
                // Create editor
                const editor = createEditor('input');

                utils_dispatch.call(obj, 'oncreateeditor', obj, cell, parseInt(x), parseInt(y), null, obj.options.columns[x]);

                editor.value = value;

                const options = obj.options.columns[x].options ? { ...obj.options.columns[x].options } : {};

                if (obj.options.tableOverflow == true || obj.parent.config.fullscreen == true) {
                    options.position = true;
                }
                options.value = obj.options.data[y][x];
                options.opened = true;
                options.onclose = function (el, value) {
                    closeEditor.call(obj, cell, true);
                };
                // Current value
                if (obj.options.columns[x].type == 'color') {
                    __WEBPACK_EXTERNAL_MODULE_jsuites_default__.color(editor, options);

                    const rect = cell.getBoundingClientRect();

                    if (options.position) {
                        editor.nextSibling.children[1].style.top = rect.top + rect.height + 'px';
                        editor.nextSibling.children[1].style.left = rect.left + 'px';
                    }
                } else {
                    if (!options.format) {
                        options.format = 'YYYY-MM-DD';
                    }

                    __WEBPACK_EXTERNAL_MODULE_jsuites_default__.calendar(editor, options);
                }
                // Focus on editor
                editor.focus();
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'html') {
                const value = obj.options.data[y][x];
                // Create editor
                const editor = createEditor('div');

                utils_dispatch.call(obj, 'oncreateeditor', obj, cell, parseInt(x), parseInt(y), null, obj.options.columns[x]);

                editor.style.position = 'relative';
                const div = document.createElement('div');
                div.classList.add('jss_richtext');
                editor.appendChild(div);
                __WEBPACK_EXTERNAL_MODULE_jsuites_default__.editor(div, {
                    focus: true,
                    value: value,
                });
                const rect = cell.getBoundingClientRect();
                const rectContent = div.getBoundingClientRect();
                if (window.innerHeight < rect.bottom + rectContent.height) {
                    div.style.top = rect.bottom - (rectContent.height + 2) + 'px';
                } else {
                    div.style.top = rect.top + 'px';
                }

                if (window.innerWidth < rect.left + rectContent.width) {
                    div.style.left = rect.right - (rectContent.width + 2) + 'px';
                } else {
                    div.style.left = rect.left + 'px';
                }
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'image') {
                // Value
                const img = cell.children[0];
                // Create editor
                const editor = createEditor('div');

                utils_dispatch.call(obj, 'oncreateeditor', obj, cell, parseInt(x), parseInt(y), null, obj.options.columns[x]);

                editor.style.position = 'relative';
                const div = document.createElement('div');
                div.classList.add('jclose');
                if (img && img.src) {
                    div.appendChild(img);
                }
                editor.appendChild(div);
                __WEBPACK_EXTERNAL_MODULE_jsuites_default__.image(div, obj.options.columns[x]);
                const rect = cell.getBoundingClientRect();
                const rectContent = div.getBoundingClientRect();
                if (window.innerHeight < rect.bottom + rectContent.height) {
                    div.style.top = rect.top - (rectContent.height + 2) + 'px';
                } else {
                    div.style.top = rect.top + 'px';
                }

                div.style.left = rect.left + 'px';
            } else {
                // Value
                const value = empty == true ? '' : obj.options.data[y][x];

                // Basic editor
                let editor;

                if (
                    (!obj.options.columns || !obj.options.columns[x] || obj.options.columns[x].wordWrap != false) &&
                    (obj.options.wordWrap == true || (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].wordWrap == true))
                ) {
                    editor = createEditor('textarea');
                } else {
                    editor = createEditor('input');
                }

                utils_dispatch.call(obj, 'oncreateeditor', obj, cell, parseInt(x), parseInt(y), null, obj.options.columns[x]);

                editor.focus();
                editor.value = value;

                // Column options
                const options = obj.options.columns && obj.options.columns[x];

                // Apply format when is not a formula
                if (!isFormula(value)) {
                    if (options) {
                        // Format
                        const opt = getMask(options);

                        if (opt) {
                            // Masking
                            if (!options.disabledMaskOnEdition) {
                                if (options.mask) {
                                    const m = options.mask.split(';');
                                    editor.setAttribute('data-mask', m[0]);
                                } else if (options.locale) {
                                    editor.setAttribute('data-locale', options.locale);
                                }
                            }
                            // Input
                            opt.input = editor;
                            // Configuration
                            editor.mask = opt;
                            // Do not treat the decimals
                            __WEBPACK_EXTERNAL_MODULE_jsuites_default__.mask.render(value, opt, false);
                        }
                    }
                }

                editor.onblur = function () {
                    closeEditor.call(obj, cell, true);
                };
                editor.scrollLeft = editor.scrollWidth;
            }
        }
    }
};

/**
 * Close the editor and save the information
 *
 * @param object cell
 * @param boolean save
 * @return void
 */
const closeEditor = function (cell, save) {
    const obj = this;

    const x = parseInt(cell.getAttribute('data-x'));
    const y = parseInt(cell.getAttribute('data-y'));

    let value;

    // Get cell properties
    if (save == true) {
        // If custom editor
        if (obj.options.columns && obj.options.columns[x] && typeof obj.options.columns[x].type === 'object') {
            // Custom editor
            value = obj.options.columns[x].type.closeEditor(cell, save, parseInt(x), parseInt(y), obj, obj.options.columns[x]);
        } else {
            // Native functions
            if (
                obj.options.columns &&
                obj.options.columns[x] &&
                (obj.options.columns[x].type == 'checkbox' || obj.options.columns[x].type == 'radio' || obj.options.columns[x].type == 'hidden')
            ) {
                // Do nothing
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'dropdown') {
                value = cell.children[0].dropdown.close(true);
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'calendar') {
                value = cell.children[0].calendar.close(true);
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'color') {
                value = cell.children[0].color.close(true);
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'html') {
                value = cell.children[0].children[0].editor.getData();
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'image') {
                const img = cell.children[0].children[0].children[0];
                value = img && img.tagName == 'IMG' ? img.src : '';
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'numeric') {
                value = cell.children[0].value;
                if (('' + value).substr(0, 1) != '=') {
                    if (value == '') {
                        value = obj.options.columns[x].allowEmpty ? '' : 0;
                    }
                }
                cell.children[0].onblur = null;
            } else {
                value = cell.children[0].value;
                cell.children[0].onblur = null;

                // Column options
                const options = obj.options.columns && obj.options.columns[x];

                if (options) {
                    // Format
                    const opt = getMask(options);
                    if (opt) {
                        // Keep numeric in the raw data
                        if (value !== '' && !isFormula(value) && typeof value !== 'number') {
                            const t = __WEBPACK_EXTERNAL_MODULE_jsuites_default__.mask.extract(value, opt, true);
                            if (t && t.value !== '') {
                                value = t.value;
                            }
                        }
                    }
                }
            }
        }

        // Ignore changes if the value is the same
        if (obj.options.data[y][x] == value) {
            cell.innerHTML = obj.edition[1];
        } else {
            obj.setValue(cell, value);
        }
    } else {
        if (obj.options.columns && obj.options.columns[x] && typeof obj.options.columns[x].type === 'object') {
            // Custom editor
            obj.options.columns[x].type.closeEditor(cell, save, parseInt(x), parseInt(y), obj, obj.options.columns[x]);
        } else {
            if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'dropdown') {
                cell.children[0].dropdown.close(true);
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'calendar') {
                cell.children[0].calendar.close(true);
            } else if (obj.options.columns && obj.options.columns[x] && obj.options.columns[x].type == 'color') {
                cell.children[0].color.close(true);
            } else {
                cell.children[0].onblur = null;
            }
        }

        // Restore value
        cell.innerHTML = obj.edition && obj.edition[1] ? obj.edition[1] : '';
    }

    // On edition end
    utils_dispatch.call(obj, 'oneditionend', obj, cell, x, y, value, save);

    // Remove editor class
    cell.classList.remove('editor');

    // Finish edition
    obj.edition = null;
};

/**
 * Toogle
 */
const setCheckRadioValue = function () {
    const obj = this;

    const records = [];
    const keys = Object.keys(obj.highlighted);
    for (let i = 0; i < keys.length; i++) {
        const x = obj.highlighted[i].element.getAttribute('data-x');
        const y = obj.highlighted[i].element.getAttribute('data-y');

        if (obj.options.columns[x].type == 'checkbox' || obj.options.columns[x].type == 'radio') {
            // Update cell
            records.push(updateCell.call(obj, x, y, !obj.options.data[y][x]));
        }
    }

    if (records.length) {
        // Update history
        setHistory.call(obj, {
            action: 'setValue',
            records: records,
            selection: obj.selectedCell,
        });

        // On after changes
        const onafterchangesRecords = records.map(function (record) {
            return {
                x: record.x,
                y: record.y,
                value: record.value,
                oldValue: record.oldValue,
            };
        });

        utils_dispatch.call(obj, 'onafterchanges', obj, onafterchangesRecords);
    }
};

;// ./src/utils/keys.js



const upGet = function (x, y) {
    const obj = this;

    x = parseInt(x);
    y = parseInt(y);
    for (let j = y - 1; j >= 0; j--) {
        if (obj.records[j][x].element.style.display != 'none' && obj.rows[j].element.style.display != 'none') {
            if (obj.records[j][x].element.getAttribute('data-merged')) {
                if (obj.records[j][x].element == obj.records[y][x].element) {
                    continue;
                }
            }
            y = j;
            break;
        }
    }

    return y;
};

const upVisible = function (group, direction) {
    const obj = this;

    let x, y;

    if (group == 0) {
        x = parseInt(obj.selectedCell[0]);
        y = parseInt(obj.selectedCell[1]);
    } else {
        x = parseInt(obj.selectedCell[2]);
        y = parseInt(obj.selectedCell[3]);
    }

    if (direction == 0) {
        for (let j = 0; j < y; j++) {
            if (obj.records[j][x].element.style.display != 'none' && obj.rows[j].element.style.display != 'none') {
                y = j;
                break;
            }
        }
    } else {
        y = upGet.call(obj, x, y);
    }

    if (group == 0) {
        obj.selectedCell[0] = x;
        obj.selectedCell[1] = y;
    } else {
        obj.selectedCell[2] = x;
        obj.selectedCell[3] = y;
    }
};

const up = function (shiftKey, ctrlKey) {
    const obj = this;

    if (shiftKey) {
        if (obj.selectedCell[3] > 0) {
            upVisible.call(obj, 1, ctrlKey ? 0 : 1);
        }
    } else {
        if (obj.selectedCell[1] > 0) {
            upVisible.call(obj, 0, ctrlKey ? 0 : 1);
        }
        obj.selectedCell[2] = obj.selectedCell[0];
        obj.selectedCell[3] = obj.selectedCell[1];
    }

    // Update selection
    obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);

    // Change page
    if (obj.options.lazyLoading == true) {
        if (obj.selectedCell[1] == 0 || obj.selectedCell[3] == 0) {
            loadPage.call(obj, 0);
            obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
        } else {
            if (loadValidation.call(obj)) {
                obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
            } else {
                const item = parseInt(obj.tbody.firstChild.getAttribute('data-y'));
                if (obj.selectedCell[1] - item < 30) {
                    loadUp.call(obj);
                    obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
                }
            }
        }
    } else if (obj.options.pagination > 0) {
        const pageNumber = obj.whichPage(obj.selectedCell[3]);
        if (pageNumber != obj.pageNumber) {
            obj.page(pageNumber);
        }
    }

    updateScroll.call(obj, 1);
};

const rightGet = function (x, y) {
    const obj = this;

    x = parseInt(x);
    y = parseInt(y);

    for (let i = x + 1; i < obj.headers.length; i++) {
        if (obj.records[y][i].element.style.display != 'none') {
            if (obj.records[y][i].element.getAttribute('data-merged')) {
                if (obj.records[y][i].element == obj.records[y][x].element) {
                    continue;
                }
            }
            x = i;
            break;
        }
    }

    return x;
};

const rightVisible = function (group, direction) {
    const obj = this;

    let x, y;

    if (group == 0) {
        x = parseInt(obj.selectedCell[0]);
        y = parseInt(obj.selectedCell[1]);
    } else {
        x = parseInt(obj.selectedCell[2]);
        y = parseInt(obj.selectedCell[3]);
    }

    if (direction == 0) {
        for (let i = obj.headers.length - 1; i > x; i--) {
            if (obj.records[y][i].element.style.display != 'none') {
                x = i;
                break;
            }
        }
    } else {
        x = rightGet.call(obj, x, y);
    }

    if (group == 0) {
        obj.selectedCell[0] = x;
        obj.selectedCell[1] = y;
    } else {
        obj.selectedCell[2] = x;
        obj.selectedCell[3] = y;
    }
};

const right = function (shiftKey, ctrlKey) {
    const obj = this;

    if (shiftKey) {
        if (obj.selectedCell[2] < obj.headers.length - 1) {
            rightVisible.call(obj, 1, ctrlKey ? 0 : 1);
        }
    } else {
        if (obj.selectedCell[0] < obj.headers.length - 1) {
            rightVisible.call(obj, 0, ctrlKey ? 0 : 1);
        }
        obj.selectedCell[2] = obj.selectedCell[0];
        obj.selectedCell[3] = obj.selectedCell[1];
    }

    obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
    updateScroll.call(obj, 2);
};

const downGet = function (x, y) {
    const obj = this;

    x = parseInt(x);
    y = parseInt(y);
    for (let j = y + 1; j < obj.rows.length; j++) {
        if (obj.records[j][x].element.style.display != 'none' && obj.rows[j].element.style.display != 'none') {
            if (obj.records[j][x].element.getAttribute('data-merged')) {
                if (obj.records[j][x].element == obj.records[y][x].element) {
                    continue;
                }
            }
            y = j;
            break;
        }
    }

    return y;
};

const downVisible = function (group, direction) {
    const obj = this;

    let x, y;

    if (group == 0) {
        x = parseInt(obj.selectedCell[0]);
        y = parseInt(obj.selectedCell[1]);
    } else {
        x = parseInt(obj.selectedCell[2]);
        y = parseInt(obj.selectedCell[3]);
    }

    if (direction == 0) {
        for (let j = obj.rows.length - 1; j > y; j--) {
            if (obj.records[j][x].element.style.display != 'none' && obj.rows[j].element.style.display != 'none') {
                y = j;
                break;
            }
        }
    } else {
        y = downGet.call(obj, x, y);
    }

    if (group == 0) {
        obj.selectedCell[0] = x;
        obj.selectedCell[1] = y;
    } else {
        obj.selectedCell[2] = x;
        obj.selectedCell[3] = y;
    }
};

const down = function (shiftKey, ctrlKey) {
    const obj = this;

    if (shiftKey) {
        if (obj.selectedCell[3] < obj.records.length - 1) {
            downVisible.call(obj, 1, ctrlKey ? 0 : 1);
        }
    } else {
        if (obj.selectedCell[1] < obj.records.length - 1) {
            downVisible.call(obj, 0, ctrlKey ? 0 : 1);
        }
        obj.selectedCell[2] = obj.selectedCell[0];
        obj.selectedCell[3] = obj.selectedCell[1];
    }

    obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);

    // Change page
    if (obj.options.lazyLoading == true) {
        if (obj.selectedCell[1] == obj.records.length - 1 || obj.selectedCell[3] == obj.records.length - 1) {
            loadPage.call(obj, -1);
            obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
        } else {
            if (loadValidation.call(obj)) {
                obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
            } else {
                const item = parseInt(obj.tbody.lastChild.getAttribute('data-y'));
                if (item - obj.selectedCell[3] < 30) {
                    loadDown.call(obj);
                    obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
                }
            }
        }
    } else if (obj.options.pagination > 0) {
        const pageNumber = obj.whichPage(obj.selectedCell[3]);
        if (pageNumber != obj.pageNumber) {
            obj.page(pageNumber);
        }
    }

    updateScroll.call(obj, 3);
};

const leftGet = function (x, y) {
    const obj = this;

    x = parseInt(x);
    y = parseInt(y);
    for (let i = x - 1; i >= 0; i--) {
        if (obj.records[y][i].element.style.display != 'none') {
            if (obj.records[y][i].element.getAttribute('data-merged')) {
                if (obj.records[y][i].element == obj.records[y][x].element) {
                    continue;
                }
            }
            x = i;
            break;
        }
    }

    return x;
};

const leftVisible = function (group, direction) {
    const obj = this;

    let x, y;

    if (group == 0) {
        x = parseInt(obj.selectedCell[0]);
        y = parseInt(obj.selectedCell[1]);
    } else {
        x = parseInt(obj.selectedCell[2]);
        y = parseInt(obj.selectedCell[3]);
    }

    if (direction == 0) {
        for (let i = 0; i < x; i++) {
            if (obj.records[y][i].element.style.display != 'none') {
                x = i;
                break;
            }
        }
    } else {
        x = leftGet.call(obj, x, y);
    }

    if (group == 0) {
        obj.selectedCell[0] = x;
        obj.selectedCell[1] = y;
    } else {
        obj.selectedCell[2] = x;
        obj.selectedCell[3] = y;
    }
};

const left = function (shiftKey, ctrlKey) {
    const obj = this;

    if (shiftKey) {
        if (obj.selectedCell[2] > 0) {
            leftVisible.call(obj, 1, ctrlKey ? 0 : 1);
        }
    } else {
        if (obj.selectedCell[0] > 0) {
            leftVisible.call(obj, 0, ctrlKey ? 0 : 1);
        }
        obj.selectedCell[2] = obj.selectedCell[0];
        obj.selectedCell[3] = obj.selectedCell[1];
    }

    obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
    updateScroll.call(obj, 0);
};

const first = function (shiftKey, ctrlKey) {
    const obj = this;

    if (shiftKey) {
        if (ctrlKey) {
            obj.selectedCell[3] = 0;
        } else {
            leftVisible.call(obj, 1, 0);
        }
    } else {
        if (ctrlKey) {
            obj.selectedCell[1] = 0;
        } else {
            leftVisible.call(obj, 0, 0);
        }
        obj.selectedCell[2] = obj.selectedCell[0];
        obj.selectedCell[3] = obj.selectedCell[1];
    }

    // Change page
    if (obj.options.lazyLoading == true && (obj.selectedCell[1] == 0 || obj.selectedCell[3] == 0)) {
        loadPage.call(obj, 0);
    } else if (obj.options.pagination > 0) {
        const pageNumber = obj.whichPage(obj.selectedCell[3]);
        if (pageNumber != obj.pageNumber) {
            obj.page(pageNumber);
        }
    }

    obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
    updateScroll.call(obj, 1);
};

const last = function (shiftKey, ctrlKey) {
    const obj = this;

    if (shiftKey) {
        if (ctrlKey) {
            obj.selectedCell[3] = obj.records.length - 1;
        } else {
            rightVisible.call(obj, 1, 0);
        }
    } else {
        if (ctrlKey) {
            obj.selectedCell[1] = obj.records.length - 1;
        } else {
            rightVisible.call(obj, 0, 0);
        }
        obj.selectedCell[2] = obj.selectedCell[0];
        obj.selectedCell[3] = obj.selectedCell[1];
    }

    // Change page
    if (obj.options.lazyLoading == true && (obj.selectedCell[1] == obj.records.length - 1 || obj.selectedCell[3] == obj.records.length - 1)) {
        loadPage.call(obj, -1);
    } else if (obj.options.pagination > 0) {
        const pageNumber = obj.whichPage(obj.selectedCell[3]);
        if (pageNumber != obj.pageNumber) {
            obj.page(pageNumber);
        }
    }

    obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
    updateScroll.call(obj, 3);
};

;// ./src/utils/copyPaste.js










/**
 * Copy method
 *
 * @param bool highlighted - Get only highlighted cells
 * @param delimiter - \t default to keep compatibility with excel
 * @return string value
 */
const copy = function (highlighted, delimiter, returnData, includeHeaders, download, isCut, processed) {
    const obj = this;

    if (!delimiter) {
        delimiter = '\t';
    }

    const div = new RegExp(delimiter, 'ig');

    // Controls
    const header = [];
    let col = [];
    let colLabel = [];
    const row = [];
    const rowLabel = [];
    const x = obj.options.data[0].length;
    const y = obj.options.data.length;
    let tmp = '';
    let copyHeader = false;
    let headers = '';
    let nestedHeaders = '';
    let numOfCols = 0;
    let numOfRows = 0;

    // Partial copy
    let copyX = 0;
    let copyY = 0;
    let isPartialCopy = true;
    // Go through the columns to get the data
    for (let j = 0; j < y; j++) {
        for (let i = 0; i < x; i++) {
            // If cell is highlighted
            if (!highlighted || obj.records[j][i].element.classList.contains('highlight')) {
                if (copyX <= i) {
                    copyX = i;
                }
                if (copyY <= j) {
                    copyY = j;
                }
            }
        }
    }
    if (x === copyX + 1 && y === copyY + 1) {
        isPartialCopy = false;
    }

    if (download && (obj.parent.config.includeHeadersOnDownload == true || includeHeaders)) {
        // Nested headers
        if (obj.options.nestedHeaders && obj.options.nestedHeaders.length > 0) {
            tmp = obj.options.nestedHeaders;

            for (let j = 0; j < tmp.length; j++) {
                const nested = [];
                for (let i = 0; i < tmp[j].length; i++) {
                    const colspan = parseInt(tmp[j][i].colspan);
                    nested.push(tmp[j][i].title);
                    for (let c = 0; c < colspan - 1; c++) {
                        nested.push('');
                    }
                }
                nestedHeaders += nested.join(delimiter) + '\r\n';
            }
        }

        copyHeader = true;
    }

    // Reset container
    obj.style = [];

    // Go through the columns to get the data
    for (let j = 0; j < y; j++) {
        col = [];
        colLabel = [];

        for (let i = 0; i < x; i++) {
            // If cell is highlighted
            if (!highlighted || obj.records[j][i].element.classList.contains('highlight')) {
                if (copyHeader == true) {
                    header.push(obj.headers[i].textContent);
                }
                // Values
                let value = obj.options.data[j][i];
                if (value.match && (value.match(div) || value.match(/,/g) || value.match(/\n/) || value.match(/"/))) {
                    value = value.replace(new RegExp('"', 'g'), '""');
                    value = '"' + value + '"';
                }
                col.push(value);

                // Labels
                let label;

                if (obj.options.columns && obj.options.columns[i] && (obj.options.columns[i].type == 'checkbox' || obj.options.columns[i].type == 'radio')) {
                    label = value;
                } else {
                    label = obj.records[j][i].element.innerHTML;
                    if (label.match && (label.match(div) || label.match(/,/g) || label.match(/\n/) || label.match(/"/))) {
                        // Scape double quotes
                        label = label.replace(new RegExp('"', 'g'), '""');
                        label = '"' + label + '"';
                    }
                }
                colLabel.push(label);

                // Get style
                tmp = obj.records[j][i].element.getAttribute('style');
                tmp = tmp.replace('display: none;', '');
                obj.style.push(tmp ? tmp : '');
            }
        }

        if (col.length) {
            if (copyHeader) {
                numOfCols = col.length;
                row.push(header.join(delimiter));
            }
            row.push(col.join(delimiter));
        }
        if (colLabel.length) {
            numOfRows++;
            if (copyHeader) {
                rowLabel.push(header.join(delimiter));
                copyHeader = false;
            }
            rowLabel.push(colLabel.join(delimiter));
        }
    }

    if (x == numOfCols && y == numOfRows) {
        headers = nestedHeaders;
    }

    // Final string
    const str = headers + row.join('\r\n');
    let strLabel = headers + rowLabel.join('\r\n');

    // Create a hidden textarea to copy the values
    if (!returnData) {
        // Paste event
        const selectedRange = [
            Math.min(obj.selectedCell[0], obj.selectedCell[2]),
            Math.min(obj.selectedCell[1], obj.selectedCell[3]),
            Math.max(obj.selectedCell[0], obj.selectedCell[2]),
            Math.max(obj.selectedCell[1], obj.selectedCell[3]),
        ];

        const result = utils_dispatch.call(obj, 'oncopy', obj, selectedRange, strLabel, isCut);

        if (result) {
            strLabel = result;
        } else if (result === false) {
            return false;
        }

        obj.textarea.value = strLabel;
        obj.textarea.select();
        document.execCommand('copy');
    }

    // Keep data
    if (processed == true) {
        obj.data = strLabel;
    } else {
        obj.data = str;
    }
    // Keep non visible information
    obj.hashString = hash.call(obj, obj.data);

    // Any exiting border should go
    if (!returnData) {
        removeCopyingSelection.call(obj);

        // Border
        if (obj.highlighted) {
            for (let i = 0; i < obj.highlighted.length; i++) {
                obj.highlighted[i].element.classList.add('copying');
                if (obj.highlighted[i].element.classList.contains('highlight-left')) {
                    obj.highlighted[i].element.classList.add('copying-left');
                }
                if (obj.highlighted[i].element.classList.contains('highlight-right')) {
                    obj.highlighted[i].element.classList.add('copying-right');
                }
                if (obj.highlighted[i].element.classList.contains('highlight-top')) {
                    obj.highlighted[i].element.classList.add('copying-top');
                }
                if (obj.highlighted[i].element.classList.contains('highlight-bottom')) {
                    obj.highlighted[i].element.classList.add('copying-bottom');
                }
            }
        }
    }

    return obj.data;
};

/**
 * Jspreadsheet paste method
 *
 * @param x target column
 * @param y target row
 * @param data paste data. if data hash is the same as the copied data, apply style from copied cells
 * @return string value
 */
const paste = function (x, y, data) {
    const obj = this;

    // Controls
    const dataHash = hash(data);
    let style = dataHash == obj.hashString ? obj.style : null;

    // Depending on the behavior
    if (dataHash == obj.hashString) {
        data = obj.data;
    }

    // Split new line
    data = parseCSV(data, '\t');

    const ex = obj.selectedCell[2];
    const ey = obj.selectedCell[3];

    const w = ex - x + 1;
    const h = ey - y + 1;

    // Modify data to allow wor extending paste range in multiples of input range
    const srcW = data[0].length;
    if ((w > 1) & Number.isInteger(w / srcW)) {
        const repeats = w / srcW;
        if (style) {
            const newStyle = [];
            for (let i = 0; i < style.length; i += srcW) {
                const chunk = style.slice(i, i + srcW);
                for (let j = 0; j < repeats; j++) {
                    newStyle.push(...chunk);
                }
            }
            style = newStyle;
        }

        const arrayB = data.map(function (row, i) {
            const arrayC = Array.apply(null, { length: repeats * row.length }).map(function (e, i) {
                return row[i % row.length];
            });
            return arrayC;
        });
        data = arrayB;
    }
    const srcH = data.length;
    if ((h > 1) & Number.isInteger(h / srcH)) {
        const repeats = h / srcH;
        if (style) {
            const newStyle = [];
            for (let j = 0; j < repeats; j++) {
                newStyle.push(...style);
            }
            style = newStyle;
        }
        const arrayB = Array.apply(null, { length: repeats * srcH }).map(function (e, i) {
            return data[i % srcH];
        });
        data = arrayB;
    }

    // Paste filter
    const ret = utils_dispatch.call(
        obj,
        'onbeforepaste',
        obj,
        data.map(function (row) {
            return row.map(function (item) {
                return { value: item };
            });
        }),
        x,
        y
    );

    if (ret === false) {
        return false;
    } else if (ret) {
        data = ret;
    }

    if (x != null && y != null && data) {
        // Records
        let i = 0;
        let j = 0;
        const records = [];
        const newStyle = {};
        const oldStyle = {};
        let styleIndex = 0;

        // Index
        let colIndex = parseInt(x);
        let rowIndex = parseInt(y);
        let row = null;

        const hiddenColCount = obj.headers.slice(colIndex).filter((x) => x.style.display === 'none').length;
        const expandedColCount = colIndex + hiddenColCount + data[0].length;
        const currentColCount = obj.headers.length;
        if (expandedColCount > currentColCount) {
            obj.skipUpdateTableReferences = true;
            obj.insertColumn(expandedColCount - currentColCount);
        }
        const hiddenRowCount = obj.rows.slice(rowIndex).filter((x) => x.element.style.display === 'none').length;
        const expandedRowCount = rowIndex + hiddenRowCount + data.length;
        const currentRowCount = obj.rows.length;
        if (expandedRowCount > currentRowCount) {
            obj.skipUpdateTableReferences = true;
            obj.insertRow(expandedRowCount - currentRowCount);
        }

        if (obj.skipUpdateTableReferences) {
            obj.skipUpdateTableReferences = false;
            updateTableReferences.call(obj);
        }

        // Go through the columns to get the data
        while ((row = data[j])) {
            i = 0;
            colIndex = parseInt(x);

            while (row[i] != null) {
                let value = row[i];

                if (obj.options.columns && obj.options.columns[i] && obj.options.columns[i].type == 'calendar') {
                    value = __WEBPACK_EXTERNAL_MODULE_jsuites_default__.calendar.extractDateFromString(
                        value,
                        (obj.options.columns[i].options && obj.options.columns[i].options.format) || 'YYYY-MM-DD'
                    );
                }

                // Update and keep history
                const record = updateCell.call(obj, colIndex, rowIndex, value);
                // Keep history
                records.push(record);
                // Update all formulas in the chain
                updateFormulaChain.call(obj, colIndex, rowIndex, records);
                // Style
                if (style && style[styleIndex]) {
                    const columnName = getColumnNameFromId([colIndex, rowIndex]);
                    newStyle[columnName] = style[styleIndex];
                    oldStyle[columnName] = obj.getStyle(columnName);
                    obj.records[rowIndex][colIndex].element.setAttribute('style', style[styleIndex]);
                    styleIndex++;
                }
                i++;
                if (row[i] != null) {
                    if (colIndex >= obj.headers.length - 1) {
                        // If the pasted column is out of range, create it if possible
                        if (obj.options.allowInsertColumn != false) {
                            obj.insertColumn();
                            // Otherwise skip the pasted data that overflows
                        } else {
                            break;
                        }
                    }
                    colIndex = rightGet.call(obj, colIndex, rowIndex);
                }
            }

            j++;
            if (data[j]) {
                if (rowIndex >= obj.rows.length - 1) {
                    // If the pasted row is out of range, create it if possible
                    if (obj.options.allowInsertRow != false) {
                        obj.insertRow();
                        // Otherwise skip the pasted data that overflows
                    } else {
                        break;
                    }
                }
                rowIndex = downGet.call(obj, x, rowIndex);
            }
        }

        // Select the new cells
        updateSelectionFromCoords.call(obj, x, y, colIndex, rowIndex);

        // Update history
        setHistory.call(obj, {
            action: 'setValue',
            records: records,
            selection: obj.selectedCell,
            newStyle: newStyle,
            oldStyle: oldStyle,
        });

        // Update table
        updateTable.call(obj);

        // Paste event
        const eventRecords = [];

        for (let j = 0; j < data.length; j++) {
            for (let i = 0; i < data[j].length; i++) {
                eventRecords.push({
                    x: i + x,
                    y: j + y,
                    value: data[j][i],
                });
            }
        }

        utils_dispatch.call(obj, 'onpaste', obj, eventRecords);

        // On after changes
        const onafterchangesRecords = records.map(function (record) {
            return {
                x: record.x,
                y: record.y,
                value: record.value,
                oldValue: record.oldValue,
            };
        });

        utils_dispatch.call(obj, 'onafterchanges', obj, onafterchangesRecords);
    }

    removeCopyingSelection();
};

;// ./src/utils/columns.js










const getNumberOfColumns = function () {
    const obj = this;

    let numberOfColumns = (obj.options.columns && obj.options.columns.length) || 0;

    if (obj.options.data && typeof obj.options.data[0] !== 'undefined') {
        // Data keys
        const keys = Object.keys(obj.options.data[0]);

        if (keys.length > numberOfColumns) {
            numberOfColumns = keys.length;
        }
    }

    if (obj.options.minDimensions && obj.options.minDimensions[0] > numberOfColumns) {
        numberOfColumns = obj.options.minDimensions[0];
    }

    return numberOfColumns;
};

const createCellHeader = function (colNumber) {
    const obj = this;

    // Create col global control
    const colWidth = (obj.options.columns && obj.options.columns[colNumber] && obj.options.columns[colNumber].width) || obj.options.defaultColWidth || 100;
    const colAlign = (obj.options.columns && obj.options.columns[colNumber] && obj.options.columns[colNumber].align) || obj.options.defaultColAlign || 'center';

    // Create header cell
    obj.headers[colNumber] = document.createElement('td');
    obj.headers[colNumber].textContent =
        (obj.options.columns && obj.options.columns[colNumber] && obj.options.columns[colNumber].title) || getColumnName(colNumber);

    obj.headers[colNumber].setAttribute('data-x', colNumber);
    obj.headers[colNumber].style.textAlign = colAlign;
    if (obj.options.columns && obj.options.columns[colNumber] && obj.options.columns[colNumber].title) {
        obj.headers[colNumber].setAttribute('title', obj.headers[colNumber].innerText);
    }
    if (obj.options.columns && obj.options.columns[colNumber] && obj.options.columns[colNumber].id) {
        obj.headers[colNumber].setAttribute('id', obj.options.columns[colNumber].id);
    }

    // Width control
    const colElement = document.createElement('col');
    colElement.setAttribute('width', colWidth);

    obj.cols[colNumber] = {
        colElement,
        x: colNumber,
    };

    // Hidden column
    if (obj.options.columns && obj.options.columns[colNumber] && obj.options.columns[colNumber].type == 'hidden') {
        obj.headers[colNumber].style.display = 'none';
        colElement.style.display = 'none';
    }
};

/**
 * Insert a new column
 *
 * @param mixed - num of columns to be added or data to be added in one single column
 * @param int columnNumber - number of columns to be created
 * @param bool insertBefore
 * @param object properties - column properties
 * @return void
 */
const insertColumn = function (mixed, columnNumber, insertBefore, properties) {
    const obj = this;

    // Configuration
    if (obj.options.allowInsertColumn != false) {
        // Records
        var records = [];

        // Data to be insert
        let data = [];

        // The insert could be lead by number of rows or the array of data
        let numOfColumns;
        if (!Array.isArray(mixed)) {
            numOfColumns = typeof mixed === 'number' ? mixed : 1;
        } else {
            numOfColumns = 1;

            if (mixed) {
                data = mixed;
            }
        }

        // Direction
        insertBefore = insertBefore ? true : false;

        // Current column number
        const currentNumOfColumns = Math.max(
            obj.options.columns.length,
            ...obj.options.data.map(function (row) {
                return row.length;
            })
        );

        const lastColumn = currentNumOfColumns - 1;

        // Confirm position
        if (columnNumber == undefined || columnNumber >= parseInt(lastColumn) || columnNumber < 0) {
            columnNumber = lastColumn;
        }

        // Create default properties
        if (!properties) {
            properties = [];
        }

        for (let i = 0; i < numOfColumns; i++) {
            if (!properties[i]) {
                properties[i] = {};
            }
        }

        const columns = [];

        if (!Array.isArray(mixed)) {
            for (let i = 0; i < mixed; i++) {
                const column = {
                    column: columnNumber + i + (insertBefore ? 0 : 1),
                    options: Object.assign({}, properties[i]),
                };

                columns.push(column);
            }
        } else {
            const data = [];

            for (let i = 0; i < obj.options.data.length; i++) {
                data.push(i < mixed.length ? mixed[i] : '');
            }

            const column = {
                column: columnNumber + (insertBefore ? 0 : 1),
                options: Object.assign({}, properties[0]),
                data,
            };

            columns.push(column);
        }

        // Onbeforeinsertcolumn
        if (utils_dispatch.call(obj, 'onbeforeinsertcolumn', obj, columns) === false) {
            return false;
        }

        // Merged cells
        if (obj.options.mergeCells && Object.keys(obj.options.mergeCells).length > 0) {
            if (isColMerged.call(obj, columnNumber, insertBefore).length) {
                if (!confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('This action will destroy any existing merged cells. Are you sure?'))) {
                    return false;
                } else {
                    obj.destroyMerge();
                }
            }
        }

        // Insert before
        const columnIndex = !insertBefore ? columnNumber + 1 : columnNumber;
        obj.options.columns = injectArray(obj.options.columns, columnIndex, properties);

        // Open space in the containers
        const currentHeaders = obj.headers.splice(columnIndex);
        const currentColgroup = obj.cols.splice(columnIndex);

        // History
        const historyHeaders = [];
        const historyColgroup = [];
        const historyRecords = [];
        const historyData = [];
        const historyFooters = [];

        // Add new headers
        for (let col = columnIndex; col < numOfColumns + columnIndex; col++) {
            createCellHeader.call(obj, col);
            obj.headerContainer.insertBefore(obj.headers[col], obj.headerContainer.children[col + 1]);
            obj.colgroupContainer.insertBefore(obj.cols[col].colElement, obj.colgroupContainer.children[col + 1]);

            historyHeaders.push(obj.headers[col]);
            historyColgroup.push(obj.cols[col]);
        }

        // Add new footer cells
        if (obj.options.footers) {
            for (let j = 0; j < obj.options.footers.length; j++) {
                historyFooters[j] = [];
                for (let i = 0; i < numOfColumns; i++) {
                    historyFooters[j].push('');
                }
                obj.options.footers[j].splice(columnIndex, 0, historyFooters[j]);
            }
        }

        // Adding visual columns
        for (let row = 0; row < obj.options.data.length; row++) {
            // Keep the current data
            const currentData = obj.options.data[row].splice(columnIndex);
            const currentRecord = obj.records[row].splice(columnIndex);

            // History
            historyData[row] = [];
            historyRecords[row] = [];

            for (let col = columnIndex; col < numOfColumns + columnIndex; col++) {
                // New value
                const value = data[row] ? data[row] : '';
                obj.options.data[row][col] = value;
                // New cell
                const td = createCell.call(obj, col, row, obj.options.data[row][col]);
                obj.records[row][col] = {
                    element: td,
                    y: row,
                };
                // Add cell to the row
                if (obj.rows[row]) {
                    obj.rows[row].element.insertBefore(td, obj.rows[row].element.children[col + 1]);
                }

                if (obj.options.columns && obj.options.columns[col] && typeof obj.options.columns[col].render === 'function') {
                    obj.options.columns[col].render(td, value, parseInt(col), parseInt(row), obj, obj.options.columns[col]);
                }

                // Record History
                historyData[row].push(value);
                historyRecords[row].push({ element: td, x: col, y: row });
            }

            // Copy the data back to the main data
            Array.prototype.push.apply(obj.options.data[row], currentData);
            Array.prototype.push.apply(obj.records[row], currentRecord);
        }

        Array.prototype.push.apply(obj.headers, currentHeaders);
        Array.prototype.push.apply(obj.cols, currentColgroup);

        for (let i = columnIndex; i < obj.cols.length; i++) {
            obj.cols[i].x = i;
        }

        for (let j = 0; j < obj.records.length; j++) {
            for (let i = 0; i < obj.records[j].length; i++) {
                obj.records[j][i].x = i;
            }
        }

        // Adjust nested headers
        if (obj.options.nestedHeaders && obj.options.nestedHeaders.length > 0 && obj.options.nestedHeaders[0] && obj.options.nestedHeaders[0][0]) {
            for (let j = 0; j < obj.options.nestedHeaders.length; j++) {
                const colspan = parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length - 1].colspan) + numOfColumns;
                obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length - 1].colspan = colspan;
                obj.thead.children[j].children[obj.thead.children[j].children.length - 1].setAttribute('colspan', colspan);
                let o = obj.thead.children[j].children[obj.thead.children[j].children.length - 1].getAttribute('data-column');
                o = o.split(',');
                for (let col = columnIndex; col < numOfColumns + columnIndex; col++) {
                    o.push(col);
                }
                obj.thead.children[j].children[obj.thead.children[j].children.length - 1].setAttribute('data-column', o);
            }
        }

        // Keep history
        setHistory.call(obj, {
            action: 'insertColumn',
            columnNumber: columnNumber,
            numOfColumns: numOfColumns,
            insertBefore: insertBefore,
            columns: properties,
            headers: historyHeaders,
            cols: historyColgroup,
            records: historyRecords,
            footers: historyFooters,
            data: historyData,
        });

        // Remove table references
        updateTableReferences.call(obj);

        // Events
        utils_dispatch.call(obj, 'oninsertcolumn', obj, columns);
    }
};

/**
 * Move column
 *
 * @return void
 */
const moveColumn = function (o, d) {
    const obj = this;

    if (obj.options.mergeCells && Object.keys(obj.options.mergeCells).length > 0) {
        let insertBefore;
        if (o > d) {
            insertBefore = 1;
        } else {
            insertBefore = 0;
        }

        if (isColMerged.call(obj, o).length || isColMerged.call(obj, d, insertBefore).length) {
            if (!confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('This action will destroy any existing merged cells. Are you sure?'))) {
                return false;
            } else {
                obj.destroyMerge();
            }
        }
    }

    o = parseInt(o);
    d = parseInt(d);

    if (o > d) {
        obj.headerContainer.insertBefore(obj.headers[o], obj.headers[d]);
        obj.colgroupContainer.insertBefore(obj.cols[o].colElement, obj.cols[d].colElement);

        for (let j = 0; j < obj.rows.length; j++) {
            obj.rows[j].element.insertBefore(obj.records[j][o].element, obj.records[j][d].element);
        }
    } else {
        obj.headerContainer.insertBefore(obj.headers[o], obj.headers[d].nextSibling);
        obj.colgroupContainer.insertBefore(obj.cols[o].colElement, obj.cols[d].colElement.nextSibling);

        for (let j = 0; j < obj.rows.length; j++) {
            obj.rows[j].element.insertBefore(obj.records[j][o].element, obj.records[j][d].element.nextSibling);
        }
    }

    obj.options.columns.splice(d, 0, obj.options.columns.splice(o, 1)[0]);
    obj.headers.splice(d, 0, obj.headers.splice(o, 1)[0]);
    obj.cols.splice(d, 0, obj.cols.splice(o, 1)[0]);

    const firstAffectedIndex = Math.min(o, d);
    const lastAffectedIndex = Math.max(o, d);

    for (let j = 0; j < obj.rows.length; j++) {
        obj.options.data[j].splice(d, 0, obj.options.data[j].splice(o, 1)[0]);
        obj.records[j].splice(d, 0, obj.records[j].splice(o, 1)[0]);
    }

    for (let i = firstAffectedIndex; i <= lastAffectedIndex; i++) {
        obj.cols[i].x = i;
    }

    for (let j = 0; j < obj.records.length; j++) {
        for (let i = firstAffectedIndex; i <= lastAffectedIndex; i++) {
            obj.records[j][i].x = i;
        }
    }

    // Update footers position
    if (obj.options.footers) {
        for (let j = 0; j < obj.options.footers.length; j++) {
            obj.options.footers[j].splice(d, 0, obj.options.footers[j].splice(o, 1)[0]);
        }
    }

    // Keeping history of changes
    setHistory.call(obj, {
        action: 'moveColumn',
        oldValue: o,
        newValue: d,
    });

    // Update table references
    updateTableReferences.call(obj);

    // Events
    utils_dispatch.call(obj, 'onmovecolumn', obj, o, d, 1);
};

/**
 * Delete a column by number
 *
 * @param integer columnNumber - reference column to be excluded
 * @param integer numOfColumns - number of columns to be excluded from the reference column
 * @return void
 */
const deleteColumn = function (columnNumber, numOfColumns) {
    const obj = this;

    // Global Configuration
    if (obj.options.allowDeleteColumn != false) {
        if (obj.headers.length > 1) {
            // Delete column definitions
            if (columnNumber == undefined) {
                const number = obj.getSelectedColumns(true);

                if (!number.length) {
                    // Remove last column
                    columnNumber = obj.headers.length - 1;
                    numOfColumns = 1;
                } else {
                    // Remove selected
                    columnNumber = parseInt(number[0]);
                    numOfColumns = parseInt(number.length);
                }
            }

            // Lasat column
            const lastColumn = obj.options.data[0].length - 1;

            if (columnNumber == undefined || columnNumber > lastColumn || columnNumber < 0) {
                columnNumber = lastColumn;
            }

            // Minimum of columns to be delete is 1
            if (!numOfColumns) {
                numOfColumns = 1;
            }

            // Can't delete more than the limit of the table
            if (numOfColumns > obj.options.data[0].length - columnNumber) {
                numOfColumns = obj.options.data[0].length - columnNumber;
            }

            const removedColumns = [];
            for (let i = 0; i < numOfColumns; i++) {
                removedColumns.push(i + columnNumber);
            }

            // onbeforedeletecolumn
            if (utils_dispatch.call(obj, 'onbeforedeletecolumn', obj, removedColumns) === false) {
                return false;
            }

            // Can't remove the last column
            if (parseInt(columnNumber) > -1) {
                // Merged cells
                let mergeExists = false;
                if (obj.options.mergeCells && Object.keys(obj.options.mergeCells).length > 0) {
                    for (let col = columnNumber; col < columnNumber + numOfColumns; col++) {
                        if (isColMerged.call(obj, col, null).length) {
                            mergeExists = true;
                        }
                    }
                }
                if (mergeExists) {
                    if (!confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('This action will destroy any existing merged cells. Are you sure?'))) {
                        return false;
                    } else {
                        obj.destroyMerge();
                    }
                }

                // Delete the column properties
                const columns = obj.options.columns ? obj.options.columns.splice(columnNumber, numOfColumns) : undefined;

                for (let col = columnNumber; col < columnNumber + numOfColumns; col++) {
                    obj.cols[col].colElement.className = '';
                    obj.headers[col].className = '';
                    obj.cols[col].colElement.parentNode.removeChild(obj.cols[col].colElement);
                    obj.headers[col].parentNode.removeChild(obj.headers[col]);
                }

                const historyHeaders = obj.headers.splice(columnNumber, numOfColumns);
                const historyColgroup = obj.cols.splice(columnNumber, numOfColumns);
                const historyRecords = [];
                const historyData = [];
                const historyFooters = [];

                for (let row = 0; row < obj.options.data.length; row++) {
                    for (let col = columnNumber; col < columnNumber + numOfColumns; col++) {
                        obj.records[row][col].element.className = '';
                        obj.records[row][col].element.parentNode.removeChild(obj.records[row][col].element);
                    }
                }

                // Delete headers
                for (let row = 0; row < obj.options.data.length; row++) {
                    // History
                    historyData[row] = obj.options.data[row].splice(columnNumber, numOfColumns);
                    historyRecords[row] = obj.records[row].splice(columnNumber, numOfColumns);
                }

                for (let i = columnNumber; i < obj.cols.length; i++) {
                    obj.cols[i].x = i;
                }

                for (let j = 0; j < obj.records.length; j++) {
                    for (let i = columnNumber; i < obj.records[j].length; i++) {
                        obj.records[j][i].x = i;
                    }
                }

                // Delete footers
                if (obj.options.footers) {
                    for (let row = 0; row < obj.options.footers.length; row++) {
                        historyFooters[row] = obj.options.footers[row].splice(columnNumber, numOfColumns);
                    }
                }

                // Remove selection
                conditionalSelectionUpdate.call(obj, 0, columnNumber, columnNumber + numOfColumns - 1);

                // Adjust nested headers
                if (obj.options.nestedHeaders && obj.options.nestedHeaders.length > 0 && obj.options.nestedHeaders[0] && obj.options.nestedHeaders[0][0]) {
                    for (let j = 0; j < obj.options.nestedHeaders.length; j++) {
                        const colspan = parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length - 1].colspan) - numOfColumns;
                        obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length - 1].colspan = colspan;
                        obj.thead.children[j].children[obj.thead.children[j].children.length - 1].setAttribute('colspan', colspan);
                    }
                }

                // Keeping history of changes
                setHistory.call(obj, {
                    action: 'deleteColumn',
                    columnNumber: columnNumber,
                    numOfColumns: numOfColumns,
                    insertBefore: 1,
                    columns: columns,
                    headers: historyHeaders,
                    cols: historyColgroup,
                    records: historyRecords,
                    footers: historyFooters,
                    data: historyData,
                });

                // Update table references
                updateTableReferences.call(obj);

                // Delete
                utils_dispatch.call(obj, 'ondeletecolumn', obj, removedColumns);
            }
        } else {
            console.error('Jspreadsheet: It is not possible to delete the last column');
        }
    }
};

/**
 * Get the column width
 *
 * @param int column column number (first column is: 0)
 * @return int current width
 */
const getWidth = function (column) {
    const obj = this;

    let data;

    if (typeof column === 'undefined') {
        // Get all headers
        data = [];
        for (let i = 0; i < obj.headers.length; i++) {
            data.push((obj.options.columns && obj.options.columns[i] && obj.options.columns[i].width) || obj.options.defaultColWidth || 100);
        }
    } else {
        data = parseInt(obj.cols[column].colElement.getAttribute('width'));
    }

    return data;
};

/**
 * Set the column width
 *
 * @param int column number (first column is: 0)
 * @param int new column width
 * @param int old column width
 */
const setWidth = function (column, width, oldWidth) {
    const obj = this;

    if (width) {
        if (Array.isArray(column)) {
            // Oldwidth
            if (!oldWidth) {
                oldWidth = [];
            }
            // Set width
            for (let i = 0; i < column.length; i++) {
                if (!oldWidth[i]) {
                    oldWidth[i] = parseInt(obj.cols[column[i]].colElement.getAttribute('width'));
                }
                const w = Array.isArray(width) && width[i] ? width[i] : width;
                obj.cols[column[i]].colElement.setAttribute('width', w);

                if (!obj.options.columns) {
                    obj.options.columns = [];
                }

                if (!obj.options.columns[column[i]]) {
                    obj.options.columns[column[i]] = {};
                }

                obj.options.columns[column[i]].width = w;
            }
        } else {
            // Oldwidth
            if (!oldWidth) {
                oldWidth = parseInt(obj.cols[column].colElement.getAttribute('width'));
            }
            // Set width
            obj.cols[column].colElement.setAttribute('width', width);

            if (!obj.options.columns) {
                obj.options.columns = [];
            }

            if (!obj.options.columns[column]) {
                obj.options.columns[column] = {};
            }

            obj.options.columns[column].width = width;
        }

        // Keeping history of changes
        setHistory.call(obj, {
            action: 'setWidth',
            column: column,
            oldValue: oldWidth,
            newValue: width,
        });

        // On resize column
        utils_dispatch.call(obj, 'onresizecolumn', obj, column, width, oldWidth);

        // Update corner position
        updateCornerPosition.call(obj);
    }
};

/**
 * Update visual indicators on headers adjacent to hidden columns
 */
const updateHiddenColumnIndicators = function (obj) {
    const headers = obj.headers;
    let hidden = false;

    for (let i = 0; i < headers.length; i++) {
        const isHidden = headers[i].style.display === 'none';
        headers[i].classList.toggle('jss_hidden_col_before', !isHidden && hidden);
        hidden = isHidden;
    }

    hidden = false;
    for (let i = headers.length - 1; i >= 0; i--) {
        const isHidden = headers[i].style.display === 'none';
        headers[i].classList.toggle('jss_hidden_col_after', !isHidden && hidden);
        hidden = isHidden;
    }
};

/**
 * Show column
 */
const showColumn = function (colNumber) {
    const obj = this;

    if (!Array.isArray(colNumber)) {
        colNumber = [colNumber];
    }

    for (let i = 0; i < colNumber.length; i++) {
        const columnIndex = colNumber[i];

        obj.headers[columnIndex].style.display = '';
        obj.cols[columnIndex].colElement.style.display = '';
        if (obj.filter && obj.filter.children.length > columnIndex + 1) {
            obj.filter.children[columnIndex + 1].style.display = '';
        }
        for (let j = 0; j < obj.options.data.length; j++) {
            obj.records[j][columnIndex].element.style.display = '';
        }
    }

    // Update footers
    if (obj.options.footers) {
        setFooter.call(obj);
    }

    updateHiddenColumnIndicators(obj);
    obj.resetSelection();

    utils_dispatch.call(obj, 'onshowcolumn', obj, colNumber);
};

/**
 * Hide column
 */
const hideColumn = function (colNumber) {
    const obj = this;

    if (!Array.isArray(colNumber)) {
        colNumber = [colNumber];
    }

    for (let i = 0; i < colNumber.length; i++) {
        const columnIndex = colNumber[i];

        obj.headers[columnIndex].style.display = 'none';
        obj.cols[columnIndex].colElement.style.display = 'none';
        if (obj.filter && obj.filter.children.length > columnIndex + 1) {
            obj.filter.children[columnIndex + 1].style.display = 'none';
        }
        for (let j = 0; j < obj.options.data.length; j++) {
            obj.records[j][columnIndex].element.style.display = 'none';
        }
    }

    // Update footers
    if (obj.options.footers) {
        setFooter.call(obj);
    }

    updateHiddenColumnIndicators(obj);
    obj.resetSelection();

    utils_dispatch.call(obj, 'onhidecolumn', obj, colNumber);
};

/**
 * Get a column data by columnNumber
 */
const getColumnData = function (columnNumber, processed) {
    const obj = this;

    const dataset = [];
    // Go through the rows to get the data
    for (let j = 0; j < obj.options.data.length; j++) {
        if (processed) {
            dataset.push(obj.records[j][columnNumber].element.innerHTML);
        } else {
            dataset.push(obj.options.data[j][columnNumber]);
        }
    }
    return dataset;
};

/**
 * Set a column data by colNumber
 */
const setColumnData = function (colNumber, data, force) {
    const obj = this;

    for (let j = 0; j < obj.rows.length; j++) {
        // Update cell
        const columnName = getColumnNameFromId([colNumber, j]);
        // Set value
        if (data[j] != null) {
            obj.setValue(columnName, data[j], force);
        }
    }
};

;// ./src/utils/rows.js









/**
 * Create row
 */
const createRow = function (j, data) {
    const obj = this;

    // Create container
    if (!obj.records[j]) {
        obj.records[j] = [];
    }
    // Default data
    if (!data) {
        data = obj.options.data[j];
    }
    // New line of data to be append in the table
    const row = {
        element: document.createElement('tr'),
        y: j,
    };

    obj.rows[j] = row;

    row.element.setAttribute('data-y', j);
    // Index
    let index = null;

    // Set default row height
    if (obj.options.defaultRowHeight) {
        row.element.style.height = obj.options.defaultRowHeight + 'px';
    }

    // Definitions
    if (obj.options.rows && obj.options.rows[j]) {
        if (obj.options.rows[j].height) {
            row.element.style.height = obj.options.rows[j].height;
        }
        if (obj.options.rows[j].title) {
            index = obj.options.rows[j].title;
        }
    }
    if (!index) {
        index = parseInt(j + 1);
    }
    // Row number label
    const td = document.createElement('td');
    td.innerHTML = index;
    td.setAttribute('data-y', j);
    td.className = 'jss_row';
    row.element.appendChild(td);

    const numberOfColumns = getNumberOfColumns.call(obj);

    // Data columns
    for (let i = 0; i < numberOfColumns; i++) {
        // New column of data to be append in the line
        obj.records[j][i] = {
            element: createCell.call(this, i, j, data[i]),
            x: i,
            y: j,
        };
        // Add column to the row
        row.element.appendChild(obj.records[j][i].element);

        if (obj.options.columns && obj.options.columns[i] && typeof obj.options.columns[i].render === 'function') {
            obj.options.columns[i].render(obj.records[j][i].element, data[i], parseInt(i), parseInt(j), obj, obj.options.columns[i]);
        }
    }

    // Add row to the table body
    return row;
};

/**
 * Insert a new row
 *
 * @param mixed - number of blank lines to be insert or a single array with the data of the new row
 * @param rowNumber
 * @param insertBefore
 * @return void
 */
const insertRow = function (mixed, rowNumber, insertBefore) {
    const obj = this;

    // Configuration
    if (obj.options.allowInsertRow != false) {
        // Records
        var records = [];

        // Data to be insert
        let data = [];

        // The insert could be lead by number of rows or the array of data
        let numOfRows;

        if (!Array.isArray(mixed)) {
            numOfRows = typeof mixed !== 'undefined' ? mixed : 1;
        } else {
            numOfRows = 1;

            if (mixed) {
                data = mixed;
            }
        }

        // Direction
        insertBefore = insertBefore ? true : false;

        // Current column number
        const lastRow = obj.options.data.length - 1;

        if (rowNumber == undefined || rowNumber >= parseInt(lastRow) || rowNumber < 0) {
            rowNumber = lastRow;
        }

        const onbeforeinsertrowRecords = [];

        for (let row = 0; row < numOfRows; row++) {
            const newRow = [];

            for (let col = 0; col < obj.options.columns.length; col++) {
                newRow[col] = data[col] ? data[col] : '';
            }

            onbeforeinsertrowRecords.push({
                row: row + rowNumber + (insertBefore ? 0 : 1),
                data: newRow,
            });
        }

        // Onbeforeinsertrow
        if (utils_dispatch.call(obj, 'onbeforeinsertrow', obj, onbeforeinsertrowRecords) === false) {
            return false;
        }

        // Merged cells
        if (obj.options.mergeCells && Object.keys(obj.options.mergeCells).length > 0) {
            if (isRowMerged.call(obj, rowNumber, insertBefore).length) {
                if (!confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('This action will destroy any existing merged cells. Are you sure?'))) {
                    return false;
                } else {
                    obj.destroyMerge();
                }
            }
        }

        // Clear any search
        if (obj.options.search == true) {
            if (obj.results && obj.results.length != obj.rows.length) {
                if (confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('This action will clear your search results. Are you sure?'))) {
                    obj.resetSearch();
                } else {
                    return false;
                }
            }

            obj.results = null;
        }

        // Insertbefore
        const rowIndex = !insertBefore ? rowNumber + 1 : rowNumber;

        // Keep the current data
        const currentRecords = obj.records.splice(rowIndex);
        const currentData = obj.options.data.splice(rowIndex);
        const currentRows = obj.rows.splice(rowIndex);

        // Adding lines
        const rowRecords = [];
        const rowData = [];
        const rowNode = [];

        for (let row = rowIndex; row < numOfRows + rowIndex; row++) {
            // Push data to the data container
            obj.options.data[row] = [];
            for (let col = 0; col < obj.options.columns.length; col++) {
                obj.options.data[row][col] = data[col] ? data[col] : '';
            }
            // Create row
            const newRow = createRow.call(obj, row, obj.options.data[row]);
            // Append node
            if (currentRows[0]) {
                if (Array.prototype.indexOf.call(obj.tbody.children, currentRows[0].element) >= 0) {
                    obj.tbody.insertBefore(newRow.element, currentRows[0].element);
                }
            } else {
                if (Array.prototype.indexOf.call(obj.tbody.children, obj.rows[rowNumber].element) >= 0) {
                    obj.tbody.appendChild(newRow.element);
                }
            }
            // Record History
            rowRecords.push([...obj.records[row]]);
            rowData.push([...obj.options.data[row]]);
            rowNode.push(newRow);
        }

        // Copy the data back to the main data
        Array.prototype.push.apply(obj.records, currentRecords);
        Array.prototype.push.apply(obj.options.data, currentData);
        Array.prototype.push.apply(obj.rows, currentRows);

        for (let j = rowIndex; j < obj.rows.length; j++) {
            obj.rows[j].y = j;
        }

        for (let j = rowIndex; j < obj.records.length; j++) {
            for (let i = 0; i < obj.records[j].length; i++) {
                obj.records[j][i].y = j;
            }
        }

        // Respect pagination
        if (obj.options.pagination > 0) {
            obj.page(obj.pageNumber);
        }

        // Keep history
        setHistory.call(obj, {
            action: 'insertRow',
            rowNumber: rowNumber,
            numOfRows: numOfRows,
            insertBefore: insertBefore,
            rowRecords: rowRecords,
            rowData: rowData,
            rowNode: rowNode,
        });

        // Remove table references
        updateTableReferences.call(obj);

        // Events
        utils_dispatch.call(obj, 'oninsertrow', obj, onbeforeinsertrowRecords);
    }
};

/**
 * Move row
 *
 * @return void
 */
const moveRow = function (o, d, ignoreDom) {
    const obj = this;

    if (obj.options.mergeCells && Object.keys(obj.options.mergeCells).length > 0) {
        let insertBefore;

        if (o > d) {
            insertBefore = 1;
        } else {
            insertBefore = 0;
        }

        if (isRowMerged.call(obj, o).length || isRowMerged.call(obj, d, insertBefore).length) {
            if (!confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('This action will destroy any existing merged cells. Are you sure?'))) {
                return false;
            } else {
                obj.destroyMerge();
            }
        }
    }

    if (obj.options.search == true) {
        if (obj.results && obj.results.length != obj.rows.length) {
            if (confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('This action will clear your search results. Are you sure?'))) {
                obj.resetSearch();
            } else {
                return false;
            }
        }

        obj.results = null;
    }

    if (!ignoreDom) {
        if (Array.prototype.indexOf.call(obj.tbody.children, obj.rows[d].element) >= 0) {
            if (o > d) {
                obj.tbody.insertBefore(obj.rows[o].element, obj.rows[d].element);
            } else {
                obj.tbody.insertBefore(obj.rows[o].element, obj.rows[d].element.nextSibling);
            }
        } else {
            obj.tbody.removeChild(obj.rows[o].element);
        }
    }

    // Place references in the correct position
    obj.rows.splice(d, 0, obj.rows.splice(o, 1)[0]);
    obj.records.splice(d, 0, obj.records.splice(o, 1)[0]);
    obj.options.data.splice(d, 0, obj.options.data.splice(o, 1)[0]);

    const firstAffectedIndex = Math.min(o, d);
    const lastAffectedIndex = Math.max(o, d);

    for (let j = firstAffectedIndex; j <= lastAffectedIndex; j++) {
        obj.rows[j].y = j;
    }

    for (let j = firstAffectedIndex; j <= lastAffectedIndex; j++) {
        for (let i = 0; i < obj.records[j].length; i++) {
            obj.records[j][i].y = j;
        }
    }

    // Respect pagination
    if (obj.options.pagination > 0 && obj.tbody.children.length != obj.options.pagination) {
        obj.page(obj.pageNumber);
    }

    // Keeping history of changes
    setHistory.call(obj, {
        action: 'moveRow',
        oldValue: o,
        newValue: d,
    });

    // Update table references
    updateTableReferences.call(obj);

    // Events
    utils_dispatch.call(obj, 'onmoverow', obj, parseInt(o), parseInt(d), 1);
};

/**
 * Delete a row by number
 *
 * @param integer rowNumber - row number to be excluded
 * @param integer numOfRows - number of lines
 * @return void
 */
const deleteRow = function (rowNumber, numOfRows) {
    const obj = this;

    // Global Configuration
    if (obj.options.allowDeleteRow != false) {
        if (obj.options.allowDeletingAllRows == true || obj.options.data.length > 1) {
            // Delete row definitions
            if (rowNumber == undefined) {
                const number = getSelectedRows.call(obj);

                if (number.length === 0) {
                    rowNumber = obj.options.data.length - 1;
                    numOfRows = 1;
                } else {
                    rowNumber = number[0];
                    numOfRows = number.length;
                }
            }

            // Last column
            let lastRow = obj.options.data.length - 1;

            if (rowNumber == undefined || rowNumber > lastRow || rowNumber < 0) {
                rowNumber = lastRow;
            }

            if (!numOfRows) {
                numOfRows = 1;
            }

            // Do not delete more than the number of records
            if (rowNumber + numOfRows >= obj.options.data.length) {
                numOfRows = obj.options.data.length - rowNumber;
            }

            // Onbeforedeleterow
            const onbeforedeleterowRecords = [];
            for (let i = 0; i < numOfRows; i++) {
                onbeforedeleterowRecords.push(i + rowNumber);
            }

            if (utils_dispatch.call(obj, 'onbeforedeleterow', obj, onbeforedeleterowRecords) === false) {
                return false;
            }

            if (parseInt(rowNumber) > -1) {
                // Merged cells
                let mergeExists = false;
                if (obj.options.mergeCells && Object.keys(obj.options.mergeCells).length > 0) {
                    for (let row = rowNumber; row < rowNumber + numOfRows; row++) {
                        if (isRowMerged.call(obj, row, false).length) {
                            mergeExists = true;
                        }
                    }
                }
                if (mergeExists) {
                    if (!confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('This action will destroy any existing merged cells. Are you sure?'))) {
                        return false;
                    } else {
                        obj.destroyMerge();
                    }
                }

                // Clear any search
                if (obj.options.search == true) {
                    if (obj.results && obj.results.length != obj.rows.length) {
                        if (confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('This action will clear your search results. Are you sure?'))) {
                            obj.resetSearch();
                        } else {
                            return false;
                        }
                    }

                    obj.results = null;
                }

                // If delete all rows, and set allowDeletingAllRows false, will stay one row
                if (obj.options.allowDeletingAllRows != true && lastRow + 1 === numOfRows) {
                    numOfRows--;
                    console.error('Jspreadsheet: It is not possible to delete the last row');
                }

                // Remove node
                for (let row = rowNumber; row < rowNumber + numOfRows; row++) {
                    if (Array.prototype.indexOf.call(obj.tbody.children, obj.rows[row].element) >= 0) {
                        obj.rows[row].element.className = '';
                        obj.rows[row].element.parentNode.removeChild(obj.rows[row].element);
                    }
                }

                // Remove data
                const rowRecords = obj.records.splice(rowNumber, numOfRows);
                const rowData = obj.options.data.splice(rowNumber, numOfRows);
                const rowNode = obj.rows.splice(rowNumber, numOfRows);

                for (let j = rowNumber; j < obj.rows.length; j++) {
                    obj.rows[j].y = j;
                }

                for (let j = rowNumber; j < obj.records.length; j++) {
                    for (let i = 0; i < obj.records[j].length; i++) {
                        obj.records[j][i].y = j;
                    }
                }

                // Respect pagination
                if (obj.options.pagination > 0 && obj.tbody.children.length != obj.options.pagination) {
                    obj.page(obj.pageNumber);
                }

                // Remove selection
                conditionalSelectionUpdate.call(obj, 1, rowNumber, rowNumber + numOfRows - 1);

                // Keep history
                setHistory.call(obj, {
                    action: 'deleteRow',
                    rowNumber: rowNumber,
                    numOfRows: numOfRows,
                    insertBefore: 1,
                    rowRecords: rowRecords,
                    rowData: rowData,
                    rowNode: rowNode,
                });

                // Remove table references
                updateTableReferences.call(obj);

                // Events
                utils_dispatch.call(obj, 'ondeleterow', obj, onbeforedeleterowRecords);
            }
        } else {
            console.error('Jspreadsheet: It is not possible to delete the last row');
        }
    }
};

/**
 * Get the row height
 *
 * @param row - row number (first row is: 0)
 * @return height - current row height
 */
const getHeight = function (row) {
    const obj = this;

    let data;

    if (typeof row === 'undefined') {
        // Get height of all rows
        data = [];
        for (let j = 0; j < obj.rows.length; j++) {
            const h = obj.rows[j].element.style.height;
            if (h) {
                data[j] = h;
            }
        }
    } else {
        // In case the row is an object
        if (typeof row == 'object') {
            row = row.getAttribute('data-y');
        }

        data = obj.rows[row].element.style.height;
    }

    return data;
};

/**
 * Set the row height
 *
 * @param row - row number (first row is: 0)
 * @param height - new row height
 * @param oldHeight - old row height
 */
const setHeight = function (row, height, oldHeight) {
    const obj = this;

    if (height > 0) {
        // Oldwidth
        if (!oldHeight) {
            oldHeight = obj.rows[row].element.getAttribute('height');

            if (!oldHeight) {
                const rect = obj.rows[row].element.getBoundingClientRect();
                oldHeight = rect.height;
            }
        }

        // Integer
        height = parseInt(height);

        // Set width
        obj.rows[row].element.style.height = height + 'px';

        if (!obj.options.rows) {
            obj.options.rows = [];
        }

        // Keep options updated
        if (!obj.options.rows[row]) {
            obj.options.rows[row] = {};
        }
        obj.options.rows[row].height = height;

        // Keeping history of changes
        setHistory.call(obj, {
            action: 'setHeight',
            row: row,
            oldValue: oldHeight,
            newValue: height,
        });

        // On resize column
        utils_dispatch.call(obj, 'onresizerow', obj, row, height, oldHeight);

        // Update corner position
        updateCornerPosition.call(obj);
    }
};

/**
 * Update visual indicators on rows adjacent to hidden rows
 */
const updateHiddenRowIndicators = function (obj) {
    const rows = obj.rows;
    let hidden = false;

    for (let i = 0; i < rows.length; i++) {
        const el = rows[i].element;
        const isHidden = el.style.display === 'none';
        el.classList.toggle('jss_hidden_row_before', !isHidden && hidden);
        if (!isHidden) {
            hidden = false;
        } else {
            hidden = true;
        }
    }

    hidden = false;
    for (let i = rows.length - 1; i >= 0; i--) {
        const el = rows[i].element;
        const isHidden = el.style.display === 'none';
        el.classList.toggle('jss_hidden_row_after', !isHidden && hidden);
        if (!isHidden) {
            hidden = false;
        } else {
            hidden = true;
        }
    }
};

/**
 * Show row
 */
const showRow = function (rowNumber) {
    const obj = this;

    if (!Array.isArray(rowNumber)) {
        rowNumber = [rowNumber];
    }

    rowNumber.forEach(function (rowIndex) {
        obj.rows[rowIndex].element.style.display = '';
    });

    updateHiddenRowIndicators(obj);

    utils_dispatch.call(obj, 'onshowrow', obj, rowNumber);
};

/**
 * Hide row
 */
const hideRow = function (rowNumber) {
    const obj = this;

    if (!Array.isArray(rowNumber)) {
        rowNumber = [rowNumber];
    }

    rowNumber.forEach(function (rowIndex) {
        obj.rows[rowIndex].element.style.display = 'none';
    });

    updateHiddenRowIndicators(obj);

    utils_dispatch.call(obj, 'onhiderow', obj, rowNumber);
};

/**
 * Get a row data by rowNumber
 */
const getRowData = function (rowNumber, processed) {
    const obj = this;

    if (processed) {
        return obj.records[rowNumber].map(function (record) {
            return record.element.innerHTML;
        });
    } else {
        return obj.options.data[rowNumber];
    }
};

/**
 * Set a row data by rowNumber
 */
const setRowData = function (rowNumber, data, force) {
    const obj = this;

    for (let i = 0; i < obj.headers.length; i++) {
        // Update cell
        const columnName = getColumnNameFromId([i, rowNumber]);
        // Set value
        if (data[i] != null) {
            obj.setValue(columnName, data[i], force);
        }
    }
};

;// ./src/utils/version.js
// Basic version information
/* harmony default export */ const version = ({
    version: '5.0.0',
    host: 'https://bossanova.uk/jspreadsheet',
    license: 'MIT',
    print: function () {
        return [['Jspreadsheet CE', this.version, this.host, this.license].join('\r\n')];
    },
});

;// ./src/utils/events.js















const getElement = function (element) {
    let jssSection = 0;
    let jssElement = 0;

    function path(element) {
        if (element.className) {
            if (element.classList.contains('jss_container')) {
                jssElement = element;
            }

            if (element.classList.contains('jss_spreadsheet')) {
                jssElement = element.querySelector(':scope > .jtabs-content > .jtabs-selected');
            }
        }

        if (element.tagName == 'THEAD') {
            jssSection = 1;
        } else if (element.tagName == 'TBODY') {
            jssSection = 2;
        }

        if (element.parentNode) {
            if (!jssElement) {
                path(element.parentNode);
            }
        }
    }

    path(element);

    return [jssElement, jssSection];
};

const mouseUpControls = function (e) {
    if (libraryBase.jspreadsheet.current) {
        // Update cell size
        if (libraryBase.jspreadsheet.current.resizing) {
            // Columns to be updated
            if (libraryBase.jspreadsheet.current.resizing.column) {
                // New width
                const newWidth = parseInt(
                    libraryBase.jspreadsheet.current.cols[libraryBase.jspreadsheet.current.resizing.column].colElement.getAttribute('width')
                );
                // Columns
                const columns = libraryBase.jspreadsheet.current.getSelectedColumns();
                if (columns.length > 1) {
                    const currentWidth = [];
                    for (let i = 0; i < columns.length; i++) {
                        currentWidth.push(parseInt(libraryBase.jspreadsheet.current.cols[columns[i]].colElement.getAttribute('width')));
                    }
                    // Previous width
                    const index = columns.indexOf(parseInt(libraryBase.jspreadsheet.current.resizing.column));
                    currentWidth[index] = libraryBase.jspreadsheet.current.resizing.width;
                    setWidth.call(libraryBase.jspreadsheet.current, columns, newWidth, currentWidth);
                } else {
                    setWidth.call(
                        libraryBase.jspreadsheet.current,
                        parseInt(libraryBase.jspreadsheet.current.resizing.column),
                        newWidth,
                        libraryBase.jspreadsheet.current.resizing.width
                    );
                }
                // Remove border
                libraryBase.jspreadsheet.current.headers[libraryBase.jspreadsheet.current.resizing.column].classList.remove('resizing');
                for (let j = 0; j < libraryBase.jspreadsheet.current.records.length; j++) {
                    if (libraryBase.jspreadsheet.current.records[j][libraryBase.jspreadsheet.current.resizing.column]) {
                        libraryBase.jspreadsheet.current.records[j][libraryBase.jspreadsheet.current.resizing.column].element.classList.remove('resizing');
                    }
                }
            } else {
                // Remove Class
                libraryBase.jspreadsheet.current.rows[libraryBase.jspreadsheet.current.resizing.row].element.children[0].classList.remove('resizing');
                let newHeight = libraryBase.jspreadsheet.current.rows[libraryBase.jspreadsheet.current.resizing.row].element.getAttribute('height');
                setHeight.call(
                    libraryBase.jspreadsheet.current,
                    libraryBase.jspreadsheet.current.resizing.row,
                    newHeight,
                    libraryBase.jspreadsheet.current.resizing.height
                );
                // Remove border
                libraryBase.jspreadsheet.current.resizing.element.classList.remove('resizing');
            }
            // Reset resizing helper
            libraryBase.jspreadsheet.current.resizing = null;
        } else if (libraryBase.jspreadsheet.current.dragging) {
            // Reset dragging helper
            if (libraryBase.jspreadsheet.current.dragging) {
                if (libraryBase.jspreadsheet.current.dragging.column) {
                    // Target
                    const columnId = e.target.getAttribute('data-x');
                    // Remove move style
                    libraryBase.jspreadsheet.current.headers[libraryBase.jspreadsheet.current.dragging.column].classList.remove('dragging');
                    for (let j = 0; j < libraryBase.jspreadsheet.current.rows.length; j++) {
                        if (libraryBase.jspreadsheet.current.records[j][libraryBase.jspreadsheet.current.dragging.column]) {
                            libraryBase.jspreadsheet.current.records[j][libraryBase.jspreadsheet.current.dragging.column].element.classList.remove('dragging');
                        }
                    }
                    for (let i = 0; i < libraryBase.jspreadsheet.current.headers.length; i++) {
                        libraryBase.jspreadsheet.current.headers[i].classList.remove('dragging-left');
                        libraryBase.jspreadsheet.current.headers[i].classList.remove('dragging-right');
                    }
                    // Update position
                    if (columnId) {
                        if (libraryBase.jspreadsheet.current.dragging.column != libraryBase.jspreadsheet.current.dragging.destination) {
                            libraryBase.jspreadsheet.current.moveColumn(
                                libraryBase.jspreadsheet.current.dragging.column,
                                libraryBase.jspreadsheet.current.dragging.destination
                            );
                        }
                    }
                } else {
                    let position;

                    if (libraryBase.jspreadsheet.current.dragging.element.nextSibling) {
                        position = parseInt(libraryBase.jspreadsheet.current.dragging.element.nextSibling.getAttribute('data-y'));
                        if (libraryBase.jspreadsheet.current.dragging.row < position) {
                            position -= 1;
                        }
                    } else {
                        position = parseInt(libraryBase.jspreadsheet.current.dragging.element.previousSibling.getAttribute('data-y'));
                    }
                    if (libraryBase.jspreadsheet.current.dragging.row != libraryBase.jspreadsheet.current.dragging.destination) {
                        moveRow.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.dragging.row, position, true);
                    }
                    libraryBase.jspreadsheet.current.dragging.element.classList.remove('dragging');
                }
                libraryBase.jspreadsheet.current.dragging = null;
            }
        } else {
            // Close any corner selection
            if (libraryBase.jspreadsheet.current.selectedCorner) {
                libraryBase.jspreadsheet.current.selectedCorner = false;

                // Data to be copied
                if (libraryBase.jspreadsheet.current.selection.length > 0) {
                    // Copy data
                    copyData.call(
                        libraryBase.jspreadsheet.current,
                        libraryBase.jspreadsheet.current.selection[0],
                        libraryBase.jspreadsheet.current.selection[libraryBase.jspreadsheet.current.selection.length - 1]
                    );

                    // Remove selection
                    removeCopySelection.call(libraryBase.jspreadsheet.current);
                }
            }
        }
    }

    // Clear any time control
    if (libraryBase.jspreadsheet.timeControl) {
        clearTimeout(libraryBase.jspreadsheet.timeControl);
        libraryBase.jspreadsheet.timeControl = null;
    }

    // Mouse up
    libraryBase.jspreadsheet.isMouseAction = false;
};

const mouseDownControls = function (e) {
    e = e || window.event;

    let mouseButton;

    if (e.buttons) {
        mouseButton = e.buttons;
    } else if (e.button) {
        mouseButton = e.button;
    } else {
        mouseButton = e.which;
    }

    // Get elements
    const jssTable = getElement(e.target);

    if (jssTable[0]) {
        if (libraryBase.jspreadsheet.current != jssTable[0].jssWorksheet) {
            if (libraryBase.jspreadsheet.current) {
                if (libraryBase.jspreadsheet.current.edition) {
                    closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], true);
                }
                libraryBase.jspreadsheet.current.resetSelection();
            }
            libraryBase.jspreadsheet.current = jssTable[0].jssWorksheet;
        }
    } else {
        if (libraryBase.jspreadsheet.current) {
            if (libraryBase.jspreadsheet.current.edition) {
                closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], true);
            }

            if (!e.target.classList.contains('jss_object')) {
                resetSelection.call(libraryBase.jspreadsheet.current, true);
                libraryBase.jspreadsheet.current = null;
            }
        }
    }

    if (libraryBase.jspreadsheet.current && mouseButton == 1) {
        if (e.target.classList.contains('jss_selectall')) {
            if (libraryBase.jspreadsheet.current) {
                selectAll.call(libraryBase.jspreadsheet.current);
            }
        } else if (e.target.classList.contains('jss_corner')) {
            if (libraryBase.jspreadsheet.current.options.editable != false) {
                libraryBase.jspreadsheet.current.selectedCorner = true;
            }
        } else {
            // Header found
            if (jssTable[1] == 1) {
                const columnId = e.target.getAttribute('data-x');
                if (columnId) {
                    // Update cursor
                    const info = e.target.getBoundingClientRect();
                    if (libraryBase.jspreadsheet.current.options.columnResize != false && info.width - e.offsetX < 6) {
                        // Resize helper
                        libraryBase.jspreadsheet.current.resizing = {
                            mousePosition: e.pageX,
                            column: columnId,
                            width: info.width,
                        };

                        // Border indication
                        libraryBase.jspreadsheet.current.headers[columnId].classList.add('resizing');
                        for (let j = 0; j < libraryBase.jspreadsheet.current.records.length; j++) {
                            if (libraryBase.jspreadsheet.current.records[j][columnId]) {
                                libraryBase.jspreadsheet.current.records[j][columnId].element.classList.add('resizing');
                            }
                        }
                    } else if (libraryBase.jspreadsheet.current.options.columnDrag != false && info.height - e.offsetY < 6) {
                        if (isColMerged.call(libraryBase.jspreadsheet.current, columnId).length) {
                            console.error('Jspreadsheet: This column is part of a merged cell.');
                        } else {
                            // Reset selection
                            libraryBase.jspreadsheet.current.resetSelection();
                            // Drag helper
                            libraryBase.jspreadsheet.current.dragging = {
                                element: e.target,
                                column: columnId,
                                destination: columnId,
                            };
                            // Border indication
                            libraryBase.jspreadsheet.current.headers[columnId].classList.add('dragging');
                            for (let j = 0; j < libraryBase.jspreadsheet.current.records.length; j++) {
                                if (libraryBase.jspreadsheet.current.records[j][columnId]) {
                                    libraryBase.jspreadsheet.current.records[j][columnId].element.classList.add('dragging');
                                }
                            }
                        }
                    } else {
                        let o, d;

                        if (libraryBase.jspreadsheet.current.selectedHeader && (e.shiftKey || e.ctrlKey)) {
                            o = libraryBase.jspreadsheet.current.selectedHeader;
                            d = columnId;
                        } else {
                            // Press to rename
                            if (
                                libraryBase.jspreadsheet.current.selectedHeader == columnId &&
                                libraryBase.jspreadsheet.current.options.allowRenameColumn != false
                            ) {
                                libraryBase.jspreadsheet.timeControl = setTimeout(function () {
                                    libraryBase.jspreadsheet.current.setHeader(columnId);
                                }, 800);
                            }

                            // Keep track of which header was selected first
                            libraryBase.jspreadsheet.current.selectedHeader = columnId;

                            // Update selection single column
                            o = columnId;
                            d = columnId;
                        }

                        // Update selection
                        updateSelectionFromCoords.call(libraryBase.jspreadsheet.current, o, 0, d, libraryBase.jspreadsheet.current.options.data.length - 1, e);
                    }
                } else {
                    if (e.target.parentNode.classList.contains('jss_nested')) {
                        let c1, c2;

                        if (e.target.getAttribute('data-column')) {
                            const column = e.target.getAttribute('data-column').split(',');
                            c1 = parseInt(column[0]);
                            c2 = parseInt(column[column.length - 1]);
                        } else {
                            c1 = 0;
                            c2 = libraryBase.jspreadsheet.current.options.columns.length - 1;
                        }
                        updateSelectionFromCoords.call(
                            libraryBase.jspreadsheet.current,
                            c1,
                            0,
                            c2,
                            libraryBase.jspreadsheet.current.options.data.length - 1,
                            e
                        );
                    }
                }
            } else {
                libraryBase.jspreadsheet.current.selectedHeader = false;
            }

            // Body found
            if (jssTable[1] == 2) {
                const rowId = parseInt(e.target.getAttribute('data-y'));

                if (e.target.classList.contains('jss_row')) {
                    const info = e.target.getBoundingClientRect();
                    if (libraryBase.jspreadsheet.current.options.rowResize != false && info.height - e.offsetY < 6) {
                        // Resize helper
                        libraryBase.jspreadsheet.current.resizing = {
                            element: e.target.parentNode,
                            mousePosition: e.pageY,
                            row: rowId,
                            height: info.height,
                        };
                        // Border indication
                        e.target.parentNode.classList.add('resizing');
                    } else if (libraryBase.jspreadsheet.current.options.rowDrag != false && info.width - e.offsetX < 6) {
                        if (isRowMerged.call(libraryBase.jspreadsheet.current, rowId).length) {
                            console.error('Jspreadsheet: This row is part of a merged cell');
                        } else if (libraryBase.jspreadsheet.current.options.search == true && libraryBase.jspreadsheet.current.results) {
                            console.error('Jspreadsheet: Please clear your search before perform this action');
                        } else {
                            // Reset selection
                            libraryBase.jspreadsheet.current.resetSelection();
                            // Drag helper
                            libraryBase.jspreadsheet.current.dragging = {
                                element: e.target.parentNode,
                                row: rowId,
                                destination: rowId,
                            };
                            // Border indication
                            e.target.parentNode.classList.add('dragging');
                        }
                    } else {
                        let o, d;
                        if (libraryBase.jspreadsheet.current.selectedRow != null && (e.shiftKey || e.ctrlKey)) {
                            o = libraryBase.jspreadsheet.current.selectedRow;
                            d = rowId;
                        } else {
                            // Keep track of which header was selected first
                            libraryBase.jspreadsheet.current.selectedRow = rowId;

                            // Update selection single column
                            o = rowId;
                            d = rowId;
                        }

                        // Update selection
                        updateSelectionFromCoords.call(libraryBase.jspreadsheet.current, null, o, null, d, e);
                    }
                } else {
                    // Jclose
                    if (e.target.classList.contains('jclose') && e.target.clientWidth - e.offsetX < 50 && e.offsetY < 50) {
                        closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], true);
                    } else {
                        const getCellCoords = function (element) {
                            const x = element.getAttribute('data-x');
                            const y = element.getAttribute('data-y');
                            if (x && y) {
                                return [x, y];
                            } else {
                                if (element.parentNode) {
                                    return getCellCoords(element.parentNode);
                                }
                            }
                        };

                        const position = getCellCoords(e.target);
                        if (position) {
                            const columnId = position[0];
                            const rowId = position[1];
                            // Close edition
                            if (libraryBase.jspreadsheet.current.edition) {
                                if (libraryBase.jspreadsheet.current.edition[2] != columnId || libraryBase.jspreadsheet.current.edition[3] != rowId) {
                                    closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], true);
                                }
                            }

                            if (!libraryBase.jspreadsheet.current.edition) {
                                // Update cell selection
                                if (e.shiftKey) {
                                    updateSelectionFromCoords.call(
                                        libraryBase.jspreadsheet.current,
                                        libraryBase.jspreadsheet.current.selectedCell[0],
                                        libraryBase.jspreadsheet.current.selectedCell[1],
                                        columnId,
                                        rowId,
                                        e
                                    );
                                } else {
                                    updateSelectionFromCoords.call(libraryBase.jspreadsheet.current, columnId, rowId, undefined, undefined, e);
                                }
                            }

                            // No full row selected
                            libraryBase.jspreadsheet.current.selectedHeader = null;
                            libraryBase.jspreadsheet.current.selectedRow = null;
                        }
                    }
                }
            } else {
                libraryBase.jspreadsheet.current.selectedRow = false;
            }

            // Pagination
            if (e.target.classList.contains('jss_page')) {
                if (e.target.textContent == '<') {
                    libraryBase.jspreadsheet.current.page(0);
                } else if (e.target.textContent == '>') {
                    libraryBase.jspreadsheet.current.page(e.target.getAttribute('title') - 1);
                } else {
                    libraryBase.jspreadsheet.current.page(e.target.textContent - 1);
                }
            }
        }

        if (libraryBase.jspreadsheet.current.edition) {
            libraryBase.jspreadsheet.isMouseAction = false;
        } else {
            libraryBase.jspreadsheet.isMouseAction = true;
        }
    } else {
        libraryBase.jspreadsheet.isMouseAction = false;
    }
};

// Mouse move controls
const mouseMoveControls = function (e) {
    e = e || window.event;

    let mouseButton;

    if (e.buttons) {
        mouseButton = e.buttons;
    } else if (e.button) {
        mouseButton = e.button;
    } else {
        mouseButton = e.which;
    }

    if (!mouseButton) {
        libraryBase.jspreadsheet.isMouseAction = false;
    }

    if (libraryBase.jspreadsheet.current) {
        if (libraryBase.jspreadsheet.isMouseAction == true) {
            // Resizing is ongoing
            if (libraryBase.jspreadsheet.current.resizing) {
                if (libraryBase.jspreadsheet.current.resizing.column) {
                    const width = e.pageX - libraryBase.jspreadsheet.current.resizing.mousePosition;

                    if (libraryBase.jspreadsheet.current.resizing.width + width > 0) {
                        const tempWidth = libraryBase.jspreadsheet.current.resizing.width + width;
                        libraryBase.jspreadsheet.current.cols[libraryBase.jspreadsheet.current.resizing.column].colElement.setAttribute('width', tempWidth);

                        updateCornerPosition.call(libraryBase.jspreadsheet.current);
                    }
                } else {
                    const height = e.pageY - libraryBase.jspreadsheet.current.resizing.mousePosition;

                    if (libraryBase.jspreadsheet.current.resizing.height + height > 0) {
                        const tempHeight = libraryBase.jspreadsheet.current.resizing.height + height;
                        libraryBase.jspreadsheet.current.rows[libraryBase.jspreadsheet.current.resizing.row].element.setAttribute('height', tempHeight);

                        updateCornerPosition.call(libraryBase.jspreadsheet.current);
                    }
                }
            } else if (libraryBase.jspreadsheet.current.dragging) {
                if (libraryBase.jspreadsheet.current.dragging.column) {
                    const columnId = e.target.getAttribute('data-x');
                    if (columnId) {
                        if (isColMerged.call(libraryBase.jspreadsheet.current, columnId).length) {
                            console.error('Jspreadsheet: This column is part of a merged cell.');
                        } else {
                            for (let i = 0; i < libraryBase.jspreadsheet.current.headers.length; i++) {
                                libraryBase.jspreadsheet.current.headers[i].classList.remove('dragging-left');
                                libraryBase.jspreadsheet.current.headers[i].classList.remove('dragging-right');
                            }

                            if (libraryBase.jspreadsheet.current.dragging.column == columnId) {
                                libraryBase.jspreadsheet.current.dragging.destination = parseInt(columnId);
                            } else {
                                if (e.target.clientWidth / 2 > e.offsetX) {
                                    if (libraryBase.jspreadsheet.current.dragging.column < columnId) {
                                        libraryBase.jspreadsheet.current.dragging.destination = parseInt(columnId) - 1;
                                    } else {
                                        libraryBase.jspreadsheet.current.dragging.destination = parseInt(columnId);
                                    }
                                    libraryBase.jspreadsheet.current.headers[columnId].classList.add('dragging-left');
                                } else {
                                    if (libraryBase.jspreadsheet.current.dragging.column < columnId) {
                                        libraryBase.jspreadsheet.current.dragging.destination = parseInt(columnId);
                                    } else {
                                        libraryBase.jspreadsheet.current.dragging.destination = parseInt(columnId) + 1;
                                    }
                                    libraryBase.jspreadsheet.current.headers[columnId].classList.add('dragging-right');
                                }
                            }
                        }
                    }
                } else {
                    const rowId = e.target.getAttribute('data-y');
                    if (rowId) {
                        if (isRowMerged.call(libraryBase.jspreadsheet.current, rowId).length) {
                            console.error('Jspreadsheet: This row is part of a merged cell.');
                        } else {
                            const target = e.target.clientHeight / 2 > e.offsetY ? e.target.parentNode.nextSibling : e.target.parentNode;
                            if (libraryBase.jspreadsheet.current.dragging.element != target) {
                                e.target.parentNode.parentNode.insertBefore(libraryBase.jspreadsheet.current.dragging.element, target);
                                libraryBase.jspreadsheet.current.dragging.destination = Array.prototype.indexOf.call(
                                    libraryBase.jspreadsheet.current.dragging.element.parentNode.children,
                                    libraryBase.jspreadsheet.current.dragging.element
                                );
                            }
                        }
                    }
                }
            }
        } else {
            const x = e.target.getAttribute('data-x');
            const y = e.target.getAttribute('data-y');
            const rect = e.target.getBoundingClientRect();

            if (libraryBase.jspreadsheet.current.cursor) {
                libraryBase.jspreadsheet.current.cursor.style.cursor = '';
                libraryBase.jspreadsheet.current.cursor = null;
            }

            if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.className) {
                if (e.target.parentNode.parentNode.classList.contains('resizable')) {
                    if (e.target && x && !y && rect.width - (e.clientX - rect.left) < 6) {
                        libraryBase.jspreadsheet.current.cursor = e.target;
                        libraryBase.jspreadsheet.current.cursor.style.cursor = 'col-resize';
                    } else if (e.target && !x && y && rect.height - (e.clientY - rect.top) < 6) {
                        libraryBase.jspreadsheet.current.cursor = e.target;
                        libraryBase.jspreadsheet.current.cursor.style.cursor = 'row-resize';
                    }
                }

                if (e.target.parentNode.parentNode.classList.contains('draggable')) {
                    if (e.target && !x && y && rect.width - (e.clientX - rect.left) < 6) {
                        libraryBase.jspreadsheet.current.cursor = e.target;
                        libraryBase.jspreadsheet.current.cursor.style.cursor = 'move';
                    } else if (e.target && x && !y && rect.height - (e.clientY - rect.top) < 6) {
                        libraryBase.jspreadsheet.current.cursor = e.target;
                        libraryBase.jspreadsheet.current.cursor.style.cursor = 'move';
                    }
                }
            }
        }
    }
};

/**
 * Update copy selection
 *
 * @param int x, y
 * @return void
 */
const updateCopySelection = function (x3, y3) {
    const obj = this;

    // Remove selection
    removeCopySelection.call(obj);

    // Get elements first and last
    const x1 = obj.selectedContainer[0];
    const y1 = obj.selectedContainer[1];
    const x2 = obj.selectedContainer[2];
    const y2 = obj.selectedContainer[3];

    if (x3 != null && y3 != null) {
        let px, ux;

        if (x3 - x2 > 0) {
            px = parseInt(x2) + 1;
            ux = parseInt(x3);
        } else {
            px = parseInt(x3);
            ux = parseInt(x1) - 1;
        }

        let py, uy;

        if (y3 - y2 > 0) {
            py = parseInt(y2) + 1;
            uy = parseInt(y3);
        } else {
            py = parseInt(y3);
            uy = parseInt(y1) - 1;
        }

        if (ux - px <= uy - py) {
            px = parseInt(x1);
            ux = parseInt(x2);
        } else {
            py = parseInt(y1);
            uy = parseInt(y2);
        }

        for (let j = py; j <= uy; j++) {
            for (let i = px; i <= ux; i++) {
                if (obj.records[j][i] && obj.rows[j].element.style.display != 'none' && obj.records[j][i].element.style.display != 'none') {
                    obj.records[j][i].element.classList.add('selection');
                    obj.records[py][i].element.classList.add('selection-top');
                    obj.records[uy][i].element.classList.add('selection-bottom');
                    obj.records[j][px].element.classList.add('selection-left');
                    obj.records[j][ux].element.classList.add('selection-right');

                    // Persist selected elements
                    obj.selection.push(obj.records[j][i].element);
                }
            }
        }
    }
};

const mouseOverControls = function (e) {
    e = e || window.event;

    let mouseButton;

    if (e.buttons) {
        mouseButton = e.buttons;
    } else if (e.button) {
        mouseButton = e.button;
    } else {
        mouseButton = e.which;
    }

    if (!mouseButton) {
        libraryBase.jspreadsheet.isMouseAction = false;
    }

    if (libraryBase.jspreadsheet.current && libraryBase.jspreadsheet.isMouseAction == true) {
        // Get elements
        const jssTable = getElement(e.target);

        if (jssTable[0]) {
            // Avoid cross reference
            if (libraryBase.jspreadsheet.current != jssTable[0].jssWorksheet) {
                if (libraryBase.jspreadsheet.current) {
                    return false;
                }
            }

            let columnId = e.target.getAttribute('data-x');
            const rowId = e.target.getAttribute('data-y');
            if (libraryBase.jspreadsheet.current.resizing || libraryBase.jspreadsheet.current.dragging) {
                // ignore
            } else {
                // Header found
                if (jssTable[1] == 1) {
                    if (libraryBase.jspreadsheet.current.selectedHeader) {
                        columnId = e.target.getAttribute('data-x');
                        const o = libraryBase.jspreadsheet.current.selectedHeader;
                        const d = columnId;
                        // Update selection
                        updateSelectionFromCoords.call(libraryBase.jspreadsheet.current, o, 0, d, libraryBase.jspreadsheet.current.options.data.length - 1, e);
                    }
                }

                // Body found
                if (jssTable[1] == 2) {
                    if (e.target.classList.contains('jss_row')) {
                        if (libraryBase.jspreadsheet.current.selectedRow != null) {
                            const o = libraryBase.jspreadsheet.current.selectedRow;
                            const d = rowId;
                            // Update selection
                            updateSelectionFromCoords.call(
                                libraryBase.jspreadsheet.current,
                                0,
                                o,
                                libraryBase.jspreadsheet.current.options.data[0].length - 1,
                                d,
                                e
                            );
                        }
                    } else {
                        // Do not select edtion is in progress
                        if (!libraryBase.jspreadsheet.current.edition) {
                            if (columnId && rowId) {
                                if (libraryBase.jspreadsheet.current.selectedCorner) {
                                    updateCopySelection.call(libraryBase.jspreadsheet.current, columnId, rowId);
                                } else {
                                    if (libraryBase.jspreadsheet.current.selectedCell) {
                                        updateSelectionFromCoords.call(
                                            libraryBase.jspreadsheet.current,
                                            libraryBase.jspreadsheet.current.selectedCell[0],
                                            libraryBase.jspreadsheet.current.selectedCell[1],
                                            columnId,
                                            rowId,
                                            e
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Clear any time control
    if (libraryBase.jspreadsheet.timeControl) {
        clearTimeout(libraryBase.jspreadsheet.timeControl);
        libraryBase.jspreadsheet.timeControl = null;
    }
};

const doubleClickControls = function (e) {
    // Jss is selected
    if (libraryBase.jspreadsheet.current) {
        // Corner action
        if (e.target.classList.contains('jss_corner')) {
            // Any selected cells
            if (libraryBase.jspreadsheet.current.highlighted.length > 0) {
                // Copy from this
                const x1 = libraryBase.jspreadsheet.current.highlighted[0].element.getAttribute('data-x');
                const y1 =
                    parseInt(
                        libraryBase.jspreadsheet.current.highlighted[libraryBase.jspreadsheet.current.highlighted.length - 1].element.getAttribute('data-y')
                    ) + 1;
                // Until this
                const x2 = libraryBase.jspreadsheet.current.highlighted[libraryBase.jspreadsheet.current.highlighted.length - 1].element.getAttribute('data-x');
                const y2 = libraryBase.jspreadsheet.current.records.length - 1;
                // Execute copy
                copyData.call(
                    libraryBase.jspreadsheet.current,
                    libraryBase.jspreadsheet.current.records[y1][x1].element,
                    libraryBase.jspreadsheet.current.records[y2][x2].element
                );
            }
        } else if (e.target.classList.contains('jss_column_filter')) {
            // Column
            const columnId = e.target.getAttribute('data-x');
            // Open filter
            openFilter.call(libraryBase.jspreadsheet.current, columnId);
        } else {
            // Get table
            const jssTable = getElement(e.target);

            // Double click over header
            if (jssTable[1] == 1 && libraryBase.jspreadsheet.current.options.columnSorting != false) {
                // Check valid column header coords
                const columnId = e.target.getAttribute('data-x');
                if (columnId) {
                    libraryBase.jspreadsheet.current.orderBy(parseInt(columnId));
                }
            }

            // Double click over body
            if (jssTable[1] == 2 && libraryBase.jspreadsheet.current.options.editable != false) {
                if (!libraryBase.jspreadsheet.current.edition) {
                    const getCellCoords = function (element) {
                        if (element.parentNode) {
                            const x = element.getAttribute('data-x');
                            const y = element.getAttribute('data-y');
                            if (x && y) {
                                return element;
                            } else {
                                return getCellCoords(element.parentNode);
                            }
                        }
                    };
                    const cell = getCellCoords(e.target);
                    if (cell && cell.classList.contains('highlight')) {
                        openEditor.call(libraryBase.jspreadsheet.current, cell, undefined, e);
                    }
                }
            }
        }
    }
};

const pasteControls = function (e) {
    if (libraryBase.jspreadsheet.current && libraryBase.jspreadsheet.current.selectedCell) {
        if (!libraryBase.jspreadsheet.current.edition) {
            if (libraryBase.jspreadsheet.current.options.editable != false) {
                if (e && e.clipboardData) {
                    paste.call(
                        libraryBase.jspreadsheet.current,
                        libraryBase.jspreadsheet.current.selectedCell[0],
                        libraryBase.jspreadsheet.current.selectedCell[1],
                        e.clipboardData.getData('text')
                    );
                    e.preventDefault();
                } else if (window.clipboardData) {
                    paste.call(
                        libraryBase.jspreadsheet.current,
                        libraryBase.jspreadsheet.current.selectedCell[0],
                        libraryBase.jspreadsheet.current.selectedCell[1],
                        window.clipboardData.getData('text')
                    );
                }
            }
        }
    }
};

const getRole = function (element) {
    if (element.classList.contains('jss_selectall')) {
        return 'select-all';
    }

    if (element.classList.contains('jss_corner')) {
        return 'fill-handle';
    }

    let tempElement = element;

    while (!tempElement.classList.contains('jss_spreadsheet')) {
        if (tempElement.classList.contains('jss_row')) {
            return 'row';
        }

        if (tempElement.classList.contains('jss_nested')) {
            return 'nested';
        }

        if (tempElement.classList.contains('jtabs-headers')) {
            return 'tabs';
        }

        if (tempElement.classList.contains('jtoolbar')) {
            return 'toolbar';
        }

        if (tempElement.classList.contains('jss_pagination')) {
            return 'pagination';
        }

        if (tempElement.tagName === 'TBODY') {
            return 'cell';
        }

        if (tempElement.tagName === 'TFOOT') {
            return getElementIndex(element) === 0 ? 'grid' : 'footer';
        }

        if (tempElement.tagName === 'THEAD') {
            return 'header';
        }

        tempElement = tempElement.parentElement;
    }

    return 'applications';
};

const defaultContextMenu = function (worksheet, x, y, role) {
    const items = [];

    if (role === 'header') {
        // Insert a new column
        if (worksheet.options.allowInsertColumn != false) {
            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Insert a new column before'),
                onclick: function () {
                    worksheet.insertColumn(1, parseInt(x), 1);
                },
            });
        }

        if (worksheet.options.allowInsertColumn != false) {
            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Insert a new column after'),
                onclick: function () {
                    worksheet.insertColumn(1, parseInt(x), 0);
                },
            });
        }

        // Delete a column
        if (worksheet.options.allowDeleteColumn != false) {
            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Delete selected columns'),
                onclick: function () {
                    worksheet.deleteColumn(worksheet.getSelectedColumns().length ? undefined : parseInt(x));
                },
            });
        }

        // Rename column
        if (worksheet.options.allowRenameColumn != false) {
            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Rename this column'),
                onclick: function () {
                    const oldValue = worksheet.getHeader(x);

                    const newValue = prompt(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Column name'), oldValue);

                    worksheet.setHeader(x, newValue);
                },
            });
        }

        // Sorting
        if (worksheet.options.columnSorting != false) {
            // Line
            items.push({ type: 'line' });

            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Order ascending'),
                onclick: function () {
                    worksheet.orderBy(x, 0);
                },
            });
            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Order descending'),
                onclick: function () {
                    worksheet.orderBy(x, 1);
                },
            });
        }

        // Hide/Show columns
        items.push({ type: 'line' });

        items.push({
            title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Hide selected columns'),
            onclick: function () {
                const selected = worksheet.getSelectedColumns();
                worksheet.hideColumn(selected.length ? selected : [parseInt(x)]);
            },
        });

        // Check for hidden columns
        const hiddenCols = [];
        for (let i = 0; i < worksheet.headers.length; i++) {
            if (worksheet.headers[i].style.display === 'none') {
                hiddenCols.push(i);
            }
        }

        if (hiddenCols.length) {
            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Show hidden columns'),
                onclick: function () {
                    worksheet.showColumn(hiddenCols);
                },
            });
        }
    }

    if (role === 'row' || role === 'cell') {
        // Insert new row
        if (worksheet.options.allowInsertRow != false) {
            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Insert a new row before'),
                onclick: function () {
                    worksheet.insertRow(1, parseInt(y), 1);
                },
            });

            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Insert a new row after'),
                onclick: function () {
                    worksheet.insertRow(1, parseInt(y));
                },
            });
        }

        if (worksheet.options.allowDeleteRow != false) {
            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Delete selected rows'),
                onclick: function () {
                    worksheet.deleteRow(worksheet.getSelectedRows().length ? undefined : parseInt(y));
                },
            });
        }

        // Hide/Show rows
        items.push({ type: 'line' });

        items.push({
            title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Hide selected rows'),
            onclick: function () {
                const selected = worksheet.getSelectedRows();
                worksheet.hideRow(selected.length ? selected : [parseInt(y)]);
            },
        });

        // Check for hidden rows
        const hiddenRows = [];
        for (let i = 0; i < worksheet.rows.length; i++) {
            if (worksheet.rows[i].element.style.display === 'none') {
                hiddenRows.push(i);
            }
        }

        if (hiddenRows.length) {
            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Show hidden rows'),
                onclick: function () {
                    worksheet.showRow(hiddenRows);
                },
            });
        }
    }

    if (role === 'cell') {
        if (worksheet.options.allowComments != false) {
            items.push({ type: 'line' });

            const title = worksheet.records[y][x].element.getAttribute('title') || '';

            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate(title ? 'Edit comments' : 'Add comments'),
                onclick: function () {
                    const comment = prompt(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Comments'), title);
                    if (comment) {
                        worksheet.setComments(getCellNameFromCoords(x, y), comment);
                    }
                },
            });

            if (title) {
                items.push({
                    title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Clear comments'),
                    onclick: function () {
                        worksheet.setComments(getCellNameFromCoords(x, y), '');
                    },
                });
            }
        }
    }

    // Line
    if (items.length !== 0) {
        items.push({ type: 'line' });
    }

    // Copy
    if (role === 'header' || role === 'row' || role === 'cell') {
        items.push({
            title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Copy') + '...',
            shortcut: 'Ctrl + C',
            onclick: function () {
                copy.call(worksheet, true);
            },
        });

        // Paste
        if (navigator && navigator.clipboard) {
            items.push({
                title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Paste') + '...',
                shortcut: 'Ctrl + V',
                onclick: function () {
                    if (worksheet.selectedCell) {
                        navigator.clipboard.readText().then(function (text) {
                            if (text) {
                                paste.call(worksheet, worksheet.selectedCell[0], worksheet.selectedCell[1], text);
                            }
                        });
                    }
                },
            });
        }
    }

    // Save
    if (worksheet.parent.config.allowExport != false) {
        items.push({
            title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Save as') + '...',
            shortcut: 'Ctrl + S',
            onclick: function () {
                worksheet.download();
            },
        });
    }

    // About
    if (worksheet.parent.config.about != false) {
        items.push({
            title: __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('About'),
            onclick: function () {
                if (typeof worksheet.parent.config.about === 'undefined' || worksheet.parent.config.about === true) {
                    alert(version.print());
                } else {
                    alert(worksheet.parent.config.about);
                }
            },
        });
    }

    return items;
};

const getElementIndex = function (element) {
    const parentChildren = element.parentElement.children;

    for (let i = 0; i < parentChildren.length; i++) {
        const currentElement = parentChildren[i];

        if (element === currentElement) {
            return i;
        }
    }

    return -1;
};

const contextMenuControls = function (e) {
    e = e || window.event;

    let mouseButton;

    if ('buttons' in e) {
        mouseButton = e.buttons;
    } else {
        mouseButton = e.which || e.button;
    }

    if (libraryBase.jspreadsheet.current) {
        const spreadsheet = libraryBase.jspreadsheet.current.parent;

        if (libraryBase.jspreadsheet.current.edition) {
            e.preventDefault();
        } else {
            spreadsheet.contextMenu.contextmenu.close();

            if (libraryBase.jspreadsheet.current) {
                const role = getRole(e.target);

                let x = null,
                    y = null;

                if (role === 'cell') {
                    let cellElement = e.target;
                    while (cellElement.tagName !== 'TD') {
                        cellElement = cellElement.parentNode;
                    }

                    y = cellElement.getAttribute('data-y');
                    x = cellElement.getAttribute('data-x');

                    if (
                        !libraryBase.jspreadsheet.current.selectedCell ||
                        x < parseInt(libraryBase.jspreadsheet.current.selectedCell[0]) ||
                        x > parseInt(libraryBase.jspreadsheet.current.selectedCell[2]) ||
                        y < parseInt(libraryBase.jspreadsheet.current.selectedCell[1]) ||
                        y > parseInt(libraryBase.jspreadsheet.current.selectedCell[3])
                    ) {
                        updateSelectionFromCoords.call(libraryBase.jspreadsheet.current, x, y, x, y, e);
                    }
                } else if (role === 'row' || role === 'header') {
                    if (role === 'row') {
                        y = e.target.getAttribute('data-y');
                    } else {
                        x = e.target.getAttribute('data-x');
                    }

                    if (
                        !libraryBase.jspreadsheet.current.selectedCell ||
                        x < parseInt(libraryBase.jspreadsheet.current.selectedCell[0]) ||
                        x > parseInt(libraryBase.jspreadsheet.current.selectedCell[2]) ||
                        y < parseInt(libraryBase.jspreadsheet.current.selectedCell[1]) ||
                        y > parseInt(libraryBase.jspreadsheet.current.selectedCell[3])
                    ) {
                        updateSelectionFromCoords.call(libraryBase.jspreadsheet.current, x, y, x, y, e);
                    }
                } else if (role === 'nested') {
                    const columns = e.target.getAttribute('data-column').split(',');

                    x = getElementIndex(e.target) - 1;
                    y = getElementIndex(e.target.parentElement);

                    if (
                        !libraryBase.jspreadsheet.current.selectedCell ||
                        columns[0] != parseInt(libraryBase.jspreadsheet.current.selectedCell[0]) ||
                        columns[columns.length - 1] != parseInt(libraryBase.jspreadsheet.current.selectedCell[2]) ||
                        libraryBase.jspreadsheet.current.selectedCell[1] != null ||
                        libraryBase.jspreadsheet.current.selectedCell[3] != null
                    ) {
                        updateSelectionFromCoords.call(libraryBase.jspreadsheet.current, columns[0], null, columns[columns.length - 1], null, e);
                    }
                } else if (role === 'select-all') {
                    selectAll.call(libraryBase.jspreadsheet.current);
                } else if (role === 'tabs') {
                    x = getElementIndex(e.target);
                } else if (role === 'footer') {
                    x = getElementIndex(e.target) - 1;
                    y = getElementIndex(e.target.parentElement);
                }

                // Table found
                let items = defaultContextMenu(libraryBase.jspreadsheet.current, parseInt(x), parseInt(y), role);

                if (typeof spreadsheet.config.contextMenu === 'function') {
                    const result = spreadsheet.config.contextMenu(libraryBase.jspreadsheet.current, x, y, e, items, role, x, y);

                    if (result) {
                        items = result;
                    } else if (result === false) {
                        return;
                    }
                }

                if (typeof spreadsheet.plugins === 'object') {
                    Object.entries(spreadsheet.plugins).forEach(function ([, plugin]) {
                        if (typeof plugin.contextMenu === 'function') {
                            const result = plugin.contextMenu(
                                libraryBase.jspreadsheet.current,
                                x !== null ? parseInt(x) : null,
                                y !== null ? parseInt(y) : null,
                                e,
                                items,
                                role,
                                x !== null ? parseInt(x) : null,
                                y !== null ? parseInt(y) : null
                            );

                            if (result) {
                                items = result;
                            }
                        }
                    });
                }

                // The id is depending on header and body
                spreadsheet.contextMenu.contextmenu.open(e, items);
                // Avoid the real one
                e.preventDefault();
            }
        }
    }
};

const touchStartControls = function (e) {
    const jssTable = getElement(e.target);

    if (jssTable[0]) {
        if (libraryBase.jspreadsheet.current != jssTable[0].jssWorksheet) {
            if (libraryBase.jspreadsheet.current) {
                libraryBase.jspreadsheet.current.resetSelection();
            }
            libraryBase.jspreadsheet.current = jssTable[0].jssWorksheet;
        }
    } else {
        if (libraryBase.jspreadsheet.current) {
            libraryBase.jspreadsheet.current.resetSelection();
            libraryBase.jspreadsheet.current = null;
        }
    }

    if (libraryBase.jspreadsheet.current) {
        if (!libraryBase.jspreadsheet.current.edition) {
            const columnId = e.target.getAttribute('data-x');
            const rowId = e.target.getAttribute('data-y');

            if (columnId && rowId) {
                updateSelectionFromCoords.call(libraryBase.jspreadsheet.current, columnId, rowId, undefined, undefined, e);

                libraryBase.jspreadsheet.timeControl = setTimeout(function () {
                    // Keep temporary reference to the element
                    if (libraryBase.jspreadsheet.current.options.columns[columnId].type == 'color') {
                        libraryBase.jspreadsheet.tmpElement = null;
                    } else {
                        libraryBase.jspreadsheet.tmpElement = e.target;
                    }
                    openEditor.call(libraryBase.jspreadsheet.current, e.target, false, e);
                }, 500);
            }
        }
    }
};

const touchEndControls = function (e) {
    // Clear any time control
    if (libraryBase.jspreadsheet.timeControl) {
        clearTimeout(libraryBase.jspreadsheet.timeControl);
        libraryBase.jspreadsheet.timeControl = null;
        // Element
        if (libraryBase.jspreadsheet.tmpElement && libraryBase.jspreadsheet.tmpElement.children[0].tagName == 'INPUT') {
            libraryBase.jspreadsheet.tmpElement.children[0].focus();
        }
        libraryBase.jspreadsheet.tmpElement = null;
    }
};

const cutControls = function (e) {
    if (libraryBase.jspreadsheet.current) {
        if (!libraryBase.jspreadsheet.current.edition) {
            copy.call(libraryBase.jspreadsheet.current, true, undefined, undefined, undefined, undefined, true);
            if (libraryBase.jspreadsheet.current.options.editable != false) {
                libraryBase.jspreadsheet.current.setValue(
                    libraryBase.jspreadsheet.current.highlighted.map(function (record) {
                        return record.element;
                    }),
                    ''
                );
            }
        }
    }
};

const copyControls = function (e) {
    if (libraryBase.jspreadsheet.current && copyControls.enabled) {
        if (!libraryBase.jspreadsheet.current.edition) {
            copy.call(libraryBase.jspreadsheet.current, true);
        }
    }
};

const isMac = function () {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
};

const isCtrl = function (e) {
    if (isMac()) {
        return e.metaKey;
    } else {
        return e.ctrlKey;
    }
};

const keyDownControls = function (e) {
    if (libraryBase.jspreadsheet.current) {
        if (libraryBase.jspreadsheet.current.edition) {
            if (e.which == 27) {
                // Escape
                if (libraryBase.jspreadsheet.current.edition) {
                    // Exit without saving
                    closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], false);
                }
                e.preventDefault();
            } else if (e.which == 13) {
                // Enter
                if (
                    libraryBase.jspreadsheet.current.options.columns &&
                    libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]] &&
                    libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]].type == 'calendar'
                ) {
                    closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], true);
                } else if (
                    libraryBase.jspreadsheet.current.options.columns &&
                    libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]] &&
                    libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]].type == 'dropdown'
                ) {
                    // Do nothing
                } else {
                    // Alt enter -> do not close editor
                    if (
                        (libraryBase.jspreadsheet.current.options.wordWrap == true ||
                            (libraryBase.jspreadsheet.current.options.columns &&
                                libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]] &&
                                libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]].wordWrap == true) ||
                            (libraryBase.jspreadsheet.current.options.data[libraryBase.jspreadsheet.current.edition[3]][
                                libraryBase.jspreadsheet.current.edition[2]
                            ] &&
                                libraryBase.jspreadsheet.current.options.data[libraryBase.jspreadsheet.current.edition[3]][
                                    libraryBase.jspreadsheet.current.edition[2]
                                ].length > 200)) &&
                        e.altKey
                    ) {
                        // Add new line to the editor
                        const editorTextarea = libraryBase.jspreadsheet.current.edition[0].children[0];
                        let editorValue = libraryBase.jspreadsheet.current.edition[0].children[0].value;
                        const editorIndexOf = editorTextarea.selectionStart;
                        editorValue = editorValue.slice(0, editorIndexOf) + '\n' + editorValue.slice(editorIndexOf);
                        editorTextarea.value = editorValue;
                        editorTextarea.focus();
                        editorTextarea.selectionStart = editorIndexOf + 1;
                        editorTextarea.selectionEnd = editorIndexOf + 1;
                    } else {
                        libraryBase.jspreadsheet.current.edition[0].children[0].blur();
                    }
                }
            } else if (e.which == 9) {
                // Tab
                if (
                    libraryBase.jspreadsheet.current.options.columns &&
                    libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]] &&
                    ['calendar', 'html'].includes(libraryBase.jspreadsheet.current.options.columns[libraryBase.jspreadsheet.current.edition[2]].type)
                ) {
                    closeEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.edition[0], true);
                } else {
                    libraryBase.jspreadsheet.current.edition[0].children[0].blur();
                }
            }
        }

        if (!libraryBase.jspreadsheet.current.edition && libraryBase.jspreadsheet.current.selectedCell) {
            // Which key
            if (e.which == 37) {
                left.call(libraryBase.jspreadsheet.current, e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 39) {
                right.call(libraryBase.jspreadsheet.current, e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 38) {
                up.call(libraryBase.jspreadsheet.current, e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 40) {
                down.call(libraryBase.jspreadsheet.current, e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 36) {
                first.call(libraryBase.jspreadsheet.current, e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 35) {
                last.call(libraryBase.jspreadsheet.current, e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 46 || e.which == 8) {
                // Delete
                if (libraryBase.jspreadsheet.current.options.editable != false) {
                    if (libraryBase.jspreadsheet.current.selectedRow != null) {
                        if (libraryBase.jspreadsheet.current.options.allowDeleteRow != false) {
                            if (confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Are you sure to delete the selected rows?'))) {
                                libraryBase.jspreadsheet.current.deleteRow();
                            }
                        }
                    } else if (libraryBase.jspreadsheet.current.selectedHeader) {
                        if (libraryBase.jspreadsheet.current.options.allowDeleteColumn != false) {
                            if (confirm(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Are you sure to delete the selected columns?'))) {
                                libraryBase.jspreadsheet.current.deleteColumn();
                            }
                        }
                    } else {
                        // Change value
                        libraryBase.jspreadsheet.current.setValue(
                            libraryBase.jspreadsheet.current.highlighted.map(function (record) {
                                return record.element;
                            }),
                            ''
                        );
                    }
                }
            } else if (e.which == 13) {
                // Move cursor
                if (e.shiftKey) {
                    up.call(libraryBase.jspreadsheet.current);
                } else {
                    if (libraryBase.jspreadsheet.current.options.allowInsertRow != false) {
                        if (libraryBase.jspreadsheet.current.options.allowManualInsertRow != false) {
                            if (libraryBase.jspreadsheet.current.selectedCell[1] == libraryBase.jspreadsheet.current.options.data.length - 1) {
                                // New record in case selectedCell in the last row
                                libraryBase.jspreadsheet.current.insertRow();
                            }
                        }
                    }

                    down.call(libraryBase.jspreadsheet.current);
                }
                e.preventDefault();
            } else if (e.which == 9) {
                // Tab
                if (e.shiftKey) {
                    left.call(libraryBase.jspreadsheet.current);
                } else {
                    if (libraryBase.jspreadsheet.current.options.allowInsertColumn != false) {
                        if (libraryBase.jspreadsheet.current.options.allowManualInsertColumn != false) {
                            if (libraryBase.jspreadsheet.current.selectedCell[0] == libraryBase.jspreadsheet.current.options.data[0].length - 1) {
                                // New record in case selectedCell in the last column
                                libraryBase.jspreadsheet.current.insertColumn();
                            }
                        }
                    }

                    right.call(libraryBase.jspreadsheet.current);
                }
                e.preventDefault();
            } else {
                if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
                    if (e.which == 65) {
                        // Ctrl + A
                        selectAll.call(libraryBase.jspreadsheet.current);
                        e.preventDefault();
                    } else if (e.which == 83) {
                        // Ctrl + S
                        libraryBase.jspreadsheet.current.download();
                        e.preventDefault();
                    } else if (e.which == 89) {
                        // Ctrl + Y
                        libraryBase.jspreadsheet.current.redo();
                        e.preventDefault();
                    } else if (e.which == 90) {
                        // Ctrl + Z
                        libraryBase.jspreadsheet.current.undo();
                        e.preventDefault();
                    } else if (e.which == 67) {
                        // Ctrl + C
                        copy.call(libraryBase.jspreadsheet.current, true);
                        e.preventDefault();
                    } else if (e.which == 88) {
                        // Ctrl + X
                        if (libraryBase.jspreadsheet.current.options.editable != false) {
                            cutControls();
                        } else {
                            copyControls();
                        }
                        e.preventDefault();
                    } else if (e.which == 86) {
                        // Ctrl + V
                        pasteControls();
                    }
                } else {
                    if (libraryBase.jspreadsheet.current.selectedCell) {
                        if (libraryBase.jspreadsheet.current.options.editable != false) {
                            const rowId = libraryBase.jspreadsheet.current.selectedCell[1];
                            const columnId = libraryBase.jspreadsheet.current.selectedCell[0];

                            // Characters able to start a edition
                            if (e.keyCode == 32) {
                                // Space
                                e.preventDefault();
                                if (
                                    libraryBase.jspreadsheet.current.options.columns[columnId].type == 'checkbox' ||
                                    libraryBase.jspreadsheet.current.options.columns[columnId].type == 'radio'
                                ) {
                                    setCheckRadioValue.call(libraryBase.jspreadsheet.current);
                                } else {
                                    // Start edition
                                    openEditor.call(
                                        libraryBase.jspreadsheet.current,
                                        libraryBase.jspreadsheet.current.records[rowId][columnId].element,
                                        true,
                                        e
                                    );
                                }
                            } else if (e.keyCode == 113) {
                                // Start edition with current content F2
                                openEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.records[rowId][columnId].element, false, e);
                            } else if ((e.key.length === 1 || e.key === 'Process') && !(e.altKey || isCtrl(e))) {
                                // Start edition
                                openEditor.call(libraryBase.jspreadsheet.current, libraryBase.jspreadsheet.current.records[rowId][columnId].element, true, e);
                                // Prevent entries in the calendar
                                if (
                                    libraryBase.jspreadsheet.current.options.columns &&
                                    libraryBase.jspreadsheet.current.options.columns[columnId] &&
                                    libraryBase.jspreadsheet.current.options.columns[columnId].type == 'calendar'
                                ) {
                                    e.preventDefault();
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (e.target.classList.contains('jss_search')) {
                if (libraryBase.jspreadsheet.timeControl) {
                    clearTimeout(libraryBase.jspreadsheet.timeControl);
                }

                libraryBase.jspreadsheet.timeControl = setTimeout(function () {
                    libraryBase.jspreadsheet.current.search(e.target.value);
                }, 200);
            }
        }
    }
};

const wheelControls = function (e) {
    const obj = this;

    if (obj.options.lazyLoading == true) {
        if (libraryBase.jspreadsheet.timeControlLoading == null) {
            libraryBase.jspreadsheet.timeControlLoading = setTimeout(function () {
                if (obj.content.scrollTop + obj.content.clientHeight >= obj.content.scrollHeight - 10) {
                    if (loadDown.call(obj)) {
                        if (obj.content.scrollTop + obj.content.clientHeight > obj.content.scrollHeight - 10) {
                            obj.content.scrollTop = obj.content.scrollTop - obj.content.clientHeight;
                        }
                        updateCornerPosition.call(obj);
                    }
                } else if (obj.content.scrollTop <= obj.content.clientHeight) {
                    if (loadUp.call(obj)) {
                        if (obj.content.scrollTop < 10) {
                            obj.content.scrollTop = obj.content.scrollTop + obj.content.clientHeight;
                        }
                        updateCornerPosition.call(obj);
                    }
                }

                libraryBase.jspreadsheet.timeControlLoading = null;
            }, 100);
        }
    }
};

let scrollLeft = 0;

const updateFreezePosition = function () {
    const obj = this;

    scrollLeft = obj.content.scrollLeft;
    let width = 0;
    if (scrollLeft > 50) {
        for (let i = 0; i < obj.options.freezeColumns; i++) {
            if (i > 0) {
                // Must check if the previous column is hidden or not to determin whether the width shoule be added or not!
                if (!obj.options.columns || !obj.options.columns[i - 1] || obj.options.columns[i - 1].type !== 'hidden') {
                    let columnWidth;
                    if (obj.options.columns && obj.options.columns[i - 1] && obj.options.columns[i - 1].width !== undefined) {
                        columnWidth = parseInt(obj.options.columns[i - 1].width);
                    } else {
                        columnWidth = obj.options.defaultColWidth !== undefined ? parseInt(obj.options.defaultColWidth) : 100;
                    }

                    width += parseInt(columnWidth);
                }
            }
            obj.headers[i].classList.add('jss_freezed');
            obj.headers[i].style.left = width + 'px';
            for (let j = 0; j < obj.rows.length; j++) {
                if (obj.rows[j] && obj.records[j][i]) {
                    const shifted = scrollLeft + (i > 0 ? obj.records[j][i - 1].element.style.width : 0) - 51 + 'px';
                    obj.records[j][i].element.classList.add('jss_freezed');
                    obj.records[j][i].element.style.left = shifted;
                }
            }
        }
    } else {
        for (let i = 0; i < obj.options.freezeColumns; i++) {
            obj.headers[i].classList.remove('jss_freezed');
            obj.headers[i].style.left = '';
            for (let j = 0; j < obj.rows.length; j++) {
                if (obj.records[j][i]) {
                    obj.records[j][i].element.classList.remove('jss_freezed');
                    obj.records[j][i].element.style.left = '';
                }
            }
        }
    }

    // Place the corner in the correct place
    updateCornerPosition.call(obj);
};

const scrollControls = function (e) {
    const obj = this;

    wheelControls.call(obj);

    if (obj.options.freezeColumns > 0 && obj.content.scrollLeft != scrollLeft) {
        updateFreezePosition.call(obj);
    }

    // Close editor
    if (obj.options.lazyLoading == true || obj.options.tableOverflow == true) {
        if (obj.edition && e.target.className.substr(0, 9) != 'jdropdown') {
            closeEditor.call(obj, obj.edition[0], true);
        }
    }
};

const setEvents = function (root) {
    destroyEvents(root);
    root.addEventListener('mouseup', mouseUpControls);
    root.addEventListener('mousedown', mouseDownControls);
    root.addEventListener('mousemove', mouseMoveControls);
    root.addEventListener('mouseover', mouseOverControls);
    root.addEventListener('dblclick', doubleClickControls);
    root.addEventListener('paste', pasteControls);
    root.addEventListener('contextmenu', contextMenuControls);
    root.addEventListener('touchstart', touchStartControls);
    root.addEventListener('touchend', touchEndControls);
    root.addEventListener('touchcancel', touchEndControls);
    root.addEventListener('touchmove', touchEndControls);
    document.addEventListener('keydown', keyDownControls);
};

const destroyEvents = function (root) {
    root.removeEventListener('mouseup', mouseUpControls);
    root.removeEventListener('mousedown', mouseDownControls);
    root.removeEventListener('mousemove', mouseMoveControls);
    root.removeEventListener('mouseover', mouseOverControls);
    root.removeEventListener('dblclick', doubleClickControls);
    root.removeEventListener('paste', pasteControls);
    root.removeEventListener('contextmenu', contextMenuControls);
    root.removeEventListener('touchstart', touchStartControls);
    root.removeEventListener('touchend', touchEndControls);
    root.removeEventListener('touchcancel', touchEndControls);
    document.removeEventListener('keydown', keyDownControls);
};

;// ./src/utils/data.js









const setData = function (data) {
    const obj = this;

    // Update data
    if (data) {
        obj.options.data = data;
    }

    // Data
    if (!obj.options.data) {
        obj.options.data = [];
    }

    // Prepare data
    if (obj.options.data && obj.options.data[0]) {
        if (!Array.isArray(obj.options.data[0])) {
            data = [];
            for (let j = 0; j < obj.options.data.length; j++) {
                const row = [];
                for (let i = 0; i < obj.options.columns.length; i++) {
                    row[i] = obj.options.data[j][obj.options.columns[i].name];
                }
                data.push(row);
            }

            obj.options.data = data;
        }
    }

    // Adjust minimal dimensions
    let j = 0;
    let i = 0;
    const size_i = (obj.options.columns && obj.options.columns.length) || 0;
    const size_j = obj.options.data.length;
    const min_i = obj.options.minDimensions[0];
    const min_j = obj.options.minDimensions[1];
    const max_i = min_i > size_i ? min_i : size_i;
    const max_j = min_j > size_j ? min_j : size_j;

    for (j = 0; j < max_j; j++) {
        for (i = 0; i < max_i; i++) {
            if (obj.options.data[j] == undefined) {
                obj.options.data[j] = [];
            }

            if (obj.options.data[j][i] == undefined) {
                obj.options.data[j][i] = '';
            }
        }
    }

    // Reset containers
    obj.rows = [];
    obj.results = null;
    obj.records = [];
    obj.history = [];

    // Reset internal controllers
    obj.historyIndex = -1;

    // Reset data
    obj.tbody.innerHTML = '';

    let startNumber;
    let finalNumber;

    // Lazy loading
    if (obj.options.lazyLoading == true) {
        // Load only 100 records
        startNumber = 0;
        finalNumber = obj.options.data.length < 100 ? obj.options.data.length : 100;

        if (obj.options.pagination) {
            obj.options.pagination = false;
            console.error('Jspreadsheet: Pagination will be disable due the lazyLoading');
        }
    } else if (obj.options.pagination) {
        // Pagination
        if (!obj.pageNumber) {
            obj.pageNumber = 0;
        }
        var quantityPerPage = obj.options.pagination;
        startNumber = obj.options.pagination * obj.pageNumber;
        finalNumber = obj.options.pagination * obj.pageNumber + obj.options.pagination;

        if (obj.options.data.length < finalNumber) {
            finalNumber = obj.options.data.length;
        }
    } else {
        startNumber = 0;
        finalNumber = obj.options.data.length;
    }

    // Append nodes to the HTML
    for (j = 0; j < obj.options.data.length; j++) {
        // Create row
        const row = createRow.call(obj, j, obj.options.data[j]);
        // Append line to the table
        if (j >= startNumber && j < finalNumber) {
            obj.tbody.appendChild(row.element);
        }
    }

    if (obj.options.lazyLoading == true) {
        // Do not create pagination with lazyloading activated
    } else if (obj.options.pagination) {
        updatePagination.call(obj);
    }

    // Merge cells
    if (obj.options.mergeCells) {
        const keys = Object.keys(obj.options.mergeCells);
        for (let i = 0; i < keys.length; i++) {
            const num = obj.options.mergeCells[keys[i]];
            setMerge.call(obj, keys[i], num[0], num[1], 1);
        }
    }

    // Updata table with custom configurations if applicable
    updateTable.call(obj);
};

/**
 * Get the value from a cell
 *
 * @param object cell
 * @return string value
 */
const getValue = function (cell, processedValue) {
    const obj = this;

    let x;
    let y;

    if (typeof cell !== 'string') {
        return null;
    }

    cell = getIdFromColumnName(cell, true);
    x = cell[0];
    y = cell[1];

    let value = null;

    if (x != null && y != null) {
        if (obj.records[y] && obj.records[y][x] && processedValue) {
            value = obj.records[y][x].element.innerHTML;
        } else {
            if (obj.options.data[y] && obj.options.data[y][x] != 'undefined') {
                value = obj.options.data[y][x];
            }
        }
    }

    return value;
};

/**
 * Get the value from a coords
 *
 * @param int x
 * @param int y
 * @return string value
 */
const getValueFromCoords = function (x, y, processedValue) {
    const obj = this;

    let value = null;

    if (x != null && y != null) {
        if (obj.records[y] && obj.records[y][x] && processedValue) {
            value = obj.records[y][x].element.innerHTML;
        } else {
            if (obj.options.data[y] && obj.options.data[y][x] != 'undefined') {
                value = obj.options.data[y][x];
            }
        }
    }

    return value;
};

/**
 * Set a cell value
 *
 * @param mixed cell destination cell
 * @param string value value
 * @return void
 */
const setValue = function (cell, value, force) {
    const obj = this;

    const records = [];

    if (typeof cell == 'string') {
        const columnId = getIdFromColumnName(cell, true);
        const x = columnId[0];
        const y = columnId[1];

        // Update cell
        records.push(updateCell.call(obj, x, y, value, force));

        // Update all formulas in the chain
        updateFormulaChain.call(obj, x, y, records);
    } else {
        let x = null;
        let y = null;
        if (cell && cell.getAttribute) {
            x = cell.getAttribute('data-x');
            y = cell.getAttribute('data-y');
        }

        // Update cell
        if (x != null && y != null) {
            records.push(updateCell.call(obj, x, y, value, force));

            // Update all formulas in the chain
            updateFormulaChain.call(obj, x, y, records);
        } else {
            const keys = Object.keys(cell);
            if (keys.length > 0) {
                for (let i = 0; i < keys.length; i++) {
                    let x, y;

                    if (typeof cell[i] == 'string') {
                        const columnId = getIdFromColumnName(cell[i], true);
                        x = columnId[0];
                        y = columnId[1];
                    } else {
                        if (cell[i].x != null && cell[i].y != null) {
                            x = cell[i].x;
                            y = cell[i].y;
                            // Flexible setup
                            if (cell[i].value != null) {
                                value = cell[i].value;
                            }
                        } else {
                            x = cell[i].getAttribute('data-x');
                            y = cell[i].getAttribute('data-y');
                        }
                    }

                    // Update cell
                    if (x != null && y != null) {
                        records.push(updateCell.call(obj, x, y, value, force));

                        // Update all formulas in the chain
                        updateFormulaChain.call(obj, x, y, records);
                    }
                }
            }
        }
    }

    // Update history
    setHistory.call(obj, {
        action: 'setValue',
        records: records,
        selection: obj.selectedCell,
    });

    // Update table with custom configurations if applicable
    updateTable.call(obj);

    // On after changes
    const onafterchangesRecords = records.map(function (record) {
        return {
            x: record.x,
            y: record.y,
            value: record.value,
            oldValue: record.oldValue,
        };
    });

    utils_dispatch.call(obj, 'onafterchanges', obj, onafterchangesRecords);
};

/**
 * Set a cell value based on coordinates
 *
 * @param int x destination cell
 * @param int y destination cell
 * @param string value
 * @return void
 */
const setValueFromCoords = function (x, y, value, force) {
    const obj = this;

    const records = [];
    records.push(updateCell.call(obj, x, y, value, force));

    // Update all formulas in the chain
    updateFormulaChain.call(obj, x, y, records);

    // Update history
    setHistory.call(obj, {
        action: 'setValue',
        records: records,
        selection: obj.selectedCell,
    });

    // Update table with custom configurations if applicable
    updateTable.call(obj);

    // On after changes
    const onafterchangesRecords = records.map(function (record) {
        return {
            x: record.x,
            y: record.y,
            value: record.value,
            oldValue: record.oldValue,
        };
    });

    utils_dispatch.call(obj, 'onafterchanges', obj, onafterchangesRecords);
};

/**
 * Get the whole table data
 *
 * @param bool get highlighted cells only
 * @return array data
 */
const getData = function (highlighted, processed, delimiter, asJson) {
    const obj = this;

    // Control vars
    const dataset = [];
    let px = 0;
    let py = 0;

    // Column and row length
    const x = Math.max(
        ...obj.options.data.map(function (row) {
            return row.length;
        })
    );
    const y = obj.options.data.length;

    // Go through the columns to get the data
    for (let j = 0; j < y; j++) {
        px = 0;
        for (let i = 0; i < x; i++) {
            // Cell selected or fullset
            if (!highlighted || obj.records[j][i].element.classList.contains('highlight')) {
                // Get value
                if (!dataset[py]) {
                    dataset[py] = [];
                }
                if (processed) {
                    dataset[py][px] = obj.records[j][i].element.innerHTML;
                } else {
                    dataset[py][px] = obj.options.data[j][i];
                }
                px++;
            }
        }
        if (px > 0) {
            py++;
        }
    }

    if (delimiter) {
        return (
            dataset
                .map(function (row) {
                    return row.join(delimiter);
                })
                .join('\r\n') + '\r\n'
        );
    }

    if (asJson) {
        return dataset.map(function (row) {
            const resultRow = {};

            row.forEach(function (item, index) {
                resultRow[index] = item;
            });

            return resultRow;
        });
    }

    return dataset;
};

const getDataFromRange = function (range, processed) {
    const obj = this;

    const coords = getCoordsFromRange(range);

    const dataset = [];

    for (let y = coords[1]; y <= coords[3]; y++) {
        dataset.push([]);

        for (let x = coords[0]; x <= coords[2]; x++) {
            if (processed) {
                dataset[dataset.length - 1].push(obj.records[y][x].element.innerHTML);
            } else {
                dataset[dataset.length - 1].push(obj.options.data[y][x]);
            }
        }
    }

    return dataset;
};

;// ./src/utils/search.js





/**
 * Search
 */
const search = function (query) {
    const obj = this;

    // Reset any filter
    if (obj.options.filters) {
        resetFilters.call(obj);
    }

    // Reset selection
    obj.resetSelection();

    // Total of results
    obj.pageNumber = 0;
    obj.results = [];

    if (query) {
        if (obj.searchInput.value !== query) {
            obj.searchInput.value = query;
        }

        // Search filter
        const search = function (item, query, index) {
            for (let i = 0; i < item.length; i++) {
                if (('' + item[i]).toLowerCase().search(query) >= 0 || ('' + obj.records[index][i].element.innerHTML).toLowerCase().search(query) >= 0) {
                    return true;
                }
            }
            return false;
        };

        // Result
        const addToResult = function (k) {
            if (obj.results.indexOf(k) == -1) {
                obj.results.push(k);
            }
        };

        let parsedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        parsedQuery = new RegExp(parsedQuery, 'i');

        // Filter
        obj.options.data.forEach(function (v, k) {
            if (search(v, parsedQuery, k)) {
                // Merged rows found
                const rows = isRowMerged.call(obj, k);
                if (rows.length) {
                    for (let i = 0; i < rows.length; i++) {
                        const row = getIdFromColumnName(rows[i], true);
                        for (let j = 0; j < obj.options.mergeCells[rows[i]][1]; j++) {
                            addToResult(row[1] + j);
                        }
                    }
                } else {
                    // Normal row found
                    addToResult(k);
                }
            }
        });
    } else {
        obj.results = null;
    }

    updateResult.call(obj);
};

/**
 * Reset search
 */
const resetSearch = function () {
    const obj = this;

    obj.searchInput.value = '';
    obj.search('');
    obj.results = null;
};

;// ./src/utils/headers.js




/**
 * Get the column title
 *
 * @param column - column number (first column is: 0)
 * @param title - new column title
 */
const getHeader = function (column) {
    const obj = this;

    return obj.headers[column].textContent;
};

/**
 * Get the headers
 *
 * @param asArray
 * @return mixed
 */
const getHeaders = function (asArray) {
    const obj = this;

    const title = [];

    for (let i = 0; i < obj.headers.length; i++) {
        title.push(obj.getHeader(i));
    }

    return asArray ? title : title.join(obj.options.csvDelimiter);
};

/**
 * Set the column title
 *
 * @param column - column number (first column is: 0)
 * @param title - new column title
 */
const setHeader = function (column, newValue) {
    const obj = this;

    if (obj.headers[column]) {
        const oldValue = obj.headers[column].textContent;
        const onchangeheaderOldValue = (obj.options.columns && obj.options.columns[column] && obj.options.columns[column].title) || '';

        if (!newValue) {
            newValue = getColumnName(column);
        }

        obj.headers[column].textContent = newValue;
        // Keep the title property
        obj.headers[column].setAttribute('title', newValue);
        // Update title
        if (!obj.options.columns) {
            obj.options.columns = [];
        }
        if (!obj.options.columns[column]) {
            obj.options.columns[column] = {};
        }
        obj.options.columns[column].title = newValue;

        setHistory.call(obj, {
            action: 'setHeader',
            column: column,
            oldValue: oldValue,
            newValue: newValue,
        });

        // On onchange header
        utils_dispatch.call(obj, 'onchangeheader', obj, parseInt(column), newValue, onchangeheaderOldValue);
    }
};

;// ./src/utils/style.js




/**
 * Get style information from cell(s)
 *
 * @return integer
 */
const getStyle = function (cell, key) {
    const obj = this;

    // Cell
    if (!cell) {
        // Control vars
        const data = {};

        // Column and row length
        const x = obj.options.data[0].length;
        const y = obj.options.data.length;

        // Go through the columns to get the data
        for (let j = 0; j < y; j++) {
            for (let i = 0; i < x; i++) {
                // Value
                const v = key ? obj.records[j][i].element.style[key] : obj.records[j][i].element.getAttribute('style');

                // Any meta data for this column?
                if (v) {
                    // Column name
                    const k = getColumnNameFromId([i, j]);
                    // Value
                    data[k] = v;
                }
            }
        }

        return data;
    } else {
        cell = getIdFromColumnName(cell, true);

        return key ? obj.records[cell[1]][cell[0]].element.style[key] : obj.records[cell[1]][cell[0]].element.getAttribute('style');
    }
};

/**
 * Set meta information to cell(s)
 *
 * @return integer
 */
const setStyle = function (o, k, v, force, ignoreHistoryAndEvents) {
    const obj = this;

    const newValue = {};
    const oldValue = {};

    // Apply style
    const applyStyle = function (cellId, key, value) {
        // Position
        const cell = getIdFromColumnName(cellId, true);

        if (obj.records[cell[1]] && obj.records[cell[1]][cell[0]] && (obj.records[cell[1]][cell[0]].element.classList.contains('readonly') == false || force)) {
            // Current value
            const currentValue = obj.records[cell[1]][cell[0]].element.style[key];

            // Change layout
            if (currentValue == value && !force) {
                value = '';
                obj.records[cell[1]][cell[0]].element.style[key] = '';
            } else {
                obj.records[cell[1]][cell[0]].element.style[key] = value;
            }

            // History
            if (!oldValue[cellId]) {
                oldValue[cellId] = [];
            }
            if (!newValue[cellId]) {
                newValue[cellId] = [];
            }

            oldValue[cellId].push([key + ':' + currentValue]);
            newValue[cellId].push([key + ':' + value]);
        }
    };

    if (k && v) {
        // Get object from string
        if (typeof o == 'string') {
            applyStyle(o, k, v);
        }
    } else {
        const keys = Object.keys(o);
        for (let i = 0; i < keys.length; i++) {
            let style = o[keys[i]];
            if (typeof style == 'string') {
                style = style.split(';');
            }
            for (let j = 0; j < style.length; j++) {
                if (typeof style[j] == 'string') {
                    style[j] = style[j].split(':');
                }
                // Apply value
                if (style[j][0].trim()) {
                    applyStyle(keys[i], style[j][0].trim(), style[j][1]);
                }
            }
        }
    }

    let keys = Object.keys(oldValue);
    for (let i = 0; i < keys.length; i++) {
        oldValue[keys[i]] = oldValue[keys[i]].join(';');
    }
    keys = Object.keys(newValue);
    for (let i = 0; i < keys.length; i++) {
        newValue[keys[i]] = newValue[keys[i]].join(';');
    }

    if (!ignoreHistoryAndEvents) {
        // Keeping history of changes
        setHistory.call(obj, {
            action: 'setStyle',
            oldValue: oldValue,
            newValue: newValue,
        });
    }

    utils_dispatch.call(obj, 'onchangestyle', obj, newValue);
};

const resetStyle = function (o, ignoreHistoryAndEvents) {
    const obj = this;

    const keys = Object.keys(o);
    for (let i = 0; i < keys.length; i++) {
        // Position
        const cell = getIdFromColumnName(keys[i], true);
        if (obj.records[cell[1]] && obj.records[cell[1]][cell[0]]) {
            obj.records[cell[1]][cell[0]].element.setAttribute('style', '');
        }
    }
    obj.setStyle(o, null, null, null, ignoreHistoryAndEvents);
};

;// ./src/utils/download.js


/**
 * Download CSV table
 *
 * @return null
 */
const download = function (includeHeaders, processed) {
    const obj = this;

    if (obj.parent.config.allowExport == false) {
        console.error('Export not allowed');
    } else {
        // Data
        let data = '';

        // Get data
        data += copy.call(obj, false, obj.options.csvDelimiter, true, includeHeaders, true, undefined, processed);

        // Download element
        const blob = new Blob(['\uFEFF' + data], { type: 'text/csv;charset=utf-8;' });

        // IE Compatibility
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, (obj.options.csvFileName || obj.options.worksheetName) + '.csv');
        } else {
            // Download element
            const pom = document.createElement('a');
            pom.setAttribute('target', '_top');
            const url = URL.createObjectURL(blob);
            pom.href = url;
            pom.setAttribute('download', (obj.options.csvFileName || obj.options.worksheetName) + '.csv');
            document.body.appendChild(pom);
            pom.click();
            pom.parentNode.removeChild(pom);
        }
    }
};

;// ./src/utils/comments.js





/**
 * Get cell comments, null cell for all
 */
const getComments = function (cell) {
    const obj = this;

    if (cell) {
        if (typeof cell !== 'string') {
            return getComments.call(obj);
        }

        cell = getIdFromColumnName(cell, true);

        return obj.records[cell[1]][cell[0]].element.getAttribute('title') || '';
    } else {
        const data = {};
        for (let j = 0; j < obj.options.data.length; j++) {
            for (let i = 0; i < obj.options.columns.length; i++) {
                const comments = obj.records[j][i].element.getAttribute('title');
                if (comments) {
                    const cell = getColumnNameFromId([i, j]);
                    data[cell] = comments;
                }
            }
        }
        return data;
    }
};

/**
 * Set cell comments
 */
const setComments = function (cellId, comments) {
    const obj = this;

    let commentsObj;

    if (typeof cellId == 'string') {
        commentsObj = { [cellId]: comments };
    } else {
        commentsObj = cellId;
    }

    const oldValue = {};

    Object.entries(commentsObj).forEach(function ([cellName, comment]) {
        const cellCoords = getCoordsFromCellName(cellName);

        // Keep old value
        oldValue[cellName] = obj.records[cellCoords[1]][cellCoords[0]].element.getAttribute('title');

        // Set new values
        obj.records[cellCoords[1]][cellCoords[0]].element.setAttribute('title', comment ? comment : '');

        // Remove class if there is no comment
        if (comment) {
            obj.records[cellCoords[1]][cellCoords[0]].element.classList.add('jss_comments');

            if (!obj.options.comments) {
                obj.options.comments = {};
            }

            obj.options.comments[cellName] = comment;
        } else {
            obj.records[cellCoords[1]][cellCoords[0]].element.classList.remove('jss_comments');

            if (obj.options.comments && obj.options.comments[cellName]) {
                delete obj.options.comments[cellName];
            }
        }
    });

    // Save history
    setHistory.call(obj, {
        action: 'setComments',
        newValue: commentsObj,
        oldValue: oldValue,
    });

    // Set comments
    utils_dispatch.call(obj, 'oncomments', obj, commentsObj, oldValue);
};

;// ./src/utils/config.js
/**
 * Get table config information
 */
const getWorksheetConfig = function () {
    const obj = this;

    return obj.options;
};

const getSpreadsheetConfig = function () {
    const spreadsheet = this;

    return spreadsheet.config;
};

const setConfig = function (config, spreadsheetLevel) {
    const obj = this;

    const keys = Object.keys(config);

    let spreadsheet;

    if (!obj.parent) {
        spreadsheetLevel = true;

        spreadsheet = obj;
    } else {
        spreadsheet = obj.parent;
    }

    keys.forEach(function (key) {
        if (spreadsheetLevel) {
            spreadsheet.config[key] = config[key];

            if (key === 'toolbar') {
                if (config[key] === true) {
                    spreadsheet.showToolbar();
                } else if (config[key] === false) {
                    spreadsheet.hideToolbar();
                }
            }
        } else {
            obj.options[key] = config[key];
        }
    });
};

;// ./src/utils/cells.js


const setReadOnly = function (cell, state) {
    const obj = this;

    let record;

    if (typeof cell === 'string') {
        const coords = getCoordsFromCellName(cell);

        record = obj.records[coords[1]][coords[0]];
    } else {
        const x = parseInt(cell.getAttribute('data-x'));
        const y = parseInt(cell.getAttribute('data-y'));

        record = obj.records[y][x];
    }

    if (state) {
        record.element.classList.add('readonly');
    } else {
        record.element.classList.remove('readonly');
    }
};

const isReadOnly = function (x, y) {
    const obj = this;

    if (typeof x === 'string' && typeof y === 'undefined') {
        const coords = getCoordsFromCellName(x);

        [x, y] = coords;
    }

    return obj.records[y][x].element.classList.contains('readonly');
};

;// ./src/utils/worksheets.js






























const setWorksheetFunctions = function (worksheet) {
    for (let i = 0; i < worksheetPublicMethodsLength; i++) {
        const [methodName, method] = worksheetPublicMethods[i];

        worksheet[methodName] = method.bind(worksheet);
    }
};

const createTable = function () {
    let obj = this;

    setWorksheetFunctions(obj);

    // Elements
    obj.table = document.createElement('table');
    obj.thead = document.createElement('thead');
    obj.tbody = document.createElement('tbody');

    // Create headers controllers
    obj.headers = [];
    obj.cols = [];

    // Create table container
    obj.content = document.createElement('div');
    obj.content.classList.add('jss_content');
    obj.content.onscroll = function (e) {
        scrollControls.call(obj, e);
    };
    obj.content.onwheel = function (e) {
        wheelControls.call(obj, e);
    };

    // Search
    const searchContainer = document.createElement('div');

    const searchLabel = document.createElement('label');
    searchLabel.innerHTML = __WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Search') + ': ';
    searchContainer.appendChild(searchLabel);

    obj.searchInput = document.createElement('input');
    obj.searchInput.classList.add('jss_search');
    searchLabel.appendChild(obj.searchInput);
    obj.searchInput.onfocus = function () {
        obj.resetSelection();
    };

    // Pagination select option
    const paginationUpdateContainer = document.createElement('div');

    if (obj.options.pagination > 0 && obj.options.paginationOptions && obj.options.paginationOptions.length > 0) {
        obj.paginationDropdown = document.createElement('select');
        obj.paginationDropdown.classList.add('jss_pagination_dropdown');
        obj.paginationDropdown.onchange = function () {
            obj.options.pagination = parseInt(this.value);
            obj.page(0);
        };

        for (let i = 0; i < obj.options.paginationOptions.length; i++) {
            const temp = document.createElement('option');
            temp.value = obj.options.paginationOptions[i];
            temp.innerHTML = obj.options.paginationOptions[i];
            obj.paginationDropdown.appendChild(temp);
        }

        // Set initial pagination value
        obj.paginationDropdown.value = obj.options.pagination;

        paginationUpdateContainer.appendChild(document.createTextNode(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('Show ')));
        paginationUpdateContainer.appendChild(obj.paginationDropdown);
        paginationUpdateContainer.appendChild(document.createTextNode(__WEBPACK_EXTERNAL_MODULE_jsuites_default__.translate('entries')));
    }

    // Filter and pagination container
    const filter = document.createElement('div');
    filter.classList.add('jss_filter');
    filter.appendChild(paginationUpdateContainer);
    filter.appendChild(searchContainer);

    // Colsgroup
    obj.colgroupContainer = document.createElement('colgroup');
    let tempCol = document.createElement('col');
    tempCol.setAttribute('width', obj.options.rowHeaderWidth || '50');
    obj.colgroupContainer.appendChild(tempCol);

    // Nested
    if (obj.options.nestedHeaders && obj.options.nestedHeaders.length > 0 && obj.options.nestedHeaders[0] && obj.options.nestedHeaders[0][0]) {
        for (let j = 0; j < obj.options.nestedHeaders.length; j++) {
            obj.thead.appendChild(createNestedHeader.call(obj, obj.options.nestedHeaders[j]));
        }
    }

    // Row
    obj.headerContainer = document.createElement('tr');
    tempCol = document.createElement('td');
    tempCol.classList.add('jss_selectall');
    obj.headerContainer.appendChild(tempCol);

    const numberOfColumns = getNumberOfColumns.call(obj);

    for (let i = 0; i < numberOfColumns; i++) {
        // Create header
        createCellHeader.call(obj, i);
        // Append cell to the container
        obj.headerContainer.appendChild(obj.headers[i]);
        obj.colgroupContainer.appendChild(obj.cols[i].colElement);
    }

    obj.thead.appendChild(obj.headerContainer);

    // Filters
    if (obj.options.filters == true) {
        obj.filter = document.createElement('tr');
        const td = document.createElement('td');
        obj.filter.appendChild(td);

        for (let i = 0; i < obj.options.columns.length; i++) {
            const td = document.createElement('td');
            td.innerHTML = '&nbsp;';
            td.setAttribute('data-x', i);
            td.className = 'jss_column_filter';
            if (obj.options.columns[i].type == 'hidden') {
                td.style.display = 'none';
            }
            obj.filter.appendChild(td);
        }

        obj.thead.appendChild(obj.filter);
    }

    // Content table
    obj.table = document.createElement('table');
    obj.table.classList.add('jss_worksheet');
    obj.table.setAttribute('cellpadding', '0');
    obj.table.setAttribute('cellspacing', '0');
    obj.table.setAttribute('unselectable', 'yes');
    //obj.table.setAttribute('onselectstart', 'return false');
    obj.table.appendChild(obj.colgroupContainer);
    obj.table.appendChild(obj.thead);
    obj.table.appendChild(obj.tbody);

    if (!obj.options.textOverflow) {
        obj.table.classList.add('jss_overflow');
    }

    // Spreadsheet corner
    obj.corner = document.createElement('div');
    obj.corner.className = 'jss_corner';
    obj.corner.setAttribute('unselectable', 'on');
    obj.corner.setAttribute('onselectstart', 'return false');

    if (obj.options.selectionCopy == false) {
        obj.corner.style.display = 'none';
    }

    // Textarea helper
    obj.textarea = document.createElement('textarea');
    obj.textarea.className = 'jss_textarea';
    obj.textarea.id = 'jss_textarea';
    obj.textarea.tabIndex = '-1';
    obj.textarea.ariaHidden = 'true';

    // Powered by Jspreadsheet
    obj.ads = document.createElement('div');
    obj.ads.className = 'jss_about';

    const span = document.createElement('span');
    span.innerHTML = 'Jspreadsheet CE';
    obj.ads.appendChild(span);

    // Create table container TODO: frozen columns
    const container = document.createElement('div');
    container.classList.add('jss_table');

    // Pagination
    obj.pagination = document.createElement('div');
    obj.pagination.classList.add('jss_pagination');
    const paginationInfo = document.createElement('div');
    const paginationPages = document.createElement('div');
    obj.pagination.appendChild(paginationInfo);
    obj.pagination.appendChild(paginationPages);

    // Hide pagination if not in use
    if (!obj.options.pagination) {
        obj.pagination.style.display = 'none';
    }

    // Append containers to the table
    if (obj.options.search == true) {
        obj.element.appendChild(filter);
    }

    // Elements
    obj.content.appendChild(obj.table);
    obj.content.appendChild(obj.corner);
    obj.content.appendChild(obj.textarea);

    obj.element.appendChild(obj.content);
    obj.element.appendChild(obj.pagination);
    obj.element.appendChild(obj.ads);
    obj.element.classList.add('jss_container');

    obj.element.jssWorksheet = obj;
    obj.element.jspreadsheet = obj;

    // Overflow
    if (obj.options.tableOverflow == true) {
        if (obj.options.tableHeight) {
            obj.content.style['overflow-y'] = 'auto';
            obj.content.style['box-shadow'] = 'rgb(221 221 221) 2px 2px 5px 0.1px';
            obj.content.style.maxHeight = typeof obj.options.tableHeight === 'string' ? obj.options.tableHeight : obj.options.tableHeight + 'px';
        }
        if (obj.options.tableWidth) {
            obj.content.style['overflow-x'] = 'auto';
            obj.content.style.width = typeof obj.options.tableWidth === 'string' ? obj.options.tableWidth : obj.options.tableWidth + 'px';
        }
    }

    // With toolbars
    if (obj.options.tableOverflow != true && obj.parent.config.toolbar) {
        obj.element.classList.add('with-toolbar');
    }

    // Actions
    if (obj.options.columnDrag != false) {
        obj.thead.classList.add('draggable');
    }
    if (obj.options.columnResize != false) {
        obj.thead.classList.add('resizable');
    }
    if (obj.options.rowDrag != false) {
        obj.tbody.classList.add('draggable');
    }
    if (obj.options.rowResize != false) {
        obj.tbody.classList.add('resizable');
    }

    // Load data
    obj.setData.call(obj);

    // Style
    if (obj.options.style) {
        obj.setStyle(obj.options.style, null, null, 1, 1);

        delete obj.options.style;
    }

    Object.defineProperty(obj.options, 'style', {
        enumerable: true,
        configurable: true,
        get() {
            return obj.getStyle();
        },
    });

    if (obj.options.comments) {
        obj.setComments(obj.options.comments);
    }

    // Classes
    if (obj.options.classes) {
        const k = Object.keys(obj.options.classes);
        for (let i = 0; i < k.length; i++) {
            const cell = getIdFromColumnName(k[i], true);
            obj.records[cell[1]][cell[0]].element.classList.add(obj.options.classes[k[i]]);
        }
    }
};

/**
 * Prepare the jspreadsheet table
 *
 * @Param config
 */
const prepareTable = function () {
    const obj = this;

    // Lazy loading
    if (obj.options.lazyLoading == true && obj.options.tableOverflow != true && obj.parent.config.fullscreen != true) {
        console.error('Jspreadsheet: The lazyloading only works when tableOverflow = yes or fullscreen = yes');
        obj.options.lazyLoading = false;
    }

    if (!obj.options.columns) {
        obj.options.columns = [];
    }

    // Number of columns
    let size = obj.options.columns.length;
    let keys;

    if (obj.options.data && typeof obj.options.data[0] !== 'undefined') {
        if (!Array.isArray(obj.options.data[0])) {
            // Data keys
            keys = Object.keys(obj.options.data[0]);

            if (keys.length > size) {
                size = keys.length;
            }
        } else {
            const numOfColumns = obj.options.data[0].length;

            if (numOfColumns > size) {
                size = numOfColumns;
            }
        }
    }

    // Minimal dimensions
    if (!obj.options.minDimensions) {
        obj.options.minDimensions = [0, 0];
    }

    if (obj.options.minDimensions[0] > size) {
        size = obj.options.minDimensions[0];
    }

    // Requests
    const multiple = [];

    // Preparations
    for (let i = 0; i < size; i++) {
        // Default column description
        if (!obj.options.columns[i]) {
            obj.options.columns[i] = {};
        }
        if (!obj.options.columns[i].name && keys && keys[i]) {
            obj.options.columns[i].name = keys[i];
        }

        // Pre-load initial source for json dropdown
        if (obj.options.columns[i].type == 'dropdown') {
            // if remote content
            if (obj.options.columns[i].url) {
                multiple.push({
                    url: obj.options.columns[i].url,
                    index: i,
                    method: 'GET',
                    dataType: 'json',
                    success: function (data) {
                        if (!obj.options.columns[this.index].source) {
                            obj.options.columns[this.index].source = [];
                        }

                        for (let i = 0; i < data.length; i++) {
                            obj.options.columns[this.index].source.push(data[i]);
                        }
                    },
                });
            }
        }
    }

    // Create the table when is ready
    if (!multiple.length) {
        createTable.call(obj);
    } else {
        __WEBPACK_EXTERNAL_MODULE_jsuites_default__.ajax(multiple, function () {
            createTable.call(obj);
        });
    }
};

const getNextDefaultWorksheetName = function (spreadsheet) {
    const defaultWorksheetNameRegex = /^Sheet(\d+)$/;

    let largestWorksheetNumber = 0;

    spreadsheet.worksheets.forEach(function (worksheet) {
        const regexResult = defaultWorksheetNameRegex.exec(worksheet.options.worksheetName);
        if (regexResult) {
            largestWorksheetNumber = Math.max(largestWorksheetNumber, parseInt(regexResult[1]));
        }
    });

    return 'Sheet' + (largestWorksheetNumber + 1);
};

const buildWorksheet = async function () {
    const obj = this;
    const el = obj.element;

    const spreadsheet = obj.parent;

    if (typeof spreadsheet.plugins === 'object') {
        Object.entries(spreadsheet.plugins).forEach(function ([, plugin]) {
            if (typeof plugin.beforeinit === 'function') {
                plugin.beforeinit(obj);
            }
        });
    }

    libraryBase.jspreadsheet.current = obj;

    const promises = [];

    // Load the table data based on an CSV file
    if (obj.options.csv) {
        const promise = new Promise((resolve) => {
            // Load CSV file
            __WEBPACK_EXTERNAL_MODULE_jsuites_default__.ajax({
                url: obj.options.csv,
                method: 'GET',
                dataType: 'text',
                success: function (result) {
                    // Convert data
                    const newData = parseCSV(result, obj.options.csvDelimiter);

                    // Headers
                    if (obj.options.csvHeaders == true && newData.length > 0) {
                        const headers = newData.shift();

                        if (headers.length > 0) {
                            if (!obj.options.columns) {
                                obj.options.columns = [];
                            }

                            for (let i = 0; i < headers.length; i++) {
                                if (!obj.options.columns[i]) {
                                    obj.options.columns[i] = {};
                                }
                                // Precedence over pre-configurated titles
                                if (typeof obj.options.columns[i].title === 'undefined') {
                                    obj.options.columns[i].title = headers[i];
                                }
                            }
                        }
                    }
                    // Data
                    obj.options.data = newData;
                    // Prepare table
                    prepareTable.call(obj);

                    resolve();
                },
            });
        });

        promises.push(promise);
    } else if (obj.options.url) {
        const promise = new Promise((resolve) => {
            __WEBPACK_EXTERNAL_MODULE_jsuites_default__.ajax({
                url: obj.options.url,
                method: 'GET',
                dataType: 'json',
                success: function (result) {
                    // Data
                    obj.options.data = result.data ? result.data : result;
                    // Prepare table
                    prepareTable.call(obj);

                    resolve();
                },
            });
        });

        promises.push(promise);
    } else {
        // Prepare table
        prepareTable.call(obj);
    }

    await Promise.all(promises);

    if (typeof spreadsheet.plugins === 'object') {
        Object.entries(spreadsheet.plugins).forEach(function ([, plugin]) {
            if (typeof plugin.init === 'function') {
                plugin.init(obj);
            }
        });
    }
};

const createWorksheetObj = function (options) {
    const obj = this;

    const spreadsheet = obj.parent;

    if (!options.worksheetName) {
        options.worksheetName = getNextDefaultWorksheetName(obj.parent);
    }

    const newWorksheet = {
        parent: spreadsheet,
        options: options,
        filters: [],
        formula: [],
        history: [],
        selection: [],
        historyIndex: -1,
    };

    spreadsheet.config.worksheets.push(newWorksheet.options);
    spreadsheet.worksheets.push(newWorksheet);

    return newWorksheet;
};

const createWorksheet = function (options) {
    const obj = this;
    const spreadsheet = obj.parent;

    spreadsheet.creationThroughJss = true;

    createWorksheetObj.call(obj, options);

    spreadsheet.element.tabs.create(options.worksheetName);
};

const openWorksheet = function (position) {
    const obj = this;
    const spreadsheet = obj.parent;

    spreadsheet.element.tabs.open(position);
};

const deleteWorksheet = function (position) {
    const obj = this;

    obj.parent.element.tabs.remove(position);

    const removedWorksheet = obj.parent.worksheets.splice(position, 1)[0];

    utils_dispatch.call(obj.parent, 'ondeleteworksheet', removedWorksheet, position);
};

const worksheetPublicMethods = [
    ['selectAll', selectAll],
    [
        'updateSelectionFromCoords',
        function (x1, y1, x2, y2) {
            return updateSelectionFromCoords.call(this, x1, y1, x2, y2);
        },
    ],
    [
        'resetSelection',
        function () {
            return resetSelection.call(this);
        },
    ],
    ['getSelection', getSelection],
    ['getSelected', getSelected],
    ['getSelectedColumns', getSelectedColumns],
    ['getSelectedRows', getSelectedRows],
    ['getData', getData],
    ['setData', setData],
    ['getValue', getValue],
    ['getValueFromCoords', getValueFromCoords],
    ['setValue', setValue],
    ['setValueFromCoords', setValueFromCoords],
    ['getWidth', getWidth],
    [
        'setWidth',
        function (column, width) {
            return setWidth.call(this, column, width);
        },
    ],
    ['insertRow', insertRow],
    [
        'moveRow',
        function (rowNumber, newPositionNumber) {
            return moveRow.call(this, rowNumber, newPositionNumber);
        },
    ],
    ['deleteRow', deleteRow],
    ['hideRow', hideRow],
    ['showRow', showRow],
    ['getRowData', getRowData],
    ['setRowData', setRowData],
    ['getHeight', getHeight],
    [
        'setHeight',
        function (row, height) {
            return setHeight.call(this, row, height);
        },
    ],
    ['getMerge', getMerge],
    [
        'setMerge',
        function (cellName, colspan, rowspan) {
            return setMerge.call(this, cellName, colspan, rowspan);
        },
    ],
    [
        'destroyMerge',
        function () {
            return destroyMerge.call(this);
        },
    ],
    [
        'removeMerge',
        function (cellName, data) {
            return removeMerge.call(this, cellName, data);
        },
    ],
    ['search', search],
    ['resetSearch', resetSearch],
    ['getHeader', getHeader],
    ['getHeaders', getHeaders],
    ['setHeader', setHeader],
    ['getStyle', getStyle],
    [
        'setStyle',
        function (cell, property, value, forceOverwrite) {
            return setStyle.call(this, cell, property, value, forceOverwrite);
        },
    ],
    ['resetStyle', resetStyle],
    ['insertColumn', insertColumn],
    ['moveColumn', moveColumn],
    ['deleteColumn', deleteColumn],
    ['getColumnData', getColumnData],
    ['setColumnData', setColumnData],
    ['whichPage', whichPage],
    ['page', page],
    ['download', download],
    ['getComments', getComments],
    ['setComments', setComments],
    ['orderBy', orderBy],
    ['undo', undo],
    ['redo', redo],
    ['getCell', getCell],
    ['getCellFromCoords', getCellFromCoords],
    ['getLabel', getLabel],
    ['getConfig', getWorksheetConfig],
    ['setConfig', setConfig],
    [
        'getMeta',
        function (cell) {
            return getMeta.call(this, cell);
        },
    ],
    ['setMeta', setMeta],
    ['showColumn', showColumn],
    ['hideColumn', hideColumn],
    ['showIndex', showIndex],
    ['hideIndex', hideIndex],
    ['getWorksheetActive', getWorksheetActive],
    ['openEditor', openEditor],
    ['closeEditor', closeEditor],
    ['createWorksheet', createWorksheet],
    ['openWorksheet', openWorksheet],
    ['deleteWorksheet', deleteWorksheet],
    [
        'copy',
        function (cut) {
            if (cut) {
                cutControls();
            } else {
                copy.call(this, true);
            }
        },
    ],
    ['paste', paste],
    ['executeFormula', executeFormula],
    ['getDataFromRange', getDataFromRange],
    ['quantiyOfPages', quantiyOfPages],
    ['getRange', getRange],
    ['isSelected', isSelected],
    ['setReadOnly', setReadOnly],
    ['isReadOnly', isReadOnly],
    ['getHighlighted', getHighlighted],
    ['dispatch', utils_dispatch],
    ['down', down],
    ['first', first],
    ['last', last],
    ['left', left],
    ['right', right],
    ['up', up],
    ['openFilter', openFilter],
    ['resetFilters', resetFilters],
];

const worksheetPublicMethodsLength = worksheetPublicMethods.length;

;// ./src/utils/factory.js











const factory = function () {};

const createWorksheets = async function (spreadsheet, options, el) {
    // Create worksheets
    let o = options.worksheets;
    if (o) {
        let tabsOptions = {
            animation: true,
            onbeforecreate: function (element, title) {
                if (title) {
                    return title;
                } else {
                    return getNextDefaultWorksheetName(spreadsheet);
                }
            },
            oncreate: function (element, newTabContent) {
                if (!spreadsheet.creationThroughJss) {
                    const worksheetName = element.tabs.headers.children[element.tabs.headers.children.length - 2].innerHTML;

                    createWorksheetObj.call(spreadsheet.worksheets[0], {
                        minDimensions: [10, 15],
                        worksheetName: worksheetName,
                    });
                } else {
                    spreadsheet.creationThroughJss = false;
                }

                const newWorksheet = spreadsheet.worksheets[spreadsheet.worksheets.length - 1];

                newWorksheet.element = newTabContent;

                buildWorksheet.call(newWorksheet).then(function () {
                    updateToolbar(newWorksheet);

                    utils_dispatch.call(newWorksheet, 'oncreateworksheet', newWorksheet, options, spreadsheet.worksheets.length - 1);
                });
            },
            onchange: function (element, instance, tabIndex) {
                if (spreadsheet.worksheets.length != 0 && spreadsheet.worksheets[tabIndex]) {
                    updateToolbar(spreadsheet.worksheets[tabIndex]);
                }
            },
        };

        if (options.tabs == true) {
            tabsOptions.allowCreate = true;
        } else {
            tabsOptions.hideHeaders = true;
        }

        tabsOptions.data = [];

        let sheetNumber = 1;

        for (let i = 0; i < o.length; i++) {
            if (!o[i].worksheetName) {
                o[i].worksheetName = 'Sheet' + sheetNumber++;
            }

            tabsOptions.data.push({
                title: o[i].worksheetName,
                content: '',
            });
        }

        el.classList.add('jss_spreadsheet');
        el.tabIndex = 0;

        const tabs = __WEBPACK_EXTERNAL_MODULE_jsuites_default__.tabs(el, tabsOptions);

        const spreadsheetStyles = options.style;
        delete options.style;

        for (let i = 0; i < o.length; i++) {
            if (o[i].style) {
                Object.entries(o[i].style).forEach(function ([cellName, value]) {
                    if (typeof value === 'number') {
                        o[i].style[cellName] = spreadsheetStyles[value];
                    }
                });
            }

            spreadsheet.worksheets.push({
                parent: spreadsheet,
                element: tabs.content.children[i],
                options: o[i],
                filters: [],
                formula: [],
                history: [],
                selection: [],
                historyIndex: -1,
            });

            await buildWorksheet.call(spreadsheet.worksheets[i]);
        }
    } else {
        throw new Error('JSS: worksheets are not defined');
    }
};

factory.spreadsheet = async function (el, options, worksheets) {
    if (el.tagName == 'TABLE') {
        if (!options) {
            options = {};
        }

        if (!options.worksheets) {
            options.worksheets = [];
        }

        const tableOptions = createFromTable(el, options.worksheets[0]);

        options.worksheets[0] = tableOptions;

        const div = document.createElement('div');
        el.parentNode.insertBefore(div, el);
        el.remove();
        el = div;
    }

    let spreadsheet = {
        worksheets: worksheets,
        config: options,
        element: el,
        el,
    };

    // Contextmenu container
    spreadsheet.contextMenu = document.createElement('div');
    spreadsheet.contextMenu.className = 'jss_contextmenu';

    spreadsheet.getWorksheetActive = getWorksheetActive.bind(spreadsheet);
    spreadsheet.fullscreen = fullscreen.bind(spreadsheet);
    spreadsheet.showToolbar = showToolbar.bind(spreadsheet);
    spreadsheet.hideToolbar = hideToolbar.bind(spreadsheet);
    spreadsheet.getConfig = getSpreadsheetConfig.bind(spreadsheet);
    spreadsheet.setConfig = setConfig.bind(spreadsheet);

    spreadsheet.setPlugins = function (newPlugins) {
        if (!spreadsheet.plugins) {
            spreadsheet.plugins = {};
        }

        if (typeof newPlugins == 'object') {
            Object.entries(newPlugins).forEach(function ([pluginName, plugin]) {
                spreadsheet.plugins[pluginName] = plugin.call(libraryBase.jspreadsheet, spreadsheet, {}, spreadsheet.config);
            });
        }
    };

    spreadsheet.setPlugins(options.plugins);

    // Create as worksheets
    await createWorksheets(spreadsheet, options, el);

    spreadsheet.element.appendChild(spreadsheet.contextMenu);

    // Create element
    __WEBPACK_EXTERNAL_MODULE_jsuites_default__.contextmenu(spreadsheet.contextMenu, {
        onclick: function () {
            spreadsheet.contextMenu.contextmenu.close(false);
        },
        submenuOpenOn: spreadsheet.config.contextMenuSubmenuOpenOn,
    });

    // Fullscreen
    if (spreadsheet.config.fullscreen == true) {
        spreadsheet.element.classList.add('fullscreen');
    }

    showToolbar.call(spreadsheet);

    // Build handlers
    if (options.root) {
        setEvents(options.root);
    } else {
        setEvents(document);
    }

    el.spreadsheet = spreadsheet;

    return spreadsheet;
};

factory.worksheet = function (spreadsheet, options, position) {
    // Worksheet object
    let w = {
        // Parent of a worksheet is always the spreadsheet
        parent: spreadsheet,
        // Options for this worksheet
        options: {},
    };

    // Create the worksheets object
    if (typeof position === 'undefined') {
        spreadsheet.worksheets.push(w);
    } else {
        spreadsheet.worksheets.splice(position, 0, w);
    }
    // Keep configuration used
    Object.assign(w.options, options);

    return w;
};

/* harmony default export */ const utils_factory = (factory);

;// ./src/index.js











libraryBase.jspreadsheet = function (el, options) {
    try {
        let worksheets = [];

        // Create spreadsheet
        utils_factory.spreadsheet(el, options, worksheets).then((spreadsheet) => {
            libraryBase.jspreadsheet.spreadsheet.push(spreadsheet);

            // Global onload event
            utils_dispatch.call(spreadsheet, 'onload', spreadsheet);
        });

        return worksheets;
    } catch (e) {
        console.error(e);
    }
};

libraryBase.jspreadsheet.getWorksheetInstanceByName = function (worksheetName, namespace) {
    const targetSpreadsheet = libraryBase.jspreadsheet.spreadsheet.find((spreadsheet) => {
        return spreadsheet.config.namespace === namespace;
    });

    if (targetSpreadsheet) {
        return {};
    }

    if (typeof worksheetName === 'undefined' || worksheetName === null) {
        const namespaceEntries = targetSpreadsheet.worksheets.map((worksheet) => {
            return [worksheet.options.worksheetName, worksheet];
        });

        return Object.fromEntries(namespaceEntries);
    }

    return targetSpreadsheet.worksheets.find((worksheet) => {
        return worksheet.options.worksheetName === worksheetName;
    });
};

// Define dictionary
libraryBase.jspreadsheet.setDictionary = function (o) {
    __WEBPACK_EXTERNAL_MODULE_jsuites_default__.setDictionary(o);
};

libraryBase.jspreadsheet.destroy = function (element, destroyEventHandlers) {
    if (element.spreadsheet) {
        const spreadsheetIndex = libraryBase.jspreadsheet.spreadsheet.indexOf(element.spreadsheet);
        libraryBase.jspreadsheet.spreadsheet.splice(spreadsheetIndex, 1);

        const root = element.spreadsheet.config.root || document;

        element.spreadsheet = null;
        element.innerHTML = '';

        if (destroyEventHandlers) {
            destroyEvents(root);
        }
    }
};

libraryBase.jspreadsheet.destroyAll = function () {
    for (let spreadsheetIndex = 0; spreadsheetIndex < libraryBase.jspreadsheet.spreadsheet.length; spreadsheetIndex++) {
        const spreadsheet = libraryBase.jspreadsheet.spreadsheet[spreadsheetIndex];

        libraryBase.jspreadsheet.destroy(spreadsheet.element);
    }
};

libraryBase.jspreadsheet.current = null;

libraryBase.jspreadsheet.spreadsheet = [];

libraryBase.jspreadsheet.helpers = {};

libraryBase.jspreadsheet.version = function () {
    return version;
};

Object.entries(helpers_namespaceObject).forEach(([key, value]) => {
    libraryBase.jspreadsheet.helpers[key] = value;
});

/* harmony default export */ const src = (libraryBase.jspreadsheet);

export { src as default };
