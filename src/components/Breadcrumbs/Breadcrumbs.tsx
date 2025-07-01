import { useRoutePaths } from '@/hooks'
import { PaginationState } from '@/utils'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'

export type Props = {
  links?: PageLink[]
  isLoading?: boolean
}

export interface PageLink {
    title: string
    path: string
    isActive: boolean
    isSeparator?: boolean
}

function Breadcrumbs(props: Props) {
  const { links, isLoading } = props
  const { ROOT_PATH } = useRoutePaths()
  const navigate = useNavigate()
  return (
    <small className='text-body-secondary fs-5'>
    <ol className="breadcrumb" aria-label="breadcrumbs">
      <li className="breadcrumb-item"><button type='button' className='btn btn-ghost-primary p-0 fs-5' onClick={() => navigate(ROOT_PATH)}>Dashboard</button></li>
        {links?.map((link: PageLink) => (
            <li className="breadcrumb-item">
                {link.isActive ? (
                    <span className="">{link.title}</span>
                ) : (
                  <button type='button' className='btn btn-ghost-primary p-0 fs-5' onClick={() => navigate(link.path)}>{link.title}</button>
                )}
            </li>
        ))}
    </ol>
    </small>
  )
}

export default Breadcrumbs