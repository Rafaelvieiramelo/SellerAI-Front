# SellerAI — Design System

> Referência visual: Shopify Admin, Stripe Dashboard, Linear, Notion
> Plataformas: Web, Android, iOS
> Tema: Dark (primário), com suporte futuro a Light

---

## 1. Fundamentos

### 1.1 Princípios de Design

| Princípio | Descrição |
|-----------|-----------|
| **Clareza** | Informações hierarquizadas, sem ruído visual |
| **Produtividade** | Ações acessíveis em 1-2 toques/cliques |
| **Consistência** | Mesmos padrões em todas as telas |
| **Respiro** | Espaçamento generoso entre elementos |
| **Profissionalismo** | Visual SaaS confiável, sem ornamentos desnecessários |

---

## 2. Paleta de Cores

### 2.1 Cores Base (Backgrounds)

```
bg-primary:       #0B1120    — Fundo principal da aplicação
bg-surface:       #111827    — Cards, painéis, superfícies elevadas
bg-surface-hover: #1A2332    — Hover em cards e superfícies
bg-surface-active:#1E293B    — Estado ativo/pressed
bg-elevated:      #1E293B    — Modais, dropdowns, overlays
bg-overlay:       rgba(0, 0, 0, 0.60) — Backdrop de modais
bg-input:         #0F172A    — Fundo de inputs
bg-input-focus:   #111827    — Fundo de inputs com foco
```

### 2.2 Cores de Texto

```
text-primary:     #F8FAFC    — Títulos, texto principal
text-secondary:   #CBD5E1    — Corpo de texto, labels
text-tertiary:    #94A3B8    — Placeholders, metadados, hints
text-disabled:    #475569    — Texto desabilitado
text-inverse:     #0B1120    — Texto sobre fundo claro (badges)
```

### 2.3 Cores de Brando (Borders)

```
border-default:   #1E293B    — Bordas padrão
border-subtle:    #1A2332    — Bordas sutis, separadores
border-strong:    #334155    — Bordas destacadas
border-focus:     #3B82F6    — Borda de foco (azul)
border-error:     #EF4444    — Borda de erro
```

### 2.4 Cores de Acesso (Brand / Accent)

```
brand-primary:    #3B82F6    — Ações principais, links, foco
brand-hover:      #2563EB    — Hover em ações primárias
brand-active:     #1D4ED8    — Estado pressed
brand-subtle:     #1E3A5F    — Fundo de badges de marca
brand-text:       #93C5FD    — Texto sobre fundo brand
```

### 2.5 Cores de Status

```
/* Sucesso */
success:          #22C55E    — Ícones, bordas de sucesso
success-subtle:   #14532D    — Fundo de badges de sucesso
success-text:     #BBF7D0    — Texto de sucesso

/* Erro */
error:            #EF4444    — Ícones, bordas de erro
error-subtle:     #450A0A    — Fundo de badges de erro
error-text:       #FCA5A5    — Texto de erro

/* Aviso */
warning:          #F59E0B    — Ícones, bordas de aviso
warning-subtle:   #78350F    — Fundo de badges de aviso
warning-text:     #FCD34D    — Texto de aviso

/* Info */
info:             #3B82F6    — Ícones, bordas informativas
info-subtle:      #1E3A5F    — Fundo de badges info
info-text:        #93C5FD    — Texto informativo
```

### 2.6 Gradientes

```
gradient-brand:      linear-gradient(135deg, #3B82F6, #2563EB)
gradient-brand-hover: linear-gradient(135deg, #2563EB, #1D4ED8)
gradient-surface:    linear-gradient(180deg, #0B1120, #111827)
gradient-hero:       linear-gradient(135deg, #0B1120 0%, #1E293B 100%)
```

### 2.7 Mapa de Uso por Referência

