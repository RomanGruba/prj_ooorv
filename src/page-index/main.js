import "../scss/main.scss";
import "./page.scss";
import "../scss/header.scss";
import filmsTemplate from "./templates/template.hbs";
import api from "../js/api.js";
import { handleFavorite } from "./favorite";

class Mooogle {
  constructor() {
    // привязки к HTML

    this.refs = {
      // коробка для "preloader"
      pageWrapper: document.querySelector("#page_wrapper"),
      // "preloader"
      preloader: document.querySelector("#preloader"),
      // модальное окно "search"
      searchBlock: document.querySelector(".search_block"),
      // кнопка вызова модального окна
      btnCallSearchModal: document.querySelector(".search-engine"),
      // поле "input"
      searchInput: document.querySelector("#search_input"),
      // кнопка "search"
      searchForm: document.querySelector("#search_form"),
      // страж для скрола
      sentinal: document.querySelector("#sentinal"),
      // список "ul" в "grid"
      filmsList: document.querySelector(".films-list"),
      // кнопка "scroll up"
      scrollUpBtn: document.querySelector("#scroll_up"),
      // кнопка "btn sort by name"
      btnSortName: document.querySelector("#btn_sort_by_name"),
      // paragraf "film name"
      filmName: document.querySelector("#film_name"),
      // кнопка "btn sort by date"
      btnSortDate: document.querySelector("#btn_sort_by_date"),
      // span "film date"
      filmDate: document.querySelectorAll("#film_date"),
      buttonTvShow: document.querySelector(".menu-items-click--tv"),
      buttonFilm: document.querySelector(".menu-items-click--film"),
      headerButtonFilm: document.querySelector(".header-items-click--film"),
      headerButtonTvShow: document.querySelector(".header-items-click--tv"),
      buttonIconStar: document.querySelector(".button_icon-star"),
      iconStar: document.querySelector(".icon-star"),
      buttonFavorite: document.querySelector(".header-items-click--favorite"),
      // toggle-btn + Sidebar
      buttonShowSidebar: document.querySelector(".toggle-btn"),
      sidebarItem: document.querySelector(".sidebar"),
      menuList: document.getElementById("menu-list")
    };

    this.renderedData = [];
    this.favoriteArr = [];

    // при загрузке страницы рендерит популярные фильмы
    this.renderPopularFilms();

    // слушатель на DOM для "preloader"
    document.addEventListener(
      "DOMContentLoaded",
      this.closestPreloader.bind(this)
    );

    // слушатель на кнопку вызова модального окна
    this.refs.btnCallSearchModal.addEventListener(
      "click",
      this.openSearchBlockHandler.bind(this)
    );

    // слушатель для кнопки "button up"
    // window.addEventListener("scroll", _.throttle(this.scrollToUp.bind(this), 300));
    window.addEventListener("scroll", this.scrollToUp.bind(this));

    // слушатель на кнопке "button up"
    this.refs.scrollUpBtn.addEventListener(
      "click",
      this.scrollToUpHandler.bind(this)
    );

    // слушатель на кнопке "btn sort by name"
    this.refs.btnSortName.addEventListener(
      "click",
      this.clickOnBtnName.bind(this)
    );

    // слушатель на кнопке "btn sort by date"
    this.refs.btnSortDate.addEventListener(
      "click",
      this.clickOnBtnDate.bind(this)
    );

    //listener mobile Oleksii
    this.refs.buttonTvShow.addEventListener("click", event => {
      event.preventDefault();
      if (event.target === event.currentTarget) {
        this.openPreloaderUL();
        api.resetPage();
        this.clearList();
        this.killInfinityScroll();
        this.sortArray = [];
        this.renderTvShows();
        this.hideSidebar();
        this.closePreloaderUL();
      }
    });

    //listener desktop Oleksii
    this.refs.headerButtonTvShow.addEventListener("click", event => {
      event.preventDefault();
      if (event.target === event.currentTarget) {
        this.openPreloaderUL();
        api.resetPage();
        this.clearList();
        this.killInfinityScroll();
        this.sortArray = [];
        this.renderTvShows();
        this.closePreloaderUL();
        setTimeout(() => {
          if (localStorage.getItem("mediaType") === "TV") {
            this.refs.buttonFavorite.classList.remove("active-focus");
            this.refs.headerButtonFilm.classList.remove("active-focus");
            this.refs.headerButtonTvShow.classList.add("active-focus");
          }
        }, 1000);
      }
    });

    //listener mobile Oleksii
    this.refs.buttonFilm.addEventListener("click", event => {
      event.preventDefault();
      if (event.target === event.currentTarget) {
        this.openPreloaderUL();
        api.resetPage();
        this.clearList();
        this.killInfinityScroll();
        this.sortArray = [];
        this.renderPopularFilms();
        this.hideSidebar();
        this.closePreloaderUL();
      }
    });

    //listener desktop Oleksii
    this.refs.headerButtonFilm.addEventListener("click", event => {
      event.preventDefault();
      if (event.target === event.currentTarget) {
        this.openPreloaderUL();
        api.resetPage();
        this.clearList();
        this.killInfinityScroll();
        this.sortArray = [];
        this.renderPopularFilms();
        this.closePreloaderUL();
        setTimeout(() => {
          if (localStorage.getItem("mediaType") === "movie") {
            this.refs.buttonFavorite.classList.remove("active-focus");
            this.refs.headerButtonTvShow.classList.remove("active-focus");
            this.refs.headerButtonFilm.classList.add("active-focus");
          }
        }, 1000);
      }
    });

    // слушатель на click on image and star
    this.refs.filmsList.addEventListener("click", event => {
      if (event.target !== event.currentTarget) {
        localStorage.setItem(
          "id",
          event.target.closest(".films-item").dataset.id
        );
        localStorage.setItem(
          "mediaType",
          event.target.closest(".films-item").dataset.mediatype
        );

        if (
          event.target.nodeName === "SVG" ||
          event.target.nodeName === "use"
        ) {
          handleFavorite.call(this, event);

          let el = event.target;
          if (!el.classList.contains("icon-star")) {
            el = el.closest(".icon-star");
          }
          el.classList.toggle("fill-white");
          el.classList.toggle("fill-gold");
        }
      }
    });

    // слушатель на click favorites Roman
    this.refs.buttonFavorite.addEventListener("click", event => {
      event.preventDefault();
      localStorage.setItem("mediaType", "favorites");
      this.killInfinityScroll();
      if (localStorage.getItem("favorites")) {
        const markup = filmsTemplate(
          JSON.parse(localStorage.getItem("favorites"))
        );
        this.clearList();
        this.refs.filmsList.insertAdjacentHTML("beforeend", markup);
        let allStars = document.querySelectorAll(".icon-star");
        allStars.forEach(el => {
          el.classList.remove("fill-white");
          el.classList.add("fill-gold");
        });
        if (localStorage.getItem("mediaType") === "favorites") {
          this.refs.headerButtonFilm.classList.remove("active-focus");
          this.refs.headerButtonTvShow.classList.remove("active-focus");
          this.refs.buttonFavorite.classList.add("active-focus");
        }
      }
    });

    // START SIDEBAR SHOWUP VIKA
    this.flagShowBurger = true; //show flag aka hang the flag

    this.showBurger = function() {
      this.refs.menuList.classList.add("active");
      window.addEventListener("keydown", this.clickOnEscape);
      window.addEventListener("click", this.clickOnModal);
      document.body.classList.add("modal-overlay-menu");
      this.flagShowBurger = false;
    };
    this.showSidebar = this.showBurger.bind(this);

    this.hideBurger = function() {
      this.refs.menuList.classList.remove("active");
      window.removeEventListener("keydown", this.clickOnEscape);
      window.removeEventListener("click", this.clickOnModal);
      document.body.classList.remove("modal-overlay-menu");
      this.flagShowBurger = true;
    };
    this.hideSidebar = this.hideBurger.bind(this);

    this.BurgerOnClick = function() {
      if (this.flagShowBurger) {
        this.showSidebar();
      } else {
        this.hideSidebar();
      }
    };
    this.SidebarOnClick = this.BurgerOnClick.bind(this);

    //close BURGER on Escape
    this.closeBurgerEscape = function(e) {
      if (e.code !== "Escape") {
        return;
      }
      this.hideSidebar();
    };
    this.clickOnEscape = this.closeBurgerEscape.bind(this);

    //close BURGER on Modal
    this.closeBurgerModal = function(e) {
      if (e.target.className !== "sidebar") {
        return;
      }
      this.hideSidebar();
    };
    this.clickOnModal = this.closeBurgerModal.bind(this);

    this.refs.buttonShowSidebar.addEventListener("click", this.SidebarOnClick);
    // END OF SIDEBAR SHOWUP

    // обработчик поиска
    this.searchingHandler = function(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const input = form.elements.query;
      api.searchQuery = input.value;
      this.openPreloaderUL();
      api.resetPage();
      this.clearList();
      this.killInfinityScroll();
      this.sortArray = [];
      this.renderSearchingFilm();
      this.closeSearchBlockHandler();
      input.value = "";
      this.closePreloaderUL();
    };
    this.clickOnSearchBtn = this.searchingHandler.bind(this);

    // бесконечный скролл
    this.onEntInfScr = function(e) {
      if (e[0].isIntersecting) {
        console.log("pageXOffset :", pageYOffset);
        if (api.query === "") {
          if (localStorage.getItem("mediaType") === "movie") {
            this.renderPopularFilms();
          } else if (localStorage.getItem("mediaType") === "TV") {
            this.renderTvShows();
          }
        } else {
          this.renderSearchingFilm();
        }
        this.killInfinityScroll();
      }
    };
    this.onEntryByInfScrl = this.onEntInfScr.bind(this);
    this.infScrl = function() {
      this.observOptionsInfScrl = {
        rootMargin: "100px"
      };
      this.observerInfScrl = new IntersectionObserver(
        this.onEntryByInfScrl,
        this.observOptionsInfScrl
      );
      this.observerInfScrl.observe(this.refs.sentinal);
    };
    this.infinityScroll = this.infScrl.bind(this);
    this.killer = function() {
      this.observerInfScrl.disconnect();
    };
    this.killInfinityScroll = this.killer.bind(this);

    // строитель списка фильмов на "page-index"
    this.sortArray = [];
    this.flagSortName = true;
    this.flagSortDate = true;
    this.insertListItem = function(objData) {
      if (localStorage.getItem("mediaType") === "movie") {
        this.arrRes = objData.results.map(el => {
          if (localStorage.getItem("favorites")) {
            let itemsToColor = JSON.parse(localStorage.getItem("favorites"));
            itemsToColor.forEach(element => {
              if (element.id == el.id) {
                el.toBeColored = true;
              }
            });
          }
          el.release_date = new Date(el.release_date).getFullYear();
          // this.renderedData.push(el);
          return el;
        });
        this.sortArray.push(...this.arrRes);
      } else if (localStorage.getItem("mediaType") === "TV") {
        console.log("this.arrRes :", objData);
        this.arrRes = objData.results.map(el => {
          if (localStorage.getItem("favorites")) {
            let itemsToColor = JSON.parse(localStorage.getItem("favorites"));
            itemsToColor.forEach(element => {
              if (element.id == el.id) {
                el.toBeColored = true;
              }
            });
          }
          el.first_air_date = new Date(el.first_air_date).getFullYear();
          // this.renderedData.push(el);
          return el;
        });
        this.sortArray.push(...this.arrRes);
      }
      const markup = filmsTemplate(this.arrRes);
      this.refs.filmsList.insertAdjacentHTML("beforeend", markup);
      api.increment();
    };
    this.builderListItemOnPageIndex = this.insertListItem.bind(this);

    // обработчик на клик по модалке
    this.clickCloseSearchBlockHandler = function(e) {
      if (e.target.className !== "search_modal") {
        return;
      }
      this.closeSearchBlockHandler();
    };
    this.clickOnVoid = this.clickCloseSearchBlockHandler.bind(this);

    // обработчик на клик по "Esc"
    this.keyPressHandle = function(e) {
      if (e.code !== "Escape") {
        return;
      }
      this.closeSearchBlockHandler();
    };
    this.clickOnEsc = this.keyPressHandle.bind(this);

    // console.log(handleFavorites);
  }

