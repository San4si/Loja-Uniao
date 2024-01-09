// Variável que mantém o estado visível do carrinho
var carrinhoVisivel = false;

// Função que realiza a pesquisa
function pesquisar() {
    var termoPesquisa = document.getElementById('searchInput').value.toLowerCase();

    // Obtém todos os itens da loja
    var itens = document.getElementsByClassName('item');

    // Itera sobre os itens para verificar se o termo de pesquisa está presente no título
    for (var i = 0; i < itens.length; i++) {
        var tituloItem = itens[i].getElementsByClassName('titulo-item')[0].innerText.toLowerCase();

        // Se o termo de pesquisa estiver presente no título, torna o item visível, caso contrário, o oculta
        if (tituloItem.includes(termoPesquisa)) {
            itens[i].style.display = 'block';
        } else {
            itens[i].style.display = 'none';
        }
    }
}

// Esperamos que todos os elementos da página carreguem para executar o script
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', pronto)
} else {
    pronto();
}

function pronto() {

    // Adicionamos funcionalidade aos botões de excluir do carrinho
    var botoesExcluirItem = document.getElementsByClassName('btn-eliminar');
    for (var i = 0; i < botoesExcluirItem.length; i++) {
        var botao = botoesExcluirItem[i];
        botao.addEventListener('click', excluirItemCarrinho);
    }

    // Adicionamos funcionalidade ao botão de aumentar quantidade
    var botoesAumentarQuantidade = document.getElementsByClassName('aumentar-quantidade');
    for (var i = 0; i < botoesAumentarQuantidade.length; i++) {
        var botao = botoesAumentarQuantidade[i];
        botao.addEventListener('click', aumentarQuantidade);
    }

    // Adicionamos funcionalidade ao botão de diminuir quantidade
    var botoesDiminuirQuantidade = document.getElementsByClassName('diminuir-quantidade');
    for (var i = 0; i < botoesDiminuirQuantidade.length; i++) {
        var botao = botoesDiminuirQuantidade[i];
        botao.addEventListener('click', diminuirQuantidade);
    }

    // Adicionamos funcionalidade ao botão Adicionar ao carrinho
    var botoesAdicionarAoCarrinho = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botoesAdicionarAoCarrinho.length; i++) {
        var botao = botoesAdicionarAoCarrinho[i];
        botao.addEventListener('click', adicionarAoCarrinhoClicado);
    }

    // Adicionamos funcionalidade ao botão de comprar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicado)
}

// Função que controla o botão clicado de adicionar ao carrinho
function adicionarAoCarrinhoClicado(evento) {
    var botao = evento.target;
    var item = botao.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var preco = item.getElementsByClassName('precio-item')[0].innerText;
    var imagemSrc = item.getElementsByClassName('img-item')[0].src;

    adicionarItemAoCarrinho(titulo, preco, imagemSrc);

    tornarCarrinhoVisivel();
}

// Função que torna o carrinho visível
function tornarCarrinhoVisivel() {
    carrinhoVisivel = true;
    var carrinho = document.getElementsByClassName('carrito')[0];
    carrinho.style.marginRight = '0';
    carrinho.style.opacity = '1';

    var itens = document.getElementsByClassName('contenedor-items')[0];
    itens.style.width = '60%';
}

// Função que adiciona um item ao carrinho
function adicionarItemAoCarrinho(titulo, preco, imagemSrc) {
    var item = document.createElement('div');
    item.classList.add('carrito-item');
    var itensCarrinho = document.getElementsByClassName('carrito-items')[0];

    // Verificamos se o item que está tentando entrar não está no carrinho
    var nomesItensCarrinho = itensCarrinho.getElementsByClassName('carrito-item-titulo');
    for (var i = 0; i < nomesItensCarrinho.length; i++) {
        if (nomesItensCarrinho[i].innerText == titulo) {
            alert("O item já está no carrinho");
            return;
        }
    }

    var conteudoItemCarrinho = `
        <div class="carrito-item">
            <img src="${imagemSrc}" width="80px" alt="">
            <div class="carrito-item-detalhes">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="seletor-quantidade">
                    <i class="fa-solid fa-minus diminuir-quantidade"></i>
                    <input type="text" value="1" class="carrito-item-quantidade" disabled>
                    <i class="fa-solid fa-plus aumentar-quantidade"></i>
                </div>
                <span class="carrito-item-preco">${preco}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `
    item.innerHTML = conteudoItemCarrinho;
    itensCarrinho.appendChild(item);

    // Adicionamos a funcionalidade de excluir ao novo item
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', excluirItemCarrinho);

    // Adicionamos a funcionalidade de diminuir quantidade ao novo item
    var botaoDiminuirQuantidade = item.getElementsByClassName('diminuir-quantidade')[0];
    botaoDiminuirQuantidade.addEventListener('click', diminuirQuantidade);

    // Adicionamos a funcionalidade de aumentar quantidade ao novo item
    var botaoAumentarQuantidade = item.getElementsByClassName('aumentar-quantidade')[0];
    botaoAumentarQuantidade.addEventListener('click', aumentarQuantidade);

    // Atualizamos o total
    atualizarTotalCarrinho();
}