| Referência | Onde usar |
|------------|-----------|
| **Shopify** | Bordas sutis, cards limpos, hierarquia de texto |
| **Stripe** | Gradientes de marca, badges de status, tabelas |
| **Linear** | Background profundo, hover states, badges compactos |
| **Notion** | Cards de conteúdo, tipografia limpa, espaçamento |

---

## 3. Tipografia

### 3.1 Fonte

| Plataforma | Fonte |
|------------|-------|
| Web | Inter (Google Fonts) — fallback: -apple-system, system-ui, sans-serif |
| Android | System default (Roboto) |
| iOS | System default (San Francisco) |

> **Nota:** Para Web, carregue Inter via `@expo-google-fonts/inter` ou link HTML.
> Em React Native, use `Platform.select()` para aplicar.

### 3.2 Escala de Tipografia

| Token | Tamanho | Peso | Line Height | Uso |
|-------|---------|------|-------------|-----|
| `display` | 30px | 700 | 36px | Títulos de hero, landing |
| `h1` | 24px | 700 | 32px | Títulos de página |
| `h2` | 20px | 600 | 28px | Títulos de seção |
| `h3` | 16px | 600 | 24px | Subtítulos, cards headers |
| `body-lg` | 16px | 400 | 24px | Corpo de texto grande |
| `body` | 14px | 400 | 20px | Corpo de texto padrão |
| `body-sm` | 13px | 400 | 18px | Texto auxiliar, metadados |
| `caption` | 12px | 400 | 16px | Legends, hints, timestamps |
| `overline` | 11px | 600 | 16px | Labels de categoria, badges |
| `mono` | 13px | 400 | 18px | Código, preços, valores |

### 3.3 Regras de Hierarquia

- **Títulos:** `text-primary`, peso 600-700
- **Corpo:** `text-secondary`, peso 400
- **Metadados:** `text-tertiary`, peso 400
- **Labels de seção (overline):** `brand-text` ou `text-tertiary`, peso 600, `uppercase`, `letterSpacing: 0.5`

---

## 4. Espaçamentos

### 4.1 Escala (Base: 4px)

| Token | Valor | Uso |
|-------|-------|-----|
| `space-0` | 0px | Reset |
| `space-1` | 4px | Ícones inline, gaps mínimos |
| `space-2` | 8px | Gaps entre elementos inline, padding mínimo |
| `space-3` | 12px | Padding interno de badges, gaps em rows |
| `space-4` | 16px | Padding padrão de cards, gaps entre fields |
| `space-5` | 20px | Padding de seções |
| `space-6` | 24px | Gap entre seções |
| `space-8` | 32px | Gap entre blocos grandes |
| `space-10` | 40px | Padding de páginas |
| `space-12` | 48px | Gap entre seções de página |
| `space-16` | 64px | Espaçamento de hero sections |

### 4.2 Regras

- **Horizontal padding de página:** `space-6` (24px) mobile, `space-10` (40px) desktop
- **Gap entre cards:** `space-4` (16px)
- **Padding interno de card:** `space-5` (20px)
- **Gap entre fields de formulário:** `space-5` (20px)
- **Gap entre seções:** `space-8` (32px)

---

## 5. Grid e Layout

### 5.1 Grid

```
Container maxWidth: 1200px
Columns: 12
Gutter: 16px (mobile), 24px (desktop)
Margin: 16px (mobile), auto (desktop)
```

### 5.2 Breakpoints

| Nome | Largura | Comportamento |
|------|---------|---------------|
| `mobile` | < 640px | 1 coluna, stack vertical |
| `tablet` | 640px - 1024px | 2 colunas, layout compacto |
| `desktop` | > 1024px | Layout completo, sidebar se aplicável |

### 5.3 Layout de Tela Padrão

```
┌─────────────────────────────────────────┐
│  Header / Navbar (56px)                 │
├─────────────────────────────────────────┤
│  Page Header (title + actions)          │
├─────────────────────────────────────────┤
│  Content Area                           │
│  ├── Sidebar (240px, desktop)           │
│  └── Main Content (fluid)               │
│      ├── Cards / Sections               │
│      ├── Tables                         │
│      └── Forms                          │
├─────────────────────────────────────────┤
│  Footer (opcional)                      │
└─────────────────────────────────────────┘
```

