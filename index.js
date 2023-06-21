// 目錄
if (document.body.hasAttribute("dir")) {
  const headerList = document.querySelectorAll(".content h2");
  const toc = document.createElement("div");
  toc.classList.add("dir");
  headerList.forEach((header) => {
    const title = header.getAttribute("data-dir") || header.textContent;
    header.id = title;
    const link = document.createElement("a");
    link.href = "#" + title;
    link.textContent = title;
    toc.appendChild(link);
  });
  document.body.insertBefore(toc, document.body.firstChild);
}

//   幻燈片
const olList = document.querySelectorAll("ol");
olList.forEach((ol) => {
  let isSlider = true;
  const liList = ol.querySelectorAll("li");
  liList.forEach((li) => {
    if (
      li.children.length !== 1 ||
      li.children[0].tagName !== "IMG" ||
      li.textContent.trim() !== ""
    ) {
      isSlider = false;
    }
  });

  if (isSlider) {
    const slider = document.createElement("div");
    slider.classList.add("slider");
    ol.after(slider);

    liList.forEach((li) => {
      let slide = li.children[0];
      slide.classList.add("slide");
      slider.appendChild(slide);
    });

    ol.remove();

    let currentIndex = 0;
    const slides = slider.querySelectorAll(".slide");
    slides[currentIndex].classList.add("active");

    const next = () => {
      slides[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add("active");
    };

    const previous = () => {
      slides[currentIndex].classList.remove("active");
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      slides[currentIndex].classList.add("active");
    };

    let autoPlayTimeout = setInterval(next, 2000);

    slider.addEventListener("click", () => {
      clearTimeout(autoPlayTimeout);
      if (event.clientX > slider.clientWidth / 2) {
        next();
      } else {
        previous();
      }
      autoPlayTimeout = setTimeout(() => {
        autoPlayTimeout = setInterval(next, 2000);
      }, 5000);
    });
  }
});

//   網格圖片
document.querySelectorAll("ul").forEach(function (ul) {
  let liCount = ul.children.length;

  if (
    Array.from(ul.children).every(
      (li) =>
        li.children.length === 1 &&
        li.children[0].tagName === "IMG" &&
        li.textContent.trim() === ""
    )
  ) {
    ul.classList.add("grid-img");

    if (liCount <= 6) {
      ul.style.setProperty("--grid-img", 2);
    } else if (liCount <= 9) {
      ul.style.setProperty("--grid-img", 3);
    } else {
      ul.style.setProperty("--grid-img", 4);
    }
  }
});

// 註解

function formatNotes() {
  const pattern = /_+\(\[([^:]*?)]:\s*([\s\S]*?)\)_+/g;

  // 篩選並處理沒有 img 子元素和 ol 子元素的節點
  document.querySelectorAll("*").forEach((element) => {
    // 檢查元素是否包含 <img> 或 <ol> 子元素
    if (!element.querySelector("img") && !element.querySelector("ol")) {
      element.innerHTML = element.innerHTML.replace(
        pattern,
        (match, title, info) => {
          return `<span class="notes"><label for="">[${title}]<input type="checkbox" name="" id="" /> </label></span><span class="hide">[${title}]: ${info}</span>`;
        }
      );
    }
  });
}

window.addEventListener("DOMContentLoaded", formatNotes);
