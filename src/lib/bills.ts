import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreateBillInput = {
    name: string;
    amount: string;
    dueDate: string;
    accountId: string;
}

type UpdateBillInput = {
    name: string;
    amount: string;
    dueDate: string;
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

export async function updateBillById(
    billId: string,
    { name, amount, dueDate }: UpdateBillInput
) {
    return prisma.bill.update({
        where: {
            id: billId,
        },
        data: {
            name,
            amount: new Prisma.Decimal(amount),
            dueDate: new Date(dueDate),
        },
    });
}

export async function payBillById(billId: string) {
  return prisma.$transaction(async (tx) => {
    const bill = await tx.bill.findUnique({
      where: {
        id: billId,
      },
    });

    if (!bill) {
      throw new Error("BILL_NOT_FOUND");
    }

    if (bill.isPaid) {
      throw new Error("BILL_ALREADY_PAID");
    }

    const transaction = await tx.transaction.create({
      data: {
        name: `Paid: ${bill.name}`,
        amount: bill.amount.mul(-1),
        type: "DEBIT",
        date: new Date(),
        accountId: bill.accountId,
        billId: bill.id,
      },
    });

    await tx.account.update({
        where: {
            id: bill.accountId,
        },
        data: {
            balance: {
                increment: bill.amount.mul(-1),
            },
        },
    });

    const updatedBill = await tx.bill.update({
      where: {
        id: bill.id,
      },
      data: {
        isPaid: true,
      },
    });

    return {
      bill: updatedBill,
      transaction,
    };
  });
}