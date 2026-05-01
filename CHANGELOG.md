# Changelog

## 1.2.0 — 2026-04-25

- Added `render_product_list` — ChatGPT Apps SDK widget tool. Same inputs as `discover_products`; ChatGPT renders the result as an embedded visual product grid. Non-ChatGPT clients should continue to use `discover_products`.

## 1.1.0 — 2026-04-24

- Renamed `find_similar` → `find_similar_products` for symmetry with `find_similar_brands`.
- Added `discover_brands` — semantic search over brand profiles.
- Added `find_similar_brands` — find brands similar to a known brand by vector similarity.
- Removed `list_stores`. Use `discover_brands` or `get_filters({ fields: ["brands"] })` instead.

## 1.0.1 — 2026-04-11

- Fix typo in registry description (`e-ecom` → `e-commerce`).

## 1.0.0 — 2026-04-11

- Initial release.
- Published to the official MCP Registry as `io.github.vistoya/market`.
- Streamable HTTP endpoint at `https://api.vistoya.com/mcp`.
- Tools: `discover_products`, `find_similar`, `get_product`, `get_filters`, `list_stores`.
