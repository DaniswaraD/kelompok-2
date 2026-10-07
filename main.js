const I = {
    building: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01"/>',
    factory: '<path d="M2 21V11l6 4v-4l6 4V6h4v15zM2 21h20"/>',
    truck: '<path d="M1 6h13v10H1zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    tag: '<path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6"/><circle cx="17" cy="9" r="2"/><path d="M17 14c3 0 4 2 4 5"/>',
    down: '<path d="M12 3v18M6 15l6 6 6-6"/>',
    scale: '<path d="M12 3v18M5 21h14M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z"/>',
    check: '<path d="M5 12l5 5 9-11"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10c0-2 6-2 6 0s-6 2-6 4 6 2 6 0"/>',
    heart: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 6-8 11-8 11z"/>'
};

const sv = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;
const ic = (n, c) => `<div class="ico ${c || ''}">${sv(n)}</div>`;
const btn = t => `<button class="btn rv" data-go>${t}${sv('arrow')}</button>`;
const head = (t, h) => `<div class="hd"><div class="hdl"><div class="tag rv"><i></i>${t}</div><h2 class="rv">${h}</h2></div></div>`;
const vcards = a => a.map(x => `<div class="card rv"><div class="vh">${ic(x[0])}<h3>${x[1]}</h3></div><p>${x[2]}</p></div>`).join('');
const hcards = (a, c) => a.map(x => `<div class="card hz rv ${c || ''}">${ic(x[0])}<div><h3>${x[1]}</h3><p>${x[2]}</p></div></div>`).join('');
const sl = (c, h) => `<section class="slide next ${c}">${h}</section>`;
const fl = {kp: '<b></b><i></i>', cu: '<b></b>', su: '<b></b><i></i>', cn: '<b></b><i></i><i></i><i></i><i></i>'};

const names = ['Nur Fadilah Rezkia', 'Joshua Rafael Saranga', 'Federer Leonardus Walter', 'Elma Aglucia Lupita Rahael', 'Salwa Dwi Anggaran', 'Maytreecya Balialo', 'Achmad Daniswara Javas Muchie'];

