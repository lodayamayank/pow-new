import { PaginationState } from '@/utils'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export type Props = {
    alertType: string
    alertMessage: string
    setFormSubmitMsg?: any
}

function AlertMessage(props: Props) {
  const { alertType, alertMessage, setFormSubmitMsg } = props
  if(alertType == 'error'){
    return (
      <div className="alert alert-important alert-danger alert-dismissible" role="alert">
        <div className="d-flex">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
          </div>
          <div>
            {alertMessage}
          </div>
        </div>
        <a className="btn-close" onClick={() => setFormSubmitMsg(undefined)} data-bs-dismiss="alert" aria-label="close"></a>
      </div>
    )  
  }
  return (
    <div className="alert alert-important alert-success alert-dismissible" role="alert">
      <div className="d-flex">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
        </div>
        <div>
          {alertMessage}
        </div>
      </div>
      <a className="btn-close" onClick={() => setFormSubmitMsg(undefined)} data-bs-dismiss="alert" aria-label="close"></a>
    </div>
  )
}

export default AlertMessage