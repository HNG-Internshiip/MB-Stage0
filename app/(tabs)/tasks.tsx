import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────
type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  note: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
}

type Filter = 'All' | 'Active' | 'Completed';

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = '@sut_tasks';
const FILTERS: Filter[] = ['All', 'Active', 'Completed'];
const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
  low:    { label: 'Low',    color: theme.success },
  medium: { label: 'Medium', color: theme.accent3 },
  high:   { label: 'High',   color: theme.error   },
};

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ─── PriorityChip ─────────────────────────────────────────────────────────────
function PriorityChip({ value, selected, onPress }: { value: Priority; selected: boolean; onPress: () => void }) {
  const { label, color } = PRIORITY_META[value];
  return (
    <TouchableOpacity
      style={[s.chip, selected && { borderColor: color, backgroundColor: `${color}22` }]}
      onPress={onPress}
    >
      <View style={[s.chipDot, { backgroundColor: color }]} />
      <Text style={[s.chipText, selected && { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────
function TaskCard({ task, onToggle, onEdit, onDelete }: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { color } = PRIORITY_META[task.priority];
  return (
    <View style={[s.taskCard, { borderLeftColor: color }, task.completed && s.taskCardDone]}>
      <View style={s.taskTop}>
        {/* Checkbox */}
        <TouchableOpacity
          style={[s.checkbox, task.completed && { backgroundColor: theme.success, borderColor: theme.success }]}
          onPress={onToggle}
        >
          {task.completed && <Text style={s.checkmark}>✓</Text>}
        </TouchableOpacity>

        {/* Text */}
        <View style={{ flex: 1 }}>
          <Text style={[s.taskTitle, task.completed && s.taskTitleDone]} numberOfLines={2}>
            {task.title}
          </Text>
          {!!task.note && (
            <Text style={s.taskNote} numberOfLines={2}>{task.note}</Text>
          )}
        </View>

        {/* Edit / Delete */}
        <View style={s.taskActions}>
          <TouchableOpacity
            style={[s.iconBtn, task.completed && s.iconBtnDisabled]}
            onPress={onEdit}
            disabled={task.completed}
          >
            <Text style={[s.iconBtnText, task.completed && { opacity: 0.3 }]}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} onPress={onDelete}>
            <Text style={s.iconBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={s.taskFooter}>
        <View style={[s.priorityBadge, { backgroundColor: `${color}22` }]}>
          <View style={[s.chipDot, { backgroundColor: color }]} />
          <Text style={[s.priorityBadgeText, { color }]}>{PRIORITY_META[task.priority].label}</Text>
        </View>
        <Text style={s.taskDate}>{new Date(task.createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );
}

// ─── TaskForm (bottom sheet) ──────────────────────────────────────────────────
function TaskForm({ initial, onSave, onCancel }: {
  initial?: Task;
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle]       = useState(initial?.title ?? '');
  const [note, setNote]         = useState(initial?.note ?? '');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium');

  const submit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), note: note.trim(), priority });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.formOverlay}
    >
      {/* Backdrop */}
      <TouchableOpacity style={s.formBackdrop} onPress={onCancel} activeOpacity={1} />

      <View style={s.formSheet}>
        <View style={s.formHandle} />
        <Text style={s.formTitle}>{initial ? 'Edit Task' : 'New Task'}</Text>

        <Text style={s.label}>TITLE</Text>
        <TextInput
          style={s.input}
          placeholder="What needs to be done?"
          placeholderTextColor={theme.muted}
          value={title}
          onChangeText={setTitle}
          autoFocus
          maxLength={120}
        />

        <Text style={s.label}>NOTE (optional)</Text>
        <TextInput
          style={[s.input, { minHeight: 72, textAlignVertical: 'top' }]}
          placeholder="Add a note…"
          placeholderTextColor={theme.muted}
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={300}
        />

        <Text style={s.label}>PRIORITY</Text>
        <View style={s.chipRow}>
          {PRIORITIES.map(p => (
            <PriorityChip key={p} value={p} selected={priority === p} onPress={() => setPriority(p)} />
          ))}
        </View>

        <View style={s.formBtns}>
          <TouchableOpacity style={[s.formBtn, s.formBtnCancel]} onPress={onCancel}>
            <Text style={[s.formBtnText, { color: theme.muted }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.formBtn, { backgroundColor: theme.accent, opacity: title.trim() ? 1 : 0.4 }]}
            onPress={submit}
          >
            <Text style={s.formBtnText}>{initial ? 'Save Changes' : 'Add Task'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function TasksScreen() {
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<Filter>('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Task | undefined>();

  // ── Load from storage on mount ───────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setTasks(JSON.parse(raw));
      } catch (e) {
        console.error('Storage read error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Persist to storage on every change ──────────────────────────────────
  const persist = useCallback(async (data: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }, []);

  useEffect(() => {
    if (!loading) persist(tasks);
  }, [tasks, loading, persist]);

  // ── CREATE ───────────────────────────────────────────────────────────────
  const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = { ...data, id: uid(), completed: false, createdAt: Date.now() };
    setTasks(prev => [newTask, ...prev]);
    setShowForm(false);
  };

  // ── UPDATE ───────────────────────────────────────────────────────────────
  const updateTask = (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    if (!editing) return;
    setTasks(prev => prev.map(t => t.id === editing.id ? { ...t, ...data } : t));
    setEditing(undefined);
  };

  // ── TOGGLE COMPLETE ──────────────────────────────────────────────────────
  const toggleTask = (id: string) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  // ── DELETE ───────────────────────────────────────────────────────────────
  const deleteTask = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setTasks(prev => prev.filter(t => t.id !== id)) },
    ]);
  };

  // ── CLEAR COMPLETED ──────────────────────────────────────────────────────
  const clearCompleted = () => {
    Alert.alert('Clear Completed', 'Remove all completed tasks?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setTasks(prev => prev.filter(t => !t.completed)) },
    ]);
  };

  // ── Open edit form ───────────────────────────────────────────────────────
  const openEdit = (task: Task) => {
    setShowForm(false);   // close add form if open
    setEditing(task);
  };

  // ── Derived state ────────────────────────────────────────────────────────
  const filtered = tasks.filter(t =>
    filter === 'All' ? true : filter === 'Active' ? !t.completed : t.completed
  );
  const doneCount  = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress   = totalCount ? doneCount / totalCount : 0;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>✅ Task Manager</Text>
          <Text style={s.headerSub}>{doneCount}/{totalCount} completed</Text>
        </View>
        {doneCount > 0 && (
          <TouchableOpacity style={s.clearBtn} onPress={clearCompleted}>
            <Text style={s.clearBtnText}>Clear done</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Progress bar */}
      {totalCount > 0 && (
        <View style={s.progressWrap}>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={s.progressPct}>{Math.round(progress * 100)}%</Text>
        </View>
      )}

      {/* Filter tabs */}
      <View style={s.filterRow}>
        {FILTERS.map(f => {
          const count = f === 'Active' ? tasks.filter(t => !t.completed).length : f === 'Completed' ? doneCount : null;
          return (
            <TouchableOpacity key={f} style={[s.filterBtn, filter === f && s.filterBtnActive]} onPress={() => setFilter(f)}>
              <Text style={[s.filterText, filter === f && s.filterTextActive]}>
                {f}{count ? ` (${count})` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Task list */}
      {loading ? (
        <View style={s.center}><ActivityIndicator color={theme.accent} size="large" /></View>
      ) : (
        <ScrollView style={s.body} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 && (
            <View style={s.empty}>
              <Text style={s.emptyIcon}>{filter === 'Completed' ? '🎉' : '📋'}</Text>
              <Text style={s.emptyText}>
                {filter === 'Completed'
                  ? 'No completed tasks yet.'
                  : filter === 'Active'
                  ? 'No active tasks. Add one below!'
                  : 'No tasks yet. Tap + to get started!'}
              </Text>
            </View>
          )}
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onEdit={() => openEdit(task)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </ScrollView>
      )}

      {/* FAB — Add new task */}
      <TouchableOpacity
        style={s.fab}
        onPress={() => { setEditing(undefined); setShowForm(true); }}
        activeOpacity={0.85}
      >
        <Text style={s.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Add / Edit bottom sheet */}
      {(showForm || !!editing) && (
        <TaskForm
          initial={editing}
          onSave={editing ? updateTask : addTask}
          onCancel={() => { setShowForm(false); setEditing(undefined); }}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: theme.bg },
  header:            { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1b4b', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.border },
  headerTitle:       { fontSize: 18, fontWeight: '700', color: theme.accent },
  headerSub:         { fontSize: 11, color: theme.muted, marginTop: 1 },
  clearBtn:          { backgroundColor: `${theme.error}22`, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: `${theme.error}44` },
  clearBtnText:      { color: theme.error, fontSize: 12, fontWeight: '600' },
  progressWrap:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, gap: 10, backgroundColor: theme.surface, borderBottomWidth: 1, borderBottomColor: theme.border },
  progressBg:        { flex: 1, height: 6, backgroundColor: theme.border, borderRadius: 4, overflow: 'hidden' },
  progressFill:      { height: '100%', backgroundColor: theme.success, borderRadius: 4 },
  progressPct:       { fontSize: 12, fontWeight: '700', color: theme.success, width: 36, textAlign: 'right' },
  filterRow:         { flexDirection: 'row', backgroundColor: theme.surface, borderBottomWidth: 1, borderBottomColor: theme.border },
  filterBtn:         { flex: 1, paddingVertical: 11, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  filterBtnActive:   { borderBottomColor: theme.accent },
  filterText:        { fontSize: 12, fontWeight: '600', color: theme.muted },
  filterTextActive:  { color: theme.accent },
  body:              { flex: 1, padding: 14 },
  center:            { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty:             { alignItems: 'center', paddingTop: 80 },
  emptyIcon:         { fontSize: 48, marginBottom: 12 },
  emptyText:         { color: theme.muted, fontSize: 14, textAlign: 'center' },
  // Task card
  taskCard:          { backgroundColor: theme.card, borderRadius: 14, padding: 14, marginBottom: 10, borderLeftWidth: 4, borderWidth: 1, borderColor: theme.border },
  taskCardDone:      { opacity: 0.6 },
  taskTop:           { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkbox:          { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: theme.muted, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
  checkmark:         { color: '#fff', fontSize: 13, fontWeight: '800' },
  taskTitle:         { fontSize: 15, fontWeight: '600', color: theme.text, lineHeight: 22 },
  taskTitleDone:     { textDecorationLine: 'line-through', color: theme.muted },
  taskNote:          { fontSize: 12, color: theme.muted, marginTop: 3, lineHeight: 18 },
  taskActions:       { flexDirection: 'row', gap: 2, flexShrink: 0 },
  iconBtn:           { padding: 6 },
  iconBtnDisabled:   { pointerEvents: 'none' },
  iconBtnText:       { fontSize: 16 },
  taskFooter:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: theme.border },
  priorityBadge:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  priorityBadgeText: { fontSize: 11, fontWeight: '700' },
  taskDate:          { fontSize: 11, color: theme.muted },
  // FAB
  fab:               { position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center', shadowColor: theme.accent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 10, elevation: 8 },
  fabText:           { color: '#fff', fontSize: 30, fontWeight: '300', lineHeight: 36 },
  // Form bottom sheet
  formOverlay:       { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', zIndex: 99 },
  formBackdrop:      { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  formSheet:         { backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 28, borderWidth: 1, borderColor: theme.border },
  formHandle:        { width: 40, height: 4, backgroundColor: theme.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  formTitle:         { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 16 },
  label:             { fontSize: 11, color: theme.muted, fontWeight: '600', marginBottom: 6, letterSpacing: 0.5 },
  input:             { backgroundColor: theme.surface, borderRadius: 10, padding: 12, color: theme.text, fontSize: 15, borderWidth: 1, borderColor: theme.border, marginBottom: 14 },
  chipRow:           { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip:              { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.border },
  chipDot:           { width: 8, height: 8, borderRadius: 4 },
  chipText:          { fontSize: 13, fontWeight: '600', color: theme.muted },
  formBtns:          { flexDirection: 'row', gap: 10 },
  formBtn:           { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  formBtnCancel:     { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border },
  formBtnText:       { color: '#fff', fontWeight: '700', fontSize: 15 },
});