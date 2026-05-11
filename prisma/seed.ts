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
    // Clear existing data in dependency order
    await prisma.bill.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.householdMember.deleteMany();
    await prisma.household.deleteMany();
    await prisma.user.deleteMany();

    // Create users
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

    // Create household
    const household = await prisma.household.create({
        data: {
            name: "Family Household",
        },
    });

    // Household memberships
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

    // Account for child
    const childAccount = await prisma.account.create({
        data: {
            name: "Child's Account",
            type: "CHEQUING",
            balance: new Prisma.Decimal("1250.75"),
            ownerId: child.id,
            householdId: household.id,
        },
    });

    // Optional parent account for later permission/visibility testing
    const parentAccount = await prisma.account.create({
        data: {
            name: "Roman's Account",
            type: "CHEQUING",
            balance: new Prisma.Decimal("2500.00"),
            ownerId: parent.id,
            householdId: household.id,
        },
    });

    // Transactions for child account
    await prisma.transaction.createMany({
        data: [
            {
                name: "Paycheque",
                amount: new Prisma.Decimal("500.00"),
                type: "CREDIT",
                date: new Date(2026, 4, 1),
                accountId: childAccount.id,
            },
            {
                name: "Spotify",
                amount: new Prisma.Decimal("-18.99"),
                type: "DEBIT",
                date: new Date(2026, 4, 2),
                accountId: childAccount.id,
            },
            {
                name: "Takeout",
                amount: new Prisma.Decimal("-25.50"),
                type: "DEBIT",
                date: new Date(2026, 4, 3),
                accountId: childAccount.id,
            },
            {
                name: "Old Grocery Run",
                amount: new Prisma.Decimal("-40.00"),
                type: "DEBIT",
                date: new Date(2026, 3, 20),
                accountId: childAccount.id,
            },
        ],
    });

    // Transactions for parent account
    await prisma.transaction.createMany({
        data: [
            {
                name: "Salary",
                amount: new Prisma.Decimal("2200.00"),
                type: "CREDIT",
                date: new Date(2026, 4, 1),
                accountId: parentAccount.id,
            },
            {
                name: "Groceries",
                amount: new Prisma.Decimal("-85.25"),
                type: "DEBIT",
                date: new Date(2026, 4, 4),
                accountId: parentAccount.id,
            },
        ],
    });

    // Bills for child account
    await prisma.bill.createMany({
        data: [
            {
                name: "Phone Bill",
                amount: new Prisma.Decimal("45.00"),
                dueDate: new Date(2026, 4, 15),
                isPaid: false,
                accountId: childAccount.id,
            },
            {
                name: "Spotify",
                amount: new Prisma.Decimal("18.99"),
                dueDate: new Date(2026, 4, 20),
                isPaid: false,
                accountId: childAccount.id,
            },
            {
                name: "Old Paid Bill",
                amount: new Prisma.Decimal("30.00"),
                dueDate: new Date(2026, 4, 1),
                isPaid: true,
                accountId: childAccount.id,
            },
        ],
    });

    // Bills for parent account
    await prisma.bill.createMany({
        data: [
            {
                name: "Mortgage",
                amount: new Prisma.Decimal("1200.00"),
                dueDate: new Date(2026, 4, 28),
                isPaid: false,
                accountId: parentAccount.id,
            },
            {
                name: "Hydro",
                amount: new Prisma.Decimal("95.75"),
                dueDate: new Date(2026, 4, 18),
                isPaid: false,
                accountId: parentAccount.id,
            },
        ],
    });

    console.log("Database seeded");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });