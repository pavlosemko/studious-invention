import "./movie-item.scss";
import Component from "@/plugins/component";
import { AsNode } from "@/common/decorators";

export default class MovieItem extends Component {
  @AsNode
  getTemplate() {
    return `
          <div class="movieItem"> 
            <img src="${this.props.Poster}" alt="${this.props.Title}">
            <h1>
                ${this.props.Title}
            </h1>
            <p>Rating: ${this.props.imdbRating}</p>
            <p>${this.props.Plot}</p>
            <p>${this.props.Director}</p>
            <p>${this.props.Actors}</p>
          </div>
        `;
  }

  render() {
    return this.getTemplate();
  }
}
