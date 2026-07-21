function TranslationDictionary({dictionary}) {
    if (!dictionary) return null

    return (
        <div className="translation-wrapper-dictionary">
            <dl>
                {dictionary.map((word, wordIndex) => (
                    <div key={wordIndex}>
                        <dt>{word.map((morpheme) => morpheme.morpheme).join('')}</dt>
                        <dd>
                            {word.map((morpheme, morphemeIndex) => (
                                <dl className="morpheme-card" key={morphemeIndex}>
                                    <dt>Morpheme:</dt>
                                    <dd>{morpheme.morpheme}</dd>

                                    <dt>Root</dt>
                                    <dd>{morpheme.dictionary}</dd>

                                    <dt>Pronunciation</dt>
                                    <dd>{morpheme.pronunciation}</dd>

                                    <a href={morpheme.jisho_link}>Jisho Link</a>
                                </dl>
                            ))}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}

export default TranslationDictionary
