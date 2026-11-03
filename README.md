# PolyWork

App de idiomas para o trabalho (inglês, francês, espanhol, mandarim e italiano).

Lições, ligações por voz, XP, conquistas e temas. Funciona como **PWA** (instalável na tela inicial).

## Arquivos

```
index.html              → app principal
manifest.webmanifest    → manifesto PWA
sw.js                   → service worker (offline básico)
icons/                  → ícones 192 / 512 / Apple
```

## Publicar no GitHub Pages

1. Crie um repositório (ex.: `polywork`)
2. Envie estes arquivos na raiz (ou na branch `gh-pages`)
3. **Settings → Pages → Source**: branch `main`, pasta `/ (root)`
4. Abra o link: `https://SEU_USUARIO.github.io/polywork/`

> PWA e microfone precisam de **HTTPS** (GitHub Pages já fornece).

## Instalar como app

- **Android / Chrome:** o banner “Instalar” aparece, ou menu → Instalar app  
- **iPhone:** Compartilhar → Adicionar à Tela de Início  

## Login Google

O botão Google atual é **simulado**. Progresso fica no `localStorage` do aparelho.  
Para conta real + nuvem, use Supabase (Auth Google + tabela de progresso).

## Idiomas e temas

- Idiomas: EN · FR · ES · 中文 · IT  
- Temas: Ocean, Midnight, Forest, Sunset, Neo, Minimal (em Opções)
