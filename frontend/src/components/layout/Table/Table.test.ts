import { getByRole } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import Mock from "./Mock.astro";

describe("Table", () => {
  it("should render a full table layout when using the mock component", async () => {
    const { root, close } = await renderAstroComponentToDom(Mock);

    const table = getByRole(root, "table");
    expect(table).toBeTruthy();

    const caption = table.querySelector("caption");
    if (!caption) throw new Error("Expected a <caption> element");
    expect(caption.textContent.trim()).toBe("A list of your recent orders.");

    const headerCells = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent.trim());
    expect(headerCells).toEqual(["Order", "Status", "Customer", "Total"]);

    const bodyRows = table.querySelectorAll("tbody tr");
    expect(bodyRows.length).toBe(4);

    const firstBodyRow = bodyRows.item(0);
    const firstBodyRowCells = Array.from(firstBodyRow.querySelectorAll("td")).map(td => td.textContent.trim());
    expect(firstBodyRowCells).toEqual([
      "ORD1001",
      "Shipped",
      "Alice Smith",
      "$120.00",
    ]);

    const footerCells = Array.from(table.querySelectorAll("tfoot td")).map(td => td.textContent.trim());
    expect(footerCells).toEqual(["Total Orders", "$450.00"]);

    await close();
  });

  it("should apply wrapper and styling classes when using the mock component", async () => {
    const { root, close } = await renderAstroComponentToDom(Mock);

    const table = getByRole(root, "table");
    const wrapper = table.parentElement;
    expect(wrapper?.className.includes("overflow-auto")).toBe(true);

    const firstBodyRow = table.querySelector("tbody tr");
    if (!firstBodyRow) throw new Error("Expected at least one <tbody><tr> row");
    expect(firstBodyRow.className.includes("border-b")).toBe(true);
    expect(firstBodyRow.className.includes("hover:bg-muted/50")).toBe(true);

    const footer = table.querySelector("tfoot");
    if (!footer) throw new Error("Expected a <tfoot> element");
    expect(footer.className.includes("bg-muted/50")).toBe(true);

    await close();
  });
});
