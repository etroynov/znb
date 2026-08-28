import type { Access, AccessResult, Where } from 'payload';

const isWhere = (result: AccessResult): result is Where =>
  typeof result === 'object' && result !== null;

/**
 * Access results form a lattice: `true` is "every document", `false` is "no
 * document", a `Where` is some subset in between. That makes them composable —
 * these two combinators are the whole abstraction.
 */
export const or =
  (...rules: Access[]): Access =>
  async (args) => {
    const results = await Promise.all(rules.map((rule) => rule(args)));
    if (results.some((result) => result === true)) return true;

    const [only, ...rest] = results.filter(isWhere);
    if (!only) return false;
    return rest.length === 0 ? only : { or: [only, ...rest] };
  };

export const and =
  (...rules: Access[]): Access =>
  async (args) => {
    const results = await Promise.all(rules.map((rule) => rule(args)));
    if (results.some((result) => result === false)) return false;

    const [only, ...rest] = results.filter(isWhere);
    if (!only) return true;
    return rest.length === 0 ? only : { and: [only, ...rest] };
  };