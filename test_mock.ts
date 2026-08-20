import { mockErpApi } from './src/services/mockErpApi.ts';

(global as any).window = {
  localStorage: {
    getItem: () => null,
    setItem: (k: string, v: string) => console.log('Saved to localStorage:', k, v.substring(0, 50) + '...'),
  }
};

async function test() {
  try {
    console.log("Creating loyalty program...");
    const res = await mockErpApi.createLoyaltyProgram({
      name: 'Test',
      description: '',
      status: 'Active',
      earnRateAmount: 10000,
      earnRatePoints: 1,
      redeemRatePoints: 100,
      redeemRateAmount: 10000
    });
    console.log("Success!", res);
  } catch (e) {
    console.error("Error!", e);
  }
}

test();
