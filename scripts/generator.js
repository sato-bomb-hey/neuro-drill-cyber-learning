import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utilities
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Global Questions Array
const questions = [];
let idCounter = 1;

function addQuestion(subject, grade, term, text, choices, correctIndex, explanation) {
    questions.push({
        id: `${subject}-${grade}-${term}-${String(idCounter++).padStart(4, '0')}`,
        subject, grade, term,
        text, choices, correctIndex, explanation
    });
}

// ---------------------------------------------------------
// MATH
// ---------------------------------------------------------
function generateMath() {
    const grades = [
        { grade: 'chu1', terms: ['first', 'second'], count: 67 },
        { grade: 'chu2', terms: ['first', 'second'], count: 67 },
        { grade: 'chu3', terms: ['first', 'second'], count: 66 }
    ];

    grades.forEach(g => {
        let count = 0;
        while (count < g.count) {
            const term = randChoice(g.terms);
            let text, choices, correctIndex, explanation;

            if (g.grade === 'chu1') {
                const type = randInt(1, 4);
                if (type === 1) { // Addition
                    const a = randInt(-20, 20);
                    const b = randInt(-20, 20);
                    const ans = a + b;
                    text = `(${a}) + (${b}) を計算しなさい。`;
                    let wrongs = [ans + 2, ans - 2, ans * -1, ans + 10, a - b].filter(x => x !== ans).slice(0, 3);
                    while (wrongs.length < 3) {
                        const w = ans + randInt(-5, 5);
                        if (w !== ans && !wrongs.includes(w)) wrongs.push(w);
                    }
                    const c = shuffle([ans, ...wrongs]);
                    choices = c.map(String);
                    correctIndex = c.indexOf(ans);
                    explanation = `足し算を計算します。${a} + (${b}) = ${ans} です。`;
                } else if (type === 2) { // eq
                    const x = randInt(2, 9);
                    const a = randInt(2, 9);
                    const b = randInt(1, 20);
                    const ans = x;
                    const cVal = a * x + b;
                    text = `方程式 ${a}x + ${b} = ${cVal} を解きなさい。`;
                    const wrongs = [x + 1, x - 1, x + 2].filter(w => w !== ans);
                    const c = shuffle([ans, ...wrongs]);
                    choices = c.map(val => `x=${val}`);
                    correctIndex = c.indexOf(ans);
                    explanation = `${a}x = ${cVal} - ${b} = ${a * x}。よって x = ${x}。`;
                } else if (type === 3) { // multiply
                    const a = randInt(-12, 12);
                    const b = randInt(-12, 12);
                    const ans = a * b;
                    text = `(${a}) × (${b}) を計算しなさい。`;
                    const wrongs = [ans + a, ans - b, ans * -1, ans + 1].filter(x => x !== ans).slice(0, 3);
                    while (wrongs.length < 3) {
                        let w = randInt(-144, 144);
                        if (w !== ans && !wrongs.includes(w)) wrongs.push(w);
                    }
                    const c = shuffle([ans, ...wrongs]);
                    choices = c.map(String);
                    correctIndex = c.indexOf(ans);
                    explanation = `${a} × (${b}) = ${ans}。`;
                } else { // proportion
                    const k = randInt(2, 8);
                    const x = randInt(2, 8);
                    const ans = k * x;
                    text = `y が x に比例し、比例定数が ${k} である。x = ${x} のとき y はいくつか。`;
                    const wrongs = [k + x, k * x + 1, k * (x + 1)].filter(w => w !== ans).slice(0, 3);
                    const c = shuffle([ans, ...wrongs]);
                    choices = c.map(String);
                    correctIndex = c.indexOf(ans);
                    explanation = `y = ${k}x に x = ${x} を代入して、y = ${ans}。`;
                }
            } else if (g.grade === 'chu2') {
                const type = randInt(1, 3);
                if (type === 1) { // linear func
                    const a = randInt(-5, 5) || 1;
                    const b = randInt(-10, 10);
                    const x = randInt(-5, 5);
                    const ans = a * x + b;
                    text = `一次関数 y = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} で、x = ${x} のときの y の値はいくつか。`;
                    let wrongs = [ans + 1, ans - 1, ans + 2].filter(w => w !== ans);
                    const c = shuffle([ans, ...wrongs]);
                    choices = c.map(String);
                    correctIndex = c.indexOf(ans);
                    explanation = `${a} × (${x}) ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${ans}。`;
                } else if (type === 2) { // sys eq
                    const x = randInt(1, 5);
                    const y = randInt(1, 5);
                    const c1 = x + y;
                    const c2 = x - y;
                    text = `連立方程式 x + y = ${c1}, x - y = ${c2} を解きなさい。`;
                    const ansStr = `x=${x}, y=${y}`;
                    const wrongs = [`x=${x + 1}, y=${y}`, `x=${x}, y=${y + 1}`, `x=${y}, y=${x}`].filter(w => w !== ansStr);
                    const c = shuffle([ansStr, ...wrongs]);
                    choices = c;
                    correctIndex = c.indexOf(ansStr);
                    explanation = `両辺を足すと 2x = ${c1 + c2} で x = ${x}。y = ${y}。`;
                } else { // angles
                    const n = randInt(5, 10);
                    const ans = 180 * (n - 2);
                    text = `${n}角形の内角の和は何度か。`;
                    let wrongs = [180 * (n - 1), 180 * n, 360].filter(w => w !== ans);
                    const c = shuffle([ans, ...wrongs]);
                    choices = c.map(v => `${v}°`);
                    correctIndex = c.indexOf(ans);
                    explanation = `n角形の内角の和は 180 × (n - 2)。よって 180 × ${n - 2} = ${ans}°。`;
                }
            } else { // chu3
                const type = randInt(1, 3);
                if (type === 1) { // expand
                    const a = randInt(1, 5);
                    const b = randInt(1, 5);
                    text = `(x + ${a})(x + ${b}) を展開しなさい。`;
                    const ans = `x² + ${a + b}x + ${a * b}`;
                    const w1 = `x² + ${a * b}x + ${a + b}`;
                    const w2 = `x² + ${a + b}x + ${a + b}`;
                    const w3 = `x² + ${a - b}x + ${a * b}`;
                    let c = shuffle([ans, w1, w2, w3]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `(x+a)(x+b) = x²+(a+b)x+ab より。`;
                } else if (type === 2) { // factor
                    const a = randInt(2, 9);
                    const ans = `(x + ${a})(x - ${a})`;
                    text = `x² - ${a * a} を因数分解しなさい。`;
                    const w1 = `(x - ${a})²`;
                    const w2 = `(x + ${a})²`;
                    const w3 = `x(x - ${a * a})`;
                    let c = shuffle([ans, w1, w2, w3]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `x² - a² = (x+a)(x-a) の公式を使います。`;
                } else { // root
                    const a = randInt(2, 10);
                    text = `√${a * a} を簡単にしなさい。`;
                    const ans = a.toString();
                    const w1 = (a * a).toString();
                    const w2 = Math.floor(Math.sqrt(a)).toString();
                    const w3 = (a + 1).toString();
                    let wrongs = [w1, w2, w3].filter((x, i, a) => a.indexOf(x) === i && x !== ans);
                    while (wrongs.length < 3) {
                        let w = randInt(1, 20).toString();
                        if (w !== ans && !wrongs.includes(w)) wrongs.push(w);
                    }
                    let c = shuffle([ans, ...wrongs.slice(0, 3)]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `√a² = a (a>0) なので ${a} になります。`;
                }
            }
            addQuestion('math', g.grade, term, text, choices, correctIndex, explanation);
            count++;
        }
    });
}

// ---------------------------------------------------------
// ENGLISH
// ---------------------------------------------------------
function generateEnglish() {
    const grades = [
        { grade: 'chu1', terms: ['first', 'second'], count: 67 },
        { grade: 'chu2', terms: ['first', 'second'], count: 67 },
        { grade: 'chu3', terms: ['first', 'second'], count: 66 }
    ];

    const chu1Words = ["apple", "dog", "student", "teacher", "book", "pen", "desk", "car", "cat", "bird"];
    const chu1Verbs = ["play", "like", "have", "want", "use", "eat", "make", "know"];

    grades.forEach(g => {
        let count = 0;
        while (count < g.count) {
            const term = randChoice(g.terms);
            let text, choices, correctIndex, explanation;

            if (g.grade === 'chu1') {
                const subT = randInt(1, 3);
                const w = randChoice(chu1Words);
                const v = randChoice(chu1Verbs);
                if (subT === 1) {
                    text = `「私は${w}を持っています。」の空欄に当てはまる語は？\nI (      ) a ${w}.`;
                    const ans = "have";
                    const c = shuffle([ans, "am", "has", "do"]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `I を主語にして「持っている」を表す一般動詞は have です。`;
                } else if (subT === 2) {
                    text = `「彼は${w}が好きです。」の空欄に当てはまる語は？\nHe (      ) ${w}s.`;
                    const ans = "likes";
                    const c = shuffle([ans, "like", "is like", "liking"]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `主語が三人称単数（He）なので s が付きます。`;
                } else {
                    text = `「あなたは${w}が好きですか？」の空欄は？\n(      ) you like ${w}s?`;
                    const ans = "Do";
                    const c = shuffle([ans, "Are", "Does", "Is"]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `一般動詞の疑問文で、主語が you のときは Do で始めます。`;
                }
            } else if (g.grade === 'chu2') {
                const subT = randInt(1, 3);
                if (subT === 1) {
                    text = `「私は昨日彼を見ました。」\nI (      ) him yesterday.`;
                    const ans = "saw";
                    const c = shuffle([ans, "see", "seen", "seeing"]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `yesterday（昨日）があるため過去形を使います。see の過去形は saw。`;
                } else if (subT === 2) {
                    text = `「彼女は私より背が高い。」\nShe is (      ) than me.`;
                    const ans = "taller";
                    const c = shuffle([ans, "tall", "tallest", "more tall"]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `than の前は比較級になります。tall の比較級は taller。`;
                } else {
                    text = `「英語はたくさんの人に話されています。」\nEnglish is (      ) by many people.`;
                    const ans = "spoken";
                    const c = shuffle([ans, "speak", "spoke", "speaks"]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `受動態は be動詞 + 過去分詞。speak の過去分詞は spoken です。`;
                }
            } else { // chu3
                const subT = randInt(1, 3);
                if (subT === 1) {
                    text = `「私は京都に行ったことがあります。」\nI have (      ) to Kyoto.`;
                    const ans = "been";
                    const c = shuffle([ans, "gone", "went", "go"]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `「行ったことがある」という経験は have been to を使います。`;
                } else if (subT === 2) {
                    text = `「これは私が買った本です。」\nThis is the book (      ) I bought.`;
                    const ans = "which";
                    const c = shuffle([ans, "who", "whose", "where"]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `先行詞が the book（物）なので関係代名詞は which（または that）です。`;
                } else {
                    text = `「もし私が鳥なら、あなたのもとへ飛んでいくのに。」\nIf I (      ) a bird, I would fly to you.`;
                    const ans = "were";
                    const c = shuffle([ans, "am", "was", "will be"]);
                    choices = c;
                    correctIndex = c.indexOf(ans);
                    explanation = `現在の事実に反する仮定（仮定法過去）では、be動詞は were を使うのが原則です。`;
                }
            }
            addQuestion('english', g.grade, term, text, choices, correctIndex, explanation);
            count++;
        }
    });
}

// ---------------------------------------------------------
// SCIENCE
// ---------------------------------------------------------
function generateScience() {
    const grades = [
        { grade: 'chu1', terms: ['first', 'second'], count: 67 },
        { grade: 'chu2', terms: ['first', 'second'], count: 67 },
        { grade: 'chu3', terms: ['first', 'second'], count: 66 }
    ];

    const chu1Tmpl = [
        { t: "光が異なる物質の境界に進むとき、折れ曲がる現象を何というか。", a: "屈折", w: ["反射", "全反射", "散乱"], e: "光が異なる媒質の境界を斜めに通る時、進行方向が変わる現象を光の屈折という。" },
        { t: "植物の細胞にあり、光合成を行う緑色の粒を何というか。", a: "葉緑体", w: ["ミトコンドリア", "液胞", "細胞壁"], e: "葉緑体は植物の細胞にある、光合成を行う小器官です。" },
        { t: "水にとけて水溶液になったとき、電流が流れる物質を何というか。", a: "電解質", w: ["非電解質", "絶縁体", "半導体"], e: "水に溶けてイオンに分かれ、電気を通す物質を電解質といいます。" },
        { t: "マグマが冷え固まってできた岩石を何というか。", a: "火成岩", w: ["堆積岩", "変成岩", "化石"], e: "マグマが冷えて固まってできる岩石全般を火成岩と呼びます。" }
    ];

    const chu2Tmpl = [
        { t: "電流を通しにくい物質を何というか。", a: "不導体（絶縁体）", w: ["導体", "半導体", "超伝導体"], e: "電気を通しにくい物質を不導体または絶縁体と呼びます。" },
        { t: "物質が酸素と結びつく化学変化を何というか。", a: "酸化", w: ["還元", "分解", "化合"], e: "酸素と結びつく反応を酸化と呼びます。" },
        { t: "だ液に含まれ、デンプンを分解する消化酵素は何か。", a: "アミラーゼ", w: ["ペプシン", "リパーゼ", "トリプシン"], e: "だ液にはアミラーゼという酵素が含まれ、デンプンを麦芽糖などに分解します。" },
        { t: "低気圧の中心付近では、どのような気流が生じているか。", a: "上昇気流", w: ["下降気流", "水平気流", "無風"], e: "低気圧では空気が集まり、上昇気流が発生して雲ができやすくなります。" }
    ];

    const chu3Tmpl = [
        { t: "物体の速さが変化しないとき、移動距離と時間の関係はどうなるか。", a: "比例する", w: ["反比例する", "二次関数になる", "一定になる"], e: "等速直線運動では、距離は時間に比例して長くなります。" },
        { t: "水溶液中で水素イオン(H+)を出す物質を何というか。", a: "酸", w: ["アルカリ", "塩", "中性"], e: "酸性の物質は水に溶けて水素イオンを生じます。" },
        { t: "親の形質が子に伝わることを何というか。", a: "遺伝", w: ["進化", "発生", "生殖"], e: "親の特徴（形質）が遺伝子によって子に伝わることを遺伝といいます。" },
        { t: "太陽系で、最も大きい惑星はどれか。", a: "木星", w: ["土星", "地球", "火星"], e: "木星は太陽系の惑星の中でサイズ・質量ともに最大です。" }
    ];

    grades.forEach(g => {
        let count = 0;
        let tmpl = g.grade === 'chu1' ? chu1Tmpl : g.grade === 'chu2' ? chu2Tmpl : chu3Tmpl;

        while (count < g.count) {
            const term = randChoice(g.terms);
            let item = randChoice(tmpl);

            // To make unique variations
            let text = count % 2 === 0 ? item.t : `【確認問題】${item.t}`;
            text += `  (${count})`;
            let c = shuffle([item.a, ...item.w]);
            addQuestion('science', g.grade, term, text, c, c.indexOf(item.a), item.e);
            count++;
        }
    });
}

// ---------------------------------------------------------
// SOCIAL
// ---------------------------------------------------------
function generateSocial() {
    const grades = [
        { grade: 'chu1', terms: ['first', 'second'], count: 67 },
        { grade: 'chu2', terms: ['first', 'second'], count: 67 },
        { grade: 'chu3', terms: ['first', 'second'], count: 66 }
    ];

    const chu1Tmpl = [
        { t: "世界で最も面積が広い国はどこか。", a: "ロシア", w: ["カナダ", "アメリカ", "中国"], e: "ロシア連邦は世界一の面積を持ちます。" },
        { t: "聖徳太子が定めた、役人の心構えを示したものを何というか。", a: "十七条の憲法", w: ["冠位十二階", "大宝律令", "御成敗式目"], e: "聖徳太子は十七条の憲法を定め、和を重んじることなどを役人に説きました。" }
    ];
    const chu2Tmpl = [
        { t: "1192年に源頼朝が開いた幕府は何か。", a: "鎌倉幕府", w: ["室町幕府", "江戸幕府", "平安京"], e: "源頼朝は鎌倉に幕府を開き、武家政権を確立しました。" },
        { t: "日本の都道府県で最も北にあるのはどれか。", a: "北海道", w: ["青森県", "秋田県", "岩手県"], e: "北海道は日本の最北に位置する広大な自治体です。" }
    ];
    const chu3Tmpl = [
        { t: "日本国憲法の三大原則は「国民主権」「基本的人権の尊重」ともう一つは何か。", a: "平和主義", w: ["三権分立", "地方自治", "法の下の平等"], e: "三大原則は、国民主権、基本的人権の尊重、平和主義です。" },
        { t: "1868年から始まった、近代的な国づくりのための改革を何というか。", a: "明治維新", w: ["大化の改新", "建武の新政", "享保の改革"], e: "江戸幕府が倒れ、明治政府による近代化改革が進められました。" }
    ];

    grades.forEach(g => {
        let count = 0;
        let tmpl = g.grade === 'chu1' ? chu1Tmpl : g.grade === 'chu2' ? chu2Tmpl : chu3Tmpl;
        while (count < g.count) {
            const term = randChoice(g.terms);
            let item = randChoice(tmpl);
            let text = count % 2 === 0 ? item.t : `【社会】${item.t}`;
            text += ` [${count}]`;
            let c = shuffle([item.a, ...item.w]);
            addQuestion('social', g.grade, term, text, c, c.indexOf(item.a), item.e);
            count++;
        }
    });
}

// ---------------------------------------------------------
// JAPANESE
// ---------------------------------------------------------
function generateJapanese() {
    const grades = [
        { grade: 'chu1', terms: ['first', 'second'], count: 67 },
        { grade: 'chu2', terms: ['first', 'second'], count: 67 },
        { grade: 'chu3', terms: ['first', 'second'], count: 66 }
    ];

    const kanjiList = [
        { k: "挨拶", r: "あいさつ", w: ["あいさ", "あいざつ", "あいさち"] },
        { k: "矛盾", r: "むじゅん", w: ["むしゅん", "むどん", "ほこたて"] },
        { k: "完璧", r: "かんぺき", w: ["かんへき", "かんべき", "かんがべ"] },
        { k: "妥協", r: "だきょう", w: ["だごう", "たきょう", "だきょ"] },
        { k: "雰囲気", r: "ふんいき", w: ["ふいんき", "ふんき", "ふおんき"] }
    ];

    const grammarList = [
        { t: "「走る」の品詞はどれか。", a: "動詞", w: ["名詞", "形容詞", "副詞"] },
        { t: "「美しい」の品詞はどれか。", a: "形容詞", w: ["動詞", "形容動詞", "名詞"] },
        { t: "「静かだ」の品詞はどれか。", a: "形容動詞", w: ["形容詞", "動詞", "副詞"] }
    ];

    grades.forEach(g => {
        let count = 0;
        while (count < g.count) {
            const term = randChoice(g.terms);
            const type = randInt(1, 2);
            let text, ans, w, c, correctIndex, explanation;

            if (type === 1) {
                let item = randChoice(kanjiList);
                text = `次の漢字の読みとして正しいものはどれか。「${item.k}」 (問題番号: ${count})`;
                ans = item.r;
                w = item.w;
                c = shuffle([ans, ...w.slice(0, 3)]);
                correctIndex = c.indexOf(ans);
                explanation = `「${item.k}」は「${ans}」と読みます。`;
            } else {
                let item = randChoice(grammarList);
                text = item.t + ` (Q${count})`;
                ans = item.a;
                w = item.w;
                c = shuffle([ans, ...w.slice(0, 3)]);
                correctIndex = c.indexOf(ans);
                explanation = `品詞の分類問題です。正解は「${ans}」です。`;
            }

            addQuestion('japanese', g.grade, term, text, c, correctIndex, explanation);
            count++;
        }
    });
}

// ---------------------------------------------------------
// EXECUTION
// ---------------------------------------------------------
function main() {
    generateMath();
    generateEnglish();
    generateScience();
    generateSocial();
    generateJapanese();

    const outputLines = [
        "export const allQuestions = ["
    ];

    questions.forEach(q => {
        outputLines.push(`  { id: '${q.id}', subject: '${q.subject}', grade: '${q.grade}', term: '${q.term}', text: \`${q.text}\`, choices: ${JSON.stringify(q.choices)}, correctIndex: ${q.correctIndex}, explanation: \`${q.explanation}\` },`);
    });

    outputLines.push("];\n");

    const outputPath = path.join(__dirname, 'questions-data.ts');
    fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf8');
    console.log(`Successfully generated ${questions.length} questions to ${outputPath}!`);
}

main();
