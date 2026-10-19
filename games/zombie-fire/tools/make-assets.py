"""Original deterministic audio and stable Creator metadata. Standard library only."""
from pathlib import Path
import json, math, random, struct, uuid, wave

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/resources/audio'
OUT.mkdir(parents=True, exist_ok=True)
RATE = 16000

def synth(name, duration, notes, noise=0):
    rng = random.Random('zombie-fire/' + name)
    samples = [0.0] * int(duration * RATE)
    for start, freq, length, gain, sweep in notes:
        start_at = int(start * RATE)
        for n in range(min(int(length * RATE), len(samples) - start_at)):
            t = n / RATE
            envelope = min(1, t / .004) * math.exp(-t * 7 / max(.2, length)) * min(1, (length - t) / .02)
            phase = 2 * math.pi * freq * (t + sweep * t * t / 2)
            tone = math.sin(phase) + .2 * math.sin(phase * 2.003)
            samples[start_at + n] += (tone * (1-noise) + (rng.random()*2-1)*noise) * gain * envelope
    with wave.open(str(OUT / (name + '.wav')), 'wb') as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(RATE)
        output.writeframes(b''.join(struct.pack('<h', int(max(-.94, min(.94, s)) * 32767)) for s in samples))

synth('shot', .13, [(0, 130, .12, .75, -2)], .76)
synth('blast', .65, [(0, 80, .6, .9, -.8), (.02, 57, .6, .3, -.6)], .67)
synth('ice', .38, [(0, 1640, .36, .45, 1), (.035, 2320, .3, .25, -1)], .2)
synth('electric', .24, [(0, 340, .22, .5, 5), (.01, 770, .2, .3, -3)], .18)
synth('reload', .26, [(0, 500, .055, .7, -3), (.14, 820, .1, .45, -4)], .7)
synth('wall', .28, [(0, 90, .25, .65, -1)], .45)
synth('level', .6, [(n*.09, f, .3, .4, 0) for n, f in enumerate([523,659,784,1047])])
synth('win', 1.3, [(n*.15, f, .6, .38, 0) for n, f in enumerate([392,523,659,784,1047])])
synth('lose', 1.2, [(n*.2, f, .5, .4, -.25) for n, f in enumerate([294,247,196,147])])
# An original eight-bar military pulse, seamless at an eight-second boundary.
bass = [98,98,116.54,87.31,98,98,130.81,87.31]
notes = [(i*.5, bass[i//2], .45, .25, 0) for i in range(16)]
notes += [(i, [392,466.16,523.25,349.23][i%4], .9, .11, 0) for i in range(8)]
notes += [(i*.25, 62, .12, .20 if i%4==0 else .09, -2) for i in range(32)]
synth('music', 8, notes)

for path in sorted((ROOT/'assets').rglob('*')):
    if path.suffix == '.meta':
        continue
    meta = Path(str(path)+'.meta')
    if meta.exists():
        continue  # The entry script and scene UUID must keep their established link.
    importer, version = ('directory','1.2.0') if path.is_dir() else ('typescript','4.0.24') if path.suffix=='.ts' else ('audio-clip','1.0.0') if path.suffix=='.wav' else (None,None)
    if not importer:
        continue
    data = {'ver':version,'importer':importer,'imported':True,'uuid':str(uuid.uuid5(uuid.NAMESPACE_URL,'game-collection/zombie-fire/'+str(path.relative_to(ROOT)))),'files':[],'subMetas':{},'userData':{}}
    meta.write_text(json.dumps(data, indent=2)+'\n')
print('Original WAV audio and stable Creator metadata generated.')
