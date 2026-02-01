import Component from "@glimmer/component";
import { service } from "@ember/service";
import ExcerptsGistsToggle from "../../components/excerpts-gists-toggle";

export default class ExcerptsGists extends Component {
  @service topicThumbnails; // avoid Topic Thumbnails theme component

  get shouldShow() {
    return !this.topicThumbnails?.enabledForRoute;
  }

  <template>
    {{#if this.shouldShow}}
      <ExcerptsGistsToggle />
    {{/if}}
  </template>
}
