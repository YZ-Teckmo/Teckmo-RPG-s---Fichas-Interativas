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
const songTitleHandler = document.getElementById("songTitleHandler")
const resizeBtnHandler = document.getElementById("resizeBtnHandler")
const popupHandler = document.getElementById("popupHandler")


const curGauge = document.getElementById("curGauge")
const maxGauge = document.getElementById("maxGauge")
const barGauge = document.getElementById("barGauge")


// ======= Variaveis =======
let transition = false
let allCharacters = []
let allBars = []
let barClass = false

// Youtube Player 
let player
let songDone = false

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

        this.fill = element.querySelector(".bar-fill, .bar-fill-affect, .bar-fill-magical, .bar-fill-determination")

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
            changeVideo(character.themeSong.link)
            songTitleHandler.innerText = character.themeSong.name

            document.querySelectorAll(".bar-container, .bar-container-affect, .bar-container-magical, .bar-container-determination").forEach((el) => {
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
                allFills[1].className = "bar-fill-affect"
                GetAffectIcon(allBars.stamina)

                allTitles[2].innerText = "Determinação"
                allContainers[2].className = "bar-container-determination"
                allFills[2].className = "bar-fill-determination"
                GetDeterminationIcon(allBars.mana)

                allTitles[3].innerText = "Magicalização"
                allContainers[3].className = "bar-container-magical"
                allFills[3].className = "bar-fill-magical"
                GetMagicalIcon(allBars.sanity)
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
                    allContainers[2].className = "bar-container"
                    allFills[2].className = "bar-fill"

                }
                else {
                    allTitles[2].innerText = "Singularidade"
                    allContainers[2].className = "bar-container"
                    allFills[2].className = "bar-fill"
                }

                allTitles[3].innerText = "Sanidade"
                allContainers[3].className = "bar-container"
                allFills[1].className = "bar-fill"
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

function GetAffectIcon(bar) {
    if (bar.percent <= "30") {
        root.style.setProperty("--bar-background-affect", `url("../assets/Singularity/Ayame&Yame/AyameBars/Affect/EmptyAffectBar.png")`)
        root.style.setProperty("--bar-color-affect", "db0f0f")
    }
    else if (bar.percent > "30" && bar.percent < "70") {
        root.style.setProperty("--bar-background-affect", `url("../assets/Singularity/Ayame&Yame/AyameBars/Affect/MidAffectBar.png")`)
        root.style.setProperty("--bar-color-affect", "33c528")
    }
    else if (bar.percent >= "70") {
        root.style.setProperty("--bar-background-affect", `url("../assets/Singularity/Ayame&Yame/AyameBars/Affect/FullAffectBar.png")`)
        root.style.setProperty("--bar-color-affect", "db0f0f")
    }
}

function GetMagicalIcon(bar) {
    if (bar.percent <= "30") {
        root.style.setProperty("--bar-background-magical", `url("../assets/Singularity/Ayame&Yame/AyameBars/Magicalization/EmptyMagicalizationBar.png")`)
        root.style.setProperty("--bar-color-magical", "db0f0f")
    }
    else if (bar.percent > "30" && bar.percent < "100") {
        root.style.setProperty("--bar-background-magical", `url("../assets/Singularity/Ayame&Yame/AyameBars/Magicalization/MidMagicalizationBar.png")`)
        root.style.setProperty("--bar-color-magical", "33c528")
    }
    else if (bar.percent >= "100") {
        root.style.setProperty("--bar-background-magical", `url("../assets/Singularity/Ayame&Yame/AyameBars/Magicalization/FullMagicalizationBar.png")`)
        root.style.setProperty("--bar-color-magical", "db0f0f")
    }
}

function GetDeterminationIcon(bar) {
    if (bar.percent <= "20") {
        root.style.setProperty("--bar-background-determination", `url("../assets/Singularity/Ayame&Yame/AyameBars/Determination/EmptyDeterminationBar.png")`)
        root.style.setProperty("--bar-color-determination", "db0f0f")
    }
    else if (bar.percent > "20" && bar.percent < "80") {
        root.style.setProperty("--bar-background-determination", `url("../assets/Singularity/Ayame&Yame/AyameBars/Determination/MidDeterminationBar.png")`)
        root.style.setProperty("--bar-color-determination", "33c528")
    }
    else if (bar.percent >= "80") {
        root.style.setProperty("--bar-background-determination", `url("../assets/Singularity/Ayame&Yame/AyameBars/Determination/FullDeterminationBar.png")`)
        root.style.setProperty("--bar-color-determination", "db0f0f")
    }
}

function OpenCloseSongPopup(action) {
    if (action === 1) {
        popupHandler.classList.add("open-popup")
    }
    else {
        popupHandler.classList.remove("open-popup")
        if (songDone) {
            player.pauseVideo()
        }
    }
}

// Youtube Functions
function onYouTubeIframeAPIReady() {
    console.log("API running")

    player = new YT.Player("playerHandler", {
        height: 300,
        width: 500,
        videoId: "",
        playerVars: {
            playersinline: 1,
            autoplay: 0,
            controls: 0
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    })
}

function changeVideo(videoID) {
    player.cueVideoById({ videoId: videoID })
    player.pauseVideo()
}

function onPlayerReady() {
    console.log("ready")
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !songDone) {
        songDone = true
    }
}