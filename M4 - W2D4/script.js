function fetchBooks() {
    fetch("https://striveschool-api.herokuapp.com/books")
        .then(response => response.json())  // Modo per formattare le risposte in maniera più corretta
        .then(res => { // `res` sta per `response` e rappresenta i dati trasformati di `raw.json`, risposta in questo caso del fetch

            let popoBooks = res;
            console.log(popoBooks);
            let items = document.querySelector("#productContainer"); // Seleziono l'elemento ID col metodo querySelector

            items.innerHTML = popoBooks.map((element) => {  // Con la funzione map, creo un array di elementi HTML, elementi presi dalla variabile `popoBooks`
                return ` 
                <div class='col col-3'>
                    <div class="card mb-4 shadow-sm" id='book_${element.asin}'>
                        <img src='${element.img}' alt='${element.title}'>
                        <div class="card-body">
                            <h5 class="card-title text-truncate">${element.title}</h5>
                            <p class="card-text d-flex justify-content-around">
                                <strong class="text-danger ">${element.price}€</strong>
                                <span class="badge bg-success ms-12 text-uppercase">${element.category}</span>
                            </p>
                        </div>
                        <div class="d-flex justify-content-around">
                            <span class="text-muted ms-2">ASIN:${element.asin}</span>
                            <button class='btn btn-primary' id="btn" onclick="addToCart('${element.title}','${element.price}','${element.asin}')">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                `;
            }).join('') // Con la funzione join, unisco gli elementi HTML in un unico stringa
        })
        .catch(error => console.log(error));
}

fetchBooks()


// Array globale per memorizzare gli articoli del carrello
let carrello = [];


function addToCart(title, price, asin) {

    const card = document.querySelector('#book_' + asin);
    card.style.opacity = 0.5;
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");


    cartItems.innerHTML += `<div class="d-flex justify-content-between align-items-center mb-3">
                               <div>
                                  <h6>${title}</h6>
                                  <span>${price}€</span>
                               </div>
                               <div>
                                   <span class="badge bg-success">${price}€</span>
                                   <button class="btn btn-danger" onclick="removeFromCart('${asin}')">
                                      <i class="fas fa-trash"></i>
                                   </button>
                               </div>
                            </div>`;
    cartTotal.innerHTML = Number(cartTotal.innerHTML) + Number(price);
    showNotification(title) // Funzione per mostrare una notifica "toast"
    aggiornaContatoreCarrello() // Funzione per aggiornare il badge del carrello
}


function showNotification(title) {
    // Crea e mostra una notifica "toast" Bootstrap temporaneo
    // Uso setTimeOut per far sì che la notifica sia visibile per 3 secondi

    const newToast = document.querySelector(".toast")
    if (newToast) { //Rimuovi toast precedente (se presenti)
        newToast.remove();

    }
    const toastHTMl = `<div id="toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                       <div class="toast-header">
                          <strong class="me-auto">${title}</strong>
                          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                       </div>
                       <div class="toast-body">
                          ${title} aggiunto al carrello
                      </div>
                 </div>`;

    document.body.insertAdjacentHTML("beforeend", toastHTMl);

    // Inizializza e mostra il toast
    const toastElement = document.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Rimuovi toast dopo 3 secondi
    setTimeout(() => {
        const toast = document.querySelector(".toast")
        if (toast) {
            toast.remove()
        }
    }, 3000);// Imposto un timer di 3 secondi per far sì che la notifica sia visibile per 3 secondi, 3000 è il numero di millisecondi
}

function aggiornaContatoreCarrello() {

    const badge = document.querySelector(".badge")
    badge.textContent = (Number(badge.textContent) + 1)

}

function searchBooks(event) {

    let tasto = event.target.value
    let allTitles = document.querySelectorAll(".card-title")
    console.log(tasto, allTitles[0].textContent.toLowerCase().includes(tasto.toLowerCase()));


    allTitles.forEach(titolo => { // "Titolo" è il parametro che viene passato alla funzione forEach, "titolo" è ongi singolo elemento con classe "card-title"

        let parent = titolo.parentElement.parentElement.parentElement // "parentElement" è una proprietà che permette di accedere all'elemento padre di un elemento specifico, in questo caso il padre di "titolo" è "card", (il padre di "card" è "col")
        console.log(parent);

        if (!titolo.textContent.toLowerCase().includes(tasto.toLowerCase())) { // in questa riga di codice si converte il testo e il titolo cercato in minuscolo per un confronto case-insensitive; verifica se "tasto" è contenuto nel titolo del libro; col "!" si inverte la condizione
            parent.style.display = "none"
        }
        else {
            parent.style.display = "block"
        }
    })
}

function removeFromCart(asin) {

    // Riabilita l'opacità del libro
    const bookCard = document.querySelector('#book_' + asin);
    bookCard.style.opacity = 1;

    // Find and remove only the specific cart item
    const cartItem = document.querySelector(`#cartItems div:has(button[onclick="removeFromCart('${asin}')"])`);
    if (cartItem) {
        // Update the total price
        const priceElement = cartItem.querySelector('.badge');// Prendo il numero del carrello
        const price = Number(priceElement.textContent.replace('€', '')); // Creo una variabile "price" che è uguale alla stringa in numero e con replace tolgo il simbolo €
        const cartTotal = document.getElementById("cartTotal"); // Creo una variabile "cartTotal" che è uguale alla stringa in numero
        cartTotal.innerHTML = (Number(cartTotal.innerHTML) - price).toFixed(2); // Metto dentro la variabile "cartTotal" il totale meno il prezzo del libro; toFixed(2) serve per arrotondare il numero a 2 decimali, in questo caso 

        // Remove the item
        cartItem.remove();

        // Update cart counter
        const badge = document.querySelector(".badge"); // Creo una variabile "badge" che è uguale alla stringa in numero
        badge.textContent = (Number(badge.textContent) - 1);// Metto dentro la variabile "badge" il numero del carrello meno 1
    }
}

function clearCart() {
    const cartItems = document.getElementById("cartItems")
    cartItems.innerHTML = ""  

    const cartTotal = document.getElementById("cartTotal")
    cartTotal.innerHTML = "0.00"

    const badge = document.querySelector(".badge")
    badge.textContent = "0"

    // Reset opacity for all books
    const allBooks = document.querySelectorAll('.card'); //Creo una variabile "allBooks" che contiene tutti gli elementi con la classe "card"
    allBooks.forEach(book => { //Con la funzione foeEach, passo il parametro "book" ad "allBooks" e gli dico che lo stile di ogni elemento deve avere opacità 1
        book.style.opacity = 1;
    });
}
