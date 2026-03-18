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
    victoryPoints: 1, // обычно не приносят ПО, но могут быть исключения
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
  // Крысы-скейтеры с Марса (Тварь)
  rats_from_mars: {
    id: 'rats_from_mars',
    name: 'Крысы-скейтеры с Марса',
    type: 'Creature',
    cost: 2,
    victoryPoints: 1,
    onPlayEffects: [{ keyword: 'power', value: 2, target: 'self' }],
    defenseEffects: [
      {
        keyword: 'moveCardToOpponentDiscard',
        target: 'attacker',
        // значение не нужно, сам факт активирует перемещение
        // конкретная логика будет реализована на сервере
      }
    ],
    isPermanent: false,
  },

  // Верстанная братва (Заклинание)
  verstannaya_bratva: {
    id: 'verstannaya_bratva',
    name: 'Верстанная братва',
    type: 'Spell',
    cost: 2,
    victoryPoints: 0,
    onPlayEffects: [
      {
        keyword: 'retrieveFromDiscard',
        target: 'self',
        condition: 'hasCreatureInDiscard', // условие: есть тварь в сбросе
        // предположительно, выбирается конкретная тварь
      },
      {
        keyword: 'power',
        value: 2,
        target: 'self',
        condition: 'noCreaturesInDiscard', // если тварей нет
      }
    ],
    isPermanent: false,
  },

  // Орудия рэп-битвы (Сокровище)
  rap_battle_tools: {
    id: 'rap_battle_tools',
    name: 'Орудия рэп-битвы',
    type: 'Treasure',
    cost: 4,
    victoryPoints: 2,
    onPlayEffects: [{ keyword: 'power', value: 2, target: 'self' }],
    attackEffects: [
      {
        keyword: 'damagePerLegend', // урон 4 за каждую легенду в сбросе врага
        target: 'allEnemies',
        // значение 4 будет использовано как множитель
      },
      {
        keyword: 'destroy',
        target: 'self',
        condition: 'attackDealtNoDamage', // если атака не нанесла урона
        optional: true, // можешь уничтожить
      }
    ],
    isPermanent: false,
  },

  // Нечестивый Грааль (Сокровище)
  unholy_grail: {
    id: 'unholy_grail',
    name: 'Нечестивый Грааль',
    type: 'Treasure',
    cost: 3,
    victoryPoints: 1,
    onPlayEffects: [{ keyword: 'power', value: 3, target: 'self' }],
    defenseEffects: [
      { keyword: 'draw', value: 1, target: 'self' },
      { keyword: 'damage', value: 5, target: 'attacker' }
    ],
    isPermanent: false,
  },

  // Боевая саксекира (Сокровище)
  battle_sax: {
    id: 'battle_sax',
    name: 'Боевая саксекира',
    type: 'Treasure',
    cost: 3,
    victoryPoints: 1,
    onPlayEffects: [{ keyword: 'power', value: 2, target: 'self' }],
    attackEffects: [
      { keyword: 'damage', value: 5, target: 'leftEnemy' },
      { keyword: 'damage', value: 5, target: 'rightEnemy' }
    ],
    isPermanent: false,
  },

  // Солнцеликий (Волшебник)
  sunfaced: {
    id: 'sunfaced',
    name: 'Солнцеликий',
    type: 'Wizard',
    cost: 5,
    victoryPoints: 2,
    onPlayEffects: [
      { keyword: 'power', value: 2, target: 'self' },
      { keyword: 'draw', value: 1, target: 'self' }
    ],
    attackEffects: [
      { keyword: 'damage', value: 10, target: 'chosenEnemy' }
    ],
    isPermanent: false,
  },

  // Вилли Айш (Волшебник)
  willy_ice: {
    id: 'willy_ice',
    name: 'Вилли Айш',
    type: 'Wizard',
    cost: 4,
    victoryPoints: 2,
    onPlayEffects: [
      { keyword: 'power', value: 1, target: 'self' },
      {
        keyword: 'ifFirstCard', // условие: первая карта в ходу
        then: [
          { keyword: 'discardAllHand', target: 'self' },
          { keyword: 'draw', value: 4, target: 'self' }
        ]
      }
    ],
    isPermanent: false,
  },

  // Крутатидон! (Заклинание)
  krutadon: {
    id: 'krutadon',
    name: 'Крутатидон!',
    type: 'Spell',
    cost: 5,
    victoryPoints: 2,
    onPlayEffects: [
      { keyword: 'power', value: 3, target: 'self' },
      { keyword: 'damage', value: 7, target: 'allEnemies' }
    ],
    isPermanent: false,
  },

  // Авойнашки (Тварь)
  avoinashki: {
    id: 'avoinashki',
    name: 'Авойнашки',
    type: 'Creature',
    cost: 2,
    victoryPoints: 1,
    onPlayEffects: [{ keyword: 'draw', value: 2, target: 'self' }],
    isPermanent: false,
  },

  // Талочка свинства (Палочка)
  piggy_wand: {
    id: 'piggy_wand',
    name: 'Талочка свинства',
    type: 'Wand',
    cost: 2,
    victoryPoints: 0,
    onPlayEffects: [{ keyword: 'draw', value: 1, target: 'self' }],
    attackEffects: [
      {
        keyword: 'giveCardFromHandOrDiscard',
        target: 'chosenEnemy',
        // отдать карту стоимости 0
      }
    ],
    isPermanent: false,
  },

  // Генитальные гарпии (Тварь)
  genital_harpias: {
    id: 'genital_harpias',
    name: 'Генитальные гарпии',
    type: 'Creature',
    cost: 4,
    victoryPoints: 2,
    onPlayEffects: [{ keyword: 'power', value: 2, target: 'self' }],
    attackEffects: [
      {
        keyword: 'damagePerLimpWand', // 2 урона за каждую вялую палочку
        target: 'allEnemies',
      },
      {
        keyword: 'draw',
        value: 1,
        target: 'self',
        condition: 'attackDealtNoDamage',
      }
    ],
    isPermanent: false,
  },

  // Миша, убийца единорогов (Волшебник)
  misha_unicorn_killer: {
    id: 'misha_unicorn_killer',
    name: 'Миша, убийца единорогов',
    type: 'Wizard',
    cost: 3,
    victoryPoints: 1,
    onPlayEffects: [
      {
        keyword: 'lookAndChoose',
        target: 'self',
        // посмотреть верхнюю карту, затем взять или уничтожить
      }
    ],
    isPermanent: false,
  },

  // Гнойный тренанатор (Волшебник)
  gnojny_trenanator: {
    id: 'gnojny_trenanator',
    name: 'Гнойный тренанатор',
    type: 'Wizard',
    cost: 4,
    victoryPoints: 2,
    onPlayEffects: [{ keyword: 'power', value: 2, target: 'self' }],
    attackEffects: [
      { keyword: 'discardOpponentCard', target: 'allEnemies', value: 1 }
    ],
    isPermanent: false,
  },

  // Кровавый банщик (Тварь)
  bloody_bather: {
    id: 'bloody_bather',
    name: 'Кровавый банщик',
    type: 'Creature',
    cost: 4,
    victoryPoints: 2,
    onPlayEffects: [{ keyword: 'power', value: 2, target: 'self' }],
    attackEffects: [
      {
        keyword: 'revealHandAndDamage',
        target: 'chosenEnemy',
        // урон равен стоимости самой дорогой карты в руке
      }
    ],
    isPermanent: false,
  },
  // Приуктовый зад (Тварь)
