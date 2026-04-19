import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import theme from '@/constants/theme';

const fmt = (ms:number) => {
  const t=Math.floor(ms/10);
  return `${String(Math.floor(t/6000)).padStart(2,'0')}:${String(Math.floor(t/100)%60).padStart(2,'0')}.${String(t%100).padStart(2,'0')}`;
};
const fmtS = (s:number) =>
  `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s/60)%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

function Stopwatch() {
  const [ms,setMs]       = useState(0);
  const [running,setRun] = useState(false);
  const [laps,setLaps]   = useState<number[]>([]);
  const ref   = useRef<ReturnType<typeof setInterval>|null>(null);
  const start = useRef(0);

  const handleStart = () => { start.current=Date.now()-ms; ref.current=setInterval(()=>setMs(Date.now()-start.current),50); setRun(true); };
  const handleStop  = () => { clearInterval(ref.current!); setRun(false); };
  const handleReset = () => { clearInterval(ref.current!); setRun(false); setMs(0); setLaps([]); };
  const handleLap   = () => running&&setLaps(l=>[...l,ms]);
  useEffect(()=>()=>clearInterval(ref.current!),[]);

  return (
    <View style={s.card}>
      <Text style={s.bigTime}>{fmt(ms)}</Text>

      <View style={s.btnRow}>
        <TouchableOpacity style={[s.ctrlBtn, { backgroundColor:theme.surface }]} onPress={handleReset}>
          <Ionicons name="refresh-outline" size={18} color={theme.muted} />
          <Text style={[s.ctrlText, { color:theme.muted }]}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.ctrlBtn, { backgroundColor:running?theme.error:theme.success }]} onPress={running?handleStop:handleStart}>
          <Ionicons name={running?'stop':'play'} size={18} color="#fff" />
          <Text style={s.ctrlText}>{running?'Stop':'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.ctrlBtn, { backgroundColor:theme.surface }]} onPress={handleLap}>
          <Ionicons name="flag-outline" size={18} color={theme.muted} />
          <Text style={[s.ctrlText, { color:theme.muted }]}>Lap</Text>
        </TouchableOpacity>
      </View>

      {laps.length>0&&(
        <ScrollView style={{ maxHeight:140, marginTop:12 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {[...laps].reverse().map((l,i)=>(
            <View key={i} style={s.lapRow}>
              <View style={s.lapBadge}><Text style={s.lapBadgeText}>Lap {laps.length-i}</Text></View>
              <Text style={s.lapTime}>{fmt(l)}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function CountdownTimer() {
  const [hh,setHh]=useState('0'); const[mm,setMm]=useState('1'); const[ss,setSs]=useState('0');
  const [total,setTotal]=useState(0); const[remaining,setRemain]=useState(0); const[running,setRun]=useState(false);
  const ref=useRef<ReturnType<typeof setInterval>|null>(null); const remRef=useRef(0);

  const handleStart=()=>{
    const t=(+hh)*3600+(+mm)*60+(+ss); if(!t||running) return;
    const rem=remaining||t; setTotal(t); setRemain(rem); remRef.current=rem; setRun(true);
    ref.current=setInterval(()=>{ remRef.current--; setRemain(remRef.current); if(remRef.current<=0){clearInterval(ref.current!);setRun(false);}},1000);
  };
  const handleStop  = ()=>{ clearInterval(ref.current!); setRun(false); };
  const handleReset = ()=>{ clearInterval(ref.current!); setRun(false); setRemain(0); setTotal(0); };
  useEffect(()=>()=>clearInterval(ref.current!),[]);

  const R=75, CIRC=2*Math.PI*R;
  const pct=total?((total-remaining)/total):0;
  const strokeColor=remaining<=10&&running?theme.error:theme.pink;

  return (
    <View style={s.card}>
      {!running&&remaining===0&&(
        <View style={s.timeInputRow}>
          {([['HH',hh,setHh],['MM',mm,setMm],['SS',ss,setSs]] as [string,string,(v:string)=>void][]).map(([lbl,val,set])=>(
            <View key={lbl} style={s.timeInputWrap}>
              <TextInput style={s.timeInput} keyboardType="numeric" value={val} onChangeText={set} maxLength={2} />
              <Text style={s.timeInputLabel}>{lbl}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ alignItems:'center', marginVertical:8 }}>
        <Svg width={180} height={180}>
          <Circle cx={90} cy={90} r={R} fill="none" stroke={theme.border} strokeWidth={10}/>
          <Circle cx={90} cy={90} r={R} fill="none" stroke={strokeColor} strokeWidth={10} strokeDasharray={CIRC} strokeDashoffset={CIRC*pct} strokeLinecap="round" rotation={-90} origin="90,90"/>
          <SvgText x={90} y={97} textAnchor="middle" fill={theme.text} fontSize={26} fontWeight="300">{fmtS(remaining)}</SvgText>
        </Svg>
      </View>

      <View style={s.btnRow}>
        <TouchableOpacity style={[s.ctrlBtn, { backgroundColor:theme.surface, flex:1 }]} onPress={handleReset}>
          <Ionicons name="refresh-outline" size={18} color={theme.muted} />
          <Text style={[s.ctrlText, { color:theme.muted }]}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.ctrlBtn, { backgroundColor:running?theme.error:theme.success, flex:1 }]} onPress={running?handleStop:handleStart}>
          <Ionicons name={running?'pause':'play'} size={18} color="#fff" />
          <Text style={s.ctrlText}>{running?'Pause':'Start'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TimeTools() {
  const [tab,setTab]=useState<'stopwatch'|'timer'>('stopwatch');
  return (
    <SafeAreaView style={s.safe} edges={['top','left','right']}>
      <View style={s.header}>
        <View style={[s.headerIconWrap, { backgroundColor:`${theme.pink}22` }]}>
          <Ionicons name="timer" size={20} color={theme.pink} />
        </View>
        <View>
          <Text style={s.headerTitle}>Time Tools</Text>
          <Text style={s.headerSub}>Stopwatch & Countdown</Text>
        </View>
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom:28 }} showsVerticalScrollIndicator={false}>
        {/* Toggle */}
        <View style={s.toggle}>
          {(['stopwatch','timer'] as const).map(t=>(
            <TouchableOpacity key={t} style={[s.toggleBtn, tab===t&&s.toggleActive]} onPress={()=>setTab(t)}>
              <Ionicons name={t==='stopwatch'?'stopwatch-outline':'hourglass-outline'} size={14} color={tab===t?theme.pink:theme.muted} style={{ marginRight:5 }} />
              <Text style={[s.toggleText, tab===t&&{ color:theme.pink }]}>{t==='stopwatch'?'Stopwatch':'Timer'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab==='stopwatch'?<Stopwatch/>:<CountdownTimer/>}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex:1, backgroundColor:theme.bg },
  header:         { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:20, paddingVertical:16, borderBottomWidth:1, borderBottomColor:theme.border },
  headerIconWrap: { width:40, height:40, borderRadius:12, alignItems:'center', justifyContent:'center' },
  headerTitle:    { fontSize:18, fontWeight:'700', color:theme.text },
  headerSub:      { fontSize:11, color:theme.muted, marginTop:1 },
  body:           { flex:1, padding:16 },
  toggle:         { flexDirection:'row', backgroundColor:theme.card, borderRadius:14, padding:4, marginBottom:14, borderWidth:1, borderColor:theme.border },
  toggleBtn:      { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', paddingVertical:10, borderRadius:10 },
  toggleActive:   { backgroundColor:theme.surface },
  toggleText:     { fontSize:13, color:theme.muted, fontWeight:'600' },
  card:           { backgroundColor:theme.card, borderRadius:20, padding:18, borderWidth:1, borderColor:theme.border },
  bigTime:        { fontSize:52, fontWeight:'200', color:theme.text, textAlign:'center', paddingVertical:20, letterSpacing:2 },
  btnRow:         { flexDirection:'row', gap:10 },
  ctrlBtn:        { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, borderRadius:14, paddingVertical:13 },
  ctrlText:       { color:'#fff', fontWeight:'700', fontSize:14 },
  lapRow:         { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:8, borderBottomWidth:1, borderBottomColor:theme.border },
  lapBadge:       { backgroundColor:theme.surface, borderRadius:8, paddingHorizontal:10, paddingVertical:3 },
  lapBadgeText:   { fontSize:12, color:theme.muted, fontWeight:'600' },
  lapTime:        { fontSize:13, color:theme.teal, fontWeight:'600' },
  timeInputRow:   { flexDirection:'row', justifyContent:'center', gap:12, marginBottom:8 },
  timeInputWrap:  { alignItems:'center' },
  timeInput:      { backgroundColor:theme.surface, borderRadius:12, borderWidth:1, borderColor:theme.border, color:theme.text, fontSize:24, textAlign:'center', width:70, padding:10 },
  timeInputLabel: { fontSize:11, color:theme.muted, marginTop:4 },
});