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
    [ // Level 4 (Placeholder)
        { q: "Soal L4 No 1", a: ["A", "B", "C", "D"], c: 0 },
        { q: "Soal L4 No 2", a: ["A", "B", "C", "D"], c: 0 },
        { q: "Soal L4 No 3", a: ["A", "B", "C", "D"], c: 0 },
        { q: "Soal L4 No 4", a: ["A", "B", "C", "D"], c: 0 },
        { q: "Soal L4 No 5", a: ["A", "B", "C", "D"], c: 0 }
    ],
    [ // Level 5 (Placeholder)
        { q: "Soal L5 No 1", a: ["A", "B", "C", "D"], c: 0 },
        { q: "Soal L5 No 2", a: ["A", "B", "C", "D"], c: 0 },
        { q: "Soal L5 No 3", a: ["A", "B", "C", "D"], c: 0 },
        { q: "Soal L5 No 4", a: ["A", "B", "C", "D"], c: 0 },
        { q: "Soal L5 No 5", a: ["A", "B", "C", "D"], c: 0 }
    ]
];

/* --- AUDIO MANAGER FIX --- */
const audioManager = {
    initialized: false,
    bgmMenu: document.getElementById('bgm-menu'),
    bgmGame: document.getElementById('bgm-game'),
    
    init() {
        if(this.initialized) return;
        this.initialized = true;
        // Paksa load agar siap dimainkan
        this.bgmMenu.load();
        this.bgmGame.load();
        
        // Mainkan sound dummy untuk unlock audio context
        const s = document.getElementById('sfx-jump');
        s.volume = 0;
        s.play().then(() => {
            s.pause();
            s.volume = 1;
        }).catch(e => console.log("Audio policy block, waiting interaction"));
    },
    
    playBGM(type) {
        this.bgmMenu.pause();
        this.bgmGame.pause();
        
        let target;
        if(type === 'menu') target = this.bgmMenu;
        else target = this.bgmGame;

        target.currentTime = 0;
        target.volume = 0.4; // Volume pas, tidak terlalu keras
        target.play().catch(e => console.log("Gagal play BGM:", e));
    },

    playSFX(id) {
        const sfx = document.getElementById(id);
        if(sfx) {
            sfx.currentTime = 0;
            sfx.volume = 0.8;
            sfx.play().catch(e => {});
        }
    }
};

/* --- APP LOGIC --- */
const app = {
    currentUser: null,
    questions: JSON.parse(localStorage.getItem('egamify_questions')) || defaultQuestions,
    
    init() {
        if(localStorage.getItem('egamify_user')) {
            this.currentUser = JSON.parse(localStorage.getItem('egamify_user'));
            this.showScreen('screen-menu');
            this.updateMenuUI();
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
            levelProgress: [0,0,0,0,0] // 0: locked, -1: unlocked, 1-3: stars
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

    // --- LOGIKA PROFILE ---
    showProfile() {
        if(!this.currentUser) return;
        document.getElementById('prof-name').innerText = this.currentUser.name;
        document.getElementById('prof-nisn').innerText = this.currentUser.id;
        document.getElementById('prof-score').innerText = this.currentUser.score;
        
        const totalStars = this.currentUser.levelProgress.reduce((a, b) => (b > 0 ? a + b : a), 0);
        document.getElementById('prof-stars').innerText = totalStars;

        // Render Badges di Profile
        const badgeContainer = document.getElementById('prof-badges');
        this.renderBadges(badgeContainer);

        this.showScreen('screen-profile');
    },

    updateMenuUI() {
        if(!this.currentUser) return;
        document.getElementById('display-nama').innerText = this.currentUser.name;
        
        const totalStars = this.currentUser.levelProgress.reduce((a, b) => (b > 0 ? a + b : a), 0);
        document.getElementById('total-stars').innerText = totalStars;
        document.getElementById('total-score').innerText = this.currentUser.score;

        // Render Map Nodes
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
            node.innerHTML = `
                <span>${idx + 1}</span>
                <div class="level-info">
                    ${subjects[idx]}<br>
                    <small>${label}</small>
                </div>
            `;
            if(className !== 'locked') node.onclick = () => game.startLevel(idx);
            container.appendChild(node);
        });

        // Render Mini Badges di Menu
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
            { name: "Budi Santoso", score: 800 }
        ].sort((a,b) => b.score - a.score);

        list.innerHTML = data.map((d, i) => `
            <div class="lb-item">
                <span>#${i+1} ${d.name}</span>
                <span>${d.score} Poin</span>
            </div>
        `).join('');
    }
};

/* --- ADMIN LOGIC --- */
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

