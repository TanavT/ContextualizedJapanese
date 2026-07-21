import ReactMarkdown from 'react-markdown'

function TranslationExplanation({explanation}) {
    const explanationText = explanation?.[0]?.text
    if (!explanationText) return null

    return (
        <>
            <h3>Explanation</h3>
            <ReactMarkdown>{explanationText}</ReactMarkdown>
        </>
    )
}

export default TranslationExplanation
