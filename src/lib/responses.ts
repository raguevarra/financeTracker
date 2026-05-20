import { NextResponse } from "next/server";

export function badRequest(message = "Missing required fields.") {
    return NextResponse.json({ error: message}, { status: 400 });
}

export function notFound(message = "Resource not found or access denied.") {
    return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "Something went wrong.") {
    return NextResponse.json({ error: message}, { status: 500 });
}