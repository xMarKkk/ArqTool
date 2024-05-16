async function login() {
    var email = document.getElementById('emailL').value;
    var senha = document.getElementById('senhaL').value;

    var data = {
        email: email,
        senha: senha
    };

    // window.location.href = "./despesas/despesas.html";

    var urlLocal = 'https://localhost:7177/api/';
    var urlHospedagem = 'https://caiobadev-api-arqtool.azurewebsites.net/api/';
    var rotaEndpoint = 'v1/Usuario/Login';

    try {
        const response = await fetch((urlHospedagem + rotaEndpoint), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Verifique se a resposta foi bem-sucedida
        if (!response.ok) {
            // Se a resposta não for bem-sucedida, lance um erro
            const err = await response.json();
            throw err;
        }

        // Retorne os dados da resposta como JSON
        const responseData = await response.json();

        console.log(responseData);
        await setTokenEDataValidacao(responseData.token, responseData.expiration);

        //window.location.href = "./despesas/despesas.html";
        window.location.href = "./despesas/despesas.html";

    } catch (error) {
        // Capture e exiba quaisquer erros
        console.error('Erros:', error);
        alert("Erros de autenticação aconteceram. F12 para mais informações.");
    }
}

async function setTokenEDataValidacao(token, dataExpiracao) {
    localStorage.setItem('token', token);
    localStorage.setItem('dataExpiracao', dataExpiracao);
    console.log(token, dataExpiracao);
}

// async function setTokenEDataValidacao(token, dataExpiracao) {
//     localStorage.setItem('token', token);
//     localStorage.setItem('dataExpiracao', dataExpiracao)
// }

function irParaRegistro() {
    var body = document.querySelector("body");
    body.classList = "sign-up-js";
}

function irParaRecuperarSenha() {
    var body = document.querySelector("body");
    body.classList = "sign-up-js";

    // Aguarda 1 segundo (1000 milissegundos) antes de redirecionar
    setTimeout(function() {
        window.location.href = "./recupere-sua-senha/recupere-sua-senha.html";
    }, 180);
}

//Início do Javascript de Registro


async function registro() {
    var nome = document.getElementById('nomeCompletoR').value;
    var dataNascimento = document.getElementById('dataNascimentoR').value;
    var dataNascimentoFormatada = formatarDataNascimentoAnoMesDia(dataNascimento);
    var telefone = document.getElementById('telefoneR').value;
    var telefoneFormatado = await formatarTelefoneToInteger(telefone);
    var email = document.getElementById('emailR').value;
    var senha = document.getElementById('senhaR').value;
    var confirmacaoSenha = document.getElementById('confirmacaoSenhaR').value;

    var data = {
        nome: nome,
        dataNascimento: dataNascimentoFormatada,
        telefone: telefoneFormatado,
        email: email,
        senha: senha,
        confirmacaoSenha: confirmacaoSenha,
    };

    console.log(data);

    var urlLocal = 'https://localhost:7177/api/';
    var urlHospedagem = 'https://caiobadev-api-arqtool.azurewebsites.net/api/';
    var rotaEndpoint = 'v1/Usuario/Registro';

    try {
        const response = await fetch(urlHospedagem + rotaEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        console.log('Resposta:', response);
        alert('Registro realizado com sucesso, redirecionando para página de login...');
    } catch (error) {
        console.error('Erros:', error);
        alert("Erros de autenticação aconteceram. F12 para mais informações.");
    }
}

function separaNomeSobrenome(nomeCompleto) {
    var partes = nomeCompleto.split(' ');
    var nome = partes[0];
    var sobrenome = partes.slice(1).join(' ');

    return { nome: nome, sobrenome: sobrenome };
}


function formatarTelefone(input) {
    let value = input.value;
    let oldValue = input.defaultValue;

    // Verificar se o usuário está tentando apagar um caractere
    if (oldValue.length > value.length) {
        input.defaultValue = value;
        return;
    }

    // Remove caracteres não numéricos
    value = value.replace(/\D/g, '');

    // Formatar de acordo com o número de dígitos
    if (value.length <= 2) {
        // Incluir os parênteses após o segundo dígito
        value = `(${value.slice(0, 2)}`;
    } else if (value.length <= 6) {
        // Adicionar um traço após o sexto dígito
        value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}`;
    } else if (value.length <= 10) {
        // Adicionar um traço após o sexto dígito
        value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6, 10)}`;
    } else {
        // Reservar os 2 primeiros para o DD, e adicionar o - após o sétimo dígito
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }

    // Limitar a 11 caracteres
    value = value.slice(0, 16);

    input.value = value;
    input.defaultValue = value;
}

function formatarTelefoneToInteger(telefone) {
    var telefoneFormatado = telefone.replace(/\D/g, '');
    console.log(telefoneFormatado);
    return telefoneFormatado;
}

function formatarDataNascimentoAnoMesDia(dataNascimento) {

    // Dividir a data em dia, mês e ano
    var partesData = dataNascimento.split('/');

    // Reorganizar no formato AAAA-MM-DD
    var dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;

    return dataFormatada;
}

function formatarDataNascimento(input) {
    let value = input.value;
    let oldValue = input.defaultValue;

    // Verificar se o usuário está tentando apagar um caractere
    if (oldValue.length > value.length) {
        input.defaultValue = value;
        return;
    }

    // Remove caracteres não numéricos
    value = value.replace(/\D/g, '');

    // Formatar para DD/MM/AAAA
    if (value.length > 4) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8) || ''}`;
    } else if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4) || ''}`;
    }

    // Limitar a 8 caracteres
    value = value.slice(0, 10);

    input.value = value;
    input.defaultValue = value;
}

