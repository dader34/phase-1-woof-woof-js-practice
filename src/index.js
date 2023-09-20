
const dogContainer = document.querySelector("#dog-bar")
const infoContainer = document.querySelector("#dog-info")
const searchGoodBoy = document.querySelector("#good-dog-filter")
const dogName = document.createElement("h2")
const dogImg = document.createElement("img")
const goodBoyButton = document.createElement("button")
let searchingForGoodDog = true
let alldogs = []
infoContainer.append(dogName,dogImg)

const sortByGoodDog = () =>{
    dogImg.src=""
    dogName.textContent=""
    goodBoyButton.remove()
    const goodDogs = []
    if(searchingForGoodDog){
        for(let i = 0;i<dogContainer.children.length;i++){
            const currentDog = dogContainer.children[i]
            // console.log(`Value is: ${value}, Attribute: ${currentDog.getAttribute("goodboy")}, equaleachother: ${value == currentDog.getAttribute("goodBoy")}`)
            if(currentDog.getAttribute("goodboy") == "true"){
                goodDogs.push(currentDog)
            }
        }
        dogContainer.innerHTML=""
        goodDogs.forEach(dog=>{
            dogContainer.append(dog)
        })
    }else{
        dogContainer.innerHTML=""
        alldogs.forEach(dog=>{
            addDogToPage(dog)
        })
    }
    searchingForGoodDog = !searchingForGoodDog
    searchGoodBoy.textContent = searchingForGoodDog ? "Filter good dogs: OFF" : "Filter good dogs: ON"
    


}
searchGoodBoy.addEventListener("click",()=>{
    sortByGoodDog(searchingForGoodDog)
})

const getDogs = () =>{
    return fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(body => {
        alldogs = [...body]
        return body;
    })
}

const loadDogs = () =>{
    getDogs().then(dogs =>{
        dogs.forEach(dog =>{
            addDogToPage(dog)
        })
    })
}
const patchDog = (dog) =>{
    fetch(`http://localhost:3000/pups/${dog.id}`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            isGoodDog:dog.isGoodDog
        })
    })
    .then(resp => resp.json())
    .then(console.log)
}
const addDogToPage = (dog) =>{
    const dogSpan = document.createElement("span")
    dogSpan.textContent = dog.name
    dogSpan.setAttribute("goodboy",dog.isGoodDog)
    dogSpan.addEventListener("click",()=>{
        dogImg.src=""
        dogName.textContent=""
        dogName.textContent = dog.name
        dogImg.src = dog.image
        goodBoyButton.textContent = dog.isGoodDog ? "Bad dog" : "Good dog"
        goodBoyButton.onclick = () =>{
            dog.isGoodDog = !dog.isGoodDog
            dogSpan.setAttribute("goodboy",dog.isGoodDog)
            goodBoyButton.textContent = dog.isGoodDog ? "Bad dog" : "Good dog"
            if(dog.isGoodDog === false && searchingForGoodDog===false){
                dogSpan.remove()
                goodBoyButton.remove()
                dogImg.src=""
                dogName.textContent=""
            }
            patchDog(dog)
        }
        if(!infoContainer.querySelector("button")){
            infoContainer.append(goodBoyButton)
        }
    })
    dogContainer.append(dogSpan)
}


loadDogs()
