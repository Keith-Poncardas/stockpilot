import { gql } from '@apollo/client';

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      sku
      status
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation EditProduct($input: EditProductInput!) {
    editProduct(input: $input) {
      id
      name
      sku
      status
    }
  }
`;

export const CHANGE_PRODUCT_STATUS = gql`
  mutation ChangeProductStatus($input: ChangeProductStatusInput!) {
    changeProductStatus(input: $input) {
      id
      status
    }
  }
`;
