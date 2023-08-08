import "./movies.scss";
import Component from "@/plugins/component";
import { AsNode, SaveContainer } from "@/common/decorators";
import Header from "@/pages/movies/header/Header";
import MovieItem from "@/pages/movies/movie-item/MovieItem";

export default class Movies extends Component {
  updateTemplate(template) {
    const header = new Header({
      onSearchSuccess: this.handleSearchSuccess.bind(this),
    });

    return this.replaceSlot(template, {
      key: 'slot[name="header"]',
      replacer: () => header.render(),
    });
  }

  handleSearchSuccess(searchData = null) {
    const moviesNode = this.$container.querySelector(".movies");
    if (searchData) {
      const movieItem = new MovieItem(searchData);
      moviesNode.innerHTML = "";
      moviesNode.append(movieItem.render());
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
