const dashboardSections = [
  {
    title: "Accounts",
    description: "TODO: Show checking, savings, credit cards, cash, debts, and balances.",
  },
  {
    title: "Transactions",
    description: "TODO: List recent spending, income, transfers, filters, and manual entry.",
  },
  {
    title: "Budgets",
    description: "TODO: Track monthly category limits and remaining household spend.",
  },
  {
    title: "Reports",
    description: "TODO: Summarize income, expenses, net worth, and category trends.",
  },
];

export default function Home() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>Finance Tracker</h1>
          <p className="muted">Private family finance dashboard.</p>
        </div>
      </header>

      <section className="app-grid" aria-label="Dashboard sections">
        {dashboardSections.map((section) => (
          <article className="panel" key={section.title}>
            <h2>{section.title}</h2>
            <p className="muted">{section.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

