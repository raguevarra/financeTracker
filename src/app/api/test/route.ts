/*
GET route to return a basic test response
*/
export async function GET() {
    // Return a simple JSON response for testing the API
    return Response.json({ message: "Hello, World!" });
}
