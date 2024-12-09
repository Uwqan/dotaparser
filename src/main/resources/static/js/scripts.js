const heroes = [
    "Abaddon", "Alchemist", "Ancient Apparition", "Anti-Mage", "Arc Warden", 
    "Axe", "Bane", "Batrider", "Beastmaster", "Bloodseeker", "Bounty Hunter", 
    "Brewmaster", "Bristleback", "Broodmother", "Centaur Warrunner", "Chaos Knight", 
    "Chen", "Clinkz", "Clockwerk", "Crystal Maiden", "Dark Seer", "Dark Willow", "Dawnbreaker",
    "Dazzle", "Death Prophet", "Disruptor", "Doom", "Dragon Knight", "Drow Ranger", 
    "Earthshaker", "Earth Spirit", "Elder Titan", "Ember Spirit", "Enchantress", 
    "Enigma", "Faceless Void", "Grimstroke", "Gyrocopter", "Hoodwink", "Huskar", "Invoker", "Io", "Jakiro",
    "Juggernaut", "Keeper of the Light", "Kunkka", "Legion Commander", "Leshrac", 
    "Lich", "Lifestealer", "Lina", "Lion", "Lone Druid", "Luna", "Lycan", "Magnus", 
    "Marci", "Mars", "Medusa", "Meepo", "Mirana", "Monkey King", "Morphling", "Muerta", "Naga Siren",
    "Nature's Prophet", "Necrophos", "Night Stalker", "Nyx Assassin", "Ogre Magi", 
    "Omniknight", "Oracle", "Outworld Destroyer", "Pangolier", "Phantom Assassin",
    "Phantom Lancer", "Phoenix", "Primal Beast", "Puck", "Pudge", "Pugna", 
    "Queen of Pain", "Razor", "Riki", "Rubick", "Sand King", "Shadow Demon", 
    "Shadow Fiend", "Shadow Shaman", "Silencer", "Skywrath Mage", "Slardar", 
    "Slark", "Sniper", "Spectre", "Spirit Breaker", "Storm Spirit", "Sven", 
    "Techies", "Templar Assassin", "Terrorblade", "Tidehunter", "Timbersaw", 
    "Tinker", "Tiny", "Treant Protector", "Troll Warlord", "Tusk", "Underlord", 
    "Undying", "Ursa", "Vengeful Spirit", "Venomancer", "Viper", "Visage", "Void Spirit",
    "Warlock", "Weaver", "Windranger", "Winter Wyvern", "Witch Doctor", 
    "Wraith King", "Zeus"
];

const heroListElement = document.getElementById('heroes');
const selectedHeroesContainer = document.getElementById('selectedHeroes');
const countersContainer = document.getElementById('counters');

let selectedHeroes = [];

heroes.forEach(hero => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = `/js/content/heroes/${hero}.png`;
    img.alt = hero;

    li.appendChild(img);
    li.appendChild(document.createTextNode(hero));
    li.addEventListener('click', () => addHero(hero, img.src));
    heroListElement.appendChild(li);
});

function filterHeroes() {
    const input = document.getElementById('hero-input').value.toLowerCase();
    const listItems = document.querySelectorAll('#heroes li');
    listItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(input)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function addHero(hero, imgSrc) {
    if (selectedHeroes.length >= 5 || selectedHeroes.includes(hero)) {
        return;
    }

    selectedHeroes.push(hero);
    updateSelectedHeroes();
    updateCounterPicks();
}

function removeHero(hero) {
    selectedHeroes = selectedHeroes.filter(h => h !== hero);
    updateSelectedHeroes();
    updateCounterPicks();
}

function updateSelectedHeroes() {
    selectedHeroesContainer.innerHTML = '';

    selectedHeroes.forEach(hero => {
        const div = document.createElement('div');
        div.classList.add('selected-hero-item');

        const img = document.createElement('img');
        img.src = `/js/content/heroes/${hero}.png`;
        img.alt = hero;

        const name = document.createElement('span');
        name.textContent = hero;

        const button = document.createElement('button');
        button.textContent = '×';
        button.addEventListener('click', () => removeHero(hero));

        div.appendChild(img);
        div.appendChild(name);
        div.appendChild(button);
        selectedHeroesContainer.appendChild(div);
    });
}

function updateCounterPicks() {
    countersContainer.innerHTML = "";

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ heroes: selectedHeroes })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(counterPicks => {
        counterPicks.forEach(counter => {
            const div = document.createElement('div');
            div.classList.add('counter-item');

            const img = document.createElement('img');
            img.src = counter.img;
            img.alt = counter.name;

            const name = document.createElement('span');
            name.textContent = counter.name;

            const score = document.createElement('span');
            score.textContent = counter.score;

            const heroNameForLink = counter.name.toLowerCase();
            div.addEventListener('click', () => {
                window.open(`https://dota2protracker.com/hero/${heroNameForLink}`, '_blank');
            });

            div.appendChild(img);
            div.appendChild(name);
            div.appendChild(score);
            countersContainer.appendChild(div);
        });
    })
    .catch(error => console.error('Error fetching counter picks:', error));
}
