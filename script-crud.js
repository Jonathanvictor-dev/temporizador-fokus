const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const limparTarefasConcluidas = document.querySelector('#btn-remover-concluidas');
const limparTodasTarefas = document.querySelector('#btn-remover-todas');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; // Recebe a TAREFA e inclui na lista de TAREFAS // JSON.parse converte a string para elemento. 
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefa () {
    localStorage.setItem('tarefas', JSON.stringify(tarefas)); // Envia as listas de TAREFAS para o localStorage. JSON.stringinfy() converte o objeto para string.
};

function limparFormulario () {
    textArea.value = '';
    formAdicionarTarefa.classList.add('hidden');
};

btnCancelar.addEventListener('click', limparFormulario);

function criarElementoTarefa (tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
        `
    svg.addEventListener('click', () => {
        debugger
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
        tarefa.completa = true;
        atualizarTarefa();
    });

    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description');
    paragrafo.textContent = tarefa.descricao;

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        // debugger
        const novaDescricao = prompt('Qual é a nova tarefa?');
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao; 
            atualizarTarefa();    
        };
    };

    const imgBtn = document.createElement('img');
    imgBtn.setAttribute('src', 'imagens/edit.png');
    botao.append(imgBtn);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
            // debugger
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active');
                });
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null
                liTarefaSelecionada = null;
                return;
            };
            tarefaSelecionada = tarefa; 
            liTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            li.classList.add('app__section-task-list-item-active');
        };
    };


    return li;
};

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault(); // Previne o comportamento padrão do navegador.
    const tarefa = {
        descricao: textArea.value // Recebe o valor digitado na textArea.
    };
    
    tarefas.push(tarefa); // Envia a TAREFA para lista de TAREFAS.
    const elementoTarefas = criarElementoTarefa(tarefa);
    atualizarTarefa();
    ulTarefas.append(elementoTarefas);
    textArea.value = '';
    formAdicionarTarefa.classList.add('hidden');
});


tarefas.forEach(tarefa => { // forEach percorre cada tarefa criada. 
    const elementoTarefas = criarElementoTarefa(tarefa); // Chama a função para criar os elementos TAREFA.
    ulTarefas.append(elementoTarefas); // A tag <ul> recebe o elemento li a cada tarefa existente.
});

document.addEventListener('focoFinalizado', () => { // Adiciona um evento quando a contagem de foco finaliza. 
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefa();
    };
});

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    });
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefa();
};

limparTarefasConcluidas.onclick = () => removerTarefas(true);
limparTodasTarefas.onclick = () => removerTarefas(false);

