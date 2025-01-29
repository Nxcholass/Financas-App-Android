// Seleção de elementos
const expenseForm = document.getElementById('expense-form');
const expenseTable = document.getElementById('expense-table').querySelector('tbody');
const totalAmountSpan = document.getElementById('total-amount');
const categorySummary = document.getElementById('category-summary');
const highestExpenseDate = document.getElementById('highest-expense-date');
const highestCategory = document.getElementById('highest-category');

// Dados globais
let expenses = [];

// Função para formatar valores em R$
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para atualizar a tabela de despesas
function updateTable() {
    expenseTable.innerHTML = '';
    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${expense.name}</td>
            <td>${formatCurrency(expense.amount)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td><button class="delete-btn" data-index="${index}">Excluir</button></td>
        `;

        expenseTable.appendChild(row);
    });
}

// Função para atualizar o resumo
function updateSummary() {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmountSpan.textContent = formatCurrency(totalAmount);

    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    categorySummary.innerHTML = '';
    for (const category in categoryTotals) {
        const listItem = document.createElement('li');
        listItem.textContent = `${category}: ${formatCurrency(categoryTotals[category])}`;
        categorySummary.appendChild(listItem);
    }

    if (expenses.length > 0) {
        const highestExpense = expenses.reduce((max, expense) => expense.amount > max.amount ? expense : max);
        highestExpenseDate.textContent = highestExpense.date;

        const highestCategoryName = Object.keys(categoryTotals).reduce((max, category) =>
            categoryTotals[category] > categoryTotals[max] ? category : max
        );
        highestCategory.textContent = highestCategoryName;
    } else {
        highestExpenseDate.textContent = '-';
        highestCategory.textContent = '-';
    }
}

// Função para adicionar uma nova despesa
function addExpense(event) {
    event.preventDefault();

    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;

    if (!name || isNaN(amount) || !category || !date) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    expenses.push({ name, amount, category, date });

    expenseForm.reset();
    updateTable();
    updateSummary();
}

// Função para excluir uma despesa
function deleteExpense(index) {
    expenses.splice(index, 1);
    updateTable();
    updateSummary();
}

// Event listener para o formulário
expenseForm.addEventListener('submit', addExpense);

// Event listener para exclusão de despesas
expenseTable.addEventListener('click', event => {
    if (event.target.classList.contains('delete-btn')) {
        const index = parseInt(event.target.dataset.index, 10);
        deleteExpense(index);
    }
});

// Função para abrir/fechar o sidebar
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}