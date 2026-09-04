import type { Book } from "./types";

export const BOOKS: Book[] = [
  {
    id: "genesis",
    section: "orit",
    nameEn: "Genesis",
    nameAm: "ኦሪት ዘፍጥረት",
    nameGez: "ኦሪት ዘፍጥረት",
    note: "The first book of the Orit. Creation of the heavens — the same sky this observatory reads.",
    chapters: [
      {
        number: 1,
        title: "The first day of the lights",
        verses: [
          {
            n: 1,
            gez: "በቀዳሚ ገብረ እግዚአብሔር ሰማየ ወምድረ።",
            am: "በመጀመሪያ እግዚአብሔር ሰማይንና ምድርን ፈጠረ።",
            en: "In the beginning God created the heaven and the earth.",
          },
          {
            n: 2,
            gez: "ምድርሰ እንበለ ሥርዓት ወእንበለ ገጽ ውእቱ፤ ጽልመትሰ መልዕልተ ቀላይ ውእቱ፤ መንፈሰ እግዚአብሔር ይሰፍፍ መልዕልተ ማይ።",
            am: "ምድርም ባዶ ነበረች፥ አንዳችም አልነበረባትም፤ ጨለማም በጥልቁ ላይ ነበረ፥ የእግዚአብሔርም መንፈስ በውኃ ላይ ሰፍፎ ነበር።",
            en: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
          },
          {
            n: 3,
            gez: "ወይቤ እግዚአብሔር፤ ለይኩን ብርሃን፤ ወኮነ ብርሃን።",
            am: "እግዚአብሔርም። ብርሃን ይሁን አለ፤ ብርሃንም ሆነ።",
            en: "And God said, Let there be light: and there was light.",
          },
          {
            n: 4,
            am: "እግዚአብሔርም ብርሃኑ መልካም እንደ ሆነ አየ፤ እግዚአብሔርም ብርሃንን ከጨለማ ለየ።",
            en: "And God saw the light, that it was good: and God divided the light from the darkness.",
          },
          {
            n: 5,
            am: "እግዚአብሔርም ብርሃኑን ቀን ብሎ ጠራው፥ ጨለማውንም ሌሊት ብሎ ጠራው። ማታም ሆነ ጥዋትም ሆነ፥ አንድ ቀን።",
            en: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
          },
          {
            n: 14,
            gez: "ወይቤ እግዚአብሔር፤ ለይኩኑ ብርሃናት ውስተ ጠፈረ ሰማይ ከመ ይሌልዩ መዓልተ እምሌሊት፤ ወለይኩኑ ለትእምርት ወለጊዜያት ወለመዋዕል ወለዓመታት።",
            am: "እግዚአብሔርም። ቀንን ከሌሊት ይለዩ ዘንድ ብርሃናት በሰማይ ጠፈር ይሁኑ፤ ለምልክቶችም ለዘመናትም ለዕለታትም ለዓመታትም ይሁኑ።",
            en: "And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years.",
          },
          {
            n: 15,
            am: "በምድርም ላይ ያበሩ ዘንድ በሰማይ ጠፈር ብርሃናት ይሁኑ። እንዲሁም ሆነ።",
            en: "And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.",
          },
          {
            n: 16,
            gez: "ወገብረ እግዚአብሔር ክልኤ ብርሃናተ ዐበይተ፤ ብርሃነ ዐቢየ ለሥልጣነ መዓልት፤ ወብርሃነ ንኡሰ ለሥልጣነ ሌሊት፤ ወከዋክብተኒ።",
            am: "እግዚአብሔርም ሁለት ታላላቅ ብርሃናትን አደረገ፤ ታላቁ ብርሃን በቀን እንዲሠለጥን፥ ታናሹም ብርሃን በሌሊት እንዲሠለጥን፤ ከዋክብትንም ደግሞ አደረገ።",
            en: "And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.",
          },
          {
            n: 17,
            am: "በምድርም ላይ ያበሩ ዘንድ እግዚአብሔር በሰማይ ጠፈር አኖራቸው።",
            en: "And God set them in the firmament of the heaven to give light upon the earth.",
          },
          {
            n: 18,
            am: "በቀንም በሌሊትም እንዲሠለጥኑ፥ ብርሃንንም ከጨለማ እንዲለዩ አደረገ። እግዚአብሔርም መልካም እንደ ሆነ አየ።",
            en: "And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.",
          },
          {
            n: 19,
            am: "ማታም ሆነ ጥዋትም ሆነ፥ አራተኛ ቀን።",
            en: "And the evening and the morning were the fourth day.",
          },
          {
            n: 31,
            am: "እግዚአብሔርም ያደረገውን ሁሉ አየ፥ እነሆም እጅግ መልካም ነበረ። ማታም ሆነ ጥዋትም ሆነ፥ ስድስተኛ ቀን።",
            en: "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.",
          },
        ],
      },
      {
        number: 2,
        title: "The garden and the seventh day",
        verses: [
          {
            n: 1,
            am: "ሰማይና ምድርም ተፈጸሙ፥ ሠራዊታቸውም ሁሉ።",
            en: "Thus the heavens and the earth were finished, and all the host of them.",
          },
          {
            n: 2,
            am: "እግዚአብሔርም በሰባተኛው ቀን ሥራውን አጠናቀቀ፤ በሰባተኛውም ቀን ከሥራው ሁሉ ዐረፈ።",
            en: "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.",
          },
          {
            n: 3,
            am: "እግዚአብሔርም ሰባተኛውን ቀን ባረከው ቀደሰውም፤ እግዚአብሔር ሥራውን ሁሉ ፈጥሮ ከፈጸመ በኋላ በእርሱ ዐርፎአልና።",
            en: "And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made.",
          },
          {
            n: 7,
            gez: "ወገብረ እግዚአብሔር እግዚእ አዳም እምድምፀተ ምድር፤ ወነፍኀ ውስተ አፉሁ እስተ ነፍስ ሕይወት፤ ወኮነ አዳም ነፍሰ ሕያወ።",
            am: "እግዚአብሔር አምላክም ሰውን ከምድር አፈር አበጀው፤ በአፍንጫውም የሕይወት እስትንፋስን እፍ አለበት፤ ሰውም ሕያው ነፍስ ሆነ።",
            en: "And the Lord God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul.",
          },
        ],
      },
    ],
  },
  {
    id: "psalm19",
    section: "dagua",
    nameEn: "Psalm 19 (LXX 18)",
    nameAm: "መዝሙረ ዳዊት ፲፰",
    nameGez: "መዝሙር ፲፰",
    note: "The Ethiopian Psalter follows Septuagint numbering. Hebrew 19 is Mezmur 18. The heavens declare.",
    chapters: [
      {
        number: 1,
        verses: [
          {
            n: 1,
            gez: "ሰማያት ይነግሩ ስብሐተ እግዚአብሔር ወግብረ እደዊሁ ይዜንው ጠፈር።",
            am: "ሰማያት የእግዚአብሔርን ክብር ይናገራሉ፥ የእጁንም ሥራ ጠፈር ይናገራል።",
            en: "The heavens declare the glory of God; and the firmament sheweth his handywork.",
          },
          {
            n: 2,
            am: "ቀን ለቀን ነገርን ያፈሳል፥ ሌሊትም ለሌሊት እውቀትን ይናገራል።",
            en: "Day unto day uttereth speech, and night unto night sheweth knowledge.",
          },
          {
            n: 3,
            am: "ንግግርም የለም፥ ቃልም የለም፥ ድምፃቸውም አይሰማም።",
            en: "There is no speech nor language, where their voice is not heard.",
          },
          {
            n: 4,
            am: "መሥመራቸው በምድር ሁሉ ወጥቶአል፥ ቃላቸውም እስከ ዓለም ዳርቻ። በእነርሱም ውስጥ ለፀሐይ ድንኳንን አደረገ።",
            en: "Their line is gone out through all the earth, and their words to the end of the world. In them hath he set a tabernacle for the sun.",
          },
          {
            n: 5,
            am: "እርሱም እንደ ሙሽራ ከእልፍኙ ይወጣል፤ እንደ ኃያልም ሊሮጥ ደስ ይለዋል።",
            en: "Which is as a bridegroom coming out of his chamber, and rejoiceth as a strong man to run a race.",
          },
          {
            n: 6,
            am: "መውጫው ከሰማይ ዳርቻ ነው፥ ዙረቱም እስከ ዳርቻው፤ ከትኩሳቱም የሚሰወር የለም።",
            en: "His going forth is from the end of the heaven, and his circuit unto the ends of it: and there is nothing hid from the heat thereof.",
          },
        ],
      },
    ],
  },
  {
    id: "psalm23",
    section: "dagua",
    nameEn: "Psalm 23 (LXX 22)",
    nameAm: "መዝሙረ ዳዊት ፳፪",
    nameGez: "መዝሙር ፳፪",
    note: "The shepherd psalm, numbered 22 in the Ethiopian Psalter.",
    chapters: [
      {
        number: 1,
        verses: [
          {
            n: 1,
            gez: "እግዚአብሔር ይሬዕየኒ ወኢየኀጥየኒ።",
            am: "እግዚአብሔር እረኛዬ ነው፥ የሚያሳጣኝም የለም።",
            en: "The Lord is my shepherd; I shall not want.",
          },
          {
            n: 2,
            am: "በለመለመ መስክ ያሳድረኛል፤ በዕረፍት ውኃ ዘንድ ይመራኛል።",
            en: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
          },
          {
            n: 3,
            am: "ነፍሴን ይመልሳል፤ ስለ ስሙም በጽድቅ ጎዳና ይመራኛል።",
            en: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
          },
          {
            n: 4,
            gez: "ወእመሂ ሖርኩ ውስተ ገዳመ ጽልመት፤ ኢይፈርህ እኪተ እስመ አንተ ምስሌየ አንተ።",
            am: "በሞት ጥላ ሸለቆ ብሄድ እንኳ ክፉን አልፈራም፥ አንተ ከእኔ ጋር ነህና።",
            en: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
          },
          {
            n: 5,
            am: "በጠላቶቼ ፊት ማእድን በፊቴ አዘጋጀህ፤ ራሴን በዘይት ቀባህ፥ ጽዋዬም የተትረፈረፈ ነው።",
            en: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
          },
          {
            n: 6,
            am: "በሕይወቴ ዘመን ሁሉ ቸርነትና ምሕረት ይከተሉኛል፤ በእግዚአብሔርም ቤት ለዘላለም እኖራለሁ።",
            en: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever.",
          },
        ],
      },
    ],
  },
  {
    id: "psalm121",
    section: "dagua",
    nameEn: "Psalm 121 (LXX 120)",
    nameAm: "መዝሙረ ዳዊት ፻፳",
    nameGez: "መዝሙር ፻፳",
    note: "A song of ascents — the keeper who neither slumbers nor sleeps.",
    chapters: [
      {
        number: 1,
        verses: [
          {
            n: 1,
            am: "ዓይኖቼን ወደ ተራሮች አነሣለሁ፤ እርዳታዬ ከወዴት ይመጣል?",
            en: "I will lift up mine eyes unto the hills, from whence cometh my help.",
          },
          {
            n: 2,
            am: "እርዳታዬ ከእግዚአብሔር ዘንድ ነው፥ ሰማይንና ምድርን ከፈጠረ።",
            en: "My help cometh from the Lord, which made heaven and earth.",
          },
          {
            n: 3,
            am: "እግሮችህ እንዳይሰናከሉ አይተውህም፤ የሚጠብቅህም አያንቀላፋም።",
            en: "He will not suffer thy foot to be moved: he that keepeth thee will not slumber.",
          },
          {
            n: 4,
            am: "እነሆ፥ እስራኤልን የሚጠብቅ አያንቀላፋም አይተኛምም።",
            en: "Behold, he that keepeth Israel shall neither slumber nor sleep.",
          },
          {
            n: 5,
            am: "እግዚአብሔር የሚጠብቅህ ነው፤ እግዚአብሔር በቀኝህ እጅ ጥላህ ነው።",
            en: "The Lord is thy keeper: the Lord is thy shade upon thy right hand.",
          },
          {
            n: 6,
            am: "በቀን ፀሐይ አይመታህም፥ በሌሊትም ጨረቃ።",
            en: "The sun shall not smite thee by day, nor the moon by night.",
          },
          {
            n: 7,
            am: "እግዚአብሔር ከክፉ ሁሉ ይጠብቅሃል፤ ነፍስህን ይጠብቃል።",
            en: "The Lord shall preserve thee from all evil: he shall preserve thy soul.",
          },
          {
            n: 8,
            am: "እግዚአብሔር መውጣትህንና መግባትህን ከዛሬ ጀምሮ እስከ ዘላለም ይጠብቃል።",
            en: "The Lord shall preserve thy going out and thy coming in from this time forth, and even for evermore.",
          },
        ],
      },
    ],
  },
  {
    id: "sirach43",
    section: "dagua",
    nameEn: "Sirach 43",
    nameAm: "ሲራክ ፵፫",
    nameGez: "ሲራክ ፵፫",
    note: "The Wisdom of Ben Sira — the Ethiopian Bible keeps this among the five books of Solomon. A hymn to sun, moon, and stars.",
    chapters: [
      {
        number: 43,
        verses: [
          {
            n: 1,
            am: "የከፍታው ትዕይንት የክብሩ ውበት ነው፥ የሰማይም ጠፈር በክብሩ ራእይ።",
            en: "The pride of the height, the clear firmament, the beauty of heaven, with his glorious shew.",
          },
          {
            n: 2,
            am: "ፀሐይ በመውጣቱ ሲታይ የተመሰገነ ፍጡር፥ የልዑልም ሥራ ነው።",
            en: "The sun when it appeareth, declaring at his rising a marvellous instrument, the work of the most High.",
          },
          {
            n: 3,
            am: "በቀትሩ ጊዜ ምድርን ያቃጥላል፥ በትኩሳቱስ ፊት ማን ይቆማል?",
            en: "At noon it parcheth the country, and who can abide the burning heat thereof?",
          },
          {
            n: 6,
            am: "ጨረቃም ደግሞ በዘመኗ ሁሉ ትኖራለች፤ የዘመናት መለያና የዘላለም ምልክት ናት።",
            en: "He made the moon also to serve in her season for a declaration of times, and a sign of the world.",
          },
          {
            n: 7,
            am: "ከጨረቃ በዓል ይመጣል፥ ብርሃንዋም እስከ መጨረሻዋ ይጨልማል።",
            en: "From the moon is the sign of feasts, a light that decreaseth in her perfection.",
          },
          {
            n: 9,
            am: "የሰማይ ውበት የከዋክብት ክብር ነው፥ በጌታዋ ከፍታ የምታበራ ዓለም።",
            en: "The beauty of heaven, the glory of the stars, an ornament giving light in the highest places of the Lord.",
          },
          {
            n: 10,
            am: "በቃሉ ትኖራለች፥ እንቅልፍም ሳትወስድ ትጠብቃለች።",
            en: "At the commandment of the Holy One they will stand in their order, and never faint in their watches.",
          },
        ],
      },
    ],
  },
  {
    id: "john",
    section: "wengel",
    nameEn: "John",
    nameAm: "ወንጌል ቅዱስ ዘዮሐንስ",
    nameGez: "ወንጌል ዘዮሐንስ",
    note: "The Gospel according to John, opening with the Word who was in the beginning.",
    chapters: [
      {
        number: 1,
        title: "The Word",
        verses: [
          {
            n: 1,
            gez: "በቀዳሚ ግብር ቃል ውእቱ ወቃል ኀበ እግዚአብሔር ውእቱ ወእግዚአብሔር ውእቱ ቃል።",
            am: "በመጀመሪያ ቃል ነበረ፥ ቃልም በእግዚአብሔር ዘንድ ነበረ፥ ቃልም እግዚአብሔር ነበረ።",
            en: "In the beginning was the Word, and the Word was with God, and the Word was God.",
          },
          {
            n: 2,
            am: "ይህ በመጀመሪያ በእግዚአብሔር ዘንድ ነበረ።",
            en: "The same was in the beginning with God.",
          },
          {
            n: 3,
            am: "ሁሉ በእርሱ ሆነ፥ ከሆነውም አንዳች ስንኳ ያለ እርሱ አልሆነም።",
            en: "All things were made by him; and without him was not any thing made that was made.",
          },
          {
            n: 4,
            am: "ሕይወት በእርሱ ነበረች፥ ሕይወትም የሰዎች ብርሃን ነበረች።",
            en: "In him was life; and the life was the light of men.",
          },
          {
            n: 5,
            gez: "ወብርሃን ውስተ ጽልመት የበርህ፤ ወጽልመትኒ ኢኀረዮ።",
            am: "ብርሃንም በጨለማ ይበራል፥ ጨለማውም አላሸነፈውም።",
            en: "And the light shineth in darkness; and the darkness comprehended it not.",
          },
          {
            n: 9,
            am: "ዓለምን የሚያበራ እውነተኛ ብርሃን ሊመጣ ወደ ዓለም ነበረ።",
            en: "That was the true Light, which lighteth every man that cometh into the world.",
          },
          {
            n: 14,
            gez: "ወቃል ሥጋ ኮነ ወኀደረ ኀቤነ፤ ወርኢነ ስብሓቲሁ ስብሓተ ኀበ አብ ዋሕድ ምሉአ ጸጋ ወጽድቅ።",
            am: "ቃልም ሥጋ ሆነ፥ በእኛም አደረ፤ ጸጋንና እውነትንም ተሞልቶ ክብሩን አየን፥ ከአባት ዘንድ የሆነ አንድያ ልጅ ክብር።",
            en: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",
          },
        ],
      },
      {
        number: 3,
        title: "Nicodemus by night",
        verses: [
          {
            n: 16,
            gez: "እስመ ከመዝ አፍቀሮ እግዚአብሔር ለዓለም እስከ ወሀበ ወልዶ ዋሕደ፤ ከመ ኵሉ ዘየአምን ቦቱ ኢይትሐጐል አላ ይረክብ ሕይወተ ዘለዓለም።",
            am: "እግዚአብሔርስ ለዓለም እንዲሁ ወዶአልና አንድያ ልጁን ሰጠ፥ በእርሱ የሚያምን ሁሉ የዘላለም ሕይወት እንዲኖረው እንጂ እንዳይጠፋ።",
            en: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
          },
          {
            n: 19,
            am: "ፍርዱም ይህ ነው፤ ብርሃን ወደ ዓለም መጥቶአል፥ ሰዎች ግን ሥራቸው ክፉ ስለ ሆነ ከብርሃን ይልቅ ጨለማን ወደዱ።",
            en: "And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil.",
          },
          {
            n: 21,
            am: "እውነትን የሚያደርግ ግን ሥራው በእግዚአብሔር እንደ ተደረገ ይገለጥ ዘንድ ወደ ብርሃን ይመጣል።",
            en: "But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in God.",
          },
        ],
      },
    ],
  },
  {
    id: "matthew5",
    section: "wengel",
    nameEn: "Matthew 5",
    nameAm: "ወንጌል ቅዱስ ዘማቴዎስ ፭",
    nameGez: "ወንጌል ዘማቴዎስ",
    note: "The Beatitudes from the Sermon on the Mount.",
    chapters: [
      {
        number: 5,
        verses: [
          {
            n: 3,
            gez: "ብፁዓን መናኒ መንፈስ እስመ እሙንቱ ይረክቡ መንግሥተ ሰማያት።",
            am: "በመንፈስ ድሆች ብፁዓን ናቸው፥ መንግሥተ ሰማያት የእነርሱ ናትና።",
            en: "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
          },
          {
            n: 4,
            am: "የሚያዝኑ ብፁዓን ናቸው፥ መፅናናትን ያገኛሉና።",
            en: "Blessed are they that mourn: for they shall be comforted.",
          },
          {
            n: 5,
            am: "የዋሆች ብፁዓን ናቸው፥ ምድርን ይወርሳሉና።",
            en: "Blessed are the meek: for they shall inherit the earth.",
          },
          {
            n: 6,
            am: "ጽድቅን የሚራቡና የሚጠሙ ብፁዓን ናቸው፥ ይጠግባሉና።",
            en: "Blessed are they which do hunger and thirst after righteousness: for they shall be filled.",
          },
          {
            n: 7,
            am: "ምሕረት የሚያደርጉ ብፁዓን ናቸው፥ እነርሱ ምሕረትን ያገኛሉና።",
            en: "Blessed are the merciful: for they shall obtain mercy.",
          },
          {
            n: 8,
            am: "ልበ ንጹሐን ብፁዓን ናቸው፥ እግዚአብሔርን ያዩታልና።",
            en: "Blessed are the pure in heart: for they shall see God.",
          },
          {
            n: 9,
            am: "ሰላም የሚያደርጉ ብፁዓን ናቸው፥ የእግዚአብሔር ልጆች ይባላሉና።",
            en: "Blessed are the peacemakers: for they shall be called the children of God.",
          },
          {
            n: 14,
            am: "እናንተ የዓለም ብርሃን ናችሁ። በተራራ ላይ ያለች ከተማ ልትሰወር አትችልም።",
            en: "Ye are the light of the world. A city that is set on an hill cannot be hid.",
          },
          {
            n: 16,
            am: "ብርሃናችሁም በሰው ፊት ይብራ፥ መልካሙን ሥራችሁን አይተው በሰማያት ያለውን አባታችሁን እንዲያከብሩ።",
            en: "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.",
          },
        ],
      },
    ],
  },
  {
    id: "enoch",
    section: "broader",
    nameEn: "1 Enoch",
    nameAm: "መጽሐፈ ሄኖክ",
    nameGez: "መጽሐፈ ሄኖክ",
    note: "Henok — preserved complete only in Ge'ez. The Ethiopian Church kept the book the rest of Christendom let fall. Chapter 72 is the Book of the Luminaries.",
    chapters: [
      {
        number: 1,
        title: "The blessing of Enoch",
        verses: [
          {
            n: 1,
            gez: "ቃለ በረከት ሄኖክ ዘቦቱ ባረኮሙ ለኅሩያን ወጻድቃን እለ ሀለዉ ይኩኑ በዕለተ ምንዳቤ፤ ሶበ ኵሉ እኩያን ወኀጥኣን ለይሰሐቱ።",
            am: "የሄኖክ የበረከት ቃል፥ በመከራ ቀን በሕይወት የሚኖሩትን ምርጦችና ጻድቃን የባረከበት፥ ክፉዎችና አምላክ የሌላቸው ሁሉ ሲወገዱ።",
            en: "The words of the blessing of Enoch, wherewith he blessed the elect and righteous, who will be living in the day of tribulation, when all the wicked and godless are to be removed.",
          },
          {
            n: 2,
            am: "መልካም ሰው ሄኖክ መልስ አለ፥ ራእዩም ከእግዚአብሔር ተከፈተለት።",
            en: "And he took up his parable and said — Enoch a righteous man, whose eyes were opened by God.",
          },
          {
            n: 3,
            am: "ቅዱሱ ታላቁም ከማደሪያው ይወጣል፥ የዘላለም አምላክም በምድር ላይ ይረግጣል።",
            en: "The Holy Great One will come forth from His dwelling, and the eternal God will tread upon the earth.",
          },
          {
            n: 8,
            am: "ለጻድቃንም ሰላም ይሆናል፤ የዘላለም ብርሃን ያበራላቸዋል።",
            en: "But with the righteous He will make peace, and will protect the elect, and mercy shall be upon them. And they shall all belong to God, and they shall be prospered, and they shall all be blessed. And He will help them all, and light shall appear unto them, and He will make peace with them.",
          },
        ],
      },
      {
        number: 72,
        title: "The book of the courses of the heavenly luminaries",
        verses: [
          {
            n: 1,
            gez: "መጽሐፈ ዑደተ ብርሃናተ ሰማይ፤ ኵሉ መልክዖሙ ወመዋዕሊሆሙ ወሥልጣኖሙ ወስሞሙ።",
            am: "የሰማይ ብርሃናት ዑደት መጽሐፍ፥ መልካቸው ሁሉ፥ ቀኖቻቸው፥ ሥልጣናቸውና ስማቸው።",
            en: "The book of the courses of the luminaries of the heaven, the relations of each, according to their classes, their dominion and their seasons.",
          },
          {
            n: 2,
            am: "ፀሐይ ከበስተ ምሥራቅ በሰማይ በሮች ትወጣለች፥ በበስተ ምዕራብ በሮችም ትገባለች።",
            en: "The sun is a luminary whose egress is at the eastern portals of heaven, and whose ingress is at the western portals of the heaven.",
          },
          {
            n: 3,
            am: "በሰማይ ውስጥ ስድስት በሮች በምሥራቅ አየሁ፥ ስድስትም በምዕራብ፤ ፀሐይና ጨረቃ በእነዚህ በሮች ይወጣሉ ይገባሉም።",
            en: "I saw six portals in which the sun rises, and six portals in which the sun sets; and the moon rises and sets in those portals.",
          },
          {
            n: 4,
            am: "የፀሐይ ሰረገላ ነፋስ ይሠራዋል፤ ፀሐይም ታላቅ ብርሃን ትሰጣለች።",
            en: "The chariot on which the sun ascends is driven by the wind, and the sun gives light through his heaven.",
          },
          {
            n: 32,
            am: "ዓመቱ ከአራት መቶ ስልሳ አራት ቀን ይደመራል፤ የብርሃናትም ሕግ እስከ ዘላለም አይሻርም።",
            en: "And the year is completed in three hundred and sixty-four days. And the law of the stars is for ever.",
          },
          {
            n: 33,
            am: "ይህችም የፀሐይ ሥርዓት ናት፤ መውጣቷና መግባቷ በእነዚህ በሮች ነው።",
            en: "This is the law of the sun, of his going forth and of his coming in, as it is appointed.",
          },
        ],
      },
    ],
  },
  {
    id: "jubilees",
    section: "broader",
    nameEn: "Jubilees",
    nameAm: "መጽሐፈ ኩፋሌ",
    nameGez: "ኩፋሌ",
    note: "Kufale — the Little Genesis. Kept in the Ethiopian canon; it retells creation in weeks of years.",
    chapters: [
      {
        number: 2,
        title: "The work of the six days",
        verses: [
          {
            n: 1,
            am: "መልአኩም ለሙሴ እንዲህ አለው፤ ጻፍ የፍጥረት ቃልን፥ እግዚአብሔር በስድስት ቀን ሰማይንና ምድርን እንደ ፈጠረ፥ ሰባተኛውንም ቀን እንዳደረገው።",
            en: "And the angel of the presence spake to Moses, saying: Write the complete history of the creation, how in six days the Lord God finished all His works and all that He created, and kept Sabbath on the seventh day.",
          },
          {
            n: 8,
            am: "በአራተኛው ቀን ፀሐይንና ጨረቃን ከዋክብትንም አደረገ፥ በሰማይ ጠፈርም አኖራቸው።",
            en: "And on the fourth day He created the sun and the moon and the stars, and set them in the firmament of the heaven.",
          },
          {
            n: 9,
            am: "ፀሐይን በምድር ላይ ታላቅ ምልክት አደረጋት ለቀናትና ለሰንበታት ለወራትና ለዓመታት ለኩፋሌዎችም።",
            en: "And He set the sun to be a great sign on the earth for days and for sabbaths and for months and for feasts and for years and for sabbaths of years and for jubilees and for all seasons of the years.",
          },
          {
            n: 10,
            am: "ጨረቃንና ከዋክብትንም ለሌሊት ያበሩ ዘንድ አደረገ።",
            en: "And the moon and the stars He appointed to give light in the night.",
          },
        ],
      },
    ],
  },
  {
    id: "isaiah40",
    section: "nebiyat",
    nameEn: "Isaiah 40",
    nameAm: "ትንቢተ ኢሳይያስ ፵",
    nameGez: "ኢሳይያስ",
    note: "Lift up your eyes on high — who created these?",
    chapters: [
      {
        number: 40,
        verses: [
          {
            n: 21,
            am: "አልሰማችሁምን? አልነገሩአችሁምን? ከመጀመሪያ አልተነገረላችሁምን? የምድር መሠረቶችን አላስተዋላችሁምን?",
            en: "Have ye not known? have ye not heard? hath it not been told you from the beginning? have ye not understood from the foundations of the earth?",
          },
          {
            n: 22,
            am: "እርሱ በምድር ክብ ዙሪያ ይቀመጣል፥ የሚኖሩባትም እንደ ኩብኩባ ናቸው፤ ሰማያትንም እንደ መጋረጃ ይዘረጋል፥ እንደ መኖሪያ ድንኳንም ይዘረጋቸዋል።",
            en: "It is he that sitteth upon the circle of the earth, and the inhabitants thereof are as grasshoppers; that stretcheth out the heavens as a curtain, and spreadeth them out as a tent to dwell in.",
          },
          {
            n: 26,
            am: "ዓይኖቻችሁን ወደ ላይ አንሡ፥ እነዚህንስ ማን ፈጠረ እዩ፤ በቍጥር ሠራዊታቸውን የሚያወጣ፥ ሁሉን በስም የሚጠራ ነው።",
            en: "Lift up your eyes on high, and behold who hath created these things, that bringeth out their host by number: he calleth them all by names by the greatness of his might.",
          },
          {
            n: 31,
            am: "እግዚአብሔርን የሚጠባበቁ ግን ኃይላቸውን ያድሳሉ፤ እንደ ንስር በክንፍ ይወጣሉ፤ ይሮጣሉ አይታክቱም፥ ይሄዳሉ አይደክሙም።",
            en: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
          },
        ],
      },
    ],
  },
];

