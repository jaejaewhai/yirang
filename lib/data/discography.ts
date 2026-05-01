export type DiscographyItem = {
  year: number
  titleKo: string
  titleEn: string
  format: string
  duration: string
  url?: string
  hit?: boolean
}

export const discography: DiscographyItem[] = [
  { year: 2008, titleKo: "스타워즈 프로젝트", titleEn: "Star Wars Projects", format: "Compilation", duration: "1:39:00", url: "https://www.youtube.com" },
  { year: 2009, titleKo: "안 신나는 땐스 뮤직 스페샬", titleEn: "Undanceable Dance Music Special", format: "Compilation", duration: "0:46:32" },
  { year: 2011, titleKo: "잘 알지도 못하면서", titleEn: "You Don't Even Know", format: "Single", duration: "0:05:31" },
  { year: 2012, titleKo: "욘욘슨", titleEn: "Yon Yonson", format: "Full Album", duration: "0:43:58", url: "https://www.youtube.com" },
  { year: 2012, titleKo: "프로펠러", titleEn: "Propeller", format: "Music Video", duration: "0:03:55", url: "https://www.youtube.com", hit: true },
  { year: 2016, titleKo: "신곡의 방", titleEn: "New Song Room Seoul", format: "Compilation", duration: "0:36:27" },
  { year: 2016, titleKo: "신의 놀이", titleEn: "Playing God", format: "Full Album", duration: "0:36:09", url: "https://www.youtube.com", hit: true },
  { year: 2016, titleKo: "나는 왜 알아요/웃어 유머에", titleEn: "Why Do I Know?/Laugh, as You Like", format: "Music Video", duration: "0:06:24", url: "https://www.youtube.com" },
  { year: 2017, titleKo: "숨 일곱 번째 그린플러그드 공식 옴니버스 앨범", titleEn: "", format: "Compilation", duration: "" },
  { year: 2017, titleKo: "임진강", titleEn: "Imjingang", format: "Music Video", duration: "0:03:29", url: "https://www.youtube.com", hit: true },
  { year: 2018, titleKo: "잘 듣고 있어요", titleEn: "I'm All Ears for You", format: "Live Video", duration: "0:04:34", url: "https://www.youtube.com", hit: true },
  { year: 2018, titleKo: "그러면", titleEn: "", format: "Live Album", duration: "" },
  { year: 2019, titleKo: "런어웨이", titleEn: "Run Away", format: "Music Video", duration: "0:03:07", url: "https://www.youtube.com" },
  { year: 2020, titleKo: "이야기, 멀고도 가까운", titleEn: "", format: "Compilation", duration: "0:05:17" },
  { year: 2020, titleKo: "우리의 방", titleEn: "Woori's Room", format: "Live Video", duration: "0:03:57", url: "https://www.youtube.com" },
  { year: 2020, titleKo: "환란의 세대", titleEn: "The Generation of Tribulation", format: "Music Video", duration: "0:05:17", url: "https://www.youtube.com", hit: true },
  { year: 2021, titleKo: "임진강", titleEn: "Imjingang", format: "Single", duration: "0:03:24", hit: true },
  { year: 2021, titleKo: "Pain on All Fronts", titleEn: "Pain on All Fronts", format: "Compilation", duration: "0:05:36" },
  { year: 2021, titleKo: "늑대가 나타났다", titleEn: "There is a Wolf", format: "Full Album", duration: "0:46:39", hit: true },
  { year: 2021, titleKo: "환란의 세대", titleEn: "The Generation of Tribulation", format: "Live Video", duration: "0:04:55", url: "https://www.youtube.com", hit: true },
  { year: 2021, titleKo: "박강아름 결혼하다", titleEn: "Areum Married", format: "EP", duration: "0:05:10" },
  { year: 2021, titleKo: "웃어, 유머에", titleEn: "Laugh, as You Like", format: "Music Video", duration: "0:06:23", url: "https://www.youtube.com", hit: true },
  { year: 2021, titleKo: "대화", titleEn: "Conversation", format: "Music Video", duration: "0:03:43", url: "https://www.youtube.com", hit: true },
  { year: 2021, titleKo: "빵을 먹었어", titleEn: "Pang", format: "Live Video", duration: "0:05:30", url: "https://www.youtube.com" },
  { year: 2021, titleKo: "의식적으로 잠을 자야겠다", titleEn: "I Want to Sleep Willfully", format: "Live Video", duration: "0:05:46", url: "https://www.youtube.com" },
  { year: 2021, titleKo: "삶과 잠과 언니와 나", titleEn: "PRIDE", format: "Single", duration: "0:03:56" },
  { year: 2022, titleKo: "의식적으로 잠을 자야겠다", titleEn: "I Want to Sleep Willfully", format: "Animation", duration: "0:06:00", url: "https://www.youtube.com" },
  { year: 2023, titleKo: "PRIDE", titleEn: "Pride Live In Seoul", format: "Live Album", duration: "0:35:38", url: "https://www.youtube.com" },
  { year: 2024, titleKo: "왜 내가 너의 친구라고 말하지 않는 것인가", titleEn: "Why Won't You Call Me Your Friend", format: "EP", duration: "0:31:58" },
  { year: 2024, titleKo: "오늘 나는", titleEn: "Today I Am", format: "Live Video", duration: "0:06:19", url: "https://www.youtube.com" },
  { year: 2024, titleKo: "Names of Water", titleEn: "Names of Water", format: "Single", duration: "0:11:47" },
  { year: 2025, titleKo: "EBS 스페이스 공감 명반특집 이랑", titleEn: "EBS Space Sympathy Best Album", format: "Live Video", duration: "0:03:43", url: "https://www.youtube.com" },
  { year: 2025, titleKo: "Slowly Come to Thee", titleEn: "Slowly Come to Thee", format: "Music Video", duration: "0:05:00", url: "https://www.youtube.com" },
  { year: 2025, titleKo: "늑대가 나타났다 알뜰 고양이 에디션", titleEn: "", format: "LP", duration: "" },
  { year: 2025, titleKo: "SHAME", titleEn: "SHAME", format: "Single", duration: "" },
  { year: 2025, titleKo: "이 순간의 노래", titleEn: "", format: "Single", duration: "" },
]

export const formats = [...new Set(discography.map(d => d.format))]
export const years = [...new Set(discography.map(d => d.year))].sort()