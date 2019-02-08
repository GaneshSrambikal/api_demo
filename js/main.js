import fetchJsonp from "fetch-jsonp";

import { isValidZip, showAlert } from "./validate";
const petForm = document.querySelector("#pet-form");

petForm.addEventListener("submit", fetchAnimals);

//fetch animals form API
function fetchAnimals(e) {
  e.preventDefault();

  //get user Input
  const animal = document.querySelector("#animal").value;
  const zip = document.querySelector("#zip").value;

  //valid zip
  if (!isValidZip(zip)) {
    showAlert("Enter a valid zip", "danger");
    return;
  }

  //fetch pets
  fetchJsonp(
    `http://api.petfinder.com/pet.find?format=json&key=7c62cb95c0acffdf76f9e0c1c368b4b5&animal=${animal}&location=${zip}&callback=callback`,
    { jsonpCallbackFunction: "callback" }
  )
    .then(res => res.json())
    .then(data => showAnimals(data.petfinder.pets.pet))
    .catch(err => console.log(err));
}

//show listing of pets
function showAnimals(pets) {
  const results = document.querySelector("#results");

  //clear first
  results.innerHTML = "";
  //loop through pets
  pets.forEach(pet => {
    console.log(pet);
    const div = document.createElement("div");
    div.classList.add("card", "card-body", "mb-3");
    div.innerHTML = `
    <div class="row">
    <div class="col-sm-6">
    <h4 class="name"> ${pet.name.$t} (${pet.age.$t})</h4>
    <p class="text-secondary">${pet.breeds.breed.$t}</p>
    <p>${pet.contact.address1.$t} ${pet.contact.city.$t} ${
      pet.contact.state.$t
    } ${pet.contact.zip.$t}</p>
      <ul class="list-group">
      <li class="list-group-item">Phone: ${pet.contact.phone.$t}</li>
      ${
        pet.contact.email.$t
          ? `<li class="list-group-item">Email: ${pet.contact.email.$t}</li>`
          : ``
      }
      <li class="list-group-item">Shelter Id: ${pet.shelterId.$t}</li>
      <li class="list-group-item">Status: ${pet.status.$t}</li>
      </ul>
      </div>
    <div class="col-sm-6 text-center">
    <img class="img-fluid rounded-circle mt-2" src="${
      pet.media.photos.photo[3].$t
    }">
    </div>
    </div>
    `;
    results.appendChild(div);
  });
}
