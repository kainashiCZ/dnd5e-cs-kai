Hooks.once('ready', () => {
  /**
   * Okno hodu kostkou
   */
  FoundryCZ.add('systems/dnd5e/templates/chat/roll-dialog.hbs', (data) => {
    console.log(data)
    if ('abilities' in data) {
      // Je nutná shallow copy aby se neměnily původní překlady
      const abilities = { ...data.abilities }
      Object.keys(abilities).forEach(k => {
        abilities[k] = abilities[k].firstDeclension()
      })
      data.abilities = abilities
    }
  });

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