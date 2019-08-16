const api_key = "ed5781108818e96397f9efe7bddd0923";
const baseUrl = `https://api.themoviedb.org/3`;

export function getSingleFilmTrailer(id) {
  const url = `${baseUrl}/movie/${id}/videos?api_key=${api_key}`;
  return fetch(url).then(res => res.json());
}

export function getSingleFilmActors(id) {
  const url = `${baseUrl}/movie/${id}?api_key=${api_key}&append_to_response=credits`;
  return fetch(url).then(res => res.json());
}

export function getSingleFilm(id) {
  const url = `${baseUrl}/movie/${id}?api_key=${api_key}`;
  return fetch(url).then(res => res.json());
}

export function getSingleFilmTitle(id) {
  const url = `${baseUrl}/movie/${id}?api_key=${api_key}&append_to_response=original_title`;
  return fetch(url).then(res => res.json());
}
export function getSingleFilmContries(id) {
  const url = `${baseUrl}/movie/${id}?api_key=${api_key}&append_to_response=production_contries`;
  return fetch(url).then(res => res.json());
}

export function getSingleFilmTagline(id) {
  const url = `${baseUrl}/movie/${id}?api_key=${api_key}&append_to_response=tagline`;
  return fetch(url).then(res => res.json());
}

export function getPopularFilms() {
  const url = `${baseUrl}/movie/popular?api_key=${api_key}&append_to_response=credits`;
  return fetch(url).then(res => res.json());
}

export function getSingleFilmFrames(id) {
  const url = `${baseUrl}/movie/${id}/images?api_key=${api_key}`;
  return fetch(url).then(res => res.json());
}

export function getSingleFeedback(id) {
  const url = `${baseUrl}/movie/${id}/reviews?api_key=${api_key}`;
  return fetch(url).then(res => res.json());
}
export function getSingleGenres(id) {
  const url = `${baseUrl}/movie/${id}?api_key=${api_key}&append_to_response=genres`;
  return fetch(url).then(res => res.json());
}

export function getSingleRuntime(id) {
  const url = `${baseUrl}/movie/${id}?api_key=${api_key}&append_to_response=runtime`;
  return fetch(url).then(res => res.json());
}

export function getSingleOwerview(id) {
  const url = `${baseUrl}/movie/${id}?api_key=${api_key}&append_to_response=overview`;
  return fetch(url).then(res => res.json());
}

export function getSinglePoster(id) {
  const url = `${baseUrl}/movie/${id}?api_key=${api_key}&append_to_response=poster_path`;
  return fetch(url).then(res => res.json());
}
