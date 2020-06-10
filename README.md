<p align="center">
    <img src="https://img.shields.io/npm/l/make-coverage-badge.svg">
</p>

<p align="center">
    <a href="./coverage/lcov-report/" alt="Coverage lines">
        <img src="./coverage/badge-lines.svg" /></a>
    <a href="./coverage/lcov-report/" alt="Coverage functions">
        <img src="./coverage/badge-branches.svg" /></a>
    <a href="./coverage/lcov-report/" alt="Coverage branches">
        <img src="./coverage/badge-branches.svg" /></a>
    <a href="./coverage/lcov-report/" alt="Coverage statements">
        <img src="./coverage/badge-statements.svg" /></a>
</p>

# Restricted Location Google Autocomplete

Javascript autocomplete textfield using Google Places API being capable to restrict for whatever you want.

Basically this script tricks google apis and users by adding behind the scenes the necessary restricntions within the request, before it goes to google servers.

This example uses service.getPlacePredictions and google.maps.places.AutocompleteService what means that the billing stands for "Autocomplete without Places Details - Per Session", that means you'll be billed only once since when user start typing, till he clicks on an address prediction.

Do not forget to specify your Google API Key on the example of usage "index.html".

Requires both "Maps JavaScript API" and "Places API" properly activated on your console.cloud.google.com.

The initial project was based on https://www.w3schools.com/howto/howto_js_autocomplete.asp

If you have doubts about the billing of the related requests see this explanation https://stackoverflow.com/a/53655495/4324194

See also my answer here https://stackoverflow.com/a/62294304/4324194

Ou aqui em português https://pt.stackoverflow.com/a/456651/193152

# What it looks like

![](usage-example.gif)
