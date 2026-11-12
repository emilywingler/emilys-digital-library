import type { ReactNode } from "react";
import { Flourish } from "@/components/decor/Ornaments";

interface Props {
  runningHead: string;
  title: string;
  folio: number;
  /** Which side of the spread; mirrors the corner flourishes. */
  side: "left" | "right";
  children: ReactNode;
}

/** One parchment page with running head, title, frame flourishes and folio. Reusable. */
export function BookPage({ runningHead, title, folio, side, children }: Props) {
  const outer = side === "left" ? "left-2" : "right-2";
  const rot = side === "left" ? "" : "rotate-90";
  const rotB = side === "left" ? "-rotate-90" : "rotate-180";
  return (
    <div className={`relative flex flex-col px-6 py-8 sm:px-10 md:px-10 ${side === "left" ? "lg:pl-40" : "lg:pr-40"}`}>
      <Flourish className={`pointer-events-none absolute top-2 h-7 w-7 text-paper-muted/50 ${outer} ${rot}`} />
      <Flourish className={`pointer-events-none absolute bottom-2 h-7 w-7 text-paper-muted/50 ${outer} ${rotB}`} />
      <p className="text-center text-[0.65rem] uppercase tracking-[0.3em] text-paper-muted">{runningHead}</p>
      <h3 className="mt-3 text-center font-masthead text-3xl">{title}</h3>
      <div className="mx-auto mt-3 w-16 border-t border-rule" />
      <div className="mt-6 flex-1">{children}</div>
      <p className="mt-8 text-center font-display italic text-paper-muted">— {folio} —</p>
    </div>
  );
}
