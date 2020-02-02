"use strict";

window.addEventListener("DOMContentLoaded", function() {
  const backButton = document.getElementById("backButton");
  const nextButton = document.getElementById("nextButton");
  const form = document.getElementById("captionForm");

  let memes = [];
  const numberOfImages = () => memes.length;
  // this is a counter that holds the id/number of the currently displayed image.
  let currentImageID = 1;

  const getTemplateID = () => memes[currentImageID].id;

  /**
   * shows the image by giving it the 'current' class
   * the CSS in the <style> block above specifies that only the slides
   * with the .current class are shown, the rest has display: none
   *
   * @param number {Number} id of the image.
   */
  function showImage(number) {
    let meme = memes[number];
    document.getElementById("slideShowImages").innerHTML = "";
    document
      .getElementById("slideShowImages")
      .append(renderImage(meme.url, meme.width, meme.height, meme.name));

    console.log(`showing image ${number}`);
  }

  function renderImage(url, width, height, name) {
    const figure = document.createElement("figure");
    figure.className = "slidecurrent";
    const newImage = document.createElement("img");
    newImage.src = url;
    newImage.width = width;
    newImage.height = height;
    const figCaption = document.createElement("figcaption");
    figCaption.innerHTML = `${name}   ${url}`;

    figure.appendChild(newImage);
    figure.appendChild(figCaption);

    return figure;
  }

  backButton.addEventListener("click", function() {
    currentImageID =
      currentImageID == 0 ? numberOfImages() - 1 : currentImageID - 1;
    showImage(currentImageID);
  });
  nextButton.addEventListener("click", function() {
    currentImageID =
      currentImageID == numberOfImages() - 1 ? 0 : currentImageID + 1;
    showImage(currentImageID);
  });

  form.addEventListener(
    "submit",
    function(event) {
      document.getElementById("slideShowImages").innerHTML =
        "Loading, please wait ...";
      const caption_top = form["caption_top"].value;
      const caption_bottom = form["caption_bottom"].value;
      fetch(
        `https://api.imgflip.com/caption_image?template_id=${getTemplateID()}&username=JakeBlake177&password=Start123!&text0=${caption_top}&text1=${caption_bottom}`,
        {
          method: "POST"
        }
      )
        .then((result) => result.json())
        .then(({ data: { url } = {} }) => {
          let meme = memes[currentImageID];

          document.getElementById("slideShowImages").innerHTML = "";
          document
            .getElementById("slideShowImages")
            .append(renderImage(url, meme.width, meme.height, meme.name));
        });
    },
    false
  );
  /**
    (re)loads the images for the current filter config
    */
  function loadImageUrls() {
    fetch("https://api.imgflip.com/get_memes")
      .then((result) => result.json())
      .then(({ data: { memes: loadedMemes } = {} }) => {
        memes = loadedMemes;
        showImage(0);
      });
  }
  loadImageUrls();
});
