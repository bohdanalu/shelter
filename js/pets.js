const paginationBtns = document.querySelector(".pets__pagination");
const paginationBtnNum = document.querySelector(".pagination__item--num");
const paginationBtnRight = document.querySelector(".pagination__item--right");
const paginationBtnLeft = document.querySelector(".pagination__item--left");
const paginationBtnStart = document.querySelector(".pagination__item--start");
const paginationBtnEnd = document.querySelector(".pagination__item--end");
const petsListElem = document.querySelector(".pets__list");

let currentPage = 1;
let itemsPets = 48;
let petsPerPage = 8;
let totalPages = Math.ceil(itemsPets / petsPerPage);

async function getPets() {
  const requestUrl = "https://bohdanalu.github.io/pets.json";
  const request = new Request(requestUrl);

  const response = await fetch(request);

  const petsObj = await response.json();

  createPetsList(petsObj);
}

// функция для перетасовки массива
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createPetsList(obj) {
  let petsList = [];
  const pets = obj;
  const petsArrRandom = shuffleArray(pets);
  let arr1 = petsArrRandom.slice(0, 3);
  let arr2 = petsArrRandom.slice(3, 6);
  let arr3 = petsArrRandom.slice(-2);

  for (let i = 0; i < 6; i++) {
    petsList = petsList
      .concat(shuffleArray(arr1))
      .concat(shuffleArray(arr2))
      .concat(shuffleArray(arr3));
  }

  let mqls = [
    window.matchMedia("(min-width: 769px)"),
    window.matchMedia("(max-width: 580px)"),
  ];
  for (let i = 0; i < mqls.length; i++) {
    mqls[i].addEventListener("change", mediaQueryResponse);
  }
  window.addEventListener("load", () => {
    mediaQueryResponse();
  });
  function mediaQueryResponse() {
    if (mqls[0].matches) {
      currentPage = 1;
      changePage(currentPage);
      petsPerPage = 8;
      totalPages = 6;
      displayList();
    }
    if (mqls[1].matches) {
      currentPage = 1;
      changePage(currentPage);
      petsPerPage = 3;
      totalPages = 16;
      paginationBtnRight.classList.remove("_inactive");
      paginationBtnEnd.classList.remove("_inactive");
      displayList();
    }
    if (!mqls[0].matches && !mqls[1].matches) {
      currentPage = 1;
      changePage(currentPage);
      petsPerPage = 6;
      totalPages = 8;
      paginationBtnRight.classList.remove("_inactive");
      paginationBtnEnd.classList.remove("_inactive");
      displayList();
    }
    return petsPerPage;
  }

  function displayList() {
    petsListElem.textContent = "";
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
      article.classList.add("pets__card", "card");
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
      petsListElem.append(liElem);

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

  paginationBtns.addEventListener("click", switchPage);

  function switchPage(e) {
    if (e.target == paginationBtnStart) {
      currentPage = 1;
    }
    if (e.target == paginationBtnLeft) {
      --currentPage;
    }
    if (e.target == paginationBtnNum) {
      return;
    }
    if (e.target == paginationBtnRight) {
      currentPage++;
    }
    if (e.target == paginationBtnEnd) {
      currentPage = totalPages;
    }
    changePage(currentPage);
    displayList();
  }

  function changePage(page) {
    if (page === 1) {
      page = 1;
      paginationBtnLeft.classList.add("_inactive");
      paginationBtnStart.classList.add("_inactive");
    } else {
      paginationBtnLeft.classList.remove("_inactive");
      paginationBtnStart.classList.remove("_inactive");
    }
    if (page === totalPages) {
      page = totalPages;
      paginationBtnRight.classList.add("_inactive");
      paginationBtnEnd.classList.add("_inactive");
    } else {
      paginationBtnRight.classList.remove("_inactive");
      paginationBtnEnd.classList.remove("_inactive");
    }
    paginationBtnNum.textContent = page;
  }

  displayList();
}

getPets();
