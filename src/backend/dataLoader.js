const xlsx = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');

function loadExcelFile(filePath) {
    return new Promise((resolve, reject) => {
        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}

function loadCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

module.exports = { loadExcelFile, loadCSVFile };
