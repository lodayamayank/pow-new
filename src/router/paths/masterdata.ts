const MASTERDATA_BROKERS_PATH = '/masterdata/brokers'
const MASTERDATA_BROKERS_CREATE_PATH = '/masterdata/brokers/create'
const MASTERDATA_BROKERS_UPDATE_PATH = '/masterdata/brokers/update/:id'
const masterdatapaths = {
    MASTERDATA_BROKERS_PATH,
    MASTERDATA_BROKERS_CREATE_PATH,
    MASTERDATA_BROKERS_UPDATE_PATH
} as const

export default masterdatapaths
