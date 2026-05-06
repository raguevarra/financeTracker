// Mock trasactions GET
export async function GET() {
    return Response.json([
        {
            id: 1,
            name: "Groceries",
            amount: -150,
            date: "2024-06-01",
        },
        {
            id: 2,
            name: "Salary",
            amount: 3000,
            date: "2024-06-02",
        }
    ]);
}

// Mock transactions POST
export async function POST(request: Request) {
    const body = await request.json();
    
    return Response.json({
        message: "Transaction created",
        transaction: body,
    })
}