# Debug Session: share-image-export
- **Status**: [OPEN]
- **Issue**: A partilha do `PostCard` deixou de exportar imagem e está a cair para partilha apenas com texto.
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: .dbg/trae-debug-log-share-image-export.ndjson

## Reproduction Steps
1. Abrir a app no browser.
2. Clicar em `Partilhar` num post.
3. Verificar se a partilha/exportação gera um ficheiro PNG ou se cai para texto.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | `toPng(...)` falha ao capturar o template oculto de partilha. | High | Low | Pending |
| B | O avatar remoto ainda provoca erro de captura e aborta a geração da imagem. | High | Low | Pending |
| C | A captura gera ficheiro, mas `navigator.canShare({ files })` devolve falso e o fluxo cai no fallback. | Medium | Low | Pending |
| D | O nó referenciado por `statusShareRef` ou `squareShareRef` não está pronto/renderizado no momento do clique. | Medium | Low | Pending |
| E | O fallback é acionado por uma exceção genérica no `handleShare` diferente da captura da imagem. | Medium | Low | Pending |

## Log Evidence
- Pre-fix:
  - `handleShare started` com `hasSquareShareRef: true`
  - `captureShareImage invoked` com `clientWidth: 1568` e `clientHeight: 1008`
  - `toPng failed` com `errorMessage: "[object Event]"`
- Post-fix:
  - `captureShareImage invoked` com o mesmo nó de exportação
  - `toPng completed` com `dataUrlLength: 469334`
  - `share capability evaluated` com `fileSize: 351982`
  - Em ambiente desktop automatizado, `canShareFiles: false`, então o fluxo cai corretamente para download + WhatsApp link

## Verification Conclusion
- Hipótese A: **Confirmada no pre-fix** e **resolvida no post-fix**. O problema estava na captura do template de exportação.
- Hipótese B: **Confirmada**. O avatar remoto no template oculto fazia a captura falhar; a exportação passou a funcionar após usar avatar pré-carregado em `data:` URL no template de partilha.
- Hipótese C: **Rejeitada como causa raiz**. O fallback para download/WhatsApp observado no post-fix é o comportamento esperado quando `navigator.share`/`navigator.canShare({ files })` não está disponível.
- Hipótese D: **Rejeitada**. Os refs e dimensões do nó estavam corretos antes e depois.
- Hipótese E: **Rejeitada como causa raiz**. A exceção genérica vinha do erro da imagem durante o `toPng`.
