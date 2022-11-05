Hooks.once('ready', () => {
  console.log('D&D CZ - inicializace modifikací systému')
  /**
   * Náhrada metody pro vytváření chatových zpráv.
   * Je nutná kvůli popisku dovednosti, který se nepřekládal.
   */
  dnd5e.dice.D20Roll.prototype._onDialogSubmit = function (html, advantageMode) {
    const form = html[0].querySelector("form");

    // Append a situational bonus term
    if ( form.bonus.value ) {
      const bonus = new Roll(form.bonus.value, this.data);
      if ( !(bonus.terms[0] instanceof OperatorTerm) ) this.terms.push(new OperatorTerm({operator: "+"}));
      this.terms = this.terms.concat(bonus.terms);
    }

    // Customize the modifier
    if ( form.ability?.value ) {
      const abl = this.data.abilities[form.ability.value];
      this.terms = this.terms.flatMap(t => {
        if ( t.term === "@mod" ) return new NumericTerm({number: abl.mod});
        if ( t.term === "@abilityCheckBonus" ) {
          const bonus = abl.bonuses?.check;
          if ( bonus ) return new Roll(bonus, this.data).terms;
          return new NumericTerm({number: 0});
        }
        return t;
      });
      this.options.flavor += ` (${CONFIG.DND5E.abilities[form.ability.value].firstDeclension()})`;
    }

    // Apply advantage or disadvantage
    this.options.advantageMode = advantageMode;
    this.options.rollMode = form.rollMode.value;
    this.configureModifiers();
    return this;
  }

  /**
   * Úprava chatových zpráv položek
   */
  CONFIG.Item.documentClass.prototype._consumableChatData = function(data, labels, props) {
    props.push(
      CONFIG.DND5E.consumableTypes[data.consumableType].firstDeclension(),
      `${data.uses.value}/${data.uses.max} ${game.i18n.localize("DND5E.Charges").firstDeclension().toLocaleLowerCase()}`
    );
    data.hasCharges = data.uses.value >= 0;
  }
  CONFIG.Item.documentClass.prototype._equipmentChatData = function(data, labels, props) {
    props.push(
      CONFIG.DND5E.equipmentTypes[data.armor.type].firstDeclension(),
      labels.armor || null,
      data.stealth ? game.i18n.localize("DND5E.StealthDisadvantage") : null
    );
  }
  CONFIG.Item.documentClass.prototype._toolChatData = function(data, labels, props) {
    props.push(
      CONFIG.DND5E.abilities[data.ability].firstDeclension() || null,
      CONFIG.DND5E.proficiencyLevels[data.proficient || 0]
    );
  }
  CONFIG.Item.documentClass.prototype._lootChatData = function(data, labels, props) {
    props.push(
      game.i18n.localize("DND5E.ItemTypeLoot").firstDeclension(),
      data.weight ? `${data.weight} ${game.i18n.localize("DND5E.AbbreviationLbs")}` : null
    );
  }
})