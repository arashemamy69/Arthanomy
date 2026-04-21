const yahooFinance = require('yahoo-finance2').default;
async function test() {
  try {
    const data = await yahooFinance.historical('SPY', { period1: '2020-01-01', interval: '1mo' });
    console.log("SPY data length:", data.length);
    if (data.length > 0) console.log("Sample SPY:", data[0].date, data[0].adjClose);
    
    const data2 = await yahooFinance.historical('XIC.TO', { period1: '2020-01-01', interval: '1mo' });
    console.log("XIC.TO data length:", data2.length);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
