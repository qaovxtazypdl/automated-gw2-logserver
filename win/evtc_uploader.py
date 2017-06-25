import subprocess
import sys
import requests
import json

boss_code_map = {
    'Massive Kitty Golem': 'golem',
    'Vale Guardian': 'vg',
    'Gorseval the Multifarious': 'gorse',
    'Sabetha the Saboteur': 'sab',
    'Slothasor': 'sloth',
    'Matthias Gabrel': 'matt',
    'Keep Construct': 'kc',
    'Xera': 'xera',
    'Cairn the Indomitable': 'cairn',
    'Mursaat Overseer': 'mo',
    'Samarog': 'sam',
    'Deimos': 'dei',
};

guild_tag_map = {
    'Very Innovative Players': 'VIP',
    'Karma': 'KA',
    'Valiant Feline Explorers': 'VFX',
    'Thank Mr Goose': 'HONK',
    'The Essence Of': 'LUCK',
    'Silver Kings And Golden Queens': 'SKGQ',
    'Bourne Again': 'bash',
    'Avantosik': 'Heim',
    'Verucas Illusion': 'VI',
}

subprocess.call([
    'raid_heroes.exe',
    'X:\\Documents\\arcdps\\arcdps.cbtlogs\\' + sys.argv[1]
], cwd='X:\\Documents\\arcdps\\autoparse\\')

boss_name, char_name, guild_name, file_evtc = sys.argv[1].split('\\');

if (guild_name in guild_tag_map):
    guild_name = guild_tag_map[guild_name];
else:
    guild_name = 'null'

if (boss_name in boss_code_map) :
    #scp the generated file
    file_name = file_evtc.split('.')[0] + '_' + boss_code_map[boss_name] + '.html'

    logmetadata = {
        'path': file_name,
        'boss': boss_name,
        'name': char_name,
        'guild': guild_name,

        'bosstime': 1,
        'class': 1,
        'cleavedmg': 1,
        'bossdmg': 1,
        'rank': 1,
        'people': 1,
    }

    if (boss_name != 'Massive Kitty Golem') :
        print('uploading...\n\r')
        print(' '.join([
            'rsync',
            '-vz',
            '--chmod=u+rwx,g+rwx,o+rwx',
            '-e', '"ssh -i ~/.ssh/id_rsa"',
            file_name,
            'root@logs.xn--jonathan.com:/var/www/logs/html/logs'
        ]))

        subprocess.call(
            [
                'rsync',
                '-vz',
                '--chmod=u+rwx,g+rwx,o+rwx',
                '-e', 'ssh -i C:/Users/Jonathan/.ssh/id_rsa',
                file_name,
                'root@logs.xn--jonathan.com:/var/www/logs/html/logs'
            ],
            cwd='X:\\Documents\\arcdps\\autoparse\\',
            shell=True
        )

        print('\n\rPUT-ing');
        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        r = requests.put('https://logs.xn--jonathan.com/api/logmetadata', data=json.dumps(logmetadata), headers=headers)
        print('PUT response: ' + str(r))

    print(str(logmetadata))


print('\n\r\n\r===============================================================\n\r\n\r')