priuktovy_zad: {
  id: 'priuktovy_zad',
  name: 'Приуктовый зад',
  type: 'Creature',
  cost: 4,
  victoryPoints: 2,
  onPlayEffects: [{ keyword: 'power', value: 2 }],
  attackEffects: [
    { keyword: 'giveLimpWand', target: 'allEnemies', cardId: 'limp_wand' },
    { keyword: 'heal', value: 4, target: 'self', condition: 'enemyAvoidedAttack' }
  ],
  isPermanent: false,
},

// Сумка радости (Сокровище)
bag_of_joy: {
  id: 'bag_of_joy',
  name: 'Сумка радости',
  type: 'Treasure',
  cost: 3,
  victoryPoints: 1,
  onPlayEffects: [
    { keyword: 'power', value: 3 },
    { keyword: 'lookAndHealByCost', target: 'self' }
  ],
  isPermanent: false,
},

// Парево (Заклинание)
parevo: {
  id: 'parevo',
  name: 'Парево',
  type: 'Spell',
  cost: 2,
  victoryPoints: 0,
  onPlayEffects: [{ keyword: 'power', value: 2 }],
  defenseEffects: [
    { keyword: 'discardSelf' },
    { keyword: 'draw', value: 1, target: 'self' },
    { keyword: 'damage', value: 2, target: 'attacker' }
  ],
  isPermanent: false,
},