const S = [
    sl('', `<div class="hero"><div class="hl"><div class="tag rv"><i></i>Presentasi Ekonomi</div><h1 class="rv">Kelompok 2</h1><div class="sub rv">Sistem Ekonomi Komando</div><div class="lab rv">Anggota</div><div class="mem">${names.map(n => `<div class="chip rv"><span class="ci">${sv('user')}</span>${n}</div>`).join('')}</div>${btn('Continue')}</div><div class="orb rv"><div class="ring r1"><div class="nd">${sv('coin')}</div><div class="nd bt">${sv('truck')}</div></div><div class="ring r2"><div class="nd">${sv('factory')}</div><div class="nd bt">${sv('tag')}</div></div><div class="ring r3"><div class="nd">${sv('target')}</div><div class="nd bt">${sv('users')}</div></div><div class="core">${sv('building')}</div></div></div>`),
    sl('', `${head('Materi pertama', 'Pengertian Sistem Ekonomi <em>Komando</em>')}<div class="def"><div class="card big rv"><p>Sistem ekonomi komando adalah sistem yang menyerahkan seluruh kegiatan ekonomi, mulai dari produksi, distribusi, hingga penetapan harga, kepada perencanaan dan pengendalian pemerintah pusat. Masyarakat dan pelaku usaha bertugas menjalankan rencana yang sudah ditetapkan, bukan menentukan arah ekonominya sendiri.</p></div><div class="stack">${hcards([['factory', 'Produksi', 'Negara menentukan jenis dan jumlah barang yang harus dibuat.'], ['truck', 'Distribusi', 'Pemerintah mengatur arus barang dari pabrik hingga ke masyarakat.'], ['tag', 'Harga', 'Harga ditetapkan oleh negara, bukan oleh mekanisme pasar.']])}</div></div>${btn('Continue')}`),
    sl('', `${head('Materi kedua', 'Ciri-ciri Sistem Ekonomi <em>Komando</em>')}<div class="row c3">${vcards([['building', 'Dikuasai negara', 'Sumber daya alam, tanah, dan alat produksi utama dimiliki serta dikelola langsung oleh pemerintah.'], ['target', 'Perencanaan terpusat', 'Jenis, jumlah, dan target produksi ditentukan lewat rencana resmi yang disusun pemerintah pusat.'], ['tag', 'Harga ditetapkan', 'Harga barang dan jasa diatur oleh negara, bukan terbentuk dari permintaan dan penawaran.'], ['scale', 'Minim persaingan', 'Pelaku usaha mengikuti arahan negara, sehingga persaingan bebas hampir tidak terjadi.'], ['down', 'Keputusan top-down', 'Kebijakan ekonomi mengalir dari pemerintah pusat ke daerah, perusahaan, dan masyarakat.'], ['users', 'Peran swasta terbatas', 'Kepemilikan pribadi atas faktor produksi dan kebebasan membuka usaha sangat dibatasi.']])}</div>${btn('Continue')}`),
    sl('', `${head('Materi ketiga', 'Kelebihan Sistem Ekonomi <em>Komando</em>')}<div class="row c2">${hcards([['scale', 'Distribusi lebih merata', 'Barang kebutuhan pokok dapat dibagikan secara adil sehingga kesenjangan antar masyarakat dapat ditekan.'], ['tag', 'Harga relatif stabil', 'Karena harga dikendalikan pemerintah, gejolak pasar seperti kenaikan harga mendadak dapat diminimalkan.'], ['users', 'Pengangguran rendah', 'Negara mengatur lapangan kerja dan menempatkan tenaga kerja, sehingga hampir semua orang mendapat pekerjaan.'], ['bolt', 'Prioritas nasional cepat', 'Proyek besar seperti infrastruktur dan industri berat bisa digerakkan cepat karena keputusan terpusat.']])}</div>${btn('Continue')}`),
    sl('', `${head('Materi keempat', 'Kekurangan Sistem Ekonomi <em>Komando</em>')}<div class="row c2">${hcards([['bulb', 'Inovasi terhambat', 'Tanpa persaingan dan insentif keuntungan, kreativitas serta semangat berwirausaha sulit berkembang.'], ['clock', 'Kurang efisien', 'Birokrasi yang panjang dan rencana yang kaku membuat respons terhadap perubahan kebutuhan menjadi lambat.'], ['truck', 'Kelangkaan barang', 'Perencanaan yang keliru dapat memicu kekurangan barang, penimbunan, dan antrean panjang di masyarakat.'], ['lock', 'Kebebasan terbatas', 'Individu tidak bebas memilih jenis usaha, pekerjaan, maupun menentukan harga atas barang yang dibuat.']], 'neg')}</div>${btn('Continue')}`),
    sl('', `${head('Materi kelima', 'Negara Penganut Ekonomi <em>Komando</em>')}<div class="row c4">${[['Korea Utara', 'Rencana negara mengendalikan hampir seluruh sektor, dari pertanian sampai industri.', 'Masih menganut', '', 'kp'], ['Kuba', 'Pemerintah menguasai sektor utama ekonomi dan hanya membuka ruang kecil bagi usaha mandiri.', 'Masih menganut', '', 'cu'], ['Uni Soviet', 'Menjalankan rencana lima tahunan yang disusun negara untuk mengatur produksi nasional.', 'Hingga 1991', 'old', 'su'], ['Tiongkok', 'Menerapkan ekonomi terencana secara ketat sebelum reformasi pasar mulai berjalan.', 'Sebelum 1978', 'old', 'cn']].map(x => `<div class="card rv"><div class="flag f-${x[4]}">${fl[x[4]]}</div><h3>${x[0]}</h3><p>${x[1]}</p><span class="badge ${x[3]}">${x[2]}</span></div>`).join('')}</div>${btn('Continue')}`),
    sl('', `${head('Penutup', '<em>Kesimpulan</em>')}<div class="def"><div class="card big rv"><p>Sistem ekonomi komando menempatkan pemerintah pusat sebagai pengendali penuh kegiatan ekonomi, sehingga distribusi lebih merata dan harga cenderung stabil. Namun, minimnya persaingan dan kebebasan membuat inovasi terhambat serta efisiensi menurun, sehingga sistem ini jarang diterapkan secara utuh pada masa kini.</p></div><div class="stack">${hcards([['building', 'Terpusat', 'Semua keputusan ekonomi berada di tangan negara.'], ['check', 'Kelebihan', 'Pemerataan, harga stabil, dan arah pembangunan jelas.'], ['x', 'Kekurangan', 'Inovasi rendah, birokrasi panjang, kebebasan terbatas.']])}</div></div>${btn('Continue')}`),
    sl('end', `<div class="halo" style="--h:0"></div><div class="halo" style="--h:1"></div><div class="halo" style="--h:2"></div><div class="rv hi">${ic('heart', 'big-ico')}</div><h1 class="rv">Terima Kasih</h1><div class="sub rv">Kelompok 2 - Sistem Ekonomi Komando</div>${btn('Ulangi presentasi')}`)
];

const app = document.getElementById('app');
app.innerHTML = S.join('');
document.getElementById('lg').innerHTML = sv('building');

