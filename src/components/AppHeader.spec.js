import ButtonUI from "@/components/UI/ButtonUI.vue";
import AppHeader from "@/components/AppHeader.vue";
import MenuItem from "@/components/MenuItem.vue";
import BookFilter from "@/components/BookFilter.vue";

import { useRoute, useRouter } from "vue-router";
import { describe, test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe.skip("AppHeader test", () => {
  const getButton = (wrapper) => wrapper.getComponent(ButtonUI);
  test("Toggling button", async () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: {
          AppLink: true,
          BookFilter: true,
        },
      },
    });

    const getMenuItem = () => wrapper.getComponent(MenuItem);

    expect(getButton(wrapper).text()).toBe("Filter");
    expect(getMenuItem()).toBeTruthy();

    await getButton(wrapper).trigger("click");

    expect(getMenuItem).toThrowError();
    expect(getButton(wrapper).text()).toBe("Menu");
  });
  test("Updating route", async () => {
    const route = {
      name: "home",
      query: {
        title: "Kingdom",
        author: "Charles",
      },
    };
    useRoute.mockImplementationOnce(() => ({
      query: route.query,
    }));
    const push = vi.fn();
    useRouter.mockImplementationOnce(() => ({
      push,
    }));
    const wrapper = mount(AppHeader, {
      global: {
        stubs: {
          AppLink: true,
        },
      },
    });

    await getButton(wrapper).trigger("click");
    const getBookFilter = () => wrapper.getComponent(BookFilter);
    await getBookFilter().vm.$emit("update-filter", route.query);
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(route);
  });
});
