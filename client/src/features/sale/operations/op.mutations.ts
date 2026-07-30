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

export const CHANGE_SALE_STATUS = gql`
  mutation ChangeSaleStatus($input: ChangeSaleStatusInput!) {
    changeSaleStatus(input: $input) {
      id
      status
    }
  }
`;

