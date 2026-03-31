(function () {
  const main = document.getElementById("imgMain");
  const thumbs = document.querySelectorAll("#imgThumbs img");

  let index = 0;

  function show(i) {
    index = i;

    main.src = thumbs[i].src;

    thumbs.forEach((img, idx) => {
      img.classList.toggle("active", idx === i);
    });
  }

  thumbs.forEach((img, i) => {
    img.addEventListener("click", () => show(i));
  });

  function autoSlide() {
    index++;
    if (index >= thumbs.length) index = 0;
    show(index);
  }

  setInterval(autoSlide, 4000);
})();
