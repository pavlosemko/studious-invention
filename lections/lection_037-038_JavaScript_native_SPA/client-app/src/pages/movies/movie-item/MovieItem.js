import "./movie-item.scss";
import Component from "@/plugins/component";
import { AsNode } from "@/common/decorators";

export default class MovieItem extends Component {
  @AsNode
  getTemplate() {
    return `
          <div class="movieItem"> 
            <img src="${this.props.poster}" alt="${this.props.title}">
            <h1>
                ${this.props.title}
            </h1>
            <p>Rating: ${this.props.imdbrating}</p>
            <p>${this.props.plot}</p>
            <p>${this.props.director}</p>
            <p>${this.props.actors}</p>
          </div>
        `;
  }

  render() {
    return this.getTemplate();
  }
}
