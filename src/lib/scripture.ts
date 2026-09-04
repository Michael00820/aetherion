export type Lection = {
  month: number;
  day: number;
  saint: string;
  saintGeez: string;
  feast?: string;
  reading: { book: string; bookGeez: string; ref: string; geez: string; english: string };
};

const COMMON: Lection["reading"][] = [
  {
    book: "Psalm",
    bookGeez: "መዝሙር",
    ref: "19:1–2",
    geez: "ሰማያት ይነግሩ ስብሐተ እግዚአብሔር ወግብረ እደዊሁ ይነግር ጠፈር።",
    english: "The heavens declare the glory of God, and the firmament proclaims the work of his hands.",
  },
  {
    book: "Genesis",
    bookGeez: "ኦሪት ዘፍጥረት",
    ref: "1:14–15",
    geez: "ወይቤ እግዚአብሔር ለይኩኑ ብርሃናት ውስተ ጠፈረ ሰማይ ከመ ይብይኑ መዓልተ እምሌሊት።",
    english: "And God said, Let there be lights in the firmament of the heaven to divide the day from the night.",
  },
  {
    book: "John",
    bookGeez: "ወንጌል ዘዮሐንስ",
    ref: "1:5",
    geez: "ወብርሃን ውስተ ጽልመት ይበርህ ወጽልመት ኢተመጠዎ።",
    english: "The light shines in the darkness, and the darkness has not overcome it.",
  },
  {
    book: "Isaiah",
    bookGeez: "ትንቢተ ኢሳይያስ",
    ref: "60:1",
    geez: "ተንሥኢ በርሂ ጽዮን እስመ በጽሐ ብርሃንኪ ወስብሐተ እግዚአብሔር ዘልዓለኪ።",
    english: "Arise, shine, for your light has come, and the glory of the Lord has risen upon you.",
  },
  {
    book: "Enoch",
    bookGeez: "መጽሐፈ ሄኖክ",
    ref: "72:2",
    geez: "ወኮነ ሕግጋተ ፀሐይ ወኁልቈ ፍናዊሁ በዘ ይገብር ወዘይዓርግ።",
    english: "This is the law of the sun, the counting of its paths by which it rises and by which it sets.",
  },
  {
    book: "Baruch",
    bookGeez: "መጽሐፈ ባሮክ",
    ref: "3:34–35",
    geez: "ኮከብተ ሰማይ ይበርሁ ወይትፌሥሑ በዘ ሰመሮሙ።",
    english: "The stars shone in their watches and were glad; he called them, and they said, Here we are.",
  },
];

const SAINTS: { day: number; saint: string; saintGeez: string; feast?: string }[] = [
  { day: 1, saint: "John the Baptist", saintGeez: "ቅዱስ ዮሐንስ መጥምቅ" },
  { day: 5, saint: "Abba Giyorgis of Gasicha", saintGeez: "አባ ጊዮርጊስ ዘጋሲቻ" },
  { day: 7, saint: "Holy Trinity", saintGeez: "ቅድስት ሥላሴ", feast: "Selassie" },
  { day: 12, saint: "St. Michael", saintGeez: "ቅዱስ ሚካኤል", feast: "Monthly Michael" },
  { day: 16, saint: "Kidane Mehret", saintGeez: "ኪዳነ ምሕረት" },
  { day: 19, saint: "St. Gabriel", saintGeez: "ቅዱስ ገብርኤል" },
  { day: 21, saint: "St. Mary", saintGeez: "ቅድስት ማርያም", feast: "Monthly St. Mary" },
  { day: 23, saint: "St. George", saintGeez: "ቅዱስ ጊዮርጊስ" },
  { day: 29, saint: "Beale Egziabher", saintGeez: "በዓለ እግዚአብሔር" },
];

const FEASTS: Record<string, { saint: string; saintGeez: string; feast: string; reading: Lection["reading"] }> = {
  "1-1": {
    saint: "John the Baptist",
    saintGeez: "ቅዱስ ዮሐንስ መጥምቅ",
    feast: "Enkutatash — New Year",
    reading: COMMON[3],
  },
  "1-17": {
    saint: "The True Cross",
    saintGeez: "መስቀለ ክርስቶስ",
    feast: "Meskel",
    reading: {
      book: "1 Corinthians",
      bookGeez: "ቆሮንቶስ",
      ref: "1:18",
      geez: "ቃለ መስቀል ለእለ ይትሐጐሉ አበሳ ውእቱ ወለእለ ይድኅኑ ኃይለ እግዚአብሔር።",
      english: "The word of the cross is folly to those who are perishing, but to us who are being saved it is the power of God.",
    },
  },
  "4-29": {
    saint: "The Nativity of Christ",
    saintGeez: "ልደተ ክርስቶስ",
    feast: "Genna",
    reading: {
      book: "Luke",
      bookGeez: "ወንጌል ዘሉቃስ",
      ref: "2:10–11",
      geez: "ኢትፍርሁ እስመ ነገርክሙ ፍሥሓ ዐቢየ እንተ ትከውን ለኵሉ ሕዝብ።",
      english: "Fear not, for I bring you good news of a great joy that will be for all the people.",
    },
  },
  "5-11": {
    saint: "The Baptism of Christ",
    saintGeez: "ጥምቀተ ክርስቶስ",
    feast: "Timkat",
    reading: {
      book: "Matthew",
      bookGeez: "ወንጌል ዘማቴዎስ",
      ref: "3:16–17",
      geez: "ወጥምቆ ኢየሱስ ዐርገ እምውኃ ወናሁ ተርኅወ ሰማያት።",
      english: "When Jesus was baptized, he went up from the water, and the heavens were opened to him.",
    },
  },
  "12-16": {
    saint: "The Falling Asleep of Mary",
    saintGeez: "ፍልሰተ ማርያም",
    feast: "Filseta",
    reading: {
      book: "Song of Songs",
      bookGeez: "መኃልየ መኃልይ",
      ref: "6:10",
      geez: "መን ትላዕሉ ከመ ጽባሕ ሠናይት ከመ ወርኅ ኅሩይት ከመ ፀሐይ።",
      english: "Who is she that looks forth as the dawn, fair as the moon, bright as the sun?",
    },
  },
};

export function lectionFor(month: number, day: number): Lection {
  const key = `${month}-${day}`;
  const feast = FEASTS[key];
  if (feast) {
    return { month, day, saint: feast.saint, saintGeez: feast.saintGeez, feast: feast.feast, reading: feast.reading };
  }
  const saint = SAINTS.find((s) => s.day === day) ?? {
    saint: "The daily synaxarium",
    saintGeez: "ስንክሳር",
    feast: undefined as string | undefined,
  };
  const reading = COMMON[(month + day) % COMMON.length];
  return { month, day, saint: saint.saint, saintGeez: saint.saintGeez, feast: saint.feast, reading };
}
