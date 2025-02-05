const APIKEY = "6793aa081128e046e96abe67";
let listings = [
    { id:1,image: "image/smartphone.jpeg", category: "Electronics", title: "Samsung Galaxy A52", price: "250" },
    { id:2,image: "image/dji_osmo_pocket.jpg", category: "Electronics", title: "Pocket Camera", price: "150" },
    { id:3,image: "image/denim_jacket.jpg", category: "Fashion", title: "Designer Jacket", price: "270" },
    { id:4,image: "image/bicycle.jpg", category: "Vehicles", title: "Bicycle", price: "400" },
    { id:5,image: "image/white_stripe_trousers.jpg",category: "Fashion", title: "Trousers", price: "65" },
    { id:6,image: "image/Sony_headphones.jpg", category: "Electronics", title: "Sony Headphones", price: "350"},
    { id:7,image: "image/smartphone.jpeg", category: "Electronics", title: "Samsung Galaxy A52", price: "250" },
    { id:8,image: "image/gardening_tool.jpg",category: "Home & Garden", title: "Garden Tools", price: "50" },
    { id:9,image: "image/gray_cargopants.jpg", category: "Fashion", title: "Cargo Pants", price: "50" },
    { id:10,image: "image/jbl_headphone.jpg", category: "Electornics", title: "JBL Headphones", price: "300" },
    { id:11,image: "image/scooter.jpg", category: "Vehicles", title: "Scooter", price: "200" },
    { id:12,image: "image/soil.jpg", category: "Home & Garden", title: "Potting Soil", price: "40"},
    { id:13,image: "image/bracelet.jpg", category: "Fashion", title: "Vintage Bracelet", price: "250"},
    { id:14,image: "image/hanging_pots.jpg", category: "Home & Garden", title: "Indoor Hanging Pots", price: "35"},
    { id:15,image: "image/airpods.jpg", category: "Electronics", title: "Airpods Pro 2", price: "450"},
];


// Function to Load Listings from RestDB
/*async function loadListings() {
    console.log("Loading listings from JavaScript array...");
    displayListings(listings); // Initial display

}*/

// Function to Display Listings
function displayListings(filteredListings) {
    const listingsContainer = document.getElementById("featuredListings");
    listingsContainer.innerHTML = ""; // Clear existing listings

    filteredListings.forEach(listing => {
        // Ensure image retrieval is correct
        let imageUrl = listing.image ? listing.image : 'default.jpg';

        const item = document.createElement("div");
        item.className = "masonry-item";
        item.innerHTML = `
            <div class="card" onclick="openProductDetail('${listing.id}')">
                <img src="${imageUrl}" alt="Product Image" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${listing.title}</h5>
                    <p class="card-text">$${listing.price}</p>
                </div>
            </div>
        `;
        listingsContainer.appendChild(item);
    });
}

// Function to Sort Listings
function sortListings(criteria, order) {
    let sortedListings = [...listings]; // Create a copy of listings

    sortedListings.sort((a, b) => {
        let valA = a[criteria]?.toString().toLowerCase() || "";
        let valB = b[criteria]?.toString().toLowerCase() || "";

        if (order === "asc") return valA.localeCompare(valB);
        else return valB.localeCompare(valA);
    });

    displayListings(sortedListings);
}

// Function to Filter Listings
function filterListings() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filteredListings = listings.filter(listing => 
        listing.title.toLowerCase().includes(query) || listing.category.toLowerCase().includes(query)
    );
    displayListings(filteredListings);
}

// Function to Filter by Category
function filterByCategory(category) {
    const filteredListings = listings.filter(listing => listing.category.toLowerCase() === category.toLowerCase());
    displayListings(filteredListings);
}


