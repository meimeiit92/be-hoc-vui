# 🎓 Bé Học Vui

Website học tập cho bé **6 tuổi**: bảng chữ cái tiếng Việt, tập đọc, toán cộng trừ trong 20,
alphabet và từ vựng tiếng Anh. Mỗi bài có phần **Học** và phần **Kiểm tra** (10 câu, chấm điểm,
tính sao). Các môn chữ học bằng **thẻ lật có phát âm**; môn Toán có màn hình dạy riêng gồm
lời giảng, demo từng bước và 5 câu tập thử không tính điểm. **Mọi bài đều học lại được
không giới hạn số lần.** Tiến trình được lưu trên máy và hệ thống tự **gợi ý bài học mỗi ngày**
dựa trên chỗ bé còn yếu.

Không cần build, không cần server backend — chỉ là HTML + CSS + JavaScript thuần (ES modules).

---

## 1. Chạy thử trên máy

Vì dùng ES modules, **không mở trực tiếp bằng cách nhấp đôi `index.html`** (trình duyệt sẽ chặn
vì lý do bảo mật `file://`). Hãy chạy một web server tĩnh:

```bash
# Cách 1 — Python (có sẵn trên macOS / Linux)
python3 -m http.server 8000

# Cách 2 — Node.js
npx serve .

# Cách 3 — VS Code: cài extension "Live Server", bấm chuột phải index.html → Open with Live Server
```

Rồi mở `http://localhost:8000`.

---

## 2. Đưa lên Internet (chọn 1 cách)

| Cách | Các bước | Ghi chú |
|---|---|---|
| **Netlify Drop** | Vào https://app.netlify.com/drop → kéo cả thư mục này vào | Nhanh nhất, ~30 giây, có link https ngay |
| **Vercel** | `npm i -g vercel` → `vercel` trong thư mục này | Miễn phí, tự cấp domain |
| **GitHub Pages** | Push thư mục lên repo → Settings › Pages › Deploy from branch `main` / `root` | Miễn phí, link dạng `username.github.io/ten-repo` |
| **Cloudflare Pages** | Tạo project → connect repo hoặc upload trực tiếp | Nhanh ở Việt Nam |

Không cần cấu hình gì thêm: mọi đường dẫn trong project đều là **đường dẫn tương đối**,
nên site chạy được cả ở thư mục con (ví dụ `/be-hoc-vui/`).

### Cài như một app trên iPad / điện thoại
Mở link trên Safari (iPad/iPhone) hoặc Chrome (Android) → menu **Chia sẻ / ⋮** →
**Thêm vào Màn hình chính**. Nhờ `manifest.webmanifest`, app sẽ mở toàn màn hình,
không có thanh địa chỉ — bé khó bấm ra ngoài.

---

## 3. Nội dung bài học (46 bài)

| Môn | Số bài | Nội dung |
|---|---|---|
| 🇻🇳 **Chữ cái tiếng Việt** | 9 | 29 chữ cái (chia 5 nhóm), 5 dấu thanh, 11 âm ghép (ch, gh, gi, kh, ng, ngh, nh, ph, qu, th, tr), 1 bài ôn tập |
| 📖 **Tập đọc tiếng Việt** | 8 | Vần có N / M / NG, vần hai nguyên âm, vần có T-C-P, ghép tiếng đơn giản, ghép tiếng có vần, đọc câu ngắn |
| 🔢 **Toán cộng trừ** | 16 | Đếm 1–10, 11–20, nhận biết mặt số, so sánh, cộng/trừ trong 5 → 10 → 20, cộng qua 10, trừ qua 10, tìm số còn thiếu, toán đố có hình, ôn tập |
| 🔤 **Alphabet tiếng Anh** | 5 | A–Z chia 4 nhóm, có phát âm (phonics) và từ ví dụ, 1 bài ôn tập |
| 🧺 **Từ vựng tiếng Anh** | 8 | Animals, Colors, Numbers, Family, Food, My body, School + ôn tập (~80 từ) |

Đề toán được **sinh tự động** nên mỗi lần làm là một đề khác — bé không học vẹt đáp án.

