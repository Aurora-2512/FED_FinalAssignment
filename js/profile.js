document.addEventListener("DOMContentLoaded", function () {
    loadUserProfile(); // Load user profile when page loads
});

/**
 * Function to Log In User and Store in Local Storage
 */
function loginUser(email, name) {
    console.log("Logging in user:", name, email);
    
    // Store user details in localStorage
    localStorage.setItem("loggedInUser", JSON.stringify({ email, name }));

    // Update the UI immediately
    loadUserProfile();
}

/**
 * Function to Load User Profile from Local Storage
 */
function loadUserProfile() {
    let userData = localStorage.getItem("loggedInUser");
    let profileImage = localStorage.getItem("profileImage"); // Load profile image

    if (userData) {
        let loggedInUser = JSON.parse(userData);

        // Ensure elements exist before updating them
        let userNameElement = document.getElementById("userName");
        let editEmailElement = document.getElementById("editEmail");
        let profileImageElement = document.getElementById("profileImage");

        if (userNameElement) userNameElement.innerText = loggedInUser.name || "Guest";
        if (editEmailElement) {
            editEmailElement.value = loggedInUser.email || "No Email Found";
            editEmailElement.readOnly = true; // Make email field non-editable
        }
        if (profileImageElement && profileImage) {
            profileImageElement.src = profileImage;
        }
    } else {
        document.getElementById("userName").innerText = "Guest";
        document.getElementById("editEmail").value = "No Email Found";
    }
}


/**
 * Function to Open Edit Profile Modal
 */
function openEditModal() {
    var editModal = new bootstrap.Modal(document.getElementById("editProfileModal"));
    editModal.show();
}



/**
 * Function to Update Profile Information and Save to Local Storage
 */
function updateProfile() {
    let newName = document.getElementById("editName").value.trim();
    let newPassword = document.getElementById("editPassword").value.trim();
    let confirmPassword = document.getElementById("editConfirmPassword").value.trim();
    let email = document.getElementById("editEmail").value.trim();

    if (!email || !newName || !newPassword || !confirmPassword) {
        alert("Please fill in all fields!");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Update local storage with new name
    let userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (userData) {
        userData.name = newName;
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        loadUserProfile(); // Refresh UI with updated name
    }

    // Update password in RestDB
    fetch(`https://fedest-f892.restdb.io/rest/signup?q={"email":"${email}"}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": "6793aa081128e046e96abe67"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            let userId = data[0]._id;

            fetch(`https://fedest-f892.restdb.io/rest/signup/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": "6793aa081128e046e96abe67"
                },
                body: JSON.stringify({ name: newName, password: newPassword })
            })
            .then(() => {
                alert("Profile updated successfully!");
                var editModal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
                editModal.hide();
            })
            .catch(error => console.error("Error updating profile:", error));
        }
    });
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
