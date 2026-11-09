import unittest

from bs4 import BeautifulSoup

from scripts.scrape_official_use_cases import extract_workflow


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
