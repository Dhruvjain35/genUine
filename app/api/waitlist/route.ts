import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

function getSheets() {
 const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
 const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
 if (!email || !key) return null;

 const auth = new google.auth.GoogleAuth({
 credentials: { client_email: email, private_key: key },
 scopes: ['https://www.googleapis.com/auth/spreadsheets'],
 });
 return google.sheets({ version: 'v4', auth });
}

export async function GET() {
 try {
 const sheets = getSheets();
 const sheetId = process.env.GOOGLE_SHEET_ID;

 if (!sheets || !sheetId) {
 return NextResponse.json({ count: 0 });
 }

 const res = await sheets.spreadsheets.values.get({
 spreadsheetId: sheetId,
 range: 'Sheet1!B:B',
 });

 const rows = res.data.values || [];
 const count = Math.max(0, rows.length - 1); // minus header row
 return NextResponse.json({ count });
 } catch {
 return NextResponse.json({ count: 0 });
 }
}

export async function POST(req: NextRequest) {
 try {
 const body = await req.json();
 const { name, email, linkedinUrl, userType, messagingStruggle, source } = body;

 if (!name?.trim() || !email?.trim() || !userType?.trim()) {
 return NextResponse.json({ error: 'Name, email, and user type are required.' }, { status: 400 });
 }

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!emailRegex.test(email)) {
 return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
 }

 const sheets = getSheets();
 const sheetId = process.env.GOOGLE_SHEET_ID;

 if (sheets && sheetId) {
 // Check for duplicate email
 const existing = await sheets.spreadsheets.values.get({
 spreadsheetId: sheetId,
 range: 'Sheet1!B:B',
 });
 const emails = (existing.data.values || []).flat().map((e: string) => e?.toLowerCase().trim());
 if (emails.includes(email.toLowerCase().trim())) {
 return NextResponse.json({ error: "you're already on the list! we'll be in touch soon." }, { status: 409 });
 }

 // Append the new row
 const dateJoined = new Date().toISOString().split('T')[0];
 await sheets.spreadsheets.values.append({
 spreadsheetId: sheetId,
 range: 'Sheet1!A:H',
 valueInputOption: 'USER_ENTERED',
 requestBody: {
 values: [[
 name.trim(),
 email.trim().toLowerCase(),
 linkedinUrl?.trim() || '',
 userType.trim(),
 messagingStruggle?.trim() || '',
 source?.trim() || '',
 dateJoined,
 'waiting',
 ]],
 },
 });
 }

 return NextResponse.json({ success: true });
 } catch (err) {
 console.error('Waitlist POST error:', err);
 return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
 }
}
