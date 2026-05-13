import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // clear existing data in dependency order
  await prisma.transaction.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.account.deleteMany();
  await prisma.householdMember.deleteMany();
  await prisma.household.deleteMany();
  await prisma.user.deleteMany();

  // users
  const parent = await prisma.user.create({
    data: {
      name: "Roman",
      email: "roman@example.com",
    },
  });

  const child = await prisma.user.create({
    data: {
      name: "Child",
      email: "child@example.com",
    },
  });

  // household
  const household = await prisma.household.create({
    data: {
      name: "Family Household",
    },
  });

  // household memberships
  await prisma.householdMember.createMany({
    data: [
      {
        userId: parent.id,
        householdId: household.id,
        role: "PARENT",
      },
      {
        userId: child.id,
        householdId: household.id,
        role: "CHILD",
      },
    ],
  });

  // accounts
  const childAccount = await prisma.account.create({
    data: {
      name: "Child's Account",
      type: "CHEQUING",
      balance: new Prisma.Decimal("1250.75"),
      ownerId: child.id,
      householdId: household.id,
    },
  });

  const parentAccount = await prisma.account.create({
    data: {
      name: "Roman's Account",
      type: "CHEQUING",
      balance: new Prisma.Decimal("2500.00"),
      ownerId: parent.id,
      householdId: household.id,
    },
  });

  // regular transactions
  await prisma.transaction.createMany({
    data: [
      {
        name: "Paycheque",
        amount: new Prisma.Decimal("500.00"),
        type: "CREDIT",
        date: new Date("2026-05-01"),
        accountId: childAccount.id,
      },
      {
        name: "Spotify",
        amount: new Prisma.Decimal("-18.99"),
        type: "DEBIT",
        date: new Date("2026-05-02"),
        accountId: childAccount.id,
      },
      {
        name: "Takeout",
        amount: new Prisma.Decimal("-25.50"),
        type: "DEBIT",
        date: new Date("2026-05-03"),
        accountId: childAccount.id,
      },
      {
        name: "Old Grocery Run",
        amount: new Prisma.Decimal("-40.00"),
        type: "DEBIT",
        date: new Date("2026-04-20"),
        accountId: childAccount.id,
      },
      {
        name: "Salary",
        amount: new Prisma.Decimal("2200.00"),
        type: "CREDIT",
        date: new Date("2026-05-01"),
        accountId: parentAccount.id,
      },
      {
        name: "Groceries",
        amount: new Prisma.Decimal("-85.25"),
        type: "DEBIT",
        date: new Date("2026-05-04"),
        accountId: parentAccount.id,
      },
    ],
  });

  // child bills
  const phoneBill = await prisma.bill.create({
    data: {
      name: "Phone Bill",
      amount: new Prisma.Decimal("45.00"),
      dueDate: new Date("2026-05-15"),
      isPaid: false,
      accountId: childAccount.id,
    },
  });

  const spotifyBill = await prisma.bill.create({
    data: {
      name: "Spotify",
      amount: new Prisma.Decimal("18.99"),
      dueDate: new Date("2026-05-20"),
      isPaid: false,
      accountId: childAccount.id,
    },
  });

  const paidChildBill = await prisma.bill.create({
    data: {
      name: "Old Paid Bill",
      amount: new Prisma.Decimal("30.00"),
      dueDate: new Date("2026-05-01"),
      isPaid: true,
      accountId: childAccount.id,
    },
  });

  // parent bills
  const mortgageBill = await prisma.bill.create({
    data: {
      name: "Mortgage",
      amount: new Prisma.Decimal("1200.00"),
      dueDate: new Date("2026-05-28"),
      isPaid: false,
      accountId: parentAccount.id,
    },
  });

  const hydroBill = await prisma.bill.create({
    data: {
      name: "Hydro",
      amount: new Prisma.Decimal("95.75"),
      dueDate: new Date("2026-05-18"),
      isPaid: false,
      accountId: parentAccount.id,
    },
  });

  const paidHydroBill = await prisma.bill.create({
    data: {
      name: "Paid Internet",
      amount: new Prisma.Decimal("80.00"),
      dueDate: new Date("2026-05-05"),
      isPaid: true,
      accountId: parentAccount.id,
    },
  });

  // transactions created from paid bills
  await prisma.transaction.createMany({
    data: [
      {
        name: `Paid: ${paidChildBill.name}`,
        amount: new Prisma.Decimal("-30.00"),
        type: "DEBIT",
        date: new Date("2026-05-01"),
        accountId: childAccount.id,
        billId: paidChildBill.id,
      },
      {
        name: `Paid: ${paidHydroBill.name}`,
        amount: new Prisma.Decimal("-80.00"),
        type: "DEBIT",
        date: new Date("2026-05-05"),
        accountId: parentAccount.id,
        billId: paidHydroBill.id,
      },
    ],
  });

  console.log("database seeded");
  console.log({
    parentAccount: parentAccount.id,
    childAccount: childAccount.id,
    unpaidBills: [phoneBill.id, spotifyBill.id, mortgageBill.id, hydroBill.id],
    paidBills: [paidChildBill.id, paidHydroBill.id],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });