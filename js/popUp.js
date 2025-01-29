document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "6793aa081128e046e96abe67";

    // Handle Sign-Up Form Submission
    document.getElementById("signup-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value.trim();
        const confirmPassword = document.getElementById("signup-confirm-password").value.trim();

        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        fetch(`https://fedest-f892.restdb.io/rest/signup?q={"email":"${email}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        })
            .then(response => {
                if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
            .then(data => {
                if (data.length > 0) {
                    // Email already exists
                    alert("This email already exists. Please log in.");
                    openLoginPopup(); // Show login form
                } else {
                    // Proceed with Sign-Up
                    const jsondata = {
                        name: name,
                        email: email,
                        password: password,
                        comfirmPassword: confirmPassword
                    };

                    fetch("https://fedest-f892.restdb.io/rest/signup", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-apikey": APIKEY,
                            "Cache-Control": "no-cache"
                        },
                        body: JSON.stringify(jsondata)
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Error: ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            alert("Sign-up successful! Redirecting to the main page...");
                            window.location.href = "Main.html"; // Redirect to main page
                        })
                        .catch(error => {
                            console.error("Sign-Up Error:", error);
                            alert("Failed to sign up. Please try again.");
                        });
                }
            })
            .catch(error => {
                console.error("Error checking email:", error);
                alert("Failed to check email. Please try again.");
            });
    });

    // Handle Login Form Submission
        document.getElementById("login-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        fetch(`https://fedest-f892.restdb.io/rest/signup?q={"email":"${email}"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY
            }
        })
            .then((response) => {
            console.log("Login Response Status:", response.status);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        
            })
            .then(data => {
                console.log("Login Response Data:", data);
                if (data.length === 0) {
                    alert("Email does not exist. Please sign up.");
                    openSignupPopup(); // Show Sign-Up Form
                } else if (data[0].password === password) {
                    alert("Login successful!");
                    window.location.href = "Main.html"; // Redirect to main page
                } else {
                    alert("Incorrect password. Please try again.");
                }
            })
            .catch(error => {
                console.error("Login Error:", error);
                alert("Failed to log in. Please try again.");
            });
    });
});

// Pop-Up Management
function openPopup() {
    document.getElementById("popupForm").style.display = "flex";
    document.getElementById("loginForm").style.display = "none";  // Hide Login popup
}

function openLoginPopup() {
    document.getElementById("loginForm").style.display = "flex";
    document.getElementById("popupForm").style.display = "none";
}

function openSignupPopup() {
    document.getElementById("popupForm").style.display = "flex";
    document.getElementById("loginForm").style.display = "none";
}

// Function to close the popups
function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none"; // Hide the popup
}


window.addEventListener("click", function (event) {
    const signupModal = document.getElementById("popupForm");
    const loginModal = document.getElementById("loginForm");

   
    if (event.target === signupModal) {
        signupModal.style.display = "none";
    }

    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
})
