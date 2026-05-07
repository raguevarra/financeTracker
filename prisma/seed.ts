import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.user.create({
        data: {
            email: "roman@test.com",

            accounts: {
                create: {
                    name: "chequing",

                    transactions: {
                        create: [
                            {
                                name: "Salary",
                                amount: 2500,
                                date: new Date(),
                            },
                            {
                                name: "Groceries",
                                amount: -80,
                                date: new Date(),
                            },
                            {
                                name: "Coffee",
                                amount: -6,
                                date: new Date(),
                            },
                        ],
                    },
                },
            },
        },
    });

    console.log("Seeded Database");

}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });