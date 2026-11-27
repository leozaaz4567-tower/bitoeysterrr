const quizList = [
    { q: "ข้อ 1: วันแรกที่เจอกันเราไปกินอะไรกัน?", a: ["กระเพรา", "ผัดกระเพรา", "กะเพรา", "ผัดกะเพรา"] },
    { q: "ข้อ 2: น้องจะเลือกอะไรระหว่าง โค๊ก กับ โกโก้ ?", a: ["โกโก้", "โกโก", "โก้โก้", "โกโก่", "โก่โก่"] },
    { q: "ข้อ 3: น้องเกิดวันอะไร(ที่ไม่ใช่วันที่)?", a: ["อังคาร", "วันอังคาร"] },
    { q: "ข้อ 4: น้องว่าใครสวยที่สุด (พิมพ์ชื่อนะ)?", a: ["ใบเตย", "น้องใบเตย", "บอตอ", "น้อง"] },
    { q: "ข้อ 5: พร้อมจะดูของขวัญหรือยัง พร้อม / ไม่พร้อม?", a: ["พร้อม"] }
];

const pics = [
    { src: "images/h1.JPG", text: "จำได้มั้ยรูปนี้ เป็นวันแรกที่เจอกัน🤍" },
    { src: "images/h2.JPG", text: "วันแรกเราไปหม่ำกระเพรากันน 🍳" },
    { src: "images/h3.JPG", text: "รูปนี้วันที่สองที่เจอกัน เสื้อพี่คลุมทั้งตัวน้องเยย 🤏" },
    { src: "images/IMG_6226.PNG", text: "ดูสิ รอยยิ้มของคนทำผิด 🍜" },
    { src: "images/h4.JPG", text: "ไว้ไปกินหมูทอดบ้านฉันกันอีกนะ 🐷" },
    { src: "images/h5.JPG", text: "ไว้ไปวิ่งด้วยกันอีกน้าาา 🏃‍♀️" },
    { src: "images/h6.JPG", text: "วิ่งเสร็จก็กินต่อออ 🍜" },
    { src: "images/h7.JPG", text: "หมาล่าน้องน่ากินกว่าของพี่ 😋" },
    { src: "images/h8.JPG", text: "มาเล่นสติกเกอร์อีกน้าา 🤍" },
    { src: "images/h9.JPG", text: "ถ้าเป็นไปได้ อยากกลับมาหากันนะ 🤍💗" }
];

let quizIndex = 0;
let picIndex = 0;
let blown = false;
let musicPlaying = false;
let audioCtx = null;
let musicTimer = null;

function gocake() {
    window.location.href = "cake.html";
}

function goBack() {
    stopMusic();
    window.location.href = "index.html";
}

function blowCandle() {
    if (blown) return;
    blown = true;

    const flame = document.getElementById("flame");
    const wishCard = document.getElementById("wish-card");
    const titleText = document.getElementById("title-text");
    const hint = document.getElementById("hint");
    const micBtn = document.getElementById("mic-btn");

    flame.classList.add("blown");
    if (micBtn) micBtn.style.display = "none";

    titleText.innerText = "Happy Birthday น้องใบเตยสุดอ้วนน 🎉";
    hint.style.display = "none";

    if (!musicPlaying) {
        startMusic();
    }

    if (typeof confetti === "function") {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    setTimeout(() => {
        wishCard.style.display = "block";
    }, 500);
}

async function startMic() {
    const micBtn = document.getElementById("mic-btn");
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = ctx.createAnalyser();
        const mic = ctx.createMediaStreamSource(stream);
        mic.connect(analyser);
        analyser.fftSize = 256;

        const data = new Uint8Array(analyser.frequencyBinCount);
        micBtn.innerText = "🌬️ เป่าใส่ไมค์เยย!";
        micBtn.classList.add("active");

        function listen() {
            if (blown) {
                stream.getTracks().forEach(t => t.stop());
                return;
            }
            analyser.getByteFrequencyData(data);
            let total = 0;
            for (let i = 0; i < data.length; i++) {
                total += data[i];
            }
            if (total / data.length > 45) {
                blowCandle();
                stream.getTracks().forEach(t => t.stop());
            } else {
                requestAnimationFrame(listen);
            }
        }
        listen();
    } catch (e) {
        alert("เปิดไมค์ไม่ได้ลองเอานิ้วจิ้มที่ไฟบนเทียนแทนนะ");
    }
}

