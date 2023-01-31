// Autocomplete adapted from: https://www.w3schools.com/howto/howto_js_autocomplete.asp

let suggestions = [];
const inp = document.querySelector("textarea");

const autocomplete_elem = document.createElement("DIV");
autocomplete_elem.setAttribute("id", "autocomplete-list");
autocomplete_elem.setAttribute("class", "autocomplete-items");
inp.parentElement.prepend(autocomplete_elem);

inp.addEventListener("keyup", async function (e) {
  /*close any already open lists of autocompleted values*/
  let b,
    i,
    val = this.value;
  let arr = [...suggestions];

  closeAllLists();
  if (!this.value) {
    return false;
  }

  suggestions = [];
  suggestions = await getSearchSuggestions(this.value);
  const theme = localStorage.getItem("theme");

  for (i = 0; i < arr.length; i++) {
    /*check if the item starts with the same letters as the text field value:*/
    if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
      b = document.createElement("DIV");
      b.classList.add("autocomplete-item");
      b.classList.add(`${theme}-item`);

      let span = document.createElement("span");

      /*make the matching letters bold:*/
      // b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
      span.innerHTML += arr[i];
      span.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

      b.addEventListener("click", function (e) {
        closeAllLists();
        setNativeValue(inp, this.getElementsByTagName("input")[0].value);
      });
      b.appendChild(span);

      document.getElementById("autocomplete-list").appendChild(b);
    }
  }
});

function closeAllLists() {
  autocomplete_elem.innerHTML = "";
}

// Ask Google for search suggestions via background.js
async function getSearchSuggestions(query) {
  try {
    const data = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        `https://suggestqueries.google.com/complete/search?client=chrome-omni&q=${query}`,
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        }
      );
    });
    return JSON.parse(data)[1];
  } catch (error) {
    console.error(error);
    return [];
  }
}

//   Source: https://chuckconway.com/changing-a-react-input-value-from-vanilla-javascript/
function setNativeValue(element, value) {
  let lastValue = element.value;
  element.value = value;
  let event = new Event("input", { target: element, bubbles: true });
  // React 15
  event.simulated = true;
  // React 16
  let tracker = element._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  element.dispatchEvent(event);
}

/*close list when someone clicks in the document:*/
document.addEventListener("click", function (e) {
  closeAllLists();
});
