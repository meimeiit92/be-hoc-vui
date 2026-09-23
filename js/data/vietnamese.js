/* =============================================================
   DỮ LIỆU TIẾNG VIỆT — bảng chữ cái, dấu thanh, âm ghép
   Mỗi item: { id, char, upper, name (cách đọc), word, emoji }
   ============================================================= */

export const VN_LETTERS = [
  { id: 'vn-a',  char: 'a',  upper: 'A',  name: 'a',      word: 'bà',    emoji: '👵' },
  { id: 'vn-aw', char: 'ă',  upper: 'Ă',  name: 'á',      word: 'khăn',  emoji: '🧣' },
  { id: 'vn-aa', char: 'â',  upper: 'Â',  name: 'ớ',      word: 'cây',   emoji: '🌳' },
  { id: 'vn-b',  char: 'b',  upper: 'B',  name: 'bờ',     word: 'bé',    emoji: '👶' },
  { id: 'vn-c',  char: 'c',  upper: 'C',  name: 'cờ',     word: 'cá',    emoji: '🐟' },
  { id: 'vn-d',  char: 'd',  upper: 'D',  name: 'dờ',     word: 'dê',    emoji: '🐐' },
  { id: 'vn-dd', char: 'đ',  upper: 'Đ',  name: 'đờ',     word: 'đèn',   emoji: '💡' },
  { id: 'vn-e',  char: 'e',  upper: 'E',  name: 'e',      word: 'em',    emoji: '👧' },
  { id: 'vn-ee', char: 'ê',  upper: 'Ê',  name: 'ê',      word: 'bê',    emoji: '🐄' },
  { id: 'vn-g',  char: 'g',  upper: 'G',  name: 'gờ',     word: 'gà',    emoji: '🐔' },
  { id: 'vn-h',  char: 'h',  upper: 'H',  name: 'hờ',     word: 'hoa',   emoji: '🌸' },
  { id: 'vn-i',  char: 'i',  upper: 'I',  name: 'i',      word: 'bi',    emoji: '🔵' },
  { id: 'vn-k',  char: 'k',  upper: 'K',  name: 'ca',     word: 'kem',   emoji: '🍦' },
  { id: 'vn-l',  char: 'l',  upper: 'L',  name: 'lờ',     word: 'lá',    emoji: '🍃' },
  { id: 'vn-m',  char: 'm',  upper: 'M',  name: 'mờ',     word: 'mèo',   emoji: '🐱' },
  { id: 'vn-n',  char: 'n',  upper: 'N',  name: 'nờ',     word: 'nón',   emoji: '👒' },
  { id: 'vn-o',  char: 'o',  upper: 'O',  name: 'o',      word: 'bò',    emoji: '🐮' },
  { id: 'vn-oo', char: 'ô',  upper: 'Ô',  name: 'ô',      word: 'ô',     emoji: '☂️' },
  { id: 'vn-ow', char: 'ơ',  upper: 'Ơ',  name: 'ơ',      word: 'cờ',    emoji: '🚩' },
  { id: 'vn-p',  char: 'p',  upper: 'P',  name: 'pờ',     word: 'pin',   emoji: '🔋' },
  { id: 'vn-q',  char: 'q',  upper: 'Q',  name: 'quy',    word: 'quả',   emoji: '🍎' },
  { id: 'vn-r',  char: 'r',  upper: 'R',  name: 'rờ',     word: 'rùa',   emoji: '🐢' },
  { id: 'vn-s',  char: 's',  upper: 'S',  name: 'sờ',     word: 'sao',   emoji: '⭐' },
  { id: 'vn-t',  char: 't',  upper: 'T',  name: 'tờ',     word: 'tôm',   emoji: '🦐' },
  { id: 'vn-u',  char: 'u',  upper: 'U',  name: 'u',      word: 'cua',   emoji: '🦀' },
  { id: 'vn-uw', char: 'ư',  upper: 'Ư',  name: 'ư',      word: 'hươu',  emoji: '🦌' },
  { id: 'vn-v',  char: 'v',  upper: 'V',  name: 'vờ',     word: 'voi',   emoji: '🐘' },
  { id: 'vn-x',  char: 'x',  upper: 'X',  name: 'xờ',     word: 'xe',    emoji: '🚗' },
  { id: 'vn-y',  char: 'y',  upper: 'Y',  name: 'i dài',  word: 'yến',   emoji: '🐦' },
];

/* 5 dấu thanh — dạy trên nền chữ "a" và một tiếng ví dụ */
export const VN_TONES = [
  { id: 'tone-ngang', char: 'a',  upper: 'a',  name: 'không dấu', word: 'ma',  emoji: '👻', tone: 'thanh ngang' },
  { id: 'tone-sac',   char: 'á',  upper: 'Á',  name: 'dấu sắc',   word: 'má',  emoji: '👩', tone: 'sắc' },
  { id: 'tone-huyen', char: 'à',  upper: 'À',  name: 'dấu huyền', word: 'mà',  emoji: '🧵', tone: 'huyền' },
  { id: 'tone-hoi',   char: 'ả',  upper: 'Ả',  name: 'dấu hỏi',   word: 'mả',  emoji: '⛰️', tone: 'hỏi' },
  { id: 'tone-nga',   char: 'ã',  upper: 'Ã',  name: 'dấu ngã',   word: 'mã',  emoji: '🐴', tone: 'ngã' },
  { id: 'tone-nang',  char: 'ạ',  upper: 'Ạ',  name: 'dấu nặng',  word: 'mạ',  emoji: '🌾', tone: 'nặng' },
];

/* Âm ghép (phụ âm đôi/ba) — rất quan trọng để tập đọc */
export const VN_DIGRAPHS = [
  { id: 'dg-ch',  char: 'ch',  upper: 'CH',  name: 'chờ',      word: 'chó',   emoji: '🐕' },
  { id: 'dg-gh',  char: 'gh',  upper: 'GH',  name: 'gờ',       word: 'ghế',   emoji: '🪑' },
  { id: 'dg-gi',  char: 'gi',  upper: 'GI',  name: 'di',       word: 'giày',  emoji: '👟' },
  { id: 'dg-kh',  char: 'kh',  upper: 'KH',  name: 'khờ',      word: 'khỉ',   emoji: '🐒' },
  { id: 'dg-ng',  char: 'ng',  upper: 'NG',  name: 'ngờ',      word: 'ngựa',  emoji: '🐎' },
  { id: 'dg-ngh', char: 'ngh', upper: 'NGH', name: 'ngờ',      word: 'nghé',  emoji: '🐃' },
  { id: 'dg-nh',  char: 'nh',  upper: 'NH',  name: 'nhờ',      word: 'nhà',   emoji: '🏠' },
  { id: 'dg-ph',  char: 'ph',  upper: 'PH',  name: 'phờ',      word: 'phở',   emoji: '🍜' },
  { id: 'dg-qu',  char: 'qu',  upper: 'QU',  name: 'quờ',      word: 'quạt',  emoji: '🪭' },
  { id: 'dg-th',  char: 'th',  upper: 'TH',  name: 'thờ',      word: 'thỏ',   emoji: '🐇' },
  { id: 'dg-tr',  char: 'tr',  upper: 'TR',  name: 'trờ',      word: 'trâu',  emoji: '🐃' },
];
