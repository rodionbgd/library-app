import BookFilter from "@/components/BookFilter.vue";
import ButtonUI from "@/components/UI/ButtonUI.vue";

import { describe, test, expect, vi, beforeEach } from "vitest";

import { mount } from "@vue/test-utils";
import { useRoute } from "vue-router";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
}));

describe("Filtering books", () => {
  let wrapper;
  const filter = {
    title: "Kingdom",
    author: "Charles",
    rate: 4,
  };

  beforeEach(() => {
    useRoute.mockImplementationOnce(() => ({
      query: filter,
    }));
    wrapper = mount(BookFilter);
  });

  test("Updating filter", async () => {
    const getAuthor = () => wrapper.get("#author-filter");
    await getAuthor().trigger("input");
    expect(wrapper.emitted("update-filter")[0][0]).toStrictEqual(filter);
  });
  test("Resetting filter", async () => {
    const getTitle = () => wrapper.get("#title-filter");
    expect(getTitle().element.value).toBe(filter.title);
    await wrapper.getComponent(ButtonUI).trigger("click.prevent");
    expect(getTitle().element.value).toBeFalsy();
  });
});
