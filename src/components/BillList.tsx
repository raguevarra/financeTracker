import { Prisma } from "@prisma/client"
import { formatCurrency } from "@/lib/formatters";

type Bill = {
    id: string,
    name: string,
    amount: Prisma.Decimal | string | number;
    dueDate: string;
    isPaid: boolean;
};

type BillListProps = {
    bills: Bill[];
};

function formatDueDate(date: string) {
    return new Date(date).toLocaleDateString("en-CA", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function BillList({ bills }: BillListProps) {
    return (
        <section>
            <div>
                <h2>Upcoming Bills</h2>
                <p>Bills Due Soon</p>
            </div>

            {bills.length === 0 ? (
                <div>
                    <p>No upcoming bills.</p>
                </div>
            ) : (
                <div className="bill-card-grid">
                    {bills.map((bill) => (
                        <article key={bill.id} className="bill-card">
                            <div className="bill-card-header">
                                <div>
                                    <h3>{bill.name}</h3>
                                    <p>due {formatDueDate(bill.dueDate)}</p>
                                </div>

                                <span className="bill-status">
                                    {bill.isPaid ? "paid" : "unpaid"}
                                </span>
                            </div>

                            <p className="bill-amount">
                                {formatCurrency(bill.amount)}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}