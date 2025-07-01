import {createContext, Dispatch, SetStateAction, useEffect, useState} from 'react'
import qs from 'qs'
import { ID, QueryState } from '../types'
// import {ID, QueryResponseContextProps, QueryState} from './models'
// import * as FileSaver from "file-saver"
// import * as XLSX from "xlsx";
// import {saveAs} from  'file-saver';

// function createResponseContext<T>(initialState: QueryResponseContextProps<T>) {
//   return createContext(initialState)
// }

function isNotEmpty(obj: unknown) {
  return obj !== undefined && obj !== null && obj !== ''
}

// Example: page=1&items_per_page=10&sort=id&order=desc&search=a&filter_name=a&filter_online=false
// Example: page=1&items_per_page=10&sort=id&order=desc&search=a&name=a&online=false
function stringifyRequestQuery(state: any): string {
  const pagination = qs.stringify(state, {filter: ['page', 'items_per_page'], skipNulls: true})
  const sort = qs.stringify(state, {filter: ['sort', 'order'], skipNulls: true})
  const search = isNotEmpty(state.search)
    ? qs.stringify(state, {filter: ['search'], skipNulls: true})
    : ''

  const filter = state.filter
    ? Object.entries(state.filter as Object)
        .filter((obj) => isNotEmpty(obj[1]))
        .map((obj) => {
          return `${obj[0]}=${obj[1]}`
        })
        .join('&')
    : ''

  return [pagination, sort, search, filter]
    .filter((f) => f)
    .join('&')
    .toLowerCase()
}

function parseRequestQuery(query: string): QueryState {
  const cache: unknown = qs.parse(query)
  return cache as QueryState
}

function calculatedGroupingIsDisabled<T>(isLoading: boolean, data: Array<T> | undefined): boolean {
  if (isLoading) {
    return true
  }

  return !data || !data.length
}

function calculateIsAllDataSelected<T>(data: Array<T> | undefined, selected: Array<ID>): boolean {
  if (!data) {
    return false
  }

  return data.length > 0 && data.length === selected.length
}

function groupingOnSelect(
  id: ID,
  selected: Array<ID>,
  setSelected: Dispatch<SetStateAction<Array<ID>>>
) {
  if (!id) {
    return
  }

  if (selected.includes(id)) {
    setSelected(selected.filter((itemId) => itemId !== id))
  } else {
    const updatedSelected = [...selected]
    updatedSelected.push(id)
    setSelected(updatedSelected)
  }
}

function groupingOnSelectAll<T>(
  isAllSelected: boolean,
  setSelected: Dispatch<SetStateAction<Array<ID>>>,
  data?: Array<T & {id?: ID}>
) {
  if (isAllSelected) {
    setSelected([])
    return
  }

  if (!data || !data.length) {
    return
  }

  setSelected(data.filter((item) => item.id).map((item) => item.id))
}

// Hook
function useDebounce(value: string | undefined, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

// function exportToCSV(apiData: any, fileName: string) {
//   const fileType ="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
//   const fileExtension = ".xlsx";
//   const ws = XLSX.utils.json_to_sheet(apiData);
//   const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
//   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//   const data = new Blob([excelBuffer], { type: fileType });
//   FileSaver.saveAs(data, fileName + fileExtension);
//   // return;
// }

// const exportTableToCSV = (filename: string) => {
//   let csv = [];
//   const rows = document.querySelectorAll("table tr"); 
//   //@ts-ignore
//   for (const row of rows.values()) {
//       const cells = row.querySelectorAll("td, th");
//       //@ts-ignore
//       const rowText = Array.from(cells).map(cell => cell.innerText);
//       csv.push(rowText.join(','));       
//   }
//   const csvFile = new Blob([csv.join('\n')], {type: "text/csv;charset=utf-8;"});
//   saveAs(csvFile, `${filename}.csv`);
// }

const printsection = () => {
  const content = document.getElementById('printarea');
  //@ts-ignore
  const pri = document.getElementById('ifmcontentstoprint').contentWindow;
  pri.document.open();
  //@ts-ignore
  let htmlToPrint = '' +
    '<style type="text/css">' +
    'table {'+
    'width: 100%; '+
    'border:solid #000 !important;'+
    'border-width:1px 0 0 1px !important;'+
    '}'+
    'th, td {'+
    'text-align: left; '+
    'border:solid #000 !important;'+
    'border-width:0 1px 1px 0 !important;'+
    '}'+
    // 'table th, table td {' +
    // 'border:1px solid #000;' +
    'padding:0.5em;' +
    '}' +
    '</style>';
  //@ts-ignore
  htmlToPrint += content.outerHTML;
  pri.document.write(htmlToPrint);
  pri.document.close();
  pri.focus();
  pri.print();
}

export {
//   createResponseContext,
  stringifyRequestQuery,
  parseRequestQuery,
  calculatedGroupingIsDisabled,
  calculateIsAllDataSelected,
  groupingOnSelect,
  groupingOnSelectAll,
  useDebounce,
  isNotEmpty,
//   exportToCSV,
//   exportTableToCSV,
  printsection
}
