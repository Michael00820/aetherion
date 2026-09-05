export type CanonSection = "orit" | "nebiyat" | "dagua" | "wengel" | "broader";

export type CanonBook = {
  id: string;
  section: CanonSection;
  nameEn: string;
  nameAm: string;
  nameGez: string;
  note: string;
  chapters: number;
};

export const CATALOG: CanonBook[] = [
  { id: "genesis", section: "orit", nameEn: "Genesis", nameAm: "ኦሪት ዘፍጥረት", nameGez: "ኦሪት ዘፍጥረት", note: "The first book of the Orit.", chapters: 50 },
  { id: "exodus", section: "orit", nameEn: "Exodus", nameAm: "ኦሪት ዘጸአት", nameGez: "ኦሪት ዘጸአት", note: "The going out from Egypt.", chapters: 40 },
  { id: "leviticus", section: "orit", nameEn: "Leviticus", nameAm: "ኦሪት ዘሌዋውያን", nameGez: "ኦሪት ዘሌዋውያን", note: "The holiness of the tent.", chapters: 27 },
  { id: "numbers", section: "orit", nameEn: "Numbers", nameAm: "ኦሪት ዘኍልቍ", nameGez: "ኦሪት ዘኍልቍ", note: "The numbering of Israel.", chapters: 36 },
  { id: "deuteronomy", section: "orit", nameEn: "Deuteronomy", nameAm: "ኦሪት ዘዳግም", nameGez: "ኦሪት ዘዳግም", note: "The second law.", chapters: 34 },
  { id: "joshua", section: "orit", nameEn: "Joshua", nameAm: "ኢያሱ", nameGez: "ኢያሱ ወልደ ኖን", note: "The crossing of the Jordan.", chapters: 24 },
  { id: "judges", section: "orit", nameEn: "Judges", nameAm: "መሳፍንት", nameGez: "መሳፍንት", note: "The judges of Israel.", chapters: 21 },
  { id: "ruth", section: "orit", nameEn: "Ruth", nameAm: "ሩት", nameGez: "ሩት", note: "The gleaning at Bethlehem.", chapters: 4 },
  { id: "1-samuel", section: "dagua", nameEn: "1 Samuel", nameAm: "1ኛ ሳሙኤል", nameGez: "ሳሙኤል ፩", note: "The prophet and the first king.", chapters: 31 },
  { id: "2-samuel", section: "dagua", nameEn: "2 Samuel", nameAm: "2ኛ ሳሙኤል", nameGez: "ሳሙኤል ፪", note: "The house of David.", chapters: 24 },
  { id: "1-kings", section: "dagua", nameEn: "1 Kings", nameAm: "1ኛ ነገሥት", nameGez: "ነገሥት ፩", note: "Solomon and the temple.", chapters: 22 },
  { id: "2-kings", section: "dagua", nameEn: "2 Kings", nameAm: "2ኛ ነገሥት", nameGez: "ነገሥት ፪", note: "The fall of the kingdoms.", chapters: 25 },
  { id: "1-chronicles", section: "dagua", nameEn: "1 Chronicles", nameAm: "1ኛ ዜና መዋዕል", nameGez: "ዜና መዋዕል ፩", note: "The chronicles of the kings.", chapters: 29 },
  { id: "2-chronicles", section: "dagua", nameEn: "2 Chronicles", nameAm: "2ኛ ዜና መዋዕል", nameGez: "ዜና መዋዕል ፪", note: "The temple and the exile.", chapters: 36 },
  { id: "ezra", section: "dagua", nameEn: "Ezra", nameAm: "ዕዝራ", nameGez: "ዕዝራ", note: "The return from Babylon.", chapters: 10 },
  { id: "nehemiah", section: "dagua", nameEn: "Nehemiah", nameAm: "ነህምያ", nameGez: "ነህምያ", note: "The rebuilding of the wall.", chapters: 13 },
  { id: "1-esdras", section: "dagua", nameEn: "1 Esdras", nameAm: "ዕዝራ ፩", nameGez: "ዕዝራ", note: "Greek Ezra, kept in the broader canon.", chapters: 9 },
  { id: "ezra-sutuel", section: "dagua", nameEn: "Ezra Sutuel", nameAm: "ዕዝራ ሱቱኤል", nameGez: "ዕዝራ ሱቱኤል", note: "Ethiopic 4 Ezra / 2 Esdras.", chapters: 16 },
  { id: "esther", section: "dagua", nameEn: "Esther", nameAm: "አስቴር", nameGez: "አስቴር", note: "The queen of Persia.", chapters: 10 },
  { id: "tobit", section: "dagua", nameEn: "Tobit", nameAm: "ጦቢት", nameGez: "ጦቢት", note: "The road with Raphael.", chapters: 14 },
  { id: "judith", section: "dagua", nameEn: "Judith", nameAm: "ዮዲት", nameGez: "ዮዲት", note: "The widow of Bethulia.", chapters: 16 },
  { id: "job", section: "dagua", nameEn: "Job", nameAm: "ኢዮብ", nameGez: "ኢዮብ", note: "The patience of Job.", chapters: 42 },
  { id: "psalms", section: "dagua", nameEn: "Psalms", nameAm: "መዝሙረ ዳዊት", nameGez: "መዝሙር", note: "One hundred fifty-one psalms in the Ethiopian Psalter.", chapters: 151 },
  { id: "proverbs", section: "dagua", nameEn: "Proverbs", nameAm: "ምሳሌ", nameGez: "ምሳሌያተ ሰሎሞን", note: "The proverbs of Solomon.", chapters: 31 },
  { id: "ecclesiastes", section: "dagua", nameEn: "Ecclesiastes", nameAm: "መክብብ", nameGez: "መክብብ", note: "Vanity of vanities.", chapters: 12 },
  { id: "song-of-songs", section: "dagua", nameEn: "Song of Songs", nameAm: "መኃልየ መኃልይ", nameGez: "መኃልየ መኃልይ", note: "The song of songs.", chapters: 8 },
  { id: "wisdom", section: "dagua", nameEn: "Wisdom", nameAm: "ጥበበ ሰሎሞን", nameGez: "ጥበበ ሰሎሞን", note: "The wisdom of Solomon.", chapters: 19 },
  { id: "sirach", section: "dagua", nameEn: "Sirach", nameAm: "ስራክ", nameGez: "ስራክ", note: "The wisdom of Ben Sira.", chapters: 51 },
  { id: "isaiah", section: "nebiyat", nameEn: "Isaiah", nameAm: "ትንቢተ ኢሳይያስ", nameGez: "ኢሳይያስ", note: "Lift up your eyes on high.", chapters: 66 },
  { id: "jeremiah", section: "nebiyat", nameEn: "Jeremiah", nameAm: "ትንቢተ ኤርምያስ", nameGez: "ኤርምያስ", note: "The weeping prophet.", chapters: 52 },
  { id: "baruch", section: "nebiyat", nameEn: "Baruch", nameAm: "ባሮክ", nameGez: "ባሮክ", note: "The scribe of Jeremiah.", chapters: 5 },
  { id: "letter-of-jeremiah", section: "nebiyat", nameEn: "Letter of Jeremiah", nameAm: "መልእክተ ኤርምያስ", nameGez: "መልእክተ ኤርምያስ", note: "Against the idols of Babylon.", chapters: 1 },
  { id: "lamentations", section: "nebiyat", nameEn: "Lamentations", nameAm: "ሰቆቃወ ኤርምያስ", nameGez: "ሰቆቃወ", note: "How lonely sits the city.", chapters: 5 },
  { id: "ezekiel", section: "nebiyat", nameEn: "Ezekiel", nameAm: "ትንቢተ ሕዝቅኤል", nameGez: "ሕዝቅኤል", note: "The wheels and the glory.", chapters: 48 },
  { id: "daniel", section: "nebiyat", nameEn: "Daniel", nameAm: "ትንቢተ ዳንኤል", nameGez: "ዳንኤል", note: "The night visions.", chapters: 12 },
  { id: "hosea", section: "nebiyat", nameEn: "Hosea", nameAm: "ሆሴዕ", nameGez: "ሆሴዕ", note: "Minor prophet.", chapters: 14 },
  { id: "joel", section: "nebiyat", nameEn: "Joel", nameAm: "ኢዮኤል", nameGez: "ኢዮኤል", note: "Minor prophet.", chapters: 3 },
  { id: "amos", section: "nebiyat", nameEn: "Amos", nameAm: "አሞጽ", nameGez: "አሞጽ", note: "Minor prophet.", chapters: 9 },
  { id: "obadiah", section: "nebiyat", nameEn: "Obadiah", nameAm: "አብድዩ", nameGez: "አብድዩ", note: "Minor prophet.", chapters: 1 },
  { id: "jonah", section: "nebiyat", nameEn: "Jonah", nameAm: "ዮናስ", nameGez: "ዮናስ", note: "Minor prophet.", chapters: 4 },
  { id: "micah", section: "nebiyat", nameEn: "Micah", nameAm: "ሚክያስ", nameGez: "ሚክያስ", note: "Minor prophet.", chapters: 7 },
  { id: "nahum", section: "nebiyat", nameEn: "Nahum", nameAm: "ናሆም", nameGez: "ናሆም", note: "Minor prophet.", chapters: 3 },
  { id: "habakkuk", section: "nebiyat", nameEn: "Habakkuk", nameAm: "ዕንባቆም", nameGez: "ዕንባቆም", note: "Minor prophet.", chapters: 3 },
  { id: "zephaniah", section: "nebiyat", nameEn: "Zephaniah", nameAm: "ሶፎንያስ", nameGez: "ሶፎንያስ", note: "Minor prophet.", chapters: 3 },
  { id: "haggai", section: "nebiyat", nameEn: "Haggai", nameAm: "ሐጌ", nameGez: "ሐጌ", note: "Minor prophet.", chapters: 2 },
  { id: "zechariah", section: "nebiyat", nameEn: "Zechariah", nameAm: "ዘካርያስ", nameGez: "ዘካርያስ", note: "Minor prophet.", chapters: 14 },
  { id: "malachi", section: "nebiyat", nameEn: "Malachi", nameAm: "ሚልክያስ", nameGez: "ሚልክያስ", note: "Minor prophet.", chapters: 4 },
  { id: "enoch", section: "broader", nameEn: "1 Enoch", nameAm: "መጽሐፈ ሄኖክ", nameGez: "ሄኖክ", note: "The blessing of Enoch.", chapters: 2 },
  { id: "jubilees", section: "broader", nameEn: "Jubilees", nameAm: "መጽሐፈ ኩፋሌ", nameGez: "ኩፋሌ", note: "The division of the days.", chapters: 1 },
  { id: "matthew", section: "wengel", nameEn: "Matthew", nameAm: "የማቴዎስ ወንጌል", nameGez: "ወንጌል ዘማቴዎስ", note: "The gospel of Matthew.", chapters: 28 },
  { id: "mark", section: "wengel", nameEn: "Mark", nameAm: "የማርቆስ ወንጌል", nameGez: "ወንጌል ዘማርቆስ", note: "The gospel of Mark.", chapters: 16 },
  { id: "luke", section: "wengel", nameEn: "Luke", nameAm: "የሉቃስ ወንጌል", nameGez: "ወንጌል ዘሉቃስ", note: "The gospel of Luke.", chapters: 24 },
  { id: "john", section: "wengel", nameEn: "John", nameAm: "የዮሐንስ ወንጌል", nameGez: "ወንጌል ዘዮሐንስ", note: "The gospel of John.", chapters: 21 },
  { id: "acts", section: "wengel", nameEn: "Acts", nameAm: "ሥራ የሐዋርያት", nameGez: "ግብረ ሐዋርያት", note: "The acts of the apostles.", chapters: 28 },
  { id: "romans", section: "wengel", nameEn: "Romans", nameAm: "ወደ ሮሜ", nameGez: "ሮሜ", note: "Paul to the Romans.", chapters: 16 },
  { id: "1-corinthians", section: "wengel", nameEn: "1 Corinthians", nameAm: "1ኛ ቆሮንቶስ", nameGez: "ቆሮንቶስ ፩", note: "Paul to Corinth.", chapters: 16 },
  { id: "2-corinthians", section: "wengel", nameEn: "2 Corinthians", nameAm: "2ኛ ቆሮንቶስ", nameGez: "ቆሮንቶስ ፪", note: "Paul to Corinth again.", chapters: 13 },
  { id: "galatians", section: "wengel", nameEn: "Galatians", nameAm: "ወደ ገላትያ", nameGez: "ገላትያ", note: "Paul to Galatia.", chapters: 6 },
  { id: "ephesians", section: "wengel", nameEn: "Ephesians", nameAm: "ወደ ኤፌሶን", nameGez: "ኤፌሶን", note: "Paul to Ephesus.", chapters: 6 },
  { id: "philippians", section: "wengel", nameEn: "Philippians", nameAm: "ወደ ፊልጵስዩስ", nameGez: "ፊልጵስዩስ", note: "Paul to Philippi.", chapters: 4 },
  { id: "colossians", section: "wengel", nameEn: "Colossians", nameAm: "ወደ ቆላስይስ", nameGez: "ቆላስይስ", note: "Paul to Colossae.", chapters: 4 },
  { id: "1-thessalonians", section: "wengel", nameEn: "1 Thessalonians", nameAm: "1ኛ ተሰሎንቄ", nameGez: "ተሰሎንቄ ፩", note: "Paul to Thessalonica.", chapters: 5 },
  { id: "2-thessalonians", section: "wengel", nameEn: "2 Thessalonians", nameAm: "2ኛ ተሰሎንቄ", nameGez: "ተሰሎንቄ ፪", note: "Paul to Thessalonica again.", chapters: 3 },
  { id: "1-timothy", section: "wengel", nameEn: "1 Timothy", nameAm: "1ኛ ጢሞቴዎስ", nameGez: "ጢሞቴዎስ ፩", note: "Paul to Timothy.", chapters: 6 },
  { id: "2-timothy", section: "wengel", nameEn: "2 Timothy", nameAm: "2ኛ ጢሞቴዎስ", nameGez: "ጢሞቴዎስ ፪", note: "Paul to Timothy again.", chapters: 4 },
  { id: "titus", section: "wengel", nameEn: "Titus", nameAm: "ወደ ቲቶ", nameGez: "ቲቶ", note: "Paul to Titus.", chapters: 3 },
  { id: "philemon", section: "wengel", nameEn: "Philemon", nameAm: "ወደ ፊልሞና", nameGez: "ፊልሞና", note: "Paul to Philemon.", chapters: 1 },
  { id: "hebrews", section: "wengel", nameEn: "Hebrews", nameAm: "ወደ ዕብራውያን", nameGez: "ዕብራውያን", note: "To the Hebrews.", chapters: 13 },
  { id: "james", section: "wengel", nameEn: "James", nameAm: "ያዕቆብ", nameGez: "ያዕቆብ", note: "The letter of James.", chapters: 5 },
  { id: "1-peter", section: "wengel", nameEn: "1 Peter", nameAm: "1ኛ ጴጥሮስ", nameGez: "ጴጥሮስ ፩", note: "Peter's first letter.", chapters: 5 },
  { id: "2-peter", section: "wengel", nameEn: "2 Peter", nameAm: "2ኛ ጴጥሮስ", nameGez: "ጴጥሮስ ፪", note: "Peter's second letter.", chapters: 3 },
  { id: "1-john", section: "wengel", nameEn: "1 John", nameAm: "1ኛ ዮሐንስ", nameGez: "ዮሐንስ ፩", note: "John's first letter.", chapters: 5 },
  { id: "2-john", section: "wengel", nameEn: "2 John", nameAm: "2ኛ ዮሐንስ", nameGez: "ዮሐንስ ፪", note: "John's second letter.", chapters: 1 },
  { id: "3-john", section: "wengel", nameEn: "3 John", nameAm: "3ኛ ዮሐንስ", nameGez: "ዮሐንስ ፫", note: "John's third letter.", chapters: 1 },
  { id: "jude", section: "wengel", nameEn: "Jude", nameAm: "ይሁዳ", nameGez: "ይሁዳ", note: "The letter of Jude.", chapters: 1 },
  { id: "revelation", section: "wengel", nameEn: "Revelation", nameAm: "ራእይ ዮሐንስ", nameGez: "ራእይ", note: "The revelation of John.", chapters: 22 },
];

