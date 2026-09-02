import { gql } from '@apollo/client';

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      sku
      imageUrl
      imagePublicId
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
      imageUrl
      imagePublicId
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

export const UPLOAD_PRODUCT_IMAGE = gql`
  mutation UploadProductImage($file: Upload!) {
    uploadProductImage(file: $file) {
      url
      secureUrl
      publicId
      format
      width
      height
      bytes
    }
  }
`;

export const DELETE_PRODUCT_IMAGE = gql`
  mutation DeleteProductImage($publicId: String!) {
    deleteProductImage(publicId: $publicId)
  }
`;

