class AccountingTable {
    constructor() {
        this.entries = [];
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.tableBody = document.getElementById('tableBody');
        this.totalDebit = document.getElementById('totalDebit');
        this.totalCredit = document.getElementById('totalCredit');
        this.newDate = document.getElementById('newDate');
        this.newDescription = document.getElementById('newDescription');
        this.newDebit = document.getElementById('newDebit');
        this.newCredit = document.getElementById('newCredit');
        this.addButton = document.getElementById('addButton');
    }

    setupEventListeners() {
        this.addButton.addEventListener('click', () => this.addEntry());
        this.newDebit.addEventListener('input', () => this.newCredit.value = '');
        this.newCredit.addEventListener('input', () => this.newDebit.value = '');
    }

    addEntry() {
        if (!this.validateForm()) return;

        const entry = {
            id: Date.now(),
            date: this.newDate.value,
            description: this.newDescription.value,
            debit: parseFloat(this.newDebit.value) || 0,
            credit: parseFloat(this.newCredit.value) || 0
        };

        this.entries.push(entry);
        this.renderEntries();
        this.clearForm();
    }

    validateForm() {
        if (!this.newDate.value || !this.newDescription.value) {
            alert('Por favor complete la fecha y descripción');
            return false;
        }
        if (!this.newDebit.value && !this.newCredit.value) {
            alert('Por favor ingrese un valor en Debe o Haber');
            return false;
        }
        return true;
    }

    removeEntry(id) {
        this.entries = this.entries.filter(entry => entry.id !== id);
        this.renderEntries();
    }

    renderEntries() {
        this.tableBody.innerHTML = '';
        this.entries.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.description}</td>
                <td>${entry.debit.toFixed(2)}</td>
                <td>${entry.credit.toFixed(2)}</td>
                <td>
                    <button class="delete-btn" onclick="accountingTable.removeEntry(${entry.id})">×</button>
                </td>
            `;
            this.tableBody.appendChild(row);
        });
        this.updateTotals();
    }

    updateTotals() {
        const totals = this.entries.reduce((acc, curr) => ({
            totalDebit: acc.totalDebit + curr.debit,
            totalCredit: acc.totalCredit + curr.credit
        }), { totalDebit: 0, totalCredit: 0 });

        this.totalDebit.textContent = totals.totalDebit.toFixed(2);
        this.totalCredit.textContent = totals.totalCredit.toFixed(2);
    }

    clearForm() {
        this.newDate.value = '';
        this.newDescription.value = '';
        this.newDebit.value = '';
        this.newCredit.value = '';
    }
}

window.accountingTable = new AccountingTable();