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
    { id:15,image: "image/airpods.jpg", category: "Electronics", title: "Airpods Pro 2", price: "450"},
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

    productId = parseInt(productId);

    const product = listings.find(item => item.id === productId);
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

        if (!data || data.length === 0) {
            console.error("No product found with this ID!");
            return;
        }

        const productData = data[0]; // Get first product match

        // Fill modal with product details
        document.getElementById("modalListingId").value = productData.id || "";
        document.getElementById("sellerEmail").value = productData.email || "";
        document.getElementById("modalImage").src = product.image || "default.jpg";
        document.getElementById("modalTitle").innerText = productData.title || "N/A";
        document.getElementById("modalCategory").innerText = productData.category || "N/A";
        document.getElementById("modalSize").innerText = productData.size || "N/A";
        document.getElementById("modalPrice").innerText = `$${productData.price || "0.00"}`;
        document.getElementById("modalType").innerText = productData.type || "N/A";
        document.getElementById("modalCondition").innerText = productData.condition || "N/A";

        const chatButton = document.getElementById("chatSeller");
        chatButton.setAttribute("data-email", productData.email || "");
        chatButton.onclick = () => startChat(productData.email);

        if (productData.email) {
            fetchSellerInfo(productData.email);
        } else {
            document.getElementById("sellerName").innerText = "Unknown";
            document.getElementById("sellerContact").innerText = "Not available";
        }

        // Fetch and Display Reviews
        fetchReviews(productData.id);

        // **Fix:** Ensure the modal is correctly initialized and opened
        let modalElement = document.getElementById("productModal");
        let modal = new bootstrap.Modal(modalElement);
        modal.show();

    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}


//document.getElementById("searchInput").addEventListener("input", filterListings);

async function fetchSellerInfo(sellerEmail) {
    if (!sellerEmail) {
        console.warn("No seller email found.");
        return;
    }

    try {
        console.log("Fetching seller info for email:", sellerEmail);

        // Fetch seller info from the signup database using email
        const response = await fetch(`https://fedest-f892.restdb.io/rest/signup?q={"email":"${sellerEmail}"}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-apikey": APIKEY }
        });

        if (!response.ok) throw new Error("Failed to fetch seller info");
        const data = await response.json();

        if (data.length === 0) {
            console.warn("Seller not found.");
            document.getElementById("sellerName").innerText = "Unknown";
            document.getElementById("sellerContact").innerText = "Not available";
            return;
        }

        // Update Seller Info in Modal
        document.getElementById("sellerName").innerText = data[0].name || "Unknown";
        document.getElementById("sellerContact").innerText = data[0].email || "Not available";

    } catch (error) {
        console.error("Error fetching seller info:", error);
    }
}

let currentSellerName = "";
let currentSellerEmail = "";

// 📌 Open Chat Box (with Seller Name)
async function startChat(sellerEmail) {
    if (!sellerEmail || sellerEmail === "Not Available") {
        alert("❌ Seller contact not available.");
        return;
    }

    // Fetch seller name from database
    try {
        const response = await fetch(`https://fedest-f892.restdb.io/rest/signup?q={"email":"${sellerEmail}"}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-apikey": APIKEY }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                currentSellerName = data[0].name || sellerEmail;
            } else {
                currentSellerName = sellerEmail;
            }
        } else {
            currentSellerName = sellerEmail;
        }
    } catch (error) {
        console.error("❌ Error fetching seller name:", error);
        currentSellerName = sellerEmail;
    }

    // Update UI
    document.getElementById("chatSellerName").innerText = `Chat with ${currentSellerName}`;
    currentSellerEmail = sellerEmail;
    loadChatMessages(sellerEmail);

    let chatBox = document.getElementById("chatBoxContainer");
    chatBox.style.display = "flex"; // Show chat box
    chatBox.style.zIndex = "4000"; // Ensure it is above the modal
}


// 📌 Close Chat Box
function closeChat() {
    document.getElementById("chatBoxContainer").style.display = "none";
}

