/*navbar*/
document.getElementById('navbar').innerHTML = `
<nav class="navbar navbar-expand-lg navbar">
    <div class="container-fluid">
        <a class="navbar-brand" style="color:#f6eee0;" href="../index.html">MokSell</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" style="color:#f6eee0;" >
            <span class="navbar-toggler-icon" ></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link" href="../Main.html">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="Boost.html">Boost</a></li>
                <li class="nav-item"><a class="nav-link" href="AboutUs.html">About Us</a></li>
                <li class="nav-item"><a class="nav-link" href="Profile.html">My Account</a></li>      
            </ul>
        </div>
    </div>
</nav>
`;

/*footer*/
document.getElementById("footer").innerHTML = `
<footer class="footer text-center">
        <div class="container">
            <p>&copy; 2025 MokeSell. All rights reserved.</p>
        </div>
    </footer>`;

