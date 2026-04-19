import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '@/constants/theme';

type Note = { id:number; title:string; body:string; date:string; color:string };

const COLORS = [theme.accent, theme.teal, theme.orange, theme.success, theme.error, theme.pink];

const INITIAL: Note[] = [
  { id:1, title:'Welcome!', body:'Your notes live here. Tap + to add one.', date:new Date().toLocaleDateString(), color:theme.accent },
];

export default function Notes() {
  const [notes,setNotes] = useState<Note[]>(INITIAL);
  const [view,setView]   = useState<'list'|'edit'>('list');
  const [cur,setCur]     = useState<Note|null>(null);

  const newNote = () => { const n:Note={id:Date.now(),title:'',body:'',date:new Date().toLocaleDateString(),color:theme.accent}; setCur(n); setView('edit'); };
  const save    = () => { if(!cur) return; setNotes(ns=>cur.title||cur.body?[...ns.filter(n=>n.id!==cur.id),cur]:ns.filter(n=>n.id!==cur.id)); setView('list'); };
  const del     = () => { if(!cur) return; setNotes(ns=>ns.filter(n=>n.id!==cur.id)); setView('list'); };

  if(view==='edit'&&cur) return (
    <SafeAreaView style={s.safe} edges={['top','left','right']}>
      <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':undefined}>
        <View style={[s.editHeader, { borderBottomColor:cur.color }]}>
          <TouchableOpacity style={s.editBack} onPress={save}>
            <Ionicons name="arrow-back" size={18} color={theme.accent} />
            <Text style={s.editBackText}>Back</Text>
          </TouchableOpacity>
          <View style={s.colorPicker}>
            {COLORS.map(c=>(
              <TouchableOpacity key={c} onPress={()=>setCur(n=>n?{...n,color:c}:n)}
                style={[s.colorDot,{ backgroundColor:c },cur.color===c&&{ borderWidth:2,borderColor:'#fff' }]} />
            ))}
          </View>
          <TouchableOpacity style={s.editDelBtn} onPress={del}>
            <Ionicons name="trash-outline" size={18} color={theme.error} />
          </TouchableOpacity>
        </View>

        <ScrollView style={s.editBody} contentContainerStyle={{ paddingBottom:24 }}>
          <TextInput style={[s.titleInput,{ borderBottomColor:cur.color }]} placeholder="Title…" placeholderTextColor={theme.muted} value={cur.title} onChangeText={t=>setCur(n=>n?{...n,title:t}:n)} />
          <TextInput style={s.bodyInput} placeholder="Write something…" placeholderTextColor={theme.muted} multiline value={cur.body} onChangeText={t=>setCur(n=>n?{...n,body:t}:n)} />
        </ScrollView>

        <View style={s.saveBar}>
          <TouchableOpacity style={[s.saveBtn,{ backgroundColor:cur.color }]} onPress={save}>
            <Ionicons name="checkmark" size={18} color="#fff" style={{ marginRight:6 }} />
            <Text style={s.saveBtnText}>Save Note</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe} edges={['top','left','right']}>
      <View style={s.header}>
        <View style={[s.headerIconWrap,{ backgroundColor:`${theme.yellow}22` }]}>
          <Ionicons name="document-text" size={20} color={theme.yellow} />
        </View>
        <View style={{ flex:1 }}>
          <Text style={s.headerTitle}>Notes</Text>
          <Text style={s.headerSub}>{notes.length} note{notes.length!==1?'s':''}</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={newNote}>
          <Ionicons name="add" size={18} color="#111" />
          <Text style={s.addBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom:24 }} showsVerticalScrollIndicator={false}>
        {notes.length===0&&(
          <View style={s.empty}>
            <Ionicons name="document-text-outline" size={52} color={theme.border} />
            <Text style={s.emptyText}>No notes yet. Tap New to create one.</Text>
          </View>
        )}
        {[...notes].reverse().map(n=>(
          <TouchableOpacity key={n.id} style={[s.noteCard,{ borderLeftColor:n.color }]} onPress={()=>{setCur(n);setView('edit');}}>
            <View style={[s.noteColorBar,{ backgroundColor:`${n.color}18` }]}>
              <Ionicons name="document-text" size={16} color={n.color} />
            </View>
            <View style={{ flex:1 }}>
              <Text style={s.noteTitle} numberOfLines={1}>{n.title||'Untitled'}</Text>
              <Text style={s.noteBody}  numberOfLines={2}>{n.body||'Empty note'}</Text>
              <Text style={s.noteDate}>{n.date}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.border} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex:1, backgroundColor:theme.bg },
  header:       { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:20, paddingVertical:16, borderBottomWidth:1, borderBottomColor:theme.border },
  headerIconWrap:{ width:40, height:40, borderRadius:12, alignItems:'center', justifyContent:'center' },
  headerTitle:  { fontSize:18, fontWeight:'700', color:theme.text },
  headerSub:    { fontSize:11, color:theme.muted },
  addBtn:       { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:theme.accent, borderRadius:20, paddingHorizontal:14, paddingVertical:8 },
  addBtnText:   { color:'#111', fontWeight:'700', fontSize:13 },
  body:         { flex:1, padding:16 },
  noteCard:     { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:theme.card, borderRadius:16, padding:14, marginBottom:10, borderLeftWidth:4, borderWidth:1, borderColor:theme.border },
  noteColorBar: { width:36, height:36, borderRadius:10, alignItems:'center', justifyContent:'center' },
  noteTitle:    { fontSize:15, fontWeight:'700', color:theme.text, marginBottom:3 },
  noteBody:     { fontSize:12, color:theme.muted, lineHeight:18, marginBottom:6 },
  noteDate:     { fontSize:11, color:theme.border },
  empty:        { alignItems:'center', paddingTop:80, gap:12 },
  emptyText:    { color:theme.muted, fontSize:14, textAlign:'center' },
  // Edit
  editHeader:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:16, paddingVertical:14, borderBottomWidth:2, backgroundColor:theme.surface },
  editBack:     { flexDirection:'row', alignItems:'center', gap:4 },
  editBackText: { fontSize:14, fontWeight:'700', color:theme.accent },
  editDelBtn:   { padding:4 },
  colorPicker:  { flexDirection:'row', gap:8 },
  colorDot:     { width:22, height:22, borderRadius:11 },
  editBody:     { flex:1, padding:16 },
  titleInput:   { fontSize:22, fontWeight:'700', color:theme.text, borderBottomWidth:2, marginBottom:16, paddingBottom:8 },
  bodyInput:    { fontSize:15, color:theme.text, lineHeight:24, minHeight:200 },
  saveBar:      { padding:16, paddingBottom:Platform.OS==='ios'?0:16 },
  saveBtn:      { flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:14, padding:15 },
  saveBtnText:  { color:'#fff', fontWeight:'700', fontSize:16 },
});