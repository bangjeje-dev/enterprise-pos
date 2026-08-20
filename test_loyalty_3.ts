import { mockErpApi } from './src/services/mockErpApi.js';

// Mock localStorage
const storage = {};
global.window = {
  localStorage: {
    setItem(key, value) {
      storage[key] = value;
    },
    getItem(key) {
      return storage[key] || null;
    }
  }
};

async function test() {
  try {
    const p = await mockErpApi.createLoyaltyProgram({
      name: 'Test',
      description: 'Test',
      status: 'Active',
      earnRateAmount: 100,
      earnRatePoints: 1,
      redeemRateAmount: 100,
      redeemRatePoints: 1
    });
    const db = JSON.parse(storage['enterprise_pos_db'] || '{}');
    console.log("Loyalty Programs in DB:", db.loyaltyPrograms);
    
  } catch(e) {
    console.error("ERROR OCCURRED:", e);
  }
}

test();
