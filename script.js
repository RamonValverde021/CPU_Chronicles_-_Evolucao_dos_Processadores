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
        intro: 'Os primeiros computadores eletrônicos usavam válvulas termiônicas (tubos a vácuo) como elemento de chaveamento. Essas válvulas funcionavam como interruptores eletrônicos, controlando o fluxo de elétrons no vácuo. O resultado eram máquinas enormes, quentes, lentas por padrão atual, mas revolucionárias para a época.',
        specs: [
            { key: 'EXEMPLO', val: 'ENIAC (1946)' },
            { key: 'VÁLVULAS', val: '17.468 tubos' },
            { key: 'TAMANHO', val: '167 m² / 27 ton' },
            { key: 'VELOCIDADE', val: '5.000 op/seg' },
            { key: 'ENERGIA', val: '150.000 W' },
            { key: 'MEMÓRIA', val: '~200 bytes' },
        ],
        details: 'O ENIAC (Electronic Numerical Integrator and Computer), construído na Universidade da Pennsylvania, foi o primeiro computador de propósito geral totalmente eletrônico. Projetado para calcular tabelas de artilharia para o Exército dos EUA, ele terminava a guerra antes de ser concluído. Cada válvula era frágil e gerava calor — uma falhava a cada dois dias em média. Programar o ENIAC exigia reconectar fisicamente milhares de cabos.',
        impact: '🌍 Impacto histórico: Os computadores de válvulas abriram a era digital, provando que máquinas eletrônicas podiam resolver problemas matemáticos complexos. Sem eles, não existiriam os transistores, chips ou dispositivos modernos.'
    },
    {
        era: '1956 — 1963',
        title: 'Era dos Transistores — Segunda Geração',
        intro: 'Inventado nos Bell Labs em 1947 por Shockley, Bardeen e Brattain, o transistor demorou alguns anos para substituir as válvulas nos computadores. Feito de materiais semicondutores (germânio e silício), era menor, mais rápido, mais confiável e consumia muito menos energia.',
        specs: [
            { key: 'EXEMPLO', val: 'IBM 1401 (1959)' },
            { key: 'TECNOLOGIA', val: 'Germânio / Silício' },
            { key: 'TAMANHO', val: 'Alguns cm' },
            { key: 'VELOCIDADE', val: '193.000 op/seg' },
            { key: 'ENERGIA', val: '∼5.000 W' },
            { key: 'MEMÓRIA', val: '16 KB (core)' },
        ],
        details: 'O IBM 1401 vendeu mais de 10.000 unidades — o primeiro computador de massa da história. Empresas podiam finalmente alugar tempo de processamento. Os transistores eram montados à mão em placas de circuito. A linguagem FORTRAN surgiu nessa era, permitindo programar em linguagem mais próxima da matemática.',
        impact: '🌍 Impacto histórico: A transição para transistores reduziu o tamanho dos computadores de salas inteiras para armários, viabilizando seu uso empresarial e iniciando a revolução dos mainframes.'
    },
    {
        era: '1964 — 1971',
        title: 'Circuitos Integrados — Terceira Geração',
        intro: 'Jack Kilby (Texas Instruments) e Robert Noyce (Fairchild) independentemente inventaram o circuito integrado (CI) em 1958-59. A ideia revolucionária: colocar múltiplos transistores, resistores e capacitores em um único pedaço de semicondutor — o "chip".',
        specs: [
            { key: 'EXEMPLO', val: 'IBM System/360' },
            { key: 'TRANSISTORES', val: '∼100 por chip' },
            { key: 'TAMANHO', val: 'Milímetros' },
            { key: 'VELOCIDADE', val: 'MHz (faixas)' },
            { key: 'ENERGIA', val: '∼1.000 W (sistema)' },
            { key: 'MEMÓRIA', val: 'MB (primeiros)' },
        ],
        details: 'O IBM System/360 foi o primeiro computador projetado como família — software compatível entre modelos de diferentes preços e performance. Isso revolucionou a indústria. Os CIs permitiram criar calculadoras de mesa e minicomputadores. A NASA usou CIs no Apollo Guidance Computer — o computador que levou o homem à Lua.',
        impact: '🌍 Impacto histórico: Os circuitos integrados tornaram os computadores economicamente viáveis para universidades e laboratórios de pesquisa, democratizando o acesso e acelerando o desenvolvimento científico.'
    },
    {
        era: '1971 — 1999',
        title: 'Microprocessadores — Quarta Geração',
        intro: 'Em 1971, a Intel lançou o 4004 — toda a CPU em um único chip de 12mm². Foi encomendado pela empresa japonesa Busicom para calculadoras, mas Noyce e Hoff perceberam seu potencial universal. A era do computador pessoal havia começado.',
        specs: [
            { key: 'LANÇAMENTO', val: 'Intel 4004 (1971)' },
            { key: 'TRANSISTORES', val: '2.300' },
            { key: 'PROCESSO', val: '10 micrômetros' },
            { key: 'CLOCK', val: '740 kHz' },
            { key: 'BARRAMENTO', val: '4 bits' },
            { key: 'CUSTO', val: '$300 (1971)' },
        ],
        details: 'Da linha 4004/8008/8080 nasceu o 8086 (1978), que criou a arquitetura x86 — ainda dominante em PCs e servidores. O Apple II e o IBM PC popularizaram o computador pessoal. O Intel Pentium (1993) chegou a 3,1 milhões de transistores. O Windows 95 e a internet transformaram o PC em eletrodoméstico.',
        impact: '🌍 Impacto histórico: O microprocessador colocou poder computacional nas mãos de indivíduos comuns, desencadeando a revolução do PC, a internet e a economia digital do século XXI.'
    },
    {
        era: '2000 — 2015',
        title: 'Processadores Multicore — Quinta Geração',
        intro: 'Após décadas de aumento de clock, os limites físicos frearam o desenvolvimento. O consumo de energia e geração de calor tornaram inviável aumentar a frequência. A solução: múltiplos núcleos de processamento em um único chip — paralelismo massivo.',
        specs: [
            { key: 'PIONEIRO', val: 'IBM POWER4 (2001)' },
            { key: 'PC (2005)', val: 'Intel Core Duo' },
            { key: 'MAX CORES', val: 'AMD EPYC 128c' },
            { key: 'PROCESSO', val: '14nm → 5nm' },
            { key: 'TRANSISTORES', val: 'Bilhões' },
            { key: 'CLOCK', val: '3-5 GHz' },
        ],
        details: 'A era multicore exigiu reprogramação de software para paralelismo. GPUs (unidades de processamento gráfico) emergiram como aceleradores paralelos massivos. O Intel Core 2 Duo (2006) popularizou o dual-core. A fusão AMD-ATI e nVidia CUDA transformaram GPUs em supercomputadores pessoais. Smartphones com ARM multicore conectaram 5 bilhões de pessoas.',
        impact: '🌍 Impacto histórico: O paradigma multicore possibilitou aplicações impensáveis: edição de vídeo 4K no notebook, gaming fotorrealista, aprendizado de máquina e a explosão dos smartphones.'
    },
    {
        era: '2016 — PRESENTE',
        title: 'IA & Chips Ultra Modernos — Sexta Geração',
        intro: 'A crescente demanda por aprendizado de máquina redesenhou a arquitetura dos chips. GPUs de dados center, TPUs customizadas e NPUs integradas processam trilhões de operações por segundo. O nó de 3nm e 2nm redefine os limites do silício.',
        specs: [
            { key: 'EXEMPLO', val: 'Apple M4 Ultra' },
            { key: 'TRANSISTORES', val: '92 bilhões' },
            { key: 'PROCESSO', val: 'TSMC 3nm' },
            { key: 'CPU CORES', val: '32 núcleos' },
            { key: 'GPU CORES', val: '80 núcleos' },
            { key: 'LARGURA MEMÓRIA', val: '819 GB/s' },
        ],
        details: 'O Apple Silicon (M1 a M4) demonstrou a superioridade de chips ARM personalizados. O NVIDIA H100 (80 bilhões de transistores, processo 4nm) lidera o treinamento de LLMs. O Google TPU v5p oferece 459 TFLOPS. A litografia EUV (Extreme Ultraviolet) permite gravar features de 2nm. O AMD MI300X combina CPU e GPU em chiplet 3D.',
        impact: '🌍 Impacto histórico: Esses chips são a infraestrutura que alimenta a IA generativa, veículos autônomos, medicina de precisão e simulações científicas que antes exigiriam supercomputadores inteiros.'
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
    </div>
    <div class="modal-section">
      <div class="modal-section-title">// ESPECIFICAÇÕES</div>
      <div class="modal-specs">${specsHTML}</div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">// CONTEXTO HISTÓRICO</div>
      <p class="modal-text">${data.details}</p>
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