import axios from "axios";
import * as fs from "fs";
import * as path from "path";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ScrapedContent {
    description: string;
    constraints: string;
    boilerplate?: string; // JSON string: { LANG: "code" }
}

type ScrapedData = Record<string, ScrapedContent>;

// ─── Configuration ─────────────────────────────────────────────────────────

const OUTPUT_PATH = path.join(process.cwd(), "prisma", "seeds", "scraped_content.json");
const DSA_SEED_PATH = path.join(process.cwd(), "prisma", "seeds", "seed_dsa_sheet.ts");
const CP_SEED_PATH = path.join(process.cwd(), "prisma", "seeds", "seed_cp_sheet.ts");

// ─── Helpers ──────────────────────────────────────────────────────────────

function decodeHtml(html: string): string {
    if (!html) return "";
    return html
        .replace(/<sup>([\s\S]*?)<\/sup>/gi, "^$1")
        .replace(/<sub>([\s\S]*?)<\/sub>/gi, "_$1")
        .replace(/<code>([\s\S]*?)<\/code>/gi, "`$1`")
        .replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, "$1")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&ldquo;/g, "“")
        .replace(/&rdquo;/g, "”")
        .replace(/&lsquo;/g, "‘")
        .replace(/&rsquo;/g, "’")
        .replace(/&ndash;/g, "–")
        .replace(/&mdash;/g, "—")
        .replace(/&hellip;/g, "…")
        .replace(/&times;/g, "×")
        .replace(/&divide;/g, "÷")
        .replace(/&plusmn;/g, "±")
        .replace(/&le;/g, "≤")
        .replace(/&ge;/g, "≥")
        .replace(/&ne;/g, "≠")
        .replace(/&asymp;/g, "≈")
        .replace(/&infin;/g, "∞")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<p>/gi, "")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<li>/gi, "- ")
        .replace(/<\/li>/gi, "\n")
        .replace(/<[^>]+>/g, "") // Final strip tags
        .replace(/\n\s*\n\s*\n/g, "\n\n") // Collapse multiple newlines
        .trim();
}

// ─── Scrapers ──────────────────────────────────────────────────────────────

async function scrapeCodeforces(contestId: number, index: string): Promise<ScrapedContent | null> {
    const url = `https://codeforces.com/problemset/problem/${contestId}/${index}`;
    try {
        console.log(`🔍 Fetching Codeforces: ${url}`);
        const { data: html } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        // Codeforces sections are often marked with specific classes
        const statementMatch = html.match(/<div class="problem-statement">([\s\S]*?)<div class="sample-tests">/i);
        if (!statementMatch) {
            console.log(`  ⚠️ Could not find problem statement for ${contestId}${index}`);
            return null;
        }

        const fullHtml = statementMatch[1];

        // Extract sections
        // Description is everything from header to input-specification
        const descriptionMatch = fullHtml.match(/<\/div><div>([\s\S]*?)<\/div><div class="input-specification">/i)
            || fullHtml.match(/<\/div><div>([\s\S]*?)<\/div><div class="sample-tests">/i);

        const inputMatch = fullHtml.match(/<div class="input-specification">([\s\S]*?)<\/div><div class="output-specification">/i);
        const outputMatch = fullHtml.match(/<div class="output-specification">([\s\S]*?)<\/div>/i);

        // CP problems usually don't have problem-specific boilerplate on CF
        const defaultBoilerplate = {
            CPP: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // solve\n    return 0;\n}",
            PYTHON: "import sys\n\ndef solve():\n    pass\n\nif __name__ == '__main__':\n    solve()"
        };

        return {
            description: decodeHtml(descriptionMatch ? descriptionMatch[1] : "").trim(),
            constraints: (decodeHtml(inputMatch ? inputMatch[1] : "") + "\n\n" + decodeHtml(outputMatch ? outputMatch[1] : "")).trim(),
            boilerplate: JSON.stringify(defaultBoilerplate)
        };
    } catch (error) {
        console.error(`❌ CF ${contestId}${index} failed:`, (error as any).message);
        return null;
    }
}

