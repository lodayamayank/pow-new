import { PaginationState } from '@/utils'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export type Props = {
  payload?: PaginationState
  isLoading: boolean
  loadPage: any
}

function Pagination(props: Props) {
  const { payload, isLoading, loadPage } = props
  // const { from,last_page,to,total,page,items_per_page,links } = payload
  return (
    <>
      <p className="m-0 text-muted">
        Showing <span>{payload?.from}</span> to <span>{payload?.to}</span> of{' '}
        <span>{payload?.total}</span> results
      </p>
      <ul className="pagination m-0 ms-auto">
        <li className="page-item">
          <button 
          onClick={() => loadPage(payload?.first_page_url ? Number(payload?.first_page_url) : 0)}
          className="page-link">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
            First
          </button>
        </li>
        <li className="page-item">
          <button 
          onClick={() => loadPage(payload?.prev_page_url ? Number(payload?.prev_page_url) : 0)}
          className="page-link">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
            Previous
          </button>
        </li>
        {payload?.links?.slice(2,payload.links.length - 1).map((link) => (
          <li
          className={`page-item ${link.active ? 'active' : ''}`}
          ><button 
          onClick={() => loadPage(link.page)}
          className="page-link">{Number(link.label)}</button></li>
        ))}
        <li className="page-item">
          <button
          type='button'
          className="page-link"
          onClick={() => loadPage(payload?.next_page_url ? Number(payload?.next_page_url) : 1)}
          >
            Next 
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
          </button>
        </li> 
        <li className="page-item">
          <button
          type='button'
          className="page-link"
          onClick={() => loadPage(payload?.last_page ? Number(payload?.last_page) : 1)}
          >
            Last 
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
          </button>
        </li>
      </ul>
    </>
  )
}

export default Pagination