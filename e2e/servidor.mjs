// Serve o app compilado para o Playwright. Funciona com a saída antiga (dist/angular-pokedex)
// e com a do builder novo do Angular (dist/angular-pokedex/browser).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const saida = 'dist/angular-pokedex';
const raiz = existsSync(join(saida, 'browser')) ? join(saida, 'browser') : saida;
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ico': 'image/x-icon', '.svg': 'image/svg+xml' };

createServer(async (pedido, resposta) => {
  const caminho = normalize(decodeURIComponent(new URL(pedido.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  const arquivo = existsSync(join(raiz, caminho)) && extname(caminho) ? join(raiz, caminho) : join(raiz, 'index.html');
  resposta.writeHead(200, { 'Content-Type': TIPOS[extname(arquivo)] || 'application/octet-stream' });
  resposta.end(await readFile(arquivo));
}).listen(Number(process.env.PORTA || 4300));
