import axios, {AxiosResponse, AxiosError} from 'axios'
import { agentApi, api } from '@/services'
import moment from 'moment'

export const MODULE_API_URL = '/tradedata'


const getTradeData = (broker: string, body: any): Promise<any> => {
  return api
    .post(`${MODULE_API_URL}/brokers/scrapper/${broker}`, body)
    .catch((reason: AxiosError<any>) => reason?.response)
}


const powCategories = [
  {
      "category_label": "DP Charges",
      "angel_search_text": ["DP Charges"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "Pledge/Unpledge charges",
      "angel_search_text": ["Pledge/Unpledge charges"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "Trades Executed",
      "angel_search_text": ["Trades Executed"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "Funds Withdrawn",
      "angel_search_text": ["Funds Withdrawn"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "Account Maintenance charge",
      "angel_search_text": ["Account Maintenance charge"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "Quarterly Settlement",
      "angel_search_text": ["Quarterly Settlement"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "Funds Added",
      "angel_search_text": ["Funds Added"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "Interest Charges",
      "angel_search_text": ["Interest Charges"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "Reversal DP Charges",
      "angel_search_text": ["Reversal DP Charges"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "CUSA Sell Off Charges",
      "angel_search_text": ["CUSA Sell Off Charges"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "CHARGES FOR SELLING/TRANSFER OF SHARES",
      "angel_search_text": ["CHARGES FOR SELLING/TRANSFER OF SHARES FROM YOUR DEMAT A/C DT"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "BEING AMT TRF FROM NSE TO MCX",
      "angel_search_text": ["BEING AMT TRF FROM NSE TO MCX"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "BEING AMT TRF FROM NSE TO MCX",
      "angel_search_text": ["BEING AMT TRF FROM NSE TO MCX"],
      "iifl_search_text": ["none"]
  },
  {
      "category_label": "Misc Charges",
      "angel_search_text": ["none"],
      "iifl_search_text": ["BEING INTEREST ON DELAYED PAYMENT","CDSL DP Bill","BEING INTEREST ON DELAYED PAYMENT","Being debited Investor Protection Fund Trust"]
  },
  {
      "category_label": "Cash Transcation",
      "angel_search_text": ["none"],
      "iifl_search_text": ["BILL FOR NM"]
  },
  {
      "category_label": "Funds",
      "angel_search_text": ["none"],
      "iifl_search_text": ["BEING FUND RECD","BEING PAYOUT RELEASED BY IIFL",""]
  },
  {
      "category_label": "Ignore",
      "angel_search_text": [],
      "iifl_search_text": []
  },
  {
      "category_label": "FNO Transcation",
      "angel_search_text": ["none"],
      "iifl_search_text": ["FO BILL FOR"]
  }
]

const mapPOWCategory = (particulars: string, forBroker: string) => {
  const foundItem = powCategories.find((catItem) => forBroker == "angel" ? catItem.angel_search_text.find((srcText) => particulars.includes(srcText)) : catItem.iifl_search_text.find((srcText1) => {
      // console.log(particulars,srcText1)
      return particulars.includes(srcText1)}
  ))
  // console.log("foundItem",foundItem);
  if(foundItem && "category_label" in foundItem){
      return foundItem["category_label"]
  }
  return "Ignore from storing"
}


const formatLedgerResponseData = (broker: string, respdata: any) => {
  if(broker == "angel"){
    const respdataParsed = JSON.parse(respdata)
    let finalData = respdataParsed.map((jsonitem) => {
        if(jsonitem.date != null){
            const date = jsonitem.date
            const exchange = jsonitem.exchange
            const particulars = jsonitem.transaction_details
            const category = jsonitem.transaction_details && jsonitem.transaction_details != null ? mapPOWCategory(jsonitem.transaction_details, "angel") : 'N/A'
            const debit = jsonitem.debit
            const credit = jsonitem.credit
            const balance = jsonitem.balance
            return {date,exchange,particulars,category,credit,debit,balance}
        }
    })
    finalData = finalData.filter(function( element ) {
        return element !== undefined;
    });
    return finalData
  }

  if(broker == "iifl"){
    const reponseData = respdata.data.data;
    const reponseDataJson = JSON.parse(reponseData)
    if(reponseDataJson.body.Records.length > 0){
        let finalData = reponseDataJson.body.Records.map((rec) => {
            if(rec.Transaction_date && rec.Transaction_date != null){
                const dateString = rec.Transaction_date
                const match = dateString.match(/\/Date\((\d+)([+-]\d+)\)\//);
                const timestamp = parseInt(match[1], 10);
                const timezoneOffset = match[2];
                const momentDate = moment(timestamp);
                const offsetHours = parseInt(timezoneOffset.slice(0, 3), 10); // Extracting hours part
                const offsetMinutes = parseInt(timezoneOffset[0] + timezoneOffset.slice(3), 10); // Extracting minutes part with sign
                momentDate.add(offsetHours, 'hours').add(offsetMinutes, 'minutes');
                const formattedDate = momentDate.format('YYYY-MM-DD');
                return {
                    "date": formattedDate,
                    "exchange": rec.Particular.includes("FO BILL FOR") ? "NSEFO" : "nsecm",
                    "particulars": rec.Particular,
                    "category": rec.Particular ? mapPOWCategory(rec.Particular,"iifl") : 'N/A',
                    "credit": rec.Amount.includes("Cr") ? rec.Amount.replace("Cr","") : "",
                    "debit": rec.Amount.includes("Dr") ? rec.Amount.replace("Dr","") : "",
                    "balance": rec.RunningBalance
                }
            }
        })
        finalData = finalData.filter(function( element ) {
            return element !== undefined;
        });
        return finalData
      }
  }

  return []
  
}

const formatPortfolioValueResponseData = (broker: string, respdata: any, startDate: any) => {
  if(broker == "angel"){
    let finalData = respdata.map((item) => {
        const date = startDate 
        const isin = item.ISIN
        const isin_name = item.companyName
        const balance_type = parseFloat(item.totalBalanceQuantity) - parseFloat(item.pledgeQuantity) > 0 ? "BENEFICIRY" : "PLEDGE" //TOTAL BALANCE QUANTITY - PLEDGE QUANTITY > 0 ? BENEFICIRY : PLEDGE
        const qty = balance_type == "BENEFICIRY" ? parseFloat(item.totalBalanceQuantity) - parseFloat(item.pledgeQuantity) : item.pledgeQuantity //CATEGORY = BENEFICIRY ? total - pledge, CATEGORY == PLEDGE ? pledge qty
        const holding_value = parseFloat(qty) * parseFloat(item.rate)
        return {
            date, 
            isin,
            isin_name,
            qty,
            holding_value,
            balance_type
        }
    })
    finalData = finalData.filter(function( element ) {
        return element !== undefined;
    });
    return finalData
  }

  if(broker == "iifl"){
    const data = JSON.parse(respdata.data.data)
    const finalDataJson = data.Body.DpValue
    let finalData = finalDataJson.map((item) => {
        const date  = startDate //data.Body.AsonDate
        const isin = item.ISIN
        const isin_name = item.ISINName
        const qty = item.Qty
        const holding_value = item.HoldingValue
        const balance_type = item.BalanceType
        return {
            date, 
            isin,
            isin_name,
            qty,
            holding_value,
            balance_type
        }
    })
    finalData = finalData.filter(function( element ) {
        return element !== undefined;
    });
    return finalData
  }

  return []
}

const formatFnOProfitsResponseData = (broker: string, respdata: any) => {
    if(broker == "angel"){
        let finalData = respdata.map((rec) => {
            if(rec["Scrip Symbol"] != null && !rec["Scrip Symbol"].includes("Total") && !rec["Scrip Symbol"].includes("Disclaimer")){
                const scrip_code = rec["Scrip Symbol"]
                const buy_date = null
                const buy_quantity = rec["Quantity"]
                const avg_buy_price = rec["Avg Buy Price"]
                const buy_value = rec["Buy price"]
                const sell_date = null
                const sell_quantity = rec["Quantity"]
                const avg_sell_price = rec["Avg Sell Price"]
                const sell_value = rec["Sell Price"]
                const gross_pnl = rec["Gross PnL"]
                const charges = "Brokerage" in rec ? parseFloat(rec["Brokerage"]) : 0 +
                "GST" in rec ? parseFloat(rec["GST"]) : 0 +
                "Turnover Tax" in rec ? parseFloat(rec["Turnover Tax"]) : 0 +
                "SEBI Charges" in rec ? parseFloat(rec["SEBI Charges"]) : 0 +
                "Stamp Duty" in rec ? parseFloat(rec["Stamp Duty"]) : 0 +
                "STT" in rec ? parseFloat(rec["STT"]) : 0 +
                "Other Charges" in rec ? parseFloat(rec["Other Charges"]) : 0
                return {scrip_code,buy_date,buy_quantity,avg_buy_price,buy_value,sell_date,sell_quantity,avg_sell_price,sell_value,gross_pnl,charges}
            }
        })
        finalData = finalData.filter(function( element ) {
            return element !== undefined;
        });
        return finalData
    }

  if(broker == "iifl"){
    const reponseData = respdata.data.data;
    const reponseDataJson = JSON.parse(reponseData)
    if(reponseDataJson.Body.Realized.length > 0){
        const realizedRecords = reponseDataJson.Body.Realized;
        let finalData = realizedRecords.map((rec) => {
            const scrip_code = rec.ScripCode
            const buy_date = rec.BuyDate
            const buy_quantity = rec.Qty
            const avg_buy_price = rec.BuyAvgRate
            const buy_value = rec.BuyValue
            const sell_date = rec.SellDate
            const sell_quantity = rec.Qty
            const avg_sell_price = rec.SellAvgRate
            const sell_value = rec.SellValue
            const gross_pnl = parseFloat(rec.SellValue) - parseFloat(rec.BuyValue)
            const charges = parseFloat(rec.BuyCharges) + parseFloat(rec.SellCharges)
            return {scrip_code,buy_date,buy_quantity,avg_buy_price,buy_value,sell_date,sell_quantity,avg_sell_price,sell_value,gross_pnl,charges}
        })
        finalData = finalData.filter(function( element ) {
            return element !== undefined;
        });
        return finalData
    }
  }
  return []
}

const formatETFGainsResponseData = (broker: string, respdata: any, etfs_scripcodes: string[], etfs_isins: string[]) => {
  if(broker == "angel"){
    const respTransactionReport = respdata.respTransactionReport != "" ? JSON.parse(respdata.respTransactionReport) : null
    const respHoldingValuationCurrent = respdata.respHoldingValuationCurrent != "" ? JSON.parse(respdata.respHoldingValuationCurrent) : null
    const respHoldingValuationPrevious = respdata.respHoldingValuationPrevious != "" ? JSON.parse(respdata.respHoldingValuationPrevious) : null
    let finalDataTransactionReport = respTransactionReport ? respTransactionReport.data.data.map((rec) => {
        if(etfs_scripcodes.includes(rec["scripCd"])){
            const buy_value = rec["purchaseValue"]
            const sell_value = rec["sellValue"]
            const buysell_date = rec["saudaDate"] ? moment(rec["saudaDate"],'DD/MM/YYYY').format("DD MMM, YYYY") : ''
            const etf_details = rec['scripName']
            const scrip_code = rec["scripCd"]
            return {scrip_code,etf_details,buysell_date,buy_value,sell_value}
        }
    }) : []
    let finalDataHoldingValuationCurrent = respHoldingValuationCurrent ? respHoldingValuationCurrent.data.data.map((rec) => {
        if(etfs_isins.includes(rec["ISIN"])){
            const valuation = rec["valuation"]
            const isin = rec["ISIN"]
            const etf_details = rec['companyName']
            return {isin,etf_details,valuation}
        }
    }) : []

    let finalDataHoldingValuationPrevious = respHoldingValuationPrevious ? respHoldingValuationPrevious.data.data.map((rec) => {
        if(etfs_isins.includes(rec["ISIN"])){
            const valuation = rec["valuation"]
            const isin = rec["ISIN"]
            const etf_details = rec['companyName']
            return {isin,etf_details,valuation}
        }
    }) : []
    finalDataTransactionReport = finalDataTransactionReport.filter(function( element ) {
        return element !== undefined;
    });
    finalDataHoldingValuationCurrent = finalDataHoldingValuationCurrent.filter(function( element ) {
        return element !== undefined;
    });
    finalDataHoldingValuationPrevious = finalDataHoldingValuationPrevious.filter(function( element ) {
        return element !== undefined;
    });
    return {finalDataTransactionReport, finalDataHoldingValuationCurrent, finalDataHoldingValuationPrevious}
  }

  if(broker == "iifl"){
    const reponseData = respdata.data.data;
    const reponseDataJson = JSON.parse(reponseData)
    if(reponseDataJson.Body.DPTransactionData.length > 0){
        let finalData = reponseDataJson.Body.DPTransactionData.map((rec) => {
            if(rec["Particulars"].includes("Corporate Action") && etfs_scripcodes.split(",").some(str => { 
                return rec["CompanyName"].includes(str) 
            })){
                const buy_value = parseFloat(rec["Credit"])
                const sell_value = parseFloat(rec["Debit"])
                const buysell_date = rec["TrxDate"] ? moment(rec["TrxDate"],'DD-MM-YYYY').format("DD MMM, YYYY") : ''
                const etf_details = rec['CompanyName']
                return {etf_details,buysell_date,buy_value,sell_value}
            }
        })
        finalData = finalData.filter(function( element ) {
            return element !== undefined;
        });
        return finalData
    }
  }
  return []
}

export {
  getTradeData,
  formatLedgerResponseData,
  formatPortfolioValueResponseData,
  formatFnOProfitsResponseData,
  formatETFGainsResponseData
}
