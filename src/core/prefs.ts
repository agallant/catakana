/** Per-tab UI preferences (difficulty, chart tab). sessionStorage can throw in locked-down browsers. */
export function getPref(key: string): string | null {
  try {
    return sessionStorage.getItem(`catakana.${key}`);
  } catch {
    return null;
  }
}

export function setPref(key: string, value: string): void {
  try {
    sessionStorage.setItem(`catakana.${key}`, value);
  } catch {
    /* ignore */
  }
}

export function getLevel(): 1 | 2 | 3 {
  const n = Number(getPref('level') ?? '1');
  return n === 2 || n === 3 ? n : 1;
}