---

## 6. Componentes

### 6.1 Botões

#### Variações

| Variante | Background | Texto | Borda | Uso |
|----------|-----------|-------|-------|-----|
| **Primary** | `brand-primary` | `#FFFFFF` | 0 | Ação principal (salvar, gerar) |
| **Secondary** | transparent | `text-secondary` | `border-default` | Ações secundárias (cancelar, voltar) |
| **Ghost** | transparent | `text-secondary` | 0 | Ações terciárias (fechar, toggle) |
| **Danger** | `error-subtle` | `error-text` | 1px `error` | Excluir, ações destrutivas |
| **Success** | `success-subtle` | `success-text` | 1px `success` | Confirmar, aprovar |

#### Tamanhos

| Tamanho | Height | Padding H | Font Size | Border Radius |
|---------|--------|-----------|-----------|---------------|
| `sm` | 32px | 12px | 13px | 6px |
| `md` | 36px | 16px | 14px | 8px |
| `lg` | 40px | 20px | 14px | 8px |
| `xl` | 44px | 24px | 16px | 10px |

#### Estados

```
default  → bg normal, text normal
hover    → bg escurece 10%, cursor pointer
active   → bg escurece 15%, scale 0.98
disabled → bg #1E293B, text #475569, cursor not-allowed
loading  → text substituído por spinner, desabilitado
```

#### Ícones

- Ícone à esquerda: `marginRight: space-2`
- Ícone à direita: `marginLeft: space-2`
- Size do ícone: 16px

#### Exemplo Visual

```
┌─────────────────────┐
│  ● Gerar Anúncio    │  ← Primary (gradiente brand)
└─────────────────────┘
┌─────────────────────┐
│    Cancelar          │  ← Secondary (outline)
└─────────────────────┘
┌─────────────────────┐
│  🗑 Excluir          │  ← Danger
└─────────────────────┘
```

---

### 6.2 Inputs / Campos de Formulário

#### Estrutura

```
┌─────────────────────────────────┐
│ Label *                         │  ← body-sm, text-secondary, peso 500
│ ┌─────────────────────────────┐ │
│ │ 🔍 Placeholder...          │ │  ← body, text-tertiary
│ └─────────────────────────────┘ │
│ Helper text ou erro             │  ← caption
└─────────────────────────────────┘
```

#### Variações

| Variante | Borda | Fundo | Uso |
|----------|-------|-------|-----|
| **Default** | `border-default` | `bg-input` | Inputs padrão |
| **Filled** | 0 | `bg-surface` | Busca, filtros inline |
| **Flushed** | 0, 1px bottom | transparent | Em tabelas inline |

#### Tamanhos

| Tamanho | Height | Padding | Font Size |
|---------|--------|---------|-----------|
| `sm` | 32px | 8px 12px | 13px |
| `md` | 36px | 10px 14px | 14px |
| `lg` | 40px | 12px 16px | 14px |

#### Estados

```
default    → border-default, bg-input
hover      → border-strong
focus      → border-focus, ring brand-subtle, bg-input-focus
error      → border-error, error-subtle ring
disabled   → opacity 0.5, cursor not-allowed
```

#### Exemplo Visual

```
Label *
┌──────────────────────────────┐
│ digite seu email...          │
└──────────────────────────────┘
helper: nunca compartilhe sua senha
```

---

### 6.3 Select / Dropdown

```
Label
┌──────────────────────────── ▼ │
│ Opção selecionada             │
└──────────────────────────────┘
```

- Mesmas variações e estados dos Inputs
- Dropdown: `bg-elevated`, `border-default`, `border-radius: 8px`, `shadow-lg`
- Item hover: `bg-surface-hover`
- Item selecionado: `brand-subtle`, `brand-text`

---

### 6.4 Checkbox / Radio

