// Mock dashboard route for now
export async function GET() {
    return Response.json({
        balance: 2500,
        monthlySpending: 740,
        upcomingBills: 3,
    });
}