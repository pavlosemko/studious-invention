import "./movies.scss";
import Component from "@/plugins/component";
import { AsNode, SaveContainer } from "@/common/decorators";
import Header from "@/pages/movies/header/Header";
import MovieItem from "@/pages/movies/movie-item/MovieItem";
import httpService from "@/common/serives/Http.service";
import { mutation_types, store } from "@/store/store";
import Search from "@/pages/movies/search/Search";

export default class Movies extends Component {
  updateTemplate(template) {
    const header = new Header();
    const search = new Search({
      onSearchSuccess: this.handleSearchSuccess.bind(this),
    });

    return this.replaceSlot(
      template,
      {
        key: 'slot[name="header"]',
        replacer: () => header.render(),
      },
      {
        key: 'slot[name="search"]',
        replacer: () => search.render(),
      },
    );
  }

  async processSearch(searchData) {
    const query = new URLSearchParams(searchData).toString();
    try {
      const { data } = await httpService.get(`/search?${query}`);
      if (data.response === "False") {
        throw new Error(data.error);
      }
      return Promise.resolve(data);
    } catch (e) {
      store.dispatch(mutation_types.SET_ALERT, {
        type: "alert-danger",
        message: e.message,
      });
      return Promise.reject(e);
    }
  }

  handleSearchSuccess(searchData = null) {
    const moviesNode = this.$container.querySelector(".movies");
    if (searchData) {
      this.processSearch(searchData)
        .then((data) => {
          if (data) {
            const movieItem = new MovieItem(data);
            moviesNode.innerHTML = "";
            moviesNode.append(movieItem.render());
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  @AsNode
  getTemplate() {
    return `
            <main class="movies-page">
                <slot name="header"></slot>
                <div class="movies"></div>
            </main>
        `;
  }

  @SaveContainer
  render() {
    return this.updateTemplate(this.getTemplate());
  }
}
