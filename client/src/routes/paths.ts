/**
 * Centralized route configurations for the application.
 * Use these paths for all navigation (e.g. useNavigate, <Link>) to ensure consistency.
 */
export const PATHS = {
  auth: {
    login: '/login',
    signup: '/signup',
    otp: '/otp',
    forgotPassword: '/forgot-password',
    changePassword: '/change-password',
    pendingApproval: '/pending-approval',
  },
  dashboard: {
    root: '/',
  },
  users: {
    root: '/users',
    view: (userId: string) => `/users/${userId}/view`,
  },
  products: {
    root: '/products',
    new: '/products/new',
    view: (productId: string) => `/products/${productId}/view`,
    edit: (productId: string) => `/products/${productId}/edit`,
  },
  inventory: {
    root: '/inventory',
    adjust: (inventoryId: string) => `/inventory/${inventoryId}/adjust`,
    record: '/inventory/record',
  },
  stockMovement: {
    root: '/stock-movement',
    view: (stockMovementId: string) => `/stock-movement/${stockMovementId}/view`,
  },
  customers: {
    root: '/customers',
    new: '/customers/new',
    view: (customerId: string) => `/customers/${customerId}/view`,
  },
  sales: {
    root: '/sales',
    pos: '/sales/pos',
    view: (saleId: string) => `/sales/${saleId}/view`,
  }
} as const;
