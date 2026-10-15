import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEVELS } from './content';

const KEY = 'progress-v1';
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

function Feedback({ ok, note, onNext }) {
  return (
    <View style={[s.fb, ok ? s.fbOk : s.fbBad]}>
      <Text style={s.fbTitle}>{ok ? 'Correct!' : 'Not quite'}</Text>
      {!!note && <Text style={s.fbNote}>{note}</Text>}
      <TouchableOpacity style={s.btn} onPress={onNext}><Text style={s.btnText}>Continue</Text></TouchableOpacity>
    </View>
  );
}

function Choice({ ex, onDone }) {
  const [sel, setSel] = useState(null);
  const done = sel !== null;
  return (
    <View>
      <Text style={s.prompt}>{ex.prompt}</Text>
      {ex.options.map((o, i) => {
        const st = !done ? null : i === ex.answer ? s.right : i === sel ? s.wrong : null;
        return (
          <TouchableOpacity key={i} disabled={done} onPress={() => setSel(i)} style={[s.opt, st]}>
            <Text style={s.optText}>{o}</Text>
          </TouchableOpacity>
        );
      })}
      {done && <Feedback ok={sel === ex.answer} note={ex.note} onNext={() => onDone(sel === ex.answer)} />}
    </View>
  );
}

function Order({ ex, onDone }) {
  const [pool, setPool] = useState(() => shuffle(ex.words.map((w, i) => ({ w, i }))));
  const [picked, setPicked] = useState([]);
  const [checked, setChecked] = useState(false);
  const ok = picked.map((p) => p.w).join(' ') === ex.words.join(' ');
  const pick = (p) => { setPool(pool.filter((x) => x.i !== p.i)); setPicked([...picked, p]); };
  const unpick = (p) => { setPicked(picked.filter((x) => x.i !== p.i)); setPool([...pool, p]); };
  return (
    <View>
      <Text style={s.prompt}>{ex.prompt}</Text>
      <View style={s.answerBox}>
        {picked.map((p) => (
          <TouchableOpacity key={p.i} disabled={checked} onPress={() => unpick(p)} style={s.chip}><Text style={s.chipText}>{p.w}</Text></TouchableOpacity>
        ))}
      </View>
      <View style={s.pool}>
        {pool.map((p) => (
          <TouchableOpacity key={p.i} onPress={() => pick(p)} style={s.chip}><Text style={s.chipText}>{p.w}</Text></TouchableOpacity>
        ))}
      </View>
      {!checked && (
        <TouchableOpacity style={[s.btn, pool.length > 0 && s.btnOff]} disabled={pool.length > 0} onPress={() => setChecked(true)}>
          <Text style={s.btnText}>Check</Text>
        </TouchableOpacity>
      )}
      {checked && <Feedback ok={ok} note={ex.note} onNext={() => onDone(ok)} />}
    </View>
  );
}

function Lesson({ unit, onFinish, onExit }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const total = unit.exercises.length;
  if (idx >= total) {
    return (
      <View style={s.center}>
        <Text style={s.big}>{score} / {total}</Text>
        <Text style={s.sub}>{score === total ? 'Perfect run.' : 'Practice again to improve your score.'}</Text>
        <TouchableOpacity style={s.btn} onPress={() => onFinish(score, total)}><Text style={s.btnText}>Back to units</Text></TouchableOpacity>
      </View>
    );
  }
  const ex = unit.exercises[idx];
  const next = (ok) => { if (ok) setScore(score + 1); setIdx(idx + 1); };
  const Ex = ex.type === 'order' ? Order : Choice;
  return (
    <ScrollView contentContainerStyle={s.pad}>
      <View style={s.row}>
        <TouchableOpacity onPress={onExit}><Text style={s.link}>Close</Text></TouchableOpacity>
        <Text style={s.sub}>{idx + 1} / {total}</Text>
      </View>
      <View style={s.bar}><View style={[s.barFill, { width: `${(idx / total) * 100}%` }]} /></View>
      <Ex key={idx} ex={ex} onDone={next} />
    </ScrollView>
  );
}

