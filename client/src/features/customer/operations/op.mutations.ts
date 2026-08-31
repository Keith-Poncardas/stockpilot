import { gql } from '@apollo/client';

/**
 * Creates a new customer.
 * The Customer type does not have city, province, totalOrders, totalSpent,
 * or lastPurchase as flat fields — those are computed via purchaseSummary.
 */
export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      firstName
      lastName
      phone
      email
      provinceCode
      cityCode
      barangayCode
      postalCode
      country
      createdAt
      updatedAt
    }
  }
`;

/**
 * Updates an existing customer.
 */
export const EDIT_CUSTOMER = gql`
  mutation EditCustomer($input: EditCustomerInput!) {
    editCustomer(input: $input) {
      id
      firstName
      lastName
      phone
      email
      addressLine1
      addressLine2
      provinceCode
      cityCode
      barangayCode
      postalCode
      country
      createdAt
      updatedAt
    }
  }
`;