function irParaLogin() {
    var body = document.querySelector("body");
    body.classList = "sign-in-js";
}

//Fim do Javascript de Registro

//Início Javascript Compartilhado

function toggleVisibilityR(senhaId, confirmacaoSenhaId) {
    var senhaInput = document.getElementById(senhaId); // Seleciona o input da senha pelo ID
    var confirmacaoSenhaInput = document.getElementById(confirmacaoSenhaId); // Seleciona o input da confirmação da senha pelo ID

    var imagens = document.querySelectorAll('.fechadoR'); // Seleciona todas as imagens dentro dos botões

    // Verifica se o tipo atual do input da senha é 'password'
    if (senhaInput.type === 'password') {
        // Se for 'password', muda para 'text' e altera todas as imagens para olho aberto
        senhaInput.type = 'text';
        confirmacaoSenhaInput.type = 'text';
        imagens.forEach(function (imagem) {
            imagem.src = './assets/olho-aberto.png';
        });
    } else {
        // Caso contrário, muda para 'password' e altera todas as imagens para olho fechado
        senhaInput.type = 'password';
        confirmacaoSenhaInput.type = 'password';
        imagens.forEach(function (imagem) {
            imagem.src = './assets/olho-fechado.png';
        });
    }
}
function toggleVisibilityL() {
    var senhaInput = document.getElementById('senhaL'); // Seleciona o input pelo ID
    var imagem = document.querySelector('.fechadoL'); // Seleciona a imagem dentro do botão

    // Verifica se o tipo atual do input é 'password'
    if (senhaInput.type === 'password') {
        // Se for 'password', muda para 'text' e altera a imagem para olho aberto
        senhaInput.type = 'text';
        imagem.src = './assets/olho-aberto.png';
    } else {
        // Caso contrário, muda para 'password' e altera a imagem para olho fechado
        senhaInput.type = 'password';
        imagem.src = './assets/olho-fechado.png';
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        var body = document.querySelector("body");

        console.log(body.className === "sign-in-js");
        console.log(body.className === "sign-up-js")

        if (body.className === "sign-in-js") {
            login();
        }

        if (body.className === "sign-up-js") {
            registro();
        }
    }
});

//Fim Javascript Compartilhado



