function gocake() {
    window.location.href = "cake.html";
}

function goBack() {
    window.location.href = "index.html";
}

function blowCandle() {
    const flame = document.getElementById("flame");
    const wishCard = document.getElementById("wish-card");
    const titleText = document.getElementById("title-text");
    const hint = document.getElementById("hint");

    // ดับไฟเทียน
    flame.classList.add("blown");

    // เปลี่ยนข้อความด้านบน
    titleText.innerText = "Happy Birthday น้องใบเตยสุดอ้วนน 🎉";
    hint.style.display = "none";

    // หน่วงเวลา 0.5 วิ แล้วค่อยโชว์การ์ดคำอวยพร
    setTimeout(() => {
        wishCard.style.display = "block";
    }, 500);
}