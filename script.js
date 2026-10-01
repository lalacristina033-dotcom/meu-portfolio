/* =========================================
   1. CONFIGURAÇÃO DO SUPABASE
========================================= */

const SUPABASE_URL = "https://bgkihjquthkgaaqsbgda.supabase.co";
const SUPABASE_KEY = "sb_publishable_QmP4kHC-Yerg5mH65dnHQw_ZA6UJEBF";

const supabaseClient =
    window.supabase && typeof window.supabase.createClient === "function"
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
        : null;


/* =========================================
   2. MENU RESPONSIVO
========================================= */

const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

function fecharMenu() {
    if (!menuButton || !nav) return;

    menuButton.classList.remove("active");
    nav.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
}

if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
        const estaAberto = nav.classList.toggle("active");

        menuButton.classList.toggle("active", estaAberto);
        menuButton.setAttribute("aria-expanded", String(estaAberto));
        menuButton.setAttribute(
            "aria-label",
            estaAberto ? "Fechar menu" : "Abrir menu"
        );

        document.body.classList.toggle("menu-open", estaAberto);
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", fecharMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            fecharMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            fecharMenu();
        }
    });
}


/* =========================================
   3. EFEITO DE LUZ DO CURSOR
========================================= */

const cursorGlow = document.querySelector(".cursor-glow");
const prefereMovimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (cursorGlow && !prefereMovimentoReduzido) {
    let framePendente = false;

    document.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch" || framePendente) return;

        framePendente = true;

        window.requestAnimationFrame(() => {
            cursorGlow.style.left = `${event.clientX}px`;
            cursorGlow.style.top = `${event.clientY}px`;
            framePendente = false;
        });
    });
} else if (cursorGlow) {
    cursorGlow.style.display = "none";
}


/* =========================================
   4. ANIMAÇÕES DE ENTRADA
========================================= */

const elementosReveal = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !prefereMovimentoReduzido) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    elementosReveal.forEach((elemento) => {
        revealObserver.observe(elemento);
    });
} else {
    elementosReveal.forEach((elemento) => {
        elemento.classList.add("visible");
    });
}


/* =========================================
   5. BARRAS DE HABILIDADES
========================================= */

const skillsSection = document.getElementById("habilidades");
const skillBars = document.querySelectorAll(".skill-bar i");

function animarBarras() {
    skillBars.forEach((barra) => {
        const largura = barra.style.getPropertyValue("--width").trim();

        if (largura) {
            barra.style.width = largura;
        }
    });
}

if (skillsSection && "IntersectionObserver" in window && !prefereMovimentoReduzido) {
    const skillsObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                animarBarras();
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.2 }
    );

    skillsObserver.observe(skillsSection);
} else {
    animarBarras();
}


/* =========================================
   6. CONTADORES ANIMADOS
========================================= */

function animarContador(elemento) {
    const alvo = Number(elemento.dataset.target);

    if (!Number.isFinite(alvo) || alvo < 0) {
        elemento.textContent = "0";
        return;
    }

    if (prefereMovimentoReduzido) {
        elemento.textContent = String(alvo);
        return;
    }

    const duracao = 1200;
    const inicio = performance.now();

    function atualizar(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const suavizado = 1 - Math.pow(1 - progresso, 3);

        elemento.textContent = String(Math.floor(alvo * suavizado));

        if (progresso < 1) {
            window.requestAnimationFrame(atualizar);
        } else {
            elemento.textContent = String(alvo);
        }
    }

    window.requestAnimationFrame(atualizar);
}

const contadores = document.querySelectorAll(".counter");

if ("IntersectionObserver" in window && !prefereMovimentoReduzido) {
    const contadorObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                animarContador(entry.target);
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.5 }
    );

    contadores.forEach((contador) => {
        contadorObserver.observe(contador);
    });
} else {
    contadores.forEach(animarContador);
}


/* =========================================
   7. TEXTO ANIMADO
========================================= */

