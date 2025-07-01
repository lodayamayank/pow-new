const USERS_PATH = '/users'
const USERS_CREATE_PATH = '/users/create'
const USERS_UPDATE_PATH = '/users/update/:id'
const USERS_DELETE_PATH = '/users/delete/:id'
const USER_PATH = '/users/:id'
const ROLES_PATH = '/users/roles'
const PERMISSIONS_PATH = '/users/permissions'
const userpaths = {
    USERS_PATH,
    USER_PATH,
    USERS_CREATE_PATH,
    USERS_UPDATE_PATH,
    USERS_DELETE_PATH,
    ROLES_PATH,
    PERMISSIONS_PATH
} as const

export default userpaths
