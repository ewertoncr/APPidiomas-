# Guia de publicação — Google Play (Portugal)

## O que já está pronto no repositório
- [x] App web/PWA funcional (lições, trilha, gamificação, VIP)
- [x] Preços VIP em euros (mensal)
- [x] Política de privacidade (RGPD) → privacy-policy.html
- [x] Termos de utilização → terms.html
- [x] Texto da ficha da loja → STORE_LISTING.md
- [x] Manifest PWA atualizado
- [x] Ícones 192 / 512

## O que só tu podes fazer (conta Google)
1. Criar conta em https://play.google.com/console (taxa única US$ 25)
2. Se a conta for pessoal e criada após 13/11/2023: teste fechado com 12 testadores durante 14 dias
3. Criar a app "PolyWork"
4. Preencher ficha com STORE_LISTING.md (idioma: português de Portugal)
5. Associar privacy-policy.html e terms.html
6. Criar produto de subscrição:
   - ID: `vip_monthly`
   - Nome: PolyWork VIP Mensal
   - Preço Portugal: **2,99 EUR**
   - Opcional: `vip_yearly` a 24,99 EUR
7. Gerar Android App Bundle (AAB) — ver secção Capacitor abaixo
8. Preencher Segurança dos dados, anúncios, classificação de conteúdo
9. Enviar para revisão

## Empacotar para Android (Capacitor) — no teu PC

```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "PolyWork" "com.polywork.app"
# copiar index.html, css, js, icons para a pasta www/
npx cap add android
npx cap sync android
npx cap open android
# No Android Studio: Build > Generate Signed Bundle / APK
```

Para faturação real, integra Google Play Billing. Enquanto isso, o botão VIP no app continua em modo demo (ativa VIP localmente).

## Preços recomendados (EUR · Portugal)
| Produto | Preço | Notas |
|---------|-------|--------|
| VIP Mensal | 2,99 € | Principal |
| VIP Anual | 24,99 € | Melhor valor (~2,08 €/mês) |

## Diferenciação vs apps atuais
- Assistente Nova interativa (não só um logo)
- Trilha visual + combos + ligas + baú
- Preço mensal agressivo (2,99 €)
- Visual Play/Candy/Neon (público jovem e gamers)