const sd = [...app.children];
const dt = document.getElementById('dt');
dt.innerHTML = sd.map(() => '<i class="dot"></i>').join('');
const dots = [...dt.children];

for (let k = 0; k < 14; k++) {
    const p = document.createElement('i');
    const s = 4 + Math.random() * 10;
    p.className = 'p';
    p.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-duration:${12 + Math.random() * 16}s;animation-delay:${-Math.random() * 20}s`;
    document.querySelector('.bg').appendChild(p);
}

const sel = 'h1,h2,h3,p,.sub,.lab,.tag,.chip,.badge,.btn';

function split(el) {
    if (el.matches('.btn,.chip,.tag')) {
        [...el.childNodes].forEach(q => {
            if (q.nodeType === 3 && q.textContent.trim()) {
                const w = document.createElement('span');
                q.replaceWith(w);
                w.append(q);
            }
        });
    }
    [...el.childNodes].forEach(function f(nd) {
        if (nd.nodeType === 3) {
            const fr = document.createDocumentFragment();
            nd.textContent.split(/(\s+)/).forEach(part => {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                    fr.append(' ');
                    return;
                }
                const w = document.createElement('span');
                w.className = 'w';
                [...part].forEach(ch => {
                    const c = document.createElement('span');
                    c.className = 'c';
                    c.style.setProperty('--r', (Math.random() * 2 - 1).toFixed(2));
                    c.textContent = ch;
                    w.append(c);
                });
                fr.append(w);
            });
            nd.replaceWith(fr);
        } else {
            [...nd.childNodes].forEach(f);
        }
    });
}

function timing(rv) {
    const list = [...(rv.matches(sel) ? [rv] : []), ...rv.querySelectorAll(sel)].filter(e => e.querySelector('.c'));
    let off = 0;
    list.forEach(el => {
        const cs = el.querySelectorAll('.c');
        const n = cs.length;
        const isP = el.matches('p');
        const isH = el.matches('h1,h2,.sub');
        const cap = isP ? (rv.matches('.big') ? 3600 : 2000) : isH ? 1500 : 900;
        const per = isP ? 18 : isH ? 55 : 38;
        const tot = Math.min(cap, n * per);
        const st = tot / n;
        el.style.setProperty('--fx', 'f' + (el.matches('h1') ? 1 : el.matches('h2') ? 0 : el.matches('h3') ? 2 : isP ? 3 : el.matches('.sub') ? 5 : 4));
        el.classList.toggle('wv', el.matches('h1,h2,.sub'));
        cs.forEach((c, i) => {
            c.style.setProperty('--k', i);
            c.style.setProperty('--dl', `calc(650ms + var(--j,0)*80ms + ${(off + i * st).toFixed(1)}ms)`);
        });
        off += tot + (isP ? 0 : 90);
    });
    rv._dur = Math.min(off, 600);
}

sd.forEach((s, n) => {
    s.classList.add('t' + n % 6);
    s.querySelectorAll('.rv').forEach((e, i) => {
        e.style.setProperty('--i', i);
        e.style.setProperty('--d', i % 2 ? 1 : -1);
    });
    s.querySelectorAll(sel).forEach(split);
    s.querySelectorAll('.rv').forEach(timing);
});

let tm = [];
const clr = () => {
    tm.forEach(clearTimeout);
    tm = [];
};

const rk = k => k[0] == 'a' ? 0 : k[0] == 'b' ? 1 : k[0] == 'c' ? 2 : k[0] == 'z' ? 9 : 3;
const key = (e, i) => e.closest('.hd') || e.matches('.tag,h1,.sub,.hi') ? 'a' : e.matches('.btn') ? 'z' : e.matches('.orb') ? 'b' : e.matches('.lab,.chip') ? 'c' : 'k' + i;

function plan(s) {
    const g = {};
    s.querySelectorAll('.rv').forEach((e, i) => {
        const k = key(e, i);
        (g[k] = g[k] || []).push(e);
    });
    const o = [];
    Object.keys(g).sort((a, b) => rk(a) - rk(b)).forEach((k, x) => {
        const els = g[k];
        const d = Math.max(0, ...els.map(e => e._dur || 0));
        const tx = els.some(e => e.querySelector('.c'));
        const prev = o[x - 1];
        const at = x === 0 ? 300 : x === 1 ? o[0].at + 750 : k[0] === 'k' && prev.k[0] === 'k' ? prev.at + 200 : prev.end;
        const st = els.some(e => e.matches('.chip')) ? 200 : 120;
        o.push({k, els, at, end: at + (tx ? 350 + (els.length - 1) * st + d + 600 : 300)});
    });
    o.forEach(u => tm.push(setTimeout(() => u.els.forEach((e, j) => {
        e.style.setProperty('--j', j);
        e.classList.add('in');
    }), u.at)));
}

let cur = -1;
let busy = false;

function go(n) {
    cur = n;
    clr();
    sd.forEach((s, i) => {
        if (i >= n) s.querySelectorAll('.in').forEach(e => e.classList.remove('in'));
    });
    sd.forEach((s, i) => {
        s.classList.toggle('active', i === n);
        s.classList.toggle('gone', i < n);
        s.classList.toggle('next', i > n);
    });
    dots.forEach((d, i) => d.classList.toggle('on', i === n));
    document.querySelector('.bg').style.setProperty('--s', n);
    document.documentElement.style.setProperty('--pg', (n + 1) / sd.length);
    scr(document.getElementById('cn'), String(n + 1).padStart(2, '0') + ' / ' + String(sd.length).padStart(2, '0'));
    plan(sd[n]);
}

function step() {
    if (busy) return;
    busy = true;
    sweep();
    clr();
    const c = sd[cur];
    const last = cur >= sd.length - 1;
    c.classList.remove('active');
    c.classList.add('gone');
    const n = c.querySelectorAll('.rv').length;
    setTimeout(() => {
        if (last) {
            sd.forEach(x => {
                x.classList.remove('active', 'gone');
                x.classList.add('next');
                x.querySelectorAll('.in').forEach(e => e.classList.remove('in'));
            });
            void app.offsetWidth;
            go(0);
        } else {
            go(cur + 1);
        }
        setTimeout(() => busy = false, 900);
    }, (n - 1) * 55 + 1200);
}

document.addEventListener('click', e => {
    const b = e.target.closest('[data-go]');
    if (!b || busy) return;
    const r = b.getBoundingClientRect();
    const o = document.createElement('i');
    o.className = 'rip';
    o.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px`;
    document.body.appendChild(o);
    setTimeout(() => o.remove(), 1600);
    step();
});

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        step();
    }
});

