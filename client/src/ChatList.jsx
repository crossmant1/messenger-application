export default function ChatList({ chats, selectedId, onSelect }) {
  return (
    <nav className="chat-list" aria-label="Your chats">
      <h2>Chats</h2>
      {chats.length === 0 ? <p>No chats yet.</p> : (
        <ul>
          {chats.map(chat => (
            <li key={chat.id}>
              <button type="button" aria-current={selectedId === chat.id ? 'page' : undefined}
                onClick={() => onSelect(chat.id)}>{chat.username}</button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
