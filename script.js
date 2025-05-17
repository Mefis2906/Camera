const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("capture-button");
const previewContainer = document.getElementById("preview-container");
const previewImage = document.getElementById("preview");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");
const switchCameraBtn = document.getElementById("switch-camera");
const timerSelect = document.getElementById("timer-select");
const zoomSlider = document.getElementById("zoom-slider");
const gallery = document.getElementById("gallery");

let usingFrontCamera = false;
let stream = null;
let lastPhotos = [];

async function startCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: usingFrontCamera ? "user" : "environment"
      },
      audio: false
    });

    video.srcObject = stream;
  } catch (error) {
    alert("Не удалось получить доступ к камере.");
    console.error(error);
  }
}

function updateGallery(src) {
  lastPhotos.unshift(src);
  if (lastPhotos.length > 3) lastPhotos.pop();

  gallery.innerHTML = "";
  lastPhotos.forEach(photo => {
    const img = document.createElement("img");
    img.src = photo;
    gallery.appendChild(img);
  });

  gallery.classList.remove("hidden");
}

function capturePhoto() {
  const context = canvas.getContext("2d");
  const zoom = parseFloat(zoomSlider.value);

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const width = canvas.width / zoom;
  const height = canvas.height / zoom;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  context.drawImage(video, x, y, width, height, 0, 0, canvas.width, canvas.height);
  const imageDataURL = canvas.toDataURL("image/png");
  previewImage.src = imageDataURL;

  previewContainer.classList.remove("hidden");
}

captureButton.addEventListener("click", () => {
  const delay = parseInt(timerSelect.value, 10);
  if (delay > 0) {
    setTimeout(capturePhoto, delay * 1000);
  } else {
    capturePhoto();
  }
});

cancelButton.addEventListener("click", () => {
  previewContainer.classList.add("hidden");
});

saveButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = previewImage.src;
  link.download = "photo.png";
  link.click();

  updateGallery(previewImage.src);
  previewContainer.classList.add("hidden");
});

switchCameraBtn.addEventListener("click", () => {
  usingFrontCamera = !usingFrontCamera;
  startCamera();
});

startCamera();
