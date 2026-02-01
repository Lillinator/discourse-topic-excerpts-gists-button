import Component from "@glimmer/component";
import { service } from "@ember/service";
import ExcerptsGistsToggle from "../../components/excerpts-gists-toggle";

export default class ExcerptsGistsFilterToggle extends Component {
  @service topicThumbnails;

  get shouldShow() {
    return !this.topicThumbnails?.enabledForRoute;
  }

  <template>
    {{#if this.shouldShow}}
      <ExcerptsGistsToggle />
    {{/if}}
  </template>
}
