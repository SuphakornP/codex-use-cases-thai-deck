import unittest

from bs4 import BeautifulSoup

from scripts.scrape_official_use_cases import (
    extract_image_urls,
    extract_workflow,
    find_catalog_url,
    parse_cards,
)


class InventoryExtractionTests(unittest.TestCase):
    def list_soup(self, category: str = "data integrations knowledge-work") -> BeautifulSoup:
        return BeautifulSoup(
            '<a data-use-case-filter-link data-filter-value="data" data-filter-label="Data" '
            'href="/use-cases/all?category=data">Data</a>'
            '<a data-use-case-filter-link data-filter-value="integrations" data-filter-label="Integrations" '
            'href="/use-cases/all?category=integrations">Integrations</a>'
            '<a data-use-case-filter-link data-filter-value="knowledge-work" data-filter-label="Knowledge Work" '
            'href="/use-cases/all?category=knowledge-work">Knowledge Work</a>'
            '<a data-use-case-filter-link data-filter-value="data" data-filter-label="Wrong team label" '
            'href="/use-cases/all?team=data">Wrong team label</a>'
            '<a data-use-case-filter-link data-filter-value="workflow" data-filter-label="Workflow" '
            'href="/use-cases/all?task_type=workflow">Workflow</a>'
            f'<li data-codex-use-case-card data-category="{category}" data-task_type="workflow" '
            'data-sort-recommended-index="3">'
            '<a href="/use-cases/example"><span><span> Example title </span>'
            '<span> Example tagline. </span></span><svg></svg></a></li>',
            "html.parser",
        )

    def test_catalog_discovery_requires_the_actual_official_browse_link(self):
        soup = BeautifulSoup(
            '<nav><a href="/codex/use-cases/all">All use cases</a></nav>'
            '<main><a href="https://unrelated.example/use-cases/all">Browse all use cases</a>'
            '<a href="/use-cases/all">Browse all use cases</a></main>',
            "html.parser",
        )
        self.assertEqual(find_catalog_url(soup), "https://learn.chatgpt.com/use-cases/all")
        soup.select_one('main a[href="/use-cases/all"]').decompose()
        with self.assertRaisesRegex(RuntimeError, "no recognized Browse all"):
            find_catalog_url(soup)

    def test_list_rows_map_official_labels_and_preserve_evidenced_illustrations(self):
        landing = BeautifulSoup(
            '<img src="/codex/use-cases/example.webp">'
            '<img src="https://unrelated.example/codex/use-cases/untrusted.webp">',
            "html.parser",
        )
        images = extract_image_urls(landing)
        self.assertEqual(images, {"example": "https://learn.chatgpt.com/codex/use-cases/example.webp"})
        row = parse_cards(self.list_soup(), {}, images)[0]
        self.assertEqual(row["index"], 3)
        self.assertEqual(row["title"], "Example title")
        self.assertEqual(row["tagline"], "Example tagline.")
        self.assertEqual(row["tags"], ["Data", "Integrations"])
        self.assertEqual(row["imageUrl"], images["example"])
        self.assertEqual(parse_cards(self.list_soup(), {"example": row}, {}), [row])
        self.assertEqual(parse_cards(self.list_soup("data"), {}, images)[0]["tags"], ["Data", "Workflow"])

    def test_missing_source_mapping_fails_instead_of_guessing(self):
        with self.assertRaisesRegex(RuntimeError, "No evidenced illustration"):
            parse_cards(self.list_soup(), {}, {})
        with self.assertRaisesRegex(RuntimeError, "Unmapped official category"):
            parse_cards(self.list_soup("unknown"), {}, {"example": "https://learn.chatgpt.com/image.webp"})

    def test_legacy_cards_keep_their_original_fields(self):
        soup = BeautifulSoup(
            '<div data-codex-use-case-card data-sort-recommended-index="0">'
            '<a href="/use-cases/example"><img src="/codex/use-cases/example.webp">'
            '<h3>Example title</h3><p>Example tagline.</p><span>Data</span><span>Integrations</span>'
            '</a></div>',
            "html.parser",
        )
        row = parse_cards(soup, {}, {})[0]
        self.assertEqual(row["slug"], "example")
        self.assertEqual(row["tags"], ["Data", "Integrations"])
        self.assertEqual(row["imageUrl"], "https://learn.chatgpt.com/codex/use-cases/example.webp")


class WorkflowCodeExtractionTests(unittest.TestCase):
    def extract(self, content: str) -> tuple[BeautifulSoup, list[dict[str, object]]]:
        soup = BeautifulSoup(
            '<section><h2>Starter prompt</h2></section>'
            f'<section id="useCaseMarkdownContent">{content}</section>',
            "html.parser",
        )
        return soup, extract_workflow(soup, "Example workflow")

    def test_highlighted_code_excludes_line_number_ui_and_preserves_whitespace(self):
        soup, workflow = self.extract(
            '<pre><code><span class="syntax-highlighter-line-numbers" aria-hidden="true">'
            '<span class="syntax-highlighter-line-number">1<!-- -->\n</span>'
            '<span class="syntax-highlighter-line-number">2<!-- -->\n</span>'
            '<span class="syntax-highlighter-line-number">3</span></span>'
            '<span class="syntax-highlighter-line"><span class="shiki-token">let</span>'
            '<span class="shiki-token"> count = 123</span>\n</span>'
            '<span class="syntax-highlighter-line">\n</span>'
            '<span class="syntax-highlighter-line">  if count &lt; 200 { run() }\n</span>'
            '</code></pre>'
        )
        self.assertEqual(
            workflow[0]["codeBlocks"],
            ["let count = 123\n\n  if count < 200 { run() }\n"],
        )
        self.assertIsNotNone(soup.select_one(".syntax-highlighter-line-numbers"))
        self.assertEqual(extract_workflow(soup, "Example workflow"), workflow)

    def test_plain_and_legacy_highlighted_code_keep_literal_numbers_and_newlines(self):
        _, workflow = self.extract(
            '<pre>1\n2\n  3\n\n</pre>'
            '<pre><code><span class="line">log stream --predicate '
            '\'subsystem == "com.example.app" &amp;&amp; category == "Sidebar"\''
            '</span></code></pre>'
        )
        self.assertEqual(
            workflow[0]["codeBlocks"],
            [
                "1\n2\n  3\n\n",
                'log stream --predicate \'subsystem == "com.example.app" && category == "Sidebar"\'',
            ],
        )

    def test_other_hidden_or_numbered_spans_remain_code_content(self):
        _, workflow = self.extract(
            '<pre><code><span aria-hidden="true">hidden content\n</span>'
            '<span class="syntax-highlighter-line-numbers" aria-hidden="false">visible content\n</span>'
            '<span class="syntax-highlighter-line-numbers">ordinary content</span>'
            '</code></pre>'
        )
        self.assertEqual(
            workflow[0]["codeBlocks"],
            ["hidden content\nvisible content\nordinary content"],
        )


if __name__ == "__main__":
    unittest.main()