---

## 4. Phần "Học" của mỗi môn

**Các môn chữ (tiếng Việt, tập đọc, tiếng Anh, từ vựng)** dùng **thẻ lật**: mặt trước là chữ và
cách đọc, bấm vào thẻ để lật ra hình minh hoạ và từ ví dụ. Có nút 🔊 nghe lại, mũi tên chuyển thẻ,
bàn phím ⬅️ ➡️ Space cũng dùng được.

**Môn Toán** có màn hình dạy riêng gồm 4 phần:

1. **🎓 Cô dạy bé** — giảng bằng lời trẻ hiểu được + 3 bước làm. Có nút "Đọc cho bé nghe" đọc cả bài.
2. **👀 Cùng xem từng bước** — demo minh hoạ bằng hình, bé bấm "Bước sau" để đi từng bước, mỗi bước
   có một câu giải thích và được đọc lên. Nút "🔄 Xem lại từ đầu" và "🎲 Ví dụ khác" (sinh ví dụ mới
   với số khác) cho phép xem đi xem lại thoải mái.
   Riêng những bài khó nhất được dạy đúng mẹo tính nhẩm:
   - *Cộng qua 10* → mẹo **làm cho tròn 10** (8 + 5: tách 5 thành 2 và 3 → 8 + 2 = 10 → 10 + 3 = 13)
   - *Trừ qua 10* → mẹo **trừ về 10 trước** (13 − 5: tách 5 thành 3 và 2 → 13 − 3 = 10 → 10 − 2 = 8)
   - *So sánh* → mẹo **miệng cá sấu 🐊 quay về phía số lớn**
   - *Toán đố* → nhận **từ khoá**: "thêm / tất cả" → cộng, "cho / còn lại / ăn mất" → trừ
3. **✏️ Tập thử** — 5 câu luyện tay, hiện đáp án đúng ngay, **không tính điểm và không ghi vào tiến trình**.
   Có nút "🔄 Làm lại" để tập bao nhiêu lượt cũng được.
4. **Bảng tham khảo** — tia số 0 → 20 (bấm số để nghe đọc) hoặc bảng các cặp số cộng lại bằng 10.

### Học lại bài

Không có bài nào bị khoá sau khi học xong. Bé học lại được từ bốn chỗ:

- nút **🔄 Học lại bài này** ở cuối mọi trang học;
- bấm lại chính bài đó trong danh sách của môn (bài đã qua có nhãn *🔄 học lại*);
- nút **📖 Học lại bài này** ở màn hình kết quả sau khi kiểm tra;
- thẻ ở mục "Hôm nay học gì?" ngoài trang chủ, kể cả khi đã hiện ✅ hôm nay đã học xong.

Số lần đã học của mỗi bài được hiển thị ngay dưới tên bài.

## 5. Cách chấm điểm và lưu tiến trình

- Mỗi bài kiểm tra gồm **10 câu**, xoay vòng nhiều dạng: nghe → chọn chữ, thấy chữ → chọn hình,
  thấy hình → chọn chữ/vần, chọn dấu thanh, chọn từ tiếng Anh…
- **Sao của bài**: ≥ 90% → ⭐⭐⭐ · ≥ 70% → ⭐⭐ · ≥ 50% → ⭐. Bài được tính là **"đã qua"** khi đạt ≥ 70%.
- **Sao thưởng**: mỗi câu đúng +1 sao, cộng thêm sao khi phá kỷ lục của chính mình.
- **Chuỗi ngày học** (🔥): tăng khi bé học ít nhất 1 bài mỗi ngày liên tiếp.
- **Mức thuộc từng nội dung**: một chữ / một phép tính được coi là *đã thuộc* khi bé
  trả lời đúng **3 lần liên tiếp**. Sai một lần là đếm lại từ đầu.

Tất cả lưu trong `localStorage` của trình duyệt, khoá `behocvui.progress.v1`.
Không gửi dữ liệu đi đâu, không cần đăng nhập.

