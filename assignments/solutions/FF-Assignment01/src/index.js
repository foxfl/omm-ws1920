let currentIndex = 0;

function getImagesInContainer() {
  const imageContainer = document.getElementById("images");
  return imageContainer.getElementsByTagName("img");
}

function getImageCount() {
  const size = getImagesInContainer().length;
  return size;
}

function getImageByIndex(index) {
  return getImagesInContainer()[index];
}

function addActiveClass(element, className = "active") {
  element.classList.add(className);
}

function removeActiveClass(element, className = "active") {
  element.classList.remove(className);
}

function btnControllPrevent() {
  const imageSize = getImageCount();
  const btnNext = document.getElementById("btn_next");
  const btnPrev = document.getElementById("btn_prev");

  if (currentIndex === 0) {
    btnPrev.setAttribute("disabled", true);
  } else if (currentIndex === imageSize - 1) {
    btnNext.setAttribute("disabled", true);
  } else {
    btnPrev.removeAttribute("disabled");
    btnNext.removeAttribute("disabled");
  }
}

function nextImagePrevent() {
  nextImage(currentIndex, currentIndex + 1);
  currentIndex = currentIndex + 1;
  btnControllPrevent();
}

function prevImagePrevent() {
  prevImage(currentIndex, currentIndex - 1);
  currentIndex = currentIndex - 1;
  btnControllPrevent();
}

function nextImageCarousell() {
  const imageSize = getImageCount();
  let nextImageIndex = currentIndex;
  if (currentIndex === imageSize - 1) {
    nextImageIndex = 0;
  } else {
    nextImageIndex = currentIndex + 1;
  }
  nextImage(currentIndex, nextImageIndex);
  currentIndex = nextImageIndex;
}

function prevImageCarousell() {
  const imageSize = getImageCount();
  let nextImageIndex = currentIndex;
  if (currentIndex === 0) {
    nextImageIndex = imageSize - 1;
  } else {
    nextImageIndex = currentIndex - 1;
  }
  prevImage(currentIndex, nextImageIndex);
  currentIndex = nextImageIndex;
}

function nextImage(activeIndex, nextIndex) {
  const currentImage = getImageByIndex(activeIndex);
  const nextImage = getImageByIndex(nextIndex);
  removeActiveClass(currentImage);
  addActiveClass(nextImage);
}

function prevImage(activeIndex, nextIndex) {
  const currentImage = getImageByIndex(activeIndex);
  const nextImage = getImageByIndex(nextIndex);
  removeActiveClass(currentImage);
  addActiveClass(nextImage);
}
