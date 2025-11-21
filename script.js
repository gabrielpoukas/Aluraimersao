const RAWG_API_KEY = '9922dc002a214c97965d5e72d821e65f'; 
const API_BASE_URL = 'https://api.rawg.io/api/games';
const URL_GITHUB = 'https://github.com/gabrielpoukas';

const formBusca = document.querySelector('.formulario-busca');
const entradaJogo = document.getElementById('entradaJogo');
const containerResultados = document.getElementById('containerResultados');
const body = document.body;

function atualizarFundo(url) {
    const backgroundUrl = url ? `url('${url}')` : 'var(--url-fundo-padrao)';
    document.documentElement.style.setProperty('--url-fundo', backgroundUrl);
}



async function buscarDadosJogo(termoBusca) {
    if (!termoBusca) return;

    mostrarCarregando();

    try {
        const url = `${API_BASE_URL}?key=${RAWG_API_KEY}&search=${encodeURIComponent(termoBusca)}`;
        
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error('Erro na comunicação com a API.');
        }

        const dados = await resposta.json();
        body.classList.remove('buscando');

        const resultadosRelevantes = dados.results; 

        if (resultadosRelevantes && resultadosRelevantes.length > 0) {
            atualizarFundo(resultadosRelevantes[0].background_image);
            exibirResultados(resultadosRelevantes);
        } else {
            atualizarFundo(null); 
            exibirMensagem('Nenhum jogo encontrado com este nome. Tente outro termo!', 'erro');
        }

    } catch (erro) {
        console.error('Erro ao buscar dados:', erro);
        body.classList.remove('buscando'); 
        exibirMensagem('Ocorreu um erro ao buscar. Verifique sua chave de API ou conexão.', 'erro');
    }
}

function exibirResultados(jogos) {
    containerResultados.innerHTML = '';

    const blocoConteudo = document.createElement('div');
    blocoConteudo.className = 'bloco-conteudo-main';

    const gradeResultados = document.createElement('div');
    gradeResultados.className = 'grade-resultados';
    
    const URL_GITHUB = 'https://github.com/gabrielpoukas'; 

    jogos.slice(0, 4).forEach(jogo => { 
        const nome = jogo.name;
        const ano = jogo.released ? jogo.released.substring(0, 4) : 'N/A';
        const capa = jogo.background_image || 'https://via.placeholder.com/300x169?text=Sem+Capa'; 
        const generos = jogo.genres.map(g => g.name).join(', ') || 'N/A';

        const mensagemCompartilhamento = encodeURIComponent(
            `Descobri o jogo "${nome}" na GamePedia! Gênero: ${generos}. Veja o projeto no GitHub: ${URL_GITHUB}`
        );
        const whatsappLink = `https://wa.me/?text=${mensagemCompartilhamento}`;
        
        const cartaoHTML = `
            <div class="cartao-resultado">
                <img src="${capa}" alt="Capa do jogo ${nome}">
                <h2>${nome}</h2>
                <p><strong>Ano de Lançamento:</strong> ${ano}</p>
                <p><strong>Gênero:</strong> ${generos}</p>
                
                <a href="${whatsappLink}" target="_blank" class="botao-compartilhar">
                    Compartilhar no WhatsApp
                </a>
            </div>
        `;
        gradeResultados.innerHTML += cartaoHTML;
    });

    blocoConteudo.appendChild(gradeResultados);
    containerResultados.appendChild(blocoConteudo);
}

function exibirMensagem(mensagem, tipo = 'info') {
    containerResultados.innerHTML = '';

    const blocoConteudo = document.createElement('div');
    blocoConteudo.className = 'bloco-conteudo-main';

    blocoConteudo.innerHTML = `
        <p class="mensagem-inicial" style="font-size: 1.2rem; color: ${tipo === 'erro' ? 'var(--cor-acento)' : 'var(--cor-primaria)'};">
            ${mensagem}
        </p>
        ${tipo === 'carregando' ? '<div class="loader"></div>' : ''}
    `;
    containerResultados.appendChild(blocoConteudo);
}

function mostrarCarregando() {
    exibirMensagem('Buscando dados na Gamepedia...', 'carregando');
    body.classList.add('buscando'); 
}

formBusca.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const termo = entradaJogo.value.trim();
    
    if (termo) {
        buscarDadosJogo(termo);
        entradaJogo.value = ''; 
    }
});