import secrets
import discord
import time
import asyncio
from datetime import datetime

message_to_be_posted = 'test'
soundfile_to_play = ''

TEST_SERVER_NAME = 'The Ratway Warrens';
SERVER_NAME = 'Erotic Casual Platonic Handholding Elitist Raiding Party';
TEXT_CHANNEL_NAME = 'bot';
VOICE_CHANNEL_NAME = '☕ Coffee Table';

client = discord.Client()

@client.event
async def on_ready():
    print('Logged in as')
    print(client.user.name)
    print(client.user.id)
    print('Channel clearance - ' + SERVER_NAME + ':')
    print(discord.utils.get(client.get_all_channels(), server__name=SERVER_NAME, name=TEXT_CHANNEL_NAME))
    print(discord.utils.get(client.get_all_channels(), server__name=SERVER_NAME, name=VOICE_CHANNEL_NAME))

    print('')

    print('Posting Message...')
    await post_message(message_to_be_posted)
    print('Sending Voice Clip...')
    await send_voice_heckle(soundfile_to_play)

    print('')

    print('Logging out...')
    await client.logout()
    print('Logged out.')

async def post_message(message):
    return await client.send_message(
        discord.utils.get(client.get_all_channels(), server__name=SERVER_NAME, name=TEXT_CHANNEL_NAME),
        #discord.utils.get(client.get_all_channels(), server__name=TEST_SERVER_NAME, name=TEXT_CHANNEL_NAME),
        message,
    )

async def send_voice_heckle(filename):
    vc = await client.join_voice_channel(
        discord.utils.get(client.get_all_channels(), server__name=SERVER_NAME, name=VOICE_CHANNEL_NAME),
        #discord.utils.get(client.get_all_channels(), server__name=TEST_SERVER_NAME, name=VOICE_CHANNEL_NAME),
    )

    player = vc.create_ffmpeg_player(filename, options="-af \"volume=0.15\"")
    player.start()
    await asyncio.sleep(10)
    await vc.disconnect()


def win(boss, link):
    global message_to_be_posted
    global soundfile_to_play

    message_to_be_posted = datetime.now().strftime('%Y-%m-%d %H:%M:%S') + ': Successfully cleared ' + boss + '.\n' + link;
    soundfile_to_play = 'win.mp3'
    client.run(secrets.discord_bot_token())

def lose(boss, link):
    global message_to_be_posted
    global soundfile_to_play
    message_to_be_posted = datetime.now().strftime('%Y-%m-%d %H:%M:%S') + ': Wiped at ' + boss + '.\n' + link;
    soundfile_to_play = 'lose.mp3'
    client.run(secrets.discord_bot_token())

def close_client():
    global client
    if not client.is_closed:
        asyncio.ensure_future(client.close())

import atexit
atexit.register(close_client)
