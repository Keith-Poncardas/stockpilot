# Customer Location Model Refactor Task List (Province, Municipality, Barangay)

> **Date Created:** August 27, 2026  
> **Target Execution:** Tomorrow  
> **Status:** Pending  

---

## 📌 1. Overview & Objective

The goal of this task is to update the Customer model and location selector to support a **3-tier location hierarchy** using Philippine Standard Geographic Code (PSGC):

1. **Province** *(Already existing)*
2. **Municipality / City** *(Already existing)*
3. **Barangay** *(🔥 NEW Field)*

This change affects the database schema, backend GraphQL services, validation rules, frontend form components, customer table formatting, and all references to customer address across the application (including the Point of Sale (POS) system).

---

## 📊 2. Summary of Location Fields

| Field Name | Type / Format | Status | PSGC Source / Method | DB Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Province** | `provinceCode` (String) | Existing | `listProvinces()` | `province` |
| **Municipality / City** | `cityCode` (String) | Existing | `listMuncities(provinceCode)` | `city` |
| **Barangay** | `barangayCode` (String) | **NEW** | `listBarangays(cityCode)` / `@jobuntux/psgc` | `barangay` |

---

## 📋 3. Detailed Step-by-Step Action Items

### Phase 1: Database & Server Backend (`server/`)

