// I learned how to do this from this tutorial: (https://www.w3schools.com/howto/howto_js_autocomplete.asp)

function autocomplete(arr){
    const input = document.getElementById("SearchBar");
    let current;
    input.addEventListener("input", function(e){
        // Initialize the variables
        let autocompleteList, suggestedText, i, val = this.value;
        const maxSuggested = 10;

        // Close the previous autocomplete window
        closeAutocomplete();

        // If the user didnt input anything return
        if(!val){
            return false;
        }

        current = -1;

        // create the autocomplete window
        autocompleteList = document.createElement("DIV");
        autocompleteList.setAttribute("id","autocomplete-list");
        autocompleteList.setAttribute("class", "autocomplete-items");

        this.parentNode.appendChild(autocompleteList);

        // Go through all the possible game titles
        for(i = 0; i < arr.length; i++){
            // If we find a match
            if(arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()){
                suggestedText = document.createElement("DIV");
                // Bold the part of the text that matches
                suggestedText.innerHTML = "<strong>" + arr[i].substr(0,val.length) + "</strong>";
                // Leave the other part of the text unbolded
                suggestedText.innerHTML += arr[i].substr(val.length);
                let stringVal = "";
                for(c = 0; c < arr[i].length; c++){
                    if(arr[i][c] == '\''){
                        continue;
                    }
                    stringVal += arr[i][c];
                }
                suggestedText.innerHTML += "<input type='hidden' value='" + stringVal + "'>";

                // If we click on of the options set input to that option
                suggestedText.addEventListener("click", function(e){
                        input.value = this.getElementsByTagName("input")[0].value;
                        closeAutocomplete();
                    });

                // Add the suggested ID
                suggestedText.setAttribute("id","autocomplete-suggested");
                // Add each suggestion to the autocomplete window
                autocompleteList.appendChild(suggestedText);
                
                // If the we have suggested the max amount, stop suggesting
                if(autocompleteList.childElementCount >= maxSuggested){
                    break;
                }
            }
        }
    });

    // Check if the user inputs any keys
    input.addEventListener("keydown", function(e){
        // get the autocomplete list
        var x = document.getElementById("autocomplete-list");
        if(x){
            x = x.getElementsByTagName("div");
        }
        // if we press down set the next element in the list as active
        if(e.key == "ArrowDown"){
            current++;
            addActive(x);
        }
        // if we press up set the previous one as active
        else if (e.key == "ArrowUp"){
            current--;
            addActive(x);
        }
        // if we select enter save that suggestion and close the autocomplete
        else if(e.key == "Enter"){
            // sets the input text area as read only to prevent the user from creating a new line
            input.readOnly = true;
            // reenables typing 30 milliseconds later
            setTimeout(canEditInput, 250);
            if(current > -1){
                if(x){
                    x[current].click();
                }
            }
        }
    });
    // This one sets the suggestions we are looking at as the active one
    function addActive(x){
        if(!x){
            return false;
        }
        removeActive(x);
        if(current >= x.length){
            current = 0;
        }
        if(current < 0){
            current = (x.length - 1);
        }
        x[current].classList.add("autocomplete-active");
        input.value = x[current].getElementsByTagName("input")[0].value;
    }
    // This removes the active class from all the suggestions
    function removeActive(x){
        for(let i = 0; i < x.length; i++){
            x[i].classList.remove("autocomplete-active");
        }
    }
    // This one goes through and deletes all the autocomplete suggestions
    function closeAutocomplete(element){
        let x = document.getElementsByClassName("autocomplete-items");
        for(let i = 0; i < x.length; i++){
            if(element != x[i] && element != input){
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    // if they click on a suggestion, close the auto complete and set the text value as that one
    document.addEventListener("click", function(e){
        closeAutocomplete(e.target);
    });

    function canEditInput(){
        input.readOnly = false;
    }
}


