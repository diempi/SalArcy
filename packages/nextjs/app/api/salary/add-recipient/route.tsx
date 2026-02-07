import { NextResponse } from 'next/server';
import { circleClient } from '~~/lib/circle';
import { treasuryWallet } from '../create-treasury/route';

let recipients: any[] = []; // In-memory storage for local development

export async function POST(req: Request) {
  const { name, email } = await req.json(); // Optional, for UX

  if (!treasuryWallet) {
    return NextResponse.json({ error: "Create treasury first" }, { status: 400 });
  }

  try {
    // Create a new wallet for the recipient (in the same walletSet for simplicity)
    const walletResponse = await circleClient.createWallet({
      walletSetId: treasuryWallet.walletSetId,
      blockchains: ['arc-testnet'],
      accountType: 'EOA',
    });

    const newRecipient = {
      walletId: walletResponse.data.wallet.id,
      address: walletResponse.data.wallet.address,
      name: name || 'Unnamed',
      email: email || '',
    };

    recipients.push(newRecipient);

    console.log('Recipient added:', newRecipient); // Debug

    return NextResponse.json({ success: true, recipient: newRecipient });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export { recipients };