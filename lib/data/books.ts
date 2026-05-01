export type Book = {
  year: string
  titleKo: string
  titleEn?: string
  publisher: string
  publisherEn?: string
  info?: string
  category: string
  link?: string
  image?: string 
}

export const categories = [
  "Comics",
  "Nonfiction",
  "Fiction",
  "Collaborative",
  "Web Novel",
  "Translation",
]

export const books: Book[] = [
  //Comics
  { year: "2013", titleKo: "이랑 네컷 만화", publisher: "유어마인드", publisherEn: "YOUR-MIND", category: "Comics", image: "/images/books/2013_Lang Lee Four-cut Manga.jpg"  },
  { year: "2015", titleKo: "내가 30대가 됐다", titleEn: "Damn, I'm 30 now", publisher: "소시민워크 · 유어마인드", publisherEn: "Sosiminwork · YOUR-MIND", category: "Comics", image: "/images/books/2015_Damn Im 30 now.jpg" },
  { year: "2019 JP", titleKo: "私が30代になった", titleEn: "Damn, I'm 30 now", publisher: "타바북스", publisherEn: "Tababooks", info: "Editor 宮川真紀 · Translator 中村友紀", category: "Comics", image: "/images/books/2015_Damn Im 30 now_JP.jpg" },

  //Nonfiction
  { year: "2016", titleKo: "대체 뭐하자는 인간이지 싶었다", titleEn: "Who Do You Think You Are", publisher: "달 출판사", publisherEn: "DAL Publishers", category: "Nonfiction", image: "/images/books/2016_Who Do You Think You Are.jpg" },
  { year: "2018 JP", titleKo: "悲しくてかっこいい人", titleEn: "Who Do You Think You Are", publisher: "리틀모어", publisherEn: "Little More", info: "Editor 當眞文 · Translator 오영아", category: "Nonfiction", image: "/images/books/2016_Who Do You Think You Are_JP.jpg" },
  { year: "2020", titleKo: "좋아서 하는 일에도 돈은 필요합니다", titleEn: "I'm an artist, so let's talk about money", publisher: "창비", publisherEn: "Changbi", category: "Nonfiction", image: "/images/books/2020_Money.jpg" },
  { year: "2021 JP", titleKo: "話し足りなかった日", titleEn: "I'm an artist, so let's talk about money", publisher: "리틀모어", publisherEn: "Little More", info: "Editor 當眞文 · Translator 오영아", category: "Nonfiction", image: "/images/books/2020_Money_JP.jpg" },
  { year: "2025 JP", titleKo: "声を出して、呼びかけて、話せばいいの", publisher: "가와데쇼보", publisherEn: "河出書房新社", info: "Editor 竹花進 · Translator 斎藤真理子", category: "Nonfiction", image: "/images/books/2022_Make Some Noise_JP.jpg" },
  { year: "2025", titleKo: "기타를 작게 치면서", publisher: "아침달", info: "Editor 서윤후", category: "Nonfiction", image: "/images/books/2025_Guitar.jpg" },
  { year: "2026", titleKo: "엄마와 딸들의 미친년의 역사", publisher: "이야기장수", info: "Editor 이연실", category: "Nonfiction", image: "/images/books/2026_Crazy.jpeg" },
  { year: "2026 TW", titleKo: "我是這樣走到這裡", titleEn: "i have lived a life", publisher: "Fantimate", category: "Nonfiction", image: "/images/books/2026_Crazy_TW.jpg" },

  //Fiction
  { year: "2019", titleKo: "오리 이름 정하기", titleEn: "How To Name The Duck", publisher: "위즈덤하우스", publisherEn: "Wisdomhouse INC", category: "Fiction", image: "/images/books/2019_How To Name The Duck.jpg" },
  { year: "2020 JP", titleKo: "アヒルの名前づけ", titleEn: "How To Name The Duck", publisher: "가와데쇼보", publisherEn: "河出書房新社", info: "Editor 竹花進 · Translator 斎藤真理子 · 浜辺ふう", category: "Fiction", image: "/images/books/2019_How To Name The Duck_JP.png" },

  // Collaborative
  { year: "2018", titleKo: "나다운 페미니즘", titleEn: "Here We Are: Feminism for the Real World", publisher: "창비", publisherEn: "Changbi", info: "여전히 혼란스러워 / 여자 친구에게 고백을 받았다", category: "Collaborative", image: "/images/books/2018_Feminism.jpg" },
  { year: "2020", titleKo: "소년소녀, 고양이를 부탁해!", publisher: "우리학교", publisherEn: "Woorischool", info: "할배 고양이 준이치", category: "Collaborative", image: "images/books/2020_cat.jpg" },
  { year: "2020", titleKo: "이야기, 멀고도 가까운", publisher: "허스토리", publisherEn: "Herstorybook", info: "경계를 넘는 새처럼", category: "Collaborative" },
  { year: "2021", titleKo: "지금은 살림력을 키울 시간입니다", publisher: "휴머니스트", publisherEn: "Humanistbooks", info: "작은 ㄷ자 안에서 예술 회사 꾸려 나가기", category: "Collaborative", image: "/images/books/2021_homemaking.jpg" },
  { year: "2021", titleKo: "괄호가 많은 편지", publisher: "문학동네", publisherEn: "Munhak", category: "Collaborative", image: "/images/books/2021_Mail.jpg" },
  { year: "2021", titleKo: "언니에게 보내는 행운의 편지", publisher: "창비", publisherEn: "Changbi", category: "Collaborative", image: "/images/books/2021_Lucky Mail.jpg" },
  { year: "2021", titleKo: "모쪼록 잘 부탁드립니다", titleEn: "Yours Sincerely", publisher: "미디어 창비", publisherEn: "Media Changbi", category: "Collaborative", image: "/images/books/2021_Yours Sincerely.jpg" },
  { year: "2022", titleKo: "쓰고 싶다 쓰고 싶지 않다", publisher: "유선사", publisherEn: "Yuseonsa", info: "오늘도 춤을 추며 입장합니다, 쓰기 지옥", category: "Collaborative", image: "/images/books/2022_dont wanna.jpg" },
  { year: "2022 JP", titleKo: "何卒よろしくお願いいたします", titleEn: "Yours Sincerely", publisher: "타바북스", publisherEn: "Tababooks", info: "Editor 宮川真紀 · Translator 小山内園子", category: "Collaborative", image: "/images/books/2021_Yours Sincerely_JP.jpg" },
  { year: "2023", titleKo: "요즘 사는 맛 2", publisher: "위즈덤하우스", publisherEn: "Wisdomhouse INC", info: "혀가 '펑' 트이는 맛의 세상 속으로", category: "Collaborative", image: "/images/books/2023_taste.jpg" },
  { year: "2023 JP", titleKo: "カッコの多い手紙", publisher: "쇼시칸칸보", publisherEn: "Kankanbou", info: "Translator 吉良佳奈江", category: "Collaborative" },
  { year: "2024", titleKo: "월간 십육일", publisher: "사계절출판사", publisherEn: "Sakyejul", info: "네가 그 친구를 계속 기억하면 된단다", category: "Collaborative", image: "/images/books/2024_sixteenth.jpg" },
  { year: "2024", titleKo: "음악의 사생활99: 2010년 이랑", publisher: "삐약삐약북스", publisherEn: "Ppiyackppiyackbooks", category: "Collaborative", image: "/images/books/2024_Personal.jpg" },
  { year: "2025 JP", titleKo: "음악의 사생활99: 2010년 이랑 일본반", publisher: "스윗드림프레스", publisherEn: "SweetDreamPress", category: "Collaborative" },

  // Web Novel
  { year: "2022", titleKo: "나는야 질투왕", publisher: "리디북스", publisherEn: "RIDI", info: "습관적인 질투를 벗어나면 더 많은 사랑이 찾아오지", category: "Web Novel", image: "/images/books/2022_Jealousy.jpg" },
  { year: "2024", titleKo: "오늘은 화해하지 않을 여자들", publisher: "리디북스", publisherEn: "RIDI", category: "Web Novel", image: "/images/books/2024_Reconcile.jpg" },

  // Translation
  { year: "2025", titleKo: "내 고양이 포", publisher: "다산북스", publisherEn: "Dasanbooks", info: "JP → KR · 이와세 조코", category: "Translation" },
  
]