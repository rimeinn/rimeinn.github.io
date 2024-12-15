export const algebraTypes = [
  "xform",
  "xlit",
  "derive",
  "fuzz",
  "abbrev",
  "erase",
] as const;
export const algebraOptions = algebraTypes.map((x) => ({ value: x, label: x }));

export interface Algebra {
  type: (typeof algebraTypes)[number];
  from: RegExp;
  to: string;
}

export const parseAlgebra = (algebra: string) => {
  const match = algebra.match(/(xform|xlit|derive|fuzz|abbrev|erase)(.+)/);
  if (!match) return;
  const [_, type, rest] = match;
  const delimiter = rest[0];
  const [from, to] = rest.slice(1).split(delimiter);
  return { type, from: new RegExp(from), to } as Algebra;
};

export const executeAlgebraList = (
  algebraList: Algebra[],
  syllables: string[]
) => {
  let currentSyllables = new Set(syllables);
  let results: string[][] = [];
  for (const algebra of algebraList) {
    const nextSyllables = new Set<string>();
    switch (algebra.type) {
      case "xform":
        [...currentSyllables].forEach((s) =>
          nextSyllables.add(s.replace(algebra.from, algebra.to))
        );
        break;
      case "xlit":
        [...currentSyllables].forEach((s) => {
          const chars = [...s].map((c) => {
            const index = algebra.from.source.indexOf(c);
            return index === -1 ? c : algebra.to[index];
          });
          nextSyllables.add(chars.join(""));
        });
        break;
      case "derive":
      case "fuzz":
      case "abbrev":
        [...currentSyllables].forEach((s) => nextSyllables.add(s));
        [...currentSyllables].forEach((s) =>
          nextSyllables.add(s.replace(algebra.from, algebra.to))
        );
        break;
      case "erase":
        [...currentSyllables].forEach((s) => {
          if (!algebra.from.test(s)) {
            nextSyllables.add(s);
          }
        });
        break;
    }
    currentSyllables = nextSyllables;
    results.push([...currentSyllables].sort());
  }
  return results;
};