// 📌 Send Message
function sendMessage() {
    let chatInput = document.getElementById("chatInput");
    let message = chatInput.value.trim();
    if (message === "") return;

    let userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!userData) {
        alert("You must be logged in to send messages!");
        return;
    }

    let newMessage = {
        sender: userData.email,
        senderName: userData.name || "You",
        receiver: currentSellerEmail,
        receiverName: currentSellerName,
        message: message,
        timestamp: new Date().toISOString()
    };

    // Store message in LocalStorage (for testing)
    let chatHistory = JSON.parse(localStorage.getItem(`chat_${currentSellerEmail}`)) || [];
    chatHistory.push(newMessage);
    localStorage.setItem(`chat_${currentSellerEmail}`, JSON.stringify(chatHistory));

    displayMessage(newMessage, true);
    chatInput.value = "";
}

// 📌 Display Chat Messages
function displayMessage(messageData, isNew = false) {
    let chatMessages = document.getElementById("chatMessages");
    let messageDiv = document.createElement("div");

    let isSender = messageData.sender === JSON.parse(localStorage.getItem("loggedInUser")).email;
    messageDiv.className = isSender ? "chat-message sender-message" : "chat-message receiver-message";

    messageDiv.innerHTML = `<strong>${isSender ? "You" : messageData.senderName}:</strong> ${messageData.message}`;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// 📌 Load Chat History
function loadChatMessages(sellerEmail) {
    let chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = "";

    let chatHistory = JSON.parse(localStorage.getItem(`chat_${sellerEmail}`)) || [];
    chatHistory.forEach(msg => displayMessage(msg));
}

document.addEventListener("DOMContentLoaded", () => {
    let chatInput = document.getElementById("chatInput");

if (!chatInput) {
    console.error("❌ chatInput NOT found!");
} else {
    console.log("✅ chatInput found!");
    chatInput.style.pointerEvents = "auto";
    chatInput.style.opacity = "1"; // Make sure it's visible
    chatInput.focus(); // Try to focus it
}

});


async function fetchReviews(listingId) {
    try {
        console.log(`📡 Fetching reviews for listing ID: ${listingId}`);

        // Fetch reviews for the listing
        const response = await fetch(`https://fedest-f892.restdb.io/rest/reviews?q={"listing_id":"${listingId}"}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-apikey": APIKEY }
        });

        if (!response.ok) throw new Error(`Failed to fetch reviews. Status: ${response.status}`);

        const reviews = await response.json();
        console.log("🔍 Reviews fetched:", reviews); // Debugging line

        const reviewList = document.getElementById("reviewList");
        reviewList.innerHTML = ""; // Clear previous reviews

        if (reviews.length === 0) {
            reviewList.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
            return;
        }

        // 🔄 Fetch buyer names and display reviews
        for (const review of reviews) {
            console.log("Review fetched:", review); // Debugging line
            const buyerEmail = review.buyer_email;

            // Fetch buyer name from signup database
            const userResponse = await fetch(`https://fedest-f892.restdb.io/rest/signup?q={"email":"${buyerEmail}"}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "x-apikey": APIKEY }
            });

            let buyerName = "Anonymous"; // Default name
            if (userResponse.ok) {
                const userData = await userResponse.json();
                if (userData.length > 0) {
                    buyerName = userData[0].name || "Anonymous"; // Get name if available
                }
            }

            //  Display review with writer’s name
            const reviewItem = document.createElement("div");
            reviewItem.className = "review-item";
            reviewItem.innerHTML = `
                <p><strong>${buyerName}:</strong> ${review.message}</p>
                <hr>
            `;
            reviewList.appendChild(reviewItem);
        }

    } catch (error) {
        console.error(" Error fetching reviews:", error);
        document.getElementById("reviewList").innerHTML = "<p>Error loading reviews. Try again later.</p>";
    }
}

//<p><strong>Seller:</strong> ${review.seller_email}</p>

