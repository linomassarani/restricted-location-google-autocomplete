# Restricted Location Google Autocomplete
> License
<p align="left">
    <img src="https://img.shields.io/npm/l/make-coverage-badge.svg">
</p>

> Building
<p align="left">
    <a href="https://raw.githubusercontent.com/linomassarani/restricted-location-google-autocomplete/master/coverage/lcov-report/" alt="Coverage lines">
        <img src="./coverage/badge-lines.svg" /></a>
    <a href="https://raw.githubusercontent.com/linomassarani/restricted-location-google-autocomplete/master/coverage/lcov-report/index.html" alt="Coverage functions">
        <img src="./coverage/badge-branches.svg" /></a>
    <a href="https://raw.githubusercontent.com/linomassarani/restricted-location-google-autocomplete/master/coverage/lcov-report/index.html" alt="Coverage branches">
        <img src="./coverage/badge-branches.svg" /></a>
    <a href="https://raw.githubusercontent.com/linomassarani/restricted-location-google-autocomplete/master/coverage/lcov-report/index.html" alt="Coverage statements">
        <img src="./coverage/badge-statements.svg" /></a>
</p>



Google API autocompletes methods don't give us a complete restrict address options, only for desired country and for bounds (if you have the coordinates). Soo this solution, in javascript, is capable to restrict an address for whatever you want.

Is little tricky for users type all the complete address (neighborhood, city, state, etc.) every time he needs to get a correct address, at least in my case of use (firefighters emergency calls attendance).

# Solution

It's not 100% that it wont return undesirable results, but it will save a lot off users typing efforts.

Basically this script tricks Google APIs and users by adding behind the scenes the necessary restrictions within the request, before it goes to google servers.

It uses service.getPlacePredictions and google.maps.places.AutocompleteService and was implemented in a way that the billing stands for "Autocomplete without Places Details - Per Session", that means you'll be billed only once since when user start typing, till he clicks on an address prediction (the cheaper option available).

Another advantage of using a custom autocomplete, instead the google default widget, is that it won't block the text input if there's a problem with the API Key, like out of limits. So user can type the address and in future the system adms can give the correct treatment to the unverified address.



# What it looks like

![](usage-example.gif)



# Useful links

The initial project was based on https://www.w3schools.com/howto/howto_js_autocomplete.asp

If you have doubts about the billing of the related requests see this explanation https://stackoverflow.com/a/53655495/4324194

See also my answer here https://stackoverflow.com/a/62294304/4324194

Ou aqui em português https://pt.stackoverflow.com/a/456651/193152
