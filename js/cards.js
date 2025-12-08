const canvas = document.querySelectorAll('.scratch');

canvas.forEach(el => {
    if (el.getAttribute('scratched') == true) return;

    const monthDay = el.dataset.day;
    const date = new Date();
    // const today = date.getDate();
    const today = 100;

    const cardContent = el.parentNode.querySelector(".cardContent");
    if(monthDay > today) {
        cardContent.innerHTML = "";
        cardContent.setAttribute("code", "");
        cardContent.setAttribute("qr", "");
    }
        
    const ctx = el.getContext("2d");

    let isDrawing = false;
    let lastPos = null;

    function fitCanvasToParent(canvas) {
        const parent = canvas.parentElement;
        const rect = parent.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;
        
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, el.width, el.height);
        ctx.globalCompositeOperation = "destination-out";
        
        isDrawing = false;
        lastPos = null;

        drawDate();
    }
    fitCanvasToParent(el);
    window.addEventListener('resize', () => fitCanvasToParent(el));

    function drawDate() {
        const day = el.dataset.day;
        const month = el.dataset.month;

        ctx.save();
        ctx.globalCompositeOperation = "source-over";

        ctx.fillStyle = "#000";
        ctx.font = "bold 70px sans-serif";
        ctx.textAlign = "center";

        const centerX = el.width / 2;
        const centerY = el.height / 2;

        ctx.fillText(day, centerX, centerY);

        ctx.font = "bold 25px sans-serif";
        ctx.fillText(month, centerX, centerY + 35);

        ctx.restore();
    }

    function getPos(e) {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        return { x, y };
    }

    function draw(e) {
        if (!isDrawing) return;
        
        if(monthDay > today) return;

        e.preventDefault();

        const pos = getPos(e);

        if (lastPos) {
            ctx.lineWidth = 80;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
            ctx.fill();
        }

        lastPos = pos;
    }

    function getScratchPercent() {
        const imageData = ctx.getImageData(0, 0, el.width, el.height);
        const pixels = imageData.data;
        let transparent = 0;
        const total = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] === 0) transparent++;
        }

        return Math.round((transparent / total) * 100);
    }

    function startScratch(e) {
        isDrawing = true;
        lastPos = getPos(e);
    }
    function finishScratch() {
        if (!isDrawing) return;

        isDrawing = false;
        lastPos = null;

        const percent = getScratchPercent();
        if (percent >= 90) {
            ctx.clearRect(0, 0, el.width, el.height); 
            const code = cardContent.getAttribute("code");
            const isQr = cardContent.getAttribute("qr");
            showPopup(code, isQr == "true");
        }
    }

    el.addEventListener("mousedown", startScratch);
    el.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", finishScratch);
    
    el.addEventListener("touchstart", startScratch);
    el.addEventListener("touchmove", draw);
    window.addEventListener("touchend", finishScratch);
});