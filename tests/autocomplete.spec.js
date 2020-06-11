'use strict'

const { RestrictedAutocomplete } = require('../src/autocomplete.js');

function generateForm() {
    // Set up our document body
    document.body.innerHTML =
    '<form autocomplete="off" action="/action_page.php">' +
        '<div class="autocomplete" style="width:300px;">' +
            '<p><input id="estado" type="text" name="estado" placeholder="Estado" value="SC"></p>' +
            '<p><input id="cidade" type="text" name="cidade" placeholder="Cidade"value="FLORIANOPOLIS"></p>' +
            '<p><input id="bairro" type="text" name="bairro" placeholder="Bairro" value="CENTRO"></p>' +
            '<p><input id="numero" type="text" name="numero" placeholder="Numero" value="10"></p>' +
        '</div>'
        '<input type="submit">'
    '</form>';
}

test("Returns a RestrictedAutocompleted setted", () => {
    var roadName = "Avenida Santos Saraiva";
    var textField = {value: roadName, addEventListener: function (a, b, c){}}; 
    const autocomplete = new RestrictedAutocomplete(textField, function () {return "myFunction"});
    expect(autocomplete.textField.value).toBe(roadName);
});

test("Set textFields that restricts address query", () => {
    generateForm();

    var textFieldMock = {value: "", addEventListener: function (a, b, c){}};
    let autocomplete = new RestrictedAutocomplete(textFieldMock, function () {});

    autocomplete.setRestrictions(document.getElementById("estado"),
        document.getElementById("cidade"),
        document.getElementById("bairro"),
        document.getElementById("numero"));

    expect(autocomplete.numero.value).toBe("10");
    expect(autocomplete.bairro.value).toBe("CENTRO");
    expect(autocomplete.cidade.value).toBe("FLORIANOPOLIS");
    expect(autocomplete.estado.value).toBe("SC");
});



