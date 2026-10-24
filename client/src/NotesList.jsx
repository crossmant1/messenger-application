export default function NotesList({ notes }) {
  if (notes.length === 0) {
    return <p>No notes yet. Add the first one.</p>;
  }
  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>{note.text}</li>
      ))}
    </ul>
  );
}