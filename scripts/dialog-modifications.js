function declenseObject(data) {
  // Je nutná shallow copy aby se neměnily původní překlady
  const declensedData = { ...data }
  Object.keys(data).forEach(k => {
    declensedData[k] = declensedData[k].firstDeclension()
  })

  return declensedData
}

Hooks.once('ready', () => {

  FoundryCZ.add('*')
  FoundryCZ.add('systems/dnd5e/templates/apps/trait-selector.hbs', (data) => {

  })

  /**
   * Okno hodu kostkou
   */
  FoundryCZ.add('systems/dnd5e/templates/chat/roll-dialog.hbs', (data) => {
    if ('abilities' in data) {
      data.abilities = declenseObject(data.abilities)
    }
  });

  /**
   * Okno povolání
   */
  FoundryCZ.add('systems/dnd5e/templates/items/class.hbs', (data) => {
    if ('abilities' in data.config) {
      data.config.abilities = declenseObject(data.config.abilities)
    }
  });

  /**
   * Okno nástrojů
   */
  FoundryCZ.add('systems/dnd5e/templates/items/tool.hbs', (data) => {
    if ('abilities' in data.config) {
      data.config.abilities = declenseObject(data.config.abilities)
    }
  });

  /**
   * Dialog spotřební věci
   */
  FoundryCZ.add('systems/dnd5e/templates/items/consumable.hbs', (data) => {
    if ('consumableTypes' in data.config) {
      data.config.consumableTypes = declenseObject(data.config.consumableTypes)
    }
  });

  /**
   * Nahrazení překladu jednotky rychlosti
   */
  [
    'character',
    'npc',
    'vehicle',
    'limited'
  ].forEach(actorType => {
    FoundryCZ.add(`systems/dnd5e/templates/actors/${actorType}-sheet.hbs`, (data) => {
      if ('movement' in data) {
        data.movement.primary = data.movement.primary.replace(/ft$/, 'st')
      }
    })
  })
})