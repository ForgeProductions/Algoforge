import { PrismaClient, TrackType, Difficulty, PlatformSource } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Problem interface ──────────────────────────────────────────────────────
interface CPProblem {
    title: string;
    slug: string;
    cfContest: number;
    cfIndex: string;
    rating: number;
    tags: string[];
}

interface RatingTier {
    name: string;
    slug: string;
    order: number;
    difficulty: Difficulty;
    problems: CPProblem[];
}

function cfUrl(contest: number, index: string): string {
    return `https://codeforces.com/problemset/problem/${contest}/${index}`;
}

function cfSlug(contest: number, index: string, title: string): string {
    return `cf-${contest}${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`;
}

// ─── RATING TIERS & PROBLEMS (250+) ────────────────────────────────────────

const TIERS: RatingTier[] = [
    // ═══════════════════════════════════════════════════════════════════════
    // RATING 800
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 800 — Newbie", slug: "rating-800", order: 1, difficulty: "EASY",
        problems: [
            { title: "Watermelon", slug: "watermelon", cfContest: 4, cfIndex: "A", rating: 800, tags: ["Math", "Brute Force"] },
            { title: "Way Too Long Words", slug: "way-too-long-words", cfContest: 71, cfIndex: "A", rating: 800, tags: ["Strings", "Implementation"] },
            { title: "Team", slug: "team", cfContest: 231, cfIndex: "A", rating: 800, tags: ["Brute Force", "Greedy"] },
            { title: "Elephant", slug: "elephant", cfContest: 617, cfIndex: "A", rating: 800, tags: ["Math", "Greedy"] },
            { title: "Bear and Big Brother", slug: "bear-and-big-brother", cfContest: 791, cfIndex: "A", rating: 800, tags: ["Implementation"] },
            { title: "Stones on the Table", slug: "stones-on-the-table", cfContest: 266, cfIndex: "A", rating: 800, tags: ["Implementation"] },
            { title: "Boy or Girl", slug: "boy-or-girl", cfContest: 236, cfIndex: "A", rating: 800, tags: ["Strings", "Implementation"] },
            { title: "Wrong Subtraction", slug: "wrong-subtraction", cfContest: 977, cfIndex: "A", rating: 800, tags: ["Implementation"] },
            { title: "Next Round", slug: "next-round", cfContest: 158, cfIndex: "A", rating: 800, tags: ["Implementation"] },
            { title: "Beautiful Matrix", slug: "beautiful-matrix", cfContest: 263, cfIndex: "A", rating: 800, tags: ["Implementation"] },
            { title: "Helpful Maths", slug: "helpful-maths", cfContest: 339, cfIndex: "A", rating: 800, tags: ["Greedy", "Implementation", "Sorting", "Strings"] },
            { title: "Petersen's Game", slug: "petersens-game", cfContest: 110, cfIndex: "A", rating: 800, tags: ["Implementation"] },
            { title: "Bit++", slug: "bit-plus-plus", cfContest: 282, cfIndex: "A", rating: 800, tags: ["Implementation"] },
            { title: "In Search of an Easy Problem", slug: "in-search-easy-problem", cfContest: 1030, cfIndex: "A", rating: 800, tags: ["Implementation"] },
            { title: "Domino Piling", slug: "domino-piling", cfContest: 50, cfIndex: "A", rating: 800, tags: ["Math", "Greedy"] },
            { title: "Nearly Lucky Number", slug: "nearly-lucky-number", cfContest: 110, cfIndex: "A", rating: 800, tags: ["Implementation"] },
            { title: "Word", slug: "word", cfContest: 59, cfIndex: "A", rating: 800, tags: ["Strings", "Implementation"] },
            { title: "String Task", slug: "string-task", cfContest: 118, cfIndex: "A", rating: 800, tags: ["Strings", "Implementation"] },
            { title: "Even Odds", slug: "even-odds", cfContest: 318, cfIndex: "A", rating: 800, tags: ["Math"] },
            { title: "Divisibility Problem", slug: "divisibility-problem", cfContest: 1328, cfIndex: "A", rating: 800, tags: ["Math", "Greedy"] },
            { title: "Candies", slug: "candies-800", cfContest: 1343, cfIndex: "A", rating: 800, tags: ["Math", "Brute Force"] },
            { title: "Odd Divisor", slug: "odd-divisor-800", cfContest: 1475, cfIndex: "A", rating: 800, tags: ["Math", "Number Theory"] },
            { title: "Vanya and Fence", slug: "vanya-and-fence", cfContest: 677, cfIndex: "A", rating: 800, tags: ["Implementation"] },
            { title: "Anton and Danik", slug: "anton-and-danik", cfContest: 734, cfIndex: "A", rating: 800, tags: ["Strings", "Implementation"] },
            { title: "IQ Test", slug: "iq-test", cfContest: 25, cfIndex: "A", rating: 800, tags: ["Brute Force"] },
            { title: "Target Practice", slug: "target-practice", cfContest: 1873, cfIndex: "A", rating: 800, tags: ["Implementation"] },
            { title: "Buttons", slug: "buttons-800", cfContest: 1858, cfIndex: "A", rating: 800, tags: ["Math", "Greedy"] },
            { title: "Don't Try to Count", slug: "dont-try-to-count", cfContest: 1881, cfIndex: "A", rating: 800, tags: ["Brute Force", "Strings"] },
            { title: "Tricky Sum", slug: "tricky-sum", cfContest: 1985, cfIndex: "A", rating: 800, tags: ["Math"] },
            { title: "Setting Up Camp", slug: "setting-up-camp", cfContest: 1945, cfIndex: "A", rating: 800, tags: ["Math", "Greedy"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // RATING 900
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 900 — Newbie+", slug: "rating-900", order: 2, difficulty: "EASY",
        problems: [
            { title: "Theatre Square", slug: "theatre-square", cfContest: 1, cfIndex: "A", rating: 900, tags: ["Math"] },
            { title: "Football", slug: "football", cfContest: 43, cfIndex: "A", rating: 900, tags: ["Strings", "Implementation"] },
            { title: "Shortest Distance", slug: "shortest-distance", cfContest: 1029, cfIndex: "A", rating: 900, tags: ["Implementation", "Geometry"] },
            { title: "Insomnia cure", slug: "insomnia-cure", cfContest: 148, cfIndex: "A", rating: 900, tags: ["Implementation", "Constructive"] },
            { title: "Pangram", slug: "pangram", cfContest: 520, cfIndex: "A", rating: 900, tags: ["Strings", "Implementation"] },
            { title: "Soldier and Bananas", slug: "soldier-and-bananas", cfContest: 546, cfIndex: "A", rating: 900, tags: ["Math", "Brute Force"] },
            { title: "Translation", slug: "translation", cfContest: 41, cfIndex: "A", rating: 900, tags: ["Strings", "Implementation"] },
            { title: "Again Twenty Five", slug: "again-twenty-five", cfContest: 630, cfIndex: "A", rating: 900, tags: ["Math", "Number Theory"] },
            { title: "Games", slug: "games-900", cfContest: 268, cfIndex: "A", rating: 900, tags: ["Brute Force"] },
            { title: "Without Zero", slug: "without-zero", cfContest: 1981, cfIndex: "A", rating: 900, tags: ["Implementation", "Math"] },
            { title: "01 Game", slug: "01-game", cfContest: 1899, cfIndex: "A", rating: 900, tags: ["Strings", "Greedy"] },
            { title: "Forked!", slug: "forked", cfContest: 1904, cfIndex: "A", rating: 900, tags: ["Brute Force", "Implementation"] },
            { title: "Array Coloring", slug: "array-coloring", cfContest: 1857, cfIndex: "A", rating: 900, tags: ["Greedy", "Math"] },
            { title: "Balanced Substring", slug: "balanced-substring-900", cfContest: 1837, cfIndex: "A", rating: 900, tags: ["Implementation", "Strings"] },
            { title: "Young Physicist", slug: "young-physicist", cfContest: 69, cfIndex: "A", rating: 900, tags: ["Implementation", "Math"] },
            { title: "Chat Room", slug: "chat-room", cfContest: 58, cfIndex: "A", rating: 900, tags: ["Greedy", "Strings"] },
            { title: "Presents", slug: "presents", cfContest: 136, cfIndex: "A", rating: 900, tags: ["Implementation"] },
            { title: "Is it a Cat?", slug: "is-it-a-cat", cfContest: 1800, cfIndex: "A", rating: 900, tags: ["Implementation", "Strings"] },
            { title: "Forbidden Integer", slug: "forbidden-integer", cfContest: 1845, cfIndex: "A", rating: 900, tags: ["Constructive", "Math"] },
            { title: "Distracted Scientist", slug: "distracted-scientist-900", cfContest: 1935, cfIndex: "A", rating: 900, tags: ["Implementation", "Greedy"] },
            { title: "Twins", slug: "twins-900", cfContest: 160, cfIndex: "A", rating: 900, tags: ["Greedy", "Sorting"] },
            { title: "Petya and Strings", slug: "petya-and-strings", cfContest: 112, cfIndex: "A", rating: 900, tags: ["Strings", "Implementation"] },
            { title: "George and Accommodation", slug: "george-accommodation", cfContest: 467, cfIndex: "A", rating: 900, tags: ["Implementation"] },
            { title: "Night at the Museum", slug: "night-at-museum", cfContest: 731, cfIndex: "A", rating: 900, tags: ["Strings", "Implementation"] },
            { title: "Sereja and Dima", slug: "sereja-and-dima", cfContest: 381, cfIndex: "A", rating: 900, tags: ["Greedy", "Two Pointers"] },
            { title: "Queue at the School", slug: "queue-at-school", cfContest: 266, cfIndex: "B", rating: 900, tags: ["Implementation", "Simulation"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // RATING 1000
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 1000 — Pupil Start", slug: "rating-1000", order: 3, difficulty: "EASY",
        problems: [
            { title: "Hit the Lottery", slug: "hit-the-lottery", cfContest: 996, cfIndex: "A", rating: 1000, tags: ["Greedy", "Math"] },
            { title: "Colorful Stones", slug: "colorful-stones", cfContest: 1551, cfIndex: "A", rating: 1000, tags: ["Implementation"] },
            { title: "Fair Division", slug: "fair-division", cfContest: 1472, cfIndex: "B", rating: 1000, tags: ["Greedy", "Math", "DP"] },
            { title: "Balanced Rating Changes", slug: "balanced-rating-changes", cfContest: 1237, cfIndex: "A", rating: 1000, tags: ["Implementation", "Math"] },
            { title: "Remove Smallest", slug: "remove-smallest", cfContest: 1399, cfIndex: "A", rating: 1000, tags: ["Greedy", "Sorting"] },
            { title: "Polycarp and Coins", slug: "polycarp-and-coins", cfContest: 1551, cfIndex: "B1", rating: 1000, tags: ["Greedy", "Math"] },
            { title: "K-divisible Sum", slug: "k-divisible-sum", cfContest: 1541, cfIndex: "A", rating: 1000, tags: ["Math", "Greedy"] },
            { title: "Monsters", slug: "monsters-1000", cfContest: 1872, cfIndex: "B", rating: 1000, tags: ["Greedy", "Sorting", "Implementation"] },
            { title: "Halloumi Boxes", slug: "halloumi-boxes", cfContest: 1903, cfIndex: "A", rating: 1000, tags: ["Brute Force", "Sorting"] },
            { title: "Make It White", slug: "make-it-white", cfContest: 1927, cfIndex: "A", rating: 1000, tags: ["Implementation", "Strings"] },
            { title: "Sakurako's Exam", slug: "sakurakos-exam", cfContest: 2008, cfIndex: "A", rating: 1000, tags: ["Math", "Constructive"] },
            { title: "Maximum Value", slug: "maximum-value-1000", cfContest: 1985, cfIndex: "B", rating: 1000, tags: ["Greedy", "Math", "Sorting"] },
            { title: "Yogurt Sale", slug: "yogurt-sale", cfContest: 1955, cfIndex: "A", rating: 1000, tags: ["Greedy", "Math"] },
            { title: "Lucky?", slug: "lucky-1000", cfContest: 1676, cfIndex: "A", rating: 1000, tags: ["Implementation"] },
            { title: "Taxi", slug: "taxi-1000", cfContest: 158, cfIndex: "B", rating: 1000, tags: ["Greedy", "Implementation"] },
            { title: "Filling Shapes", slug: "filling-shapes", cfContest: 1182, cfIndex: "A", rating: 1000, tags: ["DP", "Math"] },
            { title: "Raising Bacteria", slug: "raising-bacteria", cfContest: 579, cfIndex: "A", rating: 1000, tags: ["Bit Manipulation"] },
            { title: "Flipping Game", slug: "flipping-game", cfContest: 327, cfIndex: "A", rating: 1000, tags: ["Brute Force", "DP", "Greedy"] },
            { title: "Sum of Round Numbers", slug: "sum-of-round-numbers", cfContest: 1352, cfIndex: "A", rating: 1000, tags: ["Implementation", "Math"] },
            { title: "Candies and Two Sisters", slug: "candies-two-sisters", cfContest: 1335, cfIndex: "A", rating: 1000, tags: ["Math"] },
            { title: "Minimize!", slug: "minimize", cfContest: 1183, cfIndex: "A", rating: 1000, tags: ["Math", "Greedy"] },
            { title: "Accumulation of Dominoes", slug: "accumulation-dominoes", cfContest: 1725, cfIndex: "A", rating: 1000, tags: ["Math"] },
            { title: "GCD vs LCM", slug: "gcd-vs-lcm", cfContest: 1766, cfIndex: "A", rating: 1000, tags: ["Constructive", "Math", "Number Theory"] },
            { title: "Wonderful Permutation", slug: "wonderful-permutation", cfContest: 1744, cfIndex: "A", rating: 1000, tags: ["Implementation", "Greedy"] },
            { title: "Mathematical Problem", slug: "mathematical-problem", cfContest: 1916, cfIndex: "A", rating: 1000, tags: ["Constructive", "Math"] },
            { title: "Cover in Water", slug: "cover-in-water-1000", cfContest: 1900, cfIndex: "A", rating: 1000, tags: ["Greedy", "Implementation"] },
            { title: "Matrix", slug: "matrix-1000", cfContest: 1783, cfIndex: "A", rating: 1000, tags: ["Math", "Constructive"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // RATING 1100
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 1100 — Pupil", slug: "rating-1100", order: 4, difficulty: "EASY",
        problems: [
            { title: "Card Constructions", slug: "card-constructions", cfContest: 1345, cfIndex: "A", rating: 1100, tags: ["Binary Search", "Brute Force", "DP", "Math"] },
            { title: "Sequence with Digits", slug: "sequence-with-digits", cfContest: 1355, cfIndex: "A", rating: 1100, tags: ["Brute Force", "Implementation"] },
            { title: "Minimal Cost", slug: "minimal-cost", cfContest: 1491, cfIndex: "B", rating: 1100, tags: ["Brute Force", "Math"] },
            { title: "Replacing Elements", slug: "replacing-elements", cfContest: 1473, cfIndex: "A", rating: 1100, tags: ["Greedy", "Implementation", "Sorting"] },
            { title: "Two-gram", slug: "two-gram", cfContest: 977, cfIndex: "B", rating: 1100, tags: ["Implementation", "Strings"] },
            { title: "Sum of Cubes", slug: "sum-of-cubes", cfContest: 1490, cfIndex: "B", rating: 1100, tags: ["Brute Force", "Math"] },
            { title: "Maximum Product", slug: "maximum-product-1100", cfContest: 1435, cfIndex: "A", rating: 1100, tags: ["Brute Force", "Greedy", "Implementation", "Sorting"] },
            { title: "Catch the Coin", slug: "catch-the-coin", cfContest: 1831, cfIndex: "A", rating: 1100, tags: ["Greedy", "Implementation"] },
            { title: "Everyone Loves Tres", slug: "everyone-loves-tres", cfContest: 1829, cfIndex: "A", rating: 1100, tags: ["Math", "Constructive"] },
            { title: "Coin Games", slug: "coin-games-1100", cfContest: 1904, cfIndex: "B", rating: 1100, tags: ["Game Theory", "Math"] },
            { title: "Rudolf And The Ticket", slug: "rudolf-and-ticket", cfContest: 1941, cfIndex: "A", rating: 1100, tags: ["Brute Force", "Sorting"] },
            { title: "Choosing Cubes", slug: "choosing-cubes", cfContest: 2020, cfIndex: "A", rating: 1100, tags: ["Sorting", "Implementation"] },
            { title: "AB Balance", slug: "ab-balance", cfContest: 1606, cfIndex: "A", rating: 1100, tags: ["Strings", "Constructive"] },
            { title: "Constructive Problems", slug: "constructive-problems-1100", cfContest: 1554, cfIndex: "A", rating: 1100, tags: ["Constructive", "Math"] },
            { title: "Max Plus Min", slug: "max-plus-min-1100", cfContest: 1591, cfIndex: "A", rating: 1100, tags: ["Greedy", "Implementation"] },
            { title: "Double Strings", slug: "double-strings", cfContest: 1950, cfIndex: "A", rating: 1100, tags: ["Brute Force", "Data Structures", "Strings"] },
            { title: "Vika and Her Friends", slug: "vika-and-friends", cfContest: 1848, cfIndex: "A", rating: 1100, tags: ["Math", "Constructive"] },
            { title: "Love Story", slug: "love-story", cfContest: 1829, cfIndex: "A", rating: 1100, tags: ["Strings", "Implementation"] },
            { title: "I Wanna Be the Guy", slug: "i-wanna-be-the-guy", cfContest: 469, cfIndex: "A", rating: 1100, tags: ["Greedy", "Implementation"] },
            { title: "Polycarp and Sums of Subsequences", slug: "polycarp-sums", cfContest: 1618, cfIndex: "A", rating: 1100, tags: ["Math", "Implementation"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // RATING 1200
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 1200 — Specialist Start", slug: "rating-1200", order: 5, difficulty: "MEDIUM",
        problems: [
            { title: "Same Differences", slug: "same-differences", cfContest: 1520, cfIndex: "D", rating: 1200, tags: ["Math", "Hash Table"] },
            { title: "Odd Queries", slug: "odd-queries", cfContest: 1807, cfIndex: "B", rating: 1200, tags: ["Prefix Sum", "Implementation"] },
            { title: "Binary String Sorting", slug: "binary-string-sorting", cfContest: 1809, cfIndex: "A", rating: 1200, tags: ["Greedy", "Strings"] },
            { title: "Almost Sorted", slug: "almost-sorted", cfContest: 1508, cfIndex: "A", rating: 1200, tags: ["Constructive", "Greedy"] },
            { title: "Anti-Fibonacci Permutation", slug: "anti-fibo-perm", cfContest: 1644, cfIndex: "B", rating: 1200, tags: ["Constructive", "Implementation"] },
            { title: "Differential Sorting", slug: "differential-sorting", cfContest: 1635, cfIndex: "B", rating: 1200, tags: ["Constructive", "Math"] },
            { title: "Kill Demodogs", slug: "kill-demodogs", cfContest: 1677, cfIndex: "A", rating: 1200, tags: ["Math"] },
            { title: "Sakurako and Kosuke", slug: "sakurako-kosuke", cfContest: 2008, cfIndex: "B", rating: 1200, tags: ["Math", "Implementation"] },
            { title: "Robin Hood and the Major Oak", slug: "robin-hood-oak", cfContest: 2002, cfIndex: "B", rating: 1200, tags: ["Math", "Number Theory"] },
            { title: "Matrix Stabilization", slug: "matrix-stabilization", cfContest: 1986, cfIndex: "B", rating: 1200, tags: ["Implementation", "Sorting"] },
            { title: "Rectangle Cutting", slug: "rectangle-cutting", cfContest: 1896, cfIndex: "A", rating: 1200, tags: ["Geometry", "Math"] },
            { title: "Make it Beautiful", slug: "make-it-beautiful-1200", cfContest: 1896, cfIndex: "B", rating: 1200, tags: ["Constructive", "Sorting"] },
            { title: "Boring Apartments", slug: "boring-apartments", cfContest: 1433, cfIndex: "B", rating: 1200, tags: ["Math", "Implementation"] },
            { title: "Yet Another Coin Problem", slug: "yet-another-coin", cfContest: 1948, cfIndex: "A", rating: 1200, tags: ["Brute Force", "Greedy", "Math"] },
            { title: "Permutation Swap", slug: "permutation-swap", cfContest: 1828, cfIndex: "A", rating: 1200, tags: ["Math", "Number Theory"] },
            { title: "Long Comparison", slug: "long-comparison", cfContest: 1613, cfIndex: "A", rating: 1200, tags: ["Implementation", "Math"] },
            { title: "Increase Subarray Sums", slug: "increase-subarray-sums", cfContest: 1644, cfIndex: "A", rating: 1200, tags: ["Brute Force", "DP", "Greedy"] },
            { title: "Two Arrays And Swaps", slug: "two-arrays-swaps", cfContest: 1353, cfIndex: "B", rating: 1200, tags: ["Greedy", "Sorting"] },
            { title: "Suffix Three", slug: "suffix-three", cfContest: 1399, cfIndex: "A", rating: 1200, tags: ["Implementation"] },
            { title: "Restoring the Duration of Tasks", slug: "restoring-duration", cfContest: 1443, cfIndex: "A", rating: 1200, tags: ["Greedy", "Implementation"] },
            { title: "Minimize the Permutation", slug: "minimize-perm-1200", cfContest: 1790, cfIndex: "B", rating: 1200, tags: ["Greedy", "Sorting", "Constructive"] },
            { title: "Array Fix", slug: "array-fix-1200", cfContest: 1856, cfIndex: "A", rating: 1200, tags: ["Greedy", "Implementation", "Sorting"] },
            { title: "Alphabetical Strings", slug: "alphabetical-strings", cfContest: 1547, cfIndex: "A", rating: 1200, tags: ["Greedy", "Strings", "Implementation"] },
            { title: "Sorting with Twos", slug: "sorting-with-twos", cfContest: 1891, cfIndex: "A", rating: 1200, tags: ["Constructive", "Math", "Sorting"] },
            { title: "Digital Logarithm", slug: "digital-logarithm", cfContest: 1659, cfIndex: "A", rating: 1200, tags: ["Data Structures", "Greedy", "Sorting"] },
            { title: "Make it Increasing", slug: "make-it-increasing", cfContest: 1742, cfIndex: "A", rating: 1200, tags: ["Brute Force", "Greedy"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // RATING 1300
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 1300 — Specialist", slug: "rating-1300", order: 6, difficulty: "MEDIUM",
        problems: [
            { title: "Short Substrings", slug: "short-substrings", cfContest: 1238, cfIndex: "A", rating: 1300, tags: ["Strings", "Implementation"] },
            { title: "Kefa and First Steps", slug: "kefa-first-steps", cfContest: 580, cfIndex: "A", rating: 1300, tags: ["DP", "Implementation"] },
            { title: "Sum of Odd Subarrays", slug: "sum-odd-subarrays-1300", cfContest: 1509, cfIndex: "B", rating: 1300, tags: ["Greedy", "Math"] },
            { title: "Frog1", slug: "frog1-cf", cfContest: 1691, cfIndex: "B", rating: 1300, tags: ["DP"] },
            { title: "MEX and Array", slug: "mex-and-array", cfContest: 1744, cfIndex: "B", rating: 1300, tags: ["Greedy", "Math", "Sorting"] },
            { title: "Madoka and the First Session", slug: "madoka-first-session", cfContest: 1647, cfIndex: "B", rating: 1300, tags: ["Constructive", "Graph", "Greedy"] },
            { title: "Fedya and Array", slug: "fedya-and-array", cfContest: 1789, cfIndex: "B", rating: 1300, tags: ["Constructive", "Math"] },
            { title: "Lucky Numbers", slug: "lucky-numbers-1300", cfContest: 1808, cfIndex: "A", rating: 1300, tags: ["Greedy", "DP"] },
            { title: "Coloring Game", slug: "coloring-game", cfContest: 1796, cfIndex: "A", rating: 1300, tags: ["Game Theory"] },
            { title: "Sakurako's Task", slug: "sakurakos-task", cfContest: 2008, cfIndex: "C", rating: 1300, tags: ["Math", "Greedy", "Implementation"] },
            { title: "Equalize", slug: "equalize-1300", cfContest: 1928, cfIndex: "B", rating: 1300, tags: ["Binary Search", "Greedy", "Sorting"] },
            { title: "Turtle and an Infinite Sequence", slug: "turtle-infinite-seq", cfContest: 1981, cfIndex: "B", rating: 1300, tags: ["Bit Manipulation", "Math"] },
            { title: "Apple Tree", slug: "apple-tree-1300", cfContest: 1843, cfIndex: "C", rating: 1300, tags: ["DFS", "Trees", "Number Theory"] },
            { title: "Phoenix and Towers", slug: "phoenix-towers-1300", cfContest: 1515, cfIndex: "B", rating: 1300, tags: ["Greedy", "Data Structures"] },
            { title: "Two Buttons", slug: "two-buttons", cfContest: 520, cfIndex: "B", rating: 1300, tags: ["Greedy", "Math", "BFS"] },
            { title: "Balanced Round", slug: "balanced-round", cfContest: 1850, cfIndex: "B", rating: 1300, tags: ["Greedy", "Sorting"] },
            { title: "Chips on the Board", slug: "chips-on-board", cfContest: 1879, cfIndex: "B", rating: 1300, tags: ["Greedy"] },
            { title: "Good Pairs", slug: "good-pairs-1300", cfContest: 1762, cfIndex: "A", rating: 1300, tags: ["Math", "Sorting"] },
            { title: "AND or OR", slug: "and-or-or", cfContest: 1800, cfIndex: "B", rating: 1300, tags: ["Bit Manipulation", "Math"] },
            { title: "Basketball Together", slug: "basketball-together", cfContest: 1725, cfIndex: "B", rating: 1300, tags: ["Binary Search", "Greedy", "Sorting"] },
            { title: "Divisible Numbers", slug: "divisible-numbers", cfContest: 1744, cfIndex: "C", rating: 1300, tags: ["Math", "Number Theory", "Brute Force"] },
            { title: "Minimize Equal Sum Subarrays", slug: "min-equal-sum", cfContest: 1762, cfIndex: "B", rating: 1300, tags: ["Constructive", "Math"] },
            { title: "Not Dividing", slug: "not-dividing-1300", cfContest: 1794, cfIndex: "B", rating: 1300, tags: ["Greedy", "Math", "Number Theory"] },
            { title: "Choosing Subsequences", slug: "choosing-subseq-1300", cfContest: 1811, cfIndex: "B", rating: 1300, tags: ["DP", "Math"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // RATING 1400
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 1400 — Expert Start", slug: "rating-1400", order: 7, difficulty: "MEDIUM",
        problems: [
            { title: "Lost Numbers", slug: "lost-numbers", cfContest: 1167, cfIndex: "A", rating: 1400, tags: ["Interactive", "Brute Force", "Math"] },
            { title: "Rudolf and Snowflakes", slug: "rudolf-snowflakes", cfContest: 1941, cfIndex: "C", rating: 1400, tags: ["Brute Force", "Math", "Implementation"] },
            { title: "And Matching", slug: "and-matching", cfContest: 1631, cfIndex: "C", rating: 1400, tags: ["Constructive", "Bit Manipulation"] },
            { title: "Diverse Substrings", slug: "diverse-substrings", cfContest: 1748, cfIndex: "B", rating: 1400, tags: ["Brute Force", "Implementation", "Strings"] },
            { title: "Monsters (hard version)", slug: "monsters-hard", cfContest: 1849, cfIndex: "B", rating: 1400, tags: ["Greedy", "Data Structures", "Sorting"] },
            { title: "Diverse Garland", slug: "diverse-garland", cfContest: 1108, cfIndex: "B", rating: 1400, tags: ["Greedy", "Constructive"] },
            { title: "Minimize the Thickness", slug: "minimize-thickness", cfContest: 1741, cfIndex: "C", rating: 1400, tags: ["Brute Force", "Greedy", "Two Pointers"] },
            { title: "Summation Game", slug: "summation-game", cfContest: 1920, cfIndex: "C", rating: 1400, tags: ["Greedy", "Math", "Sorting", "Game Theory"] },
            { title: "Assembly via Minimums", slug: "assembly-minimums", cfContest: 1857, cfIndex: "C", rating: 1400, tags: ["Greedy", "Sorting", "Constructive"] },
            { title: "Good Array", slug: "good-array", cfContest: 1782, cfIndex: "B", rating: 1400, tags: ["Greedy", "Math", "Sorting"] },
            { title: "Prefix Removals", slug: "prefix-removals", cfContest: 1538, cfIndex: "B", rating: 1400, tags: ["Strings", "Implementation"] },
            { title: "Sagheer and Crossroads", slug: "sagheer-crossroads", cfContest: 812, cfIndex: "B", rating: 1400, tags: ["Implementation", "Bit Manipulation"] },
            { title: "Following Directions", slug: "following-directions", cfContest: 1791, cfIndex: "C", rating: 1400, tags: ["Greedy", "Implementation"] },
            { title: "Symmetric Encoding", slug: "symmetric-encoding", cfContest: 1881, cfIndex: "B", rating: 1400, tags: ["Strings", "Implementation", "Sorting"] },
            { title: "Vlad and Avoiding X", slug: "vlad-avoiding-x", cfContest: 1926, cfIndex: "C", rating: 1400, tags: ["Brute Force", "Greedy", "Implementation"] },
            { title: "Tea Tasting", slug: "tea-tasting", cfContest: 1795, cfIndex: "C", rating: 1400, tags: ["Binary Search", "Prefix Sum", "Implementation"] },
            { title: "Divide and Equalize", slug: "divide-equalize", cfContest: 1881, cfIndex: "C", rating: 1400, tags: ["Math", "Number Theory"] },
            { title: "Increasing Subsequence", slug: "increasing-subseq-1400", cfContest: 1922, cfIndex: "C", rating: 1400, tags: ["Greedy", "Two Pointers"] },
            { title: "MEX Game 1", slug: "mex-game-1", cfContest: 1944, cfIndex: "C", rating: 1400, tags: ["Greedy", "Game Theory"] },
            { title: "Permutation Partitioning", slug: "permutation-part", cfContest: 1976, cfIndex: "C", rating: 1400, tags: ["Combinatorics", "Math"] },
            { title: "Make it Connected", slug: "make-connected-1400", cfContest: 1761, cfIndex: "C", rating: 1400, tags: ["Constructive", "Greedy", "Sorting"] },
            { title: "Collider", slug: "collider-1400", cfContest: 1662, cfIndex: "B", rating: 1400, tags: ["Data Structures", "Implementation"] },
            { title: "Bus to Pénjamo", slug: "bus-penjamo-1400", cfContest: 1950, cfIndex: "C", rating: 1400, tags: ["Greedy", "Math"] },
            { title: "Turtle and Piggy Bank", slug: "turtle-piggy-1400", cfContest: 1981, cfIndex: "A", rating: 1400, tags: ["Greedy", "Math"] },
            { title: "Virus", slug: "virus-1400", cfContest: 1704, cfIndex: "B", rating: 1400, tags: ["Greedy", "Implementation", "Sorting"] },
            { title: "Lamps", slug: "lamps-1400", cfContest: 1676, cfIndex: "C", rating: 1400, tags: ["Data Structures", "Greedy", "Sorting"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // RATING 1500
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 1500 — Expert", slug: "rating-1500", order: 8, difficulty: "MEDIUM",
        problems: [
            { title: "Coprime", slug: "coprime-1500", cfContest: 1742, cfIndex: "D", rating: 1500, tags: ["Brute Force", "Greedy", "Number Theory"] },
            { title: "Doremy's Painting 3", slug: "doremys-painting-3", cfContest: 1764, cfIndex: "C", rating: 1500, tags: ["Constructive", "Implementation"] },
            { title: "Contrast Value", slug: "contrast-value", cfContest: 1832, cfIndex: "B", rating: 1500, tags: ["Greedy", "Implementation"] },
            { title: "Maximum Median", slug: "maximum-median", cfContest: 1486, cfIndex: "B", rating: 1500, tags: ["Binary Search", "Greedy", "Sorting"] },
            { title: "Line Empire", slug: "line-empire", cfContest: 1659, cfIndex: "B", rating: 1500, tags: ["Binary Search", "Greedy", "Prefix Sum"] },
            { title: "The Walkway", slug: "the-walkway", cfContest: 1776, cfIndex: "B", rating: 1500, tags: ["Implementation", "Math"] },
            { title: "Right Triangles", slug: "right-triangles", cfContest: 1703, cfIndex: "D", rating: 1500, tags: ["Combinatorics", "Math"] },
            { title: "Permutation Transformation", slug: "permutation-transform", cfContest: 1490, cfIndex: "C", rating: 1500, tags: ["DFS", "Divide and Conquer", "Trees"] },
            { title: "Yet Another Broken Keyboard", slug: "yet-another-keyboard", cfContest: 1272, cfIndex: "C", rating: 1500, tags: ["Combinatorics", "Math"] },
            { title: "Build Permutation", slug: "build-permutation", cfContest: 1713, cfIndex: "B", rating: 1500, tags: ["Constructive", "Greedy", "Math"] },
            { title: "Array Elimination", slug: "array-elimination", cfContest: 1602, cfIndex: "B", rating: 1500, tags: ["Bit Manipulation", "Math", "Number Theory"] },
            { title: "Monoblock", slug: "monoblock-1500", cfContest: 1715, cfIndex: "C", rating: 1500, tags: ["Combinatorics", "Implementation", "Math"] },
            { title: "Minimize the Cost", slug: "minimize-cost-1500", cfContest: 1672, cfIndex: "C", rating: 1500, tags: ["Math", "Greedy"] },
            { title: "LR-remainders", slug: "lr-remainders", cfContest: 1932, cfIndex: "C", rating: 1500, tags: ["Math", "Implementation", "Data Structures"] },
            { title: "Paint the Tree", slug: "paint-tree-1500", cfContest: 1615, cfIndex: "B", rating: 1500, tags: ["Greedy", "Trees", "DFS"] },
            { title: "Closest Cities", slug: "closest-cities", cfContest: 1922, cfIndex: "B", rating: 1500, tags: ["Prefix Sum", "Greedy", "Implementation"] },
            { title: "Swap Dilemma", slug: "swap-dilemma", cfContest: 1983, cfIndex: "C", rating: 1500, tags: ["Math", "Sorting", "Greedy"] },
            { title: "Vlad Building Beautiful Array", slug: "vlad-beautiful-array", cfContest: 1833, cfIndex: "C", rating: 1500, tags: ["Greedy", "Math"] },
            { title: "Bracket Coloring", slug: "bracket-coloring", cfContest: 1837, cfIndex: "C", rating: 1500, tags: ["Constructive", "Greedy", "Strings"] },
            { title: "Mark and His Unfinished Essay", slug: "mark-unfinished", cfContest: 1705, cfIndex: "B", rating: 1500, tags: ["Implementation", "Brute Force"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // RATING 1600
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 1600 — Expert+", slug: "rating-1600", order: 9, difficulty: "MEDIUM",
        problems: [
            { title: "Doremy's City Construction", slug: "doremys-city", cfContest: 1764, cfIndex: "D", rating: 1600, tags: ["Graphs", "Constructive", "Sorting"] },
            { title: "Good Subarrays", slug: "good-subarrays", cfContest: 1398, cfIndex: "C", rating: 1600, tags: ["Hash Table", "Math", "Prefix Sum"] },
            { title: "Array Cloning Technique", slug: "array-cloning", cfContest: 1665, cfIndex: "C", rating: 1600, tags: ["Greedy", "Hash Table", "Sorting"] },
            { title: "Range Update Point Query", slug: "range-update-point", cfContest: 1701, cfIndex: "D", rating: 1600, tags: ["Data Structures", "Implementation"] },
            { title: "MEX of Arrays", slug: "mex-of-arrays", cfContest: 1744, cfIndex: "D", rating: 1600, tags: ["Combinatorics", "DP", "Math"] },
            { title: "Serval and Rooted Tree", slug: "serval-rooted-tree", cfContest: 1153, cfIndex: "D", rating: 1600, tags: ["DFS", "DP", "Greedy", "Trees"] },
            { title: "Counting Orders", slug: "counting-orders", cfContest: 1769, cfIndex: "C", rating: 1600, tags: ["Binary Search", "Combinatorics", "Greedy", "Sorting"] },
            { title: "Parity Sort", slug: "parity-sort-1600", cfContest: 1851, cfIndex: "D", rating: 1600, tags: ["Greedy", "Sorting"] },
            { title: "Earning on Bets", slug: "earning-on-bets", cfContest: 1979, cfIndex: "C", rating: 1600, tags: ["Math", "Number Theory"] },
            { title: "Steve", slug: "steve-1600", cfContest: 1954, cfIndex: "C", rating: 1600, tags: ["Binary Search", "DP", "Math"] },
            { title: "Permutation Operations", slug: "permutation-ops-1600", cfContest: 1927, cfIndex: "C", rating: 1600, tags: ["Constructive", "Greedy", "Number Theory"] },
            { title: "Mischievous Shooter", slug: "mischievous-shooter", cfContest: 1862, cfIndex: "C", rating: 1600, tags: ["Prefix Sum", "Greedy", "Implementation"] },
            { title: "Splitting a String", slug: "splitting-string", cfContest: 1862, cfIndex: "B", rating: 1600, tags: ["Brute Force", "Strings", "Hash Table"] },
            { title: "Candies", slug: "candies-1600", cfContest: 991, cfIndex: "C", rating: 1600, tags: ["Binary Search", "Implementation"] },
            { title: "Maximum Set", slug: "maximum-set-1600", cfContest: 1796, cfIndex: "C", rating: 1600, tags: ["Binary Search", "Combinatorics", "Math"] },
            { title: "Grid Puzzle", slug: "grid-puzzle", cfContest: 1850, cfIndex: "D", rating: 1600, tags: ["DP", "Greedy"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // RATING 1700
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 1700 — Candidate Master Start", slug: "rating-1700", order: 10, difficulty: "HARD",
        problems: [
            { title: "Fixing a Binary String", slug: "fixing-binary-string", cfContest: 1837, cfIndex: "D", rating: 1700, tags: ["DP", "Strings", "Brute Force"] },
            { title: "Array Painting", slug: "array-painting", cfContest: 1849, cfIndex: "C", rating: 1700, tags: ["Greedy", "Constructive"] },
            { title: "Least Prefix Sum", slug: "least-prefix-sum", cfContest: 1779, cfIndex: "C", rating: 1700, tags: ["Greedy", "Data Structures"] },
            { title: "Balanced Bitstrings", slug: "balanced-bitstrings-1700", cfContest: 1691, cfIndex: "D", rating: 1700, tags: ["Greedy", "Math", "Strings"] },
            { title: "Yarik and Array", slug: "yarik-and-array", cfContest: 1899, cfIndex: "C", rating: 1700, tags: ["DP", "Greedy"] },
            { title: "Monsters (Hard)", slug: "monsters-hard-1700", cfContest: 1849, cfIndex: "C", rating: 1700, tags: ["Greedy", "Data Structures", "Sorting"] },
            { title: "Largest Almost Increasing Subsequence", slug: "largest-almost-inc", cfContest: 1986, cfIndex: "D", rating: 1700, tags: ["DP", "Greedy"] },
            { title: "Serval and Musical Notes", slug: "serval-musical", cfContest: 1789, cfIndex: "C", rating: 1700, tags: ["Math", "Hash Table", "Number Theory"] },
            { title: "Double Strings", slug: "double-strings-1700", cfContest: 1920, cfIndex: "D", rating: 1700, tags: ["Binary Search", "Data Structures", "Strings", "Hash Table"] },
            { title: "Shopaholic", slug: "shopaholic-1700", cfContest: 1810, cfIndex: "B", rating: 1700, tags: ["Greedy", "Sorting"] },
            { title: "XOR Construction", slug: "xor-construction", cfContest: 1895, cfIndex: "C", rating: 1700, tags: ["Bit Manipulation", "Constructive", "Math"] },
            { title: "Median of GCDs", slug: "median-of-gcds", cfContest: 1895, cfIndex: "D", rating: 1700, tags: ["Binary Search", "Number Theory", "Math"] },
            { title: "Pinball", slug: "pinball-1700", cfContest: 1901, cfIndex: "C", rating: 1700, tags: ["Binary Search", "Data Structures", "Prefix Sum", "Sorting"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // RATING 1800
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 1800 — Candidate Master", slug: "rating-1800", order: 11, difficulty: "HARD",
        problems: [
            { title: "Monoblock", slug: "monoblock-1800", cfContest: 1715, cfIndex: "D", rating: 1800, tags: ["Combinatorics", "Data Structures", "Math"] },
            { title: "Anna, Svyatoslav and Maps", slug: "anna-maps", cfContest: 1204, cfIndex: "C", rating: 1800, tags: ["Graphs", "Shortest Path", "Greedy"] },
            { title: "Doremy's Perfect DataStructure", slug: "doremy-data", cfContest: 1764, cfIndex: "E", rating: 1800, tags: ["Binary Search", "Math", "Bit Manipulation"] },
            { title: "Card Game", slug: "card-game-1800", cfContest: 1932, cfIndex: "E", rating: 1800, tags: ["Combinatorics", "Game Theory", "Math", "Sorting"] },
            { title: "Iva & Pav", slug: "iva-pav-1800", cfContest: 1878, cfIndex: "C", rating: 1800, tags: ["Binary Search", "Bit Manipulation", "Greedy"] },
            { title: "Array Fixing", slug: "array-fixing-1800", cfContest: 1854, cfIndex: "B", rating: 1800, tags: ["Greedy", "Implementation"] },
            { title: "Madoka and Childish Pranks", slug: "madoka-pranks", cfContest: 1647, cfIndex: "C", rating: 1800, tags: ["Constructive", "Greedy"] },
            { title: "Element Extermination", slug: "element-extermination", cfContest: 1375, cfIndex: "C", rating: 1800, tags: ["Constructive", "Greedy", "Stack"] },
            { title: "LR Balance", slug: "lr-balance-1800", cfContest: 1886, cfIndex: "C", rating: 1800, tags: ["Data Structures", "Greedy", "Strings"] },
            { title: "Sorting by Subsequences", slug: "sorting-subseq-1800", cfContest: 1768, cfIndex: "C", rating: 1800, tags: ["DFS", "DSU", "Math", "Sorting", "Graphs"] },
            { title: "Bracket Sequence Deletion", slug: "bracket-seq-delete", cfContest: 1657, cfIndex: "C", rating: 1800, tags: ["Greedy", "Implementation"] },
            { title: "Lucky Array", slug: "lucky-array-1800", cfContest: 1706, cfIndex: "C", rating: 1800, tags: ["Constructive", "Greedy", "Math"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // RATING 1900-2000+
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Rating 1900-2000+ — Master", slug: "rating-1900-plus", order: 12, difficulty: "HARD",
        problems: [
            { title: "Turtle and Inversions", slug: "turtle-inversions", cfContest: 1981, cfIndex: "C", rating: 1900, tags: ["DP", "Greedy", "Data Structures"] },
            { title: "Madoka and the Corruption Scheme", slug: "madoka-corruption", cfContest: 1647, cfIndex: "D", rating: 1900, tags: ["Combinatorics", "Greedy", "Math"] },
            { title: "Alice and the Cake", slug: "alice-and-cake", cfContest: 1654, cfIndex: "C", rating: 1900, tags: ["Data Structures", "Greedy", "Implementation", "Sorting"] },
            { title: "Prefix Function Queries", slug: "prefix-function", cfContest: 1721, cfIndex: "D", rating: 1900, tags: ["Strings", "String Algorithms"] },
            { title: "Count the Arrays", slug: "count-arrays", cfContest: 1312, cfIndex: "D", rating: 1900, tags: ["Combinatorics", "Math"] },
            { title: "Colored Rectangles", slug: "colored-rectangles", cfContest: 1398, cfIndex: "D", rating: 1900, tags: ["DP", "Greedy", "Sorting"] },
            { title: "The Number of Good Subsets", slug: "good-subsets", cfContest: 1762, cfIndex: "D", rating: 1900, tags: ["Bit Manipulation", "Combinatorics", "Math", "Number Theory"] },
            { title: "Sakurako and Water", slug: "sakurako-water", cfContest: 2008, cfIndex: "D", rating: 1900, tags: ["Greedy", "Implementation"] },
            { title: "Game on Tree (Easy Version)", slug: "game-on-tree-easy", cfContest: 1919, cfIndex: "D", rating: 2000, tags: ["DFS", "DP", "Greedy", "Trees"] },
            { title: "Bracket Coloring (Hard)", slug: "bracket-coloring-hard", cfContest: 1837, cfIndex: "E", rating: 2000, tags: ["Constructive", "DP", "Greedy", "Strings"] },
            { title: "Invertible Bracket Sequences", slug: "invertible-bracket", cfContest: 1806, cfIndex: "D", rating: 2000, tags: ["Binary Search", "Combinatorics", "Strings"] },
            { title: "Maximum AND", slug: "maximum-and-2000", cfContest: 1721, cfIndex: "C", rating: 2000, tags: ["Bit Manipulation", "Greedy", "Sorting"] },
        ]
    },
];

// ─── MAIN ───────────────────────────────────────────────────────────────
async function main() {
    console.log("🚀 Seeding comprehensive CP Sheet (250+)...\n");

    // 1. Clear existing CP data only
    console.log("🗑️  Clearing existing CP data...");
    // Delete problems that belong to CP topics
    const cpTopics = await prisma.topic.findMany({ where: { track: TrackType.CP }, select: { id: true } });
    const cpTopicIds = cpTopics.map(t => t.id);
    if (cpTopicIds.length > 0) {
        await prisma.testCase.deleteMany({ where: { problem: { topicId: { in: cpTopicIds } } } });
        await prisma.submission.deleteMany({ where: { problem: { topicId: { in: cpTopicIds } } } });
        await prisma.userProgress.deleteMany({ where: { problem: { topicId: { in: cpTopicIds } } } });
        await prisma.problem.deleteMany({ where: { topicId: { in: cpTopicIds } } });
        await prisma.subtopic.deleteMany({ where: { topicId: { in: cpTopicIds } } });
        await prisma.topic.deleteMany({ where: { track: TrackType.CP } });
    }
    console.log("   ✅ CP data cleared.\n");

    let totalProblems = 0;

    for (const tier of TIERS) {
        // 2. Create topic
        const topic = await prisma.topic.create({
            data: {
                name: tier.name,
                slug: tier.slug,
                track: TrackType.CP,
                order: tier.order,
            }
        });
        console.log(`📂 ${tier.name} (${tier.problems.length} problems)`);

        // 3. Create problems under this topic
        for (let i = 0; i < tier.problems.length; i++) {
            const p = tier.problems[i];
            await prisma.problem.create({
                data: {
                    title: p.title,
                    slug: cfSlug(p.cfContest, p.cfIndex, p.title),
                    description: `Solve this problem on Codeforces: ${p.title} (Rating: ${p.rating})`,
                    constraints: "See Codeforces for full problem statement and constraints.",
                    examples: JSON.stringify([]) as any,
                    difficulty: tier.difficulty,
                    tags: JSON.stringify(p.tags) as any,
                    trackType: TrackType.CP,
                    topicId: topic.id,
                    platformSource: PlatformSource.CODEFORCES,
                    platformUrl: cfUrl(p.cfContest, p.cfIndex),
                    rating: p.rating,
                    boilerplate: JSON.stringify({}) as any,
                    isPublished: true,
                    order: i + 1,
                }
            });
            totalProblems++;
        }
    }

    console.log(`\n🎉 Done! Created ${TIERS.length} rating tiers and ${totalProblems} CP problems.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
