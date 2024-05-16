var token = localStorage.getItem("token");
var urlLocal = 'https://localhost:7177/api/';
var urlHospedagem = 'https://caiobadev-api-arqtool.azurewebsites.net/api/';

function returnToPretensoes() {
    window.location.href = "./valor-hora.html";
}

function finalizar() {
    alert("Página em construção...")
}

async function mapResult() {
    var valorHora = await getValorHora();
    
    var valorIdeal = document.getElementById("valorIdeal");
    var valorMinimo = document.getElementById("valorMinimo");
    var faturamentoMinimo = document.getElementById("faturamentoMinimo");
    var custoFerias = document.getElementById("custoFerias");
    var percentualFerias = document.getElementById("percentualFerias");
    var reservaPercentual = document.getElementById("reservaPercentual");

    valorIdeal.textContent = valorHora.valorIdealHoraDeTrabalho.toFixed(3);
    valorMinimo.textContent = valorHora.valorMinimoHoraDeTrabalho.toFixed(3);
    faturamentoMinimo.textContent = valorHora.faturamentoMensalMinimo.toFixed(3);
    custoFerias.textContent = valorHora.custoFerias.toFixed(3);
    percentualFerias.textContent = valorHora.percentualCustoFerias.toFixed(3);
    reservaPercentual.textContent = valorHora.percentualReservaFerias.toFixed(3);
}

mapResult();


async function getValorHora() {
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