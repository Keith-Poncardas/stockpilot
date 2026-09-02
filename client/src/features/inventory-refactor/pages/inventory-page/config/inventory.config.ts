import type { SelectFilterOption } from '@/components/ui/select-filter';
import {
    STOCK_STATUS_FILTER_OPTIONS,
    INVENTORY_ORDER_BY_OPTIONS,
    INVENTORY_ORDER_DIRECTION_OPTIONS,
} from '@/features/inventory-refactor/constants';

export const inventoryToolbarConfig = {
    searchPlaceholder: 'Search catalog by product name or SKU…',
    stockStatusOptions: STOCK_STATUS_FILTER_OPTIONS as unknown as SelectFilterOption[],
    orderByOptions: INVENTORY_ORDER_BY_OPTIONS as unknown as SelectFilterOption[],
    orderDirectionOptions: INVENTORY_ORDER_DIRECTION_OPTIONS as unknown as SelectFilterOption[],
};