> ⚠️ Tiến trình gắn với **một trình duyệt trên một máy**. Đổi máy hoặc đổi trình duyệt là
> bắt đầu lại. Dùng **Xuất tiến trình / Nhập tiến trình** ở trang phụ huynh để chuyển sang máy khác.
> Chế độ ẩn danh (incognito) sẽ không lưu được.

---

## 6. Gợi ý bài học mỗi ngày hoạt động thế nào

Mỗi ngày hệ thống chọn ra `goal` bài (mặc định 3, bố mẹ đổi được 1–8 ở phần thông tin của bé):

1. **Ôn chỗ yếu nhất** — bài chứa nội dung bé sai nhiều nhất gần đây.
2. **Học tiếp phần đang dở** — môn có nhiều bài đã qua nhất nhưng chưa xong.
3. **Đổi môn cho vui** — bài kế tiếp ở môn ít được học nhất (thứ tự khuyến nghị:
   chữ cái → toán → tiếng Anh → tập đọc → từ vựng).
4. Nếu đã học hết → chuyển sang các bài **ôn tập tổng hợp**.

Ngoài ra, trong từng bài kiểm tra, câu hỏi được **bốc có trọng số**: nội dung bé hay sai
xuất hiện nhiều hơn (~3×), nội dung đã thuộc xuất hiện ít hơn (~0.6×). Vì vậy càng làm
nhiều, bài tập càng "vừa sức" với bé.

---

## 7. Trang phụ huynh (👨‍👩‍👧 ở góc trên phải)

- 4 chỉ số nhanh: tổng sao, chuỗi ngày, số bài đã qua, tỉ lệ trả lời đúng.
- Tiến độ từng môn theo % nội dung đã thuộc.
- Biểu đồ số câu đúng 7 ngày gần nhất (bấm để xem dạng bảng).
- **"Bé còn hay sai ở đây"** — bấm vào một mục là mở đúng bài để ôn.
- Lịch sử 12 lượt kiểm tra gần nhất.
- Bật/tắt giọng đọc & âm thanh, xuất/nhập/xoá tiến trình.

---

## 8. Về phần phát âm

Dùng **Web Speech API** có sẵn trong trình duyệt, không cần file âm thanh.

- **Tiếng Anh**: hầu như máy nào cũng đọc tốt.
- **Tiếng Việt**: phụ thuộc vào giọng đã cài trên máy. Nếu chưa có, trang chủ sẽ hiện lời nhắc.
  - **iPad / iPhone / Mac**: Cài đặt › Trợ năng › Nội dung đọc › Giọng nói → tải giọng Tiếng Việt (Linh).
  - **Windows 10/11**: Settings › Time & language › Speech › Add voices → Vietnamese.
  - **Android**: Cài đặt › Hệ thống › Ngôn ngữ › Đầu ra chuyển văn bản thành lời nói → tải tiếng Việt.
  - **Trình duyệt tốt nhất cho tiếng Việt**: Safari trên iPad/Mac, Edge hoặc Chrome trên Windows.

**Vì sao chữ cái tiếng Anh không gửi thẳng "A" cho bộ đọc:** nhiều giọng máy khi nhận đúng một ký
tự đơn lẻ sẽ tự thêm lời dẫn như *"letter A"* hoặc *"capital A"*. Nên trong `js/data/english.js`
mỗi chữ có thêm trường `say` ghi cách đọc tên chữ (`A` → `ay`, `B` → `bee`, `W` → `double you`…),
và app gửi chuỗi đó. Kết quả: bé nghe đúng "ay — apple", không có chữ thừa nào.

Âm thanh phản hồi (đúng/sai/chúc mừng) được tạo bằng Web Audio nên luôn có, không cần cài gì.

---

## 9. Cấu trúc thư mục

