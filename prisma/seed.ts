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
      clerkId: "user_seed_parent",
      name: "Roman",
      email: "roman@example.com",
    },
  });

  const child = await prisma.user.create({
    data: {
      clerkId: "user_seed_child",
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
        role: "OWNER",
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
      visibility: "PERSONAL",
      ownerId: child.id,
      householdId: household.id,
    },
  });

  const parentAccount = await prisma.account.create({
    data: {
      name: "Roman's Personal Chequing",
      type: "CHEQUING",
      balance: new Prisma.Decimal("2500.00"),
      visibility: "PERSONAL",
      ownerId: parent.id,
      householdId: household.id,
    },
  });

  const jointAccount = await prisma.account.create({
    data: {
      name: "Family Joint Chequing",
      type: "CHEQUING",
      balance: new Prisma.Decimal("4200.00"),
      visibility: "HOUSEHOLD",
      householdId: household.id,
    },
  });

  const sharedSavings = await prisma.account.create({
    data: {
      name: "Family Savings",
      type: "SAVINGS",
      balance: new Prisma.Decimal("10000.00"),
      visibility: "HOUSEHOLD",
      householdId: household.id,
    },
  });

  const parentVisibleAccount = await prisma.account.create({
    data: {
      name: "Roman's Visible Savings",
      type: "SAVINGS",
      balance: new Prisma.Decimal("3000.00"),
      visibility: "BOTH",
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
      {
        name: "Family Grocery Run",
        amount: new Prisma.Decimal("-145.30"),
        type: "DEBIT",
        date: new Date("2026-05-06"),
        accountId: jointAccount.id,
      },
      {
        name: "Savings Contribution",
        amount: new Prisma.Decimal("300.00"),
        type: "CREDIT",
        date: new Date("2026-05-07"),
        accountId: sharedSavings.id,
      },
      {
        name: "Gift Fund Deposit",
        amount: new Prisma.Decimal("100.00"),
        type: "CREDIT",
        date: new Date("2026-05-08"),
        accountId: parentVisibleAccount.id,
      },
    ],
  });

  // sample transfer: two rows, same transferGroupId
  const transferGroupId = "seed_transfer_001";

  await prisma.transaction.createMany({
    data: [
      {
        name: "Transfer to Family Savings",
        amount: new Prisma.Decimal("-250.00"),
        type: "TRANSFER",
        date: new Date("2026-05-09"),
        accountId: jointAccount.id,
        transferGroupId,
      },
      {
        name: "Transfer from Joint Chequing",
        amount: new Prisma.Decimal("250.00"),
        type: "TRANSFER",
        date: new Date("2026-05-09"),
        accountId: sharedSavings.id,
        transferGroupId,
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

  // household bills
  const mortgageBill = await prisma.bill.create({
    data: {
      name: "Mortgage",
      amount: new Prisma.Decimal("1200.00"),
      dueDate: new Date("2026-05-28"),
      isPaid: false,
      accountId: jointAccount.id,
    },
  });

  const hydroBill = await prisma.bill.create({
    data: {
      name: "Hydro",
      amount: new Prisma.Decimal("95.75"),
      dueDate: new Date("2026-05-18"),
      isPaid: false,
      accountId: jointAccount.id,
    },
  });

  const paidHydroBill = await prisma.bill.create({
    data: {
      name: "Paid Internet",
      amount: new Prisma.Decimal("80.00"),
      dueDate: new Date("2026-05-05"),
      isPaid: true,
      accountId: jointAccount.id,
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
        accountId: jointAccount.id,
        billId: paidHydroBill.id,
      },
    ],
  });

  console.log("database seeded");

  console.log({
    users: {
      parent: parent.id,
      child: child.id,
    },
    household: household.id,
    accounts: {
      childAccount: childAccount.id,
      parentAccount: parentAccount.id,
      jointAccount: jointAccount.id,
      sharedSavings: sharedSavings.id,
      parentVisibleAccount: parentVisibleAccount.id,
    },
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