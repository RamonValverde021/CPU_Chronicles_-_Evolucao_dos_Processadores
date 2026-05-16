// ====== CURSOR ======
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .timeline-card, .future-card, .compare-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.background = 'var(--purple)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        cursor.style.background = 'var(--cyan)';
    });
});

// ====== PARTICLES ======
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '0,245,255' : '180,79,255'
}));

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
    });
    // connections
    particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 100) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(0,245,255,${0.05 * (1 - d / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ====== HERO COUNTER ======
function animateCounter(el, target, suffix = '', duration = 2000) {
    let start = null;
    function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const v = Math.floor(p * target);
        el.textContent = v + (suffix || '');
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

document.querySelectorAll('[data-target]').forEach(el => {
    setTimeout(() => {
        animateCounter(el, parseInt(el.dataset.target), el.dataset.suffix || '');
    }, 600);
});

// ====== INTERSECTION OBSERVER ======
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.timeline-item, .compare-card, .chart-card, .future-card').forEach(el => observer.observe(el));

// Bars animation
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.compare-bar-fill').forEach(fill => {
                fill.style.width = fill.dataset.width + '%';
            });
            // Moore's line
            const line = entry.target.querySelector('#mooresLine');
            if (line) setTimeout(() => line.style.strokeDashoffset = '0', 300);
            // Node bars
            entry.target.querySelectorAll('.node-bar-col').forEach((col, i) => {
                const h = col.dataset.h;
                const label = col.dataset.label;
                const color = col.dataset.color;
                const bar = document.createElement('div');
                bar.style.cssText = `width:100%;border-radius:4px 4px 0 0;background:${color};height:0;transition:height 1s ${i * 0.1}s cubic-bezier(0.23,1,0.32,1);`;
                const lbl = document.createElement('div');
                lbl.style.cssText = 'font-family:Share Tech Mono,monospace;font-size:0.55rem;color:#5a7a99;text-align:center;';
                lbl.innerHTML = label;
                col.appendChild(bar);
                col.appendChild(lbl);
                setTimeout(() => bar.style.height = h + 'px', 50);
            });
            // Transistor bars
            entry.target.querySelectorAll('.bar-visual').forEach((bar, i) => {
                const h = bar.dataset.height;
                setTimeout(() => bar.style.height = h + '%', i * 120);
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.compare-card, .chart-card').forEach(el => barObserver.observe(el));

// ====== MODAL DATA ======
const modalData = [
    {
        era: '1946 — 1955',
        title: 'Computadores Valvulados — Primeira Geração',
        intro: 'Os primeiros computadores eletrônicos utilizavam válvulas termiônicas (tubos a vácuo) como elementos de chaveamento. Essas válvulas funcionavam como interruptores eletrônicos, controlando o fluxo de elétrons no vácuo. O resultado eram máquinas imensas, que geravam muito calor e eram incrivelmente lentas para os padrões atuais, mas absolutamente revolucionárias para a sua época.',
        image_1: 'images/Válvula termiônica.jpg',
        legend_image_1: 'Válvulas termiônicas',
        specs: [
            { key: 'EXEMPLO', val: 'ENIAC (1946)' },
            { key: 'VÁLVULAS', val: '17.468 tubos' },
            { key: 'TAMANHO', val: '167 m² / 27 ton' },
            { key: 'VELOCIDADE', val: '5.000 op/seg' },
            { key: 'ENERGIA', val: '150.000 W' },
            { key: 'MEMÓRIA', val: '~200 bytes' },
        ],
        details: 'O ENIAC (Electronic Numerical Integrator and Computer), construído na Universidade da Pensilvânia, foi o primeiro computador de propósito geral totalmente eletrônico. Projetado para calcular tabelas de artilharia para o Exército dos EUA, sua construção só foi concluída após o fim da Segunda Guerra Mundial. As válvulas eram frágeis e geravam tanto calor que a máquina sofria falhas constantes — em média, uma a cada dois dias. Além disso, a "programação" do ENIAC era feita manualmente, exigindo a demorada reconexão física de milhares de cabos.',
        image_2: 'images/ENIAC.jpg',
        legend_image_2: 'Computador ENIAC',
        impact: '🌍 Impacto histórico: Os computadores a válvula inauguraram a era digital, provando na prática que máquinas eletrônicas eram capazes de resolver problemas matemáticos complexos. Eles estabeleceram as bases lógicas e arquiteturais para todas as inovações seguintes.'
    },
    {
        era: '1956 — 1963',
        title: 'Era dos Transistores — Segunda Geração',
        intro: 'Inventado no Bell Labs em 1947 por John Bardeen, Walter Brattain e William Shockley, o transistor levou alguns anos para substituir as válvulas nos computadores. Fabricado com materiais semicondutores (inicialmente germânio e, depois, silício), o transistor era muito menor, mais rápido, altamente confiável e consumia uma fração da energia elétrica.',
        image_1: 'images/Transistores.jpeg',
        legend_image_1: 'Transistores',
        specs: [
            { key: 'EXEMPLO', val: 'IBM 1401 (1959)' },
            { key: 'TECNOLOGIA', val: 'Germânio / Silício' },
            { key: 'TAMANHO', val: 'Alguns cm' },
            { key: 'VELOCIDADE', val: '193.000 op/seg' },
            { key: 'ENERGIA', val: '∼5.000 W' },
            { key: 'MEMÓRIA', val: '16 KB (core)' },
        ],
        details: 'O IBM 1401 foi um divisor de águas desta geração, vendendo mais de 10.000 unidades e se tornando um dos primeiros computadores produzidos em massa na história. Pela primeira vez, empresas adotavam a computação para os negócios, alugando tempo de processamento. Os transistores ainda eram soldados manualmente em placas de circuito impresso. Paralelamente, surgiram as primeiras linguagens de programação de alto nível, como o FORTRAN e o COBOL, que facilitaram a escrita de softwares.',
        image_2: 'images/IBM 1401.jpg',
        legend_image_2: 'Computador IBM 1401',
        impact: '🌍 Impacto histórico: A transição das válvulas para os transistores reduziu o tamanho dos computadores — que antes ocupavam galpões inteiros — para o tamanho de grandes armários. Isso viabilizou o uso comercial e empresarial, dando início à era de ouro dos mainframes.'
    },
    {
        era: '1964 — 1971',
        title: 'Circuitos Integrados — Terceira Geração',
        intro: 'No final da década de 1950, Jack Kilby (Texas Instruments) e Robert Noyce (Fairchild Semiconductor) inventaram o circuito integrado (CI) de forma independente. A ideia era revolucionária: miniaturizar e integrar múltiplos transistores, resistores e capacitores em um único pedaço de material semicondutor, criando o "chip".',
        image_1: 'images/Circuitos Integrados.jpg',
        legend_image_1: 'Circuitos Integrados',
        specs: [
            { key: 'EXEMPLO', val: 'IBM System/360' },
            { key: 'TRANSISTORES', val: '∼100 por chip' },
            { key: 'TAMANHO', val: 'Milímetros' },
            { key: 'VELOCIDADE', val: 'MHz (faixas)' },
            { key: 'ENERGIA', val: '∼1.000 W (sistema)' },
            { key: 'MEMÓRIA', val: 'MB (primeiros)' },
        ],
        details: 'O IBM System/360 foi o grande destaque dessa era. Foi a primeira família de computadores projetada para ter compatibilidade de software entre modelos de diferentes preços e desempenhos, um conceito que mudou a indústria corporativa. O uso de CIs também permitiu o surgimento dos minicomputadores (do tamanho de geladeiras) e das calculadoras eletrônicas de mesa. Na corrida espacial, o Apollo Guidance Computer da NASA inovou com o uso de circuitos integrados para guiar os astronautas até a Lua.',
        image_2: 'images/IBM 360.jpg',
        legend_image_2: 'Computador IBM 360',
        impact: '🌍 Impacto histórico: A adoção dos circuitos integrados reduziu drasticamente os custos e o tamanho do hardware, tornando a computação acessível a um número muito maior de universidades e médias empresas, além de acelerar o progresso científico e aeroespacial.'
    },
    {
        era: '1971 — 1999',
        title: 'Microprocessadores — Quarta Geração',
        intro: 'Em 1971, a Intel lançou o 4004, o primeiro microprocessador comercial do mundo, que reunia todos os componentes fundamentais de uma CPU em um único chip de apenas 12 mm². Originalmente encomendado pela fabricante japonesa Busicom para uso em calculadoras, o chip teve seu potencial universal rapidamente reconhecido.',
        image_1: 'images/intel_4004.jpg',
        legend_image_1: 'Microprocessador Intel 4004',
        specs: [
            { key: 'LANÇAMENTO', val: 'Intel 4004 (1971)' },
            { key: 'TRANSISTORES', val: '2.300' },
            { key: 'PROCESSO', val: '10 micrômetros' },
            { key: 'CLOCK', val: '740 kHz' },
            { key: 'BARRAMENTO', val: '4 bits' },
            { key: 'CUSTO', val: '$300 (1971)' },
        ],
        details: 'A evolução continuou implacável. Da linhagem do 4004, 8008 e 8080, surgiu o Intel 8086 em 1978, inaugurando a arquitetura x86, que até hoje é base de PCs e servidores. Nos anos 80, máquinas como o Apple II e o IBM PC popularizaram o uso doméstico. Já nos anos 90, o icônico Intel Pentium rompeu a barreira dos 3 milhões de transistores. Unido a sistemas operacionais gráficos como o Windows 95 e à chegada da internet comercial, o computador deixou de ser uma máquina de nicho e passou a ser o coração das residências e escritórios.',
        image_2: 'images/intel_pentium.jpg',
        legend_image_2: 'Processador x86 Intel Pentium',
        impact: '🌍 Impacto histórico: O microprocessador descentralizou a computação, colocando poder de processamento diretamente nas mesas de indivíduos comuns. Essa revolução pavimentou o caminho para a internet, a conectividade global e a economia digital que vivemos hoje.'
    },
    {
        era: '2000 — 2015',
        title: 'Processadores Multicore — Quinta Geração',
        intro: 'Por décadas, o desempenho dos processadores cresceu com o aumento contínuo da frequência de operação (clock). No entanto, no início dos anos 2000, os limites da física se impuseram: o alto consumo de energia e a dissipação extrema de calor tornaram insustentável continuar aumentando os GHz. A solução da indústria foi adotar processadores "multicore", colocando vários núcleos de processamento dentro de um mesmo chip.',
        image_1: 'images/processador_threads.png',
        legend_image_1: 'Ilustração de varios núcleos em um processador',
        specs: [
            { key: 'PIONEIRO', val: 'IBM POWER4 (2001)' },
            { key: 'PC (2005)', val: 'Intel Core Duo' },
            { key: 'MAX CORES', val: 'AMD EPYC 128c' },
            { key: 'PROCESSO', val: '14nm → 5nm' },
            { key: 'TRANSISTORES', val: 'Bilhões' },
            { key: 'CLOCK', val: '3-5 GHz' },
        ],
        details: 'A transição para arquiteturas de múltiplos núcleos exigiu que a indústria de software reescrevesse seus programas para aproveitar o processamento paralelo. O lançamento do Intel Core 2 Duo, em 2006, levou o multi-core às massas. Ao mesmo tempo, as GPUs (placas de vídeo) começaram a evoluir para além dos gráficos: tecnologias como NVIDIA CUDA permitiram o uso das GPUs para cálculos complexos, funcionando como supercomputadores paralelos. No mundo móvel, chips ARM multicore altamente eficientes proporcionaram a ascensão dos smartphones, conectando bilhões de pessoas.',
        image_2: 'images/chip AMR.jpg',
        legend_image_2: 'Processador AMR presente na maioria dos smartphones',
        impact: '🌍 Impacto histórico: O paradigma multicore superou as barreiras físicas do silício e permitiu um salto contínuo no desempenho, viabilizando os smartphones de bolso modernos, jogos com gráficos fotorrealistas e a base para os sistemas em nuvem.'
    },
    {
        era: '2016 — PRESENTE',
        title: 'Era da IA e Chips Específicos — Sexta Geração',
        intro: 'A explosão da inteligência artificial e do aprendizado de máquina mudou o foco da indústria. As antigas CPUs de uso geral não dão mais conta sozinhas. Hoje, a computação é heterogênea, liderada por aceleradores de hardware como GPUs projetadas para Data Centers, TPUs (Tensor Processing Units) do Google e NPUs integradas, capazes de processar os trilhões de operações matemáticas que as redes neurais demandam.',
        image_1: 'images/hang.jpg',
        legend_image_1: 'Jensen Huang exibe o novo chip GPU Blackwell durante a conferência GTC da Nvidia',
        specs: [
            { key: 'EXEMPLO', val: 'Apple M4 Ultra' },
            { key: 'TRANSISTORES', val: '92 bilhões' },
            { key: 'PROCESSO', val: 'TSMC 3nm' },
            { key: 'CPU CORES', val: '32 núcleos' },
            { key: 'GPU CORES', val: '80 núcleos' },
            { key: 'LARGURA MEMÓRIA', val: '819 GB/s' },
        ],
        details: 'A litografia avançou para a tecnologia EUV (Ultravioleta Extrema), permitindo a fabricação de transistores na casa dos 3 nanômetros e redesenhando os limites da física. A Apple, com sua família de chips M, provou que a arquitetura ARM pode dominar também computadores de alto desempenho com eficiência inigualável. Na corrida corporativa, aceleradores colossais como a NVIDIA H100 lideram o massivo treinamento das Inteligências Artificiais Generativas e LLMs, enquanto inovações de encapsulamento como os "Chiplets" 3D da AMD mantêm a Lei de Moore relevante.',
        image_2: 'images/litografia de 2nm.jpg',
        legend_image_2: 'Design Nanosheet de 2 nanômetros',
        impact: '🌍 Impacto histórico: Esta nova classe de chips fornece a infraestrutura essencial que alimenta toda a atual revolução da IA generativa, viabilizando pesquisas médicas de ponta, carros autônomos e descobertas científicas que antes eram inalcançáveis.'
    }
];

// ====== MODAL FUNCTIONS ======
function openModal(index) {
    const data = modalData[index];
    document.getElementById('modalEra').textContent = data.era;
    document.getElementById('modalTitle').textContent = data.title;

    const specsHTML = data.specs.map(s =>
        `<div class="spec-item"><div class="spec-key">${s.key}</div><div class="spec-val">${s.val}</div></div>`
    ).join('');

    document.getElementById('modalBody').innerHTML = `
    <div class="modal-section">
      <div class="modal-section-title">// VISÃO GERAL</div>
      <p class="modal-text">${data.intro}</p>
      <img src="${data.image_1}" alt="${data.legend_image_1}" class="modal-image"> 
      <label class="modal-legend">${data.legend_image_1}</label>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">// ESPECIFICAÇÕES</div>
      <div class="modal-specs">${specsHTML}</div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">// CONTEXTO HISTÓRICO</div>
      <p class="modal-text">${data.details}</p>
      <img src="${data.image_2}" alt="${data.legend_image_2}" class="modal-image"> 
      <label class="modal-legend">${data.legend_image_2}</label>
    </div>
    <div class="modal-section">
      <div class="modal-impact">${data.impact}</div>
    </div>
  `;

    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function closeModalOutside(e) {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

// Mobile menu
function toggleMobileMenu() {
    const links = document.querySelector('.nav-links');
    if (links.style.display === 'flex') {
        links.style.display = 'none';
    } else {
        links.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:rgba(4,6,16,0.98);padding:1rem 2rem;gap:1rem;border-bottom:1px solid rgba(0,245,255,0.15);';
    }
}