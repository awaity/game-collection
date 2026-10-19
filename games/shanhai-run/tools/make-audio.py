"""Original synthesized pentatonic score and action cues; Python standard library only."""
from pathlib import Path
import math, wave, struct, json, uuid
ROOT = Path(__file__).resolve().parents[1]
RATE = 16000
OUT = ROOT / 'assets/resources/audio'
OUT.mkdir(parents=True, exist_ok=True)
def write(name, duration, notes):
    data = [0.0] * int(duration * RATE)
    for start, freq, length, gain, style in notes:
        for n in range(min(int(length*RATE), len(data)-int(start*RATE))):
            t=n/RATE
            env=min(1,t/.009)*math.exp(-t*(5 if style=='bell' else 2.8)) * min(1,(length-t)/.06)
            f=freq*(1+.30*t if style=='rise' else 1-.25*t if style=='fall' else 1)
            tone=math.sin(2*math.pi*f*t)+.24*math.sin(2*math.pi*f*2.01*t)+.08*math.sin(2*math.pi*f*3*t)
            data[int(start*RATE)+n]+=tone*env*gain
    with wave.open(str(OUT/(name+'.wav')), 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(RATE)
        f.writeframes(b''.join(struct.pack('<h', int(max(-.95,min(.95,v))*32767)) for v in data))
    meta={'ver':'1.0.0','importer':'audio-clip','imported':True,'uuid':str(uuid.uuid5(uuid.NAMESPACE_URL,'shanhai-run/audio/'+name)), 'files':[],'subMetas':{},'userData':{}}
    (OUT/(name+'.wav.meta')).write_text(json.dumps(meta,indent=2)+'\n')
scale=[293.665,329.628,369.994,440,493.883,587.33,659.255,739.989]
melody=[0,2,3,2,0,1,2,4,3,2,1,0,2,3,4,2,0,2,5,4,3,2,1,2,3,4,2,1,0,2,1,0]
notes=[(i*.5,scale[n],.95,.20,'bell') for i,n in enumerate(melody)]
notes += [(i*2,scale[[0,3,2,0][i%4]]/2,1.8,.16,'soft') for i in range(8)]
write('music',17,notes)
for name, freqs, length, style in [('jade',[880,1174],.18,'bell'),('jump',[330,494],.30,'rise'),('slide',[220,147],.30,'fall'),('turn',[440,587],.28,'bell'),('hit',[110,83],.40,'fall'),('death',[294,220,147],.9,'fall'),('power',[294,370,440,587],.8,'bell'),('area',[370,440,587,740],.9,'bell'),('win',[294,370,440,587,740],1.2,'bell'),('revive',[220,330,440,660],.9,'rise')]:
    write(name,length,[(i*length/len(freqs)*.6,f,length*.65,.27,style) for i,f in enumerate(freqs)])
