import { mockErpApi } from './src/services/mockErpApi.ts'

// Fully mock window and localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString() },
    clear: () => { store = {} }
  }
})();

global.window = {
  localStorage: localStorageMock
} as any;

async function test() {
  try {
    const p = await mockErpApi.createLoyaltyProgram({
      name: 'Test',
      description: 'Test',
      status: 'Active',
      earnRateAmount: 1000,
      earnRatePoints: 1,
      redeemRatePoints: 100,
      redeemRateAmount: 1000
    })
    console.log("Success:", p)
  } catch (e) {
    console.error("Error thrown from mockErpApi:", e)
  }
}

test()
