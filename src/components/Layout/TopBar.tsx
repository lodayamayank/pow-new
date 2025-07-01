import { useRoutePaths, useSession } from "@/hooks";
import { Logo } from "../NavBar";
import { getCurrentThemeMode, getLocalStorage, matchCurrentRoute, toggelThemeMode } from "@/utils";
import { CanAccess } from '../CanAccess'
import { useNavigate, useNavigation } from "react-router-dom";
import { useState } from "react";
import NavDropdown from 'react-bootstrap/NavDropdown';

type Props = {
    children: React.ReactNode
}

function classNames(...classes: any[]) {
return classes.filter(Boolean).join(' ')
}

export default function TopBar(props: Props) {
  const {children} = props
  const { isAuthenticated, user, signOut } = useSession()
  const { LOGIN_PATH, METRICS_PATH, REGISTER_PATH, ROOT_PATH, USERS_PATH } = useRoutePaths()
  const navigate = useNavigate()
  const currentThemeModeStorage = getCurrentThemeMode()
  const [currentThemeMode,setCurrentThemeMode] = useState(currentThemeModeStorage)

  const navigation = [
      { 
        name: 'Dashboard', 
        href: '/', 
        current: matchCurrentRoute(['/']),
        icon: `<svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>`
      },{ 
        name: 'Clients', 
        href: '/clients', 
        current: matchCurrentRoute(['/clients','/clients/create','/clients/subscriptions','/clients/commercials']), 
        permissions: ['view_users'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-dollar" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h3" />
          <path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
          <path d="M19 21v1m0 -8v1" />
        </svg>`,
        subMenu: [
          { 
            name: 'Master', 
            href: '/clients', 
            current: matchCurrentRoute(['/clients']), 
            permissions: ['view_clients'],
            icon: ``,
          },{ 
            name: 'Upload AUMs', 
            href: '/clients/uploadaums', 
            current: matchCurrentRoute(['/clients/uploadaums']), 
            permissions: ['add_clients_aum'],
            icon: ``,
          },{ 
            name: 'Upload Profits', 
            href: '/clients/uploadprofits', 
            current: matchCurrentRoute(['/clients/uploadprofits']), 
            permissions: ['add_clients_profits_settled'],
            icon: ``,
          },{ 
            name: 'Upload Adjustments', 
            href: '/clients/uploadadjustments', 
            current: matchCurrentRoute(['/clients/uploadadjustments']), 
            permissions: ['upload_clients_adjustments'],
            icon: ``,
          },{ 
            name: 'Client Groups', 
            href: '/clients/groups', 
            current: matchCurrentRoute(['/clients/groups']) , 
            permissions: ['view_clients_groups'],
            icon: ``
          },
        ]
      },{ 
        name: 'Trade Data', 
        href: '/tradedata', 
        current: matchCurrentRoute(['/tradedata']), 
        permissions: ['view_users'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-table-import" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21h-7a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v8" /><path d="M3 10h18" /><path d="M10 3v18" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>`,
        subMenu: [
          { 
            name: 'Client Ledger', 
            href: '/tradedata/ledger', 
            current: matchCurrentRoute(['/tradedata/ledger']), 
            permissions: ['view_clients'],
            icon: ``,
          },{ 
            name: 'Client Portfolio Value', 
            href: '/tradedata/portfolio-value', 
            current: matchCurrentRoute(['/tradedata/portfolio-value']) , 
            permissions: ['view_clients'],
            icon: ``
          },{ 
            name: 'Client F&O Profits', 
            href: '/tradedata/fno-profits',
            current: matchCurrentRoute(['/tradedata/fno-profits']) , 
            permissions: ['view_clients'],
            icon: ``
          },{ 
            name: 'Client ETF Gains', 
            href: '/tradedata/etf-gains', current: matchCurrentRoute(['/tradedata/etf-gains']) , 
            permissions: ['view_clients'],
            icon: ``
          },{ 
            name: 'Trade Journal', 
            href: '/users', current: matchCurrentRoute(['/clients/subscriptions']) , 
            permissions: ['view_clients'],
            icon: ``
          },{ 
            name: 'Stock Mock Data', 
            href: '/users', current: matchCurrentRoute(['/clients/subscriptions']) , 
            permissions: ['view_clients'],
            icon: ``
          },
        ]
      },{ 
        name: 'Reports', 
        href: '/tradedata', 
        current: matchCurrentRoute(['/tradedata']), 
        permissions: ['view_users'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-report" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M17 17m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
          <path d="M17 13v4h4" />
          <path d="M12 3v4a1 1 0 0 0 1 1h4" />
          <path d="M11.5 21h-6.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v2m0 3v4" />
        </svg>`,
        subMenu: [
          { 
            name: 'Weekly', 
            href: '/reports/weekly', 
            current: matchCurrentRoute(['/reports/weekly']), 
            permissions: ['view_clients'],
            icon: ``,
          },{ 
            name: 'Monthly', 
            href: '/reports/monthly', 
            current: matchCurrentRoute(['/reports/monthly']) , 
            permissions: ['view_clients'],
            icon: ``
          },{ 
            name: 'HTML URLs', 
            href: '/reports/htmlurls', 
            current: matchCurrentRoute(['/reports/htmlurls']) , 
            permissions: ['view_clients'],
            icon: ``
          },
        ]
      },{ 
        name: 'Master Data', 
        href: '/tradedata', 
        current: matchCurrentRoute(['/tradedata']), 
        permissions: ['view_users'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>`,
        subMenu: [
          { 
            name: 'Brokers', 
            href: '/masterdata/brokers', 
            current: matchCurrentRoute(['/masterdata/brokers','/masterdata/brokers/create']), 
            permissions: ['view_masterdata_brokers'],
            icon: ``,
          },{ 
            name: 'Platforms', 
            href: '/users', current: matchCurrentRoute(['/clients/subscriptions']) , 
            permissions: ['view_users'],
            icon: ``
          },{ 
            name: 'Tools', 
            href: '/users', current: matchCurrentRoute(['/clients/subscriptions']) , 
            permissions: ['view_users'],
            icon: ``
          },{ 
            name: 'Strategies', 
            href: '/users', current: matchCurrentRoute(['/clients/subscriptions']) , 
            permissions: ['view_users'],
            icon: ``
          },{ 
            name: 'Strategy Buckets', 
            href: '/users', current: matchCurrentRoute(['/clients/subscriptions']) , 
            permissions: ['view_users'],
            icon: ``
          },
        ]
      },{ 
        name: 'Users', 
        href: '/users', 
        current: matchCurrentRoute(['/users','/users/create','/users/roles']), 
        permissions: ['view_users'],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-users" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
          <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
        </svg>`,
        subMenu: [
          { 
            name: 'Users', 
            href: '/users', 
            current: matchCurrentRoute(['/users','/users/create']), 
            permissions: ['view_users'],
            icon: ``,
          },
          { 
            name: 'Roles & Permissions', 
            href: '/users/roles', current: matchCurrentRoute(['/users/roles']) , 
            permissions: ['view_roles'],
            icon: ``
          },
        ]
      },
  ]

  const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#', onclick: signOut },
  ]

  return (
    <>
    <header className="navbar navbar-expand-md d-print-none" >
        <div className="container-xl">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a href="/">
              <img src="/logo.png" width={100} />
            </a>
          </h1>
          <div className="navbar-nav flex-row order-md-last">
            <div className="d-none d-md-flex">

              <button
              onClick={() => {
                toggelThemeMode()
                setCurrentThemeMode(currentThemeMode == "dark" ? 'light' : 'dark')
              } 
              }
              type="button" className="nav-link px-0" title="Change theme mode">
                {currentThemeMode == "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" /></svg>
                )}
              </button>
              <div className="nav-item dropdown d-none d-md-flex me-3">
                <a href="#" className="nav-link px-0" data-bs-toggle="dropdown" aria-label="Show notifications">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /></svg>
                  <span className="badge bg-red"></span>
                </a>
              </div>
            </div>
            {isAuthenticated && (
            <div className="flex nav-item dropdown">
              <NavDropdown title={(<div>
                <span className="avatar avatar-sm position-absolute" style={{ marginTop: '-5px' }}>{ user && user["name"] != undefined ? user.name[0] : ''}</span>
                <span style={{ marginLeft: '40px' }}>{user && user.name ? user.name : ''}</span>
                </div>)} id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1" key="#action/3.1">My profile</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2" key="#action/3.2">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={signOut} key="signoutkey">
                  Sign out
                </NavDropdown.Item>
              </NavDropdown>
            </div>
            // <div className="nav-item dropdown">
            //   <a href="#" className="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
            //     <span className="avatar avatar-sm">{user.name[0]}</span>
            //     <div className="d-none d-xl-block ps-2">
            //       <div>{user.name}</div>
            //       {/* <div className="mt-1 small text-muted">UI Designer</div> */}
            //     </div>
            //   </a>
            //   <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            //     <a href="#" className="dropdown-item">Status</a>
            //     <a href="./profile.html" className="dropdown-item">Profile</a>
            //     <a href="#" className="dropdown-item">Feedback</a>
            //     <div className="dropdown-divider"></div>
            //     <a href="./settings.html" className="dropdown-item">Settings</a>
            //     <a href="./sign-in.html" className="dropdown-item">Logout</a>
            //   </div>
            // </div>
            )}
          </div>
          <div className="collapse navbar-collapse" id="navbar-menu">
            <div className="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
              <ul className="navbar-nav">
                {navigation.map((item) => {
                  const subMenu = item.subMenu ? item.subMenu : undefined
                  if(subMenu) {
                    return (
                      <CanAccess permissions={item.permissions}>
                        <li 
                        className={classNames(
                            item.current
                                ? 'active'
                                : '',
                            'nav-item'
                        )}
                        >
                        <NavDropdown title={(<div>
                          <span className="position-absolute nav-link-icon d-md-none d-lg-inline-block" dangerouslySetInnerHTML={{__html: item.icon}}></span>
                          <span className="ms-4">{item.name}</span>
                          </div>)} id="basic-nav-dropdown">
                          {subMenu.map((subMenuItem) => (
                            <NavDropdown.Item href={subMenuItem.href}>{subMenuItem.name}</NavDropdown.Item>
                          ))}
                        </NavDropdown>
                        </li>
                    </CanAccess>
                    )
                  }else{
                  return (
                    <CanAccess permissions={item.permissions}>
                        <li 
                        className={classNames(
                            item.current
                                ? 'active'
                                : '',
                            'nav-item'
                        )}
                        >
                        <button
                        type="button"
                        key={item.name}
                        onClick={() => navigate(item.href)}
                        className="nav-link"
                        aria-current={item.current ? 'page' : undefined}
                        >
                            <span className="nav-link-icon d-md-none d-lg-inline-block" dangerouslySetInnerHTML={{__html: item.icon}}></span>
                            <span className="nav-link-title">{item.name}</span>
                        </button>
                        </li>
                    </CanAccess>
                )}})}
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
)}