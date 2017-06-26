import subprocess
import sys
import requests
import json
import raidheroes_scraper as rs
import discord_poster as dp
import time

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

main_guilds_list = [
    'VIP',
    'KA',
    'VFX',
    'SKGQ',
    'LUCK',
]

print('New file acknowledged: ' + sys.argv[1])

time.sleep(10)

subprocess.call([
    'X:\\Documents\\arcdps\\autoparse\\raid_heroes.exe',
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

    data = rs.scrape_file(char_name, 'X:\\Documents\\arcdps\\autoparse\\' + file_name)

    logmetadata = {
        'path': file_name,
        'boss': boss_name,
        'name': char_name,
        'guild': guild_name,

        'bosstime': data['bosstime'],
        'class': data['class'],
        'cleavedmg': data['cleavedmg'],
        'bossdmg': data['bossdmg'],
        'rank': data['rank'],
        'people': data['people'],
        'success': 1 if data['success'] else 0,
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
        print(str(logmetadata))
        print('')

        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        r = requests.put('https://logs.xn--jonathan.com/api/logmetadata', data=json.dumps(logmetadata), headers=headers)
        print('PUT response: ' + str(r))
        print(r.text)

    print('')
    if (data['success']):
        print('Successful Boss Attempt. Heckling discord if [LUCK].')
        if guild_name == 'LUCK':
            dp.win(boss_name)
    else:
        print('Unsuccessful Boss Attempt. Heckling discord if [LUCK].')
        if guild_name == 'LUCK':
            dp.lose(boss_name)



print('===============================================================\n\r\n\r')
