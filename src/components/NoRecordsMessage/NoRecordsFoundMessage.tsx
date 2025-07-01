import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export type Props = {
  heading?: string
  subHeading?: string
  actionUrl?: string
  actionLabel?: string
}

function NoRecordsFoundMessage(props: Props) {
  const { heading = 'No data found', subHeading = 'You can start creating new', actionUrl, actionLabel } = props
  // const { from,last_page,to,total,page,items_per_page,links } = payload
  return (
    <div className="max-w-sm w-full min-h-[400px] flex flex-col justify-center mx-auto px-6 py-4">
        <h2 className="mt-5 font-semibold text-gray-800 dark:text-white">
            {heading}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {subHeading}
        </p>
        {actionUrl && (
            <div className="mt-5">
                <a href={actionUrl} className="btn btn-sm btn-primary">
                <svg className="flex-shrink-0 w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                {actionLabel ? actionLabel : 'Click here'} 
                </a>
            </div>
        )}
    </div>
  )
}

export default NoRecordsFoundMessage