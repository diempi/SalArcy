// TODO: Configure Circle API client (see https://developers.circle.com)
export const circleClient = {
  createWalletSet: async () => ({ data: { walletSet: { id: '' } } }),
  createWallet: async (_opts: { walletSetId: string; blockchains: string[]; accountType: string }) =>
    ({ data: { wallet: { id: '', address: '' } } }),
};

