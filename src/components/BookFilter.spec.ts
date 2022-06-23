import BookFilter from "@/components/BookFilter.vue";
import type Filter from "@/components/BookFilter.vue";
import ButtonUI from "@/components/UI/ButtonUI.vue";

import { describe, test, expect, vi, beforeEach } from "vitest";
import type { SpyInstance } from "vitest";

import { mount, VueWrapper } from "@vue/test-utils";
import { useRoute } from "vue-router";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
}));

describe("Filtering books", () => {
  let wrapper: VueWrapper;
  const filter: Filter = {
    title: "Kingdom",
    author: "Charles",
    rate: "4",
  };

  beforeEach(() => {
    (useRoute as unknown as SpyInstance).mockImplementationOnce(() => ({
      query: filter,
    }));
    wrapper = mount(BookFilter, {
      global: {
        stubs: {
          FontAwesomeIcon: true,
        },
      },
    });
  });

  test("Updating filter", async () => {
    const getAuthor = () => wrapper.get("#author-filter");
    await getAuthor().trigger("input");
    expect((wrapper.emitted("update-filter") as string[])[0][0]).toStrictEqual(
      filter
    );
  });
  test("Resetting filter", async () => {
    const getTitle = () => wrapper.get("#title-filter");
    expect((<HTMLInputElement>getTitle().element).value).toBe(filter.title);
    await wrapper.getComponent(ButtonUI).trigger("click.prevent");
    expect((<HTMLInputElement>getTitle().element).value).toBeFalsy();
  });
});