const typingElement = document.getElementById("typing");

if (typingElement && !prefereMovimentoReduzido) {
    const frases = [
        "e desenvolvimento web.",
        "e design de interfaces.",
        "e tecnologia criativa."
    ];

    let fraseIndex = 0;
    let letraIndex = frases[0].length;
    let apagando = false;

    function animarTexto() {
        const fraseAtual = frases[fraseIndex];

        if (apagando) {
            letraIndex--;
        } else {
            letraIndex++;
        }

        typingElement.textContent = fraseAtual.slice(0, letraIndex);

        let intervalo = apagando ? 35 : 65;

        if (!apagando && letraIndex === fraseAtual.length) {
            apagando = true;
            intervalo = 1600;
        } else if (apagando && letraIndex === 0) {
            apagando = false;
            fraseIndex = (fraseIndex + 1) % frases.length;
            intervalo = 350;
        }

        window.setTimeout(animarTexto, intervalo);
    }

    window.setTimeout(animarTexto, 1800);
}


/* =========================================
   8. PROJETOS DO SUPABASE
========================================= */

const projectsGrid = document.getElementById("projectsGrid");
const projectsLoading = document.getElementById("projectsLoading");

const estilosProjetos = [
    { classe: "project-blue", simbolo: "</>" },
    { classe: "project-green", simbolo: "{ }" },
    { classe: "project-purple", simbolo: "✳" },
    { classe: "project-orange", simbolo: "✦" },
    { classe: "project-pink", simbolo: "◇" },
    { classe: "project-cyan", simbolo: "↗" }
];

function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (texto !== undefined && texto !== null) {
        elemento.textContent = texto;
    }

    return elemento;
}

function mostrarMensagemProjetos(texto, classe = "projects-empty") {
    if (!projectsGrid) return;

    projectsGrid.replaceChildren(
        criarElemento("p", classe, texto)
    );
}

function criarCardProjeto(projeto, indice) {
    const estilo = estilosProjetos[indice % estilosProjetos.length];

    const card = criarElemento("article", "project-card reveal");
    card.classList.add("visible");

    const capa = criarElemento("div", `project-cover ${estilo.classe}`);

    const numero = criarElemento(
        "span",
        "project-number",
        `PROJETO ${(indice + 1).toString().padStart(2, "0")}`
    );

    const icone = criarElemento(
        "span",
        "project-cover-icon",
        estilo.simbolo
    );

    icone.setAttribute("aria-hidden", "true");

    capa.append(numero, icone);

    const conteudo = criarElemento("div", "project-content");

    const titulo = criarElemento(
        "h3",
        "",
        String(projeto.titulo || "Projeto sem título")
    );

    const descricao = criarElemento(
        "p",
        "",
        String(projeto.descricao || "Descrição não informada.")
    );

    conteudo.append(titulo, descricao);

    const urlInformada = String(projeto.link || "").trim();

    if (urlInformada) {
        try {
            const url = new URL(urlInformada);

            if (url.protocol === "https:" || url.protocol === "http:") {
                const link = criarElemento("a", "project-link", "Ver projeto ↗");

                link.href = url.href;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.setAttribute(
                    "aria-label",
                    `Abrir o projeto ${String(projeto.titulo || "")} em uma nova aba`
                );

                conteudo.append(link);
            } else {
                conteudo.append(
                    criarElemento("span", "project-link-disabled", "Link indisponível")
                );
            }
        } catch {
            conteudo.append(
                criarElemento("span", "project-link-disabled", "Link indisponível")
            );
        }
    } else {
        conteudo.append(
            criarElemento("span", "project-link-disabled", "Projeto em construção")
        );
    }

    card.append(capa, conteudo);

    return card;
}

