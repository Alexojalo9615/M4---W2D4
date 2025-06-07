

function inizialePopolamento() {

    // Imposta il nome e l'indirizzo del negozio nell'interfaccia 
    document.getElementById("nomeNegozio").innerHTML = negozio.nomeNegozio;
    document.getElementById("indirizzoNegozio").innerHTML = negozio.indirizzo;

    //Crea dinamicamente la lista dei metodi di pagamento
    const listaMetodiPagamento = document.getElementById("metodiPagamento");
    for (let i = 0; i < negozio.metodiPagamento.length; i++) {
        const li = document.createElement("li");
        li.innerHTML = negozio.metodiPagamento[i];
        listaMetodiPagamento.appendChild(li);
    }

    // Mostra le informazioni sulla spedizione
    document.getElementById("infoSpedizione").innerHTML = `Spese di spedizione: ${negozio.speseSpedizione}€, soglia per la spedizione gratuita: ${negozio.sogliaSpedizioneGratuita}€`;
}
  


