import { gql } from '@apollo/client';

export const CREATE_SALE = gql`
  mutation CreateSale($input: CreateSaleInput!) {
    createSale(input: $input) {
      id
      saleDate
      totalAmount
      paymentMethod
      status
      itemCount
    }
  }
`;