```
┌───┐
│ ✓ │  ← 18x18, border-radius 4px, brand-primary quando checked
└───┘ Label

  ○   ← Radio: 18x18, border-radius 999px
  ●      checked: dot interno 8x8 brand-primary
```

- Estados: default, hover, checked, disabled, error

---

### 6.5 Cards

#### Card Padrão

```
┌──────────────────────────────────────┐
│                                      │
│  ┌──────┐  Título do Card            │
│  │ icon │  Subtítulo descritivo      │
│  └──────┘                            │
│                                      │
│  Conteúdo principal                  │
│                                      │
│  ──────────────────────────────────  │
│  Ações secundárias                   │
└──────────────────────────────────────┘

bg: bg-surface
border: 1px border-default
border-radius: 12px
padding: space-5 (20px)
shadow: none (ou shadow-sm em hover)
```

#### Card Interativo (Clicável)

```
Mesma base +
- hover: bg-surface-hover, border-strong, cursor pointer
- active: bg-surface-active
- transition: all 150ms ease
```

#### Card de Status / Badge

```
┌──────────┐
│ 245      │  ← display, text-primary
│ produtos │  ← caption, text-tertiary
└──────────┘

bg: bg-surface
border-radius: 8px
padding: space-4
```

---

### 6.6 Tabelas

#### Estrutura

```
┌──────────────────────────────────────────────────────┐
│ Nome              │ Preço     │ Status    │ Ações    │  ← Header
├──────────────────────────────────────────────────────┤
│ Produto Alpha     │ R$ 99,90  │ ● Ativo   │ ✏️ 🗑️  │  ← Row
├──────────────────────────────────────────────────────┤
│ Produto Beta      │ R$ 49,90  │ ● Inativo │ ✏️ 🗑️  │  ← Row (hover)
├──────────────────────────────────────────────────────┤
│                    │           │           │ ← 1 / 5 │  ← Footer
└──────────────────────────────────────────────────────┘
```

#### Especificações

| Elemento | Estilo |
|----------|--------|
| **Header** | `overline`, `text-tertiary`, `font-weight: 600`, `uppercase`, `letter-spacing: 0.5`, `border-bottom: 1px border-default` |
| **Row** | `body`, `text-secondary`, `border-bottom: 1px border-subtle` |
| **Row hover** | `bg-surface-hover` |
| **Row selected** | `bg-brand-subtle` |
| **Cell padding** | `12px 16px` |
| **Empty state** | `text-tertiary`, centered, com ícone e ação |

#### Responsividade

- **Desktop:** Tabela completa
- **Tablet:** Colunas menos relevantes ocultas
- **Mobile:** Cards empilhados (list view)

---

### 6.7 Modais / Dialogs

#### Estrutura

```
┌─── Backdrop (bg-overlay) ──────────────────────────┐
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │  ✕                                          │   │
│   │                                             │   │
│   │  Título do Modal                            │   │  ← h2
│   │                                             │   │
│   │  Conteúdo / corpo do modal.                 │   │  ← body
│   │  Texto descritivo ou formulário.            │   │
│   │                                             │   │
│   │  ─────────────────────────────────────────  │   │
│   │                                             │   │
│   │  [Cancelar]              [Confirmar]        │   │  ← actions
│   └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Especificações

| Elemento | Estilo |
|----------|--------|
| **Backdrop** | `bg-overlay`, blur 4px (web) |
| **Container** | `bg-surface`, `border-radius: 16px`, `max-width: 480px` |
| **Padding** | `space-6` (24px) |
| **Título** | `h2`, `text-primary` |
| **Corpo** | `body`, `text-secondary` |
| **Ações** | Flex row, `space-4` gap, `justify-content: flex-end` |
| **Close button** | Top-right, `ghost`, ícone X |

#### Tamanhos

| Tamanho | Max Width |
|---------|-----------|
| `sm` | 400px |
| `md` | 480px |
| `lg` | 640px |
| `xl` | 800px |

---

### 6.8 Toasts / Notificações

#### Posição

```
Top-right (desktop) / Top-center (mobile)
Espaçamento: 16px do topo e laterais
```

#### Variações

| Tipo | Ícone | Borda Left | Background |
|------|-------|------------|------------|
| **Success** | ✓ | `success` | `bg-elevated` |
| **Error** | ✕ | `error` | `bg-elevated` |
| **Warning** | ⚠ | `warning` | `bg-elevated` |
| **Info** | ℹ | `brand-primary` | `bg-elevated` |

#### Estrutura

```
┌─── ──────────────────────────────────────┐
│  ✓  Produto salvo com sucesso!     ✕     │
│      Detalhes opcionais da notificação   │
└──────────────────────────────────────────┘

