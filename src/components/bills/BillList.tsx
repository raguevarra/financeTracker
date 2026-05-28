// src/components/BillList.tsx

import { BillCard, type BillCardData } from "./BillCard";

type BillListProps = {
  bills: BillCardData[];
};

// Renders the upcoming-bills section for the dashboard.
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
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>
      )}
    </section>
  );
}
