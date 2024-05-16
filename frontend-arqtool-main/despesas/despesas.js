// Cria um array para armazenar as despesas

var token = localStorage.getItem("token");
var urlLocal = 'https://localhost:7177/api/';
var urlHospedagem = 'https://caiobadev-api-arqtool.azurewebsites.net/api/';
var expenses = [];
handleDespesas()

async function handleDespesas() {
    var expenses = await fetchAndMapDespesas();
    mapearDespesasParaTabela(expenses);
}

async function fetchAndMapDespesas() {
    var rotaEndpoint = 'DespesasMensais/Usuario';
    try {
        const response = await axios.get(urlHospedagem + rotaEndpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token // Adicionando o token ao cabeçalho
            }
        });

        // Verifique se a resposta foi bem-sucedida
        if (response.status !== 200) {
            // Se não for bem-sucedida, lance um erro
            throw new Error(response.data.message || 'Erro na solicitação');
        }

        // Se a resposta for bem-sucedida, retorne os dados
        console.log(response.data.data);
        return response.data.data;
    } catch (error) {
        // Capture e exiba quaisquer erros
        console.error('Erros:', error);
        alert("Ocorreu um erro ao processar sua solicitação. Pressione F12 para mais informações.");
        throw error; // Você pode optar por relançar o erro ou retornar um valor padrão
    }
}

function checkExpenses(expenses) {
    // Seleciona os botões
    var btnNext = document.querySelector('.btn-next');
    var btnCalculate = document.querySelector('.btn-calcular');

    // Verifica se o array de despesas está vazio
    if (expenses.length === 0) {
        // Se estiver vazio, exibe o botão 'Próximo' e desabilita o botão 'Calcular'
        btnNext.style.display = 'block';
        btnCalculate.style.display = 'none';
    } else {
        // Se não estiver vazio, exibe o botão 'Calcular' e desabilita o botão 'Próximo'
        btnNext.style.display = 'none';
        btnCalculate.style.display = 'block';
    }
}


// Seleciona o botão de adicionar despesa
document.getElementById('add-expense-button').addEventListener('click', async function () {
    // Obtém os valores dos inputs
    var expenseName = document.getElementById('expense-name').value.trim(); // Remove espaços em branco
    var monthlyCost = document.getElementById('monthly-cost').value.trim(); // Remove espaços em branco

    // Verifica se os campos não estão vazios
    if (!expenseName || !monthlyCost) {
        alert('Por favor, preencha todos os campos!');
        return; // Aborta a função se os campos estiverem vazios
    }

    var userInfo = await getUserInfo();

    // Adiciona a nova despesa ao array
    expenses.push({ despesaId: 0, usuarioId: userInfo.id, nome: expenseName, gastoMensal: monthlyCost });

    // Cria uma nova linha na tabela
    var row = document.createElement('tr');
    row.innerHTML = `
        <td>${"-"}</td>
        <td>${expenseName}</td>
        <td>${monthlyCost}</td>
        <td>${"-"}</td>
        <td>${"-"}</td>
        <td>${"-"}</td>
        <td><button class="remove-button">Excluir</button></td>
    `;

    // Adiciona a nova linha à tabela
    document.querySelector('#expense-table tbody').appendChild(row);

    // Limpa os inputs
    document.getElementById('expense-name').value = '';
    document.getElementById('monthly-cost').value = '';

    // Adiciona o evento de clique ao botão remover
    row.querySelector('.remove-button').addEventListener('click', function () {
        // Remove a despesa do array
        var index = expenses.findIndex(function (expense) {
            return expense.nome === expenseName && expense.gastoMensal === monthlyCost;
        });
        if (index !== -1) {
            expenses.splice(index, 1);
        }

        // Remove a linha da tabela
        row.remove();
        checkExpenses(expenses);
    });

    checkExpenses(expenses);
    console.log(expenses);
});



