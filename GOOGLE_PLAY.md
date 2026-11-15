# Guia de publicação — Google Play (Portugal)

## O que já está pronto no repositório
- [x] App web/PWA funcional (lições, trilha, gamificação, VIP)
- [x] Preços VIP em euros (mensal **5,99 €**)
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
   - Preço Portugal: **5,99 EUR**
   - Opcional: `vip_yearly` a **49,99 EUR**
7. Gerar Android App Bundle (AAB) — ver secção Capacitor abaixo
8. Preencher Segurança dos dados, anúncios, classificação de conteúdo
9. Enviar para revisão

## Empacotar para Android (Capacitor) — no teu PC

> **Nota:** O Capacitor **ainda não está instalado neste repositório**. É uma ferramenta que corres no teu computador para transformar o site num app Android (.aab).

```bash
# Na pasta do projeto (depois de clonar o repo)
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "PolyWork" "com.polywork.app"
# Garante que os ficheiros web estão em www/ (ou webDir configurado)
npx cap add android
npx cap sync android
npx cap open android
# No Android Studio: Build > Generate Signed Bundle / APK
```

Para faturação real, integra Google Play Billing. Enquanto isso, o botão VIP no app continua em modo demo (ativa VIP localmente).

## Preços (EUR · Portugal)
| Produto | Preço | Notas |
|---------|-------|--------|
| VIP Mensal | **5,99 €** | Principal |
| VIP Anual | **49,99 €** | ~4,17 €/mês |

## Diferenciação vs apps atuais
- Assistente Nova interativa (não só um logo)
- Trilha visual + combos + ligas + baú
- Visual Play/Candy/Neon (público jovem e gamers)
