const express = require('express');
const path = require('path');
const { calculateDCF } = require('../dcfCalculator');
const { loadExcelFile, loadCSVFile } = require('../dataLoader');

const router = express.Router();

router.get('/calculate', async (req, res) => {
    try {
        let { desiredROI, marginOfSafety } = req.query;

        desiredROI = parseFloat(desiredROI);
        marginOfSafety = parseFloat(marginOfSafety);

        if (isNaN(desiredROI) || isNaN(marginOfSafety)) {
            return res.status(400).json({ error: 'Invalid or missing query parameters: desiredROI and marginOfSafety must be numbers' });
        }

        const [cashFlowData, growthRateData, marketValueData] = await Promise.all([
            loadExcelFile(path.join(__dirname, '..', 'data', 'companies_full_list.xlsx')),
            loadExcelFile(path.join(__dirname, '..', 'data', 'perpetual_growth_rate.xlsx')),
            loadCSVFile(path.join(__dirname, '..', 'data', 'ftse250_companies.csv'))
        ]);

        const cashFlowMap = {};
        cashFlowData.forEach(company => {
            const companyName = company['Company'].trim().toLowerCase();
            cashFlowMap[companyName] = Object.keys(company)
                .filter(key => key.includes('FCF'))
                .map(key => parseFloat(company[key]));
        });

        const growthRateMap = {};
        growthRateData.forEach(row => {
            const companyName = row['Company'].trim().toLowerCase();
            growthRateMap[companyName] = parseFloat(row['Rate']);
        });

        const results = marketValueData.map(company => {
            const companyName = company.Company.trim().toLowerCase();
            const cashFlows = cashFlowMap[companyName];
            const growthRate = growthRateMap[companyName];
            const marketValue = parseFloat(company.MarketValue);

            if (!cashFlows || !growthRate || isNaN(marketValue)) {
                console.error(`Missing data for company: ${company.Company}`);
                return null;
            }

            const result = calculateDCF(cashFlows, growthRate, desiredROI, marketValue, marginOfSafety);
            return { company: company.Company, intrinsicValue: result.intrinsicValue, marketValue: marketValue, isUndervalued: result.isUndervalued };
        }).filter(result => result !== null);  // Filter out any null results

        res.json(results);
    } catch (error) {
        console.error('Error occurred during DCF calculation:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

module.exports = router;
