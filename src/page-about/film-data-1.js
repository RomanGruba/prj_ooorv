import {
  getSingleFilmTitle,
  getSingleFilm,
  getSingleFilmContries,
  getSingleFilmTagline,
  getSingleGenres,
  getSingleRuntime,
  getSingleOwerview,
  getSinglePoster,
  getSinglePosterLittle,
  getSingleDirector,
  getSingleDataRealise,
  getSingleNumberOfEpisodes,
  getSingleScreenPlay
} from '../js/api';



class FilmInfo2 {
  constructor(id, mediaType) {
    this.filmId = id;
    this.mediaType = mediaType;
    this.apy_key = "ed5781108818e96397f9efe7bddd0923";
    this.refs = {
      filmTitle: document.querySelector('.image-mov_title'),
      filmContries: document.querySelector('[data-field="country"]'),
      filmTagline: document.querySelector('[data-field="tagline"]'),
      filmINDB: document.querySelector('[data-field="tagline-idb"]'),
      filmGenres: document.querySelector('[data-field="genre"]'),
      filmRuntime: document.querySelector('[data-field="time"]'),
      filmEpisodes: document.querySelector('[data-field="timeline-episodes"]'),
      filmOverview: document.querySelector('.movie-descr'),
      filmPoster1: document.querySelector('.image-mov1'),
      filmPoster2: document.querySelector('.image-mov2'),
      filmDirector: document.querySelector('[data-field="director"]'),
      filmCreatedBy: document.querySelector('[data-field="director-created_by"]'),
      filmRealiseFull: document.querySelector('.data-down'),
      fimlScreenPlay: document.querySelector('[data-field="scenario"]'),
      filmStatus: document.querySelector('[data-field="screenplay-status"]')
    }

    this.renderAll()
  }

  renderAll() {
    getSingleFilm(this.filmId, this.mediaType).then(data => {
      this.renderTitle();
      this.renderContries();
      this.renderTagline(data);
      this.renderGenre(data);
      this.renderRuntime(data);
      this.renderOverview(data);
      this.renderPost1(data);
      this.renderPost2(data);
      this.renderDirector(data);
      this.renderRealiseFull(data);
      this.renderScreenPlay(data);
    })
  }

  renderTitle() {
    getSingleFilmTitle(this.filmId, this.mediaType).then(data => {
      const title = data.original_name || data.original_title;
      if (title == data.original_title) {
        const titleRelease = data.release_date;
        const titleReleaseAct = new Date (titleRelease).getFullYear();
        this.refs.filmTitle.insertAdjacentHTML('afterbegin', `${title} (${titleReleaseAct})`)
      } else {
        const titleTVRelease = data.first_air_date;
        const titleTVReleaseAct = new Date (titleTVRelease).getFullYear();
        this.refs.filmTitle.insertAdjacentHTML('afterbegin', `${title} (${titleTVReleaseAct})`);
      }
    })
  }

  renderContries() {
    getSingleFilmContries(this.filmId, this.mediaType).then(data => {
      const contryMov = data.production_countries && data.production_countries.reduce((contries, el, indx) => {
        if (indx > 0) {
          return contries + ', ' + el.name
        }
        return contries + el.name
      }, '') || data.origin_country[0];
      this.refs.filmContries.textContent = contryMov;
    })
  }

  renderTagline() {
    getSingleFilmTagline(this.filmId, this.mediaType).then(data => {
      const taglineMov = data.tagline || data.vote_average;
      if (taglineMov == data.tagline){
      this.refs.filmTagline.textContent = taglineMov;
    } else {
      const iMDB = "Rating";
      this.refs.filmTagline.textContent = taglineMov;
      this.refs.filmINDB.textContent = iMDB;
    }
    })
  }

  renderGenre() {
    getSingleGenres(this.filmId, this.mediaType).then(data => {
      const genreMov = data.genres.reduce((g, el, indx) => {
        if (indx > 0) {
          return g + ', ' + el.name
        }
        return g + el.name
      }, '');
      this.refs.filmGenres.textContent = genreMov;

    })
  }

  renderRuntime() {
    getSingleRuntime(this.filmId, this.mediaType).then(data => {
      const runtimeMov = data.runtime || data.number_of_seasons;
      if (runtimeMov === data.runtime) {
        this.refs.filmRuntime.insertAdjacentHTML('afterbegin', `${runtimeMov} min / ${getTimeFromMins(runtimeMov)} `);
        function getTimeFromMins(runtimeMov) {
          let hours = pad(Math.trunc(runtimeMov / 60));
          let minutes = pad(runtimeMov % 60);
          return hours + ':' + minutes;

          function pad(value) {
            return String(value).padStart(2, '0');
          }
        }
      } else {
        const numberEpisodes = "Seasons / Episodes"
        const numberOfEpisodes = data.number_of_episodes;
        this.refs.filmRuntime.insertAdjacentHTML('afterbegin', `${runtimeMov} seasons / ${numberOfEpisodes} episodes`);
        this.refs.filmEpisodes.textContent = numberEpisodes;
      }
    })
  }

  renderOverview() {
    getSingleOwerview(this.filmId, this.mediaType).then(data => {
      const overviewMov = data.overview;
      this.refs.filmOverview.insertAdjacentHTML('afterbegin', overviewMov);
    })
  }

  renderPost1() {
    getSinglePosterLittle(this.filmId, this.mediaType).then(data => {
      const posterMov = data.backdrop_path;
      this.refs.filmPoster1.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${posterMov}")`;
    })
  }

  renderPost2() {
    getSinglePoster(this.filmId, this.mediaType).then(data => {
      const posterMov2 = data.poster_path;
      this.refs.filmPoster2.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${posterMov2}")`;
    })
  }

  renderDirector() {
    getSingleDirector(this.filmId, this.mediaType).then(data => {
      const direct = data.credits && data.credits.crew.find(crew => crew.job === "Director").name
      || data.created_by && data.created_by.reduce((creater, el, indx) => {
        if (indx > 0) {
          return creater + ', ' + el.name
        }
        return creater + el.name
      }, '');
      if (data.credits){
        this.refs.filmDirector.textContent = direct;
      } else {
        const createdBy = "Created by";
        this.refs.filmDirector.textContent = direct;
        this.refs.filmCreatedBy.textContent = createdBy;
      }
    })
  }

  renderRealiseFull(data) {
    const realiseFullData = data.release_date;
    this.refs.filmRealiseFull.textContent = realiseFullData;
  }

  renderScreenPlay() {
    getSingleScreenPlay(this.filmId, this.mediaType).then(data => {
      const screenPlaeer = data.credits && data.credits.crew.find(crew => crew.job === "Screenplay").name || checkProduct(data.in_production);
      function checkProduct() {
        if (data.in_production === true) {
          return "In production";
        } else {
          return "Finish";
        }
      }
      if (data.credits){
        this.refs.fimlScreenPlay.textContent = screenPlaeer;
      } else {
        const statysTV = "Status";
        this.refs.fimlScreenPlay.textContent = screenPlaeer;
        this.refs.filmStatus.textContent = statysTV;
      }
    })
  }
}