bg: bg-elevated
border: 1px border-default
border-left: 3px [status-color]
border-radius: 8px
padding: 12px 16px
shadow: 0 4px 12px rgba(0,0,0,0.3)
```

#### Comportamento

- Auto-dismiss: 4s (success), 6s (error/warning), 8s (info)
- Animação: slide-in from right, fade-out
- Máximo 3 visíveis simultaneamente
- Stack: newest on top

---

### 6.9 Badges / Tags

```
┌──────────┐
│ Ativo     │  ← pill shape
└──────────┘

bg: status-subtle (conforme cor)
text: status-text
border-radius: 999px
padding: 2px 8px
font-size: 11px, font-weight: 600
```

#### Cores de Badge

| Status | Background | Texto |
|--------|-----------|-------|
| Ativo/Success | `success-subtle` | `success-text` |
| Inativo/Error | `error-subtle` | `error-text` |
| Pendente/Warning | `warning-subtle` | `warning-text` |
| Info/Neutral | `brand-subtle` | `brand-text` |

---

### 6.10 Tooltips

```
┌─────────────────────┐
│ Texto do tooltip     │  ← caption, text-inverse
└────────┬────────────┘
         ▽
```

- `bg: bg-elevated`
- `border: 1px border-default`
- `border-radius: 6px`
- `padding: 6px 10px`
- `shadow: 0 4px 8px rgba(0,0,0,0.3)`
- Posição: auto (top/bottom/left/right)
- Delay: 300ms

---

### 6.11 Loading / Skeleton

#### Spinner

```
┌───────────┐
│    ◌      │  ← 24x24, brand-primary, rotação contínua
│           │
└───────────┘
```

#### Skeleton Loader

```
┌──────────────────────────────────────┐
│ ████████████  ████████  ████████████ │  ← shimmer animation
│ ████████████████████████████████████ │
│ ██████████  ████████████████         │
└──────────────────────────────────────┘

bg: bg-surface
shimmer: linear-gradient 90deg, bg-surface 25%, bg-surface-hover 50%, bg-surface 75%
animation: 1.5s infinite
border-radius: 4px
```

---

### 6.12 Tabs / Navegação Secundária

```
┌───────┬──────────┬──────────┐
│ Geral │ Produtos │ Anúncios │
└───────┴──────────┴──────────┘

Tab ativa:   border-bottom 2px brand-primary, text-primary
Tab inativa: text-tertiary, hover text-secondary
Background:  transparent
Padding:     12px 16px por tab
Font:        body-sm, font-weight 500
```

---

### 6.13 Pagination

```
← Anterior    1  2  3  ...  12    Próximo →

Botão: secondary, sm
Página ativa: bg-brand-primary, text white, border-radius 6px
Página inativa: text-secondary, hover bg-surface-hover
```

---

### 6.14 Dividers / Separadores

```
Horizontal:
──────────────────────────
border-top: 1px border-subtle
margin: space-4 0

Vertical:
│
height: 20px
border-left: 1px border-subtle
margin: 0 space-3
```

---

## 7. Sombras

| Nível | CSS | Uso |
|-------|-----|-----|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.2)` | Inputs, badges |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)` | Cards em repouso |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.15)` | Dropdowns, tooltips |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.15)` | Modais |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.35), 0 8px 10px rgba(0,0,0,0.2)` | Modais grandes |

