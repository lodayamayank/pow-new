import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom'
import { useRoutePaths } from '@/hooks'
import { Home, Login, Register, Users, UpdateUser, CreateUser, RolesPermissions, MasterDataBrokersCreate, MasterDataBrokersList, MasterDataBrokersUpdate, ClientDetails, ClientsCreate, ClientsList, ClientsUpdate, TradeDataLedgerLanding, TradeDataPortfolioValueLanding, TradeDataFnOProfitsLanding, TradeDataETFGainsLanding, ClientAdjustmentsUpload } from '@/pages'
import { PrivateRoute } from '../PrivateRoute'
import { PublicRoute } from '../PublicRoute'
import { ReportsMonthly, ReportsWeekly } from '@/pages/Reports';
import { ReportsHTMLURLs } from '@/pages/Reports/HtmlURLs';
import { ClientAUMLanding, ClientGroupsCreate, ClientGroupsList, ClientGroupsUpdate, ClientProfitsUpload, ClientUploadAUMs } from '@/pages/Clients/components';

// const Home = lazy(() => import('@/pages/Home/Home'));
// const Users = lazy(() => import('@/pages/Users/Users'));

function Router() {
  const {
    LOGIN_PATH,
    REGISTER_PATH,
    ROOT_PATH,
    USERS_PATH,
    USERS_CREATE_PATH,
    USERS_UPDATE_PATH,
    ROLES_PATH,
    MASTERDATA_BROKERS_PATH,
    MASTERDATA_BROKERS_CREATE_PATH,
    MASTERDATA_BROKERS_UPDATE_PATH,
    CLIENTS_PATH,
    CLIENTS_CREATE_PATH,
    CLIENTS_UPDATE_PATH,
    CLIENTS_DETAILS_PATH,
    CLIENTS_UPLOAD_AUMS_PATH,
    CLIENTS_UPLOAD_PROFITS_PATH,
    CLIENTS_UPLOAD_ADJUSTMENTS_PATH,
    CLIENT_GROUPS_PATH,
    CLIENT_GROUPS_CREATE_PATH,
    CLIENT_GROUPS_UPDATE_PATH,
    TRADEDATA_LEDGER_PATH,
    TRADEDATA_PORTFOLIO_VALUE_PATH,
    TRADEDATA_FNO_PROFITS_PATH,
    TRADEDATA_ETFS_VALUE_PATH,
    REPORTS_WEEKLY_PATH,
    REPORTS_MONTHLY_PATH,
    REPORTS_HTMLURLS_PATH
  } = useRoutePaths()

  return (
    <Routes>
      <Route
        path={ROOT_PATH}
        element={
          <PrivateRoute redirectTo={LOGIN_PATH}>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path={LOGIN_PATH}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route path={REGISTER_PATH} element={<Register />} />

      <Route
        path={USERS_PATH}
        element={
          <PrivateRoute permissions={['view_users', 'add_users', 'update_users']}>
            <Users />
          </PrivateRoute>
        }
      />

      <Route
        path={USERS_CREATE_PATH}
        element={
          <PrivateRoute permissions={['view_users', 'add_users']}>
            <CreateUser />
          </PrivateRoute>
        }
      />

      <Route
        path={USERS_UPDATE_PATH}
        element={
          <PrivateRoute permissions={['view_users', 'update_users']}>
            <UpdateUser />
          </PrivateRoute>
        }
      />

      <Route
        path={ROLES_PATH}
        element={
          <PrivateRoute permissions={['view_roles']}>
            <RolesPermissions />
          </PrivateRoute>
        }
      />

      <Route
        path={MASTERDATA_BROKERS_PATH}
        element={
          <PrivateRoute permissions={['view_masterdata_brokers']}>
            <MasterDataBrokersList />
          </PrivateRoute>
        }
      />

      <Route
        path={MASTERDATA_BROKERS_CREATE_PATH}
        element={
          <PrivateRoute permissions={['add_masterdata_brokers']}>
            <MasterDataBrokersCreate />
          </PrivateRoute>
        }
      />


      <Route
        path={MASTERDATA_BROKERS_UPDATE_PATH}
        element={
          <PrivateRoute permissions={['update_masterdata_brokers']}>
            <MasterDataBrokersUpdate />
          </PrivateRoute>
        }
      />

      <Route
        path={CLIENT_GROUPS_PATH}
        element={
          <PrivateRoute permissions={['view_clients_groups']}>
            <ClientGroupsList />
          </PrivateRoute>
        }
      />

      <Route
        path={CLIENT_GROUPS_CREATE_PATH}
        element={
          <PrivateRoute permissions={['add_clients_groups']}>
            <ClientGroupsCreate />
          </PrivateRoute>
        }
      />

      <Route
        path={CLIENT_GROUPS_UPDATE_PATH}
        element={
          <PrivateRoute permissions={['update_clients_groups']}>
            <ClientGroupsUpdate />
          </PrivateRoute>
        }
      />

      <Route
        path={CLIENTS_UPLOAD_AUMS_PATH}
        element={
          <PrivateRoute permissions={['add_clients_aum']}>
            <ClientUploadAUMs />
          </PrivateRoute>
        }
      />

      <Route
        path={CLIENTS_UPLOAD_PROFITS_PATH}
        element={
          <PrivateRoute permissions={['add_clients_profits_settled']}>
            <ClientProfitsUpload />
          </PrivateRoute>
        }
      />

      <Route
        path={CLIENTS_UPLOAD_ADJUSTMENTS_PATH}
        element={
          <PrivateRoute permissions={['upload_clients_adjustments']}>
            <ClientAdjustmentsUpload />
          </PrivateRoute>
        }
      />

      <Route
        path={CLIENTS_PATH}
        element={
          <PrivateRoute permissions={['view_clients']}>
            <ClientsList />
          </PrivateRoute>
        }
      />

      <Route
        path={CLIENTS_CREATE_PATH}
        element={
          <PrivateRoute permissions={['add_clients']}>
            <ClientsCreate />
          </PrivateRoute>
        }
      />

      <Route
        path={CLIENTS_DETAILS_PATH}
        element={
          <PrivateRoute permissions={['view_clients']}>
            <ClientDetails />
          </PrivateRoute>
        }
      />

      <Route
        path={CLIENTS_UPDATE_PATH}
        element={
          <PrivateRoute permissions={['update_clients']}>
            <ClientsUpdate />
          </PrivateRoute>
        }
      />

      <Route
        path={TRADEDATA_LEDGER_PATH}
        element={
          <PrivateRoute permissions={['update_clients']}>
            <TradeDataLedgerLanding />
          </PrivateRoute>
        }
      />

      <Route
        path={TRADEDATA_PORTFOLIO_VALUE_PATH}
        element={
          <PrivateRoute permissions={['update_clients']}>
            <TradeDataPortfolioValueLanding />
          </PrivateRoute>
        }
      />

      <Route
        path={TRADEDATA_PORTFOLIO_VALUE_PATH}
        element={
          <PrivateRoute permissions={['update_clients']}>
            <TradeDataPortfolioValueLanding />
          </PrivateRoute>
        }
      />

      <Route
        path={TRADEDATA_FNO_PROFITS_PATH}
        element={
          <PrivateRoute permissions={['update_clients']}>
            <TradeDataFnOProfitsLanding />
          </PrivateRoute>
        }
      />

      
      <Route
        path={TRADEDATA_ETFS_VALUE_PATH}
        element={
          <PrivateRoute permissions={['update_clients']}>
            <TradeDataETFGainsLanding />
          </PrivateRoute>
        }
      />

      <Route
        path={REPORTS_WEEKLY_PATH}
        element={
          <PrivateRoute permissions={['update_clients']}>
            <ReportsWeekly />
          </PrivateRoute>
        }
      />

      <Route
        path={REPORTS_MONTHLY_PATH}
        element={
          <PrivateRoute permissions={['update_clients']}>
            <ReportsMonthly />
          </PrivateRoute>
        }
      />

      <Route
        path={REPORTS_HTMLURLS_PATH}
        element={
          <PrivateRoute permissions={['view_clients']}>
            <ReportsHTMLURLs />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  )
}

export default Router
