import { Lexer, Tagger } from "pos";

const lexer = new Lexer();
const tagger = new Tagger();

function getLemmata(input: string): string[] {
  try {
    return lexer.lex(input);
  } catch (err) {
    return [];
  }
}

function getTags(lemmata: string[]): TaggedWord[] {
  try {
    return tagger.tag(lemmata);
  } catch (err) {
    return [];
  }
}

type TaggedWord = [string, string];

// TODO: This can be done waaay better.
const removeSubject = (input: string) => {
  return input.slice(input.indexOf(":") + 1).trim();
};

export const checkPhrasing = (message: string) => {
  const inputWithoutSubject = removeSubject(message);
  const lowerCased = inputWithoutSubject.toLocaleLowerCase();

  const tagged = getTags(getLemmata(lowerCased));

  if (tagged.length < 1) {
    return { errors: ["Message must not be empty."] };
  }

  const [_, tag] = tagged[0];

  if (!["VB", "VBP"].includes(tag)) {
    return { errors: ["Message must start with an imperative verb."] };
  }

  return { errors: [] };
};
