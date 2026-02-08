const video = document.getElementById("vid");
const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");

let charset = ".'`\",:;i1+tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
charset = charset.split('').reverse().join('');


const cellW = 12;
const cellH = 18;

function getCharFromBrightness(brightness) {
  const normalized = brightness / 255;
  const index = Math.floor(normalized * (charset.length - 1));
  return charset[index];
}

video.addEventListener("loadedmetadata", () => {
  video.play();

  canvas.width = video.videoWidth * 4;
  canvas.height = video.videoHeight * 4;

  ctx.font = `${cellH}px monospace`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";

  render();
});

function render() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = frame.data;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";

  for (let y = 0; y < canvas.height; y += cellH) {
    for (let x = 0; x < canvas.width; x += cellW) {
      const i = (y * canvas.width + x) * 4;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      const char = getCharFromBrightness(brightness);

      ctx.fillText(char, x, y);
    }
  }

  requestAnimationFrame(render);
}

// camera
navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    facingMode: "user",
    width: { ideal: 320 },
    height: { ideal: 240 }
  }
})
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => console.error(err));

