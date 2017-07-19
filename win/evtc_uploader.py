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

def parse_and_upload(filepath, use_discord):
    print('New file processing: ' + filepath)

    subprocess.call([
        'X:\\Documents\\arcdps\\autoparse\\raid_heroes.exe',
        'X:\\Documents\\arcdps\\arcdps.cbtlogs\\' + filepath
    ], cwd='X:\\Documents\\arcdps\\autoparse\\')

    boss_name, char_name, guild_name, file_evtc = filepath.split('\\');

    if (guild_name in guild_tag_map):
        guild_name = guild_tag_map[guild_name];
    else:
        guild_name = 'null'

    if (boss_name in boss_code_map) :
        #scp the generated file
        time_created = file_evtc.split('.')[0];
        file_name = file_evtc.split('.')[0] + '_' + boss_code_map[boss_name] + '.html'

        data = rs.scrape_file(char_name, file_name)
        alldpsdata = rs.scrape_all_data(boss_name, time_created, file_name)

        logmetadata = {
            'boss': boss_name,
            'name': char_name,
            'guild': guild_name,
            'time': time_created,
            'path': file_name,

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
            print('PUT response: ' + r.text)
            logLink = json.loads(r.text)[0];
            print(logLink)

            print('')
            time_string = str(data['bosstime'] // 60) + ':' + ('0' if (data['bosstime'] % 60 < 10) else '') + str(data['bosstime'] % 60)
            print('time: ' + time_string)

            if use_discord:
                if (data['success']):
                    print('Successful Boss Attempt. Posting to discord.')
                    dp.win(boss_name, time_string, logLink)
                else:
                    print('Unsuccessful Boss Attempt. Heckling discord.')
                    dp.lose(boss_name, time_string, logLink)


            if (data['success'] or (boss_name == 'Deimos')):
                for dpsd in alldpsdata:
                    print(dpsd)
                r = requests.put('https://logs.xn--jonathan.com/api/dpsdata', data=json.dumps(alldpsdata), headers=headers)
                print('PUT response: ' + str(r))
                print('PUT response: ' + r.text)
    print('===============================================================\n\r\n\r')

if (len(sys.argv) > 1):
    print('New file notified: ' + sys.argv[1])
    time.sleep(4)
    parse_and_upload(sys.argv[1], len(sys.argv) == 3 and sys.argv[2] == 'post_discord')