let mx = innerWidth / 2;
let my = innerHeight / 2;
let hv = null;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    const c = e.target.closest('.card');
    if (hv && hv !== c) hv._t = [0, 0];
    hv = c;
    if (c) {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', e.clientX - r.left + 'px');
        c.style.setProperty('--my', e.clientY - r.top + 'px');
        c._t = [(e.clientX - r.left) / r.width - .5, (e.clientY - r.top) / r.height - .5];
        c._u = c._u || [0, 0];
        tilted.add(c);
    }
});

app.querySelectorAll('svg path,svg circle,svg rect').forEach(p => p.setAttribute('pathLength', 1));

for (let k = 0; k < 12; k++) {
    const p = document.createElement('i');
    const s = 14 + Math.random() * 30;
    p.className = 'sp ' + (k % 2 ? 'a' : 'b');
    p.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-duration:${16 + Math.random() * 18}s,${8 + Math.random() * 12}s;animation-delay:${-Math.random() * 20}s,0s`;
    document.querySelector('.bg').appendChild(p);
}

const curtain = document.createElement('div');
curtain.className = 'cur';
curtain.innerHTML = Array.from({length: 8}, (_, i) => `<i style="--i:${i}"></i>`).join('');
document.body.appendChild(curtain);

function sweep() {
    curtain.classList.remove('run');
    void curtain.offsetWidth;
    curtain.classList.add('run');
}

let sid;

function scr(el, t) {
    clearInterval(sid);
    let f = 0;
    sid = setInterval(() => {
        el.textContent = [...t].map((ch, i) => /\d/.test(ch) && f < 6 + i * 2 ? Math.floor(Math.random() * 10) : ch).join('');
        if (++f > 20) clearInterval(sid);
    }, 45);
}

const gl = document.createElement('div');
gl.className = 'gl';
document.querySelector('.bg').after(gl);

let gx = mx;
let gy = my;
const tilted = new Set();

(function tick() {
    gx += (mx - gx) * .12;
    gy += (my - gy) * .12;
    gl.style.transform = `translate3d(${gx}px,${gy}px,0)`;
    tilted.forEach(c => {
        const t = c._t;
        const u = c._u;
        u[0] += (t[0] - u[0]) * .14;
        u[1] += (t[1] - u[1]) * .14;
        const a = Math.hypot(u[0], u[1]) * 16;
        c.style.rotate = `${-u[1]} ${u[0]} 0 ${a}deg`;
        if (hv !== c && a < .03) {
            c.style.rotate = '';
            tilted.delete(c);
        }
    });
    requestAnimationFrame(tick);
})();

setTimeout(() => go(0), 200);
