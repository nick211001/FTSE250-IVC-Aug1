document.getElementById('calculate-btn').addEventListener('click', async () => {
    const roi = parseFloat(document.getElementById('roi').value);
    const margin = parseFloat(document.getElementById('margin').value);

    if (isNaN(roi) || isNaN(margin)) {
        alert('Please enter valid numbers for ROI and Margin of Safety.');
        return;
    }

    try {
        const response = await fetch(`/api/calculate?desiredROI=${roi}&marginOfSafety=${margin}`);
        const results = await response.json();

        console.log(`Received ${results.length} companies for processing.`);  // Log the number of companies received

        const resultsTable = document.getElementById('results').getElementsByTagName('tbody')[0];
        resultsTable.innerHTML = '';  // Clear any existing rows

        // Remove duplicates and sort results
        const uniqueResults = results.filter((company, index, self) =>
            index === self.findIndex((c) => c.company === company.company)
        ).sort((a, b) => (b.intrinsicValue - b.marketValue) - (a.intrinsicValue - a.marketValue));

        console.log(`Displaying ${uniqueResults.length} unique companies.`);  // Log the number of unique companies

        // Display each company's details
        uniqueResults.forEach(company => {
            const row = resultsTable.insertRow();
            row.insertCell(0).textContent = company.company;
            row.insertCell(1).textContent = company.intrinsicValue.toFixed(2);
            row.insertCell(2).textContent = company.marketValue.toFixed(2);
            row.insertCell(3).textContent = company.isUndervalued ? 'Undervalued' : 'Overvalued';
        });

    } catch (error) {
        console.error('Error fetching or processing data:', error);
        alert('There was an error processing the data. Please try again.');
    }
});
