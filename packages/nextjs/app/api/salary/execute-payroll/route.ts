import { NextResponse } from 'next/server';
import { circleClient } from '~~/lib/circle';
import { treasuryWallet } from '../create-treasury/route';
import { recipients } from '../add-recipient/route';

export async function POST(req: Request) {
  const { amountPerRecipient } = await req.json(); // e.g., "0.1" (string for Circle SDK)

  if (!treasuryWallet || recipients.length === 0) {
    return NextResponse.json({ error: "Treasury or recipients missing" }, { status: 400 });
  }

  const results = [];

  try {
    // Fetch tokens in treasury to get USDC tokenId (adjust address if needed)
    const tokensResponse = await (circleClient as any).getTokens({ walletId: treasuryWallet.walletId });
    const usdcToken = tokensResponse.data.tokens.find((t: any) => t.token.address.toLowerCase() === "0x3600000000000000000000000000000000000000".toLowerCase());

    if (!usdcToken) {
      return NextResponse.json({ error: "USDC not found in treasury" }, { status: 400 });
    }

    const tokenId = usdcToken.token.id;

    for (const recipient of recipients) {
      try {
        // Transfer USDC from treasury to recipient
        const txResponse = await (circleClient as any).createTransaction({
          walletId: treasuryWallet.walletId,
          tokenId,
          destinationAddress: recipient.address,
          amounts: [amountPerRecipient],
          fee: { type: "level", config: { feeLevel: "HIGH" } },
          blockchain: 'ARC-TESTNET',
        });

        results.push({
          recipient: recipient.address,
          success: true,
          tx: txResponse.data,
        });
      } catch (err: any) {
        results.push({
          recipient: recipient.address,
          success: false,
          error: err.message,
        });
      }
    }

    console.log('Payroll results:', results); // Debug

    return NextResponse.json({ success: true, payouts: results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}