import { gql } from '@apollo/client';

/**
 * GraphQL Mutation to change the status of an existing sale.
 * Matches the 'changeSaleStatus(input: ChangeSaleStatusInput!): Sale!' mutation in server/src/features/sale/sale.gql.
 */
export const CHANGE_SALE_STATUS = gql`
  mutation ChangeSaleStatus($input: ChangeSaleStatusInput!) {
    changeSaleStatus(input: $input) {
      id
      status
    }
  }
`;

export const CREATE_POS_SALE = gql`
  mutation CreatePosSale($input: CreateSaleInput!) {
    createSale(input: $input) {
      id
      saleDate
      totalAmount
      paymentMethod
      status
    }
  }
`;
