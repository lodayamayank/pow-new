import { generalpaths, userspaths, masterdatapaths, clientspaths, tradedatapaths, reportspaths  } from '@/router'

function useRoutePaths() {
  return {...generalpaths, ...userspaths, ...masterdatapaths, ...clientspaths, ...tradedatapaths, ...reportspaths}
}

export default useRoutePaths
