const { RestrictedAutocomplete } = require('../src/autocomplete.js');

test("Returns a RestrictedAutocompleted setted", () => {
    var roadName = "Avenida Santos Saraiva"
    var textField = {value: roadName, addEventListener: function (a, b, c){}}; 
    const autocomplete = new RestrictedAutocomplete(textField, function () {return "myFunction"});
    expect(autocomplete.textField.value).toBe(roadName);
});