function startQuiz() {
    document.getElementById("gift-box").style.display = "none";
    document.getElementById("quiz-box").style.display = "block";
    showQuiz();

    const input = document.getElementById("quiz-input");
    input.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            checkQuiz();
        }
    });
}

function showQuiz() {
    document.getElementById("quiz-step").innerText = `ข้อที่ ${quizIndex + 1} / ${quizList.length}`;
    document.getElementById("quiz-q").innerText = quizList[quizIndex].q;
    document.getElementById("quiz-input").value = "";
    document.getElementById("quiz-err").innerText = "";
}

function checkQuiz() {
    const userAns = document.getElementById("quiz-input").value.trim().toLowerCase();
    const rightAnsList = quizList[quizIndex].a.map(item => item.toLowerCase());

    if (userAns === "") {
        document.getElementById("quiz-err").innerText = "พิมพ์คำตอบก่อนสิอ้วน";
        return;
    }

    if (rightAnsList.includes(userAns)) {
        quizIndex++;
        if (quizIndex < quizList.length) {
            showQuiz();
        } else {
            unlockGifts();
        }
    } else {
        document.getElementById("quiz-err").innerText = "ยังไม่ถูกกอ้วนน ลองนึกดูใหม่🤔";
    }
}

function unlockGifts() {
    document.getElementById("quiz-box").style.display = "none";
    document.getElementById("mem-box").style.display = "block";
    goGift1();

    if (typeof confetti === "function") {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    }
}

function goGift1() {
    const vid = document.getElementById("gift-video");
    if (vid) vid.pause();

    document.getElementById("gift-2").style.display = "none";
    document.getElementById("gift-1").style.display = "block";
    showPic();
}

function goGift2() {
    document.getElementById("gift-1").style.display = "none";
    document.getElementById("gift-2").style.display = "block";

    if (typeof confetti === "function") {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    }
}

function showPic() {
    document.getElementById("mem-img").src = pics[picIndex].src;
    document.getElementById("mem-text").innerText = pics[picIndex].text;
}

function nextPic() {
    picIndex = (picIndex + 1) % pics.length;
    showPic();
}

function prevPic() {
    picIndex = (picIndex - 1 + pics.length) % pics.length;
    showPic();
}

function openVideo() {
    stopMusic();
    document.getElementById("show-vid-btn").style.display = "none";
    document.getElementById("video-wrap").style.display = "block";
    const vid = document.getElementById("gift-video");
    vid.play();
}

const songNotes = [
    [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6], [349.23, 0.6], [329.63, 1.0],
    [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6], [392.00, 0.6], [349.23, 1.0],
    [261.63, 0.3], [261.63, 0.3], [523.25, 0.6], [440.00, 0.6], [349.23, 0.6], [329.63, 0.6], [293.66, 1.0],
    [466.16, 0.3], [466.16, 0.3], [440.00, 0.6], [349.23, 0.6], [392.00, 0.6], [349.23, 1.2]
];

function toggleMusic() {
    if (musicPlaying) {
        stopMusic();
    } else {
        startMusic();
    }
}

function startMusic() {
    const btn = document.getElementById("music-btn");
    if (!btn) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    musicPlaying = true;
    btn.innerText = "🔇 ปิดเพลง";

    let step = 0;
    function nextNote() {
        if (!musicPlaying) return;
        const [freq, time] = songNotes[step];

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + time);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + time);

        step = (step + 1) % songNotes.length;
        musicTimer = setTimeout(nextNote, time * 1000 + 80);
    }
    nextNote();
}

function stopMusic() {
    musicPlaying = false;
    clearTimeout(musicTimer);
    if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
    }
    const btn = document.getElementById("music-btn");
    if (btn) btn.innerText = "🎵 เปิดเพลง";
}