import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

// Équivalent de l'ancien .eslintrc.json ("next/core-web-vitals" + 2 règles désactivées).
// Next 16 a retiré `next lint` : le lint se lance maintenant avec `eslint .`.
export default defineConfig([
  ...nextVitals,
  {
    // même périmètre que le plugin react-hooks de eslint-config-next (sinon les scripts .cjs plantent le lint)
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
    rules: {
      '@next/next/no-img-element': 'off',
      'react/no-unescaped-entities': 'off',
      // Nouvelles règles « React Compiler » (eslint-plugin-react-hooks 7) : des conseils de style,
      // pas des bugs. En avertissement pour que la montée de version ne change pas le comportement ;
      // à traiter progressivement.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'node_modules/**', 'next-env.d.ts', 'public/**']),
])