// Aumentamos em um a quantidade do elemento selecionado
function aumentarQuantidade(evento) {
    var botaoClicado = evento.target;
    var seletor = botaoClicado.parentElement;
    var quantidadeAtual = seletor.getElementsByClassName('carrito-item-quantidade')[0].value;
    quantidadeAtual++;
    seletor.getElementsByClassName('carrito-item-quantidade')[0].value = quantidadeAtual;
    atualizarTotalCarrinho();
}

// Diminuímos em um a quantidade do elemento selecionado
function diminuirQuantidade(evento) {
    var botaoClicado = evento.target;
    var seletor = botaoClicado.parentElement;
    var quantidadeAtual = seletor.getElementsByClassName('carrito-item-quantidade')[0].value;
    quantidadeAtual--;
    if (quantidadeAtual >= 1) {
        seletor.getElementsByClassName('carrito-item-quantidade')[0].value = quantidadeAtual;
        atualizarTotalCarrinho();
    }
}

// Excluímos o item selecionado do carrinho
function excluirItemCarrinho(evento) {
    var botaoClicado = evento.target;
    botaoClicado.parentElement.parentElement.remove();
    // Atualizamos o total do carrinho
    atualizarTotalCarrinho();

    // A função a seguir verifica se há elementos no carrinho
    // Se não houver, ocultamos o carrinho
    ocultarCarrinho();
}

// Função que verifica se há elementos no carrinho. Se não houver, oculta o carrinho.
function ocultarCarrinho() {
    var itensCarrinho = document.getElementsByClassName('carrito-items')[0];
    if (itensCarrinho.childElementCount == 0) {
        var carrinho = document.getElementsByClassName('carrito')[0];
        carrinho.style.marginRight = '-100%';
        carrinho.style.opacity = '0';
        carrinhoVisivel = false;

        var itens = document.getElementsByClassName('contenedor-items')[0];
        itens.style.width = '100%';
    }
}

// Atualizamos o total do Carrinho
function atualizarTotalCarrinho() {
    // Selecionamos o contêiner do carrinho
    var contenedorCarrinho = document.getElementsByClassName('carrito')[0];
    var itensCarrinho = contenedorCarrinho.getElementsByClassName('carrito-item');
    var total = 0;
    // Percorremos cada elemento do carrinho para atualizar o total
    for (var i = 0; i < itensCarrinho.length; i++) {
        var item = itensCarrinho[i];
        var elementoPreco = item.getElementsByClassName('carrito-item-preco')[0];
        // Removemos o símbolo do peso e o ponto de milésimos.
        var preco = parseFloat(elementoPreco.innerText.replace('R$', '').replace('.', '').replace(',', '.'));
        var quantidadeItem = item.getElementsByClassName('carrito-item-quantidade')[0];
        var quantidade = quantidadeItem.value;
        total = total + (preco * quantidade);
    }
    total = Math.round(total * 100) / 100;

    document.getElementsByClassName('carrito-precio-total')[0].innerText = 'R$' + total.toLocaleString("pt-BR") + ",00";
}

// Função que controla o botão clicado de pagar
function pagarClicado() {
    // Criar mensagem com a lista do carrinho e o total a pagar
    var mensagem = "Sua lista de compras:\n";

    var itensCarrinho = document.getElementsByClassName('carrito-items')[0].getElementsByClassName('carrito-item');
    var totalPagar = 0;

    for (var i = 0; i < itensCarrinho.length; i++) {
        var item = itensCarrinho[i];
        var titulo = item.getElementsByClassName('carrito-item-titulo')[0].innerText;
        var quantidade = item.getElementsByClassName('carrito-item-quantidade')[0].value;
        var preco = item.getElementsByClassName('carrito-item-preco')[0].innerText.replace('R$', '').replace('.', '').replace(',', '.');
        var subtotal = parseFloat(preco) * parseInt(quantidade);

        mensagem += `${quantidade}x ${titulo}: R$ ${subtotal.toLocaleString("pt-BR")}\n`;
        totalPagar += subtotal;
    }

    // Formatamos o total a pagar
    totalPagar = totalPagar.toLocaleString("pt-BR");

    mensagem += `\nTotal a pagar: R$ ${totalPagar}`;

    // Criar o link do WhatsApp com a mensagem
    var telefone = '5511961828216';  // Substitua pelo seu número de telefone
    var linkWhatsApp = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    // Mostrar mensagem de agradecimento
    alert("Obrigado pela compra");

    // Excluir todos os elementos do carrinho e ocultá-lo
    var itensCarrinho = document.getElementsByClassName('carrito-items')[0];
    while (itensCarrinho.hasChildNodes()) {
        itensCarrinho.removeChild(itensCarrinho.firstChild);
    }
    atualizarTotalCarrinho();
    ocultarCarrinho();

    // Abrir link do WhatsApp
    window.open(linkWhatsApp, '_blank');
}






