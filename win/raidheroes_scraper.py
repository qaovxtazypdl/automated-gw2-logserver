#dont look at this file, and I wont either

#        'bosstime': 1,
#        'class': 1,
#        'cleavedmg': 1,
#        'bossdmg': 1,
#        'rank': 1,
#        'people': 1,
def scrape_file(charname, filename):
    f = open(filename, 'r')
    relevant_lines = [];

    recording = False
    lines = -1
    is_success = False
    for line in f:
        if 'class="table table-condensed table_stats"' in line:
            recording = True
        elif '</tbody>' in line:
            recording = False
            break;

        if 'Success in' in line:
            is_success = True

        if recording and '<tr>' in line:
            lines += 1
            relevant_lines.append(line.rstrip('\n').lstrip('\t ')[4:-5].split('</td>'))
            if charname in line:
                index = lines

    relevant_lines = relevant_lines[1:]

    result = {}
    result['class'] = relevant_lines[index-1][1][relevant_lines[index-1][1].index('alt="') + 5:relevant_lines[index-1][1].index('" data-toggle')].lower()
    result['bossdmg'] = int(relevant_lines[index-1][4][relevant_lines[index-1][4][:-1].rfind('>') + 1:-7])
    result['cleavedmg'] = int(relevant_lines[index-1][8][relevant_lines[index-1][8][:-1].rfind('>') + 1:-7])
    result['rank'] = index
    result['people'] = lines
    totaldps = int(relevant_lines[index-1][4][relevant_lines[index-1][4][:-1].index('title="') + 7:relevant_lines[index-1][4][:-1].index(' dmg"')])
    result['bosstime'] = 0 if result['bossdmg'] == 0 else round(totaldps / result['bossdmg'])
    result['success'] = is_success
    return result
