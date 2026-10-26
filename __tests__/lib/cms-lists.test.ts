import { describe, it, expect } from 'vitest'
import {
  LIST_DEFS,
  parseItems,
  legacyItems,
  readList,
  serializeList,
  blankItem,
  moveListItem,
  setListItemField,
  duplicateListItem,
  removeListItem,
} from '@/lib/cms-lists'
import { FAQ_ITEMS } from '@/lib/cms-defaults/faq'

describe('parseItems', () => {
  it('retourne null quand la valeur est absente ou invalide', () => {
    expect(parseItems('')).toBeNull()
    expect(parseItems('   ')).toBeNull()
    expect(parseItems(undefined)).toBeNull()
    expect(parseItems('pas du json')).toBeNull()
    expect(parseItems('{"q":"x"}')).toBeNull()
  })

  it('lit un tableau d’objets et ignore les valeurs non textuelles', () => {
    expect(parseItems('[{"q":"a","a":"b"},{"q":1},null,"x"]')).toEqual([{ q: 'a', a: 'b' }, {}])
  })

  it('distingue une liste vidée volontairement d’une valeur absente', () => {
    expect(parseItems('[]')).toEqual([])
  })
})

describe('legacyItems', () => {
  const def = LIST_DEFS.coaching_programs

  it('relit les anciens champs numérotés, y compris le nom de champ qui change (program_3_format)', () => {
    const items = legacyItems(
      {
        program_1_label: 'Découverte',
        program_1_price: 'Gratuit',
        program_3_label: 'Programme',
        program_3_format: '6 séances',
      },
      def,
    )
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({ label: 'Découverte', price: 'Gratuit', href: 'calendly', highlight: 'non' })
    expect(items[1]).toMatchObject({ label: 'Programme', unit: '6 séances', highlight: 'oui' })
  })

  it('ignore un emplacement dont tous les champs sont vides', () => {
    expect(legacyItems({ program_1_label: '   ' }, def)).toEqual([])
  })

  it('ajoute l’icône déduite de la position pour les domaines', () => {
    const items = legacyItems({ domain_1_title: 'Un', domain_2_title: 'Deux' }, LIST_DEFS.entreprises_domains)
    expect(items.map(i => i.icon)).toEqual(['people', 'globe'])
  })
})

describe('readList', () => {
  it('préfère la liste JSON aux anciens champs', () => {
    const content = {
      coaching_programs: '[{"label":"Nouveau"}]',
      program_1_label: 'Ancien',
    }
    expect(readList(content, 'coaching_programs').map(i => i.label)).toEqual(['Nouveau'])
  })

  it('laisse une liste vidée vide (elle ne ressurgit pas)', () => {
    const content = { coaching_programs: '[]', program_1_label: 'Ancien' }
    expect(readList(content, 'coaching_programs')).toEqual([])
  })

  it('retombe sur les anciens champs quand le JSON est corrompu', () => {
    const content = { coaching_programs: '{oops', program_1_label: 'Ancien' }
    expect(readList(content, 'coaching_programs').map(i => i.label)).toEqual(['Ancien'])
  })

  it('ne garde que les champs connus', () => {
    const content = { coaching_programs: '[{"label":"A","inconnu":"x"}]' }
    expect(readList(content, 'coaching_programs')).toEqual([
      { label: 'A', subtitle: '', price: '', unit: '', desc: '', cta: '', href: '', highlight: '' },
    ])
  })

  it('utilise les valeurs de repli quand la page n’a aucun ancien champ (FAQ)', () => {
    const items = readList({ faq_questions: '' }, 'faq_questions', FAQ_ITEMS)
    expect(items.length).toBeGreaterThan(0)
    expect(items[0].q).toBe(FAQ_ITEMS.faq_1_q)
    expect(items[0].a).toBe(FAQ_ITEMS.faq_1_a)
  })

  it('retourne une liste vide pour une clé inconnue', () => {
    expect(readList({}, 'liste_qui_nexiste_pas')).toEqual([])
  })
})

describe('édition de liste', () => {
  const def = LIST_DEFS.faq_questions
  const items = [
    { q: '1', a: 'a' },
    { q: '2', a: 'b' },
    { q: '3', a: 'c' },
  ]

  it('sérialise et relit à l’identique (y compris une liste vide)', () => {
    expect(parseItems(serializeList(items))).toEqual(items)
    expect(parseItems(serializeList([]))).toEqual([])
  })

  it('crée un élément vide, avec la première option pour un choix fermé', () => {
    expect(blankItem(def)).toEqual({ q: '', a: '' })
    expect(blankItem(LIST_DEFS.entreprises_domains)).toEqual({ title: '', desc: '', icon: 'people' })
  })

  it('déplace un élément, sans sortir de la liste', () => {
    expect(moveListItem(items, 0, 1).map(i => i.q)).toEqual(['2', '1', '3'])
    expect(moveListItem(items, 0, -1)).toBe(items)
    expect(moveListItem(items, 2, 1)).toBe(items)
    expect(moveListItem(items, 9, 1)).toBe(items)
  })

  it('modifie, duplique et supprime sans muter la liste d’origine', () => {
    const changed = setListItemField(items, 1, 'a', 'nouveau')
    expect(changed[1].a).toBe('nouveau')
    expect(items[1].a).toBe('b')

    const duplicated = duplicateListItem(items, 0)
    expect(duplicated).toHaveLength(4)
    expect(duplicated[1]).toEqual(items[0])

    expect(removeListItem(items, 0).map(i => i.q)).toEqual(['2', '3'])
    expect(items).toHaveLength(3)
  })
})
