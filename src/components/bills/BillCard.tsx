/*
Bill card component for reuse across BillList.tsx and AccountBillList.tsx
*/

import { formatCurrency, formatDate } from "@/lib/formatters";
import { DeleteBillButton } from "./DeleteBillButton";
import { EditBillButton } from "./EditBillButton";
import { PayBillButton } from "./PayBillButton";

export type BillCardData = {
  id: string;
  name: string;
  amount: string;
  dueDate: Date | string;
  isPaid: boolean;
};

type BillCardProps = {
  bill: BillCardData;
};

export function BillCard({ bill }: BillCardProps) {
  const serializedDueDate =
    bill.dueDate instanceof Date ? bill.dueDate.toISOString() : bill.dueDate;

  const editableBill = {
    id: bill.id,
    name: bill.name,
    amount: String(bill.amount),
    dueDate: serializedDueDate,
    isPaid: bill.isPaid,
  };

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

      <div className="bill-card-footer">
        <p className="bill-amount">{formatCurrency(bill.amount)}</p>

        <div className="bill-card-actions">
          <div className="bill-card-actions-top">
            <EditBillButton bill={editableBill} />

            <DeleteBillButton billId={bill.id} billName={bill.name} />
          </div>

          <PayBillButton billId={bill.id} isPaid={bill.isPaid} />
        </div>
      </div>
    </article>
  );
}