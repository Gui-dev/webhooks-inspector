# Testes Unitários Frontend - Implementation Plan

> **Para agentes:** Use a skill `subagent-driven-development` (recomendado) ou `executing-plans` para implementar tarefa por tarefa. Marque checkbox (`- [ ]`) ao completar.

**Goal:** Configurar infraestrutura de testes e implementar testes unitários para componentes React do frontend.

**Architecture:** Adicionar Vitest + Testing Library ao projeto, criar configuração base, e implementar testes para componentes UI em ordem de complexidade.

**Tech Stack:** Vitest, @testing-library/react, @testing-library/jest-dom, jsdom

---

## Task 1: Configurar infraestrutura de testes

**Files:**
- Modify: `apps/web/package.json:1-41`
- Create: `apps/web/vitest.config.ts`

- [ ] **Step 1: Adicionar dependências de teste no package.json**

Adicionar em `devDependencies`:
```json
"vitest": "^3.1.0",
"@testing-library/react": "^16.1.0",
"@testing-library/jest-dom": "^6.6.3",
"@testing-library/user-event": "^14.5.2",
"jsdom": "^26.1.0"
```

- [ ] **Step 2: Criar arquivo de configuração vitest.config.ts**

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), tanstackRouter({ target: 'react' })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

- [ ] **Step 3: Criar arquivo setup de testes em src/test/setup.ts**

```typescript
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Adicionar scripts de teste no package.json**

Adicionar em `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:ui": "vitest --ui"
```

- [ ] **Step 5: Instalar dependências**

Run: `pnpm install` na raiz

- [ ] **Step 6: Verificar configuração**

Run: `cd apps/web && pnpm test -- --run` (deve passar vazio ou mostrar que nenhum teste existe ainda)

---

## Task 2: Testar componente Badge

**Files:**
- Test: `apps/web/src/components/ui/badge.test.tsx`
- Modify: `apps/web/src/components/ui/badge.tsx:1-16`

- [ ] **Step 1: Escrever teste falhando**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('renderiza o children corretamente', () => {
    render(<Badge>POST</Badge>)
    expect(screen.getByText('POST')).toBeInTheDocument()
  })

  it('aplica classes CSS padrões', () => {
    const { container } = render(<Badge>Test</Badge>)
    const span = container.firstChild as HTMLElement
    expect(span).toHaveClass('rounded-lg', 'border', 'bg-zinc-800')
  })

  it('mescla className customizada', () => {
    const { container } = render(<Badge className="custom-class">Test</Badge>)
    const span = container.firstChild as HTMLElement
    expect(span).toHaveClass('custom-class')
    expect(span).toHaveClass('rounded-lg')
  })
})
```

- [ ] **Step 2: Rodar teste para verificar que funciona**

Run: `cd apps/web && pnpm test -- --run src/components/ui/badge.test.tsx`

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/ui/badge.test.tsx apps/web/vitest.config.ts apps/web/src/test/setup.ts apps/web/package.json
git commit -m "test: adicionar testes para Badge component"
```

---

## Task 3: Testar componente Checkbox

**Files:**
- Test: `apps/web/src/components/ui/checkbox.test.tsx`
- Modify: `apps/web/src/components/ui/checkbox.tsx:1-22`

- [ ] **Step 1: Escrever testes**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('renderiza sem quebrar', () => {
    const { container } = render(<Checkbox />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renderiza com children se fornecido', () => {
    render(<Checkbox>Label</Checkbox>)
    expect(screen.getByText('Label')).toBeInTheDocument()
  })

  it('chama onCheckedChange ao clicar', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox onCheckedChange={onCheckedChange} />)
    
    await user.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })
})
```

- [ ] **Step 2: Rodar testes**

