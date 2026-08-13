// content/legal/types.ts
// Shared shape for the legal documents. Keeping the text as data rather
// than JSX means the wording can be replaced from the approved Word file
// without touching markup.

export type Block =
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] };

export type LegalSection = {
  heading: string;
  blocks: Block[];
};

export type LegalDoc = {
  title: string;
  lastUpdated: string;
  intro: Block[];
  sections: LegalSection[];
};
