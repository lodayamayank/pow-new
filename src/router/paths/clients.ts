const CLIENTS_PATH = '/clients'
const CLIENTS_CREATE_PATH = '/clients/create'
const CLIENTS_DETAILS_PATH = '/clients/details/:id'
const CLIENTS_UPDATE_PATH = '/clients/update/:id'
const CLIENTS_DELETE_PATH = '/clients/delete/:id'
const CLIENTS_UPLOAD_ADJUSTMENTS_PATH = '/clients/uploadadjustments'
const CLIENTS_UPLOAD_AUMS_PATH = '/clients/uploadaums'
const CLIENTS_UPLOAD_PROFITS_PATH = '/clients/uploadprofits'
const CLIENT_GROUPS_PATH = '/clients/groups'
const CLIENT_GROUPS_CREATE_PATH = '/clients/groups/create'
const CLIENT_GROUPS_UPDATE_PATH = '/clients/groups/update/:id'

const clientspaths = {
    CLIENTS_PATH,
    CLIENTS_CREATE_PATH,
    CLIENTS_DETAILS_PATH,
    CLIENTS_UPDATE_PATH,
    CLIENTS_DELETE_PATH,
    CLIENTS_UPLOAD_ADJUSTMENTS_PATH,
    CLIENTS_UPLOAD_AUMS_PATH,
    CLIENTS_UPLOAD_PROFITS_PATH,
    CLIENT_GROUPS_PATH,
    CLIENT_GROUPS_CREATE_PATH,
    CLIENT_GROUPS_UPDATE_PATH
} as const

export default clientspaths