function Home({ progress, onStart }) {
  return (
    <ScrollView contentContainerStyle={s.pad}>
      <Text style={s.title}>English Journey</Text>
      <Text style={s.sub}>من A1 للاحتراف، خطوة بخطوة</Text>
      {LEVELS.map((lv) => (
        <View key={lv.code} style={s.level}>
          <Text style={s.levelTitle}>{lv.code} · {lv.name} ({lv.nameAr})</Text>
          {lv.units.length === 0 && <Text style={s.sub}>قريبًا</Text>}
          {lv.units.map((u) => {
            const p = progress[u.id];
            return (
              <TouchableOpacity key={u.id} style={s.unit} onPress={() => onStart(u)}>
                <View>
                  <Text style={s.unitTitle}>{u.title}</Text>
                  <Text style={s.sub}>{u.titleAr}</Text>
                </View>
                <Text style={s.unitScore}>{p ? `${p.best}/${p.total}` : 'Start'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

export default function App() {
  const [progress, setProgress] = useState({});
  const [unit, setUnit] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => v && setProgress(JSON.parse(v))).catch(() => {});
  }, []);
  const finish = (score, total) => {
    const best = Math.max(score, progress[unit.id]?.best || 0);
    const np = { ...progress, [unit.id]: { best, total } };
    setProgress(np);
    AsyncStorage.setItem(KEY, JSON.stringify(np)).catch(() => {});
    setUnit(null);
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.root}>
        <StatusBar barStyle="dark-content" />
        {unit ? <Lesson key={unit.id} unit={unit} onFinish={finish} onExit={() => setUnit(null)} /> : <Home progress={progress} onStart={setUnit} />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const INK = '#14213D', BLUE = '#2A6FDB', GREEN = '#1F9D6B', RED = '#D64550', BG = '#F3F6FA', LINE = '#D5DCE8';
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  pad: { padding: 20, paddingBottom: 60 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 32, fontWeight: '800', color: INK },
  sub: { fontSize: 14, color: '#5B6B88', marginTop: 2 },
  big: { fontSize: 56, fontWeight: '800', color: INK },
  link: { color: BLUE, fontSize: 16 },
  level: { marginTop: 24 },
  levelTitle: { fontSize: 18, fontWeight: '700', color: INK, marginBottom: 8 },
  unit: { backgroundColor: '#fff', borderWidth: 1, borderColor: LINE, borderRadius: 12, padding: 16, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  unitTitle: { fontSize: 17, fontWeight: '600', color: INK },
  unitScore: { fontSize: 15, fontWeight: '700', color: BLUE },
  bar: { height: 6, backgroundColor: LINE, borderRadius: 3, marginBottom: 24 },
  barFill: { height: 6, backgroundColor: BLUE, borderRadius: 3 },
  prompt: { fontSize: 22, fontWeight: '700', color: INK, marginBottom: 20, lineHeight: 30 },
  opt: { backgroundColor: '#fff', borderWidth: 2, borderColor: LINE, borderRadius: 12, padding: 16, marginBottom: 10 },
  optText: { fontSize: 18, color: INK },
  right: { borderColor: GREEN, backgroundColor: '#E5F6EE' },
  wrong: { borderColor: RED, backgroundColor: '#FBE9EA' },
  answerBox: { minHeight: 64, flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: 2, borderColor: LINE, paddingBottom: 8, marginBottom: 20 },
  pool: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  chip: { backgroundColor: '#fff', borderWidth: 1, borderColor: LINE, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, margin: 4 },
  chipText: { fontSize: 18, color: INK },
  btn: { backgroundColor: BLUE, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  btnOff: { backgroundColor: '#A9B6CE' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  fb: { borderRadius: 12, padding: 16, marginTop: 16 },
  fbOk: { backgroundColor: '#E5F6EE' },
  fbBad: { backgroundColor: '#FBE9EA' },
  fbTitle: { fontSize: 18, fontWeight: '800', color: INK },
  fbNote: { fontSize: 15, color: INK, marginTop: 4 },
});