/* --- GAME ENGINE (DIPERBAIKI) --- */
const game = {
    canvas: document.getElementById('gameCanvas'),
    ctx: null,
    active: false,
    paused: false,
    levelIndex: 0,
    questions: [],
    
    player: { 
        x: 50, y: 0, w: 30, h: 40, vx: 0, vy: 0, 
        speed: 6, jumpPower: -13, grounded: false,
        maxJumps: 2, jumpCount: 0 
    },
    platforms: [],
    questionBlocks: [],
    obstacles: [],
    camera: { x: 0, y: 0 },
    score: 0,
    correctCount: 0,
    
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

        // Kontrol Mobile
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
            audioManager.playSFX('sfx-jump');
        }
    },

    startLevel(lvlIdx) {
        this.levelIndex = lvlIdx;
        this.questions = [...app.questions[lvlIdx]];
        this.score = 0;
        this.correctCount = 0;
        this.active = true;
        this.paused = false;

        this.player.x = 100;
        this.player.y = this.canvas.height - 150;
        this.player.vx = 0; this.player.vy = 0;
        this.player.jumpCount = 0;
        
        /* --- LEVEL GENERATION FIX (Lebih Mudah) --- */
        this.platforms = [];
        this.questionBlocks = [];
        this.obstacles = [];
        
        let currentX = 50;
        let currentY = this.canvas.height - 50;
        
        // Pijakan Awal
        this.platforms.push({x: -100, y: currentY, w: 800, h: 50}); 

        // 5 Pertanyaan = 5 Segmen
        for(let i=0; i<5; i++) {
            currentY -= 160; // Naik tidak terlalu tinggi (sebelumnya 200)
            let targetX = (i % 2 === 0) ? 600 : 100; 
            
            // Platform Transisi (Tangga)
            let stepX = (targetX - currentX) / 2;
            let midPlatX = currentX + stepX - 50;
            let midPlatY = currentY + 80;
            
            this.platforms.push({x: midPlatX, y: midPlatY, w: 150, h: 20}); // Platform lebih lebar

            // Rintangan (Duri) - JARANG MUNCUL (Hanya 30% peluang dan tidak di level 1)
            if (i > 0 && Math.random() < 0.3) {
                this.obstacles.push({x: midPlatX + 50, y: midPlatY - 15, w: 30, h: 15});
            }

            // Platform Utama (Tempat Soal)
            this.platforms.push({x: targetX, y: currentY, w: 200, h: 20});
            
            this.questionBlocks.push({
                x: targetX + 80, y: currentY - 60, w: 40, h: 40, 
                active: true, qIndex: i 
            });

            currentX = targetX;
        }

        this.finishY = currentY - 150;
        this.platforms.push({x: currentX - 50, y: this.finishY + 50, w: 200, h: 20});

        app.showScreen('screen-game');
        this.updateUI();
        audioManager.playBGM('game');
        requestAnimationFrame(() => this.loop());
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
        
        // Movement
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) p.vx = p.speed;
        else if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) p.vx = -p.speed;
        else p.vx = 0;

        p.x += p.vx;
        p.vy += 0.8; // Gravity
        p.y += p.vy;

        // Platform Collision
        p.grounded = false;
        for(let plat of this.platforms) {
            if (p.x < plat.x + plat.w && p.x + p.w > plat.x &&
                p.y < plat.y + plat.h && p.y + p.h > plat.y) {
                if (p.vy > 0 && p.y + p.h - p.vy <= plat.y) {
                    p.grounded = true;
                    p.jumpCount = 0;
                    p.vy = 0;
                    p.y = plat.y - p.h;
                }
            }
        }

        // Obstacle Collision
        for(let obs of this.obstacles) {
            if (p.x < obs.x + obs.w && p.x + p.w > obs.x &&
                p.y < obs.y + obs.h && p.y + p.h > obs.y) {
                this.respawn();
            }
        }
        if (p.y > this.canvas.height + 500) this.respawn();

        // Question Box Collision (PERBAIKAN: Hitbox lebih forgiving)
        for(let blk of this.questionBlocks) {
            // Cek tabrakan sedikit lebih lebar dari kotaknya
            if(blk.active && 
               p.x < blk.x + blk.w + 10 && p.x + p.w > blk.x - 10 &&
               p.y < blk.y + blk.h && p.y > blk.y) { 
                 // Jika menyundul dari bawah
                 if(p.vy < 0) {
                     p.vy = 0; // Stop momentum
                     this.triggerQuiz(blk);
                 }
            }
        }

        // Finish Logic
        if(p.y < this.finishY) {
            if (this.questionBlocks.filter(b => b.active).length === 0) {
                this.finishLevel();
            }
        }

        // Camera
        this.camera.y = p.y - (this.canvas.height / 2);
        this.camera.x = p.x - (this.canvas.width / 2);
    },

    respawn() {
        audioManager.playSFX('sfx-hit');
        this.player.x = 100;
        this.player.y = this.canvas.height - 150;
        this.player.vy = 0;
    },

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.save();
        ctx.translate(-this.camera.x, -this.camera.y);

        // Player
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.player.x, this.player.y + 10, this.player.w, 5); // Ikat kepala

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
                blk.y += Math.sin(Date.now() / 200) * 0.5; 
            }
        }

        // Finish Flag
        ctx.fillStyle = 'white';
        ctx.fillRect(this.platforms[this.platforms.length-1].x + 50, this.finishY, 5, 50);
        ctx.fillStyle = '#e1b12c';
        ctx.fillRect(this.platforms[this.platforms.length-1].x + 55, this.finishY, 40, 25);

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
        } else {
            audioManager.playSFX('sfx-wrong');
        }
        document.getElementById('modal-quiz').style.display = 'none';
        this.paused = false;
        this.updateUI();
    },

    updateUI() {
        document.getElementById('game-score').innerText = this.score;
        let answered = 5 - this.questionBlocks.filter(b => b.active).length;
        document.getElementById('game-q-count').innerText = `${answered}/5`;
    },

    finishLevel() {
        this.active = false;
        audioManager.playSFX('sfx-win');
        
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