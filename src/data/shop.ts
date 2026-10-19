/** Things to buy with fish 🐟: traditional foods and treasures. Each one bought is a trophy. */
export type ShopKind = 'food' | 'treasure';

export interface ShopItem {
  id: string;
  kind: ShopKind;
  name: string;
  /** Japanese name, may use {kanji|kana} furigana markup */
  jp: string;
  emoji: string;
  about: string;
  cost: number;
  /** regional specialty: only sold after you reach this stop */
  from?: string;
}

const F = (id: string, name: string, jp: string, emoji: string, cost: number, about: string, from?: string): ShopItem => ({ id: `food:${id}`, kind: 'food', name, jp, emoji, cost, about, from });
const T = (id: string, name: string, jp: string, emoji: string, cost: number, about: string, from?: string): ShopItem => ({ id: `treasure:${id}`, kind: 'treasure', name, jp, emoji, cost, about, from });

export const SHOP: ShopItem[] = [
  // --- food ---
  F('onigiri', 'Onigiri', 'おにぎり', '🍙', 10, 'A rice ball wrapped in nori seaweed, often with salmon or pickled plum inside — the classic picnic food.'),
  F('dango', 'Dango', 'だんご', '🍡', 12, 'Chewy rice-flour dumplings on a stick, sometimes glazed with sweet soy sauce.'),
  F('miso', 'Miso soup', 'みそ{汁|しる}', '🥣', 12, 'Soup made from fermented soybean paste, served with almost every traditional meal.'),
  F('taiyaki', 'Taiyaki', 'たい{焼|や}き', '🐟', 15, 'A fish-shaped cake filled with sweet red bean paste. A cat’s favorite shape!'),
  F('mochi', 'Mochi', 'もち', '🍥', 15, 'Pounded sticky rice. At New Year, families eat mochi for good luck.'),
  F('edamame', 'Edamame', '{枝豆|えだまめ}', '🫛', 12, 'Young soybeans boiled in salty water — pop them out of the pod!'),
  F('dorayaki', 'Dorayaki', 'どら{焼|や}き', '🥞', 18, 'Two fluffy pancakes with sweet bean paste in the middle.'),
  F('tempura', 'Tempura', '{天|てん}ぷら', '🍤', 25, 'Shrimp and vegetables in a light, crispy batter.'),
  F('sushi', 'Nigiri sushi', '{寿司|すし}', '🍣', 30, 'Vinegared rice topped with fresh fish. Kaiten-zushi restaurants send plates around on a belt.'),
  F('ramen', 'Ramen', 'ラーメン', '🍜', 25, 'Noodles in rich broth — every region has its own style.'),
  F('udon', 'Udon', 'うどん', '🍲', 20, 'Thick wheat noodles in a gentle dashi broth.'),
  F('yakitori', 'Yakitori', '{焼|や}き{鳥|とり}', '🍢', 20, 'Grilled chicken skewers, brushed with sweet sauce or sprinkled with salt.'),
  F('gyoza', 'Gyoza', 'ぎょうざ', '🥟', 20, 'Pan-fried dumplings, crispy on the bottom.'),
  F('kakigori', 'Kakigori', 'かき{氷|ごおり}', '🍧', 18, 'Fluffy shaved ice with syrup — the taste of a Japanese summer.'),
  F('matcha', 'Matcha', '{抹茶|まっちゃ}', '🍵', 20, 'Powdered green tea whisked with a bamboo whisk, central to the tea ceremony.'),
  F('bento', 'Ekiben', '{駅弁|えきべん}', '🍱', 30, 'A station bento box. Every big station sells its own local version for the train ride.'),
  F('sukiyaki', 'Sukiyaki', 'すき{焼|や}き', '🥘', 40, 'Beef, tofu and vegetables simmered in a sweet soy broth at the table.'),
  F('takoyaki', 'Takoyaki', 'たこ{焼|や}き', '🐙', 20, 'Octopus batter balls from Osaka.', 'osaka'),
  F('okonomiyaki', 'Okonomiyaki', 'お{好|この}み{焼|や}き', '🥞', 25, 'A savory pancake — “grilled how you like it”.', 'hiroshima'),
  F('yatsuhashi', 'Yatsuhashi', '{八|や}ツ{橋|はし}', '🍥', 20, 'Cinnamon-flavored rice sweets from Kyoto.', 'kyoto'),
  F('castella', 'Castella', 'カステラ', '🍰', 25, 'Honey sponge cake, from Portuguese traders in Nagasaki.', 'nagasaki'),
  F('sataandagi', 'Sata andagi', 'サーターアンダギー', '🍩', 20, 'Okinawan fried doughnut balls.', 'okinawa'),
  F('misoramen', 'Miso ramen', 'みそラーメン', '🍜', 30, 'Sapporo’s buttery, corn-topped miso ramen.', 'sapporo'),
  F('hidabeef', 'Hida beef skewer', '{飛騨牛|ひだぎゅう}', '🥩', 45, 'Melt-in-your-mouth beef grilled at Takayama’s street stalls.', 'takayama'),
  F('ikasomen', 'Fresh squid', 'いか{刺|さ}し', '🦑', 30, 'Hakodate’s famous see-through fresh squid.', 'hakodate'),
  // --- treasures ---
  T('daruma', 'Daruma doll', 'だるま', '🎎', 40, 'A round wishing doll. Paint one eye when you make a wish and the other when it comes true.'),
  T('kokeshi', 'Kokeshi doll', 'こけし', '🪆', 45, 'A simple wooden doll with a painted face, a craft of the Tohoku region.'),
  T('furin', 'Wind chime', '{風鈴|ふうりん}', '🎐', 35, 'A glass chime that tinkles in the breeze — its sound is said to make summer feel cooler.'),
  T('sensu', 'Folding fan', '{扇子|せんす}', '🪭', 35, 'A paper folding fan, used in dance and on hot days.'),
  T('furoshiki', 'Furoshiki', '{風呂敷|ふろしき}', '🧣', 30, 'A square cloth for wrapping and carrying gifts — reusable and stylish.'),
  T('omamori', 'Omamori', 'お{守|まも}り', '🧧', 30, 'A good-luck charm from a shrine, for safe travels or passing exams.'),
  T('kendama', 'Kendama', 'けん{玉|だま}', '🎯', 40, 'A cup-and-ball toy. Catch the ball on the spike for big cheers!'),
  T('koinobori', 'Carp streamer', 'こいのぼり', '🎏', 50, 'Carp-shaped windsocks flown for Children’s Day on May 5.'),
  T('origami', 'Origami crane', '{折|お}り{鶴|づる}', '🕊️', 25, 'A paper crane. Folding a thousand is said to grant a wish.'),
  T('yukata', 'Yukata', '{浴衣|ゆかた}', '👘', 80, 'A light cotton kimono worn at summer festivals and hot spring inns.'),
  T('geta', 'Geta sandals', '{下駄|げた}', '🩴', 45, 'Wooden sandals that go “karan-koron” as you walk.'),
  T('chochin', 'Paper lantern', '{提灯|ちょうちん}', '🏮', 40, 'A glowing paper lantern for festivals and shop fronts.'),
  T('tenugui', 'Tenugui towel', '{手|て}ぬぐい', '🧻', 25, 'A thin printed cotton towel — use it as a headband, wrap, or wall art.'),
  T('maneki', 'Golden maneki-neko', '{招|まね}き{猫|ねこ}', '🐈', 120, 'The luckiest cat of all. A trophy for true travelers!'),
  T('katana', 'Toy samurai sword', '{刀|かたな}', '⚔️', 90, 'A wooden practice sword, like the ones used in kendo.', 'kumamoto'),
  T('shisa', 'Shisa guardian', 'シーサー', '🦁', 60, 'A lion-dog to guard your home, from Okinawa.', 'okinawa'),
  T('nebuta', 'Mini Nebuta float', 'ねぶた', '🐉', 70, 'A tiny glowing warrior lantern from Aomori’s festival.', 'aomori'),
];

export const SHOP_BY_ID = new Map(SHOP.map((i) => [i.id, i]));
