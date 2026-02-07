import { NextResponse } from 'next/server';
import { circleClient } from '~~/lib/circle';
import { treasuryWallet } from '../create-treasury/route';

let recipients: any[] = []; // In-memory storage for local development

export async function POST(req: Request) {
  const { address } = await req.json(); // Accept wallet address

  if (!treasuryWallet) {
    return NextResponse.json({ error: "Create treasury first" }, { status: 400 });
  }

  if (!address || typeof address !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  const newRecipient = {
    address,
    name: 'Unnamed', // Optional, can remove if not needed
  };

  recipients.push(newRecipient);

  console.log('Recipient added:', newRecipient); // Debug

  return NextResponse.json({ success: true, recipient: newRecipient });
}

export { recipients };