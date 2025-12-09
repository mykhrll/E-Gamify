/* --- DATABASE SOAL --- */
const defaultQuestions = [
    [ // Level 1
        { q: "Hasil dari 5 x 5 adalah?", a: ["10", "20", "25", "55"], c: 2 },
        { q: "Lambang sila pertama Pancasila?", a: ["Bintang", "Pohon", "Rantai", "Padi"], c: 0 },
        { q: "Warna bendera Indonesia?", a: ["Merah Putih", "Putih Merah", "Biru", "Kuning"], c: 0 },
        { q: "Ibu kota Jawa Barat?", a: ["Bandung", "Surabaya", "Jakarta", "Medan"], c: 0 },
        { q: "Hewan berkaki empat?", a: ["Ayam", "Sapi", "Bebek", "Ular"], c: 1 }
    ],
    [ // Level 2
        { q: "Alat pernapasan ikan?", a: ["Paru-paru", "Insang", "Trakea", "Kulit"], c: 1 },
        { q: "30 dibagi 2 adalah?", a: ["10", "15", "12", "14"], c: 1 },
        { q: "Bahasa Inggris 'Buku'?", a: ["Book", "Pen", "Bag", "Door"], c: 0 },
        { q: "Matahari terbit dari?", a: ["Barat", "Timur", "Selatan", "Utara"], c: 1 },
        { q: "Presiden pertama RI?", a: ["Soeharto", "Habibie", "Soekarno", "Jokowi"], c: 2 }
    ],
    [ // Level 3
        { q: "Simbol kimia Air?", a: ["H2O", "O2", "CO2", "H2"], c: 0 },
        { q: "Candi terbesar di Indonesia?", a: ["Prambanan", "Borobudur", "Mendut", "Penataran"], c: 1 },
        { q: "Hewan pemakan daging disebut?", a: ["Herbivora", "Karnivora", "Omnivora", "Insektivora"], c: 1 },
        { q: "Lagu kebangsaan Indonesia?", a: ["Indonesia Raya", "Padamu Negeri", "Halo Bandung", "Garuda"], c: 0 },
        { q: "1 Jam berapa menit?", a: ["30", "60", "100", "50"], c: 1 }
    ],
    [ // Level 4
        { q: "Lawan kata 'Besar'?", a: ["Kecil", "Luas", "Panjang", "Tinggi"], c: 0 },
        { q: "Alat untuk mengetik?", a: ["Monitor", "Keyboard", "Mouse", "Speaker"], c: 1 },
        { q: "Bahan utama membuat roti?", a: ["Nasi", "Gandum", "Jagung", "Ubi"], c: 1 },
        { q: "Kota Pahlawan?", a: ["Semarang", "Surabaya", "Bandung", "Medan"], c: 1 },
        { q: "Bahasa Inggris 'Merah'?", a: ["Blue", "Green", "Red", "Yellow"], c: 2 }
    ],
    [ // Level 5
        { q: "Bapak Pendidikan Nasional?", a: ["Ki Hajar Dewantara", "Kartini", "Soekarno", "Hatta"], c: 0 },
        { q: "Rumah adat Sumatera Barat?", a: ["Joglo", "Gadang", "Honai", "Tongkonan"], c: 1 },
        { q: "Mata uang Indonesia?", a: ["Dollar", "Ringgit", "Rupiah", "Yen"], c: 2 },
        { q: "Jumlah provinsi di Jawa?", a: ["4", "5", "6", "7"], c: 2 },
        { q: "Ibukota negara Jepang?", a: ["Seoul", "Beijing", "Tokyo", "Bangkok"], c: 2 }
    ]
];

// Soal Sulit untuk Emergency
const hardQuestions = [
    { q: "Rumus Diskriminan persamaan kuadrat ax²+bx+c=0?", a: ["b²-4ac", "b²-ac", "4ac-b²", "b²+4ac"], c: 0 },
    { q: "Benua terluas di dunia adalah?", a: ["Afrika", "Amerika", "Asia", "Eropa"], c: 2 },
    { q: "Siapa penemu benua Amerika?", a: ["Columbus", "Magelhaens", "Vasco da Gama", "Cornelis"], c: 0 },
    { q: "Negara kincir angin adalah?", a: ["Jerman", "Belanda", "Inggris", "Perancis"], c: 1 },
    { q: "Organel sel tempat respirasi?", a: ["Ribosom", "Mitokondria", "Lisosom", "Vakuola"], c: 1 }
];

