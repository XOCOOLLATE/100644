const numeroWhatsApp = "5551981727883";

const produtos = [
  {
    nome: "Placa de Gesso ST-RU-RF",
    categoria: "Drywall",
    marca: "Knauf",
    descricao: "Produto para forros, reformas e acabamentos internos.",
    preco: "Consultar",
    icone: "G",
    imagem: "img/produtos/placa-gesso.jpg",
  },
  {
    nome: "Massa p/ pó - 20kg",
    categoria: "Massas e Tratamento de Juntas",
    marca: "Gypsum",
    descricao: "Ideal para tratamento de juntas e acabamento.",
    preco: "Consultar",
    icone: "M",
    imagem: "img/produtos/massa-gypsum-20kg.jpg",
  },
  {
    nome: "Tinta Coral",
    categoria: "Tintas",
    marca: "Coral",
    descricao: "Opcoes para pintura e finalizacao de ambientes.",
    preco: "Consultar",
    icone: "T",
  },
  {
    nome: "Complemento Tedox",
    categoria: "Complementos",
    marca: "Tedox",
    descricao: "Material de apoio para acabamento e obra.",
    preco: "Consultar",
    icone: "C",
  },
  {
    nome: "Ferramentas Vonder",
    categoria: "Ferramentas",
    marca: "Vonder",
    descricao: "Itens para instalacao, obra e manutencao.",
    preco: "Consultar",
    icone: "F",
  },
  {
    nome: "Serviçõs de instalação",
    categoria: "Mao de obra",
    marca: "Serviços",
    descricao: "Solicite orcamento para servicos dentro da regiao.",
    preco: "Orcamento",
    icone: "S",
  },
];

const listaProdutos = document.querySelector("#lista-produtos");
const campoBusca = document.querySelector("#busca");
const formularioBusca = document.querySelector(".search-form");

function criarLinkWhatsApp(produto) {
  const mensagem = `Ola! Tenho interesse em reservar ou consultar: ${produto.nome}`;
  return `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
}

function mostrarProdutos(itens) {
  listaProdutos.innerHTML = itens
    .map(
      (produto) => `
        <article class="product-card">
          <div class="product-image">
  ${
    produto.imagem
      ? `<img src="${produto.imagem}" alt="${produto.nome}" />`
      : `<span>${produto.icone}</span>`
  }
</div>
          <div class="product-info">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <div class="product-meta">
              <span class="tag">${produto.categoria}</span>
              <span>${produto.preco}</span>
            </div>
            <a class="button primary" href="${criarLinkWhatsApp(produto)}" target="_blank" rel="noreferrer">
              Reservar pelo WhatsApp
            </a>
          </div>
        </article>
      `,
    )
    .join("");
}

function filtrarProdutos(termo) {
  const busca = termo.toLowerCase().trim();

  if (!busca) {
    mostrarProdutos(produtos);
    return;
  }

  const resultado = produtos.filter((produto) => {
    return (
      produto.nome.toLowerCase().includes(busca) ||
      produto.categoria.toLowerCase().includes(busca) ||
      produto.descricao.toLowerCase().includes(busca)
    );
  });

  mostrarProdutos(resultado);
}

formularioBusca.addEventListener("submit", (evento) => {
  evento.preventDefault();
  filtrarProdutos(campoBusca.value);
  document.querySelector("#produtos").scrollIntoView({ behavior: "smooth" });
});

campoBusca.addEventListener("input", () => {
  filtrarProdutos(campoBusca.value);
});

mostrarProdutos(produtos);

// Duplica os logos para o loop ser infinito
const track = document.querySelector("#marquee-track");
if (track) {
  track.innerHTML += track.innerHTML;
}

// Clique nos logos das marcas
document.querySelectorAll(".partner-logo-btn").forEach((botao) => {
  botao.addEventListener("click", () => {
    const marcaSelecionada = botao.dataset.marca;
    const produtosFiltrados = produtos.filter(
      (p) => p.marca === marcaSelecionada,
    );
    mostrarProdutos(produtosFiltrados);
    document.querySelector("#produtos").scrollIntoView({ behavior: "smooth" });
  });
});

// Envio da newsletter para Google Sheets
const newsletterForm = document.querySelector("#newsletter-form");
const newsletterNome = document.querySelector("#newsletter-nome");
const newsletterEmail = document.querySelector("#newsletter-email");
const newsletterMensagem = document.querySelector("#newsletter-mensagem");
const newsletterBotao = document.querySelector("#newsletter-botao");

const googleScriptURL =
  "https://script.google.com/macros/s/AKfycbzWcOCF8wNA-Dv6TEqyWf51B4lQyivzEEebqDqOheQdmI8OZJc8_RF9rvpkw5XIWSA1/exec";

if (newsletterForm) {
  newsletterForm.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nome = newsletterNome.value.trim();
    const email = newsletterEmail.value.trim();

    if (!nome || !email) {
      newsletterMensagem.textContent = "Preencha seu nome e email.";
      newsletterMensagem.classList.remove("sucesso");
      newsletterMensagem.classList.add("erro");
      return;
    }

    newsletterMensagem.textContent = "Enviando...";
    newsletterMensagem.classList.remove("erro");
    newsletterMensagem.classList.remove("sucesso");

    newsletterBotao.disabled = true;
    newsletterBotao.textContent = "Enviando...";

    try {
      await fetch(googleScriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
        }),
      });

      newsletterMensagem.textContent = "Cadastro enviado com sucesso!";
      newsletterMensagem.classList.add("sucesso");

      newsletterForm.reset();
    } catch (erro) {
      newsletterMensagem.textContent = "Erro ao enviar. Tente novamente.";
      newsletterMensagem.classList.add("erro");
    } finally {
      newsletterBotao.disabled = false;
      newsletterBotao.textContent = "Enviar";
    }
  });
}
