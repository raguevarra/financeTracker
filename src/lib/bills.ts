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