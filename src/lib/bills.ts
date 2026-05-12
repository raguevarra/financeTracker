import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreateBillInput = {
    name: string;
    amount: string;
    dueDate: string;
    accountId: string;
}

export async function createBillForAccount({
    name,
    amount,
    dueDate,
    accountId,
} : CreateBillInput) {
    return prisma.bill.create({
        data: {
            name,
            amount: new Prisma.Decimal(amount),
            dueDate: new Date(dueDate),
            accountId,
        },
    });
}

export async function getBillByIdForUser(billId: string, userId: string) {
    return prisma.bill.findFirst({
        where: {
            id: billId,
            account: {
                OR: [
                    {ownerId: userId},
                    {
                        household: {
                            members: {
                                some: {
                                    userId,
                                },
                            },
                        },
                    },
                ],
            },
        },
    });
}

export async function deleteBillById(billId: string) {
    return prisma.bill.delete({
        where: {
            id: billId,
        },
    });
}