'use strict';

import {RestrictedPlace} from '../src/RestrictedPlace.js';

/**
 * For informations about this class access
 * 
 * https://github.com/linomassarani/restricted-location-google-autocomplete
 */
export class RestrictedAutocomplete {

	/**
	 * Contructor
	 * @param {object} textField A document textfield to show autocomplete predictions.
	 * @param {function} callback Callback function that is called after user select a prediction.
	 * @return {RestrictedAutocomplete} Instantiated object.
	 */
	constructor(textField, callback) {
		this.service;
		this.placesService;
		this.timer;
		this.numero; //road number
		this.bairro; //neighborhood
		this.cidade; //city
		this.estado; //state
		this.isQueryRunning;
		this.placesSessionToken;
		this.dropDownPredictionList;
		this.textField = textField;
		this.currentFocus;
		this.callBack = callback;
		this.queryType = ['address'];

		this.lastResult;

		this.serviceHelper = document.createElement("DIV");
		this.serviceHelper.setAttribute("id", "service-helper");
		this.textField.parentNode.appendChild(this.serviceHelper);

		try {
			if (!this.textField) throw ReferenceError("autocomplete textField is null");
			if (this.textField.type != "text") throw TypeError("autocomplete textField is not text");
			this.textField.setAttribute("autocomplete","off");

			this.textField.addEventListener("input", e => this.onTextChange(e), false);
			this.textField.addEventListener("keydown", e => this.onKeyDown(e), false);
		    
			document.addEventListener("click", e => this.closeAllLists(e), false);
		} catch (err) {
			console.error(err);
		}
	}
	
	/**
	 * When called, following google predictions will be over 
	 * establishments instead of addresses
	 */
	setEstablishmentOnly() {
	    this.queryType = ['establishment'];
	}

	/**
	 * Set text fields that will be used to restrict the user autocomplete input predictions.
	 * @param {object} textField A document textfield to restrict state.
	 * @param {object} textField A document textfield to restrict city.
	 * @param {object} textField A document textfield to restrict neighborhood.
	 * @param {object} textField A document textfield to restrict number.
	 */
	setRestrictions(estado, cidade, bairro, numero) {
		this.estado = estado;
		this.cidade = cidade;
		this.bairro = bairro;
		this.numero = numero;
	}

	setGoogleServices() {
		try {
		    if (this.service == null) this.service = new google.maps.places.AutocompleteService();
		    if (this.placesService == null) this.placesService = new google.maps.places.PlacesService($('#service-helper').get(0));
		    if (this.placesSessionToken == null) this.placesSessionToken = new google.maps.places.AutocompleteSessionToken();
		} catch (err) {
		    console.error("Houve uma tentativa de conexão ao Google, porém não foi possível");
		}
	}

	/**
	 * Get place basic details (cheaper) of given place id and set class last result properties.
	 * At the end it will call the callback function passed on constructor
	 * @param {string} placeId Google place id.
	 */
	addrSelected(placeId) {
		let request = {
			placeId: placeId,
			sessionToken: this.placesSessionToken,
			fields: ['place_id', 'name', 'formatted_address', 'geometry', 
			    'address_components'],
		}
		
		let placeDetailsError = "erro ao buscar detalhes do lugar selecionado: ";
		let callBackError = 'A função passada como parâmetro ao autocomplete ' +
                        'para ser executada após selecionado o endereço ' +
                        'apresentou um erro: ';
		
		this.getPlaceDetail(request)
	        .then(place => this.setLastResult(place), (status) => {
	            this.handleGoogleConetionError(placeDetailsError + status);
	            throw -999;
	        })
	        .then(lastResult => this.callBack(lastResult))
	        .catch(e => {
	            if(e != -999) console.error(this.callBackError + e.message);
	        });
	            
		this.placesSessionToken = null;
	}
	
