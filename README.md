# openemis-mcp

MCP server that wraps the OpenEMIS v5 REST API, providing Claude access to OpenEMIS data through a standard Model Context Protocol interface.

## Installation

```bash
npm install
npm run build
```

## Usage

### Start the server
```bash
npm start
```

### Development mode
```bash
npm run dev
```

## Configuration

Set these environment variables (or create a `.env` file from `.env.example`):

- `OPENEMIS_BASE_URL` — Base URL for OpenEMIS API (default: `https://demo.openemis.org/core`)
- `OPENEMIS_BEARER` — Bearer token for authenticated requests (optional; required for mutations)
- `OPENEMIS_MANIFEST_PATH` — Path to `manifest.jsonl` describing endpoints (default: `/Users/khindol/webstore/utils/mcp-openemis-gen/manifest.jsonl`)
- `OPENEMIS_TIMEOUT_MS` — Request timeout in ms (default: `30000`)

## Architecture

The server provides:
- **OpenemisClient** — Fetch-based HTTP wrapper with automatic API versioning
- **Tool stubs** — CRUD, search, and describe tools (filled by other workers)
- **Health check** — Verify OpenEMIS reachability

Other workers will implement query builders and tool handlers in `src/tools/crud.ts` and `src/tools/describe.ts`.
