/*
Component for per-account bill list rendering rather than all bills
*/

import { BillCard, type BillCardData } from "./BillCard";

type AccountBillListProps = {
    bills: BillCardData[];
    accountName: string;
};

// Displays the bills attached to a single account.
export function AccountBillList({ bills, accountName }: AccountBillListProps) {
    return (
        <section>
            <div>
                <h2>Account Bills</h2>
                <p>All bills for {accountName}</p>
            </div>

            {bills.length === 0 ? (
                <p>No bills found for this account.</p>
            ) : (
                <div className="bills-card-grid">
                    {bills.map((bill) => (
                        <BillCard key = {bill.id} bill={bill} />
                    ))}
                </div>
            )}
        </section>
    );
}