    getPlaceDetail(request) {
        return new Promise((resolve, reject) => {
            this.placesService.getDetails(request, function(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) 
                    resolve(place);
                else reject(status);
            });
        });
    }
    
    getPlacePredictions(request) {
        //getPlacePredictions() to retrieve matching places
        //getQueryPredictions: retrieve matching places plus suggested search terms.
        return new Promise((resolve, reject) => {
            this.service.getPlacePredictions(request, function(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) 
                    resolve(place);
                else reject(status);
            });
        });
    }
	
	setLastResult(place) {
	    this.lastResult = new RestrictedPlace();

    	this.lastResult.busca = place.name;
		this.lastResult.enderecoCompleto = place.formatted_address;
		this.lastResult.googleId = place.place_id;
		this.lastResult.latitude = place.geometry.location.lat();
		this.lastResult.longitude = place.geometry.location.lng();
		place.address_components.forEach((item) => {
			switch (item.types[0]) {
				case "street_number":
					this.lastResult.numero = item.long_name;
					this.lastResult.numeroAbreviado = item.short_name;
					break;
				case "route":
					this.lastResult.logradouro = item.long_name;
					this.lastResult.logradouroAbreviado = item.short_name;
					this.textField.value = item.long_name;
					break;
				case "sublocality_level_1":
					this.lastResult.bairro = item.long_name;
					this.lastResult.bairroAbreviado = item.short_name;
					break;
				case "administrative_area_level_2":
					this.lastResult.cidade = item.long_name;
					this.lastResult.cidadeAbreviado = item.short_name;
					break;
				case "administrative_area_level_1":
					this.lastResult.estado = item.long_name;
					this.lastResult.estadoAbreviado = item.short_name;
					break;
				case "country":
					this.lastResult.pais = item.long_name;
					this.lastResult.paisAbreviado = item.short_name;
					break;
				case "postal_code":
					this.lastResult.cEP = item.long_name;
					this.lastResult.cEPAbreviado = item.short_name;
					break;
	        }
	    });
	    
	    return this.lastResult;
    }

	queryGooglePlacesAndShowResults() {
		if (this.isQueryRunning) return;
		this.isQueryRunning = true;

		try {
			this.setGoogleServices();
		} catch (err) {
			this.handleGoogleConetionError(err);
		}

		let val = this.textField.value;
		this.closeAllLists();
		this.currentFocus = -1;

		this.dropDownPredictionList = document.createElement("DIV");
		this.dropDownPredictionList.setAttribute("id", this.id + "autocomplete-list");
		this.dropDownPredictionList.setAttribute("class", "autocomplete-items");

		this.textField.parentNode.appendChild(this.dropDownPredictionList);
		
		let invalidValuesArray = [null, "", 0, "0"];
		
		let addrQuery = "";
		if (this.estado && !(this.estado.value in invalidValuesArray))
	        addrQuery += this.estado.value + " ";
		if (this.cidade && !(this.cidade.value in invalidValuesArray))
            addrQuery += this.cidade.value + " ";
		if (this.bairro && !(this.bairro.value in invalidValuesArray))
		    addrQuery += this.bairro.value + " ";
		if (this.numero && !(this.numero.value in invalidValuesArray))
		    addrQuery += "NUMERO " + this.numero.value + " ";
		if (this.textField.value) 
		    addrQuery += this.textField.value;
        
		let request = {
			input: addrQuery,
			sessionToken: this.placesSessionToken,
			componentRestrictions: {
				country: 'br'
			},
			types: this.queryType,
		}

        this.getPlacePredictions(request)
            .then(places => this.showPredictions(places))
			.catch((status) => {
			    if(this.textField.value && this.textField.value != "") {
			        if (status ==
			            google.maps.places.PlacesServiceStatus.ZERO_RESULTS) 
                        this.showNoResutlsMsg();
					 else 
					    this.handleGoogleConetionError("erro ao buscar " + 
					        "predição no google");
			    }})
            .finally(() => {
                this.isQueryRunning = false;
            });
	}
	
	showPredictions(places) {
	    places.forEach((item) => {
		    let addr = item.description;
		    let b = document.createElement("DIV");
		    b.innerHTML = "<strong>" + addr.substr(0, this.textField.value.length) + "</strong>";
		    b.innerHTML += addr.substr(this.textField.value.length);

		    b.innerHTML += "<input type='hidden' value='" + addr + "'>";
		    b.innerHTML += "<input type='hidden' value='" + item.place_id + "'>";

		    b.addEventListener("click", (e) => {
			    let placeId = e.target.getElementsByTagName("input")[1].value;
			    this.closeAllLists();
			    this.addrSelected(placeId);
		    });
		    this.dropDownPredictionList.appendChild(b);
        });
        this.showGoogleCredits();
	}
	
	showNoResutlsMsg() {
		let b = document.createElement("DIV");
		b.innerHTML = "<strong>" + "Não corresponde a nenhum endereço" + "</strong>";
		b.addEventListener("click", function (e) {
			this.textField.value = "";
			this.closeAllLists();
		});
		this.dropDownPredictionList.appendChild(b);
		this.showGoogleCredits();
	}
	
	showGoogleCredits() {
		let b = document.createElement("DIV");
		b.setAttribute("class", "poweredByGoogle");
		b.innerHTML = '<p class="poweredByGoogle">powered by ' +
			'<a style=color:#4285f4>G</a>' +
			'<a style=color:#ea4335>o</a>' +
			'<a style=color:#fbbc05>o</a>' +
			'<a style=color:#4285f4>g</a>' +
			'<a style=color:#34a853>l</a>' +
			'<a style=color:#ea4335>e<a/></p>';
		this.dropDownPredictionList.appendChild(b);
	}

	handleGoogleConetionError(err) {
		this.closeAllLists();
		this.currentFocus = -1;

		this.dropDownPredictionList = document.createElement("DIV");
		this.dropDownPredictionList.setAttribute("id", this.id + "autocomplete-list");
		this.dropDownPredictionList.setAttribute("class", "autocomplete-items");
		this.textField.parentNode.appendChild(this.dropDownPredictionList);

		let b = document.createElement("DIV");
		b.setAttribute("class", "googleConErr");
		b.innerHTML = '<p class="googleConErr">' +
			'O Google não está respondendo verifique sua conexão com a internet. ' +
			'Contate o Plantão da DiTI caso persista o problema.</p>';
		this.dropDownPredictionList.appendChild(b);
		this.isQueryRunning = false;
		console.error(err);
	}

	onTextChange(e) {
		clearTimeout(this.timer);
		let root = this;
		
		const wait = 
		    ms => new Promise(resolve => setTimeout(resolve, ms));
		    
		wait(300)
		    .then(() => this.queryGooglePlacesAndShowResults())
		    .catch(e => console.error("Ocorreu um problema ao fazer " +
		         "busca no Google: " + e.message));
	}

	removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (let i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}

	addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		this.removeActive(x);
		if (this.currentFocus >= x.length) this.currentFocus = 0;
		if (this.currentFocus < 0) this.currentFocus = (x.length - 1);
		/*add class "autocomplete-active":*/
		x[this.currentFocus].classList.add("autocomplete-active");
	}

	onKeyDown(e) {
		let x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
			this.currentFocus++;
			/*and and make the current item more visible:*/
			this.addActive(x);
		} else if (e.keyCode == 38) { //up
			/*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
			this.currentFocus--;
			/*and and make the current item more visible:*/
			this.addActive(x);
		} else if (e.keyCode == 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (this.currentFocus > -1) {
				/*and simulate a click on the "active" item:*/
				if (x) x[this.currentFocus].click();
				
			}
		} else if (e.keyCode == 9) {
		    //tab
		    this.closeAllLists(e);
		}
	}

	closeAllLists(elmnt) {
		/*close all autocomplete lists in the document,
		except the one passed as an argument:*/
		let x = document.getElementsByClassName("autocomplete-items");
		for (let i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != this.textField) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
}
