document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const calcBtn = document.getElementById('calcBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const fileInput = document.getElementById('fileInput');
    const printBtn = document.getElementById('printBtn');

    // Event Listeners
    calcBtn.addEventListener('click', calculateTax);
    printBtn.addEventListener('click', () => window.print());

    // Export Data to JSON File
    exportBtn.addEventListener('click', () => {
        const userData = {
            income: document.getElementById('income').value,
            status: document.getElementById('status').value,
            withheld: document.getElementById('withheld').value,
            children: document.getElementById('children').value
        };
        const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Tax_Data_2026.json`;
        link.click();
        URL.revokeObjectURL(url);
    });

    // Import Data from JSON File
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                document.getElementById('income').value = data.income || "";
                document.getElementById('status').value = data.status || "single";
                document.getElementById('withheld').value = data.withheld || "";
                document.getElementById('children').value = data.children || "0";
                calculateTax();
            } catch (err) { alert("Invalid JSON file."); }
        };
        reader.readAsText(file);
    });

    function calculateTax() {
        const income = parseFloat(document.getElementById('income').value) || 0;
        const status = document.getElementById('status').value;
        const withheld = parseFloat(document.getElementById('withheld').value) || 0;
        const numChildren = parseInt(document.getElementById('children').value) || 0;

        // 2026 Standards
        const deduction = status === 'married' ? 32200 : 16100;
        let taxableIncome = Math.max(0, income - deduction);

        const brackets = [
            { limit: 12400, rate: 0.10 },
            { limit: 50400, rate: 0.12 },
            { limit: 105700, rate: 0.22 },
            { limit: 201775, rate: 0.24 },
            { limit: 256225, rate: 0.32 },
            { limit: 640600, rate: 0.35 },
            { limit: Infinity, rate: 0.37 }
        ];

        let taxLiability = 0;
        let prevLimit = 0;
        for (const b of brackets) {
            if (taxableIncome > prevLimit) {
                let chunk = Math.min(taxableIncome, b.limit) - prevLimit;
                taxLiability += chunk * b.rate;
                prevLimit = b.limit;
            }
        }

        // Child Tax Credit logic ($2,200 total, $1,700 refundable cap)
        const potentialCredit = numChildren * 2200;
        const refundableCap = numChildren * 1700;
        let nonRefundableUsed = Math.min(taxLiability, potentialCredit);
        let remainingCredit = potentialCredit - nonRefundableUsed;
        let refundableUsed = Math.min(remainingCredit, refundableCap);

        let finalLiability = taxLiability - nonRefundableUsed;
        let result = (withheld + refundableUsed) - finalLiability;

        // UI Updates
        document.getElementById('results').classList.remove('hidden');
        document.getElementById('res-gross').innerText = `$${income.toLocaleString()}`;
        document.getElementById('res-deduction').innerText = `-$${deduction.toLocaleString()}`;
        document.getElementById('taxableIncome').innerText = `$${taxableIncome.toLocaleString()}`;
        document.getElementById('res-liability').innerText = `$${taxLiability.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        document.getElementById('res-credits').innerText = `-$${(nonRefundableUsed + refundableUsed).toLocaleString()}`;
        document.getElementById('res-payments').innerText = `$${withheld.toLocaleString()}`;

        const totalTaxEl = document.getElementById('totalTax');
        document.getElementById('res-final-label').innerText = result >= 0 ? "Estimated Refund" : "Tax Owed";
        totalTaxEl.innerText = `$${Math.abs(result).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        totalTaxEl.style.color = result >= 0 ? "var(--green)" : "var(--red)";
        
        const effective = income > 0 ? ((finalLiability / income) * 100).toFixed(1) : 0;
        document.getElementById('effectiveRate').innerText = `Effective Tax Rate: ${effective}%`;
    }
});