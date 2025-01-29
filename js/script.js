
const listings = [
    { image: "image/smartphone.jpeg", category: "Electronics", title: "Samsung Galaxy A52", price: "$250" },
    { image: "image/dji_osmo_pocket.jpg", category: "Electronics", title: "Garden Tools", price: "$50" },
    { image: "image/gray_cargopants.jpg", category: "Fashion", title: "Designer Jacket", price: "$100" },
    { image: "image/jbl_headphone.jpg", category: "Electronics", title: "Bicycle", price: "$200" },
    { image: "image/white_stripe_trousers.jpg",category: "Vehicles", title: "Bicycle", price: "$200" },
    { image: "image/Sony_headphones.jpg", category: "Electronics", title: "Sony Headphones"},
    { image: "image/smartphone.jpeg", category: "Electronics", title: "Samsung Galaxy A52", price: "$250" },
    { image: "image/dji_osmo_pocket.jpg",category: "Electronics", title: "Garden Tools", price: "$50" },
    { image: "image/gray_cargopants.jpg", category: "Fashion", title: "Designer Jacket", price: "$100" },
    { image: "image/jbl_headphone.jpg", category: "Electronics", title: "Bicycle", price: "$200" },
    { image: "image/white_stripe_trousers.jpg", category: "Vehicles", title: "Bicycle", price: "$200" },
    { image: "image/Sony_headphones.jpg", category: "Electronics", title: "Sony Headphones"}

];
//looping
const featuredListingsContainer = document.getElementById("featuredListings");
const searchInput = document.getElementById("searchInput");

listings.forEach(listing => {
    const col = document.createElement("div");
    col.className = "masonry-item";
    col.innerHTML = `
        <div class="card">
            <img src="${listing.image}" class="card-img-top" alt="${listing.alt}">
            <div class="card-body">
                <h5 class="card-title">${listing.title}</h5>
                <p class="card-text">${listing.price}</p>
            </div>
        </div>
    `;
    featuredListingsContainer.appendChild(col);
});

//search function
function displayListings(filteredListings) {
    const query = searchInput.value.trim().toLowerCase();
    const featuredListingsContainer = document.getElementById("featuredListings");
    featuredListingsContainer.innerHTML = "";
    
    filteredListings.forEach(listing => {
        const item = document.createElement("div");
        item.className = "masonry-item";
        item.innerHTML = `
            <img src="${listing.image}" alt="${listing.alt}">
            <h5>${listing.title}</h5>
            <p>${listing.price}</p>
        `;
        featuredListingsContainer.appendChild(item);
    });
    }
    
    function filterListings() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filteredListings = listings.filter(listing => 
        listing.title.toLowerCase().includes(query) || listing.category.toLowerCase().includes(query)
    );
    displayListings(filteredListings);
    }
    
    function filterByCategory(category) {
        const filteredListings = listings.filter(listing => listing.category === category);
        displayListings(filteredListings);
    }
    // Load all listings initially
    displayListings(listings);
    searchInput.addEventListener("input", filterListings);




