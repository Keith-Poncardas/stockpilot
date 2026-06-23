import { prisma } from "@/lib";
import { createPaginator, PaginationInput } from "@/utils";

export class CustomerService {

    /** Get Customer by ID */
    async getCustomer(id: string) {

        const [customer, totalTransaction, totalSpent] = await Promise.all([

            /** Get the customer */
            prisma.customer.findUnique({
                where: { id }
            }),

            /** Get the total transaction */
            prisma.sale.count({
                where: { customerId: id }
            }),

            /** Total spent of a customer */
            prisma.sale.aggregate({
                where: { customerId: id },
                _sum: {
                    totalAmount: true
                }
            })

        ]);

        return {
            customer,
            totalTransaction,
            totalSpent: totalSpent._sum.totalAmount
        }

    }

    /** Get paginated purchase history for a customer, including sale items */
    async customerPurchaseHistory(customerId: string, pagination?: PaginationInput) {

        const { params, buildMeta } = createPaginator(pagination);

        const [sales, total] = await Promise.all([

            prisma.sale.findMany({
                where: { customerId },
                include: {
                    saleItems: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: params.skip,
                take: params.limit,
            }),

            prisma.sale.count({ where: { customerId } })

        ]);

        return {
            data: sales,
            meta: buildMeta(total)
        };

    }

}

export const customerService = new CustomerService();