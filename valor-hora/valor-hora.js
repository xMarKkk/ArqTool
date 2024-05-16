var token = localStorage.getItem("token");
var urlLocal = 'https://localhost:7177/api/';
var urlHospedagem = 'https://caiobadev-api-arqtool.azurewebsites.net/api/';
fetchAndMapFields();
definirNomeBotao();

function returnToDespesas() {
    window.location.href = "../despesas/despesas.html";
}

async function definirNomeBotao() {
    var userInfo = await getUserInfo();
    var userHoraIdeal = await getValorIdealHora();

    var salario = document.getElementById('salario').value.trim();
    var reserva = document.getElementById('reserva').value.trim();
    var horas = document.getElementById('horas').value.trim();
    var dias = document.getElementById('dias').value.trim();
    var ferias = document.getElementById('ferias').value.trim();

    data = {
        id: 0,
        usuarioId: userInfo.id,
        horasTrabalhadasPorDia: horas,
        diasTrabalhadosPorSemana: dias,
        diasFeriasPorAno: ferias,
        faturamentoMensalDesejado: salario,
        reservaFinanceira: reserva
    }

    if (compareObjects(data, userHoraIdeal)) {
        var btn = document.getElementById("cadastrar");
        btn.innerText = "Próximo";
    } else { 
        var btn = document.getElementById("cadastrar");
        btn.innerText = "Cadastrar";
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

async function getValorIdealHora() {
    var rotaEndpoint = 'ValorIdealHoraTrabalho';
    try {
        const response = await axios.get(urlHospedagem + rotaEndpoint, {
            headers: {
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
        return null;
    }
}

async function fetchAndMapFields() {

    var salario = document.getElementById('salario');
    var reserva = document.getElementById('reserva');
    var horas = document.getElementById('horas');
    var dias = document.getElementById('dias');
    var ferias = document.getElementById('ferias');

    var userHoraIdeal = await getValorIdealHora();

    if (userHoraIdeal) {
        salario.value = userHoraIdeal.faturamentoMensalDesejado;
        reserva.value = userHoraIdeal.reservaFinanceira;
        horas.value = userHoraIdeal.horasTrabalhadasPorDia;
        dias.value = userHoraIdeal.diasTrabalhadosPorSemana;
        ferias.value = userHoraIdeal.diasFeriasPorAno;
    }

}

async function handleRequest() {

    var userInfo = await getUserInfo();
    var userHoraIdeal = await getValorIdealHora();

    // Obtendo os valores de cada campo de entrada
    var salario = document.getElementById('salario').value.trim();
    var reserva = document.getElementById('reserva').value.trim();
    var horas = document.getElementById('horas').value.trim();
    var dias = document.getElementById('dias').value.trim();
    var ferias = document.getElementById('ferias').value.trim();

    data = {
        id: 0,
        usuarioId: userInfo.id,
        horasTrabalhadasPorDia: horas,
        diasTrabalhadosPorSemana: dias,
        diasFeriasPorAno: ferias,
        faturamentoMensalDesejado: salario,
        reservaFinanceira: reserva
    }
    console.log(data);

    if (userHoraIdeal == null) {
        console.log(data);
        postDespesas(data);
    } else if (userHoraIdeal) {
        if (compareObjects(data, userHoraIdeal)) {
            window.location.href = "./hora-tecnica.html"
        } else {
            dataUpdate = {
                id: userHoraIdeal.id,
                usuarioId: userInfo.id,
                horasTrabalhadasPorDia: horas,
                diasTrabalhadosPorSemana: dias,
                diasFeriasPorAno: ferias,
                faturamentoMensalDesejado: salario,
                reservaFinanceira: reserva
            }
            updateDespesas(dataUpdate);
        }
    }

}

function changeButtonToProximo() {
    var btn = document.getElementById("cadastrar");
    btn.innerText = "Próximo";
}


function compareObjects(obj1, obj2) {
    let data1 = {
        horasTrabalhadasPorDia: obj1.horasTrabalhadasPorDia,
        diasTrabalhadosPorSemana: obj1.diasTrabalhadosPorSemana,
        diasFeriasPorAno: obj1.diasFeriasPorAno,
        faturamentoMensalDesejado: obj1.faturamentoMensalDesejado,
        reservaFinanceira: obj1.reservaFinanceira
    }

    let data2 = {
        horasTrabalhadasPorDia: String(obj2.horasTrabalhadasPorDia),
        diasTrabalhadosPorSemana: String(obj2.diasTrabalhadosPorSemana),
        diasFeriasPorAno: String(obj2.diasFeriasPorAno),
        faturamentoMensalDesejado: String(obj2.faturamentoMensalDesejado),
        reservaFinanceira: String(obj2.reservaFinanceira)
    }

    console.log(data1, data2);

    for (let key in data1) {
        if (data1[key] !== data2[key]) {
            return false;
        }
    }
    return true;
}


async function updateDespesas(data) {
    var rotaEndpoint = 'ValorIdealHoraTrabalho';

    fetch(urlHospedagem + rotaEndpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token  // Adicionando o token ao cabeçalho
        },
        body: JSON.stringify(data)
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
            alert('Atualização de pretensões bem sucedido!');
            window.location.reload();
        })
        .catch(error => {
            // Capture e exiba quaisquer erros
            console.error('Erros:', error);
            alert("Ocorreu um erro ao processar sua solicitação. Pressione F12 para mais informações.");
        });
}

async function postDespesas(data) {
    var rotaEndpoint = 'ValorIdealHoraTrabalho';

    fetch(urlHospedagem + rotaEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token  // Adicionando o token ao cabeçalho
        },
        body: JSON.stringify(data)
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
            alert('Cadastro de pretensões bem sucedido!');
            window.location.reload();
        })
        .catch(error => {
            // Capture e exiba quaisquer erros
            console.error('Erros:', error);
            alert("Ocorreu um erro ao processar sua solicitação. Pressione F12 para mais informações.");
        });
}