export const CANON_INDEX: { section: string; books: string[] }[] = [
  {
    section: "Orit (8)",
    books: ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth"],
  },
  {
    section: "Kings & Writings",
    books: ["1–2 Samuel", "1–2 Kings", "1–2 Chronicles", "Ezra–Nehemiah", "Ezra Sutuel", "Esther", "Tobit", "Judith", "Job"],
  },
  {
    section: "Five of Solomon",
    books: ["Psalms (151)", "Proverbs", "Ecclesiastes", "Song of Songs", "Wisdom", "Sirach"],
  },
  {
    section: "Prophets",
    books: ["Isaiah", "Jeremiah", "Baruch", "Lamentations", "Ezekiel", "Daniel", "Minor prophets"],
  },
  {
    section: "Broader Old Testament",
    books: ["1 Enoch", "Jubilees", "1–3 Meqabyan", "4 Baruch", "Josippon"],
  },
  {
    section: "New Testament (35)",
    books: [
      "Matthew",
      "Mark",
      "Luke",
      "John",
      "Acts",
      "14 Pauline letters",
      "7 Catholic letters",
      "Revelation",
      "Sinodos",
      "1–2 Covenant",
      "Clement",
      "Didascalia",
    ],
  },
];

export function getBook(id: string): Book | undefined {
  return BOOKS.find((b) => b.id === id);
}
