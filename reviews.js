// These gets the element from the html document that we will be using
const posReview = document.getElementById("Posreview");
const negReview = document.getElementById("Negreview");
const SearchBar = document.getElementById("SearchBar");

const page = document.getElementById("page");
const openSidebar = document.getElementById("reviewsClick");
const visualization = document.getElementById("visualization");
const reviews = document.getElementById("reviews");

// This checks to see if the review sidebar is open
let isOpen = false;

function addReview(isPositive){// isPositve is a bool that if true means we are adding the postive review, if false then its the negative one
    // get the input from the search bar
    let gameID = SearchBar.value;

    // extract just the number (the id)
    let startOfID = gameID.lastIndexOf("(");
    if(startOfID != -1){
        gameID = gameID.substr(startOfID + 1, gameID.length - startOfID - 2);
    }

    // Then get the either the positve or negative reivew
    let reviewText;
    if(isPositive){
        reviewText = posReview.value;
    }
    else{
        reviewText = negReview.value;
    }

    // Create the review object
    const newReview = document.createElement("div");
    newReview.setAttribute("id", "review")
    
    // add a function to delete the review when it is clicked
    newReview.addEventListener("click", () => {
        newReview.remove();
    })
    
    // create the game image
    const reviewImage = document.createElement("img");
    reviewImage.src = "https://steamcdn-a.akamaihd.net/steam/apps/" + gameID + "/header.jpg";
    reviewImage.width = "175"; 
    reviewImage.height= "70";

    // make the image a child of the review
    newReview.appendChild(reviewImage);

    // Create the text area that will hold the review
    const review = document.createElement("textarea");
    review.value = reviewText;
    review.style.resize = "none";
    review.readOnly = "true";
    review.style.width = "100%"
    
    // make it a child of the review
    newReview.appendChild(review);

    // add the review to the reviews element
    const element = document.getElementById("reviews");
    element.appendChild(newReview);
}

function openReviews(){
    // this is used to switch between the visualization and the reviews window
    if(!isOpen){
        reviews.style.display = "block"
        visualization.style.display = "none"
        page.style.gridTemplateColumns = "350px auto 10px 100px";
        openSidebar.innerHTML = "<strong>Click To Open Visualization</strong>"
        isOpen = true;
    }
    else{
        reviews.style.display = "none"
        visualization.style.display = "block"
        page.style.gridTemplateColumns = "350px auto 10px 100px";
        openSidebar.innerHTML = "<strong>Click To Open Review Sidebar</strong>"
        isOpen = false;
    }
}