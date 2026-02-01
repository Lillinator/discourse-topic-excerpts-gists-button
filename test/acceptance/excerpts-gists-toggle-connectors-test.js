import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import { acceptance } from "discourse/tests/helpers/qunit-helpers";

acceptance("Excerpts Gists Toggle - before-create-topic-button Connector", function (needs) {
  needs.user();
  needs.settings({
    show_labels: true,
  });

  test("renders on /latest", async function (assert) {
    await visit("/latest");
    
    assert
      .dom(".before-create-topic-button .excerpts-gists-toggle-btn")
      .exists("renders on latest");
  });

  test("renders on /new", async function (assert) {
    await visit("/new");
    
    assert
      .dom(".before-create-topic-button .excerpts-gists-toggle-btn")
      .exists("renders on new");
  });

  test("renders on /top", async function (assert) {
    await visit("/top");
    
    assert
      .dom(".before-create-topic-button .excerpts-gists-toggle-btn")
      .exists("renders on top");
  });

  test("renders on /unread", async function (assert) {
    await visit("/unread");
    
    assert
      .dom(".before-create-topic-button .excerpts-gists-toggle-btn")
      .exists("renders on unread");
  });

  test("renders on category pages", async function (assert) {
    await visit("/c/bug/1");
    
    assert
      .dom(".before-create-topic-button .excerpts-gists-toggle-btn")
      .exists("renders on category page");
  });

  test("renders on tag pages", async function (assert) {
    await visit("/tag/test");
    
    assert
      .dom(".before-create-topic-button .excerpts-gists-toggle-btn")
      .exists("renders on tag page");
  });

  test("does NOT render on individual topic pages", async function (assert) {
    await visit("/t/some-topic/123");
    
    assert
      .dom(".before-create-topic-button .excerpts-gists-toggle-btn")
      .doesNotExist("does not render on topic page");
  });

  test("does NOT render on user profile", async function (assert) {
    await visit("/u/eviltrout");
    
    assert
      .dom(".before-create-topic-button .excerpts-gists-toggle-btn")
      .doesNotExist("does not render on user profile");
  });
});

acceptance("Excerpts Gists Toggle - after-filter-navigation-menu Connector", function (needs) {
  needs.user();
  needs.settings({
    show_labels: true,
  });

  test("renders on /latest", async function (assert) {
    await visit("/latest");
    
    assert
      .dom(".after-filter-navigation-menu .excerpts-gists-toggle-btn")
      .exists("renders on latest");
  });

  test("renders on /new", async function (assert) {
    await visit("/new");
    
    assert
      .dom(".after-filter-navigation-menu .excerpts-gists-toggle-btn")
      .exists("renders on new");
  });

  test("renders on /top", async function (assert) {
    await visit("/top");
    
    assert
      .dom(".after-filter-navigation-menu .excerpts-gists-toggle-btn")
      .exists("renders on top");
  });

  test("renders on /unread", async function (assert) {
    await visit("/unread");
    
    assert
      .dom(".after-filter-navigation-menu .excerpts-gists-toggle-btn")
      .exists("renders on unread");
  });

  test("renders on category pages", async function (assert) {
    await visit("/c/bug/1");
    
    assert
      .dom(".after-filter-navigation-menu .excerpts-gists-toggle-btn")
      .exists("renders on category page");
  });

  test("renders on tag pages", async function (assert) {
    await visit("/tag/test");
    
    assert
      .dom(".after-filter-navigation-menu .excerpts-gists-toggle-btn")
      .exists("renders on tag page");
  });

  test("does NOT render on individual topic pages", async function (assert) {
    await visit("/t/some-topic/123");
    
    assert
      .dom(".after-filter-navigation-menu .excerpts-gists-toggle-btn")
      .doesNotExist("does not render on topic page");
  });

  test("does NOT render on user messages", async function (assert) {
    await visit("/u/eviltrout/messages");
    
    assert
      .dom(".after-filter-navigation-menu .excerpts-gists-toggle-btn")
      .doesNotExist("does not render on user messages");
  });
});

acceptance("Excerpts Gists Toggle - user-messages-controls-bottom Connector", function (needs) {
  needs.user();
  needs.settings({
    show_labels: true,
  });

  test("renders on /u/:username/messages", async function (assert) {
    await visit("/u/eviltrout/messages");
    
    assert
      .dom(".user-messages-controls-bottom .excerpts-gists-toggle-btn")
      .exists("renders on user messages");
  });

  test("renders on /u/:username/messages/inbox", async function (assert) {
    await visit("/u/eviltrout/messages/inbox");
    
    assert
      .dom(".user-messages-controls-bottom .excerpts-gists-toggle-btn")
      .exists("renders on messages inbox");
  });

  test("renders on /u/:username/messages/sent", async function (assert) {
    await visit("/u/eviltrout/messages/sent");
    
    assert
      .dom(".user-messages-controls-bottom .excerpts-gists-toggle-btn")
      .exists("renders on sent messages");
  });

  test("renders on /u/:username/messages/archive", async function (assert) {
    await visit("/u/eviltrout/messages/archive");
    
    assert
      .dom(".user-messages-controls-bottom .excerpts-gists-toggle-btn")
      .exists("renders on archived messages");
  });

  test("does NOT render on /latest", async function (assert) {
    await visit("/latest");
    
    assert
      .dom(".user-messages-controls-bottom .excerpts-gists-toggle-btn")
      .doesNotExist("does not render on latest");
  });

  test("does NOT render on individual topic pages", async function (assert) {
    await visit("/t/some-topic/123");
    
    assert
      .dom(".user-messages-controls-bottom .excerpts-gists-toggle-btn")
      .doesNotExist("does not render on topic page");
  });

  test("does NOT render on user profile summary", async function (assert) {
    await visit("/u/eviltrout/summary");
    
    assert
      .dom(".user-messages-controls-bottom .excerpts-gists-toggle-btn")
      .doesNotExist("does not render on user profile");
  });
});

acceptance("Excerpts Gists Toggle - Cross-Connector Route Coverage", function (needs) {
  needs.user();
  needs.settings({
    show_labels: true,
  });

  test("topic list routes have appropriate connector coverage", async function (assert) {
    await visit("/latest");
    
    const beforeCreateButton = document.querySelector(
      ".before-create-topic-button .excerpts-gists-toggle-btn"
    );
    const afterFilterMenu = document.querySelector(
      ".after-filter-navigation-menu .excerpts-gists-toggle-btn"
    );
    const pmControls = document.querySelector(
      ".user-messages-controls-bottom .excerpts-gists-toggle-btn"
    );
    
    assert.ok(
      beforeCreateButton || afterFilterMenu,
      "at least one topic list connector renders"
    );
    assert.notOk(
      pmControls,
      "PM connector does not render on topic lists"
    );
  });

  test("PM routes only have PM connector", async function (assert) {
    await visit("/u/eviltrout/messages");
    
    const beforeCreateButton = document.querySelector(
      ".before-create-topic-button .excerpts-gists-toggle-btn"
    );
    const afterFilterMenu = document.querySelector(
      ".after-filter-navigation-menu .excerpts-gists-toggle-btn"
    );
    const pmControls = document.querySelector(
      ".user-messages-controls-bottom .excerpts-gists-toggle-btn"
    );
    
    assert.ok(
      pmControls,
      "PM connector renders on PM routes"
    );
    assert.notOk(
      beforeCreateButton && afterFilterMenu,
      "topic list connectors do not render on PM routes"
    );
  });
});
