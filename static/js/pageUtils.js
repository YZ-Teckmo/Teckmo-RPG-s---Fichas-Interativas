// ======= HTML imports =======
const root = document.documentElement
const nameHandler = document.getElementById("nameHandler")
const titleHandler = document.getElementById("titleHandler")
const portraitHandler = document.getElementById("portraitHandler")
const songNameHandler = document.getElementById("songNameHandler")
const carouselHandler = document.getElementById("carouselHandler")
const navNameHandler = document.getElementById("navNameHandler")
const absoluteNameHandler = document.getElementById("absoluteNameHandler")
const absoluteTypeHandler = document.getElementById("absoluteTypeHandler")

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

        if (rpg == 'Singularity') {
            this.stats = new SingularityStats()
        }
        else if (rpg == 'DumpWorld') {
            this.absolute = new Absolute()
            this.stats = new DumpWorldStats()
        }
        else if (rpg == 'Lobotomy') {
            this.stats = new LobotomyStats()
        }
        else {
            this.stats = new DemonSlayerStats()
        }
    }
}

class Skill {

}

class SingularityStats {
    constructor(health, stamina, singularity, sanity, strength, dexterity, control, intelligence, presence, resilience, luck) {
        this.health = health
        this.stamina = stamina
        this.singularity = singularity
        this.sanity = sanity
        this.strength = strength
        this.dexterity = dexterity
        this.control = control
        this.intelligence = intelligence
        this.presence = presence
        this.resilience = resilience
        this.luck = luck
    }
}

class DumpWorldStats {
    constructor(health, stamina, mana, sanity, strength, dexterity, intelligence, charisma, magic, power, luck) {
        this.health = health
        this.stamina = stamina
        this.mana = mana
        this.sanity = sanity
        this.strength = strength
        this.dexterity = dexterity
        this.intelligence = intelligence
        this.charisma = charisma
        this.magic = magic
        this.power = power
        this.luck = luck
    }
}

class LobotomyStats {
    constructor(health, sanity, pe, fortitude, prudence, temperance, justice) {
        this.health = health
        this.sanity = sanity
        this.pe = pe
        this.fortitude = fortitude
        this.prudence = prudence
        this.temperance = temperance
        this.justice = justice
    }
}

class DemonSlayerStats {
    constructor(health, breath, sanity, strength, agility, intelligence, presence, constitution) {
        this.health = health
        this.breath = breath
        this.sanity = sanity
        this.strength = strength
        this.agility = agility
        this.intelligence = intelligence
        this.presence = presence
        this.constitution = constitution
        this.expertise = new Expertise()
    }
}

class Expertise {
    //TODO: vsfd petroli, n vou mandar 18 pericias em classes agora
}

class Absolute {
    constructor(name, type) {
        this.name = name
        this.type = type
    }
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
    carouselHandler.scrollBy({ left: evt.deltaY * 1.2, behavior: 'smooth' })
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
            absoluteNameHandler.innerText = "Absoluto: " + character.absolute.name
            absoluteTypeHandler.innerText = "Tipo: " + character.absolute.type
            ChangeBackground(character.background)
        }
    }
}

function GetCharacterName(id) {
    for (let character of allCharacters) {
        if (id === character.id) {
            navNameHandler.innerText = character.name
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