function mapearDespesasParaTabela(despesas) {
    const tabelaBody = document.getElementById('expense-table').getElementsByTagName('tbody')[0];

    despesas.forEach(despesa => {
        const newRow = tabelaBody.insertRow();
        newRow.setAttribute('data-id', despesa.despesaId); // Adiciona o ID como um atributo de dados
        newRow.classList.add('row-table'); // Adiciona a classe 'row-table' à nova linha

        const idCell = newRow.insertCell(0); // Adiciona a primeira célula para o ID
        idCell.textContent = despesa.despesaId;

        const descricaoCell = newRow.insertCell(1);
        descricaoCell.textContent = despesa.nome;

        const mesCell = newRow.insertCell(2);
        mesCell.textContent = despesa.gastoMensal;

        const porcentagemCell = newRow.insertCell(3);
        porcentagemCell.textContent = despesa.porcentagemGastoTotal.toFixed(2);

        const anoCell = newRow.insertCell(4);
        anoCell.textContent = despesa.gastoAnual;

        const horaCell = newRow.insertCell(5);
        horaCell.textContent = despesa.hora ? despesa.hora : '-';

        const actionsCell = newRow.insertCell(6);
        // Adicione aqui os botões de ação, como editar ou excluir
        actionsCell.innerHTML = `<button class="btn-delete" data-id="${despesa.despesaId}">Excluir</button>`;
    });
}

// Adiciona um event listener para os botões de excluir
document.getElementById('expense-table').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-delete')) {
        const despesaId = event.target.getAttribute('data-id');
        removerDespesa(despesaId); // Chama a função para remover a despesa
    }
});

// Função para remover a despesa
async function removerDespesa(despesaId) {
    var urlRequisicao = urlHospedagem + "despesasMensais/" + despesaId;
    console.log(urlRequisicao);

    try {
        const response = await fetch(urlRequisicao, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + token // Adicionando o token ao cabeçalho
            },
        });

        if (!response.ok) {
            // Se a resposta não for bem-sucedida, lance um erro
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro na solicitação');
        }

        // Se a resposta for bem-sucedida, retorne os dados
        const data = await response.json();
        alert("Despesa Removida com Sucesso!");
        window.location.reload();
    } catch (error) {
        // Capture e exiba quaisquer erros
        console.error('Erros:', error);
        alert("Ocorreu um erro ao processar sua solicitação. Pressione F12 para mais informações.");
        throw error; // Você pode optar por relançar o erro ou retornar um valor padrão
    }
}

async function getUserInfo() {
    var rotaEndpoint = 'v1/Usuario/Info';
    // Verifica se o token está presente em localStorage
    try {
        const response = await fetch(urlHospedagem + rotaEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token // Adicionando o token ao cabeçalho
            },
        });

        if (!response.ok) {
            // Se a resposta não for bem-sucedida, lance um erro
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro na solicitação');
        }

        // Se a resposta for bem-sucedida, retorne os dados
        const data = await response.json();
        return data;
    } catch (error) {
        // Capture e exiba quaisquer erros
        console.error('Erros:', error);
        alert("Ocorreu um erro ao processar sua solicitação. Pressione F12 para mais informações.");
        throw error; // Você pode optar por relançar o erro ou retornar um valor padrão
    }
}

function toNextPage() {
    window.location.href= "../valor-hora/valor-hora.html";
}

async function postDespesas() {
    var rotaEndpoint = 'DespesasMensais';

    fetch(urlHospedagem + rotaEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token  // Adicionando o token ao cabeçalho
        },
        body: JSON.stringify(expenses)
    })
        .then(response => {
            if (!response.ok) {
                // Se a resposta não for bem-sucedida, lance um erro
                return response.json().then(err => { throw err; })
            }
            // Se a resposta for bem-sucedida, retorne os dados
            return response.json();
        })
        .then(data => {
            // Faça algo com os dados retornados, como redirecionar o usuário ou exibir uma mensagem
            console.log('Resposta:', data);
            alert('Cadastro de Despesas bem sucedida!');
            window.location.reload();
        })
        .catch(error => {
            // Capture e exiba quaisquer erros
            console.error('Erros:', error);
            alert("Ocorreu um erro ao processar sua solicitação. Pressione F12 para mais informações.");
        });
}


