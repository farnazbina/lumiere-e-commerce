src/
├── app/
│   ├── (store)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── categories/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   └── checkout/page.tsx
│   │
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── account/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── orders/
│   │   ├── addresses/
│   │   └── settings/
│   │
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── inventory/
│   │   └── reports/
│   │
│   ├── staff/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── orders/
│   │   └── inventory/
│   │
│   ├── api/
│   │   ├── checkout/route.ts
│   │   ├── webhooks/payment/route.ts
│   │   └── uploads/route.ts
│   │
│   ├── layout.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   └── not-found.tsx
│
├── features/
│   ├── auth/
│   │   ├── actions.ts
│   │   ├── permissions.ts
│   │   ├── schemas.ts
│   │   └── components/
│   ├── products/
│   │   ├── queries.ts
│   │   ├── actions.ts
│   │   ├── schemas.ts
│   │   ├── types.ts
│   │   └── components/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── inventory/
│   └── users/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── lib/
│   ├── auth/
│   │   ├── session.ts
│   │   └── guards.ts
│   ├── db/
│   │   ├── client.ts
│   │   └── queries/
│   ├── payments/
│   ├── storage/
│   ├── email/
│   ├── env.ts
│   └── utils.ts
│
├── config/
│   ├── navigation.ts
│   ├── permissions.ts
│   └── site.ts
│
├── hooks/
├── types/
└── middleware.ts