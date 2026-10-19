/** Optional day trips from a journey stop, so every prefecture can be visited. */
export interface DayTrip {
  id: string;
  name: string;
  /** Japanese name with {kanji|kana} furigana markup */
  jp: string;
  /** prefecture id (see prefectures.ts) */
  pref: string;
  /** the stop you leave from (and return to) */
  from: string;
  emoji: string;
  facts: string[];
  /** a short kana phrase to hear on the trip */
  phrase: [string, string];
}

export const DAY_TRIPS: DayTrip[] = [
  {
    id: 'mito', name: 'Mito, Ibaraki', jp: '{水戸|みと}', pref: 'ibaraki', from: 'tokyo', emoji: '🌸',
    facts: [
      'Kairakuen in Mito is one of Japan’s three great gardens, famous for 3,000 plum trees that bloom in late winter.',
      'Mito is the home of nattō — sticky fermented soybeans, sold in straw wrappers as a souvenir.',
      'Nearby Fukuroda Falls tumbles down four steps and freezes into ice in very cold winters.',
    ],
    phrase: ['うめの はなが きれいですね。', 'The plum blossoms are beautiful, aren’t they?'],
  },
  {
    id: 'narita', name: 'Narita, Chiba', jp: '{成田|なりた}', pref: 'chiba', from: 'asakusa', emoji: '🛕',
    facts: [
      'Naritasan Shinshō-ji is a huge temple over 1,000 years old, near Japan’s busiest international airport.',
      'The old street leading to the temple is lined with shops grilling unagi (eel).',
      'Chiba grows more peanuts than anywhere else in Japan.',
    ],
    phrase: ['うなぎを たべて みたいです。', 'I’d like to try eating eel.'],
  },
  {
    id: 'kawaguchiko', name: 'Lake Kawaguchi, Yamanashi', jp: '{河口湖|かわぐちこ}', pref: 'yamanashi', from: 'fuji', emoji: '🗻',
    facts: [
      'Lake Kawaguchi is one of the Fuji Five Lakes, with Mt. Fuji reflected in the water on calm days.',
      'The Chūreitō pagoda with Mt. Fuji and cherry blossoms behind it is one of Japan’s most photographed views.',
      'Yamanashi is famous for grapes, peaches and hōtō — thick noodles stewed with pumpkin in miso.',
    ],
    phrase: ['ふじさんが みずうみに うつって います。', 'Mt. Fuji is reflected in the lake.'],
  },
];

export const DAY_TRIP_FISH = 10;
