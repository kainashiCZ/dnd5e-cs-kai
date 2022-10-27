Hooks.once('ready', () => {
  // Okna aplikace
  FoundryCZ.add('templates/sidebar/document-create.html', (data) => {
    // typy položek
    if ('types' in data) {
      Object.keys(data.types).forEach(k => {
        data.types[k] = data.types[k].firstDeclension()
      })
    }
  });

  [
    'background',
    'backpack',
    'class',
    'consumable',
    'equipment',
    'feat',
    'loot',
    'spell',
    'subclass',
    'tool',
    'weapon'
  ].forEach(itemType => {
    FoundryCZ.add(`systems/dnd5e/templates/items/${itemType}.hbs`, (data) => {
      data.itemType = data.itemType?.firstDeclension()
    })
  })
})