// Function to Open Product Details Modal
async function openProductDetail(productId) {
    console.log(`Fetching product details for ID: ${productId}`);

    const product = listings.find(item => item.id === parseInt(productId));
    if (!product) {
        console.error("Product not found in JavaScript list!");
        return;
    }

    try {
        const response = await fetch(`https://fedest-f892.restdb.io/rest/listing?q={"id":${productId}}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });

        if (!response.ok) throw new Error("Failed to fetch product details");
        const data = await response.json();

        if (data.length === 0) {
            console.error("No product found with this ID!");
            return;
        }

        const productData = data[0]; // Get first product match

        // Fill modal with product details
        document.getElementById("modalImage").src = product.image;
        document.getElementById("modalTitle").innerText = productData.title || "N/A";
        document.getElementById("modalCategory").innerText = productData.category || "N/A";
        document.getElementById("modalSize").innerText = productData.size || "N/A";
        document.getElementById("modalPrice").innerText = `${productData.price || "0.00"}`;
        document.getElementById("modalType").innerText = productData.type || "N/A";
        document.getElementById("modalCondition").innerText = productData.condition || "N/A";

    
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById("productModal"));
        modal.show();

    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}

//document.getElementById("searchInput").addEventListener("input", filterListings);


// Load Listings on Page Load
document.addEventListener("DOMContentLoaded", () => {
    
    displayListings(listings);
    displayProfileListings(newListing);
});



// Fetch seller info if available
        /*if (data.seller_id) {
            const sellerResponse = await fetch(`https://fedest-f892.restdb.io/rest/seller/${data.seller_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY
                }
            });

            const sellerData = await sellerResponse.json();
            document.getElementById("modalSeller").innerText = sellerData.name ? `Seller: ${sellerData.name}, Contact: ${sellerData.contact}` : "Seller information not available.";
        } else {
            document.getElementById("modalSeller").innerText = "Seller information not available.";
        }*/

           /* async function loadSellerInfo(sellerId) {
                try {
                    const response = await fetch(`https://fedest-f892.restdb.io/rest/signup/${sellerId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "x-apikey": APIKEY
                        }
                    });
            
                    if (!response.ok) throw new Error("Failed to fetch seller details");
                    const sellerData = await response.json();
            
                    document.getElementById(`seller_${sellerId}`).innerText = `${sellerData.name}, Contact: ${sellerData.contact}`;
                } catch (error) {
                    console.error("Error fetching seller details:", error);
                    document.getElementById(`seller_${sellerId}`).innerText = "Seller info not available";
                }
            }*/



// Function to Open Create Listing Modal
function openCreateListingModal() {
    var listingModal = new bootstrap.Modal(document.getElementById("createListingModal"));
    listingModal.show();
}

let newListings = JSON.parse(localStorage.getItem("newListings")) || []; 

// Function to Create a New Listing
async function createListing() {
    const title = document.getElementById("listingTitle").value;
    const category = document.getElementById("listingCategory").value;
    const size= document.getElementById("listingSize").value;
    const price = document.getElementById("listingPrice").value;
    const type = document.getElementById("listingType").value;
    const condition = document.getElementById("listingCondition").value;
    const imageInput = document.getElementById("listingImage").files[0];

    if (!title || !category || !price || !type || !condition || !imageInput) {
        alert("Please fill in all required fields!");
        return;
    }

    let maxId = listings.length > 0 ? Math.max(...listings.map(l => l.id)) : 0;
    let newId = maxId + 1;

    let imageUrl = URL.createObjectURL(imageInput);
    
    let newListing = {
        id: newId,
        image: imageUrl,
        category,
        title,
        price
    };
    let storedListings = JSON.parse(localStorage.getItem("newListings")) || [];
    
    if (storedListings.length >= 30) {
        alert("You have reached the maximum limit of 30 listings!");
        return;
    }

    newListings.push(newListing);
    listings.push(newListing);
    localStorage.setItem("newListings", JSON.stringify(newListings));
    displayProfileListings(); // Show in profile

    let dbData = {
        id: newId,
        title,
        category,
        size,
        price,
        type,
        condition
    };

    try {
        let response = await fetch("https://fedest-f892.restdb.io/rest/listing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            },
            body: JSON.stringify(dbData)
        });

        let data = await response.json();
        console.log("Listing saved to database:", data);
        alert("Listing added successfully!");
    } catch (error) {
        console.error("Error saving to database:", error);
        alert("Failed to save listing. Please try again.");
    }



    // Clear form and close modal
    document.getElementById("listingTitle").value = "";
    document.getElementById("listingCategory").value = "";
    document.getElementById("listingSize").value = "";
    document.getElementById("listingPrice").value = "";
    document.getElementById("listingType").value = "";
    document.getElementById("listingCondition").value = "";
    document.getElementById("listingImage").value = "";

    alert("Listing added successfully!");
    document.getElementById("createListingModal").querySelector(".btn-close").click();
}
    
function displayProfileListings() {
    const profileContainer = document.getElementById("profileListings"); // Ensure this is your container
    profileContainer.innerHTML = ""; // Clear the container before appending
    
    let storedListings = JSON.parse(localStorage.getItem("newListings")) || [];

    // Limit to 30 listings
    let listingsToShow = storedListings.slice(0, 30);

    listingsToShow.forEach((listing) => {
        const item = document.createElement("div");
        item.className = "listing-box"; // Make sure this matches your CSS
        item.innerHTML = `
            <div class="profile-listing-card">
                <img src="${listing.image}" alt="${listing.title}" class="listing-image">
                <p class="listing-title">${listing.title}</p>
                
            </div>
        `;
        profileContainer.appendChild(item);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    displayProfileListings();
});



