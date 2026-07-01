export function getProductStatusColor(status: string) {
    switch (status) {
        case 'ACTIVE': return 'bg-emerald-50 text-emerald-700'
        case 'INACTIVE': return 'bg-gray-100 text-gray-500'
        case 'DISCONTINUED': return 'bg-red-50 text-red-600'
        case 'DRAFT': return 'bg-amber-50 text-amber-600'
        case 'ARCHIVED': return 'bg-slate-100 text-slate-500'
        default: return 'bg-gray-100 text-gray-500'
    }
}
