const RAWG_API_KEY = '16932b1f2c464c14890a27b2ab3af982';
const API_BASE_URL = 'https://api.rawg.io/api/games';

const formBusca = document.querySelector('.formulario-busca');
const entradaJogo = document.getElementById('entradaJogo');
const containerResultados = document.getElementById('containerResultados');
const body = document.body;

async function buscarDadosJogo(termoBusca) {
    if (!termoBusca) return;

    mostrarCarregando();

    try {
        const url = `${API_BASE_URL}?key=${RAWG_API_KEY}&search=${encodeURIComponent(termoBusca)}`;
        
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error('Erro na comunicação com a API.');

            console.log("Dados recebidos da API:", dados);
        }

        const dados = await resposta.json();
        
        if (dados.results && dados.results.length > 0) {
            exibirResultados(dados.results);
        } else {
            exibirMensagem('Nenhum jogo encontrado com este nome. Tente outro termo!', 'erro');
        }

    } catch (erro) {
        console.error('Erro ao buscar dados:', erro);
        exibirMensagem('Ocorreu um erro ao buscar. Verifique sua chave de API ou conexão.', 'erro');
    }
}

function exibirResultados(jogos) {
    containerResultados.innerHTML = '';

    const blocoConteudo = document.createElement('div');
    blocoConteudo.className = 'bloco-conteudo-main';

    const gradeResultados = document.createElement('div');
    gradeResultados.className = 'grade-resultados';
    
    jogos.slice(0, 6).forEach(jogo => {
        const nome = jogo.name;
        const ano = jogo.released ? jogo.released.substring(0, 4) : 'N/A';
        const capa = jogo.background_image || 'caminho/para/placeholder.jpg';
        const generos = jogo.genres.map(g => g.name).join(', ') || 'N/A';

        const cartaoHTML = `
            <div class="cartao-resultado">
                <img src="${capa}" alt="Capa do jogo ${nome}" style="width:100%; height: auto; border-radius: 4px; margin-bottom: 1rem;">
                <h2>${nome}</h2>
                <p><strong>Ano de Lançamento:</strong> ${ano}</p>
                <p><strong>Gênero:</strong> ${generos}</p>
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
    buscarDadosJogo(termo);
});

if (entradaJogo.value.length > 0) {
    buscarDadosJogo(entradaJogo.value);
}