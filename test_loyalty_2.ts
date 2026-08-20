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
    console.log("Creating loyalty program...");
    const p = await mockErpApi.createLoyaltyProgram({
      name: 'Test',
      description: 'Test',
      status: 'Active',
      earnRateAmount: 100,
      earnRatePoints: 1,
      redeemRateAmount: 100,
      redeemRatePoints: 1
    });
    console.log("Program created successfully:", p);
    
    // Now simulate what Pinia does
    const programs = [];
    programs.unshift(p);
    console.log("Pinia state updated:", programs);
    
    // Now verify localStorage
    console.log("Storage keys:", Object.keys(storage));
    const db = JSON.parse(storage['enterprise-pos-db'] || '{}');
    console.log("Loyalty Programs in DB:", db.loyaltyPrograms);
    
  } catch(e) {
    console.error("ERROR OCCURRED:", e);
  }
}

test();
