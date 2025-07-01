const TRADEDATA_LEDGER_PATH = '/tradedata/ledger'
const TRADEDATA_PORTFOLIO_VALUE_PATH = '/tradedata/portfolio-value'
const TRADEDATA_FNO_PROFITS_PATH = '/tradedata/fno-profits'
const TRADEDATA_ETFS_VALUE_PATH = '/tradedata/etf-gains'

const tradedatapaths = {
    TRADEDATA_LEDGER_PATH,
    TRADEDATA_PORTFOLIO_VALUE_PATH,
    TRADEDATA_FNO_PROFITS_PATH,
    TRADEDATA_ETFS_VALUE_PATH
} as const

export default tradedatapaths
