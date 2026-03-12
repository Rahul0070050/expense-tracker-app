import { NextResponse } from "next/server";

const API_URL = process.env.SHEETDB_API_URL;

// GET /api/transactions
export async function GET(request: Request) {
  try {
    if (!API_URL) throw new Error("Missing SHEETDB_API_URL in .env.local");

    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch from SheetDB");

    const data = await res.json();

    // Filter by user email if provided
    const transactions = data
      .filter((row: any) => row.userEmail === userEmail)
      .map((row: any) => ({
        id: row.id,
        type: row.type,
        amount: parseFloat(row.amount),
        category: row.category,
        description: row.description,
        date: row.date,
      }));

    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/transactions
export async function POST(request: Request) {
  try {
    if (!API_URL) throw new Error("Missing SHEETDB_API_URL in .env.local");

    const body = await request.json();
    const { type, amount, category, description, date, userEmail } = body;

    const newTransaction = {
      id: crypto.randomUUID(),
      userEmail: userEmail || "",
      type,
      amount: amount.toString(),
      category,
      description,
      date,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [newTransaction] }),
    });

    if (!res.ok) throw new Error("Failed to save to SheetDB");

    return NextResponse.json(newTransaction);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/transactions?id=xxx
export async function DELETE(request: Request) {
  try {
    if (!API_URL) throw new Error("Missing SHEETDB_API_URL in .env.local");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // SheetDB DELETE syntax: [API_URL]/id/[ID_VALUE]
    const deleteUrl = `${API_URL}/id/${id}`;
    const res = await fetch(deleteUrl, { method: "DELETE" });

    if (!res.ok) throw new Error("Failed to delete from SheetDB");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
