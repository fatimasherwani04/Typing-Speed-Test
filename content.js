// ============================================================
//  CODETYPE — content.js
// ============================================================

const CONTENT = {
  code: {
    label: "Code", icon: "⌨",
    languages: {
      javascript: {
        label: "JavaScript", color: "#F7DF1E",
        snippets: [
          `const fibonacci = (n) => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);`,
          `const debounce = (fn, delay) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; };`,
          `const memoize = (fn) => { const cache = new Map(); return (...args) => { const key = JSON.stringify(args); return cache.has(key) ? cache.get(key) : cache.set(key, fn(...args)).get(key); }; };`,
          `fetch('https://api.example.com/data').then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err));`,
          `class EventEmitter { constructor() { this.events = {}; } on(event, cb) { (this.events[event] = this.events[event] || []).push(cb); } emit(event, data) { (this.events[event] || []).forEach(cb => cb(data)); } }`,
          `const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);`,
          `const groupBy = (arr, key) => arr.reduce((acc, item) => ({ ...acc, [item[key]]: [...(acc[item[key]] || []), item] }), {});`,
          `async function retry(fn, retries = 3) { try { return await fn(); } catch (e) { if (retries <= 0) throw e; return retry(fn, retries - 1); } }`,
          `const curry = fn => (...args) => args.length >= fn.length ? fn(...args) : curry(fn.bind(null, ...args));`,
          `const flatDeep = arr => arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatDeep(val)) : acc.concat(val), []);`,
        ]
      },
      python: {
        label: "Python", color: "#3572A5",
        snippets: [
          `def binary_search(arr, target): left, right = 0, len(arr) - 1`,
          `decorator = lambda fn: lambda *args, **kwargs: fn(*args, **kwargs)`,
          `flatten = lambda lst: [x for sublist in lst for x in sublist]`,
          `from functools import reduce`,
          `def memoize(fn): cache = {}; return lambda *args: cache.setdefault(args, fn(*args))`,
          `class Singleton: _instance = None`,
          `gen = (x ** 2 for x in range(100) if x % 2 == 0)`,
          `sorted_dict = dict(sorted(my_dict.items(), key=lambda item: item[1], reverse=True))`,
          `result = list(map(lambda x: x * 2, filter(lambda x: x % 2 == 0, range(20))))`,
          `with open('file.txt', 'r') as f: lines = [line.strip() for line in f if line.strip()]`,
        ]
      },
      cpp: {
        label: "C++", color: "#00599C",
        snippets: [
          `template<typename T> T binarySearch(vector<T>& arr, T target) { int l = 0, r = arr.size() - 1; }`,
          `auto lambda = [](int x, int y) -> int { return x > y ? x : y; };`,
          `std::sort(vec.begin(), vec.end(), [](const auto& a, const auto& b) { return a.second > b.second; });`,
          `unique_ptr<int> ptr = make_unique<int>(42);`,
          `std::map<string, int> freq; for (const auto& word : words) freq[word]++;`,
          `vector<int> result; std::transform(v.begin(), v.end(), back_inserter(result), [](int x) { return x * x; });`,
          `auto [min_it, max_it] = std::minmax_element(vec.begin(), vec.end());`,
          `template<typename T> class Stack { private: std::vector<T> data; public: void push(T val) { data.push_back(val); } };`,
        ]
      },
      sql: {
        label: "SQL", color: "#e38c00",
        snippets: [
          `SELECT name, COUNT(id) AS total FROM users GROUP BY name HAVING total > 10 ORDER BY total DESC;`,
          `WITH ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn FROM employees) SELECT * FROM ranked WHERE rn = 1;`,
          `UPDATE products SET price = price * 0.9 WHERE category = 'electronics' AND stock > 100;`,
          `SELECT name, salary, AVG(salary) OVER (PARTITION BY department) AS dept_avg FROM employees;`,
          `INSERT INTO logs (user_id, action, created_at) VALUES (42, 'login', NOW());`,
        ]
      },
      css: {
        label: "CSS", color: "#563d7c",
        snippets: [
          `.card { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }`,
          `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`,
          `button:hover { background: linear-gradient(135deg, #00f5ff, #ff2d9b); transform: translateY(-2px); }`,
          `.container { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; }`,
          `@media (max-width: 768px) { .grid { grid-template-columns: 1fr; padding: 1rem; } }`,
        ]
      }
    }
  },

  words: {
    label: "Words", icon: "📝",
    sets: {
      common: {
        label: "Common",
        words: ["the","be","to","of","and","a","in","that","have","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know","take","people","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","us"]
      },
      programming: {
        label: "Programming",
        words: ["function","variable","return","const","let","class","extends","import","export","async","await","promise","callback","closure","prototype","module","interface","abstract","boolean","integer","string","array","object","method","property","constructor","inheritance","polymorphism","encapsulation","recursion","algorithm","iteration","condition","exception","parameter","argument","declaration","expression","statement","operator","compiler","interpreter","runtime","framework","library","package","dependency","debug","deploy","repository","branch","commit","merge","request","response","endpoint","middleware","database","query","schema","migration","refactor","optimize","benchmark","testing","coverage","authentication","authorization","encryption","serialization","parsing","rendering","component","state","props","lifecycle","hook","context","reducer","dispatch","mutation","observable","pipeline","stream","buffer","cache","memory","pointer","reference","scope","namespace","generic","template","overload","override"]
      }
    }
  },

  quotes: {
    label: "Quotes", icon: "💬",
    items: [
      { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
      { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
      { text: "Java is to JavaScript what car is to carpet.", author: "Chris Heilmann" },
      { text: "Sometimes it pays to stay in bed on Monday rather than spending the rest of the week debugging Monday's code.", author: "Dan Salomon" },
      { text: "Perfection is achieved not when there is nothing more to add but rather when there is nothing more to take away.", author: "Antoine de Saint-Exupery" },
      { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
      { text: "One of the best programming skills you can have is knowing when to walk away for a while.", author: "Oscar Godson" },
      { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
      { text: "Code is like humor. When you have to explain it, it is bad.", author: "Cory House" },
      { text: "Fix the cause, not the symptom.", author: "Steve Maguire" },
      { text: "Optimism is an occupational hazard of programming. Feedback is the treatment.", author: "Kent Beck" },
      { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
      { text: "Programming is not about typing, it is about thinking.", author: "Rich Hickey" },
      { text: "The most dangerous phrase in the language is we have always done it this way.", author: "Grace Hopper" },
      { text: "It is not enough for code to work.", author: "Robert C. Martin" },
    ]
  }
};

const TIPS = {
  speed: [
    { icon: "🎯", title: "Touch Type Properly", desc: "Keep all 10 fingers on the home row (ASDF JKL;). Never look at the keyboard. This alone can double your speed over time." },
    { icon: "🔁", title: "Practice Daily", desc: "Even 10 minutes a day beats 2 hours once a week. Muscle memory is built through consistent repetition, not marathon sessions." },
    { icon: "⚡", title: "Slow Down to Speed Up", desc: "Practice at 80% of your max speed with zero mistakes. Accuracy first — speed follows naturally. Rushing creates bad habits." },
    { icon: "🧠", title: "Learn Keyboard Shortcuts", desc: "Ctrl+C, Ctrl+V, Ctrl+Z, Alt+Tab — programmers who master shortcuts work 40% faster than those who rely on the mouse." },
    { icon: "📍", title: "Use All 10 Fingers", desc: "Most beginners use only 2-3 fingers. Training all 10 is uncomfortable at first but unlocks dramatically higher speeds." },
  ],
  coding: [
    { icon: "🔣", title: "Master Special Characters", desc: "As a coder, { } [ ] ( ) ; : => are your daily tools. Practice them until they are automatic — they are what slows coders down most." },
    { icon: "🖐", title: "Learn Bracket Patterns", desc: "Train your muscle memory for () => {}, function() {}, if () {} so you type them as single fluid units without thinking." },
    { icon: "🔤", title: "camelCase and snake_case", desc: "Practice switching between naming conventions smoothly. myVariableName and my_variable_name should feel equally natural." },
    { icon: "⌨️", title: "Use a Mechanical Keyboard", desc: "Programmers who switch to mechanical keyboards report 15-25% speed increases. The tactile feedback improves accuracy." },
    { icon: "📐", title: "Consistent Indentation", desc: "Proper indentation while typing shows clean coding habits. Train with real code snippets to build this into muscle memory." },
  ],
  levels: {
    beginner:     { min: 0,   max: 30,  label: "Beginner",     color: "#888",    emoji: "🐢", msg: "You are just starting out. Focus on accuracy over speed. Practice the home row keys every day." },
    intermediate: { min: 30,  max: 50,  label: "Intermediate", color: "#00f5ff", emoji: "🚶", msg: "Good progress! You are above average. Focus on eliminating hesitation on special characters." },
    advanced:     { min: 50,  max: 70,  label: "Advanced",     color: "#a78bfa", emoji: "🏃", msg: "Impressive! You are faster than 70% of people. Work on maintaining accuracy at higher speeds." },
    fast:         { min: 70,  max: 100, label: "Fast Typist",  color: "#ff2d9b", emoji: "⚡", msg: "You are seriously fast! Focus on code-specific patterns and special characters to go even higher." },
    codemaster:   { min: 100, max: 999, label: "Code Master",  color: "#FFD700", emoji: "🚀", msg: "Legendary speed! You are in the top 1% of typists. Share your score — people need to see this!" },
  }
};

function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem("ct_leaderboard") || "[]"); }
  catch { return []; }
}
function saveToLeaderboard(name, wpm, accuracy, mode) {
  const board = getLeaderboard();
  board.push({ name, wpm, accuracy, mode, date: new Date().toLocaleDateString() });
  board.sort((a, b) => b.wpm - a.wpm);
  const top = board.slice(0, 10);
  localStorage.setItem("ct_leaderboard", JSON.stringify(top));
  return top;
}
function getLevel(wpm) {
  const levels = TIPS.levels;
  for (const key of Object.keys(levels)) {
    if (wpm >= levels[key].min && wpm < levels[key].max) return { key, ...levels[key] };
  }
  return { key: "codemaster", ...levels.codemaster };
}