import { Lexer, Tagger } from "pos";
import { Error } from "./types";

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

export const checkPhrasing = (message: string): Error[] => {
  const inputWithoutSubject = removeSubject(message);
  const lowerCased = inputWithoutSubject.toLocaleLowerCase();

  const tagged = getTags(getLemmata(lowerCased));

  if (tagged.length < 1) {
    return [{ message: "Message must not be empty." }];
  }

  const [word, tag] = tagged[0];

  if (!["VB", "VBP"].includes(tag)) {
    const error: Error = {
      message: "Start with an imperative verb.",
    };

    if (tag.charAt(0) === "V") {
      error.suggestions = [
        `Consider replacing "${word}" with its imperative form.`,
      ];
    }

    return [error];
  }
};