  // ТЕЛО КЛАССА

  // обработчик открытия модального окна "search"
  openSearchBlockHandler() {
    window.addEventListener("keydown", this.clickOnEsc);
    window.addEventListener("click", this.clickOnVoid);

    this.refs.searchBlock.classList.add("open_search");
    this.refs.searchInput.focus();
    this.refs.searchForm.addEventListener("submit", this.clickOnSearchBtn);
  }

  // обработчик закрытия модального окна "search"
  closeSearchBlockHandler() {
    this.refs.searchBlock.classList.remove("open_search");
    this.refs.searchForm.removeEventListener("submit", this.clickOnSearchBtn);

    window.removeEventListener("keydown", this.clickOnEsc);
    window.removeEventListener("click", this.clickOnVoid);
  }

  // Рендеринг найденых фильмов
  renderSearchingFilm() {
    console.log("renderSearchingFilm :");
    return api
      .getSearching()
      .then(data => {
        if (data.total_pages < api.page) {
          this.killInfinityScroll();
          return;
        }
        this.builderListItemOnPageIndex(data);
        this.infinityScroll();
      })
      .catch(error => {
        console.warn(error);
      });
  }

  // Рендеринг популярных фильмов
  renderPopularFilms() {
    console.log("renderPopularFilms :");
    return api
      .getPopularFilms()
      .then(data => {
        if (data.total_pages < api.page) {
          this.killInfinityScroll();
          return;
        }
        localStorage.setItem("mediaType", "movie");
        this.builderListItemOnPageIndex(data);
        this.infinityScroll();
      })
      .catch(error => console.warn(error));
  }

