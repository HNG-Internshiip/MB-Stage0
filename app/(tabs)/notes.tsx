import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '@/constants/theme';

type Note = { id: number; title: string; body: string; date: string; color: string };

const COLORS = [theme.accent, theme.accent2, theme.accent3, theme.success, theme.error, theme.pink];

const INITIAL: Note[] = [
  { id: 1, title: 'Welcome!', body: 'Your notes live here. Tap + to add one.', date: new Date().toLocaleDateString(), color: theme.accent },
];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(INITIAL);
  const [view, setView]   = useState<'list' | 'edit'>('list');
  const [cur, setCur]     = useState<Note | null>(null);

  const newNote = () => {
    const n: Note = { id: Date.now(), title: '', body: '', date: new Date().toLocaleDateString(), color: theme.accent };
    setCur(n); setView('edit');
  };

  const save = () => {
    if (!cur) return;
    setNotes(ns => cur.title || cur.body ? [...ns.filter(n => n.id !== cur.id), cur] : ns.filter(n => n.id !== cur.id));
    setView('list');
  };

  const del = () => {
    if (!cur) return;
    setNotes(ns => ns.filter(n => n.id !== cur.id));
    setView('list');
  };

  // ── Edit view ──────────────────────────────────────────────────────────────
  if (view === 'edit' && cur) {
    return (
      <SafeAreaView style={s.safe}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Edit Header */}
          <View style={[s.editHeader, { borderBottomColor: cur.color }]}>
            <TouchableOpacity onPress={save}><Text style={[s.editAction, { color: theme.accent }]}>← Back</Text></TouchableOpacity>
            <View style={s.colorPicker}>
              {COLORS.map(c => (
                <TouchableOpacity key={c} onPress={() => setCur(n => n ? { ...n, color: c } : n)}
                  style={[s.colorDot, { backgroundColor: c, borderWidth: cur.color === c ? 2 : 0, borderColor: '#fff' }]} />
              ))}
            </View>
            <TouchableOpacity onPress={del}><Text style={[s.editAction, { color: theme.error }]}>Delete</Text></TouchableOpacity>
          </View>

          <ScrollView style={s.editBody} contentContainerStyle={{ paddingBottom: 24 }}>
            <TextInput
              style={[s.titleInput, { borderBottomColor: cur.color }]}
              placeholder="Title…" placeholderTextColor={theme.muted}
              value={cur.title} onChangeText={t => setCur(n => n ? { ...n, title: t } : n)}
            />
            <TextInput
              style={s.bodyInput} placeholder="Write something…"
              placeholderTextColor={theme.muted} multiline
              value={cur.body} onChangeText={t => setCur(n => n ? { ...n, body: t } : n)}
            />
          </ScrollView>

          <View style={s.saveBar}>
            <TouchableOpacity style={[s.saveBtn, { backgroundColor: cur.color }]} onPress={save}>
              <Text style={s.saveBtnText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <View style={s.header}>
        <Text style={s.headerIcon}>📝</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Notes</Text>
          <Text style={s.headerSub}>{notes.length} note{notes.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={newNote}>
          <Text style={s.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {notes.length === 0 && (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>📭</Text>
            <Text style={s.emptyText}>No notes yet. Tap + to create one.</Text>
          </View>
        )}
        {[...notes].reverse().map(n => (
          <TouchableOpacity key={n.id} style={[s.noteCard, { borderLeftColor: n.color }]} onPress={() => { setCur(n); setView('edit'); }}>
            <Text style={s.noteTitle} numberOfLines={1}>{n.title || 'Untitled'}</Text>
            <Text style={s.noteBody}  numberOfLines={2}>{n.body  || 'Empty note'}</Text>
            <Text style={s.noteDate}>{n.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: theme.bg },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1e1b4b', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.border },
  headerIcon:   { fontSize: 22 },
  headerTitle:  { fontSize: 18, fontWeight: '700', color: theme.yellow },
  headerSub:    { fontSize: 11, color: theme.muted },
  addBtn:       { backgroundColor: theme.accent, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  addBtnText:   { color: '#fff', fontWeight: '700', fontSize: 13 },
  body:         { flex: 1, padding: 16 },
  noteCard:     { backgroundColor: theme.card, borderRadius: 14, padding: 14, marginBottom: 10, borderLeftWidth: 4, borderWidth: 1, borderColor: theme.border },
  noteTitle:    { fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 4 },
  noteBody:     { fontSize: 13, color: theme.muted, marginBottom: 8, lineHeight: 18 },
  noteDate:     { fontSize: 11, color: theme.border },
  empty:        { alignItems: 'center', marginTop: 80 },
  emptyIcon:    { fontSize: 48, marginBottom: 12 },
  emptyText:    { color: theme.muted, fontSize: 14 },
  // Edit
  editHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 2, backgroundColor: theme.surface },
  editAction:   { fontSize: 14, fontWeight: '700' },
  colorPicker:  { flexDirection: 'row', gap: 8 },
  colorDot:     { width: 22, height: 22, borderRadius: 11 },
  editBody:     { flex: 1, padding: 16 },
  titleInput:   { fontSize: 22, fontWeight: '700', color: theme.text, borderBottomWidth: 2, marginBottom: 16, paddingBottom: 8 },
  bodyInput:    { fontSize: 15, color: theme.text, lineHeight: 24, minHeight: 200 },
  saveBar:      { padding: 16, paddingBottom: Platform.OS === 'ios' ? 0 : 16 },
  saveBtn:      { borderRadius: 12, padding: 15, alignItems: 'center' },
  saveBtnText:  { color: '#fff', fontWeight: '700', fontSize: 16 },
});