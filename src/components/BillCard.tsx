/*
Bill card component for reuse across 'BillList.tsx' and 'AccountBillList.tsx'
*/

import { Prisma } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/formatters";

export type BillCardData = {
    id: string;
    name: string;
    amount: Prisma.Decimal | number | string;
    dueDate: Date | string;
    isPaid: boolean;
};

type BillCardProps = {
    bill: BillCardData;
};

export function BillCard({ bill }: BillCardProps) {
    return (
        <article className="bill-card">
            <div className="bill-card-header">
                <div>
                    <h3>{bill.name}</h3>
                    <p>Due {formatDate(bill.dueDate)}</p>
                </div>

                <span className="bill-status">
                    {bill.isPaid ? "Paid" : "Unpaid"}
                </span>
            </div>

            <p className="bill-amount">
                {formatCurrency(bill.amount)}
            </p>
        </article>
    )
}