async function carregarProjetos() {
    if (!projectsGrid) return;

    if (!supabaseClient) {
        mostrarMensagemProjetos(
            "Não foi possível iniciar o Supabase. Confira se a biblioteca foi carregada.",
            "projects-error"
        );
        return;
    }

    if (projectsLoading) {
        projectsLoading.textContent = "Carregando projetos...";
    }

    try {
        const { data, error } = await supabaseClient
            .from("projetos")
            .select("titulo, descricao, link, criado_em")
            .order("criado_em", { ascending: false });

        if (error) {
            throw error;
        }

        if (!Array.isArray(data) || data.length === 0) {
            mostrarMensagemProjetos(
                "Ainda não há projetos cadastrados. Volte em breve para conferir as novidades."
            );
            atualizarContadorProjetos(0);
            return;
        }

        const fragmento = document.createDocumentFragment();

        data.forEach((projeto, indice) => {
            fragmento.appendChild(criarCardProjeto(projeto, indice));
        });

        projectsGrid.replaceChildren(fragmento);
        atualizarContadorProjetos(data.length);
    } catch (error) {
        console.error("Erro ao carregar projetos:", error);

        mostrarMensagemProjetos(
            "Não foi possível carregar os projetos. Confira a conexão e as permissões do Supabase.",
            "projects-error"
        );
    }
}

function atualizarContadorProjetos(total) {
    const contadorProjetos = document.querySelector(".stat-item .counter");

    if (!contadorProjetos) return;

    contadorProjetos.dataset.target = String(total);

    if (contadorProjetos.dataset.animado === "true") {
        contadorProjetos.textContent = String(total);
    } else {
        contadorProjetos.textContent = "0";
    }
}

carregarProjetos();


/* =========================================
   9. FORMULÁRIO DE CONTATO
========================================= */

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const submitButton = contactForm
    ? contactForm.querySelector('button[type="submit"]')
    : null;
const submitText = document.getElementById("submitText");

function mostrarStatusFormulario(texto, tipo) {
    if (!formMessage) return;

    formMessage.textContent = texto;
    formMessage.classList.remove("success", "error");

    if (tipo) {
        formMessage.classList.add(tipo);
    }
}

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = document.getElementById("nome")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const mensagem = document.getElementById("mensagem")?.value.trim() || "";

        if (!nome || !email || !mensagem) {
            mostrarStatusFormulario(
                "Preencha todos os campos antes de enviar.",
                "error"
            );
            return;
        }

        if (nome.length > 100 || email.length > 254 || mensagem.length > 3000) {
            mostrarStatusFormulario(
                "Um dos campos ultrapassou o limite permitido.",
                "error"
            );
            return;
        }

        if (!supabaseClient) {
            mostrarStatusFormulario(
                "A conexão com o serviço não foi iniciada. Tente novamente mais tarde.",
                "error"
            );
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
        }

        if (submitText) {
            submitText.textContent = "Enviando...";
        }

        mostrarStatusFormulario("Enviando sua mensagem...", "");

        try {
            const { error } = await supabaseClient
                .from("mensagens")
                .insert([
                    {
                        nome,
                        email,
                        mensagem
                    }
                ]);

            if (error) {
                throw error;
            }

            mostrarStatusFormulario(
                "Mensagem enviada com sucesso! Obrigada pelo contato.",
                "success"
            );

            contactForm.reset();
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);

            mostrarStatusFormulario(
                "Não foi possível enviar. Confira se a tabela mensagens e as permissões do Supabase estão configuradas.",
                "error"
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }

            if (submitText) {
                submitText.textContent = "Enviar mensagem";
            }
        }
    });
}


/* =========================================
   10. BOTÃO VOLTAR AO TOPO
========================================= */

const backTop = document.getElementById("backTop");

function atualizarBotaoTopo() {
    if (!backTop) return;

    backTop.classList.toggle("visible", window.scrollY > 400);
}

window.addEventListener("scroll", atualizarBotaoTopo, { passive: true });

atualizarBotaoTopo();

if (backTop) {
    backTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefereMovimentoReduzido ? "auto" : "smooth"
        });
    });
}


/* =========================================
   11. ANO AUTOMÁTICO NO RODAPÉ
========================================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
}