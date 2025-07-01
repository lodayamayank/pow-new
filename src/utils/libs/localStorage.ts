const LOCAL_STORAGE_SPACE_KEY = process.env.LOCAL_STORAGE_SPACE_KEY || 'powcrm'

export function setLocalStorage(key: string, val: any) {
    const preparedKey = LOCAL_STORAGE_SPACE_KEY+"_"+key
    if(typeof val == 'string' || typeof val == 'number'){
        localStorage.setItem(preparedKey, String(val))
    }else{
        localStorage.setItem(preparedKey, JSON.stringify(val))
    }
}

export function getLocalStorage(key: string) {
    const preparedKey = LOCAL_STORAGE_SPACE_KEY+"_"+key
    return localStorage.getItem(preparedKey)
}

export function removeLocalStorage(key: string) {
    const preparedKey = LOCAL_STORAGE_SPACE_KEY+"_"+key
    return localStorage.removeItem(preparedKey)
}