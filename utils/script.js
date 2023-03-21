/*The list consisted of a filled <li> item. A li node is created and then two arrow icons are nested in a 
span and appended to that li item. Additionally, an empty p-node is created, which will be filled with user input. Finally  the trash icon is appended. 
The resulting structure of the clonedNode.childNodes[]
0=span with two <img> arrows
1=<p>for user input
2=<img>trash icon*/
$(document).ready(()=>{

//add button functionality to the directly visible elements
$(document).ready($("#hide").on("click", hideList));
$(document).ready($("#add").on("click", addItem));
$(document).ready($("#message").toggle());
$(document).ready(weather_cast());

//li item is created
let listItem = document.createElement("li");
listItem.setAttribute("class", "itemOnList");
let para = document.createElement("p");
listItem.style.display = "none"; //set to invis to fadeIn

//create span for checkbox and arrows
var span = document.createElement("span");

//span.setAttribute("class","arrows")

//create checkbox
let checkBox = document.createElement("img");
checkBox.src = "./img/box.png";
checkBox.setAttribute("class", "checkBox");
span.appendChild(checkBox);

//arrow elements are created

let arrowUp = document.createElement("img");
arrowUp.src = "./img/arrowup.png";
arrowUp.setAttribute("class", "arrowUp");
arrowUp.classList.add("arrows");
let arrowDown = document.createElement("img");
arrowDown.src = "./img/arrowdown.png";
arrowDown.setAttribute("class", "arrowDown");
arrowDown.classList.add("arrows");
span.appendChild(arrowUp);
span.appendChild(arrowDown); //nested inside the span

//trash icon element is created
let trash = document.createElement("img");
trash.src = "./img/trash.png";
trash.setAttribute("class", "trash");

//everything is appended to the <li> node, which serves as a prototype for cloning

listItem.appendChild(span);
listItem.appendChild(para);
listItem.appendChild(trash);

//add functionality to add li item with return key
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    $("#add").click();
  }
});

function addItem() {
  let rawInput = $("#input").val();
  if (rawInput) {
    //check if user input is not empty, otherwise nothings happens
    let clonedNode = listItem.cloneNode(true); //deep! cloning of previously created node
    clonedNode.childNodes[1].appendChild(document.createTextNode(rawInput)); //this takes the cloned li->p child and adds userinput
    //appends it and
    $("ol").prepend(clonedNode);
    $("ol li:first-child").fadeIn(500);

    document.getElementById("input").value = ""; //reset input value to empty
  }
}

function addUsual(rawInput) {
  //overloaded function
  if (rawInput) {
    //check if user input is not empty, otherwise nothings happens
    let clonedNode = listItem.cloneNode(true); //deep! cloning of previously created node
    clonedNode.childNodes[1].appendChild(document.createTextNode(rawInput)); //this takes the cloned li->p child and adds userinput
    //appends it and
    $("ol").prepend(clonedNode);
    $("ol li:first-child").fadeIn(500);

    document.getElementById("input").value = ""; //reset input value to empty
  }
}

$(document).on("click", ".arrowUp", function () {
  let currentItem = $(this).parent().parent(); //1st parent is the span, 2nd parent is the <li> item
  beforeItem = currentItem.prev(); // the item before the current selected
  currentItem.insertBefore(beforeItem); //and put the current li before that
});

$(document).on("click", ".arrowDown", function () {
  let currentItem = $(this).parent().parent(); //1st parent is the span, 2nd parent is the <li> item
  beforeItem = currentItem.next(); // the item after the current selected
  currentItem.insertAfter(beforeItem); //and put the current li after that
});

$(document).on("mouseenter", ".checkBox", function () {
  this.src = "./img/check-box-checked.png";
});

$(document).on("mouseleave", ".checkBox", function () {
  this.src = "./img/box.png";
});

$(document).on("click", ".checkBox", function () {
  this.setAttribute("class", "itemChecked");
  this.src = "./img/box-checked.png";
  let para = $(this).parent().parent();
  para.css("text-decoration", "line-through");
  para.css("text-decoration-thickness", "0.2rem");
  para.css("text-decoration-color", "#820933");
  para.animate(
    {
      width: "+=5",
      height: "+=5",
    },
    100
  );
  para.animate(
    {
      width: "-=5",
      height: "-=5",
    },
    100
  );
  para.fadeOut(400);
  document.getElementById("checkAudio").play();
  para.css("background-color", "grey");
  const fading = () =>
    para.insertAfter(para.parent()[0].lastChild).hide().fadeIn(100);
  setTimeout(fading, 200);
  para.css("opacity", "0.5");
});

$(document).on("click", ".itemChecked", function () {
  this.setAttribute("class", "checkBox");
  this.src = "./img/box.png";
  let para = $(this).parent().parent();
  para.css("opacity", "1");
  para.css("text-decoration", "none");
  para.fadeOut(300);
  para.css("background-color", "#820933");
  const fading = () =>
    para.insertBefore(para.parent()[0].firstChild).hide().fadeIn(300);
  setTimeout(fading, 400);
});

$(document).on("click", ".trash", function () {
  //remove the li item from the list with animation in 0.5 sec
  $(this).parent().animate({ height: "toggle", opacity: "toggle" }, 400);
  document.getElementById("delAudio").play();
  $(this)
    .parent()
    .promise()
    .done(function () {
      //after the list item disappears a message is show and then displayed for 1.3 sec and faded out.
      //then the item is removed
      $("#message").fadeIn(400);
      const fadeOUT = () => $("#message").fadeOut(400);
      setTimeout(fadeOUT, "600");
      $("li:hidden").remove();
    });
});

//additional css for disabling the add button, if the list is hidden (could be in .styles as well)
function hideList() {
  $("#add").prop("disabled", true);
  $("li").toggle();
  if ($("#hide").text() == "hide") {
    $("#add").prop("disabled", true);
    $("#hide").text("unhide");
    $("#hide").css("background-color", "#820933");
    $("#add").css("opacity", "0.2");
  } else {
    $("#hide").text("hide");
    $("#add").prop("disabled", false);
    $("#add").css("opacity", "1");
    $("#hide").css("background-color", "#20b2aa");
  }
}



function weather_cast() {
  getWeather(); //first time
  var intervalId = setInterval(getWeather, 60000);//no actual need to stop it for now
}

function getWeather() {
  $.get(
    "https://api.open-meteo.com/v1/forecast?latitude=48.2379&longitude=16.3748&current_weather=true&forecast_days=1&timezone=Europe%2FBerlin",
    function (data) {
      $("#temp").html(data.current_weather.temperature);
      $("#wind").html(data.current_weather.windspeed);
      console.log(data)
    }
  );
}})
