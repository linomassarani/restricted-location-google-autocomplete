"use strict";

export class RestrictedPlace {
    construct(
        busca, //search typed by user
		enderecoCompleto, //complete address
		numero, //number
		numeroAbreviado, //number (a)breviated
		logradouro, //road
		logradouroAbreviado,
		bairro, //neighborhood
		bairroAbreviado,
		cidade, //city
		cidadeAbreviado,
		estado, //state
		estadoAbreviado,
		pais, //country
		paisAbreviado,
		cEP, //postal code
		cEPAbreviado,
		googleId,
		latitude,
		longitude) {
		
        this.busca = busca; //search typed by user
		this.enderecoCompleto = enderecoCompleto; //complete address
		this.numero = numero; //number
		this.numeroAbreviado = numeroAbreviado; //number (a)breviated
		this.logradouro = logradouro; //road
		this.logradouroAbreviado = logradouroAbreviado;
		this.bairro = bairro; //neighborhood
		this.bairroAbreviado = bairroAbreviado;
		this.cidade = cidade; //city
		this.cidadeAbreviado = cidadeAbreviado;
		this.estado = estado; //state
		this.estadoAbreviado = estadoAbreviado;
		this.pais = pais; //country
		this.paisAbreviado = paisAbreviado;
		this.cEP = cEP; //postal code
		this.cEPAbreviado = cEPAbreviado;
		this.googleId = googleId;
		this.latitude = latitude;
		this.longitude = longitude;
    }
    
    consoleLog() {
        console.log("busca: " + this.busca);
        console.log("enderecoCompleto: " + this.enderecoCompleto);
        console.log("numero: " + this.numero);
        console.log("numeroAbreviado: " + this.numeroAbreviado);
        console.log("logradouro: " + this.logradouro);
        console.log("logradouroAbreviado: " + this.logradouroAbreviado);
        console.log("bairro: " + this.bairro);
        console.log("bairroAbreviado: " + this.bairroAbreviado);
        console.log("cidade: " + this.cidade);
        console.log("cidadeAbreviado: " + this.cidadeAbreviado);
        console.log("estado: " + this.estado);
        console.log("estadoAbreviado: " + this.estadoAbreviado);
        console.log("pais: " + this.pais);
        console.log("paisAbreviado: " + this.paisAbreviado);
        console.log("cEP: " + this.cEP);
        console.log("cEPAbreviado: " + this.cEPAbreviado);
        console.log("googleId: " + this.googleId);
        console.log("latitude: " + this.latitude);
        console.log("longitude: " + this.longitude);   
    }
}
