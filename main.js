const html = document.querySelector('html');
const focoBtn = document.querySelector('.app__card-button--foco');
const descansoBtn = document.querySelector('.app__card-button--curto');
const descansoLongoBtn = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title'); 
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const startPauseBtn = document.querySelector('#start-pause');
const comecarPausar = document.querySelector('#start-pause span');
const alternarImg = document.querySelector('img.app__card-primary-butto-icon'); 
const tempoTela = document.querySelector('#timer');

const musica = new Audio('sons/luna-rise-part-one.mp3');
const audioStart = new Audio('sons/play.wav');
const audioPause = new Audio('sons/pause.mp3');
const audioTempoFinalizado = new Audio('sons/beep.mp3');

let tempoDecorridoEmSegundos = 1500;
musica.loop = true;
let intervaloId = null;

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    };
});

function alterarContexto (contexto) {
    exibirTempoTela();
    botoes.forEach( function(contexto) {
        contexto.classList.remove('active');
    });

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `imagens/${contexto}.png`);

    switch (contexto) {
        case '-': 
            titulo.innerHTML = `
                            Otimize sua produtividade,<br>
                            <strong class="app__title-strong">mergulhe no que importa.</strong>`           
            break;
        case 'descanso-curto': 
            titulo.innerHTML = `
                            Que tal dar uma respirada?<br>
                            <strong class="app__title-strong">Faça uma pausa curta!</strong>`
            break;
        case 'descanso-longo': 
            titulo.innerHTML = `
                            Hora de voltar à superfície.<br>
                            <strong class="app__title-strong">Faça uma pausa longa.</strong>`
            break;   
        default:
            break;
    }
};

focoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBtn.classList.add('active');
});

descansoBtn.addEventListener('click', () => {   
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    descansoBtn.classList.add('active');

});

descansoLongoBtn.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    descansoLongoBtn.classList.add('active');
});

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        audioTempoFinalizado.play();
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) { // Com a condição verdadeira, as outras aplicações do projeto podem ouvir e reagir ao evento.
            const evento = new CustomEvent('focoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
        return;
    };

    tempoDecorridoEmSegundos -= 1;
    exibirTempoTela();
};

startPauseBtn.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        zerar()
        audioPause.play();
        return;
    };

    audioStart.play();

    intervaloId = setInterval(contagemRegressiva, 1000);
    comecarPausar.textContent = 'Pausar';
    alternarImg.setAttribute('src', 'imagens/pause.png');
};

function zerar() {
    clearInterval(intervaloId);
    comecarPausar.textContent = 'Começar';
    alternarImg.setAttribute('src', 'imagens/play_arrow.png');
    intervaloId = null;
};

function exibirTempoTela () {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    tempoTela.innerHTML = `${tempoFormatado}`;
};

exibirTempoTela();