---

## 8. Bordas e Border Radius

### 8.1 Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-none` | 0 | — |
| `radius-sm` | 4px | Checkboxes, small indicators |
| `radius-md` | 6px | Tooltips, pagination buttons |
| `radius-lg` | 8px | Inputs, buttons, badges |
| `radius-xl` | 12px | Cards |
| `radius-2xl` | 16px | Modais, large cards |
| `radius-full` | 999px | Pills, avatars, tags |

### 8.2 Bordas Padrão

| Contexto | Estilo |
|----------|--------|
| Cards | `1px solid border-default` |
| Inputs | `1px solid border-default` |
| Botões secondary | `1px solid border-default` |
| Separadores | `1px solid border-subtle` |
| Tabelas header | `1px solid border-default` |
| Tabelas rows | `1px solid border-subtle` |

---

## 9. Animações e Transições

### 9.1 Transições Padrão

| Propriedade | Duração | Easing |
|-------------|---------|--------|
| Colors | 150ms | ease-in-out |
| Transform | 150ms | ease-out |
| Opacity | 200ms | ease-in-out |
| Shadow | 200ms | ease-in-out |

### 9.2 Animações

| Animação | Propriedade | Duração | Uso |
|----------|-------------|---------|-----|
| Fade in | opacity 0→1 | 200ms | Modal, toast |
| Fade out | opacity 1→0 | 150ms | Toast dismiss |
| Slide up | translateY 10px→0 | 200ms | Modal, dropdown |
| Slide in right | translateX 20px→0 | 250ms | Toast |
| Scale | scale 0.98→1 | 150ms | Button press |
| Shimmer | background-position | 1.5s loop | Skeleton |
| Pulse | opacity 0.5→1 | 2s loop | Loading |

---

## 10. Ícones

### 10.1 Biblioteca

Usar **Lucide Icons** (`lucide-react-native`) — leve, consistente, boa cobertura.

### 10.2 Tamanhos

| Contexto | Tamanho |
|----------|---------|
| Ícone em botão | 16px |
| Ícone em input | 16px |
| Ícone em card header | 20px |
| Ícone de status | 16px |
| Ícone de página | 24px |
| Ícone hero/decorativo | 32px |

### 10.3 Cores

- Ícone herda cor do texto circundante
- Ícone de ação: `text-tertiary`, hover `text-secondary`
- Ícone de status: cor do status correspondente

---

## 11. Responsividade

### 11.1 Estratégia

| Breakpoint | Comportamento |
|------------|---------------|
| **Mobile (< 640px)** | 1 coluna, stack vertical, cards full-width, tabela vira lista |
| **Tablet (640-1024px)** | 2 colunas, layout adaptativo |
| **Desktop (> 1024px)** | Layout completo, 12 colunas |

### 11.2 Adaptacoes

| Componente | Mobile | Desktop |
|------------|--------|---------|
| Sidebar | Drawer/Bottom sheet | Fixa 240px |
| Tabela | Cards empilhados | Tabela completa |
| Modal | Full-screen ou bottom sheet | Centered dialog |
| Cards | Full-width, stack | Grid 2-3 colunas |
| Pagination | Simplificada | Completa |
| Formulários | 1 coluna | 2 colunas |

---

## 12. Tokens de Tema (Implementacao)

### 12.1 Estrutura do Arquivo

```
src/theme/
├── colors.ts        — Paleta de cores
├── typography.ts    — Fontes e estilos de texto
├── spacing.ts       — Escala de espaçamentos
├── radii.ts         — Border radius
├── shadows.ts       — Sombras
├── breakpoints.ts   — Breakpoints
├── index.ts         — Exporta tudo como theme
└── ThemeProvider.tsx — Context provider (opcional)
```

### 12.2 Exemplo: colors.ts

