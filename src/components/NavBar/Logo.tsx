import { useRoutePaths, useSession } from '@/hooks'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function Logo() {
  const { isAuthenticated, user, signOut } = useSession()
  const { ROOT_PATH } = useRoutePaths()

  return (
    <div className="relative me-4 z-20 flex items-center text-lg font-medium">
        <a href={ROOT_PATH} className='animate-text text-gradient-to-r from-teal-500 via-purple-500 to-orange-500'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="blue" viewBox="0 0 16 16">
              <path d="M4 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m7.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
              <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .5.5V4h13.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H2v2.5a.5.5 0 0 1-1 0V2H.5a.5.5 0 0 1-.5-.5m5.5 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M9 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0"/>
              <path d="M3 12.5h3.5v1a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5zm4 1v-1h4v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5"/>
            </svg>
        </a>
    </div>
  )
}

export default Logo
