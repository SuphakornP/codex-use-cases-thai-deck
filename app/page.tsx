import deckSource from "../index.html?raw";

import { DeckBootstrap } from "./deck-bootstrap";

function extractBody(source: string): string {
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  if (!body) {
    throw new Error("The presentation source is missing a body element");
  }
  return body;
}

const deckBody = extractBody(deckSource);

export default function Home() {
  return (
    <>
      <div className="deck-root" dangerouslySetInnerHTML={{ __html: deckBody }} />
      <DeckBootstrap />
    </>
  );
}
