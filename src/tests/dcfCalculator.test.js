const { calculateDCF } = require('./dcfCalculator');

describe('calculateDCF', () => {
    it('should correctly calculate the intrinsic value and undervalued status', () => {
        const cashFlows = [100, 110, 121, 133.1, 146.41];
        const growthRate = 0.03;
        const discountRate = 0.1;
        const marketValue = 800;
        const marginOfSafety = 0.2;

        const result = calculateDCF(cashFlows, growthRate, discountRate, marketValue, marginOfSafety);
        expect(result.intrinsicValue).toBeGreaterThan(0);
        expect(result.isUndervalued).toBe(true);
    });
});
