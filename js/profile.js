document.addEventListener("DOMContentLoaded", function () {
    loadUserProfile();
});// Load user profile when page loads

function loadUserProfile() {
    let userData = localStorage.getItem("loggedInUser");

    if (userData) {
        let loggedInUser = JSON.parse(userData);

        // ✅ Ensure elements exist before updating
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

    if (!email || !newName) {
        alert("Please fill in all fields!");
        return;
    }

    if (newPassword && newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // ✅ Update local storage
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

            let updateData = { name: newName };
            if (newPassword) {
                updateData.password = newPassword; // Add password update only if entered
                updateData.confirmPassword = newPassword
            }

            // ✅ Update user profile in RestDB
            await fetch(`https://fedest-f892.restdb.io/rest/signup/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY
                },
                body: JSON.stringify(updateData)
            });

            alert("Profile updated successfully!");
            document.getElementById("editProfileModal").querySelector(".btn-close").click();
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