```
be-hoc-vui/
├── index.html                  # khung trang
├── manifest.webmanifest        # để cài như app trên iPad/điện thoại
├── assets/                     # icon app
├── css/styles.css              # toàn bộ giao diện (có cả dark mode)
└── js/
    ├── app.js                  # router (#/, #/mon/:mon, #/hoc/:bai, #/test/:bai, #/phuhuynh)
    ├── curriculum.js           # gom mọi bài học thành 1 lộ trình có thứ tự
    ├── storage.js              # lưu tiến trình + thuật toán gợi ý bài
    ├── questions.js            # sinh đề kiểm tra (bốc có trọng số)
    ├── speech.js               # phát âm
    ├── sfx.js                  # âm thanh đúng/sai
    ├── ui.js                   # tiện ích dựng DOM, confetti, modal
    ├── data/
    │   ├── vietnamese.js       # 29 chữ cái, 5 dấu, 11 âm ghép
    │   ├── vn-reading.js       # bảng vần, ghép tiếng, câu ngắn
    │   ├── english.js          # A–Z (kèm cách đọc tên chữ) + 7 chủ đề từ vựng
    │   ├── math.js             # bộ sinh đề toán
    │   └── math-teach.js       # lời giảng + demo từng bước cho 16 bài toán
    └── views/                  # home, subject, learn, math-learn, quiz, dashboard

test-math-range.mjs             # test bộ sinh đề toán: node test-math-range.mjs
```

---

## 10. Thêm / sửa nội dung

Mọi nội dung nằm trong `js/data/`, sửa xong **tải lại trang là thấy ngay**, không cần build.

**Thêm một từ vựng tiếng Anh** — mở `js/data/english.js`, tìm chủ đề rồi thêm 1 dòng:

```js
{ id: 'w-horse', word: 'horse', vi: 'con ngựa', emoji: '🐴' },
```

**Thêm một chủ đề từ vựng mới** — thêm một khối vào `EN_TOPICS`:

```js
{
  key: 'weather', title: 'Weather — Thời tiết', emoji: '🌦️',
  items: [
    { id: 'w-sunny', word: 'sunny', vi: 'nắng', emoji: '☀️' },
    { id: 'w-rainy', word: 'rainy', vi: 'mưa',  emoji: '🌧️' },
  ],
},
```

**Thêm một vần tiếng Việt** — mở `js/data/vn-reading.js`, thêm vào nhóm phù hợp:

```js
{ id: 'r-uôn', char: 'uôn', word: 'muôn', emoji: '🌾' },
```

**Thêm một dạng bài toán** — mở `js/data/math.js`, viết một hàm `gen(rng)` trả về
`{ itemId, promptText, answer, options, ... }` rồi thêm vào mảng `MATH_LESSONS`.

**Lưu ý về `id`**: mỗi item cần `id` **duy nhất và không đổi** — đó là khoá lưu mức thuộc
của bé. Đổi `id` sẽ làm mất tiến trình của item đó.

---

## 11. Đã kiểm thử

**Test bộ sinh đề toán** (`node test-math-range.mjs`, không cần trình duyệt) — sinh **4.000 đề cho
mỗi bài, tổng 64.000 đề**, kiểm tra từng đề: đáp án đúng về mặt số học; đề nằm đúng phạm vi của bài
(bài *Cộng qua 10* phải thực sự có nhớ, *Cộng trong 20* phải thực sự không nhớ, *Trừ qua 10* phải có
mượn…); không có lựa chọn nào âm hoặc vượt 20; các lựa chọn không trùng nhau và luôn chứa đáp án
đúng. Kết quả: **0 lỗi**.

**Test giao diện** (Playwright): thay bộ đọc của trình duyệt bằng bản ghi log để kiểm tra chính xác
app gửi chuỗi nào đi đọc — xác nhận 7 chữ A–G đọc đúng "ay, bee, see, dee, ee, eff, gee" kèm từ ví dụ,
và không còn chỗ nào gửi ký tự trần. Ngoài ra: mọi bài học đều có nút học lại và nút đó đưa về thẻ
đầu tiên; cả 16 bài toán có đủ 4 khối dạy và đi hết được các bước demo; phần học không ghi vào tiến
trình; làm trọn một bài kiểm tra và ra màn hình kết quả bình thường.

## 12. Giấy phép

Dùng tự do cho việc học của gia đình. Emoji do hệ điều hành cung cấp.
Font Baloo 2 & Nunito tải từ Google Fonts (có font dự phòng nếu offline).
