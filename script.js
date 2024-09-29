const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const blur = document.getElementById('blur');
const saturation = document.getElementById('saturation');
const exposure = document.getElementById('exposure');
const hue = document.getElementById('hue');
const rotate = document.getElementById('rotate');

let img = new Image();

upload.addEventListener('change', e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
        img.src = event.target.result;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
    };
    reader.readAsDataURL(file);
});

function applyFilters() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate.value * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.filter = `
        brightness(${brightness.value}%)
        contrast(${contrast.value}%)
        blur(${blur.value}px)
        saturate(${saturation.value}%)
        hue-rotate(${hue.value}deg)
        brightness(${exposure.value}%)
    `;
    ctx.drawImage(img, 0, 0);
    ctx.restore();
}

[brightness, contrast, blur, saturation, exposure, hue, rotate].forEach(slider =>
    slider.addEventListener('input', applyFilters)
);

function resetFilters() {
    [brightness, contrast, blur, saturation, exposure, hue, rotate].forEach(s => (s.value = s.defaultValue));
    applyFilters();
}

function applyFilter(filter) {
    ctx.save(); // Save current state
    ctx.filter = 'none'; // Reset filter before applying a new one
    switch (filter) {
        case 'grayscale':
            ctx.filter = 'grayscale(100%)';
            break;
        case 'sepia':
            ctx.filter = 'sepia(100%)';
            break;
        case 'vivid':
            ctx.filter = 'saturate(200%)';
            break;
        case 'vivid-warm':
            ctx.filter = 'saturate(150%) hue-rotate(20deg)';
            break;
        case 'vivid-cool':
            ctx.filter = 'saturate(150%) hue-rotate(200deg)';
            break;
        case 'dramatic':
            ctx.filter = 'contrast(200%)';
            break;
        case 'dramatic-warm':
            ctx.filter = 'contrast(180%) hue-rotate(20deg)';
            break;
        case 'dramatic-cool':
            ctx.filter = 'contrast(180%) hue-rotate(200deg)';
            break;
        case 'mono':
            ctx.filter = 'grayscale(100%)';
            break;
        case 'silvertone':
            ctx.filter = 'grayscale(100%) brightness(120%) contrast(80%)';
            break;
        case 'noir':
            ctx.filter = 'grayscale(100%) contrast(150%) brightness(70%)';
            break;
        case 'tonal':
            ctx.filter = 'saturate(50%) brightness(110%)';
            break;
        case 'fade':
            ctx.filter = 'contrast(85%) saturate(70%) brightness(120%)';
            break;
        case 'transfer':
            ctx.filter = 'contrast(130%) saturate(40%)';
            break;
        case 'instant':
            ctx.filter = 'contrast(120%) saturate(120%) sepia(50%)';
            break;
        case 'cyberpunk':
            ctx.filter = 'contrast(250%) saturate(300%) hue-rotate(270deg)';
            break;
        case 'dark-gold':
            ctx.filter = 'sepia(100%) contrast(150%) brightness(70%)';
            break;
        case 'dark-autumn':
            ctx.filter = 'contrast(180%) sepia(70%) saturate(80%)';
            break;
        case 'remove-bg':
            removeBackground();
            return;
    }
    ctx.drawImage(img, 0, 0);
    ctx.restore(); // Restore state after applying filters
}

function removeBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // If the pixel is light-colored, make it transparent
        if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
            data[i + 3] = 0; // Set alpha to 0 for transparency
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function downloadImage(format) {
    const link = document.createElement('a');
    link.download = `edited-image.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
}