/* --- AUDIO MANAGER --- */
const audioManager = {
    initialized: false,
    init() {
        if(this.initialized) return;
        this.initialized = true;
        // Preload sounds
        ['bgm-menu', 'bgm-game', 'sfx-jump', 'sfx-coin', 'sfx-wrong', 'sfx-win', 'sfx-hit'].forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                el.volume = 0;
                el.play().then(() => {
                    el.pause();
                    el.currentTime = 0;
                    if(id.includes('bgm')) el.volume = 0.4;
                    else el.volume = 0.8;
                }).catch(e => {});
            }
        });
    },
    
    playBGM(type) {
        if(!this.initialized) return;
        document.getElementById('bgm-menu').pause();
        document.getElementById('bgm-game').pause();
        
        const target = document.getElementById(type === 'menu' ? 'bgm-menu' : 'bgm-game');
        target.currentTime = 0;
        target.play().catch(e => console.log("BGM Error", e));
    },

    playSFX(id) {
        if(!this.initialized) return;
        const sfx = document.getElementById(id);
        if(sfx) {
            sfx.currentTime = 0;
            sfx.play().catch(e => {});
        }
    }
};

/* --- PARTICLE SYSTEM --- */
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.life = 1.0; // Opacity
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.02;
    }
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

/* --- APP LOGIC --- */
const app = {
    currentUser: null,
    questions: JSON.parse(localStorage.getItem('egamify_questions')) || defaultQuestions,
    
    init() {
        if(localStorage.getItem('egamify_user')) {
            this.currentUser = JSON.parse(localStorage.getItem('egamify_user'));
            this.showScreen('screen-menu');
            this.updateMenuUI();
            document.body.addEventListener('click', () => audioManager.init(), {once:true});
        } else {
            this.showScreen('screen-login');
        }

        document.getElementById('form-siswa').addEventListener('submit', (e) => {
            e.preventDefault();
            audioManager.init();
            this.loginSiswa();
        });

        document.getElementById('form-guru').addEventListener('submit', (e) => {
            e.preventDefault();
            audioManager.init();
            this.loginGuru();
        });
    },

    switchLoginTab(role) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.login-form').forEach(f => f.classList.remove('active'));
        if (role === 'siswa') {
            document.querySelector('.tab-btn:first-child').classList.add('active');
            document.getElementById('form-siswa').classList.add('active');
        } else {
            document.querySelector('.tab-btn:last-child').classList.add('active');
            document.getElementById('form-guru').classList.add('active');
        }
    },

    loginSiswa() {
        const nisn = document.getElementById('nisn').value;
        const nama = document.getElementById('nama-siswa').value;
        
        this.currentUser = {
            role: 'siswa',
            id: nisn,
            name: nama,
            score: 0,
            levelProgress: [0,0,0,0,0] 
        };
        
        const saved = localStorage.getItem('egamify_student_' + nisn);
        if(saved) this.currentUser = JSON.parse(saved);
        else this.currentUser.levelProgress[0] = -1; 

        this.saveUser();
        this.showScreen('screen-menu');
        this.updateMenuUI();
        setTimeout(() => audioManager.playBGM('menu'), 500);
    },

    loginGuru() {
        this.showScreen('screen-admin');
        admin.loadQuestions();
    },

    saveUser() {
        if(this.currentUser && this.currentUser.role === 'siswa') {
            localStorage.setItem('egamify_student_' + this.currentUser.id, JSON.stringify(this.currentUser));
            localStorage.setItem('egamify_user', JSON.stringify(this.currentUser));
        }
    },

    logout() {
        localStorage.removeItem('egamify_user');
        location.reload();
    },

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    showProfile() {
        if(!this.currentUser) return;
        document.getElementById('prof-name').innerText = this.currentUser.name;
        document.getElementById('prof-nisn').innerText = this.currentUser.id;
        document.getElementById('prof-score').innerText = this.currentUser.score;
        const totalStars = this.currentUser.levelProgress.reduce((a, b) => (b > 0 ? a + b : a), 0);
        document.getElementById('prof-stars').innerText = totalStars;
        this.renderBadges(document.getElementById('prof-badges'));
        this.showScreen('screen-profile');
    },

    updateMenuUI() {
        if(!this.currentUser) return;
        document.getElementById('display-nama').innerText = this.currentUser.name;
        const totalStars = this.currentUser.levelProgress.reduce((a, b) => (b > 0 ? a + b : a), 0);
        document.getElementById('total-stars').innerText = totalStars;
        document.getElementById('total-score').innerText = this.currentUser.score;

        const container = document.getElementById('levels-list');
        container.innerHTML = '';
        const subjects = ["Matematika", "IPA", "B. Inggris", "B. Indo", "PKN"];

        this.currentUser.levelProgress.forEach((status, idx) => {
            const node = document.createElement('div');
            let className = 'locked';
            let label = '🔒';
            if (status === -1) { className = 'unlocked'; label = '▶'; }
            else if (status > 0) { className = 'completed'; label = '⭐'.repeat(status); }

            node.className = `level-node ${className}`;
            node.innerHTML = `<span>${idx + 1}</span><div class="level-info">${subjects[idx]}<br><small>${label}</small></div>`;
            if(className !== 'locked') node.onclick = () => game.startLevel(idx);
            container.appendChild(node);
        });
        this.renderBadges(document.getElementById('badge-mini-container'));
    },

    renderBadges(container) {
        container.innerHTML = '';
        const badges = [
            { id: 1, icon: '🎓', req: 1, name: "Sarjana Cilik" },
            { id: 3, icon: '🔥', req: 3, name: "Pejuang" },
            { id: 5, icon: '👑', req: 5, name: "Sang Juara" }
        ];
        const levelsCompleted = this.currentUser.levelProgress.filter(s => s > 0).length;
        badges.forEach(b => {
            const div = document.createElement('div');
            const earned = levelsCompleted >= b.req;
            div.className = `badge-item ${earned ? 'earned' : ''}`;
            div.innerHTML = b.icon;
            div.title = earned ? b.name : "Terkunci";
            container.appendChild(div);
        });
    },

    showLeaderboard() {
        this.showScreen('screen-leaderboard');
        const list = document.getElementById('leaderboard-list');
        const data = [
            { name: "Andi Wijaya", score: 1500 },
            { name: "Siti Aisah", score: 1250 },
            { name: this.currentUser.name, score: this.currentUser.score },
            { name: "Budi Santoso", score: 800 },
            { name: "Citra Lestari", score: 600 }
        ].sort((a,b) => b.score - a.score);
        list.innerHTML = data.map((d, i) => `
            <div class="lb-item">
                <span class="lb-rank">#${i+1}</span>
                <span>${d.name}</span>
                <span class="lb-score">${d.score} Poin</span>
            </div>
        `).join('');
    }
};