```typescript
export const colors = {
  // Backgrounds
  bgPrimary: '#0B1120',
  bgSurface: '#111827',
  bgSurfaceHover: '#1A2332',
  bgSurfaceActive: '#1E293B',
  bgElevated: '#1E293B',
  bgOverlay: 'rgba(0, 0, 0, 0.60)',
  bgInput: '#0F172A',
  bgInputFocus: '#111827',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textDisabled: '#475569',
  textInverse: '#0B1120',

  // Borders
  borderDefault: '#1E293B',
  borderSubtle: '#1A2332',
  borderStrong: '#334155',
  borderFocus: '#3B82F6',
  borderError: '#EF4444',

  // Brand
  brandPrimary: '#3B82F6',
  brandHover: '#2563EB',
  brandActive: '#1D4ED8',
  brandSubtle: '#1E3A5F',
  brandText: '#93C5FD',

  // Status
  success: '#22C55E',
  successSubtle: '#14532D',
  successText: '#BBF7D0',
  error: '#EF4444',
  errorSubtle: '#450A0A',
  errorText: '#FCA5A5',
  warning: '#F59E0B',
  warningSubtle: '#78350F',
  warningText: '#FCD34D',
  info: '#3B82F6',
  infoSubtle: '#1E3A5F',
  infoText: '#93C5FD',
} as const;
```

### 12.3 Exemplo: typography.ts

```typescript
import { Platform } from 'react-native';

const fontFamily = Platform.select({
  web: '"Inter", -apple-system, system-ui, sans-serif',
  android: 'Roboto',
  ios: 'System',
});

export const typography = {
  fontFamily,
  display: { fontSize: 30, lineHeight: 36, fontWeight: '700' as const },
  h1: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  h2: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  h3: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
  bodyLg: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  bodySm: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  overline: { fontSize: 11, lineHeight: 16, fontWeight: '600' as const, letterSpacing: 0.5 },
  mono: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
} as const;
```

### 12.4 Exemplo: spacing.ts

```typescript
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;
```

---

## 13. Exemplos de Composição

### 13.1 Tela de Login

```
┌─────────────────────────────────────┐
│                                     │
│     bg-primary (gradient hero)      │
│                                     │
│        ┌───────────────────┐        │
│        │      SellerAI     │        │  ← display, brand-text
│        │     ● AI Badge    │        │  ← pill, brand-subtle
│        │                   │        │
│        │ Email *           │        │
│        │ ┌───────────────┐ │        │
│        │ │ email@...     │ │        │  ← input, md
│        │ └───────────────┘ │        │
│        │                   │        │
│        │ Senha *           │        │
│        │ ┌───────────────┐ │        │
│        │ │ ••••••••       │ │        │  ← input, md
│        │ └───────────────┘ │        │
│        │                   │        │
│        │ [Entrar]          │        │  ← button primary, xl, full-width
│        │                   │        │
│        │ ─── ou ───        │        │  ← divider
│        │                   │        │
│        │ [G] Google        │        │  ← button secondary, xl
│        │                   │        │
│        │ Não tem conta?    │        │  ← caption, text-tertiary
│        │ Registrar         │        │  ← link, brand-text
│        └───────────────────┘        │  ← card, bg-surface, radius-2xl
│                                     │
└─────────────────────────────────────┘
```

### 13.2 Tela Principal (Produtos)