  // Рендеринг TV сериалов
  renderTvShows() {
    console.log("renderTvShows :");
    return api
      .getPopularTvShows()
      .then(data => {
        if (data.total_pages < api.page) {
          this.killInfinityScroll();
          return;
        }
        localStorage.setItem("mediaType", "TV");
        this.builderListItemOnPageIndex(data);
        this.infinityScroll();
      })
      .catch(error => console.warn(error));
  }

  // очистка HTML
  clearList() {
    this.refs.filmsList.innerHTML = "";
  }
  
  // обработчик на слушатель "scroll" для кнопки "button up"
  scrollToUp() {
    console.log("bla-bla");
    if (pageYOffset > document.documentElement.clientHeight) {
      this.refs.scrollUpBtn.style.display = "block";
    } else {
      this.refs.scrollUpBtn.style.display = "none";
    }
  }

  // обработчик на кнопку "button up"
  scrollToUpHandler() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // обработчик на клик по "btn sort by name"
  clickOnBtnName() {
    this.openPreloaderUL();
    this.killInfinityScroll();
    if (this.flagSortName) {
      if (localStorage.getItem("mediaType") === "movie") {
        this.sortArrayNameAZ = this.sortArray.sort((a, z) => {
          let nameA = a.title.toLowerCase();
          let nameZ = z.title.toLowerCase();
          if (nameA < nameZ) return -1;
          if (nameA > nameZ) return 1;
        });
      } else if (localStorage.getItem("mediaType") === "TV") {
        this.sortArrayNameAZ = this.sortArray.sort((a, z) => {
          let nameA = a.original_name.toLowerCase();
          let nameZ = z.original_name.toLowerCase();
          if (nameA < nameZ) return -1;
          if (nameA > nameZ) return 1;
        });
      }
      this.sortMarkupName = filmsTemplate(this.sortArrayNameAZ);
      this.flagSortName = false;
    } else {
      if (localStorage.getItem("mediaType") === "movie") {
        this.sortArrayNameZA = this.sortArray.sort((a, z) => {
          let nameA = a.title.toLowerCase();
          let nameZ = z.title.toLowerCase();
          if (nameA > nameZ) return -1;
          if (nameA < nameZ) return 1;
        });
      } else if (localStorage.getItem("mediaType") === "TV") {
        this.sortArrayNameZA = this.sortArray.sort((a, z) => {
          let nameA = a.original_name.toLowerCase();
          let nameZ = z.original_name.toLowerCase();
          if (nameA > nameZ) return -1;
          if (nameA < nameZ) return 1;
        });
      }
      this.sortMarkupName = filmsTemplate(this.sortArrayNameZA);
      this.flagSortName = true;
    }
    this.refs.filmsList.innerHTML = this.sortMarkupName;
    this.closePreloaderUL();
  }

