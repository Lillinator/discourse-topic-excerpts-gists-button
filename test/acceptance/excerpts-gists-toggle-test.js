import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import { acceptance } from "discourse/tests/helpers/qunit-helpers";

acceptance("Excerpts Gists Toggle", function (needs) {
  needs.user();
  needs.settings({
    show_labels: true,
  });
  needs.site();

  test("displays toggle button when excerptState service exists", async function (assert) {
    await visit("/latest");
    
    assert
      .dom(".excerpts-gists-toggle-btn")
      .exists("toggle button is rendered");
  });

  test("shows compact mode by default", async function (assert) {
    await visit("/latest");
    
    assert
      .dom(".excerpts-gists-toggle-trigger .d-icon-discourse-table")
      .exists("compact icon is displayed");
  });

  test("opens menu on click", async function (assert) {
    await visit("/latest");
    await click(".excerpts-gists-toggle-btn");
    
    assert
      .dom(".dropdown-menu")
      .exists("dropdown menu is opened");
    
    assert
      .dom(".dropdown-menu .dropdown-menu-item")
      .exists({ count: 2 }, "shows compact and excerpts options");
  });

  test("switches to excerpts mode", async function (assert) {
    await visit("/latest");
    await click(".excerpts-gists-toggle-btn");
    await click(".dropdown-menu .dropdown-menu-item:nth-child(2) button");
    
    assert
      .dom(".excerpts-gists-toggle-trigger .d-icon-custom-table-2rows")
      .exists("excerpts icon is displayed");
  });

  test("current selection is marked as selected", async function (assert) {
    await visit("/latest");
    await click(".excerpts-gists-toggle-btn");
    
    assert
      .dom(".dropdown-menu .dropdown-menu-item:first-child")
      .hasClass("--selected", "compact option is marked selected");
  });

  test("hides label on mobile", async function (assert) {
    this.site.mobileView = true;
    
    await visit("/latest");
    
    assert
      .dom(".excerpts-gists-toggle-trigger")
      .hasClass("no-text", "no-text class applied on mobile");
  });
});

acceptance("Excerpts Gists Toggle - with AI", function (needs) {
  needs.user();
  needs.settings({
    show_labels: true,
  });
  needs.site();
  needs.siteSettings({
    ai_summary_gists_enabled: true,
  });
  needs.pretender((server, helper) => {
    // Mock AI gists endpoint if needed
  });

  test("shows AI summaries option when enabled", async function (assert) {
    await visit("/latest");
    await click(".excerpts-gists-toggle-btn");
    
    assert
      .dom(".dropdown-menu .dropdown-menu-item")
      .exists({ count: 3 }, "shows all three options including AI");
  });

  test("switches to AI summaries mode", async function (assert) {
    await visit("/latest");
    await click(".excerpts-gists-toggle-btn");
    await click(".dropdown-menu .dropdown-menu-item:nth-child(3) button");
    
    assert
      .dom(".excerpts-gists-toggle-trigger .d-icon-discourse-table-sparkles")
      .exists("AI summaries icon is displayed");
  });

  test("closes menu after selection", async function (assert) {
    await visit("/latest");
    await click(".excerpts-gists-toggle-btn");
    await click(".dropdown-menu .dropdown-menu-item:nth-child(2) button");
    
    assert
      .dom(".dropdown-menu")
      .doesNotExist("menu is closed after selection");
  });
});

acceptance("Excerpts Gists Toggle - without services", function (needs) {
  needs.user();
  
  test("does not render when services unavailable", async function (assert) {
    // Mock scenario where excerptState and gists are null
    await visit("/latest");
    
    assert
      .dom(".excerpts-gists-toggle-btn")
      .doesNotExist("toggle not rendered without services");
  });
});
