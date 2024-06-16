// API
async function listaProdutos() {
    try {
        const conexao = await fetch("http://localhost:3000/produtos");
        if (!conexao.ok) {
            throw new Error("Erro ao obter os produtos.");
        }

        const conexaoConvertida = await conexao.json();
        criarCards(conexaoConvertida);
        return conexaoConvertida;
    } catch (error) {
        console.error("Ocorreu um erro ao listar os produtos:", error);
    }
}


listaProdutos();



// CRIAR CARDS
const cardsContainer = document.querySelector(".main__cards__content");

function criarCards(produtos) {
    try {
        produtos.forEach(element => {
            cardsContainer.innerHTML += `
            <div class="card">
                <img id="imagem--produto" src="${element.imagem}" alt="Imagem do Produto">
                <div class="card-content--info">
                    <p>${element.titulo}</p>
                    <div class="card-content--value">
                        <p>R$ ${element.preco}</p>
                        <img id="icon--trash" src="assets/icons/icon-trash.png" alt="Ícone Lixeira" data-id="${element.id}" class="delete" title="Deletar">
                    </div>
                </div>
            </div>
            `;
        });
    } catch (error) {
        console.error("Ocorreu um erro ao criar os cards:", error);
    }
}



// FORMULARIO
const formulario = document.querySelector("[data-formulario]");

async function cardsProduto(evento) {
    try {
        evento.preventDefault();

        const imagem = document.querySelector("[data-imagem]").value;
        const titulo = document.querySelector("[data-titulo]").value;
        const preco = document.querySelector("[data-preco]").value;

        const novoProduto = await AdicionarProduto(imagem, titulo, preco);

        criarCards([novoProduto]);
    } catch (error) {
        console.error("Ocorreu um erro ao processar o formulário:", error);
    }
}

formulario.addEventListener("submit", evento => cardsProduto(evento));



// ADICIONAR NOVO PRODUTO
async function AdicionarProduto(imagem, titulo, preco) {
    try {
        
        if (!imagem || !titulo || !preco) {
            throw new Error("Por favor, preencha todos os campos.");
        }

        const conexao = await fetch("http://localhost:3000/produtos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                imagem: imagem,
                titulo: titulo,
                preco: preco,
            })
        });

        if (!conexao.ok) {
            throw new Error("Erro ao adicionar o produto.");
        }

        const conexaoConvertida = await conexao.json();
        return conexaoConvertida;
    } catch (error) {
        console.error("Ocorreu um erro ao adicionar o produto:", error);
        alert("Por favor, preencha todos os campos.");
        throw error;
    }
}




// DELETAR PRODUTO
async function deletarProduto(id) {
    try {
        const confirmacao = confirm('Tem certeza que deseja excluir este produto?');

        if (confirmacao) {
            const resposta = await fetch(`http://localhost:3000/produtos/${id}`, {
                method: 'DELETE'
            });

            if (!resposta.ok) {
                throw new Error('Erro ao deletar o produto');
            }
            await listaProdutos();
        }

    } catch (error) {
        console.error('Ocorreu um erro ao deletar o produto:', error.message);
    }
}

document.addEventListener('click', async (evento) => {
    if (evento.target && evento.target.id === 'icon--trash') {
        const id = evento.target.getAttribute('data-id');
        await deletarProduto(id);
    }
});



