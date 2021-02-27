export default [
  {
    path: '/admin/account',
    name: 'admin-account',
    component: () => import('@/pages/AdminAccount.vue'),
    meta: {
      title: 'Comptes',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/customer',
    name: 'admin-customer',
    component: () => import('@/pages/AdminCustomer.vue'),
    meta: {
      title: 'Clients',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/suppliers',
    name: 'admin-suppliers',
    component: () => import('@/pages/AdminSuppliers.vue'),
    meta: {
      title: 'Fournisseurs',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/product',
    name: 'admin-product',
    component: () => import('@/pages/AdminProduct.vue'),
    meta: {
      title: 'Produit',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/product-type',
    name: 'admin-product-type',
    component: () => import('@/pages/AdminProductType.vue'),
    meta: {
      title: 'Type Produit',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/order',
    name: 'admin-order',
    component: () => import('@/pages/AdminOrder.vue'),
    meta: {
      title: 'Commande',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/order-item',
    name: 'admin-order-item',
    component: () => import('@/pages/AdminOrderItem.vue'),
    meta: {
      title: 'Ligne de Commande',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/invoice',
    name: 'admin-invoice',
    component: () => import('@/pages/AdminInvoice.vue'),
    meta: {
      title: 'Facture',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/invoice-type',
    name: 'admin-invoice-type',
    component: () => import('@/pages/AdminInvoiceType.vue'),
    meta: {
      title: 'Type Facture',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/invoice-line-item',
    name: 'admin-invoice-line-item',
    component: () => import('@/pages/AdminInvoiceLineItem.vue'),
    meta: {
      title: 'Article de Facture',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/transaction',
    name: 'admin-transaction',
    component: () => import('@/pages/AdminTransaction.vue'),
    meta: {
      title: 'Transaction',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/transaction-type',
    name: 'admin-transaction-type',
    component: () => import('@/pages/AdminTransactionType.vue'),
    meta: {
      title: 'Type Transaction',
      requiresAuth: true,
      keepAlive: false
    }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    meta: {
      title: 'Utilisateurs',
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "admin-users" */ '@/pages/AdminUsers.vue')
  },
  {
    path: '/admin/documents',
    name: 'admin-documents',
    meta: {
      title: 'Documents',
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "admin-users" */ '@/components/Notyet.vue')
  },
  {
    path: '/admin/organisation',
    name: 'admin-organisation',
    meta: {
      title: 'Organisation',
      requiresAuth: true
    },
    component: () =>
      import(
        /* webpackChunkName: "admin-users" */ '@/pages/AdminOrganisations.vue'
      )
  }
]

// export default new VueRouter({
//   routes
// })
