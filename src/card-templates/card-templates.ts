// card-templates.ts
import { CardTemplate } from "../types/types";

export const cardTemplates: Record<string, CardTemplate> = {
  // Затравки
  sign: {
    id: 'sign',
    name: 'Знак',
    type: 'Sign',
    cost: 0,
    power: 1,
    victoryPoints: 0,
    effects: [],
    isPermanent: false,
  },
  wand: {
    id: 'wand',
    name: 'Палочка',
    type: 'Wand',
    cost: 0,
    power: 1,
    victoryPoints: 0,
    effects: [
      {
        keyword: 'damage',
        value: 1,
        target: 'chosenEnemy',
      },
    ],
    isPermanent: false,
  },
  pshik: {
    id: 'pshik',
    name: 'Пшик',
    type: 'Pshik',
    cost: 0,
    power: 0,
    victoryPoints: 0,
    effects: [],
    isPermanent: false,
  },

  // Основные карты
  abrakadabrador: {
    id: 'abrakadabrador',
    name: 'Абракадабрадор',
    type: 'Wizard',
    cost: 4,
    power: 0,
    victoryPoints: 1,
    effects: [
      { keyword: 'draw', value: 1, target: 'self' },
      { keyword: 'heal', value: 2, target: 'self' },
    ],
    isPermanent: false,
  },
  acid_dragon: {
    id: 'acid_dragon',
    name: 'Кислотный Дракон',
    type: 'Creature',
    cost: 4,
    power: 1,
    victoryPoints: 2,
    effects: [
      { keyword: 'look', value: 1, target: 'self' },
      // Специальный эффект: уничтожить или вернуть. Пока используем keyword 'look' с особым условием,
      // но для простоты можно захардкодить позже. Пока сделаем отдельный keyword 'lookAndChoose'
      // Но в базовой версии можем пропустить этот эффект.
    ],
    isPermanent: false,
  },
  // Пропускаем сложный эффект, но добавим карту с простым look, если нужен тест.
  // Для теста можно использовать другой дракон с простым эффектом.

  mega_fisting: {
    id: 'mega_fisting',
    name: 'Мегафистинг!',
    type: 'Spell',
    cost: 5,
    power: 0,
    victoryPoints: 2,
    effects: [
      { keyword: 'draw', value: 1, target: 'self' },
      { keyword: 'damage', value: 6, target: 'leftEnemy' },
    ],
    isPermanent: false,
  },
  scepter_of_piggishness: {
    id: 'scepter_of_piggishness',
    name: 'Жезл свинства',
    type: 'Treasure',
    cost: 3,
    power: 0,
    victoryPoints: 2,
    effects: [
      { keyword: 'draw', value: 1, target: 'self' },
      // Атака: отдать карту стоимости 0 врагу. Это сложный эффект, пока пропустим.
    ],
    isPermanent: false,
  },
  wild_magic: {
    id: 'wild_magic',
    name: 'Шальная магия',
    type: 'WildMagic',
    cost: 3,
    power: 0,
    victoryPoints: 0, // обычно не приносят ПО, но могут быть исключения
    effects: [
      // Эффект: выбери одно: +2 мощи ИЛИ сыграй верхнюю карту колоды врага.
      // Сделаем два эффекта с optional: true
      { keyword: 'power', value: 2, target: 'self', optional: true },
      // Второй эффект сложный, пока заменим на заглушку
    ],
    isPermanent: false,
  },
  limp_wand: {
    id: 'limp_wand',
    name: 'Вялая палочка',
    type: 'LimpWand',
    cost: 0,
    power: 0,
    victoryPoints: -1, // в конце игры отнимает ПО
    effects: [],
    isPermanent: false,
  },
};

// Для удобства можно также создать массив всех шаблонов
export const allTemplates = Object.values(cardTemplates);