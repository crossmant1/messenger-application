export default function BoardList({ boards, selectedId, onSelect }) {
  if (boards.length === 0) {
    return <p>No shared boards yet. Create one using the 04F API.</p>;
  }
  return (
    <nav aria-label="Your study boards">
      <h2>Your boards</h2>
      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <button type="button" aria-current={selectedId === board.id ? 'page' : undefined}
              onClick={() => onSelect(board.id)}>{board.title}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}