import { gql } from '@apollo/client';

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      firstName
      lastName
      phone
      email
      city
      province
      totalOrders
      totalSpent
      lastPurchase
      createdAt
      updatedAt
    }
  }
`;