- [ ] **1. Update Database Schema**
  - **File:** [`server/prisma/schema.prisma`](file:///d:/Documents/GitHub/stockpilot/server/prisma/schema.prisma#L160-L178)
  - **Action:** Add `barangay` field (and/or `barangayCode`) to the `Customer` model:
    ```prisma
    model Customer {
      ...
      city         String?  @db.VarChar
      province     String?  @db.VarChar
      barangay     String?  @db.VarChar  // NEW
      ...
    }
    ```
  - **Migration:** Run `npx prisma migrate dev --name add_barangay_to_customer` and `npx prisma generate`.

- [ ] **2. Update GraphQL Schema & Types**
  - **File:** [`server/src/features/customer/customer.gql`](file:///d:/Documents/GitHub/stockpilot/server/src/features/customer/customer.gql)
  - **Action:** 
    - Add `barangayCode: String` to `type Customer`.
    - Add `barangayCode: String` to `input CreateCustomerInput` and `input UpdateCustomerInput` (if applicable).
  - **File:** [`server/src/features/customer/types.ts`](file:///d:/Documents/GitHub/stockpilot/server/src/features/customer/types.ts)
    - Update TypeScript interfaces/types to include `barangayCode`.

- [ ] **3. Update PSGC Validation & Helpers**
  - **File:** [`server/src/utils/utils.psgc.ts`](file:///d:/Documents/GitHub/stockpilot/server/src/utils/utils.psgc.ts)
  - **Action:**
    - Import `listBarangays` (or equivalent method) from `@jobuntux/psgc`.
    - Add `isValidBarangay(cityCode: string, barangayCode: string): boolean`.
    - Extend `psgcAddressRefine` to validate `barangayCode` after `cityCode`.

- [ ] **4. Update Backend Customer Validation & Service**
  - **File:** [`server/src/features/customer/customer.validation.ts`](file:///d:/Documents/GitHub/stockpilot/server/src/features/customer/customer.validation.ts)
    - Update Zod schema to validate `barangayCode`.
  - **File:** [`server/src/features/customer/customer.service.ts`](file:///d:/Documents/GitHub/stockpilot/server/src/features/customer/customer.service.ts)
    - Update customer creation (`createCustomer`) and update methods to persist `barangay` / `barangayCode`.
    - Ensure address formatting logic includes Barangay.

---

### Phase 2: Frontend API & Types (`client/`)

- [ ] **1. Update Client GraphQL Operations & Documents**
  - Search for customer queries/mutations in `client/src/features/customer-refactor` or `client/src/features/customer`.
  - Add `barangayCode` field to selection sets.

- [ ] **2. Run GraphQL Codegen**
  - Execute `npm run codegen` in `client` to update generated React hooks and GraphQL types.

- [ ] **3. Update Client Validation Schemas**
  - **File:** [`client/src/features/customer-refactor/validation/customer.validation.ts`](file:///d:/Documents/GitHub/stockpilot/client/src/features/customer-refactor/validation/customer.validation.ts)
  - **Action:** Add `barangayCode` to the Zod form validation schema.

---

### Phase 3: Frontend UI Components & Forms (`client/`)

- [ ] **1. Cascading Address Selector Form Component**
  - **File:** [`client/src/features/customer-refactor/components/create-customer-sheet/sections/address-info/AddressInfo.tsx`](file:///d:/Documents/GitHub/stockpilot/client/src/features/customer-refactor/components/create-customer-sheet/sections/address-info/AddressInfo.tsx)
  - **Action:**
    - Watch `cityCode` using `useWatch({ control, name: 'cityCode' })`.
    - Fetch/compute `barangayOptions` filtered by selected `cityCode` using `listBarangays(selectedCityCode)`.
    - Add a new `Controller` / `SelectFilter` for **Barangay**.
    - Update selection reset logic:
      - Reset `cityCode`, `barangayCode`, and `postalCode` when **Province** changes.
      - Reset `barangayCode` when **Municipality / City** changes.

- [ ] **2. Customer View Sheet / Customer Address Display**
  - **File:** [`client/src/features/customer-refactor/components/view-customer-sheet/sections/customer-address-section/CustomerAddressSection.tsx`](file:///d:/Documents/GitHub/stockpilot/client/src/features/customer-refactor/components/view-customer-sheet/sections/customer-address-section/CustomerAddressSection.tsx)
  - **Action:** Display Barangay alongside Municipality and Province in the detail section.

- [ ] **3. Customer Table & Utility Formatting**
  - **File:** [`client/src/features/customer-refactor/pages/customers-page/columns/customer.utils.ts`](file:///d:/Documents/GitHub/stockpilot/client/src/features/customer-refactor/pages/customers-page/columns/customer.utils.ts)
    - Update `formatCustomerAddress()` helper to format address as:  
      `"[Barangay], [Municipality/City], [Province]"`.
  - **File:** [`client/src/features/customer-refactor/pages/customers-page/cells/location/LocationCell.tsx`](file:///d:/Documents/GitHub/stockpilot/client/src/features/customer-refactor/pages/customers-page/cells/location/LocationCell.tsx)
    - Render updated location string.
  - **File:** [`client/src/features/customer-refactor/pages/customers-page/columns/customer.columns.tsx`](file:///d:/Documents/GitHub/stockpilot/client/src/features/customer-refactor/pages/customers-page/columns/customer.columns.tsx)
    - Ensure table column sorting/filtering accounts for Barangay if applicable.

---

### Phase 4: POS System & External References

- [ ] **1. POS Customer Selector & Details**
  - **Files:** Customer search/selection component in POS (`client/src/features/sale/` or POS modules).
  - **Action:** Ensure customer card or dropdown inside POS displays the full location breakdown (Barangay, City, Province).

- [ ] **2. Sale Schema & Invoice / Receipt Previews**
  - **File:** [`server/src/features/sale/sale.gql`](file:///d:/Documents/GitHub/stockpilot/server/src/features/sale/sale.gql)
  - **Action:** If sales reference customer address snapshots or populated customer records, verify `barangayCode` / `barangay` is exposed.
  - **Receipt / Invoice Printouts:** Update printable receipt/invoice templates to include Barangay in customer billing/shipping address lines.

---

## 🔍 4. Impacted Files Reference Table

| Target Layer | File Path | Focus Area |
| :--- | :--- | :--- |
| **Prisma DB** | [`server/prisma/schema.prisma`](file:///d:/Documents/GitHub/stockpilot/server/prisma/schema.prisma#L160) | Add `barangay` column to Customer table |
| **GraphQL Schema** | [`server/src/features/customer/customer.gql`](file:///d:/Documents/GitHub/stockpilot/server/src/features/customer/customer.gql) | `barangayCode` in Type & Inputs |
| **Server PSGC** | [`server/src/utils/utils.psgc.ts`](file:///d:/Documents/GitHub/stockpilot/server/src/utils/utils.psgc.ts) | Add Barangay PSGC validator |
| **Server Validation**| [`server/src/features/customer/customer.validation.ts`](file:///d:/Documents/GitHub/stockpilot/server/src/features/customer/customer.validation.ts) | Zod schema refinement |
| **Server Service** | [`server/src/features/customer/customer.service.ts`](file:///d:/Documents/GitHub/stockpilot/server/src/features/customer/customer.service.ts) | CRUD address mapping |
| **Client Validation**| [`client/src/features/customer-refactor/validation/customer.validation.ts`](file:///d:/Documents/GitHub/stockpilot/client/src/features/customer-refactor/validation/customer.validation.ts) | Client Zod schema |
| **Address Form** | [`client/src/features/customer-refactor/components/create-customer-sheet/sections/address-info/AddressInfo.tsx`](file:///d:/Documents/GitHub/stockpilot/client/src/features/customer-refactor/components/create-customer-sheet/sections/address-info/AddressInfo.tsx) | Cascading Barangay Select |
| **Table Utils** | [`client/src/features/customer-refactor/pages/customers-page/columns/customer.utils.ts`](file:///d:/Documents/GitHub/stockpilot/client/src/features/customer-refactor/pages/customers-page/columns/customer.utils.ts) | Address formatter |
| **Location Cell** | [`client/src/features/customer-refactor/pages/customers-page/cells/location/LocationCell.tsx`](file:///d:/Documents/GitHub/stockpilot/client/src/features/customer-refactor/pages/customers-page/cells/location/LocationCell.tsx) | Table display |
| **Customer View** | [`client/src/features/customer-refactor/components/view-customer-sheet/sections/customer-address-section/CustomerAddressSection.tsx`](file:///d:/Documents/GitHub/stockpilot/client/src/features/customer-refactor/components/view-customer-sheet/sections/customer-address-section/CustomerAddressSection.tsx) | Sheet details display |
| **Sale GQL** | [`server/src/features/sale/sale.gql`](file:///d:/Documents/GitHub/stockpilot/server/src/features/sale/sale.gql) | POS sale customer reference |

---

## 🧪 5. Verification & Testing Checklist

- [ ] **Prisma Migration**: Run migration successfully without breaking existing customer rows.
- [ ] **Cascading Dropdowns Test**:
  1. Select Province -> City list populates.
  2. Select City -> Barangay list populates.
  3. Change Province -> City and Barangay reset.
  4. Change City -> Barangay resets.
- [ ] **Create Customer Flow**: Submit form with Barangay selected and verify DB entry.
- [ ] **Customer Table View**: Check that `LocationCell` shows `Barangay, City, Province`.
- [ ] **POS Customer Integration**: Verify POS customer selector and receipt preview render the full address correctly.
