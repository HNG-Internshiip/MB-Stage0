import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import theme from '@/constants/theme';

const fmt = (ms: number) => {
  const t = Math.floor(ms / 10);
  return `${String(Math.floor(t / 6000)).padStart(2, '0')}:${String(Math.floor(t / 100) % 60).padStart(2, '0')}.${String(t % 100).padStart(2, '0')}`;
};
const fmtS = (s: number) =>
  `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ── Stopwatch ────────────────────────────────────────────────────────────────
function Stopwatch() {
  const [ms, setMs]       = useState(0);
  const [running, setRun] = useState(false);
  const [laps, setLaps]   = useState<number[]>([]);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  const start = useRef(0);

  const handleStart = () => {
    start.current = Date.now() - ms;
    ref.current = setInterval(() => setMs(Date.now() - start.current), 50);
    setRun(true);
  };
  const handleStop  = () => { clearInterval(ref.current!); setRun(false); };
  const handleReset = () => { clearInterval(ref.current!); setRun(false); setMs(0); setLaps([]); };
  const handleLap   = () => running && setLaps(l => [...l, ms]);

  useEffect(() => () => clearInterval(ref.current!), []);

  return (
    <View style={s.card}>
      <Text style={s.bigTime}>{fmt(ms)}</Text>
      <View style={s.btnRow}>
        <TouchableOpacity style={[s.btn, { backgroundColor: theme.surface }]} onPress={handleReset}><Text style={[s.btnText, { color: theme.text }]}>Reset</Text></TouchableOpacity>
        <TouchableOpacity style={[s.btn, { backgroundColor: running ? theme.error : theme.success }]} onPress={running ? handleStop : handleStart}><Text style={s.btnText}>{running ? 'Stop' : 'Start'}</Text></TouchableOpacity>
        <TouchableOpacity style={[s.btn, { backgroundColor: theme.surface }]} onPress={handleLap}><Text style={[s.btnText, { color: theme.text }]}>Lap</Text></TouchableOpacity>
      </View>
      {laps.length > 0 && (
        <ScrollView style={{ maxHeight: 140, marginTop: 12 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {[...laps].reverse().map((l, i) => (
            <View key={i} style={s.lapRow}>
              <Text style={s.lapLabel}>Lap {laps.length - i}</Text>
              <Text style={s.lapTime}>{fmt(l)}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ── Countdown Timer ──────────────────────────────────────────────────────────
function CountdownTimer() {
  const [hh, setHh] = useState('0');
  const [mm, setMm] = useState('1');
  const [ss, setSs] = useState('0');
  const [total, setTotal]       = useState(0);
  const [remaining, setRemain]  = useState(0);
  const [running, setRun]       = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  const remRef = useRef(0);

  const handleStart = () => {
    const t = (+hh) * 3600 + (+mm) * 60 + (+ss);
    if (!t || running) return;
    const rem = remaining || t;
    setTotal(t); setRemain(rem); remRef.current = rem; setRun(true);
    ref.current = setInterval(() => {
      remRef.current--;
      setRemain(remRef.current);
      if (remRef.current <= 0) { clearInterval(ref.current!); setRun(false); }
    }, 1000);
  };
  const handleStop  = () => { clearInterval(ref.current!); setRun(false); };
  const handleReset = () => { clearInterval(ref.current!); setRun(false); setRemain(0); setTotal(0); };

  useEffect(() => () => clearInterval(ref.current!), []);

  const R = 80, CIRC = 2 * Math.PI * R;
  const pct = total ? ((total - remaining) / total) : 0;
  const strokeColor = remaining <= 10 && running ? theme.error : theme.accent;

  return (
    <View style={s.card}>
      {!running && remaining === 0 && (
        <View style={s.timeInputRow}>
          {[['HH', hh, setHh], ['MM', mm, setMm], ['SS', ss, setSs]].map(([lbl, val, set]) => (
            <View key={lbl as string} style={s.timeInputWrap}>
              <TextInput
                style={s.timeInput} keyboardType="numeric"
                value={val as string} onChangeText={set as (v: string) => void}
                maxLength={2}
              />
              <Text style={s.timeInputLabel}>{lbl as string}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ alignItems: 'center', marginVertical: 8 }}>
        <Svg width={180} height={180}>
          <Circle cx={90} cy={90} r={R} fill="none" stroke={theme.border} strokeWidth={10} />
          <Circle
            cx={90} cy={90} r={R} fill="none"
            stroke={strokeColor} strokeWidth={10}
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * pct}
            strokeLinecap="round"
            rotation={-90} origin="90, 90"
          />
          <SvgText x={90} y={97} textAnchor="middle" fill={theme.text} fontSize={26} fontWeight="300">
            {fmtS(remaining)}
          </SvgText>
        </Svg>
      </View>

      <View style={s.btnRow}>
        <TouchableOpacity style={[s.btn, { backgroundColor: theme.surface, flex: 1 }]} onPress={handleReset}><Text style={[s.btnText, { color: theme.text }]}>Reset</Text></TouchableOpacity>
        <TouchableOpacity style={[s.btn, { backgroundColor: running ? theme.error : theme.success, flex: 1 }]} onPress={running ? handleStop : handleStart}><Text style={s.btnText}>{running ? 'Pause' : 'Start'}</Text></TouchableOpacity>
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function TimeTools() {
  const [tab, setTab] = useState<'stopwatch' | 'timer'>('stopwatch');

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.headerIcon}>⏱️</Text>
        <View>
          <Text style={s.headerTitle}>Time Tools</Text>
          <Text style={s.headerSub}>Stopwatch & Countdown</Text>
        </View>
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={s.tabs}>
          {(['stopwatch', 'timer'] as const).map(t => (
            <TouchableOpacity key={t} style={[s.tabBtn, tab === t && s.tabBtnActive]} onPress={() => setTab(t)}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t === 'stopwatch' ? '⏱ Stopwatch' : '⏳ Timer'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {tab === 'stopwatch' ? <Stopwatch /> : <CountdownTimer />}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: theme.bg },
  header:         { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1e1b4b', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.border },
  headerIcon:     { fontSize: 22 },
  headerTitle:    { fontSize: 18, fontWeight: '700', color: theme.pink },
  headerSub:      { fontSize: 11, color: theme.muted },
  body:           { flex: 1, padding: 16 },
  tabs:           { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tabBtn:         { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.border },
  tabBtnActive:   { borderColor: theme.accent, backgroundColor: `${theme.accent}22` },
  tabText:        { color: theme.muted, fontSize: 13, fontWeight: '600' },
  tabTextActive:  { color: theme.accent },
  card:           { backgroundColor: theme.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.border },
  bigTime:        { fontSize: 52, fontWeight: '200', color: theme.accent2, textAlign: 'center', paddingVertical: 20, letterSpacing: 2 },
  btnRow:         { flexDirection: 'row', gap: 10 },
  btn:            { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center' },
  btnText:        { color: '#fff', fontWeight: '700', fontSize: 14 },
  lapRow:         { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: theme.border },
  lapLabel:       { color: theme.muted, fontSize: 13 },
  lapTime:        { color: theme.accent2, fontSize: 13 },
  timeInputRow:   { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 8 },
  timeInputWrap:  { alignItems: 'center' },
  timeInput:      { backgroundColor: theme.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.border, color: theme.text, fontSize: 24, textAlign: 'center', width: 70, padding: 10 },
  timeInputLabel: { fontSize: 11, color: theme.muted, marginTop: 4 },
});