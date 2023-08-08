import "./search.scss";
import Component from "@/plugins/component";
import { AsNode, BindEvent, SaveContainer } from "@/common/decorators";
import { router } from "@/router/router";
import httpService from "@/common/serives/Http.service";
import { mutation_types, store } from "@/store/store";
import { data } from "autoprefixer";

export default class Search extends Component {
  #searchData = {};
  onInputChangeHandler(event) {
    const { value, name } = event.target;
    this.#searchData[name] = value;
  }

  onClickHandler(event) {
    event.preventDefault();
    const query = new URLSearchParams(this.#searchData).toString();
    if (query) {
      httpService
        .get(`/search?${query}`)
        .then(({ data }) => {
          if (data.Response === "False") {
            store.dispatch(mutation_types.SET_ALERT, {
              type: "alert-danger",
              message: data.Error,
            });
            throw new Error(data.Error);
          }
          this.props.onSearchSuccess(data);
        })
        .catch(() => {});
    }
  }
  updateTemplate(template) {
    return template;
  }

  @AsNode
  getTemplate() {
    return `
          <div class="input-group me-3">
            <input id="search" type="text" name="t" class="form-control" aria-label="Text input with segmented dropdown button">
            <button id="searchBtn" class="btn btn-outline-primary" type="button"><i class="bi bi-search"></i></button>
        </div>
        `;
  }
  bindEvent(node) {
    const button = node.querySelector("#searchBtn"),
      input = node.querySelector("#search");
    button.addEventListener("click", this.onClickHandler.bind(this));
    input.addEventListener("change", this.onInputChangeHandler.bind(this));
  }
  @SaveContainer
  @BindEvent
  render() {
    return this.updateTemplate(this.getTemplate());
  }
}