```
┌──────────────────────────────────────────────────┐
│  SellerAI    Produtos    Anúncios    Config      │  ← header
├──────────────────────────────────────────────────┤
│                                                  │
│  Produtos                           [+ Novo]     │  ← h1 + primary button
│                                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │  ← stats cards grid
│  │ 245  │ │ 18   │ │ 92%  │ │ R$45 │           │
│  │ total│ │ ativos│ │ SEO  │ │ margem│           │
│  └──────┘ └──────┘ └──────┘ └──────┘           │
│                                                  │
│  🔍 Buscar produto...          Filtros ▼         │  ← search + filters
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │ ☐ Nome      │ Preço   │ Status  │ Ações     ││  ← table header
│  ├──────────────────────────────────────────────┤│
│  │ ☐ Alpha     │ R$99,90 │ ● Ativo │ ✏️ 🗑️   ││  ← table row
│  │ ☐ Beta      │ R$49,90 │ ● Ativo │ ✏️ 🗑️   ││  ← table row
│  │ ☐ Gamma     │ R$29,90 │ ● Inati.│ ✏️ 🗑️   ││  ← table row
│  ├──────────────────────────────────────────────┤│
│  │ ← 1  2  3  ...  25  →                       ││  ← pagination
│  └──────────────────────────────────────────────┘│
│                                                  │
│  [Gerar Anúncio com IA]  ← só aparece com选択   │  ← primary button, fixed bottom
│                                                  │
└──────────────────────────────────────────────────┘
```

### 13.3 Modal de Confirmação

```
        ┌─── Backdrop (overlay + blur) ───┐
        │                                 │
        │   ┌─────────────────────────┐   │
        │   │  ✕                      │   │
        │   │                         │   │
        │   │  Excluir produto        │   │  ← h2
        │   │                         │   │
        │   │  Tem certeza que deseja  │   │  ← body, text-secondary
        │   │  excluir "Produto Alpha"│   │
        │   │  Esta ação não pode ser  │   │
        │   │  desfeita.              │   │
        │   │                         │   │
        │   │  ─────────────────────  │   │  ← divider
        │   │                         │   │
        │   │  [Cancelar] [Excluir]   │   │  ← secondary + danger
        │   └─────────────────────────┘   │
        │                                 │
        └─────────────────────────────────┘
```

---

## 14. Checklist de Implementacao

- [ ] Criar `src/theme/colors.ts`
- [ ] Criar `src/theme/typography.ts`
- [ ] Criar `src/theme/spacing.ts`
- [ ] Criar `src/theme/radii.ts`
- [ ] Criar `src/theme/shadows.ts`
- [ ] Criar `src/theme/breakpoints.ts`
- [ ] Criar `src/theme/index.ts`
- [ ] Criar componentes reutilizáveis:
  - [ ] `Button` (5 variações × 4 tamanhos)
  - [ ] `Input` (3 variações × 3 tamanhos)
  - [ ] `Select`
  - [ ] `Checkbox` / `Radio`
  - [ ] `Card`
  - [ ] `Table` (+ TableHeader, TableRow, TablePagination)
  - [ ] `Modal` / `Dialog`
  - [ ] `Toast` (+ ToastProvider)
  - [ ] `Badge`
  - [ ] `Tooltip`
  - [ ] `Tabs`
  - [ ] `Divider`
  - [ ] `Skeleton`
  - [ ] `Spinner`
- [ ] Migrar telas existentes para usar tokens e componentes
- [ ] Instalar Inter (web) e Lucide icons

---

## 15. Decisoes Tecnicas

| Decisão | Justificativa |
|---------|---------------|
| **Theme tokens centralizados** | Elimina duplicação de hex values em 18+ arquivos |
| **Inter no web** | Fonte SaaS padrão (Shopify, Vercel, Linear usam) |
| **Lucide Icons** | Leve, consistente, bom suporte RN |
| **Border radius maiores (12-16px)** | Visual moderno, similar Linear/Stripe |
| **Espaçamento 4px base** | Grid consistente, fácil de compor |
| **Badges pill (999px)** | Padrão SaaS moderno |
| **Shadows sutis** | Dark theme: sombras fortes ficam ruins |
| **Animações 150-200ms** | Rápido o suficiente para ser responsivo, lento o suficiente para ser perceptível |
| **Sem CSS/Tailwind** | Manter compatibilidade com RN StyleSheet existente |

---

> **Status:** Proposta — Aguardando aprovação antes da implementação.
> **Próximo passo:** Revisar, ajustar, e implementar tokens + componentes.
