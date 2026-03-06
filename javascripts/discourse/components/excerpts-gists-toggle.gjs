import Component from "@glimmer/component";
import { fn } from "@ember/helper";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";
import DropdownMenu from "discourse/components/dropdown-menu";
import DMenu from "discourse/float-kit/components/d-menu";
import icon from "discourse/helpers/d-icon";
import { eq, or } from "truth-helpers";
import { i18n } from "discourse-i18n";

// View mode constants
const COMPACT = "compact";
const EXCERPTS = "excerpts";
const AI_SUMMARIES = "ai-summaries";

export default class ExcerptsGistsToggle extends Component {
  @service excerptState;
  @service gists;
  @service router;
  @service site;
  @service siteSettings;

  get showLabel() {
    return !this.site.mobileView && settings.show_labels;
  }

  get buttons() {
    const options = [
      {
        id: COMPACT,
        labelKey: "layout.compact",
        icon: "discourse-table",
      },
      {
        id: EXCERPTS,
        labelKey: "layout.excerpts",
        icon: "custom-table-2rows",
      },
    ];

    if (this.gists && this.siteSettings.ai_summary_gists_enabled) {
      options.push({
        id: AI_SUMMARIES,
        labelKey: "layout.ai_summaries",
        icon: "discourse-table-sparkles",
      });
    }

    return options;
  }

  get selectedOptionId() {
    if (this.gists?.currentPreference === "table-ai") {
      return AI_SUMMARIES;
    } else if (this.excerptState?.prefersExcerpt) {
      return EXCERPTS;
    }
    return COMPACT;
  }

  get currentButton() {
    const buttonPreference = this.buttons.find(
      (button) => button.id === this.selectedOptionId
    );
    return buttonPreference || this.buttons[0];
  }

  @action
  onRegisterApi(api) {
    this.dMenu = api;
  }

  @action
  onSelect(optionId) {
    if (optionId === COMPACT) {
      if (this.excerptState?.prefersExcerpt) {
        this.excerptState.toggleExcerpt();
      }
      if (this.gists?.currentPreference === "table-ai") {
        this.gists.setPreference("table");
      }
    } else if (optionId === EXCERPTS) {
      if (!this.excerptState?.prefersExcerpt) {
        this.excerptState.toggleExcerpt();
      }
      if (this.gists?.currentPreference === "table-ai") {
        this.gists.setPreference("table");
      }
    } else if (optionId === AI_SUMMARIES) {
      if (this.excerptState?.prefersExcerpt) {
        this.excerptState.toggleExcerpt();
      }
      if (this.gists?.setPreference) {
        this.gists.setPreference("table-ai");
      }
    }

    this.dMenu.close();
  }

  <template>
    {{#if (or this.gists this.excerptState)}}
      <DMenu
        @modalForMobile={{true}}
        @autofocus={{true}}
        @identifier="excerpts-gists-toggle"
        @onRegisterApi={{this.onRegisterApi}}
        @icon={{this.currentButton.icon}}
        @label={{if this.showLabel (i18n (themePrefix this.currentButton.labelKey))}}
        class="btn-default btn-icon excerpts-gists-toggle-btn {{unless this.showLabel 'no-text'}}"
      >
        <:content>
          <DropdownMenu as |dropdown|>
            {{#each this.buttons as |button|}}
              <dropdown.item
                class={{if (eq this.currentButton.id button.id) "--selected"}}
              >
                <DButton
                  @label={{themePrefix button.labelKey}}
                  @icon={{button.icon}}
                  class="btn-transparent"
                  @action={{fn this.onSelect button.id}}
                />
              </dropdown.item>
            {{/each}}
          </DropdownMenu>
        </:content>
      </DMenu>
    {{/if}}
  </template>
}
