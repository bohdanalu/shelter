const sliderWrap = document.querySelector(".pets__slider-wrap");
const slider = document.querySelector(".pets__slider");
let btns = document.querySelector(".pets__slider-btns");
let currentPage = 1;
let petsPerPage = 3;

async function getPets() {
  const requestUrl = "https://bohdanalu.github.io/pets.json";
  const request = new Request(requestUrl);

  const response = await fetch(request);

  const petsObj = await response.json();

  createPetsSlider(petsObj);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createPetsSlider(obj) {
  let petsList = [];
  const pets = obj;
  const petsArrRandom = shuffleArray(pets);
  let arr1 = petsArrRandom.slice(0, 3);
  let arr2 = petsArrRandom.slice(3, 5);
  let arr3 = petsArrRandom.slice(-3);

  for (let i = 0; i < 3; i++) {
    petsList = petsList
      .concat(shuffleArray(arr1))
      .concat(shuffleArray(arr2).concat(arr3));
  }
  window.addEventListener("load", () => {
    mediaQueryResponse();
  });

  let mqls = [
    window.matchMedia("(min-width: 930px)"),
    window.matchMedia("(max-width: 550px)"),
  ];
  for (let i = 0; i < mqls.length; i++) {
    mqls[i].addEventListener("change", mediaQueryResponse);
  }

  function mediaQueryResponse() {
    if (mqls[0].matches) {
      petsPerPage = 3;
      displayList();
    }
    if (mqls[1].matches) {
      petsPerPage = 1;
      displayList();
    }
    if (!mqls[0].matches && !mqls[1].matches) {
      petsPerPage = 2;
      displayList();
    }
    return petsPerPage;
  }

  const totalPages = Math.ceil(petsList.length / petsPerPage);

  function displayList() {
    slider.textContent = "";
    let startIndex = (currentPage - 1) * petsPerPage;
    let endIndex = startIndex + petsPerPage;
    let currentItems = petsList.slice(startIndex, endIndex);
    createPetsCards(currentItems);
  }
  function createPetsCards(items) {
    for (let i = 0; i < items.length; i++) {
      const pet = items[i];
      const liElem = document.createElement("li");
      liElem.classList.add("pets__item");
      const article = document.createElement("article");
      article.classList.add("pets__card", "card", "fade");
      article.id = pet.name;

      function createImg() {
        const img = document.createElement("img");
        img.classList.add("card__img", "img");
        img.setAttribute("src", `./assets/images/pets/${pet.img}`);
        img.setAttribute(
          "alt",
          `${pet.type} ${pet.breed} ${pet.name} ${pet.age}`
        );
        article.append(img);
      }

      function createTitle() {
        const title = document.createElement("h3");
        title.textContent = pet.name;
        title.classList.add("card__title", "line-clamp");
        article.append(title);
      }

      function createBtn() {
        const btn = document.createElement("button");
        btn.textContent = "Learn more";
        btn.classList.add("card__btn", "btn");
        article.append(btn);
      }

      createImg();
      createTitle();
      createBtn();
      liElem.append(article);
      createModal();
      slider.append(liElem);

      function createModal() {
        const closeBtn = document.createElement("button");
        closeBtn.classList.add("modal__btn");
        const modal = document.createElement("div");
        modal.classList.add("pets__modal", "modal");

        const modalContent = document.createElement("div");
        modalContent.classList.add("modal__content");

        modalContent.append(closeBtn);

        function createImg() {
          const img = document.createElement("img");
          img.classList.add("modal__img", "img");
          img.setAttribute("src", `./assets/images/modal/${pet.img}`);
          img.setAttribute(
            "alt",
            `${pet.type} ${pet.breed} ${pet.name} ${pet.age}`
          );
          modalContent.append(img);
        }
        createImg();

        const modalInfo = document.createElement("div");
        modalInfo.classList.add("modal__info");
        modalContent.append(modalInfo);

        function createTitle() {
          const title = document.createElement("h2");
          title.textContent = pet.name;
          title.classList.add("modal__title", "title");
          modalInfo.append(title);
        }

        function createSubtitle() {
          const subtitle = document.createElement("h3");
          subtitle.textContent = `${pet.type} - ${pet.breed}`;
          subtitle.classList.add("modal__subtitle");
          modalInfo.append(subtitle);
        }

        const ulEl = document.createElement("ul");
        ulEl.classList.add("modal__list");
        createItem("Age: ", pet.age);
        createItem("Inoculations: ", pet.inoculations);
        createItem("Diseases: ", pet.diseases);
        createItem("Parasites: ", pet.parasites);

        function createItem(name, values) {
          const liItem = document.createElement("li");
          liItem.classList.add("modal__item");
          const spanElName = document.createElement("span");
          spanElName.classList.add("modal__item-name");
          const spanElValue = document.createElement("span");
          spanElValue.classList.add("modal__item-value");
          spanElName.textContent = name;
          liItem.append(spanElName);
          if (typeof values === "array") {
            for (const value of values) {
              spanElValue.textContent += `${value}, `;
            }
          } else {
            spanElValue.textContent = values;
          }
          liItem.append(spanElValue);
          ulEl.append(liItem);
        }

        createTitle();
        createSubtitle();

        const modalDescr = document.createElement("div");
        modalDescr.classList.add("modal__description");
        const pEl = document.createElement("p");
        pEl.textContent = pet.description;
        modalDescr.append(pEl);

        modalInfo.append(modalDescr);
        modalInfo.append(ulEl);
        modalContent.append(modalInfo);
        modal.append(modalContent);
        liElem.append(modal);

        article.addEventListener("click", showModal);

        closeBtn.addEventListener("click", closeModal);

        window.addEventListener("click", function (event) {
          if (event.target == modal) {
            closeModal();
          }
        });

        function showModal() {
          modal.style.display = "flex";
          modalContent.style.transform = "scale(1)";
          body.style.overflow = "hidden";
        }

        function closeModal() {
          modal.style.display = "none";
          body.style.overflow = "auto";
        }
      }
    }
  }

  btns.addEventListener("click", ChangeSlides);
  function ChangeSlides(e) {
    if (e.target.classList.contains("btn--prev")) {
      --currentPage;
      if (currentPage < 1) {
        currentPage = totalPages;
      }
    }

    if (e.target.classList.contains("btn--next")) {
      currentPage++;
      if (currentPage > totalPages) {
        currentPage = 1;
      }
    }

    displayList();
  }
  displayList();
}

getPets();
