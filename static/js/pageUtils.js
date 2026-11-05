// ======= HTML imports =======
const root = document.documentElement
const nameHandler = document.getElementById("nameHandler")
const titleHandler = document.getElementById("titleHandler")
const portraitHandler = document.getElementById("portraitHandler")
const songNameHandler = document.getElementById("songNameHandler")
const carouselHandler = document.getElementById("carouselHandler")

// ======= Variaveis =======
let transition = false
let allCharacters = []

// ======= Classes =======
class Character {
    constructor(id, firstName, name, rpg, title, portrait, background, color) {
        this.id = id
        this.firstName = firstName
        this.name = name
        this.rpg = rpg
        this.title = title
        this.portrait = portrait
        this.background = background
        this.color = color
        this.themeSong = new ThemeSong()
    }
}

class Skill {

}

class ThemeSong {
    constructor(name, link) {
        this.name = name
        this.link = link
    }
}

// ======= Execuções Básicas =======
carouselHandler.addEventListener('wheel', (evt) => {
    evt.preventDefault()
    carouselHandler.scrollBy({left: evt.deltaY * 0.2, behavior: 'smooth'})
}, { passive: false })

// ======= Personagens =======
// Saindo do Arquivo Json
fetch('../static/data/characters.json')
    .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    })
    .then((data) => {
        allCharacters = data.characters
    })
    .catch((err) => console.error('Erro ao carregar:', err))

// ======= Funções =======
let activeCharacter = 1
GetActiveCharacter()
function GetActiveCharacter() {
    for (let character of allCharacters) {
        if (character.id === activeCharacter) {
            document.title = character.firstName + " - " + character.rpg + " | Deyvid Fichas de RPG"
            root.style.setProperty('--character-color', character.color)
            songNameHandler.innerText = character.themeSong.name
            portraitHandler.src = character.portrait
            nameHandler.innerText = character.name
            titleHandler.innerText = `"${character.title}"`
            ChangeBackground(character.background)
        }
    }
}

function ChangeActiveCharacter(id) {
    activeCharacter = id
    GetActiveCharacter()
}

function ChangeBackground(background) {
    if (transition) return

    transition = true
    root.style.setProperty('--next-background', `url("${background}")`)
    document.body.classList.add('newBack')

    time = setTimeout(() => {
        document.body.style.setProperty('--character-background', `url("${background}")`)
        document.body.classList.remove('newBack')
    }, 300)
    transition = false
}