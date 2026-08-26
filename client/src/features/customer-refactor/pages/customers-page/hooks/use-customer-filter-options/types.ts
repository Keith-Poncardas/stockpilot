
export interface ICustomerFilters {
    orderBy: string;
    orderDirection: string;
    dateFrom: string;
    dateTo: string;
}

export interface IUseCustomerFilterOptionsReturn {
    orderByFilter: string;
    setOrderByFilter: (val: string) => void;
    orderDirectionFilter: string;
    setOrderDirectionFilter: (val: string) => void;
    dateFrom: string;
    setDateFrom: (val: string) => void;
    dateTo: string;
    setDateTo: (val: string) => void;
}