/* --- ADMIN --- */
const admin = {
    currentLevelEdit: 0,
    loadQuestions() {
        this.currentLevelEdit = document.getElementById('admin-level-select').value;
        const qList = app.questions[this.currentLevelEdit];
        const container = document.getElementById('admin-questions-list');
        container.innerHTML = '';
        qList.forEach((q, idx) => {
            const div = document.createElement('div');
            div.className = 'q-edit-item';
            div.innerHTML = `
                <b>Soal ${idx+1}:</b> <input type="text" value="${q.q}" id="q-${idx}-text" style="width:100%"><br>
                Jawaban Benar (0-3): <input type="number" value="${q.c}" id="q-${idx}-correct" style="width:50px"><br>
                Opsi: ${q.a.map((opt, oIdx) => `<input type="text" value="${opt}" id="q-${idx}-o${oIdx}" style="width:45%">`).join(' ')}
            `;
            container.appendChild(div);
        });
    },
    saveChanges() {
        const qList = app.questions[this.currentLevelEdit];
        for(let i=0; i<5; i++) {
            qList[i].q = document.getElementById(`q-${i}-text`).value;
            qList[i].c = parseInt(document.getElementById(`q-${i}-correct`).value);
            qList[i].a[0] = document.getElementById(`q-${i}-o0`).value;
            qList[i].a[1] = document.getElementById(`q-${i}-o1`).value;
            qList[i].a[2] = document.getElementById(`q-${i}-o2`).value;
            qList[i].a[3] = document.getElementById(`q-${i}-o3`).value;
        }
        localStorage.setItem('egamify_questions', JSON.stringify(app.questions));
        alert("Disimpan!");
    }
};

