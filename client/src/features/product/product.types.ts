import type { Row } from "@tanstack/react-table"
import type { ProductStatus } from "./product.constants"

export interface IProduct {
    id: string
    sku: string
    name: string
    description: string
    unitPrice: number
    costPrice: number
    status: ProductStatus
    createdAt: string
    updatedAt: string
}

export interface ProductRowInfoCellProps {
    row: Row<IProduct>;
}
