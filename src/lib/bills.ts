import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { adjustAccountBalance } from "./accountBalances";

type CreateBillInput = {
  name: string;
  amount: string;
  dueDate: string;
  userId: string;
};

type UpdateBillInput = {
  name: string;
  amount: string;
  dueDate: string;
};

export async function createBillForUser({
  name,
  amount,
  dueDate,
  userId,
}: CreateBillInput) {
  return prisma.bill.create({
    data: {
      name,
      amount: new Prisma.Decimal(amount),
      dueDate: new Date(dueDate),
      userId,
    },
  });
}

export async function getBillByIdForUser(billId: string, userId: string) {
  return prisma.bill.findFirst({
    where: {
      id: billId,
      userId,
    },
  });
}

export async function getBillsForUser(userId: string) {
  return prisma.bill.findMany({
    where: {
      userId,
    },
    orderBy: {
      dueDate: "asc",
    },
  });
}

export async function getUpcomingBillsForUser(
  userId: string,
  dueBefore: Date
) {
  return prisma.bill.findMany({
    where: {
      userId,
      isPaid: false,
      dueDate: {
        lte: dueBefore,
      },
    },
    orderBy: {
      dueDate: "asc",
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

export async function payBillById(billId: string, accountId: string) {
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
        accountId,
        billId: bill.id,
      },
    });

    await adjustAccountBalance(tx, accountId, bill.amount.negated());

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