  // обработчик на клик по "btn sort by date"
  clickOnBtnDate() {
    this.openPreloaderUL();
    this.killInfinityScroll();
    if (this.flagSortDate) {
      if (localStorage.getItem("mediaType") === "movie") {
        this.sortArrayDateAZ = this.sortArray.sort(
          (a, z) => new Date(a.release_date) - new Date(z.release_date)
        );
      } else if (localStorage.getItem("mediaType") === "TV") {
        this.sortArrayDateAZ = this.sortArray.sort(
          (a, z) => new Date(a.first_air_date) - new Date(z.first_air_date)
        );
      }
      this.sortMarkupDate = filmsTemplate(this.sortArrayDateAZ);
      this.flagSortDate = false;
    } else {
      if (localStorage.getItem("mediaType") === "movie") {
        this.sortArrayDateZA = this.sortArray.sort(
          (a, z) => new Date(z.release_date) - new Date(a.release_date)
        );
      } else if (localStorage.getItem("mediaType") === "TV") {
        this.sortArrayDateZA = this.sortArray.sort(
          (a, z) => new Date(z.first_air_date) - new Date(a.first_air_date)
        );
      }
      this.sortMarkupDate = filmsTemplate(this.sortArrayDateZA);
      this.flagSortDate = true;
    }
    this.refs.filmsList.innerHTML = this.sortMarkupDate;
    this.closePreloaderUL();
  }

  // закрытие "preloader" через setTimeout
  closestPreloader() {
    this.closePreloader();
    this.closePreloaderUL();
  }

  // открытие "preloader"
  openPreloader() {
    this.refs.pageWrapper.style.display = "none";
    this.refs.preloader.style.display = "block";
  }

  // закрытие "preloader"
  closePreloader() {
    setTimeout(() => {
      this.refs.pageWrapper.style.display = "block";
      this.refs.preloader.style.display = "none";
    }, 1000);
  }

  // открытие "preloader" на "ul"
  /*♥*/
  openPreloaderUL() {
    this.refs.filmsList.style.display = "none";
    this.refs.preloader.style.display = "block";
  }

  // закрытие "preloader" на "ul"
  /*♥*/
  closePreloaderUL() {
    setTimeout(() => {
      this.refs.filmsList.style.display = "flex";
      this.refs.preloader.style.display = "none";
    }, 1000);
  }
}

new Mooogle();
