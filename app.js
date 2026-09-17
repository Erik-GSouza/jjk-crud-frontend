const API_URL = "https://jjk-crud-backend.onrender.com/personagens";
// enderço da API online

//form elements
const formulario = document.querySelector("#form-personagem");
const campoId = document.querySelector("#personagem-id");
const campoNome = document.querySelector("#nome");
const campoCategoria = document.querySelector("#categoria");
const campoTecnica = document.querySelector("#tecnica");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelar = document.querySelector("#botao-cancelar");
const listaPersonagens = document.querySelector("#lista-personagens");
const mensagem = document.querySelector("#mensagem");
const formularioBusca = document.querySelector("#form-busca");
const campoBuscaId = document.querySelector("#busca-id");


//fazer requisicoes pro back
async function fazerRequisicao(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);

  // cado dê erro no back
  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.mensagem || "Não foi possível concluir a operação");
  }

  // delete retorna 204 e n tem JSON
  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

// mensagens pro user
function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
}

function criarCartaoPersonagem(personagem) {
  const cartao = document.createElement("article");
  cartao.className = "personagem";

  const nome = document.createElement("h3");
  nome.textContent = personagem.nome;

  const categoria = document.createElement("p");
  categoria.textContent = `Categoria: ${personagem.categoria}`;

  const tecnica = document.createElement("p");
  tecnica.textContent = `Técnica: ${personagem.tecnica}`;

  const id = document.createElement("p");
  id.textContent = `ID: ${personagem._id}`;


  // botoes
  const acoes = document.createElement("div");
  acoes.className = "acoes-personagem";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", function () {carregarPersonagemParaEdicao(personagem._id)});

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "perigo";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", () => excluirPersonagem(personagem._id));

  acoes.append(botaoEditar, botaoExcluir);
  cartao.append(nome, categoria, tecnica, id, acoes);

  return cartao;
}

// novos char do back
function exibirPersonagens(personagens) {
  listaPersonagens.innerHTML = "";

  if (personagens.length === 0) {
    mostrarMensagem("Nenhum personagem cadastrado");
    return;
  }

  // tem fucntion?
  personagens.forEach((personagem) => {
    listaPersonagens.appendChild(criarCartaoPersonagem(personagem));
  });

  mostrarMensagem(`${personagens.length} personagem(s) encontrado(s)`);
}


// todos os char
async function listarPersonagens() {
  try {
    mostrarMensagem("Carregando personagens...");
    const personagens = await fazerRequisicao(API_URL);
    exibirPersonagens(personagens);
  } catch (erro) {
    listaPersonagens.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
}

// busca pelo id
async function buscarPersonagemPorId(id) {
  const personagem = await fazerRequisicao(`${API_URL}/${id}`);
  exibirPersonagens([personagem]);
  return personagem;
}

// cadastar / att char
async function salvarPersonagem(evento) {
  evento.preventDefault();

  const personagem = {
    nome: campoNome.value.trim(),
    categoria: campoCategoria.value.trim(),
    tecnica: campoTecnica.value.trim()
  };

  const id = campoId.value;
  const estaEditando = Boolean(id);

  //se tem ID, att - se n, cria char novo
  const url = estaEditando ? `${API_URL}/${id}` : API_URL;
  const metodo = estaEditando ? "PUT" : "POST";

  try {
    await fazerRequisicao(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(personagem)
    });

    limparFormulario();
    mostrarMensagem(estaEditando ? "Personagem atualizado" : "Personagem cadastrado");
    await listarPersonagens();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function carregarPersonagemParaEdicao(id) {
  try {
    const personagem = await fazerRequisicao(`${API_URL}/${id}`);

    campoId.value = personagem._id;
    campoNome.value = personagem.nome;
    campoCategoria.value = personagem.categoria;
    campoTecnica.value = personagem.tecnica;
    tituloFormulario.textContent = "Editar personagem";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.classList.remove("oculto");
    campoNome.focus();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function excluirPersonagem(id) {
  const confirmou = window.confirm("Deseja excluir este personagem?");

  if (!confirmou) {
    return;
  }

  try {
    await fazerRequisicao(`${API_URL}/${id}`, { method: "DELETE" });
    limparFormulario();
    mostrarMensagem("Personagem excluído");
    await listarPersonagens();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

// limpa form e volta pro cadastro
function limparFormulario() {
  formulario.reset();
  campoId.value = "";
  tituloFormulario.textContent = "Novo personagem";
  botaoSalvar.textContent = "Cadastrar";
  botaoCancelar.classList.add("oculto");
}

formulario.addEventListener("submit", salvarPersonagem);
botaoCancelar.addEventListener("click", limparFormulario);
document.querySelector("#botao-atualizar").addEventListener("click", listarPersonagens);
document.querySelector("#botao-limpar-busca").addEventListener("click", () => {
  campoBuscaId.value = "";
  listarPersonagens();
});


// bucar char por ID
formularioBusca.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = campoBuscaId.value.trim();

  if (!id) {
    mostrarMensagem("Informe um ID para realizar a busca", true);
    return;
  }

  try {
    await buscarPersonagemPorId(id);
  } catch (erro) {
    listaPersonagens.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

listarUsuarios();
