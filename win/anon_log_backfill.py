import requests
import raidheroes_scraper as rs
import json
import os
import subprocess

rootdir = 'X:\\Downloads\\LuckFiles';

boss_code_map = {
    'golem': 'Massive Kitty Golem',
    'vg': 'Vale Guardian',
    'gorse': 'Gorseval the Multifarious',
    'sab': 'Sabetha the Saboteur',
    'sloth': 'Slothasor',
    'matt': 'Matthias Gabrel',
    'kc': 'Keep Construct',
    'xera': 'Xera',
    'cairn': 'Cairn the Indomitable',
    'mo': 'Mursaat Overseer',
    'sam': 'Samarog',
    'dei': 'Deimos',
};

for root, dirs, files in os.walk(rootdir):
    if (files and not dirs):
        for file_name in files:
            if '.html' in file_name:
                try:
                    print(file_name)
                    print('')

                    time_created = file_name.split('_')[0];
                    boss_name = boss_code_map[file_name.split('_')[1].split('.')[0]]
                    alldpsdata = rs.scrape_all_data(boss_name, time_created, os.path.join(root, file_name))

                    for dpsd in alldpsdata:
                        print(dpsd)

                    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
                    r = requests.put('https://logs.xn--jonathan.com/api/dpsdata', data=json.dumps(alldpsdata), headers=headers)
                    print('PUT response: ' + str(r))
                    print('PUT response: ' + r.text)
                    print('==================================================')

                    subprocess.call(
                        [
                            'rsync',
                            '-vz',
                            '--chmod=u+rwx,g+rwx,o+rwx',
                            '-e', 'ssh -i C:/Users/Jonathan/.ssh/id_rsa',
                            file_name,
                            'root@logs.xn--jonathan.com:/var/www/logs/html/logs'
                        ],
                        cwd=root,
                        shell=True
                    )
                except Exception as ex:
                    print(ex)
                    print('ERROR OCCURRED - SKIPPING')
