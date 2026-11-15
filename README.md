# PolyWork

App de idiomas para o trabalho (inglês, francês, espanhol, mandarim e italiano).

Lições do **básico ao fluente**, estilo gamificado (XP, streak, ranks, conquistas), simulações de ligação, entrevistas e reuniões. Funciona como **PWA** (instalável na tela inicial).

## O que tem agora

- **Currículo expandido** organizado em unidades (Foundations → Daily Work → Meetings → Interviews → Fluent)
- 17 lições em inglês + 8 em cada outro idioma
- Simulações de ligação: colega, reunião, entrevista e cliente
- Foco forte em empregabilidade (entrevistas STAR, negociação, reuniões)
- Sistema de XP, ranks, badges e streak
- Temas personalizáveis
- PWA offline básico

## Arquivos

```
index.html              → app principal
manifest.webmanifest    → manifesto PWA
sw.js                   → service worker
icons/                  → ícones 192 / 512 / Apple
```

## Publicar no GitHub Pages

1. Settings → Pages → Source: branch `main`, pasta `/ (root)`
2. Abra: `https://ewertoncr.github.io/APPidiomas-`

> PWA e microfone precisam de **HTTPS** (GitHub Pages já fornece).

## Instalar como app

- **Android / Chrome:** banner “Instalar” ou menu → Instalar app  
- **iPhone:** Compartilhar → Adicionar à Tela de Início  

## Login Google

O botão Google atual é **simulado**. Progresso fica no `localStorage`.  
Para conta real + nuvem, use Supabase (Auth Google + tabela de progresso).

## Idiomas e temas

- Idiomas: EN · FR · ES · 中文 · IT  
- Temas: Ocean, Midnight, Forest, Sunset, Neo, Minimal (em Opções)