Run: `cd apps/web && pnpm test -- --run src/components/ui/checkbox.test.tsx`

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/ui/checkbox.test.tsx
git commit -m "test: adicionar testes para Checkbox component"
```

---

## Task 4: Testar componente IconButton

**Files:**
- Test: `apps/web/src/components/ui/icon-button.test.tsx`
- Modify: `apps/web/src/components/ui/icon-button.tsx:1-28`

- [ ] **Step 1: Escrever testes**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IconButton } from './icon-button'
import { Trash2 } from 'lucide-react'

describe('IconButton', () => {
  it('renderiza o ícone fornecido', () => {
    render(<IconButton icon={<Trash2 data-testid="icon" />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('aplica variante de tamanho small', () => {
    const { container } = render(
      <IconButton icon={<Trash2 />} size="sm" />
    )
    const button = container.querySelector('button')
    expect(button).toHaveClass('size-6')
  })

  it('aplica variante de tamanho large', () => {
    const { container } = render(
      <IconButton icon={<Trash2 />} size="lg" />
    )
    const button = container.querySelector('button')
    expect(button).toHaveClass('size-10')
  })

  it('dispara onClick ao clicar', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<IconButton icon={<Trash2 />} onClick={onClick} />)
    
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })

  it('tem tipo button padrão', () => {
    const { container } = render(<IconButton icon={<Trash2 />} />)
    const button = container.querySelector('button')
    expect(button).toHaveAttribute('type', 'button')
  })
})
```

- [ ] **Step 2: Rodar testes**

Run: `cd apps/web && pnpm test -- --run src/components/ui/icon-button.test.tsx`

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/ui/icon-button.test.tsx
git commit -m "test: adicionar testes para IconButton component"
```

---

## Task 5: Testar componente SectionTitle

**Files:**
- Test: `apps/web/src/components/section-title.test.tsx`
- Modify: `apps/web/src/components/section-title.tsx:1-8`

- [ ] **Step 1: Escrever testes**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SectionTitle } from './section-title'

describe('SectionTitle', () => {
  it('renderiza children como título', () => {
    render(<SectionTitle>Meu Título</SectionTitle>)
    expect(screen.getByText('Meu Título')).toBeInTheDocument()
  })

  it('renderiza como elemento h3', () => {
    const { container } = render(<SectionTitle>Test</SectionTitle>)
    expect(container.querySelector('h3')).toBeInTheDocument()
  })

  it('aplica classes CSS padrões', () => {
    const { container } = render(<SectionTitle>Test</SectionTitle>)
    const h3 = container.querySelector('h3')
    expect(h3).toHaveClass('font-semibold', 'text-base', 'text-zinc-100')
  })

  it('mescla className customizada', () => {
    const { container } = render(
      <SectionTitle className="custom">Test</SectionTitle>
    )
    const h3 = container.querySelector('h3')
    expect(h3).toHaveClass('custom')
  })
})
```

- [ ] **Step 2: Rodar testes**

Run: `cd apps/web && pnpm test -- --run src/components/section-title.test.tsx`

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/section-title.test.tsx
git commit -m "test: adicionar testes para SectionTitle component"
```

---

## Task 6: Rodar todos os testes e verificar coverage

**Files:**
- N/A

- [ ] **Step 1: Rodar toda suíte de testes**

Run: `cd apps/web && pnpm test -- --run`

- [ ] **Step 2: Commit final**

```bash
git add .
git commit -m "test: configuração completa de testes unitários"
```

---

## Resumo de arquivos a criar/modificar

| Task | Arquivo | Ação |
|------|---------|------|
| 1 | `apps/web/package.json` | Modificar - adicionar deps e scripts |
| 1 | `apps/web/vitest.config.ts` | Criar |
| 1 | `apps/web/src/test/setup.ts` | Criar |
| 2 | `apps/web/src/components/ui/badge.test.tsx` | Criar |
| 3 | `apps/web/src/components/ui/checkbox.test.tsx` | Criar |
| 4 | `apps/web/src/components/ui/icon-button.test.tsx` | Criar |
| 5 | `apps/web/src/components/section-title.test.tsx` | Criar |