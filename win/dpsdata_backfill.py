import evtc_uploader as eu
import os

rootdir = 'X:\Documents\arcdps\arcdps.cbtlogs';

#boss_name, char_name, guild_name, file_evtc = sys.argv[1].split('\\');

for root, dirs, files in os.walk(rootdir):
    if (files and not dirs):
        for filename in files:
            try:
                eu.parse_and_upload('\\'.join(os.path.join(root, filename).split('\\')[4:]), False)
            except:
                print('ERROR OCCURRED - SKIPPING')
