export function serializeAccount(account: any) {
    return {
        ...account,
        balance: account.balance.toString(),
        createdAt: account.createdAt?.toISOString?.() ?? account.createdAt,
        updatedAt: account.updatedAt?.toISOString?.() ?? account.updatedAt,

        transactions: account.transactions?.map(serializeTransaction),
        bills: account.bills?.map(serializeBill),
    };
}

export function serializeTransaction(transaction: any) {
    return {
        ...transaction,
        amount: transaction.amount.toString(),
        date: transaction.date.toISOString(),
        createdAt: transaction.createdAt?.toISOString?.() ?? transaction.createdAt,
        updatedAt: transaction.updatedAt?.toISOString?.() ?? transaction.updatedAt,
    };
}

export function serializeBill(bill: any) {
    return {
        ...bill,
        amount: bill.amount.toString(),
        dueDate: bill.dueDate.toISOString(),
        createdAt: bill.createdAt?.toISOString?.() ?? bill.createdAt,
        updatedAt: bill.updatedAt?.toISOString?.() ?? bill.updatedAt,
    };
}