// Азык роботов (Сокровище)
azyk_robotov: {
  id: 'azyk_robotov',
  name: 'Азык роботов',
  type: 'Treasure',
  cost: 2,
  victoryPoints: 1,
  onPlayEffects: [{ keyword: 'power', value: 1 }],
  defenseEffects: [
    { keyword: 'discardSelf' },
    { keyword: 'destroyFromHandOrDiscard', target: 'self', optional: true }
  ],
  isPermanent: false,
},

// Нипутко! (Заклинание)
niputko: {
  id: 'niputko',
  name: 'Нипутко!',
  type: 'Spell',
  cost: 2,
  victoryPoints: 0,
  onPlayEffects: [
    { keyword: 'power', value: 1 },
    { keyword: 'putNextPurchasedOnTop', target: 'self' }
  ],
  isPermanent: false,
},

// Разараканус (Заклинание)
razarakanus: {
  id: 'razarakanus',
  name: 'Разараканус',
  type: 'Spell',
  cost: 1,
  victoryPoints: 0,
  onPlayEffects: [
    { keyword: 'power', value: 1 },
    { keyword: 'destroyFromDiscard', target: 'self', optional: true }
  ],
  isPermanent: false,
},

// Карпатыч-сан (Волшебник)
karpathych_san: {
  id: 'karpathych_san',
  name: 'Карпатыч-сан',
  type: 'Wizard',
  cost: 3,
  victoryPoints: 1,
  onPlayEffects: [
    { keyword: 'retrieveSpellFromDiscard', target: 'self', condition: 'hasSpellInDiscard' },
    { keyword: 'power', value: 2, target: 'self', condition: 'noSpellInDiscard' }
  ],
  isPermanent: false,
},

// Безумная кошатица (Волшебник)
crazy_cat: {
  id: 'crazy_cat',
  name: 'Безумная кошатица',
  type: 'Wizard',
  cost: 3,
  victoryPoints: 1,
  onPlayEffects: [
    { keyword: 'power', value: 1 },
    { keyword: 'draw', value: 1, target: 'self' },
    { keyword: 'draw', value: 1, target: 'chosenEnemy' }
  ],
  defenseEffects: [{ keyword: 'discardSelf' }],
  isPermanent: false,
},

// Виар, колаун-виртуал (Волшебник)
viar_colaun: {
  id: 'viar_colaun',
  name: 'Виар, колаун-виртуал',
  type: 'Wizard',
  cost: 4,
  victoryPoints: 2,
  onPlayEffects: [{ keyword: 'power', value: 2 }],
  defenseEffects: [
    { keyword: 'discardSelf' },
    { keyword: 'draw', value: 2, target: 'self' },
    { keyword: 'discard', value: 1, target: 'self' }
  ],
  isPermanent: false,
},

// Какой чудесный день (Заклинание)
wonderful_day: {
  id: 'wonderful_day',
  name: 'Какой чудесный день',
  type: 'Spell',
  cost: 2,
  victoryPoints: 0,
  onPlayEffects: [{ keyword: 'draw', value: 1 }],
  defenseEffects: [
    { keyword: 'discardSelf' },
    { keyword: 'draw', value: 1, target: 'self' },
    { keyword: 'heal', value: 3, target: 'self' }
  ],
  isPermanent: false,
},

// Распальчун (Волшебник)
raspalchun: {
  id: 'raspalchun',
  name: 'Распальчун',
  type: 'Wizard',
  cost: 5,
  victoryPoints: 3,
  onPlayEffects: [
    { keyword: 'powerPerDeadToken', value: 5 } // базовая мощь 5, уменьшается на число жетонов
  ],
  isPermanent: false,
},

// Полное дерьмо (Сокровище)
full_crap: {
  id: 'full_crap',
  name: 'Полное дерьмо',
  type: 'Treasure',
  cost: 4,
  victoryPoints: 2,
  onPlayEffects: [{ keyword: 'power', value: 2 }],
  attackEffects: [
    { keyword: 'revealTopAndDiscard', target: 'allEnemies' }
  ],
  isPermanent: false,
},

// Змееволк позорный (Тварь)
shameful_wolf: {
  id: 'shameful_wolf',
  name: 'Змееволк позорный',
  type: 'Creature',
  cost: 4,
  victoryPoints: 2,
  onPlayEffects: [
    { keyword: 'power', value: 2 },
    { keyword: 'heal', value: 2, target: 'self' }
  ],
  attackEffects: [
    { keyword: 'damageWeakerEnemies', value: 5, target: 'allEnemies' }
  ],
  isPermanent: false,
},
};

// Для удобства можно также создать массив всех шаблонов
export const allTemplates = Object.values(cardTemplates);