---
title: "How Do We Represent Sound"
date: 2025-07-17T22:18:21-05:00
draft: false
---

Today on a walk I started thinking about audio files, so I tried to walk through them from first principles and explore deeper when I got home.

# Notes
On my walk, I recorded assumptions in my Notes app - partially using voice, typing when that failed.
I hadn't validated these, but they were the start of my train of thought.

1. Humans experience sound though vibrations transmitted through the ear drum and small bones in the ear, then to the cochlea, which vibrates little hairs that send electrical signals to the brain via the auditory nerve (I think? this is why cochlear implants are so effective - they're about as direct we can get to interacting with the brain) 
2. To express sound, we probably need to express frequency, loudness, and ... "sound"? Like.. whatever makes a violin playing a C note at the same volume sound different than a piano 
    - (I later learned I was dancing around ["timbre"](https://en.wikipedia.org/wiki/Timbre))
3. In order to represent this data in a way that can be stored on a computer, we need to come up with a multi-dimensional representation that expresses a ... frame? of sound. Frame is probably the wrong way to describe it, but a snapshot of the "sound data" at a specific point in time.
4. To "replay" the file, we need metadata that gives the player information about the sound - I assume one of the key pieces here is the rate at which we process frames? Unless that's standard across filetypes? I doubt we've been able to standardize on a number but I **believe** this is sample rate and is expressed in Hertz
    - (bingo)
5. Similar to pictures or binaries, the metadata is probably represented as a byte sequence in the header / first few bytes of the file. I've messed with hex editors before with games, I'll just look up the .wav or .mp3 header when I get home. 
    - [wav file](https://docs.fileformat.com/audio/wav/)
6. Based on reddit threads I remember from arguments about "lossless" music, I imagine "simpler" formats (.wav) just contain less rich data about the source sound than their FLAC counterparts. Either they're less expressive in the dimensionality of their frames and/or there are less frames per unit of time? Anyway, apparently without listening to lossless music I'm not experiencing the full glory of Modest Mouse but instead drinking what must feel like a Lemon Lime La Croix to a margarita. 

# Tinkering
So here's the [WAV File Header](https://docs.fileformat.com/audio/wav/#wav-file-header).
I downloaded a [sample wav](https://github.com/pdx-cs-sound/wavs/blob/main/voice.wav) file and started messing around with it.

```bash
💀 ➜  wav  ls -l
total 1296
-rw-r--r--@ 1 tdoot  staff  176444 Jul 17 21:15 sine.wav
-rw-r--r--@ 1 tdoot  staff  475180 Jul 17 21:13 voice.wav
-rw-r--r--@ 1 tdoot  staff    1530 Jul 17 21:11 wav_tinkering.ipynb
```

We see that the "voice.wav" file has a file size of 475180 bytes.
By printing the first 44 bytes, we can inspect the header and map from the documentation:
```python
with open("voice.wav", "rb") as f:
    header = f.read(44)
    
for i in range(0, len(header), 4):
    chunk = header[i:i+4]
    print(f"{i:02}: {chunk} – {int.from_bytes(chunk, 'little')}")
```

On the sample file, we see:
```bash
00: b'RIFF' – 1179011410
04: b'$@\x07\x00' – 475172
08: b'WAVE' – 1163280727
12: b'fmt ' – 544501094
16: b'\x10\x00\x00\x00' – 16
20: b'\x01\x00\x01\x00' – 65537
24: b'\x80\xbb\x00\x00' – 48000
28: b'\x00w\x01\x00' – 96000
32: b'\x02\x00\x10\x00' – 1048578
36: b'data' – 1635017060
40: b'\x00@\x07\x00' – 475136
```

So going through these and following the [file header chart](https://docs.fileformat.com/audio/wav/#wav-file-header) and [teragon audio](http://midi.teragonaudio.com/tech/wave.htm), we get the following information:
```
1-4: The file is a RIFF file.
5-8: The file is 475180 bytes (this is stored as the size of the file - 8).
9-12: This is the WAVE file type header.
--- format chunk ---
13-16: fmt chunk marker, start of the parameters explaining the waveform
17-20: (b'\x10\x00\x00\x00') Format data is 16 bytes
21-22: (b'\x01\x00') PCM format
23-24: (b'\x01\x00') 1 channel (mono as opposed to stereo)
25-28: (b'\x80\xbb\x00\x00') 48000 sample rate (DAT)
29-32: (b'\x00w\x01\x00') 96000 = (SampleRate * BitsPerSample * Channels) / 8
33-34: (b'\x02\x00') (BitsPerSample * Channels) / 8 = 2
35-36: (b'\x10\x00') 16 bits per sample (confirms above, 16 bits * 1 channel / 8 == 2)
37-40: (b'x02\x00\x10\x00') Size of the data section is 1048578 bytes
```

The [wave](https://docs.python.org/3/library/wave.html) library is how someone who respects their time would find this information, apparently.

```python
import numpy as np
import matplotlib.pyplot as plt
import wave

with wave.open("voice.wav", "rb") as w:
    print("Channels:", w.getnchannels())
    print("Sample width (bytes):", w.getsampwidth())
    print("Frame rate (Hz):", w.getframerate())
    print("Frame count:", w.getnframes())
    print("Compression:", w.getcomptype(), w.getcompname())

    frames = w.readframes(1024)
    raw_signal = np.frombuffer(frames, dtype=np.int16)
    plt.plot(raw_signal)
    plt.title("First 1024 samples of the voice track")
    plt.xlabel("Sample")
    plt.ylabel("Amplitude")
    plt.show()
```
Using `wave` to get the header information:

```bash
Channels: 1
Sample width (bytes): 2
Frame rate (Hz): 48000
Frame count: 237568
Compression: NONE not compressed
```
plotting the first 1024 frames

![plotting the first 1024 frames](/images/figures/sound.png)

To be continued as I must sleep
