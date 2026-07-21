function TranslationForm({
    text,
    context,
    isOutputPractice,
    onTextChange,
    onContextChange,
    onModeChange,
    onSubmit,
}) {
    return (
        <form method="POST" onSubmit={onSubmit} className="sentence-form">
            <label>
                Japanese Text:
                <input
                    type="text"
                    value={text}
                    onChange={(event) => onTextChange(event.target.value)}
                    placeholder="Input Japanese Text..."
                    className="text_input"
                />
            </label>
            <label>
                Sentence Context:
                <input
                    type="text"
                    value={context}
                    onChange={(event) => onContextChange(event.target.value)}
                    placeholder="Where or how is this sentence being used?"
                    className="context_input"
                />
            </label>
            <label>
                Mode:
                <select
                    value={isOutputPractice ? 'output' : 'translation'}
                    onChange={(event) => onModeChange(event.target.value === 'output')}
                    className="practice_select"
                >
                    <option value="translation">Translation</option>
                    <option value="output">Output Practice</option>
                </select>
            </label>
            <button type="submit" className="button">Submit</button>
        </form>
    )
}

export default TranslationForm
