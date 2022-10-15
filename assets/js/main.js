
// Create our variables. One will be a simulation of a database and the second the shopping cart, each with its items and its methods.
const db = {
    methods: {
        // Find an item by id
        find: (id) => {
            return db.items.find(item => item.id == id);
        },
        // Remove an item with his id and the quantity asked
        remove: (items) => {
            items.forEach(item => {
                const product = db.methods.find(item.id);
                product.qty = product.qty - item.qty;
            });
        },
    },
    items: [
        {
            id:0,
            title: 'Sunglasses',
            price: 250,
            qty: 50,
        },
        {
            id:1,
            title: 'Guitar',
            price: 420,
            qty: 15,
        },
        {
            id:2,
            title: 'Flight to Paris',
            price: 1330,
            qty: 5,
        },
    ],
};

const shoppingCart = {
    items: [],
    methods: {
        // Add a product to the shopping cart
        add: (id, qty) => {
            const cartItem = shoppingCart.methods.get(id);

            if(cartItem){
                if(shoppingCart.methods.hasInventory(id,qty + cartItem.qty)){
                    cartItem.qty += qty;
                }else{
                    alert('There is not enough inventory');
                };
            }else{
                shoppingCart.items.push({id, qty});
            };
        },

        // Remove the cuantity of the cart if we cant delete more then we delete the item from the cart
        remove: (id, qty) => {
            const cartItem = shoppingCart.methods.get(id);

            if(cartItem.qty - qty > 0){
                cartItem.qty -= qty;
            }else{
                shoppingCart.items = shoppingCart.items.filter(item => item.id != id);
            };
        },
    
        // To count each item and have all the same items grouped
        count: () => {
            return shoppingCart.items.reduce((acc, item) => acc +item.qty, 0);
        },

        // Get the id of the selected product 
        get: (id) => {
            const index = shoppingCart.items.findIndex(item => item.id == id);
            return index >= 0 ? shoppingCart.items[index] : null;
        },


        getTotal: () => {
            const total = shoppingCart.items.reduce((acc, item) =>{
                const found = db.methods.find(item.id);
                return (acc + found.price * item.qty);
            }, 0);

            return total;
        },

        // Check if the shop have enough inventory
        hasInventory: (id, qty) => {
            return db.items.find(item => item.id == id).qty - qty >= 0;
        },

        // Update out db
        purchase: () => {
            db.methods.remove(shoppingCart.items);
            shoppingCart.items = [];
        },
    },
};

// Start the Store
renderStore();

// Render the structure of the items
function renderStore(){
    const html = db.items.map(item => {
        return `
            <div class="item">
                <div class="title">${item.title}</div>
                <div class="price">${priceInCart(item.price)}</div>
                <div class="qty">${item.qty} units</div>
                
                <div class="actions">
                    <button class="add" data-id="${item.id}">Add to Cart</button>
                </div>
            </div>
        `;
    });

    document.querySelector('#store-container').innerHTML = html.join("");

    document.querySelectorAll('.item .actions .add').forEach(button => {
        button.addEventListener('click', e => {
            const id = parseInt(button.getAttribute('data-id'));
            const item = db.methods.find(id);

            if(item && item.qty -1 >= 0){
                // Add to cart
                shoppingCart.methods.add(id, 1);
                renderShoppingCart();
            }else{
                alert('There is not enough inventory');
            }
        });
    });
};

// Use an API to put format into the price in the cart
function priceInCart(n){
    return new Intl.NumberFormat('es-US', {
        maximumSignificantDigits:2,
        style: 'currency',
        currency: 'USD',
    }).format(n);
};

// Structure in the shopping cart
function renderShoppingCart(){
    const html = shoppingCart.items.map(item => {
        const dbItem = db.methods.find(item.id); 
        return `
            <div class="item">
                <div class="title">${dbItem.title}</div>
                <div class="price">${priceInCart(dbItem.price)}</div>
                <div class="qty">${item.qty} units</div>
                <div class="subtotal">
                    Subtotal: ${priceInCart(item.qty * dbItem.price)}
                </div>

                <div class="actions">
                    <button class="addOne" data-id="${item.id}">+</button>
                    <button class="removeOne" data-id="${item.id}">-</button>
                </div>
            </div>
        `;
    });

    // Structure of close button
    const closeButton = `
        <div class="cart-header">
            <button class="bClose">Close</button>
        </div>
    `;

    // Structure of purchase button
    const purchaseButton = shoppingCart.items.length > 0 ? `
        <div class="cart-actions">
            <button class="bPurchase">Purchase</button>
        </div>
    ` : "";

    // Structure of the total price
    const total = shoppingCart.methods.getTotal();
    const totalContainer = `
        <div class="total">
            Total: ${priceInCart(total)}
        </div>
    `;

    const shoppingCartContainer = document.querySelector('#shopping-cart-container');

    shoppingCartContainer.classList.remove("hide");
    shoppingCartContainer.classList.add("show");

    shoppingCartContainer.innerHTML = closeButton + html.join('') + totalContainer + purchaseButton;

    // Add one item to the shopping cart
    document.querySelectorAll('.addOne').forEach(button =>{
        button.addEventListener('click', (e) =>{
            const id = parseInt(button.getAttribute('data-id'));
            shoppingCart.methods.add(id, 1);
            renderShoppingCart();
        });
    });

    // Remove one item from the shopping cart
    document.querySelectorAll('.removeOne').forEach(button =>{
        button.addEventListener('click', (e) =>{
            const id = parseInt(button.getAttribute('data-id'));
            shoppingCart.methods.remove(id, 1);
            renderShoppingCart();
        });
    });

    // Is going to hide the shopping cart
    document.querySelector('.bClose').addEventListener('click', (e) =>{
        shoppingCartContainer.classList.remove("show");
        shoppingCartContainer.classList.add("hide");
    });

    // This button is going to appear if we have something in the cart and is going to but all the cart
    const bPurchase = document.querySelector('.bPurchase');
    if(bPurchase){
        bPurchase.addEventListener('click', (e) =>{
            shoppingCart.methods.purchase();
            renderStore();
            renderShoppingCart();
        });
    };
};