async function scrapeLeetCode(slug: string): Promise<ScrapedContent | null> {
    const url = "https://leetcode.com/graphql";
    const query = `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        content
        codeSnippets {
          lang
          langSlug
          code
        }
      }
    }
    `;

    try {
        console.log(`🔍 Fetching LeetCode: ${slug}`);
        const response = await axios.post(url, {
            query,
            variables: { titleSlug: slug }
        }, {
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com"
            }
        });

        const q = response.data.data.question;
        if (!q?.content) return null;

        const parts = q.content.split(/<p><strong>Constraints:<\/strong><\/p>|<strong>Constraints:<\/strong>/i);

        const boilerplate: Record<string, string> = {};
        q.codeSnippets?.forEach((s: any) => {
            // Map common language slugs to our uppercase enum values if needed
            const lang = s.langSlug.toUpperCase().replace("-", "_");
            boilerplate[lang] = s.code;
        });

        return {
            description: decodeHtml(parts[0]).trim(),
            constraints: parts[1] ? decodeHtml(parts[1]).trim() : "See platform for constraints.",
            boilerplate: JSON.stringify(boilerplate)
        };
    } catch (error) {
        console.error(`❌ LC ${slug} failed:`, (error as any).message);
        return null;
    }
}

// ─── Slug Extraction ───────────────────────────────────────────────────────

function extractDsaSlugs(): string[] {
    const content = fs.readFileSync(DSA_SEED_PATH, "utf-8");
    const matches = content.matchAll(/slug:\s*"([^"]+)"/g);
    return Array.from(new Set(Array.from(matches).map(m => m[1])));
}

function extractCpSlugs(): { slug: string; contest: number; index: string }[] {
    const content = fs.readFileSync(CP_SEED_PATH, "utf-8");
    // Match the whole object block to be safer
    const problemBlocks = content.matchAll(/\{\s*title:[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?cfContest:\s*(\d+)[\s\S]*?cfIndex:\s*"([^"]+)"/g);
    return Array.from(problemBlocks).map(m => ({
        slug: m[1],
        contest: parseInt(m[2]),
        index: m[3]
    }));
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
    const existingData: ScrapedData = fs.existsSync(OUTPUT_PATH)
        ? JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"))
        : {};

    const dsaSlugs = extractDsaSlugs();
    const cpProblems = extractCpSlugs();

    console.log(`📊 Found ${dsaSlugs.length} DSA problems and ${cpProblems.length} CP problems.`);

    const BATCH_SIZE = 10;

    // Process DSA (LeetCode)
    console.log("\n🚀 Starting LeetCode scrape...");
    let dsaCount = 0;
    for (const slug of dsaSlugs) {
        // Only skip if boilerplate is already there
        if (existingData[slug]?.boilerplate) continue;

        const content = await scrapeLeetCode(slug);
        if (content) {
            existingData[slug] = content;
            dsaCount++;
            if (dsaCount % BATCH_SIZE === 0) {
                fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existingData, null, 2));
                console.log(`💾 Saved checkpoint (${dsaCount} total new)`);
            }
        }
        await new Promise(r => setTimeout(r, 600));
    }

    // Process CP (Codeforces)
    console.log("\n🚀 Starting Codeforces scrape...");
    let cpCount = 0;
    for (const prob of cpProblems) {
        const key = prob.slug;
        if (existingData[key]?.boilerplate) continue;

        const content = await scrapeCodeforces(prob.contest, prob.index);
        if (content) {
            existingData[key] = content;
            cpCount++;
            if (cpCount % BATCH_SIZE === 0) {
                fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existingData, null, 2));
                console.log(`💾 Saved checkpoint (${cpCount} total new)`);
            }
        }
        await new Promise(r => setTimeout(r, 600));
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existingData, null, 2));
    console.log(`\n✨ Scraping complete! Total entries: ${Object.keys(existingData).length}`);
}

main().catch(console.error);