async function submitReview() {
    let userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!userData) {
        alert("You must be logged in to leave a review!");
        return;
    }

    const listingTitle = document.getElementById("modalTitle").innerText.trim();
    const reviewText = document.getElementById("reviewText").value.trim();

    if (!reviewText) {
        alert("Please enter a review!");
        return;
    }

    try {
        // Fetch the listing ID and seller email from the database
        const listingResponse = await fetch(`https://fedest-f892.restdb.io/rest/listing?q={"title":"${listingTitle}"}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-apikey": APIKEY }
        });

        if (!listingResponse.ok) throw new Error(`Failed to fetch listing. Status: ${listingResponse.status}`);
        const listingData = await listingResponse.json();

        if (listingData.length === 0) {
            console.error("Error: Listing not found in database.");
            alert("Error: Listing not found.");
            return;
        }

        // Get the correct listing ID and seller email
        const listingId = listingData[0].id;
        const sellerEmail = listingData[0].email || "Not Available";
        const buyerEmail = userData.email;

        console.log("Submitting Review - Listing ID:", listingId, "🛒 Seller Email:", sellerEmail);

        // Construct review object
        let newReview = {
            listing_id: listingId,
            buyer_email: buyerEmail,
            seller_email: sellerEmail,
            message: reviewText,
            createdate: new Date().toISOString()
        };

        // 📡 Send review to RestDB
        let reviewResponse = await fetch("https://fedest-f892.restdb.io/rest/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            },
            body: JSON.stringify(newReview)
        });

        if (!reviewResponse.ok) {
            throw new Error(`Failed to submit review. Status: ${reviewResponse.status}`);
        }

        let reviewData = await reviewResponse.json();
        console.log(" Review added successfully:", reviewData);

        alert("Review submitted successfully!");

        // 🔄 Refresh Reviews
        fetchReviews(listingId);
        document.getElementById("reviewText").value = ""; // Clear input

    } catch (error) {
        console.error(" Error submitting review:", error);
        alert(`Error submitting review: ${error.message}`);
    }
}

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
    
    let userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!userData) {
        alert("You must be logged in to create a listing!");
        return;
    }
    let userEmail = userData.email;
    if (!title || !category || !price || !type || !condition || !imageInput) {
        alert("Please fill in all required fields!");
        return;
    }

    //let maxId = listings.length > 0 ? Math.max(...listings.map(l => l.id)) : 0;
    //let newId = maxId + 1;
    
    let response = await fetch("https://fedest-f892.restdb.io/rest/listing", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY
        }
    });
    let listingsData = await response.json();
    let newId = listingsData.length + 1; // Increment based on total count

    let imageUrl = URL.createObjectURL(imageInput);
    
    let newListing = {
        id: newId,
        image: imageUrl,
        category,
        title,
        price,
        createdAt: new Date().toISOString(), // Store timestamp
        email:userEmail
    };
    let storedListings = JSON.parse(localStorage.getItem(`newListings_${userEmail}`)) || [];
    
    if (storedListings.length >= 30) {
        alert("You have reached the maximum limit of 30 listings!");
        return;
    }

    storedListings.push(newListing);
    listings.push(newListing);
    localStorage.setItem(`newListings_${userEmail}`, JSON.stringify(storedListings));
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
        let DBresponse = await fetch("https://fedest-f892.restdb.io/rest/listing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            },
            body: JSON.stringify(dbData)
        });

        let data = await DBresponse.json();
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
    let userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!userData) {
        console.warn("No user logged in. Cannot load listings.");
        return;
    }
    let userEmail = userData.email;

    const profileContainer = document.getElementById("profileListings"); // Ensure this is your container
    profileContainer.innerHTML = ""; // Clear the container before appending
    
    let storedListings = JSON.parse(localStorage.getItem(`newListings_${userEmail}`)) || [];
    
    // Filter out listings older than 30 days
    let now = new Date();
    storedListings = storedListings.filter(listing => {
        let listingDate = new Date(listing.createdAt);
        let diffDays = (now - listingDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
    });

    storedListings = storedListings.slice(0, 30);

    localStorage.setItem(`newListings_${userEmail}`, JSON.stringify(storedListings));

    storedListings.forEach((listing) => {
        const item = document.createElement("div");
        item.className = "listing-box";
        item.innerHTML = `
            <div class="profile-listing-card">
                <img src="${listing.image}" alt="${listing.title}" class="listing-image">
                <p class="listing-title">${listing.title}</p>
            </div>
        `;
        profileContainer.appendChild(item);
    });
}
// Load Listings on Page Load
document.addEventListener("DOMContentLoaded", () => {
    
    displayListings(listings);
    displayProfileListings();
});
/*document.addEventListener("DOMContentLoaded", () => {
    displayProfileListings();
});*/





