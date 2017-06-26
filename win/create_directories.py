import os

characters = [
    'Utareth Imyer',
    'Stormcaller Midea',
    'Seed Turrets',
    'Lucera Elstadt',
    'Fuhrer Emmerich',
    'Salad Magician',
    'Legion Arcanist',
    'Lucent Mystrel',
    'Red Phantasia',
    'Divergence Of White',
    'Filthy Plant Slave',
    'Least Ersatz Ansatz',
    'The Eternal Bowlcut',
    'Progenitor Of Flame',
    'Alir Sarra',
    'Druidic Recursion',
    'Yes This Is An Alt',
    'Cat Allergy',
    'Charrzooka Forever',
    'Monk Of Zamorak',
    'Strange Apparition',
];

bosses = [
    "All",
    "Vale Guardian",
    "Gorseval the Multifarious",
    "Sabetha the Saboteur",
    "Slothasor",
    "Matthias Gabrel",
    "Keep Construct",
    "Xera",
    "Cairn the Indomitable",
    "Mursaat Overseer",
    "Samarog",
    "Deimos",
];

guilds = [
    'Very Innovative Players',
    'Karma',
    'Valiant Feline Explorers',
    'Thank Mr Goose',
    'The Essence Of',
    'Silver Kings And Golden Queens',
    'Bourne Again',
    'Avantosik',
    'Verucas Illusion',
];


for character in characters:
    for boss in bosses:
        for guild in guilds:
            directory = 'X:\\Documents\\arcdps\\arcdps.cbtlogs\\' + '\\'.join([boss, character, guild])
            if not os.path.exists(directory):
                os.makedirs(directory)
