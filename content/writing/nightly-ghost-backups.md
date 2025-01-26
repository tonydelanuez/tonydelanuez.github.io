---
title: "Building nightly ghost blog backups"
date: 2024-01-28T00:17:57-05:00
draft: false
author: "Tony"
tags: ['tech', 'automation', 'ghost']
categories: ['writing']
---

Back in grad school I used to make some extra cash by coaching and writing articles about [Hearthstone](https://hearthstone.blizzard.com/en-us) (an online collectible card game made by Blizzard). I primarily wrote "deck techs", guides that explained how to play the most powerful and consistent decks that were dominating the scene. I loved this job, it was a surprisingly technical creative outlet and paid for the occasional treat meals at my favorite restaurant in St. Louis, [Salt n Smoke.](https://www.saltandsmokebbq.com/)

Recounting this story to my Magic the Gathering group last Thursday at our Pioneer night, a few friends mentioned they'd be interested in doing something similar. Naturally, I rushed home and had a [Ghost](https://ghost.org/) instance spun up on my [home lab](https://tdoot.com/blog/cheap-k8s/) later that night.

Ghost is great but has some rough edges - a big one being the fact many of the `ghost` CLI commands being a light, untyped wrapper around the ghost API.
I wanted to automate our backups for the site to ship full exports to a different VM / cold storage and realized I could potentially do this with `ghost backup`. 

Turns out this feature has partially broken since release 20 months ago - you can't use the non-interactive mode with a few of the commands.

![embarrassed shrek](/images/pictures/shrek.png)

The `ghost` CLI has a `--no-prompt` option presumably used for automation (the CLI is interactive by default and prompts you for command arguments) but it seems to have never worked with `backup` because the arguments supplied to the command are never sent anywhere (like to the necessary auth check).


```
tdoot@util-arm:/var/www/decked$ ghost backup --no-prompt --username test@test.com --password foo

Love open source? We’re hiring JavaScript Engineers to work on Ghost full-time.
https://careers.ghost.org


+ sudo systemctl is-active ghost_decked-gg-1
+ sudo mkdir -p /var/www/decked/backup
✖ Backing up site
A SystemError occurred.

Message: Prompts have been disabled, all options must be provided via command line flags

Debug Information:
    OS: Ubuntu, v22.04.3 LTS
    Node Version: v18.19.0
    Ghost Version: 5.76.2
    Ghost-CLI Version: 1.25.3
    Environment: production
    Command: 'ghost backup --no-prompt --username test@test.com --password foo'

Try running ghost doctor to check your system for known issues.

You can always refer to https://ghost.org/docs/ghost-cli/ for troubleshooting
```

*"Prompts have been disabled, all options must be provided via command line flags".* 

That doesn't seem right... The only available options for this are the username and password.
Realizing this was going to block me or be a complete pain to get around, I did what every rational developer would do - make an issue on GitHub and complain on Reddit.
If only. I really wanted to get this working so I figured the best way to move forward was to find the Ghost CLI repository and fix it myself.

After some spelunking I found [this commit](https://github.com/TryGhost/Ghost-CLI/commit/1c689bb64c83308426060ca0a78e122bb8454b94), where I saw `argv` was removed from this command's run method - which made me realize there's never any actual mention of auth in this code.

FWIW I assume this has remained broken because folks primarily use the web-based export (which works great by the way).

![ghost backup UI](/images/pictures/ghost_backup.png)

Opening up a [quick PR](https://github.com/TryGhost/Ghost-CLI/pull/1817) and pulling my fork onto our VM in the meantime got me back on the path of building a janky backup system. 

```
tdoot@util-arm:/var/www/decked$ ghost backup --no-prompt --username <redacted> --password <redacted>

Love open source? We’re hiring JavaScript Engineers to work on Ghost full-time.
https://careers.ghost.org


+ sudo systemctl is-active ghost_decked-gg-1
+ sudo mkdir -p /var/www/decked/backup
+ sudo cp /var/www/decked/backup/content-from-v5.76.2-on-2024-01-28-04-48-40.json /var/www/decked/content/data/content-from-v5.76.2-on-2024-01-28-04-48-40.json
+ sudo cp /var/www/decked/backup/members-from-v5.76.2-on-2024-01-28-04-48-40.csv /var/www/decked/content/data/members-from-v5.76.2-on-2024-01-28-04-48-40.csv
+ sudo chown -R ghost:ghost /var/www/decked/content
✔ Backing up site
Backup saved to /var/www/decked/backup-from-v5.76.2-on-2024-01-28-04-48-40.zip
```

nice. 🧙

With backups working on my fork, I decided to throw on some additional sugar for ease of use.

I wrote a wrapper script that:
- Calls `ghost backup` and grabs the name of the created archive
- `rsync`s the archive to a backup server
- Post a message to my Discord server via webhook to let me know the backup completed successfully

*Aside: I've enjoyed using Discord webhooks as a pseudo alerting system for things like this, only takes a few clicks to set up and I can just send the payloads with a quick cURL.*
  
The backup script looks something like this:

```
#!/bin/sh
set -e

WEBHOOK_URL="<discord webhook url>"
USER="<user>"
# read secret from a file
PASSWORD=$(cat /path/to/secret)

# run the actual backup
ghost backup --no-prompt --username $USER --password $PASSWORD
BACKUP_FILE=$(ls backup-from-*)

rsync backup-from-* <BACKUP_HOST>:/backup/path/
rm backup-from-*

curl -X POST $WEBHOOK_URL -d "content=Backup synced ($BACKUP_FILE)"
```

To run this nightly I tossed a quick entry in the crontab (`crontab -e`):
```
# m h  dom mon dow   command
0 0 * * * /bin/bash /var/www/decked/backup.sh
```

Now I've got a cheeky little nightly backup setup that should insulate me from angering my friends when I accidentally blow up the site.


![ghost backup UI](/images/pictures/discord_backup_notification.png)