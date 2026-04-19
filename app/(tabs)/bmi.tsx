import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '@/constants/theme';

type Category = { label:string; color:string };

function getCategory(bmi:number): Category {
  if(bmi<18.5) return { label:'Underweight', color:theme.teal    };
  if(bmi<25)   return { label:'Normal',      color:theme.success };
  if(bmi<30)   return { label:'Overweight',  color:theme.orange  };
  return              { label:'Obese',       color:theme.error   };
}

const SCALE = [
  { range:'<18.5',     label:'Under',  color:theme.teal    },
  { range:'18.5–25',   label:'Normal', color:theme.success },
  { range:'25–30',     label:'Over',   color:theme.orange  },
  { range:'≥30',       label:'Obese',  color:theme.error   },
];

export default function BMICalc() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit]     = useState<'metric'|'imperial'>('metric');
  const [result, setResult] = useState<{ bmi:string; cat:Category }|null>(null);

  const calc = () => {
    let h=parseFloat(height), w=parseFloat(weight); if(!h||!w) return;
    if(unit==='imperial'){h=h*0.0254;w=w*0.453592;}else{h=h/100;}
    const bmi=w/(h*h);
    setResult({ bmi:bmi.toFixed(1), cat:getCategory(bmi) });
  };

  return (
    <SafeAreaView style={s.safe} edges={['top','left','right']}>
      <View style={s.header}>
        <View style={[s.headerIconWrap, { backgroundColor:`${theme.success}22` }]}>
          <Ionicons name="body" size={20} color={theme.success} />
        </View>
        <View>
          <Text style={s.headerTitle}>BMI Calculator</Text>
          <Text style={s.headerSub}>Body Mass Index</Text>
        </View>
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom:28 }} showsVerticalScrollIndicator={false}>
        {/* Unit toggle */}
        <View style={s.toggle}>
          {(['metric','imperial'] as const).map(u=>(
            <TouchableOpacity key={u} style={[s.toggleBtn, unit===u && s.toggleActive]} onPress={()=>{setUnit(u);setResult(null);}}>
              <Ionicons name={u==='metric'?'globe-outline':'flag-outline'} size={13} color={unit===u?theme.success:theme.muted} style={{ marginRight:5 }} />
              <Text style={[s.toggleText, unit===u && { color:theme.success }]}>{u==='metric'?'Metric (cm/kg)':'Imperial (in/lb)'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.card}>
          {/* Height */}
          <Text style={s.label}>HEIGHT ({unit==='metric'?'cm':'inches'})</Text>
          <View style={s.inputWrap}>
            <Ionicons name="resize-outline" size={16} color={theme.muted} style={{ marginRight:8 }} />
            <TextInput style={s.input} keyboardType="numeric" placeholder={unit==='metric'?'e.g. 175':'e.g. 69'} placeholderTextColor={theme.muted} value={height} onChangeText={t=>{setHeight(t);setResult(null);}} />
          </View>

          {/* Weight */}
          <Text style={s.label}>WEIGHT ({unit==='metric'?'kg':'lbs'})</Text>
          <View style={s.inputWrap}>
            <Ionicons name="barbell-outline" size={16} color={theme.muted} style={{ marginRight:8 }} />
            <TextInput style={s.input} keyboardType="numeric" placeholder={unit==='metric'?'e.g. 70':'e.g. 154'} placeholderTextColor={theme.muted} value={weight} onChangeText={t=>{setWeight(t);setResult(null);}} />
          </View>

          <TouchableOpacity style={[s.btn, { backgroundColor:theme.success }]} onPress={calc}>
            <Ionicons name="fitness-outline" size={16} color="#fff" style={{ marginRight:6 }} />
            <Text style={s.btnText}>Calculate BMI</Text>
          </TouchableOpacity>

          {result && (
            <View style={[s.result, { borderColor:`${result.cat.color}44` }]}>
              <Text style={[s.bmiVal, { color:result.cat.color }]}>{result.bmi}</Text>
              <View style={[s.badge, { backgroundColor:`${result.cat.color}22` }]}>
                <Text style={[s.badgeText, { color:result.cat.color }]}>{result.cat.label}</Text>
              </View>
              {/* Scale row */}
              <View style={s.scale}>
                {SCALE.map(sc=>(
                  <View key={sc.label} style={s.scaleItem}>
                    <Text style={[s.scaleRange, { color:sc.color }]}>{sc.range}</Text>
                    <Text style={s.scaleLabel}>{sc.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex:1, backgroundColor:theme.bg },
  header:          { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:20, paddingVertical:16, borderBottomWidth:1, borderBottomColor:theme.border },
  headerIconWrap:  { width:40, height:40, borderRadius:12, alignItems:'center', justifyContent:'center' },
  headerTitle:     { fontSize:18, fontWeight:'700', color:theme.text },
  headerSub:       { fontSize:11, color:theme.muted, marginTop:1 },
  body:            { flex:1, padding:16 },
  toggle:          { flexDirection:'row', backgroundColor:theme.card, borderRadius:14, padding:4, marginBottom:14, borderWidth:1, borderColor:theme.border },
  toggleBtn:       { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', paddingVertical:10, borderRadius:10 },
  toggleActive:    { backgroundColor:theme.surface },
  toggleText:      { fontSize:12, color:theme.muted, fontWeight:'600' },
  card:            { backgroundColor:theme.card, borderRadius:20, padding:18, borderWidth:1, borderColor:theme.border },
  label:           { fontSize:11, color:theme.muted, fontWeight:'600', marginBottom:8, letterSpacing:0.6, textTransform:'uppercase' },
  inputWrap:       { flexDirection:'row', alignItems:'center', backgroundColor:theme.surface, borderRadius:12, paddingHorizontal:14, paddingVertical:2, borderWidth:1, borderColor:theme.border, marginBottom:16 },
  input:           { flex:1, color:theme.text, fontSize:16, paddingVertical:12 },
  btn:             { flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:14, padding:14, marginTop:4 },
  btnText:         { color:'#fff', fontWeight:'800', fontSize:15 },
  result:          { backgroundColor:theme.surface, borderRadius:14, padding:16, marginTop:16, alignItems:'center', borderWidth:1 },
  bmiVal:          { fontSize:56, fontWeight:'800' },
  badge:           { borderRadius:20, paddingHorizontal:14, paddingVertical:5, marginTop:6 },
  badgeText:       { fontWeight:'700', fontSize:14 },
  scale:           { flexDirection:'row', justifyContent:'space-between', width:'100%', marginTop:16 },
  scaleItem:       { alignItems:'center' },
  scaleRange:      { fontSize:11, fontWeight:'700' },
  scaleLabel:      { fontSize:11, color:theme.muted, marginTop:2 },
});