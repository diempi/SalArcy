import { NextResponse } from 'next/server';
import { circleClient } from '~~/lib/circle';

let treasuryWallet: any = null;

export async function POST() {
  try {
    const response = await circleClient.createWalletSet();
    const walletSetId = response.data.walletSet.id;

    const walletResponse = await circleClient.createWallet({
      walletSetId,
      blockchains: ['arc-testnet'],
      accountType: 'EOA',
    });

    treasuryWallet = {
      walletId: walletResponse.data.wallet.id,
      address: walletResponse.data.wallet.address,
      walletSetId,
    };

    return NextResponse.json({ success: true, treasury: treasuryWallet });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export { treasuryWallet };