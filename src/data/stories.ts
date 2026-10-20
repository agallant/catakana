/** Short graded reading passages. Text uses {kanji|kana} furigana markup; each has comprehension questions. */
export interface Story {
  id: string;
  title: string;
  emoji: string;
  /** stop id from which the story becomes available */
  from: string;
  /** paragraphs */
  text: string[];
  questions: { q: string; options: string[]; answer: number }[];
}

export const STORIES: Story[] = [
  {
    id: 'mochi-day', title: 'Mochi’s day', emoji: '🐱', from: 'nikko',
    text: [
      'わたしは モチです。ねこです。{毎日|まいにち} {六時|ろくじ}に {起|お}きます。',
      '{朝|あさ}ごはんに さかなを {食|た}べます。それから、{外|そと}で あそびます。',
      '{午後|ごご}は {日|ひ}の あたる まどの {前|まえ}で ねます。{夜|よる}は {早|はや}く ねます。',
    ],
    questions: [
      { q: 'What time does Mochi get up?', options: ['6:00', '7:00', '9:00'], answer: 0 },
      { q: 'What does Mochi eat for breakfast?', options: ['Fish', 'Bread', 'Rice'], answer: 0 },
      { q: 'Where does Mochi sleep in the afternoon?', options: ['In front of a sunny window', 'In a box', 'On the roof'], answer: 0 },
    ],
  },
  {
    id: 'station', title: 'At the station', emoji: '🚉', from: 'ise',
    text: [
      'きのう、{電車|でんしゃ}で いせへ {行|い}きました。{駅|えき}は とても {大|おお}きかったです。',
      '{右|みぎ}に きっぷうりばが ありました。{左|ひだり}に おみやげの {店|みせ}が ありました。',
      'わたしは きっぷを {買|か}って、{電車|でんしゃ}に のりました。{電車|でんしゃ}の {中|なか}で おべんとうを {食|た}べました。',
    ],
    questions: [
      { q: 'How did the writer travel to Ise?', options: ['By train', 'By bus', 'By plane'], answer: 0 },
      { q: 'What was on the left?', options: ['A souvenir shop', 'The ticket office', 'A hotel'], answer: 0 },
      { q: 'What did the writer eat on the train?', options: ['A boxed lunch', 'Ramen', 'Nothing'], answer: 0 },
    ],
  },
  {
    id: 'onsen-letter', title: 'A letter from Beppu', emoji: '✉️', from: 'beppu',
    text: [
      'おかあさんへ。{元気|げんき}ですか。わたしは いま べっぷに います。',
      'べっぷは おんせんが とても {多|おお}いです。{町|まち}の あちこちから ゆげが でています。',
      'あした、すなゆに {入|はい}りたいです。でも、あついのは ちょっと こわいです。また {手紙|てがみ}を {書|か}きます。',
    ],
    questions: [
      { q: 'Who is the letter to?', options: ['Mother', 'A teacher', 'A friend'], answer: 0 },
      { q: 'What comes out all over town?', options: ['Steam', 'Smoke from fires', 'Snow'], answer: 0 },
      { q: 'What does the writer want to try tomorrow?', options: ['A sand bath', 'Swimming in the sea', 'Climbing a mountain'], answer: 0 },
    ],
  },
  {
    id: 'hikonyan', title: 'The lucky cat of Hikone', emoji: '🏯', from: 'hikone',
    text: [
      'むかし、ある{殿様|とのさま}が {寺|てら}の {前|まえ}を {歩|ある}いていました。',
      'すると、{白|しろ}い ねこが {手|て}を ふって、{殿様|とのさま}を よびました。{殿様|とのさま}が {寺|てら}に {入|はい}ると、すぐに つよい {雨|あめ}が ふって、かみなりが おちました。',
      'ねこの おかげで {殿様|とのさま}は ぶじでした。それから、{手|て}を ふる ねこは しあわせを よぶと {言|い}われています。',
    ],
    questions: [
      { q: 'What did the white cat do?', options: ['Waved to call the lord', 'Ran away', 'Slept on the gate'], answer: 0 },
      { q: 'What happened after the lord entered the temple?', options: ['A storm with lightning came', 'The temple closed', 'He fell asleep'], answer: 0 },
      { q: 'What is the beckoning cat said to bring?', options: ['Happiness / good luck', 'Rain', 'Fish'], answer: 0 },
    ],
  },
  {
    id: 'snow-monkeys', title: 'Snow monkeys', emoji: '🐒', from: 'nagano',
    text: [
      'ながのの {山|やま}の {中|なか}に、おんせんに {入|はい}る さるが います。',
      'ふゆは とても さむいので、さるは あたたかい おゆに {入|はい}らなければ なりません。',
      'さるは おゆの {中|なか}で {目|め}を とじて、{気持|きも}ちよさそうに しています。{人間|にんげん}と {同|おな}じですね。',
    ],
    questions: [
      { q: 'Why do the monkeys get in the hot water?', options: ['Because winter is very cold', 'To catch fish', 'To wash their food'], answer: 0 },
      { q: 'How do the monkeys look in the water?', options: ['Comfortable', 'Scared', 'Angry'], answer: 0 },
      { q: 'Where do the monkeys live?', options: ['In the mountains of Nagano', 'In Tokyo', 'On an island'], answer: 0 },
    ],
  },
  {
    id: 'kawagoe-plan', title: 'Plans for next year', emoji: '🗓️', from: 'kawagoe',
    text: [
      'にほんに {来|き}て、もう {一年|いちねん}に なります。いろいろな {町|まち}に {行|い}きました。',
      'いちばん {楽|たの}しかったのは、とっとりの さきゅうで らくだに のったことです。',
      'らいねんは もっと {漢字|かんじ}を {勉強|べんきょう}する つもりです。そして、ほっかいどうの ちいさい {島|しま}にも {行|い}ってみたいです。',
    ],
    questions: [
      { q: 'How long has the writer been in Japan?', options: ['One year', 'One week', 'Ten years'], answer: 0 },
      { q: 'What was the most fun?', options: ['Riding a camel at the dunes', 'Eating ramen', 'Visiting a castle'], answer: 0 },
      { q: 'What does the writer plan to do next year?', options: ['Study more kanji', 'Go home', 'Buy a car'], answer: 0 },
    ],
  },
  {
    id: 'akabeko', title: 'The broken akabeko', emoji: '🐂', from: 'aizu',
    text: [
      'あいづで {赤|あか}べこを {買|か}いました。でも、ホテルに {帰|かえ}る とちゅうで おとして しまいました。',
      '{首|くび}が とれて、もう ゆれなく なって しまいました。とても ざんねんでした。',
      'つぎの {日|ひ}、おみせの おじいさんに {見|み}せると、すぐに なおして くれました。「これで また {幸|しあわ}せが くるはずだよ」と {言|い}われました。',
    ],
    questions: [
      { q: 'What happened to the akabeko?', options: ['It was dropped and broke', 'It was stolen', 'It got wet'], answer: 0 },
      { q: 'Who fixed it?', options: ['The old man at the shop', 'The hotel staff', 'Nobody'], answer: 0 },
      { q: 'What did the old man say would come again?', options: ['Happiness', 'Rain', 'The bus'], answer: 0 },
    ],
  },
  {
    id: 'wildcat-search', title: 'Looking for the wildcat', emoji: '🐆', from: 'iriomote',
    text: [
      'いりおもてじまに {着|つ}いた ばかりの {日|ひ}、やまねこを {探|さが}しに {行|い}きました。',
      'ガイドさんに よると、やまねこは {夜|よる}に うごくことが {多|おお}いらしいです。でも、{見|み}られることは ほとんど ないそうです。',
      'けっきょく やまねこには {会|あ}えませんでしたが、みちで「やまねこに {注意|ちゅうい}」という {看板|かんばん}を {見|み}つけました。それだけで うれしく なりました。',
    ],
    questions: [
      { q: 'When are the wildcats usually active?', options: ['At night', 'At noon', 'Only in winter'], answer: 0 },
      { q: 'Did the writer see a wildcat?', options: ['No', 'Yes, several', 'Yes, one'], answer: 0 },
      { q: 'What did the writer find on the road?', options: ['A “watch for wildcats” sign', 'A lost cat', 'A map'], answer: 0 },
    ],
  },
  {
    id: 'moving-castle', title: 'The castle that moved', emoji: '🏯', from: 'hirosaki',
    text: [
      '{弘前城|ひろさきじょう}の {天守|てんしゅ}は、{江戸|えど}{時代|じだい}から {残|のこ}っている {貴重|きちょう}な {建物|たてもの}です。',
      'ところが、{下|した}の {石垣|いしがき}が {外|そと}に ふくらんで きて、このままでは {崩|くず}れる おそれが ありました。',
      'そこで 2015{年|ねん}、{重|おも}さ 400トンの {天守|てんしゅ}を ジャッキで {持|も}ち{上|あ}げ、レールの {上|うえ}を {約|やく}70メートル {移動|いどう}させる ことに なりました。',
      '{工事|こうじ}の あいだも {観光客|かんこうきゃく}は {天守|てんしゅ}に {入|はい}る ことが できたそうです。{城|しろ}が {元|もと}の {場所|ばしょ}に {戻|もど}るのは、{石垣|いしがき}の {修理|しゅうり}が {終|お}わってからです。',
    ],
    questions: [
      { q: 'Why was the keep moved?', options: ['The stone wall below it might collapse', 'To make room for a road', 'To get a better view of the cherry trees'], answer: 0 },
      { q: 'How far was it moved?', options: ['About 70 m', 'About 7 m', 'About 700 m'], answer: 0 },
      { q: 'Could tourists visit during the work?', options: ['Yes', 'No', 'Only at night'], answer: 0 },
    ],
  },
  {
    id: 'battleship-diary', title: 'A diary from Battleship Island', emoji: '🏚️', from: 'gunkanjima',
    text: [
      'おじいさんは {子供|こども}の ころ、{軍艦島|ぐんかんじま}に {住|す}んで いました。{父親|ちちおや}が {炭鉱|たんこう}で {働|はたら}いて いたからです。',
      '{島|しま}は {狭|せま}いものの、{学校|がっこう}も {病院|びょういん}も {映画館|えいがかん}も ありました。{屋上|おくじょう}には {田|た}んぼまで あったそうです。',
      '{人口|じんこう}{密度|みつど}が {東京|とうきょう}の {九倍|きゅうばい}も あった ため、{部屋|へや}は とても {狭|せま}かったと いいます。',
      'しかし {石油|せきゆ}の {時代|じだい}に なると {炭鉱|たんこう}は {閉山|へいざん}し、{島|しま}は {無人島|むじんとう}に なりました。「{寂|さび}しいけれど、{大切|たいせつ}な {思|おも}い{出|で}だ」と おじいさんは {言|い}います。',
    ],
    questions: [
      { q: 'Why did the grandfather live on the island?', options: ['His father worked in the coal mine', 'He was a fisherman', 'He was a teacher there'], answer: 0 },
      { q: 'What was surprisingly found on a rooftop?', options: ['A rice paddy', 'A swimming pool', 'A shrine'], answer: 0 },
      { q: 'Why did the island become empty?', options: ['The mine closed when oil replaced coal', 'A typhoon destroyed it', 'It became a military base'], answer: 0 },
    ],
  },
  {
    id: 'konpira-dog', title: 'The pilgrim dog', emoji: '🐕', from: 'kotohira',
    text: [
      '{江戸|えど}{時代|じだい}、こんぴらさんへの お{参|まい}りは {多|おお}くの {人|ひと}の {夢|ゆめ}でした。でも、{遠|とお}くに {住|す}む {人|ひと}や {病気|びょうき}の {人|ひと}は {旅|たび}に {出|で}られません。',
      'そこで、{飼|か}い{主|ぬし}の かわりに {犬|いぬ}が {旅|たび}を する ことが ありました。{首|くび}に お{金|かね}と {名前|なまえ}を {書|か}いた {袋|ふくろ}を つけて {出発|しゅっぱつ}したのです。',
      '{道|みち}で {会|あ}った {旅人|たびびと}たちは {犬|いぬ}に {食|た}べ{物|もの}を あげたり、{次|つぎ}の {町|まち}まで つれて {行|い}ったり しました。',
      'みんなの おかげで、{犬|いぬ}は お{札|ふだ}を もらって {無事|ぶじ}に {家|いえ}へ {帰|かえ}る ことが できたそうです。',
    ],
    questions: [
      { q: 'Why did dogs make the pilgrimage?', options: ['In place of owners who could not travel', 'To guard the shrine', 'To deliver letters'], answer: 0 },
      { q: 'What did the dog carry around its neck?', options: ['A bag with money and a name', 'A bell', 'A map'], answer: 0 },
      { q: 'How did the dog get home?', options: ['Thanks to help from travellers', 'By boat alone', 'Its owner came to fetch it'], answer: 0 },
    ],
  },
  {
    id: 'kumano-walk', title: 'Walking the Kumano Kodō', emoji: '🥾', from: 'kumano',
    text: [
      '{朝|あさ}{早|はや}く {宿|やど}を {出|で}て、{古道|こどう}を {歩|ある}き{始|はじ}めました。{杉|すぎ}の {森|もり}の {中|なか}は しずかで、{苔|こけ}の {石段|いしだん}が つづいて います。',
      '{途中|とちゅう}で {雨|あめ}が {降|ふ}り{出|だ}しました。{道|みち}が すべりやすく なったにも かかわらず、{休|やす}まずに {進|すす}もうと しました。',
      'すると、{後|うし}ろから {来|き}た おばあさんが「{急|いそ}がないで。{熊野|くまの}の {道|みち}は ゆっくり {歩|ある}く ものですよ」と {言|い}いました。',
      'おばあさんと いっしょに {休憩|きゅうけい}しながら {歩|ある}いた おかげで、{那智|なち}の {滝|たき}に {着|つ}いた ときも {元気|げんき}でした。{滝|たき}の {音|おと}を {聞|き}いて、{来|き}て よかったと {思|おも}いました。',
    ],
    questions: [
      { q: 'What happened partway along the trail?', options: ['It started to rain', 'The writer got lost', 'A bear appeared'], answer: 0 },
      { q: 'What did the old woman advise?', options: ['Don’t hurry — walk slowly', 'Turn back now', 'Take the bus'], answer: 0 },
      { q: 'How did the writer feel at Nachi Falls?', options: ['Glad to have come, and still energetic', 'Exhausted and cold', 'Disappointed'], answer: 0 },
    ],
  },
{
    id: 'sado-gold', title: 'The gold island', emoji: '🪙', from: 'sado',
    text: [
      'さどがしまでは、{江戸|えど}{時代|じだい}の はじめに {金山|きんざん}が {見|み}つかりました。そのため、{島|しま}には {全国|ぜんこく}から {人|ひと}が {集|あつ}まるように なりました。',
      '{金|きん}を とるために、{人々|ひとびと}は {山|やま}の {中|なか}に {長|なが}い トンネルを {掘|ほ}りました。{中|なか}は くらくて、とても あつかったそうです。',
      'いまは {金山|きんざん}は {閉|と}じられて しまいましたが、トンネルの {中|なか}を {見学|けんがく}する ことが できます。{帰|かえ}りに たらいぶねに {乗|の}って みましたが、まっすぐ {進|すす}むのは むずかしかったです。',
    ],
    questions: [
      { q: 'Why did people gather on Sado from all over Japan?', options: ['Gold was found there', 'For a festival', 'For the fishing'], answer: 0 },
      { q: 'What was it like inside the tunnels?', options: ['Dark and very hot', 'Cold and wet', 'Bright and quiet'], answer: 0 },
      { q: 'What was hard about the tub boat?', options: ['Going straight', 'Getting in', 'Finding one'], answer: 0 },
    ],
  },
  {
    id: 'otaru-glass', title: 'Glass floats of Otaru', emoji: '🫧', from: 'otaru',
    text: [
      'むかし、おたるは にしん{漁|りょう}で とても にぎやかな {町|まち}でした。{町|まち}の ガラス{工場|こうじょう}では、ランプの ほかに、{漁|りょう}に {使|つか}う ガラスの うきも {作|つく}って いました。',
      'にしんが とれなく なってからも、ガラスを {作|つく}る {技術|ぎじゅつ}は {残|のこ}りました。いまでは コップや ランプなど、きれいな {作品|さくひん}が {作|つく}られて います。',
      'わたしは {体験|たいけん}{工房|こうぼう}で、{自分|じぶん}で ガラスを ふいて みました。{思|おも}ったより {息|いき}が {必要|ひつよう}で、ねこの {形|かたち}に するのは {無理|むり}でした。',
    ],
    questions: [
      { q: 'Besides lamps, what did Otaru’s glassworks make?', options: ['Glass floats for fishing', 'Windows for the canal warehouses', 'Music boxes'], answer: 0 },
      { q: 'What happened after the herring disappeared?', options: ['The glass-making skills remained', 'All the factories closed', 'The town moved'], answer: 0 },
      { q: 'How did the writer’s glass-blowing go?', options: ['It needed more breath than expected', 'It came out as a perfect cat', 'The writer did not try'], answer: 0 },
    ],
  },
  {
    id: 'tono-kappa', title: 'From the Tales of Tōno', emoji: '🥒', from: 'tono',
    text: [
      '{遠野|とおの}の {里|さと}には、{今|いま}もなお {不思議|ふしぎ}な {話|はなし}が {数多|かずおお}く {語|かた}り{継|つ}がれている。{明治|めいじ}の {末|すえ}、{柳田國男|やなぎたくにお}は {土地|とち}の {若者|わかもの}から {聞|き}いた {話|はなし}を {書|か}き{留|と}め、『{遠野物語|とおのものがたり}』として {世|よ}に {出|だ}した。',
      'なかでも {名高|なだか}いのは {河童|かっぱ}の {話|はなし}である。{遠野|とおの}の {河童|かっぱ}は {顔|かお}が {赤|あか}いと いわれ、{川辺|かわべ}に {馬|うま}を {引|ひ}きずり{込|こ}もうとしては、{逆|ぎゃく}に {村人|むらびと}に {捕|と}らえられたという。',
      '{寺|てら}の {裏|うら}を {流|なが}れる {淵|ふち}は、{今|いま}では「カッパ{淵|ぶち}」と {呼|よ}ばれ、きゅうりを {餌|えさ}にした {竿|さお}を {垂|た}らす {旅人|たびびと}の {姿|すがた}が {絶|た}えない。{河童|かっぱ}に {出会|であ}えた {者|もの}は いまだ {一人|ひとり}も いないのだが。',
    ],
    questions: [
      { q: 'Where did Yanagita get the stories?', options: ['From a young man of the area', 'From old temple scrolls', 'From his own dreams'], answer: 0 },
      { q: 'What is said to be special about Tōno’s kappa?', options: ['Their faces are red', 'They can fly', 'They are friendly to horses'], answer: 0 },
      { q: 'What do travellers do at the Kappa Pool today?', options: ['Dangle rods baited with cucumber', 'Swim in it', 'Throw coins for luck'], answer: 0 },
      { q: 'What does the final sentence suggest?', options: ['Nobody has actually met a kappa yet', 'Many visitors have caught one', 'The pool is now closed'], answer: 0 },
    ],
  },
  {
    id: 'shiga-kinosaki', title: 'At Kinosaki', emoji: '♨️', from: 'kinosaki',
    text: [
      '{大正|たいしょう}{二年|にねん}、{作家|さっか}の {志賀直哉|しがなおや}は {東京|とうきょう}で {電車|でんしゃ}に はねられ、{一命|いちめい}を {取|と}り{留|と}めたのち、{養生|ようじょう}のため {城崎|きのさき}{温泉|おんせん}に {滞在|たいざい}した。',
      '{宿|やど}の {二階|にかい}から {彼|かれ}が {眺|なが}めていたのは、{屋根|やね}の {上|うえ}で {死|し}んでいる {一匹|いっぴき}の {蜂|はち}であった。{仲間|なかま}の {蜂|はち}たちは {忙|いそが}しく {働|はたら}き、{死骸|しがい}には {見向|みむ}きも しない。その {静|しず}かさに、{彼|かれ}は {不思議|ふしぎ}な {親|した}しみを {覚|おぼ}えたという。',
      'こうした {体験|たいけん}を {基|もと}に {書|か}かれた {短編|たんぺん}『{城|き}の{崎|さき}にて』は、{生|せい}と {死|し}を {見|み}つめた {名作|めいさく}として {今|いま}も {読|よ}み{継|つ}がれている。{作家|さっか}が {泊|と}まった {宿|やど}は、{現在|げんざい}も {営業|えいぎょう}を {続|つづ}けている。',
    ],
    questions: [
      { q: 'Why did Shiga go to Kinosaki?', options: ['To recover after being hit by a train', 'To write a travel guide', 'To open an inn'], answer: 0 },
      { q: 'What did he watch from the inn’s upper floor?', options: ['A dead bee on a roof', 'Children playing in the river', 'A festival parade'], answer: 0 },
      { q: 'How did the other bees treat the dead one?', options: ['They paid it no attention', 'They carried it away', 'They gathered around it'], answer: 0 },
      { q: 'What is the short story mainly about?', options: ['Life and death', 'Hot-spring cuisine', 'Train travel'], answer: 0 },
    ],
  },
  {
    id: 'okinoshima-news', title: 'News: the island of the gods', emoji: '📰', from: 'munakata',
    text: [
      '【{福岡|ふくおか}】ユネスコの {世界遺産|せかいいさん}{委員会|いいんかい}は 2017{年|ねん}、「『{神宿|かみやど}る{島|しま}』{宗像|むなかた}・{沖ノ島|おきのしま}と{関連|かんれん}{遺産群|いさんぐん}」を {世界|せかい}{文化|ぶんか}{遺産|いさん}に {登録|とうろく}することを {決定|けってい}した。',
      '{玄界灘|げんかいなだ}に {浮|う}かぶ {沖ノ島|おきのしま}は、{島|しま}{全体|ぜんたい}が {宗像大社|むなかたたいしゃ}の {御神体|ごしんたい}とされ、{古代|こだい}の {祭祀|さいし}{跡|あと}からは {約|やく}{八万点|はちまんてん}もの {奉献品|ほうけんひん}が {出土|しゅつど}している。そのすべてが {国宝|こくほう}に {指定|してい}されており、「{海|うみ}の{正倉院|しょうそういん}」とも {称|しょう}される。',
      '{島|しま}では {古来|こらい}の {禁忌|きんき}が {守|まも}られてきた。{上陸|じょうりく}を {許|ゆる}された {者|もの}も、{海|うみ}で {身|み}を {清|きよ}めてからでなければ {島|しま}に {入|はい}れない。{登録|とうろく}{後|ご}、{神社|じんじゃ}は {保全|ほぜん}を {理由|りゆう}に {一般|いっぱん}の {上陸|じょうりく}を {全面|ぜんめん}的に {中止|ちゅうし}すると {発表|はっぴょう}した。',
    ],
    questions: [
      { q: 'What is the whole island regarded as?', options: ['The sacred body of a shrine’s deity', 'A national park', 'A fishing port'], answer: 0 },
      { q: 'Why is it called the “Shōsōin of the sea”?', options: ['About 80,000 ancient offerings were found, all National Treasures', 'It is shaped like a storehouse', 'It stores fish for the region'], answer: 0 },
      { q: 'What must permitted visitors do before landing?', options: ['Purify themselves in the sea', 'Pay an entrance fee', 'Bring an offering of rice'], answer: 0 },
      { q: 'What did the shrine announce after the listing?', options: ['A complete halt to general landings', 'More ferries for tourists', 'A new museum on the island'], answer: 0 },
    ],
  },
  {
    id: 'amami-cats', title: 'News: cats and the Amami rabbit', emoji: '🐇', from: 'amami',
    text: [
      '【{鹿児島|かごしま}】{世界|せかい}{自然|しぜん}{遺産|いさん}に {登録|とうろく}された {奄美大島|あまみおおしま}で、{野生化|やせいか}した {猫|ねこ}による {希少|きしょう}{動物|どうぶつ}への {被害|ひがい}が {問題|もんだい}となっている。',
      '{特別|とくべつ}{天然|てんねん}{記念物|きねんぶつ}の アマミノクロウサギは、{島|しま}に {天敵|てんてき}が {少|すく}なかったため、{逃|に}げる {能力|のうりょく}が {高|たか}くない。{森|もり}に {入|はい}り{込|こ}んだ {猫|ねこ}が これを {襲|おそ}う {様子|ようす}が、{自動|じどう}カメラに {記録|きろく}されている。',
      'これを {受|う}け、{環境省|かんきょうしょう}と {地元|じもと}の {自治体|じちたい}は {森|もり}の {猫|ねこ}を {捕獲|ほかく}し、{新|あたら}しい {飼|か}い{主|ぬし}を {探|さが}す {取|と}り{組|く}みを {進|すす}めている。{関係者|かんけいしゃ}は「{問題|もんだい}は {猫|ねこ}ではなく、{人間|にんげん}の {飼|か}い{方|かた}にある。{室内|しつない}{飼|が}いと {不妊|ふにん}{手術|しゅじゅつ}を {徹底|てってい}してほしい」と {呼|よ}びかけている。',
    ],
    questions: [
      { q: 'Why is the Amami rabbit vulnerable?', options: ['It evolved with few predators, so it is not good at escaping', 'It is too big to hide', 'It only lives on beaches'], answer: 0 },
      { q: 'How was the problem recorded?', options: ['By automatic cameras', 'By tourists’ phones', 'By satellite'], answer: 0 },
      { q: 'What happens to the cats that are caught?', options: ['New owners are sought for them', 'They are released on another island', 'They are kept in a zoo'], answer: 0 },
      { q: 'According to the officials, where does the problem really lie?', options: ['In how people keep their cats', 'In the cats themselves', 'In the rabbits’ diet'], answer: 0 },
    ],
  },
  {
    id: 'hakodate-night', title: 'The night view of Hakodate', emoji: '🌃', from: 'hakodate',
    text: [
      'きのうの {夜|よる}、ロープウェイで はこだてやまに のぼりました。',
      'やまの うえは とても さむかったです。でも、{町|まち}の あかりが ほしの ように きれいでした。',
      'となりの ひとが「せかいで いちばん きれいな やけいです」と いいました。わたしも そう おもいます。',
    ],
    questions: [
      { q: 'How did the writer go up the mountain?', options: ['By ropeway', 'On foot', 'By bus'], answer: 0 },
      { q: 'What was it like at the top?', options: ['Very cold', 'Very hot', 'Very crowded'], answer: 0 },
      { q: 'What did the town lights look like?', options: ['Like stars', 'Like fireworks', 'Like the sun'], answer: 0 },
    ],
  },
  {
    id: 'kenrokuen', title: 'A garden in the snow', emoji: '🌲', from: 'kanazawa',
    text: [
      'かなざわの けんろくえんは、にほんで ゆうめいな にわです。',
      'ふゆに なると、{木|き}に たくさんの なわを かけます。これは「ゆきづり」と いいます。おもい ゆきで えだが おれない ように するのです。',
      'わたしは ゆきの {日|ひ}に いきました。しろい にわは とても しずかで、きれいでした。',
    ],
    questions: [
      { q: 'What is yukitsuri?', options: ['Ropes that stop snow breaking branches', 'A winter festival', 'A kind of tea'], answer: 0 },
      { q: 'When are the ropes put up?', options: ['In winter', 'In summer', 'In spring'], answer: 0 },
      { q: 'What was the garden like on the snowy day?', options: ['Very quiet and beautiful', 'Very noisy', 'Closed'], answer: 0 },
    ],
  },
  {
    id: 'koyasan-stay', title: 'A night at a mountain temple', emoji: '🛕', from: 'koyasan',
    text: [
      'こうやさんには {百|ひゃく}いじょうの お{寺|てら}が あって、お{寺|てら}に とまる ことも できます。',
      'ゆうごはんは しょうじん{料理|りょうり}でした。{肉|にく}や {魚|さかな}を つかわないのに、とても おいしかったです。',
      'つぎの {朝|あさ}は {六時|ろくじ}に おきて、お{坊|ぼう}さんと いっしょに おきょうを ききました。ねむかったけど、こころが しずかに なりました。',
    ],
    questions: [
      { q: 'What is special about shōjin ryōri?', options: ['It uses no meat or fish', 'It is very spicy', 'It is eaten standing'], answer: 0 },
      { q: 'What did the writer do in the morning?', options: ['Listened to sutras with the monks', 'Went skiing', 'Took a train home'], answer: 0 },
      { q: 'How did the writer feel afterwards?', options: ['Their mind felt calm', 'Angry', 'Hungry'], answer: 0 },
    ],
  },
  {
    id: 'crow-castle', title: 'The crow castle', emoji: '🏯', from: 'matsumoto',
    text: [
      'まつもとじょうは {黒|くろ}い おしろなので、「からすじょう」と よばれて います。',
      'こくほうに なって いる おしろの ひとつで、なかに はいる ことも できます。かいだんが とても きゅうなので、きを つけなければ なりません。',
      'うえまで のぼると、まどから {山|やま}が よく みえました。{白|しろ}い ひめじじょうと くらべて みたいと おもいました。',
    ],
    questions: [
      { q: 'Why is it called the crow castle?', options: ['Because it is black', 'Because crows live there', 'Because it is small'], answer: 0 },
      { q: 'What must you be careful of inside?', options: ['The very steep stairs', 'The dark rooms', 'The guards'], answer: 0 },
      { q: 'Which castle does the writer want to compare it with?', options: ['White Himeji Castle', 'Osaka Castle', 'Hirosaki Castle'], answer: 0 },
    ],
  },
  {
    id: 'gujo-dance', title: 'Dancing till dawn in Gujō', emoji: '💃', from: 'gujo',
    text: [
      '{郡上八幡|ぐじょうはちまん}では、{夏|なつ}に 30{日|にち}{以上|いじょう} {盆|ぼん}おどりが {続|つづ}きます。これを「{郡上|ぐじょう}おどり」と いいます。',
      'お{盆|ぼん}の {四日間|よっかかん}は、{朝|あさ}まで おどり{続|つづ}ける「{徹夜|てつや}おどり」が あるらしいです。',
      '{見|み}に {来|き}た だけの つもりでしたが、{輪|わ}の {中|なか}に {入|はい}って しまいました。{下駄|げた}の {音|おと}を {聞|き}きながら、{見|み}よう{見|み}まねで おどりました。',
      '{最後|さいご}には {手|て}の {動|うご}きを {覚|おぼ}えられるように なりました。{来年|らいねん}は ゆかたを {着|き}て {来|く}る つもりです。',
    ],
    questions: [
      { q: 'How long does the Gujō Odori go on each summer?', options: ['More than 30 nights', 'One night', 'One week'], answer: 0 },
      { q: 'What is “tetsuya odori”?', options: ['Dancing until morning', 'Dancing in the rain', 'A dance only for children'], answer: 0 },
      { q: 'What does the writer plan for next year?', options: ['To come wearing a yukata', 'To watch from far away', 'To teach the dance'], answer: 0 },
    ],
  },
  {
    id: 'tsumago-promise', title: 'The town that keeps a promise', emoji: '🏘️', from: 'tsumago',
    text: [
      '{妻籠宿|つまごじゅく}は、{江戸|えど}{時代|じだい}に {中山道|なかせんどう}を {旅|たび}する {人|ひと}が {泊|と}まった {宿場町|しゅくばまち}です。',
      '{町|まち}を {歩|ある}くと、{電線|でんせん}が ほとんど {見|み}えないので、{昔|むかし}に {戻|もど}ったような {気|き}が します。',
      '{町|まち}の {人|ひと}たちは、{古|ふる}い {町並|まちな}みを {守|まも}るために「{売|う}らない・{貸|か}さない・こわさない」という {約束|やくそく}を {作|つく}ったそうです。',
      'わたしは {馬籠宿|まごめじゅく}まで {約|やく}8キロの {道|みち}を {歩|ある}きました。{山道|やまみち}でしたが、{途中|とちゅう}の {茶屋|ちゃや}で お{茶|ちゃ}を もらって {元気|げんき}が {出|で}ました。',
    ],
    questions: [
      { q: 'What was Tsumago in the Edo period?', options: ['A post town for Nakasendō travellers', 'A castle town', 'A fishing port'], answer: 0 },
      { q: 'Why does the town feel like the past?', options: ['You can hardly see any power lines', 'Nobody lives there', 'Everyone wears armour'], answer: 0 },
      { q: 'What did the townspeople promise?', options: ['Not to sell, rent out or tear down', 'Not to open any shops', 'Not to let tourists in'], answer: 0 },
    ],
  },
  {
    id: 'kintai-bridge', title: 'The bridge that came back', emoji: '🌉', from: 'iwakuni',
    text: [
      '{錦帯橋|きんたいきょう}は、1673{年|ねん}に {錦川|にしきがわ}に かけられた、{五|いつ}つの アーチを {持|も}つ {木|き}の {橋|はし}です。',
      'それまでの {橋|はし}は {洪水|こうずい}の たびに {流|なが}されて いました。そこで、{流|なが}されにくい {形|かたち}を {工夫|くふう}した わけです。',
      'ところが 1950{年|ねん}、{台風|たいふう}に よって {橋|はし}は {流|なが}されて しまいました。{地元|じもと}の {人々|ひとびと}に とって、それは {大|おお}きな ショックでした。',
      '{費用|ひよう}が かかる にも かかわらず、{人々|ひとびと}は {木|き}の {橋|はし}を {作|つく}り{直|なお}す ことに しました。1953{年|ねん}に {再建|さいけん}され、{今|いま}でも {定期的|ていきてき}に {架|か}け{替|か}えが {行|おこな}われて います。',
    ],
    questions: [
      { q: 'What is special about the bridge’s shape?', options: ['Five wooden arches', 'It floats on boats', 'It is one long stone slab'], answer: 0 },
      { q: 'What happened in 1950?', options: ['A typhoon washed it away', 'It was moved to Tokyo', 'It burned down'], answer: 0 },
      { q: 'What did the people decide?', options: ['To rebuild it in wood despite the cost', 'To build a concrete bridge', 'To use a ferry instead'], answer: 0 },
    ],
  },
  {
    id: 'arita-imari', title: 'Why Europe said “Imari”', emoji: '🏺', from: 'arita',
    text: [
      '{有田焼|ありたやき}の {歴史|れきし}は、17{世紀|せいき}の はじめに {泉山|いずみやま}で {磁器|じき}の {原料|げんりょう}と なる {石|いし}が {見|み}つかった ことから {始|はじ}まった と いわれて います。',
      '{有田|ありた}の {焼|や}き{物|もの}は {近|ちか}くの {伊万里|いまり}の {港|みなと}から {運|はこ}ばれたため、ヨーロッパでは「イマリ」と {呼|よ}ばれる ように なりました。',
      '{毎年|まいとし} ゴールデンウィークに {開|ひら}かれる {陶器市|とうきいち}には、{百万人|ひゃくまんにん}{近|ちか}くの {人|ひと}が {訪|おとず}れる そうです。',
      'わたしも {小|ちい}さい {茶碗|ちゃわん}を {一|ひと}つ {買|か}おうと した ものの、{選|えら}びきれずに {結局|けっきょく} {三|みっ}つも {買|か}って しまいました。',
    ],
    questions: [
      { q: 'Why was Arita ware called “Imari” in Europe?', options: ['It was shipped from Imari port', 'Imari was the potter’s name', 'It was painted with imari flowers'], answer: 0 },
      { q: 'When is the big pottery fair?', options: ['Golden Week', 'New Year', 'Obon'], answer: 0 },
      { q: 'How many bowls did the writer end up buying?', options: ['Three', 'One', 'None'], answer: 0 },
    ],
  },
];
