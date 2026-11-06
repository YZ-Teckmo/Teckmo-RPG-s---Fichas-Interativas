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
const blessingNameHandler = document.getElementById("blessingNameHandler")
const blessingColorHandler = document.getElementById("blessingColorHandler")
const nacionalityHandler = document.getElementById("nacionalityHandler")
const corpHandler = document.getElementById("corpHandler")
const allBarsHandler = document.getElementById("allBarsHandler")


const curGauge = document.getElementById("curGauge")
const maxGauge = document.getElementById("maxGauge")
const barGauge = document.getElementById("barGauge")


// ======= Variaveis =======
let transition = false
let allCharacters = []
let allBars = []
let barClass = false

let allTitles = allBarsHandler.querySelectorAll(".bar-title")
let allContainers = allBarsHandler.querySelectorAll(".bar-container")
let allFills = allBarsHandler.querySelectorAll(".bar-fill")

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

        if (this.rpg == "Singularity") {
            this.blessing = new Blessing()
            this.stats = new SingularityStats()
        }
        else if (rpg == 'DumpWorld') {
            this.absolute = new Absolute()
            this.stats = new DumpWorldStats()
        }
        else if (rpg == 'Lobotomy') {
            this.lobInfo = new LobInfo()
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
    constructor(current, max, strength, dexterity, control, intelligence, presence, resilience, luck) {
        this.health = {
            current: current,
            max: max
        }
        this.stamina = {
            current: current,
            max: max
        }
        this.mana = {
            current: current,
            max: max
        }
        this.sanity = {
            current: current,
            max: max
        }

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
    constructor(health, sanity, stamina, fortitude, prudence, temperance, justice) {
        this.health = health
        this.sanity = sanity
        this.stamina = stamina
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

class Blessing {
    constructor(name, color) {
        this.name = name
        this.color = color
    }
}

class LobInfo {
    constructor(nacionality, corp) {
        this.nacionality = nacionality
        this.corp = corp
    }
}

class ThemeSong {
    constructor(name, link) {
        this.name = name
        this.link = link
    }
}

class Bars {
    constructor(element, character) {
        this.element = element
        this.name = element.dataset.name
        this.stat = character.stats[this.name]

        this.cur = this.stat.current
        this.max = this.stat.max

        this.fill = element.querySelector(".bar-fill, .bar-fill-ayame")

        this.Update()
    }

    get percent() {
        return (this.cur / this.max) * 100
    }

    SetCurValues() {
        this.cur = Number(this.element.querySelector(".current").value)
        this.max = Number(this.element.querySelector(".max").value)
        this.Update()
    }

    Update() {
        this.fill.style.width = this.percent + "%"
        this.element.querySelector(".current").value = this.cur
        this.element.querySelector(".max").value = this.max
    }
}

// ======= Execuções Básicas =======
carouselHandler.addEventListener('wheel', (evt) => {
    evt.preventDefault()
    carouselHandler.scrollBy({ left: evt.deltaY * 1.2, behavior: 'smooth' })
}, { passive: false })

if (curGauge == null) {
}
else {
    curGauge.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            ReleaseGauge()
        }
    })
}

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

            document.querySelectorAll(".bar-container, .bar-container-affect").forEach((el) => {
                const bar = new Bars(el, character)
                allBars[bar.name] = bar
            })

            if (character.rpg === "DumpWorld") {
                absoluteNameHandler.innerText = "Absoluto: " + character.absolute.name
                absoluteTypeHandler.innerText = "Tipo: " + character.absolute.type
            }

            if (character.rpg === "Singularity") {
                blessingNameHandler.innerText = "Benção: " + character.blessing.name
                blessingColorHandler.innerText = "Cor: " + character.blessing.color
            }

            if (character.rpg === "Lobotomy") {
                nacionalityHandler.innerText = "Nacionalidade: " + character.lobInfo.nacionality
                corpHandler.innerText = "Corporação: " + character.lobInfo.corp
            }

            if (character.id === 8) {
                root.style.setProperty("--character-font", `'Pixelify Sans', monospace`)
                root.style.setProperty("--back-size", "8px")

                allTitles[0].innerText = "Vida"

                allTitles[1].innerText = "Afeto"
                allContainers[1].className = "bar-container-affect"
                allFills[1].className = "bar-fill-ayame"
                GetBarIcon(allBars.stamina.percent)

                allTitles[2].innerText = "Determinação"

                allTitles[3].innerText = "Magicalização"
            }
            else {
                root.style.setProperty("--character-font", `'Poppins', monospace`)
                root.style.setProperty("--back-size", "2px")

                allTitles[0].innerText = "Vida"

                allTitles[1].innerText = "Stamina"
                allContainers[1].className = "bar-container"
                allFills[1].className = "bar-fill"

                if (character.rpg == "DumpWorld") {
                    allTitles[2].innerText = "Mana"
                }
                else {
                    allTitles[2].innerText = "Singularidade"
                }

                allTitles[3].innerText = "Sanidade"
            }
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

function ReleaseGauge() {
    if (barGauge.width <= "100%") {
        root.style.setProperty("--spirit-on", "0")
    }
    else if (barGauge.width >= "100%" && barGauge.width <= "200%") {
        root.style.setProperty("--spirit-on", "1")
        root.style.setProperty("--gauge-fill", `url("../assets/DemonSlayer/Klaus/SpiritGauge/Fill1.png")`)
    }
    else if (barGauge.width >= "200%" && barGauge.width <= "300%") {
        root.style.setProperty("--spirit-on", "1")
        root.style.setProperty("--gauge-fill", `url("../assets/DemonSlayer/Klaus/SpiritGauge/Fill2.png")`)
    }
    else {
        root.style.setProperty("--spirit-on", "1")
        root.style.setProperty("--gauge-fill", `url("../assets/DemonSlayer/Klaus/SpiritGauge/Fill3.png")`)
    }
}

function GetBarIcon(bar) {
    if (bar <= "20") {
        root.style.setProperty("--bar-background", `url("../assets/Singularity/Ayame&Yame/AyameBars/Affect/EmptyAffectBar.png")`)
        root.style.setProperty("--ayame-bars-color", "db0f0f")
    }
    else if (bar >= "20" && bar <= "80") {
        root.style.setProperty("--bar-background", `url("../assets/Singularity/Ayame&Yame/AyameBars/Affect/MidAffectBar.png")`)
        root.style.setProperty("--ayame-bars-color", "33c528")
    }
    else {
        root.style.setProperty("--bar-background", `url("../assets/Singularity/Ayame&Yame/AyameBars/Affect/FullAffectBar.png")`)
        root.style.setProperty("--ayame-bars-color", "db0f0f")
    }
}