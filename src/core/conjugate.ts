/** Japanese verb conjugation for drills: godan, ichidan and the irregulars する / くる (incl. ～する compounds). */
export type VerbClass = 'godan' | 'ichidan' | 'suru' | 'kuru';
export type Form = 'masu' | 'te' | 'ta' | 'nai' | 'potential' | 'volitional';

export const FORM_LABEL: Record<Form, string> = {
  masu: 'polite ～ます',
  te: 'て-form',
  ta: 'past ～た',
  nai: 'negative ～ない',
  potential: 'potential (can do)',
  volitional: 'volitional (let’s)',
};

/** Verbs ending in -iru/-eru that are nevertheless godan. */
const GODAN_RU = new Set(['はいる', 'はしる', 'かえる', 'しる', 'まいる', 'いる:need', 'きる:cut', 'へる', 'すべる', 'しゃべる', 'にぎる', 'ける', 'あせる', 'かぎる', 'ちる', 'まじる', 'のめる']);

const ROW: Record<string, [string, string, string, string]> = {
  // dictionary ending -> [a, i, e, o]
  う: ['わ', 'い', 'え', 'お'],
  く: ['か', 'き', 'け', 'こ'],
  ぐ: ['が', 'ぎ', 'げ', 'ご'],
  す: ['さ', 'し', 'せ', 'そ'],
  つ: ['た', 'ち', 'て', 'と'],
  ぬ: ['な', 'に', 'ね', 'の'],
  ぶ: ['ば', 'び', 'べ', 'ぼ'],
  む: ['ま', 'み', 'め', 'も'],
  る: ['ら', 'り', 'れ', 'ろ'],
};

const I_E_SOUNDS = 'いきぎしじちぢにひびぴみりえけげせぜてでねへべぺめれ';

export function classify(verb: string): VerbClass {
  if (verb === 'くる') return 'kuru';
  if (verb.endsWith('する')) return 'suru';
  if (verb.endsWith('る') && verb.length >= 2 && I_E_SOUNDS.includes(verb[verb.length - 2]!) && !GODAN_RU.has(verb)) return 'ichidan';
  return 'godan';
}

export function conjugate(verb: string, form: Form): string {
  const cls = classify(verb);
  if (cls === 'suru') {
    const pre = verb.slice(0, -2);
    return pre + { masu: 'します', te: 'して', ta: 'した', nai: 'しない', potential: 'できる', volitional: 'しよう' }[form];
  }
  if (cls === 'kuru') return { masu: 'きます', te: 'きて', ta: 'きた', nai: 'こない', potential: 'こられる', volitional: 'こよう' }[form];
  if (cls === 'ichidan') {
    const stem = verb.slice(0, -1);
    return stem + { masu: 'ます', te: 'て', ta: 'た', nai: 'ない', potential: 'られる', volitional: 'よう' }[form];
  }
  const last = verb.slice(-1);
  const stem = verb.slice(0, -1);
  const row = ROW[last];
  if (!row) return verb;
  const [a, i, e, o] = row;
  switch (form) {
    case 'masu':
      return stem + i + 'ます';
    case 'nai':
      return verb === 'ある' ? 'ない' : stem + a + 'ない';
    case 'potential':
      return stem + e + 'る';
    case 'volitional':
      return stem + o + 'う';
    case 'te':
    case 'ta': {
      const t = form === 'te' ? 'て' : 'た';
      const d = form === 'te' ? 'で' : 'だ';
      if (verb === 'いく') return 'いっ' + t;
      if ('うつる'.includes(last)) return stem + 'っ' + t;
      if ('むぶぬ'.includes(last)) return stem + 'ん' + d;
      if (last === 'く') return stem + 'い' + t;
      if (last === 'ぐ') return stem + 'い' + d;
      return stem + 'し' + t; // す
    }
  }
}

/** Verbs nobody does on purpose: their potential / volitional forms are odd, so drills skip them. */
const NON_VOLITIONAL = new Set(['わかる', 'ある', 'いる', 'できる', 'つかれる', 'はれる', 'くもる', 'はじまる', 'おわる', 'とまる', 'ふる']);

export function formMakesSense(verb: string, form: Form): boolean {
  return !((form === 'potential' || form === 'volitional') && NON_VOLITIONAL.has(verb));
}

/** Is this word a verb in dictionary form? (our vocab glosses verbs as "to …") */
export function isVerbEntry(reading: string, en: string): boolean {
  return en.startsWith('to ') && /[うくぐすつぬぶむる]$/.test(reading);
}

/** Plausible wrong answers: other forms, the other verb class's rules, and classic て-form slips. */
export function wrongForms(verb: string, form: Form): string[] {
  const right = conjugate(verb, form);
  const out = new Set<string>();
  const cls = classify(verb);
  // wrong class: treat ichidan as godan and vice versa (る-verbs only)
  if (cls === 'ichidan') {
    GODAN_RU.add(verb);
    out.add(conjugate(verb, form));
    GODAN_RU.delete(verb);
  } else if (cls === 'godan' && verb.endsWith('る')) {
    out.add(verb.slice(0, -1) + { masu: 'ます', te: 'て', ta: 'た', nai: 'ない', potential: 'られる', volitional: 'よう' }[form]);
  }
  if (form === 'te' || form === 'ta') {
    const stem = verb.slice(0, -1);
    const t = form === 'te' ? 'て' : 'た';
    out.add(stem + 'っ' + t);
    out.add(stem + 'ん' + (form === 'te' ? 'で' : 'だ'));
    out.add(stem + 'い' + t);
  }
  for (const f of ['masu', 'te', 'ta', 'nai', 'potential', 'volitional'] as Form[]) if (f !== form) out.add(conjugate(verb, f));
  out.delete(right);
  out.delete(verb);
  return [...out];
}

/** Forms the learner has met by journey stop: ます (Nikko), て (Yakushima), た (Koyasan), potential (Matsumoto), ない (Nagano), volitional (Kawagoe). */
export const FORM_UNLOCK: Record<Form, string> = {
  masu: 'nikko',
  te: 'yakushima',
  ta: 'koyasan',
  potential: 'matsumoto',
  nai: 'nagano',
  volitional: 'kawagoe',
};
