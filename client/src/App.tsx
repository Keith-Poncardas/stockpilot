import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './routes'
import {
  LoginPage,
  OTPPage,
  SignupPage,
  UserLayout,
  UserPage,
  UserViewPage,
  PendingApprovalPage,
  ForgotPasswordPage,
  ChangePasswordPage,
  AuthLayout,
  ProductLayout,
  ProductPage,
  ProductViewPage,
  CreateProductPage,
  EditProductPage,
  InventoryLayout,
  InventoryPage,
  AdjustStockPage,
  InventoryRecordPage,
  StockMovementLayout,
  StockMovementPage,
  StockMovementDetailsPage,
  CustomerLayout,
  CustomersPage,
  CreateCustomerSheet,
  ViewCustomerSheet,
  SaleLayout,
  Dashboard,
  SalesPage,
} from './features'
import MainLayout from './layout/MainLayout'
import { EmptyState } from './components/ui/empty-state'
import { SheetProvider } from './providers'
import { ViewSaleSheet } from './features/sale/components/view-sale-sheet'
import { PointOfSaleSheet } from './features/sale/components/pos-sheet'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <SheetProvider>
      <Toaster position="top-center" />
      <ViewSaleSheet />
      <PointOfSaleSheet />
      <CreateCustomerSheet />
      <ViewCustomerSheet />
      <Routes>

        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/otp" element={<OTPPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowInactive />}>
          <Route element={<AuthLayout />}>
            <Route path="/pending-approval" element={<PendingApprovalPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />

            <Route path="/users" element={<UserLayout />}>
              <Route index element={<UserPage />} />
              <Route path=":userId/view" element={<UserViewPage />} />
            </Route>

            <Route path="/products" element={<ProductLayout />}>
              <Route index element={<ProductPage />} />
              <Route path=":productId/view" element={<ProductViewPage />} />
              <Route path="new" element={<CreateProductPage />} />
              <Route path=":productId/edit" element={<EditProductPage />} />
            </Route>

            <Route path="/inventory" element={<InventoryLayout />}>
              <Route index element={<InventoryPage />} />
              <Route path=":inventoryId/adjust" element={<AdjustStockPage />} />
              <Route path="record" element={<InventoryRecordPage />} />
            </Route>

            <Route path="/stock-movement" element={<StockMovementLayout />}>
              <Route index element={<StockMovementPage />} />
              <Route path=":stockMovementId/view" element={<StockMovementDetailsPage />} />
            </Route>

            <Route path="/customers" element={<CustomerLayout />}>
              <Route index element={<CustomersPage />} />
            </Route>

            <Route path="/sales" element={<SaleLayout />}>
              <Route index element={<SalesPage />} />
            </Route>

            <Route path="*" element={
              <EmptyState
                title="Page Not Found"
                description="The page you are looking for does not exist or has been moved."
                showBackButton
              />
            } />

          </Route>
        </Route>

      </Routes>
    </SheetProvider>
  )
}

export default App