/** Restored English titles in the YAH Scriptures manner. */
export const YAH_TITLES: Record<string, string> = {
  genesis: "Bereshith",
  exodus: "Shemoth",
  leviticus: "Wayyiqra",
  numbers: "Bemidbar",
  deuteronomy: "Debarim",
  joshua: "Yahoshua",
  judges: "Shophetim",
  ruth: "Ruth",
  "1-samuel": "Shemu'el 1",
  "2-samuel": "Shemu'el 2",
  "1-kings": "Melakim 1",
  "2-kings": "Melakim 2",
  "1-chronicles": "Dibre haYamim 1",
  "2-chronicles": "Dibre haYamim 2",
  ezra: "Ezra",
  nehemiah: "Nehemyah",
  "1-esdras": "Ezra 1",
  "ezra-sutuel": "Ezra Sutuel",
  esther: "Ester",
  tobit: "Tobiyah",
  judith: "Yahudith",
  job: "Iyob",
  psalms: "Tehillim",
  proverbs: "Mishle",
  ecclesiastes: "Qoheleth",
  "song-of-songs": "Shir haShirim",
  wisdom: "Hakmah",
  sirach: "Sirach",
  isaiah: "Yeshayahu",
  jeremiah: "Yirmeyahu",
  baruch: "Baruk",
  "letter-of-jeremiah": "Letter of Yirmeyahu",
  lamentations: "Ekah",
  ezekiel: "Yehezqel",
  daniel: "Dani'el",
  hosea: "Hoshea",
  joel: "Yo'el",
  amos: "Amos",
  obadiah: "Obadyah",
  jonah: "Yonah",
  micah: "Mikah",
  nahum: "Nahum",
  habakkuk: "Habaqquq",
  zephaniah: "Tsephanyah",
  haggai: "Haggai",
  zechariah: "Zekaryah",
  malachi: "Mal'aki",
  enoch: "Hanok",
  jubilees: "Yobelim",
  matthew: "Mattithyahu",
  mark: "Marqos",
  luke: "Luqas",
  john: "Yohanan",
  acts: "Ma'aseh",
  romans: "Romiyim",
  "1-corinthians": "Qorintiyim 1",
  "2-corinthians": "Qorintiyim 2",
  galatians: "Galatiyim",
  ephesians: "Ephesiyim",
  philippians: "Philippiyim",
  colossians: "Qolossiyim",
  "1-thessalonians": "Tas'loniqim 1",
  "2-thessalonians": "Tas'loniqim 2",
  "1-timothy": "Timotiyos 1",
  "2-timothy": "Timotiyos 2",
  titus: "Titos",
  philemon: "Philemon",
  hebrews: "Ibriyim",
  james: "Ya'aqob",
  "1-peter": "Kepha 1",
  "2-peter": "Kepha 2",
  "1-john": "Yohanan 1",
  "2-john": "Yohanan 2",
  "3-john": "Yohanan 3",
  jude: "Yahudah",
  revelation: "Hazon",
};

