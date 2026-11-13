import { describe, expect, it } from "vitest";
import { resolveCursor } from "@/components/cursor/cursorLabel";
import { messages } from "@/i18n/messages";

const html = (s: string) => { document.body.innerHTML = s; return document.body.firstElementChild!; };
const pt = messages.pt.cursor, en = messages.en.cursor;

describe("contextual cursor labels", () => {
  it("names the real action on project spines, close and zoom, in PT and EN", () => {
    const spine = html('<button class="book-spine"><img/></button>');
    expect(resolveCursor(spine.querySelector("img"), pt)).toEqual({ interactive: true, label: "Abrir livro" });
    expect(resolveCursor(spine, en).label).toBe("Open book");
    expect(resolveCursor(html('<button class="book-close"></button>'), pt).label).toBe("Fechar");
    expect(resolveCursor(html('<div class="book-overlay"></div>'), en).label).toBe("Close");
    expect(resolveCursor(html('<button class="plate-zoom"></button>'), pt).label).toBe("Ver imagem");
  });
  it("offers Open tab / Open drawer only on unselected tabs", () => {
    expect(resolveCursor(html('<button role="tab" aria-selected="false"></button>'), pt).label).toBe("Abrir aba");
    expect(resolveCursor(html('<div class="catalog-cabinet"><button role="tab" aria-selected="false"></button></div>').firstElementChild, en).label).toBe("Open drawer");
    expect(resolveCursor(html('<button role="tab" aria-selected="true"></button>'), pt)).toEqual({ interactive: true, label: undefined });
  });
  it("ignores decorative books, plain text and text inputs", () => {
    expect(resolveCursor(html('<div aria-hidden="true"><span data-decor-book></span></div>').firstElementChild, pt)).toEqual({ interactive: false });
    expect(resolveCursor(html("<p>texto</p>"), pt)).toEqual({ interactive: false });
    expect(resolveCursor(html("<input />"), pt)).toEqual({ interactive: false });
  });
  it("labels mail and new-tab links", () => {
    expect(resolveCursor(html('<a href="mailto:x@y.z">x</a>'), pt).label).toBe("Escrever e-mail");
    expect(resolveCursor(html('<a href="https://x" target="_blank">x</a>'), en).label).toBe("Open in new tab");
  });
});
