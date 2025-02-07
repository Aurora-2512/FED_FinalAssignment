document.addEventListener("DOMContentLoaded", function () {
    loadUserProfile();
});// Load user profile when page loads

function loadUserProfile() {
    let userData = localStorage.getItem("loggedInUser");

    if (userData) {
        let loggedInUser = JSON.parse(userData);

        //Ensure elements exist before updating
        let userNameElement = document.getElementById("userName");
        let userEmailElement = document.getElementById("editEmail");

        if (userNameElement) {
            userNameElement.innerText = loggedInUser.name || "Guest";
        }
        if (userEmailElement) {
            userEmailElement.value = loggedInUser.email || "No Email Found";
        }
    } else {
        document.getElementById("userName").innerText = "Guest";
        document.getElementById("editEmail").value = "No Email Found";
    }
}

function openEditModal() {
    let userData = JSON.parse(localStorage.getItem("loggedInUser"));

    if (userData) {
        document.getElementById("editEmail").value = userData.email || "";

        // Fetch user details (name, password, confirm password) from the database
        fetch(`https://fedest-f892.restdb.io/rest/signup?q={"email":"${userData.email}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                document.getElementById("editName").value = data[0].name || "";
                document.getElementById("editPassword").value = data[0].password || "";
                document.getElementById("editConfirmPassword").value = data[0].confirmPassword || "";
            }
        })
        .catch(error => console.error("Error fetching user details:", error));
    }

    var editModal = new bootstrap.Modal(document.getElementById("editProfileModal"));
    editModal.show();
}



/**
 * Function to Update Profile Information and Save to Local Storage
 */

async function updateProfile() {
    let newName = document.getElementById("editName").value.trim();
    let email = document.getElementById("editEmail").value.trim();
    let newPassword = document.getElementById("editPassword").value.trim();
    let confirmPassword = document.getElementById("editConfirmPassword").value.trim();

    if (!email || !newName ) {
        alert("Please fill in all fields!");
        return;
    }

    if (newPassword  !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    //Update local storage
    let userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (userData) {
        userData.name = newName;
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        loadUserProfile(); // Refresh UI with updated name
    }


    try {
        let response = await fetch(`https://fedest-f892.restdb.io/rest/signup?q={"email":"${email}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });

        let data = await response.json();
        if (data.length > 0) {
            let userId = data[0]._id;

            //Update user profile in RestDB
            await fetch(`https://fedest-f892.restdb.io/rest/signup/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY
                },
                body: JSON.stringify({ 
                    name: newName, 
                    password: newPassword, 
                    confirmPassword: confirmPassword 
                })
            });

            alert("Profile updated successfully!");
            var editModal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
            editModal.hide();
        } else {
            alert("User not found in database.");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
    }
}


/**
 * Function to Open Upload Profile Picture Modal
 */
function openUploadProfileModal() {
    var uploadModal = new bootstrap.Modal(document.getElementById("uploadProfileModal"));
    uploadModal.show();
}

/**
 * Function to Save Uploaded Profile Picture
 */
function saveProfilePicture() {
    let imageInput = document.getElementById("uploadProfileImage").files[0];
    
    if (!imageInput) {
        alert("Please select an image file.");
        return;
    }

    let reader = new FileReader();
    
    reader.onload = function (event) {
        let imageDataUrl = event.target.result;

        // Save image to local storage
        localStorage.setItem("profileImage", imageDataUrl);

        // Update the UI with the new image
        let profileImageElement = document.getElementById("profileImage");
        if (profileImageElement) {
            profileImageElement.src = imageDataUrl;
        }

        alert("Profile picture updated successfully!");

        // Close the modal
        var uploadModal = bootstrap.Modal.getInstance(document.getElementById("uploadProfileModal"));
        uploadModal.hide();
    };

    reader.readAsDataURL(imageInput);
}


/**
 * Function to Log Out the User
 */
function logoutUser() {
    localStorage.clear();
    alert("You have been logged out!");
    window.location.href = "index.html";
}

function confirmDeleteAccount() {
    let confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone!");
    if (confirmation) {
        deleteAccount();
    }
}

async function deleteAccount() {
    let userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!userData) {
        alert("No user logged in.");
        return;
    }
    
    let userEmail = userData.email;
    
    try {
        // Fetch user details from RestDB
        let userResponse = await fetch(`https://fedest-f892.restdb.io/rest/signup?q={"email":"${userEmail}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });

        let userDataFromDB = await userResponse.json();
        if (userDataFromDB.length === 0) {
            alert("User not found in the database.");
            return;
        }

        let userId = userDataFromDB[0]._id; // Get the user ID

        // Step 1: Delete the user from RestDB
        await fetch(`https://fedest-f892.restdb.io/rest/signup/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });

        // Step 2: Delete all listings by this user
        await deleteUserListings(userEmail);

        // Step 3: Log out the user and clear their data
        logoutUser();
        
        alert("Account deleted successfully. You have been logged out.");
        window.location.href = "index.html"; // Redirect to home page

    } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
    }
}


async function deleteUserListings(userEmail) {
    try {
        let response = await fetch(`https://fedest-f892.restdb.io/rest/listing?q={"email":"${userEmail}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });

        let userListings = await response.json();
        
        // Delete each listing in RestDB
        for (let listing of userListings) {
            await fetch(`https://fedest-f892.restdb.io/rest/listing/${listing._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY
                }
            });
        }

        // Remove listings from localStorage
        localStorage.removeItem(`newListings_${userEmail}`);

        console.log("All user listings deleted successfully.");
    } catch (error) {
        console.error("Error deleting user listings:", error);
    }
}

async function deleteUserListings(userEmail) {
    try {
        let response = await fetch(`https://fedest-f892.restdb.io/rest/listing?q={"email":"${userEmail}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        });

        let userListings = await response.json();
        
        // Delete each listing in RestDB
        for (let listing of userListings) {
            await fetch(`https://fedest-f892.restdb.io/rest/listing/${listing._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY
                }
            });
        }

        // Remove listings from localStorage
        localStorage.removeItem(`newListings_${userEmail}`);

        console.log("All user listings deleted successfully.");
    } catch (error) {
        console.error("Error deleting user listings:", error);
    }
}
