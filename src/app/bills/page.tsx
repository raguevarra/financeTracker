import Link from "next/link";
import { AddBillModal, BillFilterList } from "@/components";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { getBillsForUser } from "@/lib/bills";
import { serializeBill } from "@/lib/serializers";

export default async function BillsPage() {
  const userId = await getCurrentUserId();
  const bills = await getBillsForUser(userId);

  const serializedBills = bills.map(serializeBill);

  const unpaidBills = serializedBills.filter((bill) => !bill.isPaid);
  const paidBills = serializedBills.filter((bill) => bill.isPaid);

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Bills</p>
          <h1 className="dashboard-title">Bills</h1>
          <p className="dashboard-subtitle">
            Track upcoming bills, paid bills, and payment status from one place.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <Link href="/" className="dashboard-secondary-link">
            View Dashboard
          </Link>
        </div>
      </section>

      <section className="dashboard-card">
        <p className="dashboard-card-label">Unpaid Bills</p>
        <p className="dashboard-balance">{unpaidBills.length}</p>
        <p className="dashboard-subtitle">
          {paidBills.length} paid, {serializedBills.length} total.
        </p>
      </section>

      <section className="dashboard-card quick-add-card">
        <div className="dashboard-section-header quick-add-header">
          <div className="quick-add-copy">
            <p className="quick-add-title">Quick Add</p>
            <p className="quick-add-subtitle">
              Add a bill with an amount and due date.
            </p>
          </div>

          <AddBillModal />
        </div>
      </section>

      <BillFilterList bills={serializedBills} />
    </div>
  );
}