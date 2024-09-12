function calculateDCF(cashFlows, growthRate, discountRate, marketValue, marginOfSafety) {
    console.log('Calculating DCF for:', { cashFlows, growthRate, discountRate, marketValue, marginOfSafety });
    
    // Convert whole numbers to percentages
    const discountRateAsPercentage = discountRate / 100;  // e.g., 25 becomes 0.25
    const marginOfSafetyAsPercentage = marginOfSafety / 100;  // e.g., 20 becomes 0.20

    let totalDCF = 0;

    // Calculate the present value of each year's cash flow
    const discountedCashFlows = cashFlows.map((cashFlow, index) => {
        const discountedValue = cashFlow / Math.pow(1 + discountRateAsPercentage, index + 1);
        totalDCF += discountedValue;
        return discountedValue;
    });

    console.log('Discounted Cash Flows:', discountedCashFlows, 'Total DCF:', totalDCF);

    // Calculate the terminal value
    const lastYearCashFlow = cashFlows[cashFlows.length - 1];
    const terminalValue = lastYearCashFlow * (1 + growthRate) / (discountRateAsPercentage - growthRate);
    const discountedTerminalValue = terminalValue / Math.pow(1 + discountRateAsPercentage, cashFlows.length);

    console.log('Terminal Value:', terminalValue, 'Discounted Terminal Value:', discountedTerminalValue);

    totalDCF += discountedTerminalValue;

    // Apply the margin of safety
    const intrinsicValue = totalDCF * (1 - marginOfSafetyAsPercentage);

    console.log('Intrinsic Value:', intrinsicValue, 'Market Value:', marketValue);

    // Determine if the company is undervalued
    const isUndervalued = intrinsicValue > marketValue;

    console.log('Is Undervalued:', isUndervalued);

    return {
        intrinsicValue,
        isUndervalued,
    };
}


module.exports = { calculateDCF };
