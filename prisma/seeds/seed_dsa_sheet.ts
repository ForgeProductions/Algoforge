import { PrismaClient, TrackType, Difficulty, PlatformSource } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Load scraped content if exists
const SCRAPED_PATH = path.join(process.cwd(), "prisma", "seeds", "scraped_content.json");
const SCRAPED_DATA: Record<string, { description: string; constraints: string; boilerplate?: string }> =
    fs.existsSync(SCRAPED_PATH) ? JSON.parse(fs.readFileSync(SCRAPED_PATH, "utf-8")) : {};

// ─── Problem interface ──────────────────────────────────────────────────────
interface ProblemEntry {
    title: string;
    slug: string;
    leetcodeNum: number;
    difficulty: Difficulty;
    tags: string[];
    description?: string;
    constraints?: string;
    boilerplate?: string;
}

interface TopicDef {
    name: string;
    slug: string;
    order: number;
    problems: ProblemEntry[];
}

// ─── TOPICS & PROBLEMS (250+) ───────────────────────────────────────────────

const TOPICS: TopicDef[] = [
    // ═══════════════════════════════════════════════════════════════════════
    // 1. ARRAYS & HASHING
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Arrays & Hashing", slug: "arrays-and-hashing", order: 1,
        problems: [
            {
                title: "Contains Duplicate",
                slug: "contains-duplicate",
                leetcodeNum: 217,
                difficulty: "EASY",
                tags: ["Array", "Hash Table", "Sorting"],
                description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
                constraints: "- `1 <= nums.length <= 10^5`\\n- `-10^9 <= nums[i] <= 10^9`"
            },
            {
                title: "Valid Anagram",
                slug: "valid-anagram",
                leetcodeNum: 242,
                difficulty: "EASY",
                tags: ["Hash Table", "String", "Sorting"],
                description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\\n\\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
                constraints: "- `1 <= s.length, t.length <= 5 * 10^4`\\n- `s` and `t` consist of lowercase English letters."
            },
            {
                title: "Two Sum",
                slug: "two-sum",
                leetcodeNum: 1,
                difficulty: "EASY",
                tags: ["Array", "Hash Table"],
                description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\\n\\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\\n\\nYou can return the answer in any order.",
                constraints: "- `2 <= nums.length <= 10^4`\\n- `-10^9 <= nums[i] <= 10^9`\\n- `-10^9 <= target <= 10^9`\\n- Only one valid answer exists."
            },
            { title: "Concatenation of Array", slug: "concatenation-of-array", leetcodeNum: 1929, difficulty: "EASY", tags: ["Array"] },
            { title: "Remove Element", slug: "remove-element", leetcodeNum: 27, difficulty: "EASY", tags: ["Array", "Two Pointers"] },
            { title: "Majority Element", slug: "majority-element", leetcodeNum: 169, difficulty: "EASY", tags: ["Array", "Hash Table", "Sorting"] },
            { title: "Remove Duplicates from Sorted Array", slug: "remove-duplicates-from-sorted-array", leetcodeNum: 26, difficulty: "EASY", tags: ["Array", "Two Pointers"] },
            {
                title: "Group Anagrams",
                slug: "group-anagrams",
                leetcodeNum: 49,
                difficulty: "MEDIUM",
                tags: ["Array", "Hash Table", "String", "Sorting"],
                description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\\n\\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
                constraints: "- `1 <= strs.length <= 10^4`\\n- `0 <= strs[i].length <= 100`\\n- `strs[i]` consists of lowercase English letters."
            },
            {
                title: "Top K Frequent Elements",
                slug: "top-k-frequent-elements",
                leetcodeNum: 347,
                difficulty: "MEDIUM",
                tags: ["Array", "Hash Table", "Heap"],
                description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
                constraints: "- `1 <= nums.length <= 10^5`\\n- `-10^4 <= nums[i] <= 10^4`\\n- `k` is in the range `[1, the number of unique elements in the array]`.\\n- It is guaranteed that the answer is unique."
            },
            { title: "Product of Array Except Self", slug: "product-of-array-except-self", leetcodeNum: 238, difficulty: "MEDIUM", tags: ["Array", "Prefix Sum"] },
            { title: "Valid Sudoku", slug: "valid-sudoku", leetcodeNum: 36, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "Matrix"] },
            { title: "Sort Colors", slug: "sort-colors", leetcodeNum: 75, difficulty: "MEDIUM", tags: ["Array", "Two Pointers", "Sorting"] },
            { title: "Next Permutation", slug: "next-permutation", leetcodeNum: 31, difficulty: "MEDIUM", tags: ["Array", "Two Pointers"] },
            { title: "Pascal's Triangle", slug: "pascals-triangle", leetcodeNum: 118, difficulty: "EASY", tags: ["Array", "Dynamic Programming"] },
            { title: "Set Matrix Zeroes", slug: "set-matrix-zeroes", leetcodeNum: 73, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "Matrix"] },
            { title: "Rotate Image", slug: "rotate-image", leetcodeNum: 48, difficulty: "MEDIUM", tags: ["Array", "Math", "Matrix"] },
            { title: "Spiral Matrix", slug: "spiral-matrix", leetcodeNum: 54, difficulty: "MEDIUM", tags: ["Array", "Matrix", "Simulation"] },
            { title: "Longest Consecutive Sequence", slug: "longest-consecutive-sequence", leetcodeNum: 128, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "Union Find"] },
            { title: "Subarray Sum Equals K", slug: "subarray-sum-equals-k", leetcodeNum: 560, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "Prefix Sum"] },
            { title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", leetcodeNum: 121, difficulty: "EASY", tags: ["Array", "Dynamic Programming"] },
            { title: "Rotate Array", slug: "rotate-array", leetcodeNum: 189, difficulty: "MEDIUM", tags: ["Array", "Math", "Two Pointers"] },
            { title: "Maximum Subarray", slug: "maximum-subarray", leetcodeNum: 53, difficulty: "MEDIUM", tags: ["Array", "Divide and Conquer", "Dynamic Programming"] },
            { title: "Merge Sorted Array", slug: "merge-sorted-array-arr", leetcodeNum: 88, difficulty: "EASY", tags: ["Array", "Two Pointers", "Sorting"] },
            { title: "Pascal's Triangle II", slug: "pascals-triangle-ii", leetcodeNum: 119, difficulty: "EASY", tags: ["Array", "Dynamic Programming"] },
            { title: "Majority Element II", slug: "majority-element-ii", leetcodeNum: 229, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "Sorting", "Counting"] },
            { title: "3Sum Closest", slug: "3sum-closest", leetcodeNum: 16, difficulty: "MEDIUM", tags: ["Array", "Two Pointers", "Sorting"] },
            { title: "Maximum Points You Can Obtain from Cards", slug: "maximum-points-you-can-obtain-from-cards", leetcodeNum: 1423, difficulty: "MEDIUM", tags: ["Array", "Sliding Window", "Prefix Sum"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 2. TWO POINTERS
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Two Pointers", slug: "two-pointers", order: 2,
        problems: [
            { title: "Valid Palindrome", slug: "valid-palindrome", leetcodeNum: 125, difficulty: "EASY", tags: ["Two Pointers", "String"] },
            { title: "Two Sum II - Input Array Is Sorted", slug: "two-sum-ii-input-array-is-sorted", leetcodeNum: 167, difficulty: "MEDIUM", tags: ["Array", "Two Pointers", "Binary Search"] },
            { title: "3Sum", slug: "3sum", leetcodeNum: 15, difficulty: "MEDIUM", tags: ["Array", "Two Pointers", "Sorting"] },
            { title: "Container With Most Water", slug: "container-with-most-water", leetcodeNum: 11, difficulty: "MEDIUM", tags: ["Array", "Two Pointers", "Greedy"] },
            { title: "Move Zeroes", slug: "move-zeroes", leetcodeNum: 283, difficulty: "EASY", tags: ["Array", "Two Pointers"] },
            { title: "Remove Duplicates from Sorted Array II", slug: "remove-duplicates-from-sorted-array-ii", leetcodeNum: 80, difficulty: "MEDIUM", tags: ["Array", "Two Pointers"] },
            { title: "Trapping Rain Water", slug: "trapping-rain-water", leetcodeNum: 42, difficulty: "HARD", tags: ["Array", "Two Pointers", "Stack", "Dynamic Programming"] },
            { title: "4Sum", slug: "4sum", leetcodeNum: 18, difficulty: "MEDIUM", tags: ["Array", "Two Pointers", "Sorting"] },
            { title: "Reverse String", slug: "reverse-string", leetcodeNum: 344, difficulty: "EASY", tags: ["Two Pointers", "String"] },
            { title: "Squares of a Sorted Array", slug: "squares-of-a-sorted-array", leetcodeNum: 977, difficulty: "EASY", tags: ["Array", "Two Pointers", "Sorting"] },
            { title: "Boats to Save People", slug: "boats-to-save-people", leetcodeNum: 881, difficulty: "MEDIUM", tags: ["Array", "Two Pointers", "Greedy", "Sorting"] },
            { title: "Sort Colors", slug: "sort-colors-tp", leetcodeNum: 75, difficulty: "MEDIUM", tags: ["Array", "Two Pointers", "Sorting"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 3. SLIDING WINDOW
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Sliding Window", slug: "sliding-window", order: 3,
        problems: [
            { title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", leetcodeNum: 3, difficulty: "MEDIUM", tags: ["Hash Table", "String", "Sliding Window"] },
            { title: "Longest Repeating Character Replacement", slug: "longest-repeating-character-replacement", leetcodeNum: 424, difficulty: "MEDIUM", tags: ["Hash Table", "String", "Sliding Window"] },
            { title: "Permutation in String", slug: "permutation-in-string", leetcodeNum: 567, difficulty: "MEDIUM", tags: ["Hash Table", "Two Pointers", "String", "Sliding Window"] },
            { title: "Minimum Window Substring", slug: "minimum-window-substring", leetcodeNum: 76, difficulty: "HARD", tags: ["Hash Table", "String", "Sliding Window"] },
            { title: "Max Consecutive Ones III", slug: "max-consecutive-ones-iii", leetcodeNum: 1004, difficulty: "MEDIUM", tags: ["Array", "Binary Search", "Sliding Window", "Prefix Sum"] },
            { title: "Sliding Window Maximum", slug: "sliding-window-maximum", leetcodeNum: 239, difficulty: "HARD", tags: ["Array", "Queue", "Sliding Window", "Heap", "Monotonic Queue"] },
            { title: "Minimum Size Subarray Sum", slug: "minimum-size-subarray-sum", leetcodeNum: 209, difficulty: "MEDIUM", tags: ["Array", "Binary Search", "Sliding Window", "Prefix Sum"] },
            { title: "Fruit Into Baskets", slug: "fruit-into-baskets", leetcodeNum: 904, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "Sliding Window"] },
            { title: "Number of Sub-arrays of Size K and Average >= Threshold", slug: "number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold", leetcodeNum: 1343, difficulty: "MEDIUM", tags: ["Array", "Sliding Window"] },
            { title: "Subarray Product Less Than K", slug: "subarray-product-less-than-k", leetcodeNum: 713, difficulty: "MEDIUM", tags: ["Array", "Sliding Window"] },
            { title: "Count Number of Nice Subarrays", slug: "count-number-of-nice-subarrays", leetcodeNum: 1248, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "Math", "Sliding Window"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 4. STACK & QUEUES
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Stack & Queues", slug: "stack-and-queues", order: 4,
        problems: [
            { title: "Valid Parentheses", slug: "valid-parentheses", leetcodeNum: 20, difficulty: "EASY", tags: ["String", "Stack"] },
            { title: "Min Stack", slug: "min-stack", leetcodeNum: 155, difficulty: "MEDIUM", tags: ["Stack", "Design"] },
            { title: "Evaluate Reverse Polish Notation", slug: "evaluate-reverse-polish-notation", leetcodeNum: 150, difficulty: "MEDIUM", tags: ["Array", "Math", "Stack"] },
            { title: "Daily Temperatures", slug: "daily-temperatures", leetcodeNum: 739, difficulty: "MEDIUM", tags: ["Array", "Stack", "Monotonic Stack"] },
            { title: "Next Greater Element I", slug: "next-greater-element-i", leetcodeNum: 496, difficulty: "EASY", tags: ["Array", "Hash Table", "Stack", "Monotonic Stack"] },
            { title: "Implement Queue using Stacks", slug: "implement-queue-using-stacks", leetcodeNum: 232, difficulty: "EASY", tags: ["Stack", "Design", "Queue"] },
            { title: "Implement Stack using Queues", slug: "implement-stack-using-queues", leetcodeNum: 225, difficulty: "EASY", tags: ["Stack", "Design", "Queue"] },
            { title: "Largest Rectangle in Histogram", slug: "largest-rectangle-in-histogram", leetcodeNum: 84, difficulty: "HARD", tags: ["Array", "Stack", "Monotonic Stack"] },
            { title: "Online Stock Span", slug: "online-stock-span", leetcodeNum: 901, difficulty: "MEDIUM", tags: ["Stack", "Design", "Monotonic Stack", "Data Stream"] },
            { title: "Next Greater Element II", slug: "next-greater-element-ii", leetcodeNum: 503, difficulty: "MEDIUM", tags: ["Array", "Stack", "Monotonic Stack"] },
            { title: "Asteroid Collision", slug: "asteroid-collision", leetcodeNum: 735, difficulty: "MEDIUM", tags: ["Array", "Stack", "Simulation"] },
            { title: "Trapping Rain Water", slug: "trapping-rain-water-stack", leetcodeNum: 42, difficulty: "HARD", tags: ["Array", "Two Pointers", "Stack", "Monotonic Stack"] },
            { title: "Decode String", slug: "decode-string", leetcodeNum: 394, difficulty: "MEDIUM", tags: ["String", "Stack", "Recursion"] },
            { title: "Remove All Adjacent Duplicates in String II", slug: "remove-all-adjacent-duplicates-in-string-ii", leetcodeNum: 1209, difficulty: "MEDIUM", tags: ["String", "Stack"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 5. BINARY SEARCH
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Binary Search", slug: "binary-search", order: 5,
        problems: [
            { title: "Binary Search", slug: "binary-search", leetcodeNum: 704, difficulty: "EASY", tags: ["Array", "Binary Search"] },
            { title: "Search a 2D Matrix", slug: "search-a-2d-matrix", leetcodeNum: 74, difficulty: "MEDIUM", tags: ["Array", "Binary Search", "Matrix"] },
            { title: "Koko Eating Bananas", slug: "koko-eating-bananas", leetcodeNum: 875, difficulty: "MEDIUM", tags: ["Array", "Binary Search"] },
            { title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", leetcodeNum: 33, difficulty: "MEDIUM", tags: ["Array", "Binary Search"] },
            { title: "Find Minimum in Rotated Sorted Array", slug: "find-minimum-in-rotated-sorted-array", leetcodeNum: 153, difficulty: "MEDIUM", tags: ["Array", "Binary Search"] },
            { title: "Find Peak Element", slug: "find-peak-element", leetcodeNum: 162, difficulty: "MEDIUM", tags: ["Array", "Binary Search"] },
            { title: "Search Insert Position", slug: "search-insert-position", leetcodeNum: 35, difficulty: "EASY", tags: ["Array", "Binary Search"] },
            { title: "Single Element in a Sorted Array", slug: "single-element-in-a-sorted-array", leetcodeNum: 540, difficulty: "MEDIUM", tags: ["Array", "Binary Search"] },
            { title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays", leetcodeNum: 4, difficulty: "HARD", tags: ["Array", "Binary Search", "Divide and Conquer"] },
            { title: "Find First and Last Position of Element in Sorted Array", slug: "find-first-and-last-position-of-element-in-sorted-array", leetcodeNum: 34, difficulty: "MEDIUM", tags: ["Array", "Binary Search"] },
            { title: "Search a 2D Matrix II", slug: "search-a-2d-matrix-ii", leetcodeNum: 240, difficulty: "MEDIUM", tags: ["Array", "Binary Search", "Divide and Conquer", "Matrix"] },
            { title: "Capacity To Ship Packages Within D Days", slug: "capacity-to-ship-packages-within-d-days", leetcodeNum: 1011, difficulty: "MEDIUM", tags: ["Array", "Binary Search"] },
            { title: "Split Array Largest Sum", slug: "split-array-largest-sum", leetcodeNum: 410, difficulty: "HARD", tags: ["Array", "Binary Search", "Dynamic Programming", "Greedy"] },
            { title: "Sqrt(x)", slug: "sqrtx", leetcodeNum: 69, difficulty: "EASY", tags: ["Math", "Binary Search"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 6. LINKED LIST
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Linked List", slug: "linked-list", order: 6,
        problems: [
            { title: "Reverse Linked List", slug: "reverse-linked-list", leetcodeNum: 206, difficulty: "EASY", tags: ["Linked List", "Recursion"] },
            { title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", leetcodeNum: 21, difficulty: "EASY", tags: ["Linked List", "Recursion"] },
            { title: "Linked List Cycle", slug: "linked-list-cycle", leetcodeNum: 141, difficulty: "EASY", tags: ["Hash Table", "Linked List", "Two Pointers"] },
            { title: "Middle of the Linked List", slug: "middle-of-the-linked-list", leetcodeNum: 876, difficulty: "EASY", tags: ["Linked List", "Two Pointers"] },
            { title: "Remove Nth Node From End of List", slug: "remove-nth-node-from-end-of-list", leetcodeNum: 19, difficulty: "MEDIUM", tags: ["Linked List", "Two Pointers"] },
            { title: "Add Two Numbers", slug: "add-two-numbers", leetcodeNum: 2, difficulty: "MEDIUM", tags: ["Linked List", "Math", "Recursion"] },
            { title: "Linked List Cycle II", slug: "linked-list-cycle-ii", leetcodeNum: 142, difficulty: "MEDIUM", tags: ["Hash Table", "Linked List", "Two Pointers"] },
            { title: "Reorder List", slug: "reorder-list", leetcodeNum: 143, difficulty: "MEDIUM", tags: ["Linked List", "Two Pointers", "Stack", "Recursion"] },
            { title: "Palindrome Linked List", slug: "palindrome-linked-list", leetcodeNum: 234, difficulty: "EASY", tags: ["Linked List", "Two Pointers", "Stack", "Recursion"] },
            { title: "Copy List with Random Pointer", slug: "copy-list-with-random-pointer", leetcodeNum: 138, difficulty: "MEDIUM", tags: ["Hash Table", "Linked List"] },
            { title: "LRU Cache", slug: "lru-cache", leetcodeNum: 146, difficulty: "MEDIUM", tags: ["Hash Table", "Linked List", "Design"] },
            { title: "Merge K Sorted Lists", slug: "merge-k-sorted-lists", leetcodeNum: 23, difficulty: "HARD", tags: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"] },
            { title: "Rotate List", slug: "rotate-list", leetcodeNum: 61, difficulty: "MEDIUM", tags: ["Linked List", "Two Pointers"] },
            { title: "Reverse Linked List II", slug: "reverse-linked-list-ii", leetcodeNum: 92, difficulty: "MEDIUM", tags: ["Linked List"] },
            { title: "Intersection of Two Linked Lists", slug: "intersection-of-two-linked-lists", leetcodeNum: 160, difficulty: "EASY", tags: ["Hash Table", "Linked List", "Two Pointers"] },
            { title: "Remove Linked List Elements", slug: "remove-linked-list-elements", leetcodeNum: 203, difficulty: "EASY", tags: ["Linked List", "Recursion"] },
            { title: "Sort List", slug: "sort-list-ll", leetcodeNum: 148, difficulty: "MEDIUM", tags: ["Linked List", "Two Pointers", "Divide and Conquer", "Sorting", "Merge Sort"] },
            { title: "Odd Even Linked List", slug: "odd-even-linked-list", leetcodeNum: 328, difficulty: "MEDIUM", tags: ["Linked List"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 7. RECURSION & BACKTRACKING
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Recursion & Backtracking", slug: "recursion-and-backtracking", order: 7,
        problems: [
            { title: "Subsets", slug: "subsets", leetcodeNum: 78, difficulty: "MEDIUM", tags: ["Array", "Backtracking", "Bit Manipulation"] },
            { title: "Combination Sum", slug: "combination-sum", leetcodeNum: 39, difficulty: "MEDIUM", tags: ["Array", "Backtracking"] },
            { title: "Permutations", slug: "permutations", leetcodeNum: 46, difficulty: "MEDIUM", tags: ["Array", "Backtracking"] },
            { title: "Subsets II", slug: "subsets-ii", leetcodeNum: 90, difficulty: "MEDIUM", tags: ["Array", "Backtracking", "Bit Manipulation"] },
            { title: "Combination Sum II", slug: "combination-sum-ii", leetcodeNum: 40, difficulty: "MEDIUM", tags: ["Array", "Backtracking"] },
            { title: "Word Search", slug: "word-search", leetcodeNum: 79, difficulty: "MEDIUM", tags: ["Array", "Backtracking", "Matrix"] },
            { title: "Palindrome Partitioning", slug: "palindrome-partitioning", leetcodeNum: 131, difficulty: "MEDIUM", tags: ["String", "Dynamic Programming", "Backtracking"] },
            { title: "Letter Combinations of a Phone Number", slug: "letter-combinations-of-a-phone-number", leetcodeNum: 17, difficulty: "MEDIUM", tags: ["Hash Table", "String", "Backtracking"] },
            { title: "N-Queens", slug: "n-queens", leetcodeNum: 51, difficulty: "HARD", tags: ["Array", "Backtracking"] },
            { title: "Sudoku Solver", slug: "sudoku-solver", leetcodeNum: 37, difficulty: "HARD", tags: ["Array", "Hash Table", "Backtracking", "Matrix"] },
            { title: "Pow(x, n)", slug: "powx-n", leetcodeNum: 50, difficulty: "MEDIUM", tags: ["Math", "Recursion"] },
            { title: "Permutations II", slug: "permutations-ii", leetcodeNum: 47, difficulty: "MEDIUM", tags: ["Array", "Backtracking"] },
            { title: "Combinations", slug: "combinations", leetcodeNum: 77, difficulty: "MEDIUM", tags: ["Backtracking"] },
            { title: "Generate Parentheses", slug: "generate-parentheses", leetcodeNum: 22, difficulty: "MEDIUM", tags: ["String", "Dynamic Programming", "Backtracking"] },
            { title: "Combination Sum III", slug: "combination-sum-iii", leetcodeNum: 216, difficulty: "MEDIUM", tags: ["Array", "Backtracking"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 8. BINARY TREES
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Binary Trees", slug: "binary-trees", order: 8,
        problems: [
            { title: "Binary Tree Inorder Traversal", slug: "binary-tree-inorder-traversal", leetcodeNum: 94, difficulty: "EASY", tags: ["Stack", "Tree", "DFS", "Binary Tree"] },
            { title: "Binary Tree Preorder Traversal", slug: "binary-tree-preorder-traversal", leetcodeNum: 144, difficulty: "EASY", tags: ["Stack", "Tree", "DFS", "Binary Tree"] },
            { title: "Binary Tree Postorder Traversal", slug: "binary-tree-postorder-traversal", leetcodeNum: 145, difficulty: "EASY", tags: ["Stack", "Tree", "DFS", "Binary Tree"] },
            { title: "Maximum Depth of Binary Tree", slug: "maximum-depth-of-binary-tree", leetcodeNum: 104, difficulty: "EASY", tags: ["Tree", "DFS", "BFS", "Binary Tree"] },
            { title: "Same Tree", slug: "same-tree", leetcodeNum: 100, difficulty: "EASY", tags: ["Tree", "DFS", "BFS", "Binary Tree"] },
            { title: "Invert Binary Tree", slug: "invert-binary-tree", leetcodeNum: 226, difficulty: "EASY", tags: ["Tree", "DFS", "BFS", "Binary Tree"] },
            { title: "Symmetric Tree", slug: "symmetric-tree", leetcodeNum: 101, difficulty: "EASY", tags: ["Tree", "DFS", "BFS", "Binary Tree"] },
            { title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal", leetcodeNum: 102, difficulty: "MEDIUM", tags: ["Tree", "BFS", "Binary Tree"] },
            { title: "Diameter of Binary Tree", slug: "diameter-of-binary-tree", leetcodeNum: 543, difficulty: "EASY", tags: ["Tree", "DFS", "Binary Tree"] },
            { title: "Balanced Binary Tree", slug: "balanced-binary-tree", leetcodeNum: 110, difficulty: "EASY", tags: ["Tree", "DFS", "Binary Tree"] },
            { title: "Lowest Common Ancestor of a Binary Tree", slug: "lowest-common-ancestor-of-a-binary-tree", leetcodeNum: 236, difficulty: "MEDIUM", tags: ["Tree", "DFS", "Binary Tree"] },
            { title: "Binary Tree Zigzag Level Order Traversal", slug: "binary-tree-zigzag-level-order-traversal", leetcodeNum: 103, difficulty: "MEDIUM", tags: ["Tree", "BFS", "Binary Tree"] },
            { title: "Binary Tree Right Side View", slug: "binary-tree-right-side-view", leetcodeNum: 199, difficulty: "MEDIUM", tags: ["Tree", "DFS", "BFS", "Binary Tree"] },
            { title: "Construct Binary Tree from Preorder and Inorder Traversal", slug: "construct-binary-tree-from-preorder-and-inorder-traversal", leetcodeNum: 105, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"] },
            { title: "Serialize and Deserialize Binary Tree", slug: "serialize-and-deserialize-binary-tree", leetcodeNum: 297, difficulty: "HARD", tags: ["String", "Tree", "DFS", "BFS", "Design", "Binary Tree"] },
            { title: "Binary Tree Maximum Path Sum", slug: "binary-tree-maximum-path-sum", leetcodeNum: 124, difficulty: "HARD", tags: ["Dynamic Programming", "Tree", "DFS", "Binary Tree"] },
            { title: "Path Sum", slug: "path-sum", leetcodeNum: 112, difficulty: "EASY", tags: ["Tree", "DFS", "BFS", "Binary Tree"] },
            { title: "Path Sum II", slug: "path-sum-ii", leetcodeNum: 113, difficulty: "MEDIUM", tags: ["Backtracking", "Tree", "DFS", "Binary Tree"] },
            { title: "Count Good Nodes in Binary Tree", slug: "count-good-nodes-in-binary-tree", leetcodeNum: 1448, difficulty: "MEDIUM", tags: ["Tree", "DFS", "BFS", "Binary Tree"] },
            { title: "Subtree of Another Tree", slug: "subtree-of-another-tree", leetcodeNum: 572, difficulty: "EASY", tags: ["Tree", "DFS", "String Matching", "Binary Tree", "Hash Function"] },
            { title: "Populating Next Right Pointers in Each Node", slug: "populating-next-right-pointers-in-each-node", leetcodeNum: 116, difficulty: "MEDIUM", tags: ["Linked List", "Tree", "DFS", "BFS", "Binary Tree"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 9. BINARY SEARCH TREES
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Binary Search Trees", slug: "binary-search-trees", order: 9,
        problems: [
            { title: "Search in a Binary Search Tree", slug: "search-in-a-binary-search-tree", leetcodeNum: 700, difficulty: "EASY", tags: ["Tree", "BST", "Binary Tree"] },
            { title: "Validate Binary Search Tree", slug: "validate-binary-search-tree", leetcodeNum: 98, difficulty: "MEDIUM", tags: ["Tree", "DFS", "BST", "Binary Tree"] },
            { title: "Kth Smallest Element in a BST", slug: "kth-smallest-element-in-a-bst", leetcodeNum: 230, difficulty: "MEDIUM", tags: ["Tree", "DFS", "BST", "Binary Tree"] },
            { title: "Lowest Common Ancestor of a Binary Search Tree", slug: "lowest-common-ancestor-of-a-binary-search-tree", leetcodeNum: 235, difficulty: "MEDIUM", tags: ["Tree", "DFS", "BST", "Binary Tree"] },
            { title: "Insert into a Binary Search Tree", slug: "insert-into-a-binary-search-tree", leetcodeNum: 701, difficulty: "MEDIUM", tags: ["Tree", "BST", "Binary Tree"] },
            { title: "Delete Node in a BST", slug: "delete-node-in-a-bst", leetcodeNum: 450, difficulty: "MEDIUM", tags: ["Tree", "BST", "Binary Tree"] },
            { title: "Convert Sorted Array to Binary Search Tree", slug: "convert-sorted-array-to-binary-search-tree", leetcodeNum: 108, difficulty: "EASY", tags: ["Array", "Divide and Conquer", "Tree", "BST", "Binary Tree"] },
            { title: "Binary Search Tree Iterator", slug: "binary-search-tree-iterator", leetcodeNum: 173, difficulty: "MEDIUM", tags: ["Stack", "Tree", "Design", "BST", "Binary Tree", "Iterator"] },
            { title: "Two Sum IV - Input is a BST", slug: "two-sum-iv-input-is-a-bst", leetcodeNum: 653, difficulty: "EASY", tags: ["Hash Table", "Two Pointers", "Tree", "DFS", "BFS", "BST", "Binary Tree"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 10. HEAP / PRIORITY QUEUE
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Heap / Priority Queue", slug: "heap-priority-queue", order: 10,
        problems: [
            { title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", leetcodeNum: 215, difficulty: "MEDIUM", tags: ["Array", "Divide and Conquer", "Sorting", "Heap"] },
            { title: "Last Stone Weight", slug: "last-stone-weight", leetcodeNum: 1046, difficulty: "EASY", tags: ["Array", "Heap"] },
            { title: "K Closest Points to Origin", slug: "k-closest-points-to-origin", leetcodeNum: 973, difficulty: "MEDIUM", tags: ["Array", "Math", "Divide and Conquer", "Geometry", "Sorting", "Heap"] },
            { title: "Task Scheduler", slug: "task-scheduler", leetcodeNum: 621, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "Greedy", "Sorting", "Heap", "Counting"] },
            { title: "Find Median from Data Stream", slug: "find-median-from-data-stream", leetcodeNum: 295, difficulty: "HARD", tags: ["Two Pointers", "Design", "Sorting", "Heap", "Data Stream"] },
            { title: "Kth Largest Element in a Stream", slug: "kth-largest-element-in-a-stream", leetcodeNum: 703, difficulty: "EASY", tags: ["Tree", "Design", "BST", "Heap", "Binary Tree", "Data Stream"] },
            { title: "Sort Characters By Frequency", slug: "sort-characters-by-frequency", leetcodeNum: 451, difficulty: "MEDIUM", tags: ["Hash Table", "String", "Sorting", "Heap", "Bucket Sort", "Counting"] },
            { title: "Reorganize String", slug: "reorganize-string", leetcodeNum: 767, difficulty: "MEDIUM", tags: ["Hash Table", "String", "Greedy", "Sorting", "Heap", "Counting"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 11. TRIES
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Tries", slug: "tries", order: 11,
        problems: [
            { title: "Implement Trie (Prefix Tree)", slug: "implement-trie-prefix-tree", leetcodeNum: 208, difficulty: "MEDIUM", tags: ["Hash Table", "String", "Design", "Trie"] },
            { title: "Design Add and Search Words Data Structure", slug: "design-add-and-search-words-data-structure", leetcodeNum: 211, difficulty: "MEDIUM", tags: ["String", "DFS", "Design", "Trie"] },
            { title: "Word Search II", slug: "word-search-ii", leetcodeNum: 212, difficulty: "HARD", tags: ["Array", "String", "Backtracking", "Trie", "Matrix"] },
            { title: "Longest Word in Dictionary", slug: "longest-word-in-dictionary", leetcodeNum: 720, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "String", "Trie", "Sorting"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 12. GRAPHS
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Graphs", slug: "graphs", order: 12,
        problems: [
            { title: "Number of Islands", slug: "number-of-islands", leetcodeNum: 200, difficulty: "MEDIUM", tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"] },
            { title: "Clone Graph", slug: "clone-graph", leetcodeNum: 133, difficulty: "MEDIUM", tags: ["Hash Table", "DFS", "BFS", "Graph"] },
            { title: "Course Schedule", slug: "course-schedule", leetcodeNum: 207, difficulty: "MEDIUM", tags: ["DFS", "BFS", "Graph", "Topological Sort"] },
            { title: "Course Schedule II", slug: "course-schedule-ii", leetcodeNum: 210, difficulty: "MEDIUM", tags: ["DFS", "BFS", "Graph", "Topological Sort"] },
            { title: "Pacific Atlantic Water Flow", slug: "pacific-atlantic-water-flow", leetcodeNum: 417, difficulty: "MEDIUM", tags: ["Array", "DFS", "BFS", "Matrix"] },
            { title: "Rotting Oranges", slug: "rotting-oranges", leetcodeNum: 994, difficulty: "MEDIUM", tags: ["Array", "BFS", "Matrix"] },
            { title: "Surrounded Regions", slug: "surrounded-regions", leetcodeNum: 130, difficulty: "MEDIUM", tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"] },
            { title: "Number of Provinces", slug: "number-of-provinces", leetcodeNum: 547, difficulty: "MEDIUM", tags: ["DFS", "BFS", "Union Find", "Graph"] },
            { title: "Word Ladder", slug: "word-ladder", leetcodeNum: 127, difficulty: "HARD", tags: ["Hash Table", "String", "BFS"] },
            { title: "Is Graph Bipartite?", slug: "is-graph-bipartite", leetcodeNum: 785, difficulty: "MEDIUM", tags: ["DFS", "BFS", "Union Find", "Graph"] },
            { title: "Detect Cycles in 2D Grid", slug: "detect-cycles-in-2d-grid", leetcodeNum: 1559, difficulty: "MEDIUM", tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"] },
            { title: "Flood Fill", slug: "flood-fill", leetcodeNum: 733, difficulty: "EASY", tags: ["Array", "DFS", "BFS", "Matrix"] },
            { title: "01 Matrix", slug: "01-matrix", leetcodeNum: 542, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming", "BFS", "Matrix"] },
            { title: "Keys and Rooms", slug: "keys-and-rooms", leetcodeNum: 841, difficulty: "MEDIUM", tags: ["DFS", "BFS", "Graph"] },
            { title: "Redundant Connection", slug: "redundant-connection", leetcodeNum: 684, difficulty: "MEDIUM", tags: ["DFS", "BFS", "Union Find", "Graph"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 13. ADVANCED GRAPHS
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Advanced Graphs", slug: "advanced-graphs", order: 13,
        problems: [
            { title: "Network Delay Time", slug: "network-delay-time", leetcodeNum: 743, difficulty: "MEDIUM", tags: ["DFS", "BFS", "Graph", "Heap", "Shortest Path"] },
            { title: "Cheapest Flights Within K Stops", slug: "cheapest-flights-within-k-stops", leetcodeNum: 787, difficulty: "MEDIUM", tags: ["Dynamic Programming", "DFS", "BFS", "Graph", "Heap", "Shortest Path"] },
            { title: "Swim in Rising Water", slug: "swim-in-rising-water", leetcodeNum: 778, difficulty: "HARD", tags: ["Array", "Binary Search", "DFS", "BFS", "Union Find", "Heap", "Matrix"] },
            { title: "Min Cost to Connect All Points", slug: "min-cost-to-connect-all-points", leetcodeNum: 1584, difficulty: "MEDIUM", tags: ["Array", "Union Find", "Graph", "Minimum Spanning Tree"] },
            { title: "Path with Maximum Probability", slug: "path-with-maximum-probability", leetcodeNum: 1514, difficulty: "MEDIUM", tags: ["Array", "Graph", "Heap", "Shortest Path"] },
            { title: "Find the City With the Smallest Number of Neighbors", slug: "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance", leetcodeNum: 1334, difficulty: "MEDIUM", tags: ["Dynamic Programming", "Graph", "Shortest Path"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 14. 1-D DYNAMIC PROGRAMMING
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "1-D Dynamic Programming", slug: "1d-dynamic-programming", order: 14,
        problems: [
            { title: "Climbing Stairs", slug: "climbing-stairs", leetcodeNum: 70, difficulty: "EASY", tags: ["Math", "Dynamic Programming", "Memoization"] },
            { title: "House Robber", slug: "house-robber", leetcodeNum: 198, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming"] },
            { title: "House Robber II", slug: "house-robber-ii", leetcodeNum: 213, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming"] },
            { title: "Longest Palindromic Substring", slug: "longest-palindromic-substring", leetcodeNum: 5, difficulty: "MEDIUM", tags: ["String", "Dynamic Programming"] },
            { title: "Coin Change", slug: "coin-change", leetcodeNum: 322, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming", "BFS"] },
            { title: "Maximum Product Subarray", slug: "maximum-product-subarray", leetcodeNum: 152, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming"] },
            { title: "Word Break", slug: "word-break", leetcodeNum: 139, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "String", "Dynamic Programming", "Trie", "Memoization"] },
            { title: "Longest Increasing Subsequence", slug: "longest-increasing-subsequence", leetcodeNum: 300, difficulty: "MEDIUM", tags: ["Array", "Binary Search", "Dynamic Programming"] },
            { title: "Decode Ways", slug: "decode-ways", leetcodeNum: 91, difficulty: "MEDIUM", tags: ["String", "Dynamic Programming"] },
            { title: "Fibonacci Number", slug: "fibonacci-number", leetcodeNum: 509, difficulty: "EASY", tags: ["Math", "Dynamic Programming", "Recursion", "Memoization"] },
            { title: "Min Cost Climbing Stairs", slug: "min-cost-climbing-stairs", leetcodeNum: 746, difficulty: "EASY", tags: ["Array", "Dynamic Programming"] },
            { title: "Palindromic Substrings", slug: "palindromic-substrings", leetcodeNum: 647, difficulty: "MEDIUM", tags: ["String", "Dynamic Programming"] },
            { title: "Perfect Squares", slug: "perfect-squares", leetcodeNum: 279, difficulty: "MEDIUM", tags: ["Math", "Dynamic Programming", "BFS"] },
            { title: "Partition Equal Subset Sum", slug: "partition-equal-subset-sum", leetcodeNum: 416, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming"] },
            { title: "Ugly Number II", slug: "ugly-number-ii", leetcodeNum: 264, difficulty: "MEDIUM", tags: ["Hash Table", "Math", "Dynamic Programming", "Heap"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 15. 2-D DYNAMIC PROGRAMMING
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "2-D Dynamic Programming", slug: "2d-dynamic-programming", order: 15,
        problems: [
            { title: "Unique Paths", slug: "unique-paths", leetcodeNum: 62, difficulty: "MEDIUM", tags: ["Math", "Dynamic Programming", "Combinatorics"] },
            { title: "Longest Common Subsequence", slug: "longest-common-subsequence", leetcodeNum: 1143, difficulty: "MEDIUM", tags: ["String", "Dynamic Programming"] },
            { title: "Edit Distance", slug: "edit-distance", leetcodeNum: 72, difficulty: "MEDIUM", tags: ["String", "Dynamic Programming"] },
            { title: "Coin Change 2", slug: "coin-change-2", leetcodeNum: 518, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming"] },
            { title: "Target Sum", slug: "target-sum", leetcodeNum: 494, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming", "Backtracking"] },
            { title: "Interleaving String", slug: "interleaving-string", leetcodeNum: 97, difficulty: "MEDIUM", tags: ["String", "Dynamic Programming"] },
            { title: "Best Time to Buy and Sell Stock with Cooldown", slug: "best-time-to-buy-and-sell-stock-with-cooldown", leetcodeNum: 309, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming"] },
            { title: "Distinct Subsequences", slug: "distinct-subsequences", leetcodeNum: 115, difficulty: "HARD", tags: ["String", "Dynamic Programming"] },
            { title: "Minimum Path Sum", slug: "minimum-path-sum", leetcodeNum: 64, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming", "Matrix"] },
            { title: "Unique Paths II", slug: "unique-paths-ii", leetcodeNum: 63, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming", "Matrix"] },
            { title: "Longest Palindromic Subsequence", slug: "longest-palindromic-subsequence", leetcodeNum: 516, difficulty: "MEDIUM", tags: ["String", "Dynamic Programming"] },
            { title: "Best Time to Buy and Sell Stock with Transaction Fee", slug: "best-time-to-buy-and-sell-stock-with-transaction-fee", leetcodeNum: 714, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming", "Greedy"] },
            { title: "0/1 Knapsack (Ones and Zeroes)", slug: "ones-and-zeroes", leetcodeNum: 474, difficulty: "MEDIUM", tags: ["Array", "String", "Dynamic Programming"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 16. GREEDY
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Greedy", slug: "greedy", order: 16,
        problems: [
            { title: "Jump Game", slug: "jump-game", leetcodeNum: 55, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming", "Greedy"] },
            { title: "Jump Game II", slug: "jump-game-ii", leetcodeNum: 45, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming", "Greedy"] },
            { title: "Gas Station", slug: "gas-station", leetcodeNum: 134, difficulty: "MEDIUM", tags: ["Array", "Greedy"] },
            { title: "Hand of Straights", slug: "hand-of-straights", leetcodeNum: 846, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "Greedy", "Sorting"] },
            { title: "Assign Cookies", slug: "assign-cookies", leetcodeNum: 455, difficulty: "EASY", tags: ["Array", "Two Pointers", "Greedy", "Sorting"] },
            { title: "Lemonade Change", slug: "lemonade-change", leetcodeNum: 860, difficulty: "EASY", tags: ["Array", "Greedy"] },
            { title: "Valid Parenthesis String", slug: "valid-parenthesis-string", leetcodeNum: 678, difficulty: "MEDIUM", tags: ["String", "Dynamic Programming", "Stack", "Greedy"] },
            { title: "Partition Labels", slug: "partition-labels", leetcodeNum: 763, difficulty: "MEDIUM", tags: ["Hash Table", "Two Pointers", "String", "Greedy"] },
            { title: "Queue Reconstruction by Height", slug: "queue-reconstruction-by-height", leetcodeNum: 406, difficulty: "MEDIUM", tags: ["Array", "Greedy", "Sorting"] },
            { title: "Minimum Platforms (Best Time for Meetings)", slug: "meeting-rooms-ii-min-platforms", leetcodeNum: 253, difficulty: "MEDIUM", tags: ["Array", "Two Pointers", "Greedy", "Sorting", "Heap"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 17. INTERVALS
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Intervals", slug: "intervals", order: 17,
        problems: [
            { title: "Insert Interval", slug: "insert-interval", leetcodeNum: 57, difficulty: "MEDIUM", tags: ["Array"] },
            { title: "Merge Intervals", slug: "merge-intervals", leetcodeNum: 56, difficulty: "MEDIUM", tags: ["Array", "Sorting"] },
            { title: "Non-overlapping Intervals", slug: "non-overlapping-intervals", leetcodeNum: 435, difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming", "Greedy", "Sorting"] },
            { title: "Minimum Number of Arrows to Burst Balloons", slug: "minimum-number-of-arrows-to-burst-balloons", leetcodeNum: 452, difficulty: "MEDIUM", tags: ["Array", "Greedy", "Sorting"] },
            { title: "Interval List Intersections", slug: "interval-list-intersections", leetcodeNum: 986, difficulty: "MEDIUM", tags: ["Array", "Two Pointers"] },
            { title: "Remove Covered Intervals", slug: "remove-covered-intervals", leetcodeNum: 1288, difficulty: "MEDIUM", tags: ["Array", "Sorting"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 18. MATH & GEOMETRY
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Math & Geometry", slug: "math-and-geometry", order: 18,
        problems: [
            { title: "Happy Number", slug: "happy-number", leetcodeNum: 202, difficulty: "EASY", tags: ["Hash Table", "Math", "Two Pointers"] },
            { title: "Plus One", slug: "plus-one", leetcodeNum: 66, difficulty: "EASY", tags: ["Array", "Math"] },
            { title: "Pow(x, n)", slug: "powx-n-math", leetcodeNum: 50, difficulty: "MEDIUM", tags: ["Math", "Recursion"] },
            { title: "Multiply Strings", slug: "multiply-strings", leetcodeNum: 43, difficulty: "MEDIUM", tags: ["Math", "String", "Simulation"] },
            { title: "Detect Squares", slug: "detect-squares", leetcodeNum: 2013, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "Design", "Counting"] },
            { title: "Robot Bounded In Circle", slug: "robot-bounded-in-circle", leetcodeNum: 1041, difficulty: "MEDIUM", tags: ["Math", "String", "Simulation"] },
            { title: "Excel Sheet Column Number", slug: "excel-sheet-column-number", leetcodeNum: 171, difficulty: "EASY", tags: ["Math", "String"] },
            { title: "Palindrome Number", slug: "palindrome-number", leetcodeNum: 9, difficulty: "EASY", tags: ["Math"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 19. BIT MANIPULATION
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Bit Manipulation", slug: "bit-manipulation", order: 19,
        problems: [
            { title: "Single Number", slug: "single-number", leetcodeNum: 136, difficulty: "EASY", tags: ["Array", "Bit Manipulation"] },
            { title: "Number of 1 Bits", slug: "number-of-1-bits", leetcodeNum: 191, difficulty: "EASY", tags: ["Divide and Conquer", "Bit Manipulation"] },
            { title: "Counting Bits", slug: "counting-bits", leetcodeNum: 338, difficulty: "EASY", tags: ["Dynamic Programming", "Bit Manipulation"] },
            { title: "Reverse Bits", slug: "reverse-bits", leetcodeNum: 190, difficulty: "EASY", tags: ["Divide and Conquer", "Bit Manipulation"] },
            { title: "Missing Number", slug: "missing-number", leetcodeNum: 268, difficulty: "EASY", tags: ["Array", "Hash Table", "Math", "Binary Search", "Bit Manipulation", "Sorting"] },
            { title: "Sum of Two Integers", slug: "sum-of-two-integers", leetcodeNum: 371, difficulty: "MEDIUM", tags: ["Math", "Bit Manipulation"] },
            { title: "Power of Two", slug: "power-of-two", leetcodeNum: 231, difficulty: "EASY", tags: ["Math", "Bit Manipulation", "Recursion"] },
            { title: "Single Number II", slug: "single-number-ii", leetcodeNum: 137, difficulty: "MEDIUM", tags: ["Array", "Bit Manipulation"] },
            { title: "Single Number III", slug: "single-number-iii", leetcodeNum: 260, difficulty: "MEDIUM", tags: ["Array", "Bit Manipulation"] },
            { title: "Subsets (Bitmask)", slug: "subsets-bitmask", leetcodeNum: 78, difficulty: "MEDIUM", tags: ["Array", "Backtracking", "Bit Manipulation"] },
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 20. STRINGS
    // ═══════════════════════════════════════════════════════════════════════
    {
        name: "Strings", slug: "strings", order: 20,
        problems: [
            { title: "Reverse Words in a String", slug: "reverse-words-in-a-string", leetcodeNum: 151, difficulty: "MEDIUM", tags: ["Two Pointers", "String"] },
            { title: "Longest Common Prefix", slug: "longest-common-prefix", leetcodeNum: 14, difficulty: "EASY", tags: ["String", "Trie"] },
            { title: "Roman to Integer", slug: "roman-to-integer", leetcodeNum: 13, difficulty: "EASY", tags: ["Hash Table", "Math", "String"] },
            { title: "Integer to Roman", slug: "integer-to-roman", leetcodeNum: 12, difficulty: "MEDIUM", tags: ["Hash Table", "Math", "String"] },
            { title: "String to Integer (atoi)", slug: "string-to-integer-atoi", leetcodeNum: 8, difficulty: "MEDIUM", tags: ["String"] },
            { title: "Longest Palindromic Substring", slug: "longest-palindromic-substring-str", leetcodeNum: 5, difficulty: "MEDIUM", tags: ["String", "Dynamic Programming"] },
            { title: "Isomorphic Strings", slug: "isomorphic-strings", leetcodeNum: 205, difficulty: "EASY", tags: ["Hash Table", "String"] },
            { title: "Count and Say", slug: "count-and-say", leetcodeNum: 38, difficulty: "MEDIUM", tags: ["String"] },
            { title: "Zigzag Conversion", slug: "zigzag-conversion", leetcodeNum: 6, difficulty: "MEDIUM", tags: ["String"] },
            { title: "Find the Index of the First Occurrence in a String", slug: "find-the-index-of-the-first-occurrence-in-a-string", leetcodeNum: 28, difficulty: "EASY", tags: ["Two Pointers", "String", "String Matching"] },
            { title: "Repeated DNA Sequences", slug: "repeated-dna-sequences", leetcodeNum: 187, difficulty: "MEDIUM", tags: ["Hash Table", "String", "Bit Manipulation", "Sliding Window"] },
            { title: "Group Anagrams", slug: "group-anagrams-str", leetcodeNum: 49, difficulty: "MEDIUM", tags: ["Array", "Hash Table", "String", "Sorting"] },
            { title: "Minimum Remove to Make Valid Parentheses", slug: "minimum-remove-to-make-valid-parentheses", leetcodeNum: 1249, difficulty: "MEDIUM", tags: ["String", "Stack"] },
            { title: "Largest Odd Number in String", slug: "largest-odd-number-in-string", leetcodeNum: 1903, difficulty: "EASY", tags: ["Math", "String", "Greedy"] },
        ]
    },
];

// ─── MAIN ───────────────────────────────────────────────────────────────
async function main() {
    console.log("🚀 Seeding comprehensive DSA Sheet (250+)...\n");

    // 1. Clear existing data
    console.log("🗑️  Clearing existing data...");
    await prisma.testCase.deleteMany({});
    await prisma.submission.deleteMany({});
    await prisma.userProgress.deleteMany({});
    await prisma.problem.deleteMany({});
    await prisma.subtopic.deleteMany({});
    await prisma.topic.deleteMany({});
    console.log("   ✅ Database cleared.\n");

    let totalProblems = 0;

    for (const topicDef of TOPICS) {
        // 2. Create topic
        const topic = await prisma.topic.create({
            data: {
                name: topicDef.name,
                slug: topicDef.slug,
                track: TrackType.DSA,
                order: topicDef.order,
            }
        });
        console.log(`📂 Topic: ${topicDef.name} (${topicDef.problems.length} problems)`);

        // 3. Create problems under this topic
        for (let i = 0; i < topicDef.problems.length; i++) {
            const prob = topicDef.problems[i];
            const scraped = SCRAPED_DATA[prob.slug];

            // Subtopic unique constraint is [topicId, slug]
            const subtopic = await prisma.subtopic.upsert({
                where: {
                    topicId_slug: {
                        topicId: topic.id,
                        slug: `${topic.slug}-default`
                    }
                },
                update: {},
                create: {
                    name: `${topic.name} Problems`,
                    slug: `${topic.slug}-default`,
                    order: 1,
                    topicId: topic.id,
                }
            });

            await prisma.problem.create({
                data: {
                    title: prob.title,
                    slug: prob.slug,
                    difficulty: prob.difficulty,
                    trackType: TrackType.DSA,
                    platformSource: PlatformSource.LEETCODE,
                    platformUrl: `https://leetcode.com/problems/${prob.slug}/`,
                    description: prob.description || scraped?.description || `Solve this problem on LeetCode: ${prob.title}`,
                    constraints: prob.constraints || scraped?.constraints || "See LeetCode for constraints and examples.",
                    boilerplate: prob.boilerplate || scraped?.boilerplate || null,
                    tags: JSON.stringify(prob.tags),
                    examples: JSON.stringify([]),
                    topicId: topic.id,
                    subtopicId: subtopic.id,
                    isPublished: true,
                    order: i + 1,
                }
            });
            totalProblems++;
        }
    }

    console.log(`\n🎉 Done! Created ${TOPICS.length} topics and ${totalProblems} problems.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
