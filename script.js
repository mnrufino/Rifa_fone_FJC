const areaNumeros = document.getElementById("numeros");
const numerosEscolhidos = document.getElementById("numerosEscolhidos");
const mensagem = document.getElementById("mensagem");

let selecionados = [];
let vendidos = JSON.parse(localStorage.getItem("numerosVendidos")) || [];

function salvarVendidos() {
  localStorage.setItem("numerosVendidos", JSON.stringify(vendidos));
}

function atualizarCampoSelecionados() {
  numerosEscolhidos.value = selecionados.join(", ");
}

function criarNumeros() {
  areaNumeros.innerHTML = "";

  for (let i = 1; i <= 200; i++) {
    const numero = String(i).padStart(3, "0");
    const botao = document.createElement("button");

    botao.className = "numero";
    botao.textContent = numero;

    if (vendidos.includes(numero)) {
      botao.classList.add("vendido");
      botao.disabled = true;
    }

    botao.addEventListener("click", function () {
      if (botao.classList.contains("vendido")) {
        return;
      }

      if (selecionados.includes(numero)) {
        selecionados = selecionados.filter(item => item !== numero);
        botao.classList.remove("selecionado");
      } else {
        selecionados.push(numero);
        botao.classList.add("selecionado");
      }

      atualizarCampoSelecionados();
      mensagem.textContent = "";
    });

    areaNumeros.appendChild(botao);
  }
}

function confirmarParticipacao() {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !telefone || selecionados.length === 0) {
    mensagem.textContent = "Preencha nome, telefone e escolha pelo menos um número.";
    mensagem.style.color = "red";
    return;
  }

  selecionados.forEach(numero => {
    if (!vendidos.includes(numero)) {
      vendidos.push(numero);
    }
  });

  salvarVendidos();

  document.querySelectorAll(".numero.selecionado").forEach(botao => {
    botao.classList.remove("selecionado");
    botao.classList.add("vendido");
    botao.disabled = true;
  });

  mensagem.textContent = `Participação confirmada: ${nome} - Números ${selecionados.join(", ")}`;
  mensagem.style.color = "green";

  selecionados = [];
  atualizarCampoSelecionados();

  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";
}

function enviarWhatsApp() {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !telefone || selecionados.length === 0) {
    mensagem.textContent = "Preencha nome, telefone e escolha pelo menos um número antes de enviar.";
    mensagem.style.color = "red";
    return;
  }

  const texto = `Olá! Quero participar da rifa.%0A%0ANome: ${nome}%0ATelefone: ${telefone}%0ANúmeros escolhidos: ${selecionados.join(", ")}`;
  const link = `https://wa.me/?text=${texto}`;

  window.open(link, "_blank");
}

function limparSelecao() {
  selecionados = [];

  document.querySelectorAll(".numero.selecionado").forEach(botao => {
    botao.classList.remove("selecionado");
  });

  atualizarCampoSelecionados();
  mensagem.textContent = "Seleção limpa.";
  mensagem.style.color = "#555";
}

function limparRifa() {
  const confirmar = confirm("Tem certeza que deseja limpar todos os números vendidos?");

  if (!confirmar) {
    return;
  }

  vendidos = [];
  selecionados = [];
  salvarVendidos();
  atualizarCampoSelecionados();
  criarNumeros();

  mensagem.textContent = "Números vendidos foram limpos.";
  mensagem.style.color = "green";
}

criarNumeros();
