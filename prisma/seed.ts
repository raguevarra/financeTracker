import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg} from "@prisma/adapter-pg";

const adapter = new PrismaPg({
connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    // Clear existing data in dependency order
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
        }
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
            }
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

    // Transactions for account
    await prisma.transaction.createMany({
        data: [
            {
                name: "Paychequqe",
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
        ],
    });

    console.log("Database seeded");
}

main().catch((error) => {
    console.error(error);
}).finally(async () => {
    await prisma.$disconnect();
});