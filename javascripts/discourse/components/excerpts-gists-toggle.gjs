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

/** ExcerptsGistsToggle Component
 * 
 * Unified dropdown toggle for switching between topic list view modes:
 * - Compact: Standard topic list (no excerpts, no AI summaries)
 * - Excerpts: Shows post excerpts in topic list
 * - AI Summaries: Shows AI-generated topic summaries (requires AI plugin)
 * 
 * Integrates with:
 * - Topic Excerpts button functionality (excerptState service)
 * - AI Summary Gists button functionality (gists service)
 * - Topic Thumbnails theme component (respects enabledForRoute)
 * 
 * Used in connectors:
 * - before-create-topic-button (topic lists)
 * - after-filter-navigation-menu (filtered views)
 * - user-messages-controls-bottom (PMs) */

export default class ExcerptsGistsToggle extends Component {
  @service excerptState; // Manages excerpt display preference
  @service gists; // Manages AI summary display preference (from AI plugin)
  @service router;
  @service site;
  @service siteSettings;

  /** Determines if button label text should be shown
   * @returns {boolean} - false on mobile or if show_labels setting is disabled */

  get showLabel() {
    return !this.site.mobileView && settings.show_labels;
  }

  /** Builds available view mode options
   * AI Summaries option only included if gists service exists and enabled in settings
   * @returns {Array<{id: string, labelKey: string, icon: string}>} */

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

    // Conditionally add AI summaries option if available
    if (this.gists && this.siteSettings.ai_summary_gists_enabled) {
      options.push({
        id: AI_SUMMARIES,
        labelKey: "layout.ai_summaries",
        icon: "discourse-table-sparkles",
      });
    }

    return options;
  }

  /** Determines current active view mode based on service states
   * @returns {string} - One of: COMPACT, EXCERPTS, or AI_SUMMARIES */

  get selectedOptionId() {
    if (this.gists?.currentPreference === "table-ai") {
      return AI_SUMMARIES;
    } else if (this.excerptState?.prefersExcerpt) {
      return EXCERPTS;
    }
    return COMPACT;
  }

  /** Gets button config for currently selected view mode
   * @returns {Object} - Button object with id, labelKey, and icon */

  get currentButton() {
    const buttonPreference = this.buttons.find(
      (button) => button.id === this.selectedOptionId
    );
    return buttonPreference || this.buttons[0];
  }

  /** Stores DMenu API reference for programmatic control
   * @param {Object} api - DMenu component API */

  @action
  onRegisterApi(api) {
    this.dMenu = api;
  }

  /** Handles view mode selection and updates relevant services
   * Ensures only one view mode is active at a time
   * @param {string} optionId - Selected view mode (COMPACT, EXCERPTS, or AI_SUMMARIES) */

  @action
  onSelect(optionId) {
    if (optionId === COMPACT) {
      // Disable excerpts if active
      if (this.excerptState?.prefersExcerpt) {
        this.excerptState.toggleExcerpt();
      }
      // Disable AI summaries if active
      if (this.gists?.currentPreference === "table-ai") {
        this.gists.setPreference("table");
      }
    } else if (optionId === EXCERPTS) {
      // Enable excerpts if not active
      if (!this.excerptState?.prefersExcerpt) {
        this.excerptState.toggleExcerpt();
      }
      // Disable AI summaries (mutually exclusive)
      if (this.gists?.currentPreference === "table-ai") {
        this.gists.setPreference("table");
      }
    } else if (optionId === AI_SUMMARIES) {
      // Disable excerpts (mutually exclusive)
      if (this.excerptState?.prefersExcerpt) {
        this.excerptState.toggleExcerpt();
      }
      // Enable AI summaries
      if (this.gists?.setPreference) {
        this.gists.setPreference("table-ai");
      }
    }

    this.dMenu.close();
  }

<template>
    {{! Only render if at least one service is available }}
    {{#if (or this.gists this.excerptState)}}
      <DMenu
        @modalForMobile={{true}}
        @autofocus={{true}}
        @identifier="excerpts-gists-toggle"
        @onRegisterApi={{this.onRegisterApi}}
        @icon={{this.currentButton.icon}}
        @label={{if this.showLabel (themePrefix this.currentButton.labelKey)}}
        @triggerClass="btn-default btn-icon excerpts-gists-toggle-btn {{unless this.showLabel 'no-text'}}"
      >
        <:content>
          {{! Dropdown menu with all available view modes }}
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