/* --- GAME ENGINE --- */
const game = {
    canvas: document.getElementById('gameCanvas'),
    ctx: null,
    active: false,
    paused: false,
    levelIndex: 0,
    questions: [],
    
    player: { 
        x: 50, y: 0, w: 30, h: 40, vx: 0, vy: 0, 
        speed: 5, jumpPower: -13, grounded: false,
        maxJumps: 2, jumpCount: 0,
        lives: 3, scaleY: 1 // For Animation
    },
    platforms: [],
    questionBlocks: [],
    obstacles: [],
    particles: [],
    camera: { x: 0, y: 0 },
    score: 0,
    correctCount: 0,
    worldBaseY: 0,
    
    init() {
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.keys = {};
        window.addEventListener('keydown', e => {
            this.keys[e.key] = true;
            if(this.active && !this.paused) {
                if (['ArrowUp', 'w', ' ', 'W'].includes(e.key)) this.tryJump();
            }
        });
        window.addEventListener('keyup', e => this.keys[e.key] = false);

        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');

        btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys['ArrowLeft'] = true; });
        btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); this.keys['ArrowLeft'] = false; });
        btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys['ArrowRight'] = true; });
        btnRight.addEventListener('touchend', (e) => { e.preventDefault(); this.keys['ArrowRight'] = false; });
        btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); this.tryJump(); });
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    tryJump() {
        if (this.player.jumpCount < this.player.maxJumps) {
            this.player.vy = this.player.jumpPower;
            this.player.jumpCount++;
            this.player.grounded = false;
            this.player.scaleY = 1.3; // Stretch animation
            audioManager.playSFX('sfx-jump');
            this.createParticles(this.player.x + this.player.w/2, this.player.y + this.player.h, '#fff', 5);
        }
    },

    startLevel(lvlIdx) {
        this.levelIndex = lvlIdx;
        this.questions = [...app.questions[lvlIdx]];
        this.score = 0;
        this.correctCount = 0;
        this.player.lives = 3;
        this.active = true;
        this.paused = false;

        this.generateLevel();
        this.respawnPlayer();
        
        app.showScreen('screen-game');
        this.updateUI();
        audioManager.playBGM('game');
        requestAnimationFrame(() => this.loop());
    },

    generateLevel() {
        this.platforms = [];
        this.questionBlocks = [];
        this.obstacles = [];
        
        let startY = this.canvas.height - 100;
        this.worldBaseY = startY;

        // Lantai Dasar
        this.platforms.push({x: -100, y: startY, w: 1000, h: 50}); 

        let currentY = startY;
        let currentX = 50;

        for(let i=0; i<5; i++) {
            currentY -= 180;
            // --- ACAK POSISI PIJAKAN (RANDOM LEVEL) ---
            // Acak posisi X agar tidak monoton
            let randX = Math.random() * (this.canvas.width - 200) + 50;
            // Pastikan tetap dalam batas layar
            let targetX = Math.max(50, Math.min(randX, this.canvas.width - 200));

            // Platform Transisi (Agar bisa dipanjat)
            let midX = (currentX + targetX) / 2;
            let midY = currentY + 90;
            this.platforms.push({x: midX, y: midY, w: 120, h: 20});

            if (i > 0 && Math.random() < 0.3) {
                this.obstacles.push({x: midX + 40, y: midY - 15, w: 40, h: 15});
            }

            // Platform Utama
            this.platforms.push({x: targetX, y: currentY, w: 200, h: 20});
            this.questionBlocks.push({
                x: targetX + 80, y: currentY - 50, w: 40, h: 40, 
                active: true, qIndex: i 
            });

            currentX = targetX;
        }

        this.finishY = currentY - 150;
        this.platforms.push({x: currentX - 50, y: this.finishY + 50, w: 200, h: 20});
    },

    respawnPlayer() {
        this.player.x = 50;
        this.player.y = this.worldBaseY - 100;
        this.player.vx = 0;
        this.player.vy = 0;
    },

    createParticles(x, y, color, count) {
        for(let i=0; i<count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    },

    loop() {
        if(!this.active) return;
        if(!this.paused) {
            this.update();
            this.draw();
        }
        requestAnimationFrame(() => this.loop());
    },

    update() {
        const p = this.player;
        
        // Physics
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) p.vx = p.speed;
        else if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) p.vx = -p.speed;
        else p.vx = 0;

        p.x += p.vx;
        p.vy += 0.6;
        p.y += p.vy;

        // Animation Squash Recovery
        if(p.scaleY > 1) p.scaleY -= 0.05;
        if(p.scaleY < 1) p.scaleY += 0.05;

        // Screen Boundaries
        if(p.x < 0) p.x = 0;
        if(p.x > this.canvas.width - p.w) p.x = this.canvas.width - p.w;

        // --- BETTER COLLISION DETECTION ---
        p.grounded = false;
        for(let plat of this.platforms) {
            // Cek horizontal overlap
            if (p.x < plat.x + plat.w && p.x + p.w > plat.x) {
                // Cek vertical overlap: 
                // Kaki pemain harus berada di sekitar permukaan platform
                // p.y + p.h (kaki sekarang) >= plat.y (permukaan)
                // p.y + p.h - p.vy (kaki frame sebelumnya) <= plat.y (sebelumnya di atas)
                if (p.y + p.h >= plat.y && p.y + p.h - p.vy <= plat.y + 10) { 
                    if (p.vy >= 0) { // Hanya jika sedang jatuh
                        p.grounded = true;
                        p.jumpCount = 0;
                        p.vy = 0;
                        p.y = plat.y - p.h; // Snap ke atas
                        if(p.scaleY > 0.8 && p.vy > 5) p.scaleY = 0.8; // Squash effect on land
                    }
                }
            }
        }

        // Obstacles
        for(let obs of this.obstacles) {
            if (p.x < obs.x + obs.w && p.x + p.w > obs.x &&
                p.y < obs.y + obs.h && p.y + p.h > obs.y) {
                this.takeDamage();
            }
        }

        if (p.y > this.worldBaseY + 300) {
            this.takeDamage();
        }

        // Question Boxes
        for(let blk of this.questionBlocks) {
            if(blk.active) {
                const hitX = p.x < blk.x + blk.w + 15 && p.x + p.w > blk.x - 15;
                const hitY = p.y < blk.y + blk.h && p.y > blk.y;
                if(hitX && hitY) {
                     p.vy = 2; 
                     this.createParticles(blk.x + blk.w/2, blk.y + blk.h, '#f1c40f', 10);
                     this.triggerQuiz(blk);
                }
            }
        }

        // Finish Logic
        const allQuestionsAnswered = this.questionBlocks.filter(b => b.active).length === 0;
        if(p.y < this.finishY && allQuestionsAnswered) {
            this.finishLevel();
        }

        // Camera
        let targetCamY = p.y - (this.canvas.height / 2);
        if (targetCamY > this.worldBaseY - this.canvas.height + 100) {
            targetCamY = this.worldBaseY - this.canvas.height + 100;
        }
        this.camera.y += (targetCamY - this.camera.y) * 0.1;
        this.camera.x = 0;

        // Update Particles
        for(let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if(this.particles[i].life <= 0) this.particles.splice(i, 1);
        }
    },

    takeDamage() {
        audioManager.playSFX('sfx-hit');
        this.player.lives--;
        this.createParticles(this.player.x, this.player.y, '#ff4757', 20); // Blood effect
        this.updateUI();

        if (this.player.lives <= 0) {
            this.triggerEmergency();
        } else {
            this.respawnPlayer();
        }
    },

    triggerEmergency() {
        this.paused = true;
        const qData = hardQuestions[Math.floor(Math.random() * hardQuestions.length)];
        
        document.getElementById('emergency-q-text').innerText = qData.q;
        const container = document.getElementById('emergency-options');
        container.innerHTML = '';
        
        qData.a.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.innerText = opt;
            btn.onclick = () => {
                if(idx === qData.c) {
                    this.player.lives = 1;
                    this.updateUI();
                    document.getElementById('modal-emergency').style.display = 'none';
                    this.paused = false;
                    this.respawnPlayer();
                    audioManager.playSFX('sfx-coin');
                } else {
                    alert("Jawaban Salah! Mengulang Level...");
                    this.startLevel(this.levelIndex);
                    document.getElementById('modal-emergency').style.display = 'none';
                }
            };
            container.appendChild(btn);
        });
        
        document.getElementById('modal-emergency').style.display = 'flex';
    },

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.save();
        ctx.translate(0, -this.camera.y);

        // Draw Particles
        this.particles.forEach(p => p.draw(ctx));

        // Draw Player with Animation
        const p = this.player;
        const pH = p.h * p.scaleY;
        const pW = p.w * (1 + (1 - p.scaleY)); // Preserve volume
        const pX = p.x + (p.w - pW)/2;
        const pY = p.y + (p.h - pH);

        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(pX, pY, pW, pH);
        ctx.fillStyle = '#fff';
        ctx.fillRect(pX, pY + 10 * p.scaleY, pW, 5 * p.scaleY); // Headband

        // Platforms
        for(let plat of this.platforms) {
            ctx.fillStyle = '#54a0ff';
            ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
            ctx.fillStyle = '#2e86de';
            ctx.fillRect(plat.x, plat.y + plat.h - 5, plat.w, 5);
        }

        // Obstacles
        ctx.fillStyle = '#e74c3c';
        for(let obs of this.obstacles) {
            ctx.beginPath();
            ctx.moveTo(obs.x, obs.y + obs.h);
            ctx.lineTo(obs.x + (obs.w/2), obs.y);
            ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
            ctx.fill();
        }

        // Blocks
        for(let blk of this.questionBlocks) {
            if(blk.active) {
                ctx.fillStyle = '#feca57';
                ctx.fillRect(blk.x, blk.y, blk.w, blk.h);
                ctx.fillStyle = '#d35400';
                ctx.font = '24px Arial';
                ctx.fillText("?", blk.x + 12, blk.y + 28);
            }
        }

        // Finish Line
        const allQuestionsAnswered = this.questionBlocks.filter(b => b.active).length === 0;
        if (allQuestionsAnswered) {
            const lastPlat = this.platforms[this.platforms.length-1];
            ctx.fillStyle = 'white';
            ctx.fillRect(lastPlat.x + 50, this.finishY, 5, 50);
            ctx.fillStyle = '#e1b12c'; 
            ctx.fillRect(lastPlat.x + 55, this.finishY, 40, 25);
        } else {
            const lastPlat = this.platforms[this.platforms.length-1];
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(lastPlat.x + 50, this.finishY, 5, 50);
        }

        ctx.restore();
    },

    togglePause() {
        this.paused = !this.paused;
        document.getElementById('modal-pause').style.display = this.paused ? 'flex' : 'none';
    },

    triggerQuiz(block) {
        this.paused = true;
        block.active = false;
        
        const qData = this.questions[block.qIndex];
        document.getElementById('quiz-question-text').innerText = qData.q;
        const optsContainer = document.getElementById('quiz-options');
        optsContainer.innerHTML = '';
        
        qData.a.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.innerText = opt;
            btn.onclick = () => this.answerQuiz(idx, qData.c);
            optsContainer.appendChild(btn);
        });
        
        document.getElementById('modal-quiz').style.display = 'flex';
    },

    answerQuiz(selected, correct) {
        if(selected === correct) {
            this.correctCount++;
            this.score += 20;
            audioManager.playSFX('sfx-coin');
            this.createParticles(this.canvas.width/2, this.canvas.height/2, '#f1c40f', 50); // Confetti
        } else {
            audioManager.playSFX('sfx-wrong');
        }
        document.getElementById('modal-quiz').style.display = 'none';
        this.paused = false;
        this.updateUI();
    },

    updateUI() {
        document.getElementById('game-score').innerText = this.score;
        document.getElementById('game-lives').innerText = this.player.lives;
        let answered = 5 - this.questionBlocks.filter(b => b.active).length;
        document.getElementById('game-q-count').innerText = `${answered}/5`;
    },

    finishLevel() {
        this.active = false;
        audioManager.playSFX('sfx-win');
        this.createParticles(this.canvas.width/2, this.canvas.height/2, '#2ecc71', 100); // Win Particles
        
        let stars = 1;
        if(this.correctCount === 5) stars = 3;
        else if(this.correctCount >= 3) stars = 2;
        
        if(app.currentUser) {
            app.currentUser.score += this.score;
            if(stars > app.currentUser.levelProgress[this.levelIndex]) {
                app.currentUser.levelProgress[this.levelIndex] = stars;
            }
            if(this.levelIndex < 4 && app.currentUser.levelProgress[this.levelIndex+1] === 0) {
                app.currentUser.levelProgress[this.levelIndex+1] = -1;
            }
            app.saveUser();
        }

        document.getElementById('result-score').innerText = this.score;
        document.getElementById('result-correct').innerText = this.correctCount;
        document.getElementById('result-stars').innerText = '⭐'.repeat(stars);
        document.getElementById('modal-result').style.display = 'flex';
    },

    quitGame() {
        document.getElementById('modal-result').style.display = 'none';
        document.getElementById('modal-pause').style.display = 'none';
        document.getElementById('modal-emergency').style.display = 'none';
        app.showScreen('screen-menu');
        app.updateMenuUI();
        audioManager.playBGM('menu');
    },

    restartLevel() {
        document.getElementById('modal-result').style.display = 'none';
        this.startLevel(this.levelIndex);
    }
};

app.init();
game.init();