export function yahTitle(id: string): string {
  return YAH_TITLES[id] ?? getCanon(id)?.nameEn ?? id;
}

export function displayEn(book: { id: string; nameEn: string }): string {
  const yah = YAH_TITLES[book.id];
  return yah ? `${yah} (${book.nameEn})` : book.nameEn;
}

export const CANON_GROUPS: { section: string; ids: string[] }[] = [
  { section: "Orit (8)", ids: ["genesis", "exodus", "leviticus", "numbers", "deuteronomy", "joshua", "judges", "ruth"] },
  { section: "Kings, Writings & Wisdom", ids: ["1-samuel", "2-samuel", "1-kings", "2-kings", "1-chronicles", "2-chronicles", "ezra", "nehemiah", "1-esdras", "ezra-sutuel", "esther", "tobit", "judith", "job", "psalms", "proverbs", "ecclesiastes", "song-of-songs", "wisdom", "sirach"] },
  { section: "Nebiyat — the Prophets", ids: ["isaiah", "jeremiah", "baruch", "letter-of-jeremiah", "lamentations", "ezekiel", "daniel", "hosea", "joel", "amos", "obadiah", "jonah", "micah", "nahum", "habakkuk", "zephaniah", "haggai", "zechariah", "malachi"] },
  { section: "Broader canon", ids: ["enoch", "jubilees"] },
  { section: "Wengel — Gospel and Apostles", ids: ["matthew", "mark", "luke", "john", "acts", "romans", "1-corinthians", "2-corinthians", "galatians", "ephesians", "philippians", "colossians", "1-thessalonians", "2-thessalonians", "1-timothy", "2-timothy", "titus", "philemon", "hebrews", "james", "1-peter", "2-peter", "1-john", "2-john", "3-john", "jude", "revelation"] },
];

export function getCanon(id: string): CanonBook | undefined {
  return CATALOG.find((b) => b.id === id);
}

export function neighbor(id: string, dir: -1 | 1): CanonBook {
  const i = CATALOG.findIndex((b) => b.id === id);
  const n = CATALOG.length;
  return CATALOG[(i + dir + n) % n] ?? CATALOG[0]!;
}
