"use strict";

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

		this._lastResultBusca; //search typed by user
		this._lastResultEnderecoCompleto; //complete address
		this._lastResultNumero; //number
		this._lastResultNumeroA; //number (a)breviated
		this._lastResultLogradouro; //road
		this._lastResultLogradouroA;
		this._lastResultBairro; //neighborhood
		this._lastResultBairroA;
		this._lastResultCidade; //city
		this._lastResultCidadeA;
		this._lastResultEstado; //state
		this._lastResultEstadoA;
		this._lastResultPais; //country
		this._lastResultPaisA;
		this._lastResultCEP; //postal code
		this._lastResultCEPA;
		this._lastResultId;
		this._lastResultLatitude;
		this._lastResultLongitude;

		this.serviceHelper = document.createElement("DIV");
		this.serviceHelper.setAttribute("id", "service-helper");
		this.textField.parentNode.appendChild(this.serviceHelper);

		this.onTextChange = this.onTextChange.bind(this);

		try {
			if (!this.textField) throw ReferenceError("autocomplete textField is null");
			if (this.textField.type != "text") throw TypeError("autocomplete textField is not text");

			this.textField.addEventListener("input", this.onTextChange, false);
			this.textField.addEventListener("keydown", this.onKeyDown, false);
			document.addEventListener("click", this.closeAllLists, false);
		} catch (err) {
			console.error(err);
		}
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

	get lastResultBusca() {
		return this._lastResultBusca;
	}
	get lastResultEnderecoCompleto() {
		return this._lastResultEnderecoCompleto;
	}
	get lastResultNumero() {
		return this._lastResultNumero;
	}
	get lastResultNumeroA() {
		return this._lastResultNumeroA;
	}
	get lastResultLogradouro() {
		return this._lastResultLogradouro;
	}
	get lastResultLogradouroA() {
		return this._lastResultLogradouroA;
	}
	get lastResultBairro() {
		return this._lastResultBairro;
	}
	get lastResultBairroA() {
		return this._lastResultBairroA;
	}
	get lastResultCidade() {
		return this._lastResultCidade;
	}
	get lastResultCidadeA() {
		return this._lastResultCidadeA;
	}
	get lastResultEstado() {
		return this._lastResultEstado;
	}
	get lastResultEstadoA() {
		return this._lastResultEstadoA;
	}
	get lastResultPais() {
		return this._lastResultPais;
	}
	get lastResultPaisA() {
		return this._lastResultPaisA;
	}
	get lastResultCEP() {
		return this._lastResultCEP;
	}
	get lastResultCEPA() {
		return this._lastResultCEPA;
	}
	get lastResultId() {
		return this._lastResultId;
	}
	get lastResultLatitude() {
		return this._lastResultLatitude;
	}
	get lastResultLongitude() {
		return this._lastResultLongitude;
	}

	/**
	 * Get place basic details (cheaper) of given place id and set class last result properties.
	 * At the end it will call the callback function passed on constructor
	 * @param {string} placeId Google place id.
	 */
	addrSelected(placeId) {
		var request = {
			placeId: placeId,
			sessionToken: this.placesSessionToken,
			fields: ['place_id', 'name', 'formatted_address', 'geometry', 'address_components'],
		}
		try {
			this.placesService.getDetails(request, (place, status) => {
				try {
					if (status === google.maps.places.PlacesServiceStatus.OK) {
						this._lastResultBusca = place.name;
						this._lastResultEnderecoCompleto = place.formatted_address;
						this._lastResultId = place.place_id;
						this._lastResultLatitude = place.geometry.location.lat();
						this._lastResultLongitude = place.geometry.location.lng();
						place.address_components.forEach((item) => {
							switch (item.types[0]) {
								case "street_number":
									this._lastResultNumero = item.long_name;
									this._lastResultNumeroA = item.short_name;
									break;
								case "route":
									this._lastResultLogradouro = item.long_name;
									this._lastResultLogradouroA = item.short_name;
									this.textField.value = item.long_name;
									break;
								case "sublocality_level_1":
									this._lastResultBairro = item.long_name;
									this._lastResultBairroA = item.short_name;
									break;
								case "administrative_area_level_2":
									this._lastResultCidade = item.long_name;
									this._lastResultCidadeA = item.short_name;
									break;
								case "administrative_area_level_1":
									this._lastResultEstado = item.long_name;
									this._lastResultEstadoA = item.short_name;
									break;
								case "country":
									this._lastResultPais = item.long_name;
									this._lastResultPaisA = item.short_name;
									break;
								case "postal_code":
									this._lastResultCEP = item.long_name;
									this._lastResultCEPA = item.short_name;
									break;
							}
						});
						if (this.callBack instanceof Function) this.callBack();
					} else throw "erro ao buscar detalhes do lugar selecionado";
				} catch (err) {
					this.handleGoogleConetionError(err);
				}

			});
		} catch (err) {
			this.handleGoogleConetionError(err);
		}
		this.placesSessionToken = null;
	}

	queryGooglePlacesAndShowResults() {
		if (this.isQueryRunning) return;
		this.isQueryRunning = true;

		try {
			this.setGoogleServices();
		} catch (err) {
			this.handleGoogleConetionError(err);
		}

		var val = this.textField.value;
		this.closeAllLists();
		this.currentFocus = -1;

		this.dropDownPredictionList = document.createElement("DIV");
		this.dropDownPredictionList.setAttribute("id", this.id + "autocomplete-list");
		this.dropDownPredictionList.setAttribute("class", "autocomplete-items");

		this.textField.parentNode.appendChild(this.dropDownPredictionList);
		var addrQuery = "";
		if (this.estado && this.estado != "") addrQuery += this.estado.value + " ";
		if (this.cidade && this.cidade != "") addrQuery += this.cidade.value + " ";
		if (this.bairro && this.bairro != "") addrQuery += this.bairro.value + " ";
		if (this.numero.value && this.numero.value != 0 && this.numero.value != "") addrQuery += "NUMERO " + this.numero.value + " ";
		if (val) addrQuery += val;

		var request = {
			input: addrQuery,
			sessionToken: this.placesSessionToken,
			componentRestrictions: {
				country: 'br'
			},
			types: ['address'],
		}

		try {
			//getPlacePredictions() to retrieve matching places
			//getQueryPredictions: retrieve matching places plus suggested search terms.
			this.service.getPlacePredictions(request, (place, status) => {
				try {
					if (status === google.maps.places.PlacesServiceStatus.OK) {
						place.forEach((item) => {
							var addr = item.description;
							var b = document.createElement("DIV");
							b.innerHTML = "<strong>" + addr.substr(0, val.length) + "</strong>";
							b.innerHTML += addr.substr(val.length);

							b.innerHTML += "<input type='hidden' value='" + addr + "'>";
							b.innerHTML += "<input type='hidden' value='" + item.place_id + "'>";

							b.addEventListener("click", (e) => {
								var placeId = this.dropDownPredictionList.getElementsByTagName("input")[1].value;
								this.closeAllLists();
								this.addrSelected(placeId);
							});
							this.dropDownPredictionList.appendChild(b);
						});
					} else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS &&
						val && val != "") {
						var b = document.createElement("DIV");
						b.addEventListener("click", function (e) {
						b.innerHTML = "<strong>" + "Não corresponde a nenhum endereço" + "</strong>";
							this.textField.value = "";
							this.closeAllLists();
						});
						this.dropDownPredictionList.appendChild(b);

					} else if (val && val != "") throw "erro ao buscar predição no google";

					if (val && val != "") {
						var b = document.createElement("DIV");
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

					this.isQueryRunning = false;
				} catch (err) {
					this.handleGoogleConetionError(err);
				}
			});
		} catch (err) {
			this.handleGoogleConetionError(err);
		}
	}

	handleGoogleConetionError(err) {
		this.closeAllLists();
		this.currentFocus = -1;

		this.dropDownPredictionList = document.createElement("DIV");
		this.dropDownPredictionList.setAttribute("id", this.id + "autocomplete-list");
		this.dropDownPredictionList.setAttribute("class", "autocomplete-items");
		this.textField.parentNode.appendChild(this.dropDownPredictionList);

		var b = document.createElement("DIV");
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
		var root = this;
		this.timer = setTimeout(() => {
			this.queryGooglePlacesAndShowResults();
		}, 300);
	}

	removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}

	addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		removeActive(x);
		if (this.currentFocus >= x.length) this.currentFocus = 0;
		if (this.currentFocus < 0) this.currentFocus = (x.length - 1);
		/*add class "autocomplete-active":*/
		x[this.currentFocus].classList.add("autocomplete-active");
	}

	onKeyDown(e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
			this.currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) { //up
			/*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
			this.currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (this.currentFocus > -1) {
				/*and simulate a click on the "active" item:*/
				if (x) x[this.currentFocus].click();
			}
		}
	}

	closeAllLists(elmnt) {
		/*close all autocomplete lists in the document,
		except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != this.textField) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
}


